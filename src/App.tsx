/**
 * Very basic react demo of how to use the HeyGen Streaming Avatar SDK
 */
import { useEffect, useRef, useState } from 'react';
import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar';
import './App.css';

function App() {
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const avatar = useRef<StreamingAvatarApi | null>(null);

  const [text, setText] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [voiceId, setVoiceId] = useState<string>("");

  const [data, setData] = useState<NewSessionData>();
  const mediaStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {

    const startTalkCallback = (e: any) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e: any) => {
      console.log("Avatar stopped talking", e);
    };

    if (!avatar.current) {
      avatar.current = new StreamingAvatarApi(
        new Configuration({ accessToken: 'ACCESS_TOKEN' })
      );
      avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
      avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);
    }

    return () => {
      if (avatar.current) {
        avatar.current.removeEventHandler("avatar_start_talking", startTalkCallback);
        avatar.current.removeEventHandler("avatar_stop_talking", stopTalkCallback);
      }
    };
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  async function grab() {
    try {
      const res = await avatar.current!.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatarId,
            voice: { voiceId: voiceId }
          }
        },
        setDebug
      );
      setData(res);
      setStream(avatar.current!.mediaStream);
    } catch (error) {

    }
  };

  async function stop() {
    await avatar.current?.stopAvatar({ stopSessionRequest: { sessionId: data?.sessionId } }, setDebug);
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [stream]);

  async function handleSpeak() {
    await avatar.current?.speak({ taskRequest: { text: text, sessionId: data?.sessionId } }).catch((e) => {
      setDebug(e.message);
    });
  }

  return (
    <div className="HeyGenStreamingAvatar">
      <header className="App-header">
        <p>{debug}</p>
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
          <button onClick={handleSpeak}>Speak</button>
          <button onClick={grab}>Start</button>
          <button onClick={stop}>Stop</button>
        </div>
        <div className="MediaPlayer">
          <video playsInline autoPlay width={500} ref={mediaStream}></video>
        </div>
      </header>
    </div>
  );
}

export default App;
