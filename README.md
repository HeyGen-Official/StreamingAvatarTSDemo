# Getting Started with Create React App

This is a sample project and was bootstrapped using [Create React App](https://github.com/facebook/create-react-app)
Feel free to play around with the existing code and please leave any feedback for the SDK [here](https://github.com/HeyGen-Official/StreamingAvatarSDK/discussions).

## Available Scripts

Install the SDK and other dependencies with 

`npm install`

In the project directory, you can run:

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

`npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Getting Started FAQ

### Working with the demo

1. Clone this repo

```
git@github.com:HeyGen-Official/StreamingAvatarTSDemo.git
```

2. Replace `API_KEY` with your api key

```
  const avatar = useRef(new StreamingAvatarApi(
      new Configuration({apiKey: 'API_KEY'})
    ));

```

### How do I get an API Key?

Either an an API Key or Trial Token from HeyGen is required to run this Streaming API demo. API Keys are reserved for Enterprise customers, whereas both Creator and Teams plan users can activate and use a Trial token. You can retrieve either the API Key or Trial Token by logging in to HeyGen and navigating to this page in your settings: https://app.heygen.com/settings?nav=API

### Which Avatars can I use with this project?

By default, there are several Public Avatars that can be used in Streaming. (AKA Streaming Avatars.) You can find the Avatar IDs for these Public Avatars by navigating to app.heygen.com/streaming-avatar and clicking 'Select Avatar'.

In order to use a private Avatar created under your own account in Streaming, it must be upgraded to be a Streaming Avatar. Only 1. Finetune Instant Avatars and 2. Studio Avatars are able to be upgraded to Streaming Avatars. This upgrade is a one-time fee and can be purchased by navigating to app.heygen.com/streaming-avatar and clicking 'Select Avatar'.

Photo Avatars are not compatible with Streaming and cannot be used.

### Which voices can I use?

Most of HeyGen's AI Voices can be used with the Streaming API. To find the Voice IDs that you can use, please use the List Voices v2 endpoint from HeyGen: https://docs.heygen.com/reference/list-voices-v2
