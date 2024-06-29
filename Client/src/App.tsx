import {useEffect, useRef, useState} from 'react';
import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar';
import './App.css';
import OpenAI from 'openai';
import {CanvasRender} from "./components/canvas-render";

//Enter your OpenAI key here
const openaiApiKey = ""

// Set up OpenAI w/ API Key
const openai = new OpenAI({
  apiKey: openaiApiKey, 
  dangerouslyAllowBrowser: true 
});

function App() {
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [text, setText] = useState<string>("");
  const [chatGPTText, setChatGPTText] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [voiceId, setVoiceId] = useState<string>("");
  const [data, setData] = useState<NewSessionData>();
  const [initialized, setInitialized] = useState(false); // Track initialization
  const [recording, setRecording] = useState(false); // Track recording state
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Store recorded audio
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatarApi | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [canPlay, setCanPlay] = useState(false)

  async function fetchAccessToken() {
    try {
      const response = await fetch('http://localhost:3001/get-access-token', {
        method: 'POST'
      });
      const result = await response.json();
      const token = result.token; // Access the token correctly
      console.log('Access Token:', token); // Log the token to verify
      return token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      return '';
    }
  }

  async function grab() {
    await updateToken();

    if (!avatar.current) {
      setDebug('Avatar API is not initialized');
      return;
    }

    try {
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatarId,
            voice: { voiceId: voiceId }
          }
        }, setDebug);
      setData(res);
      setStream(avatar.current.mediaStream);
    } catch (error) {
      console.error('Error starting avatar session:', error);
    }
  };

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log('Updating Access Token:', newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken })
    );

    const startTalkCallback = (e: any) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e: any) => {
      console.log("Avatar stopped talking", e);
    };

    console.log('Adding event handlers:', avatar.current);
    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);

    setInitialized(true);
  }

  async function stop() {
    if (!initialized || !avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    await avatar.current.stopAvatar({ stopSessionRequest: { sessionId: data?.sessionId } }, setDebug);
  }

  async function handleSpeak() {
    if (!initialized || !avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    await avatar.current.speak({ taskRequest: { text: text, sessionId: data?.sessionId } }).catch((e) => {
      setDebug(e.message);
    });
  }

  async function handleInterrupt() {
    if (!initialized || !avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    await avatar.current?.interrupt({ interruptRequest: { sessionId: data?.sessionId } }).catch((e) => {
      setDebug(e.message);
    });
  }

  async function handleChatGPT() {

    if (!chatGPTText) {
      setDebug('Please enter text to send to ChatGPT');
      return;
    }

    try {
      const response = await openai.chat.completions.create({  //Send the user input to ChatGPT
        model: "gpt-4o",
        messages: [{ role: "system", content: "You are a helpful assistant." },
                   { role: "user", content: chatGPTText }],
      });

      const chatGPTResponse = String(response.choices[0].message.content);
      console.log('ChatGPT Response:', chatGPTResponse);

      if (!initialized || !avatar.current) {
        setDebug('Avatar API not initialized');
        return;
      }

      //send the ChatGPT response to the Streaming Avatar
      await avatar.current.speak({ taskRequest: { text: chatGPTResponse, sessionId: data?.sessionId } }).catch((e) => {
        setDebug(e.message);
      });

    } catch (error) {
      console.error('Error communicating with ChatGPT:', error);
    }
  }

  useEffect(() => {
    async function init() {
      const newToken = await fetchAccessToken();
      console.log('Initializing with Access Token:', newToken); // Log token for debugging
      avatar.current = new StreamingAvatarApi(
        new Configuration({ accessToken: newToken, jitterBuffer: 200 })
      );
      setInitialized(true); // Set initialized to true
    };
    init();
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      }
    }
  }, [mediaStream, stream]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = event => {
          audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          audioChunks.current = [];
          transcribeAudio(audioBlob);
        };
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert Blob to File
      const audioFile = new File([audioBlob], "recording.wav", { type: 'audio/wav' });

      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile
      });
      const transcription = response.text;
      console.log('Transcription:', transcription);
      setChatGPTText(transcription);
      console.log(chatGPTText);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return (
    <div className="HeyGenStreamingAvatar">
      <header className="App-header">
        <p>
          {debug}
        </p>
        <div className="LabelPair">
          <label>Avatar ID </label>
          <input className="InputField2" placeholder='Avatar ID' value={avatarId} onChange={(v) => setAvatarId(v.target.value)} />
        </div>
        <div className="LabelPair">
          <label>Voice ID</label>
          <input className="InputField2" placeholder='Voice ID' value={voiceId} onChange={(v) => setVoiceId(v.target.value)} />
        </div>
        <div className="Actions">
          <input className="InputField" placeholder='Type something for the avatar to say' value={text} onChange={(v) => setText(v.target.value)} />
          <button onClick={grab}>Start</button>
          <button onClick={handleSpeak}>Speak</button>
          <button onClick={handleInterrupt}>Interrupt</button>
          <button onClick={stop}>Stop</button>
          
        </div>
        <div className="Actions">
          <input className="InputField" placeholder='Send text to ChatGPT' value={chatGPTText} onChange={(v) => setChatGPTText(v.target.value)} />
          <button onClick={handleChatGPT}>Talk to ChatGPT</button>
          <button onClick={recording ? stopRecording : startRecording}>
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
        <div className='MediaPlayer'>
          <video playsInline autoPlay width={300} ref={mediaStream} onCanPlay={() => {
            setCanPlay(true)
          }} />
          {canPlay && <CanvasRender videoRef={mediaStream} />}
        </div>
      </header>
    </div>
  );
}

export default App;
