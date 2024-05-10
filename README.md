# Getting Started with Create React App

This is a sample project and was bootstrapped using [Create React App](https://github.com/facebook/create-react-app)
Feel free to play around with the existing code and please leave any feedback for the SDK [here](https://github.com/HeyGen-Official/StreamingAvatarSDK/discussions).

## Available Scripts

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

### Installing the demo

1. Clone this repo
2. Replace `ACCESS_TOKEN` with your access token

```
  const avatar = useRef(new StreamingAvatarApi(
      new Configuration({apiKey: 'ACCESS_TOKEN'})
    ));

```

### How do I get an Access token Key?

To generate your access token you must first have access to your API key. API Keys are reserved for Enterprise customers. You can retrieve either the API Key or Trial Token by logging in to HeyGen and navigating to this page in your settings: https://app.heygen.com/settings?nav=API. Afterwards you can run the following to obtain your access token.

```
curl https://api.heygen.com/v1/streaming.create_token -H "x-api-key: <api-key>" -H "content-type: application/json" -d {}
{"error": null, "data": {"token": "<token>"}}
```

### Which Avatars can I use with this project?

By default, there are several Public Avatars that can be used in Streaming. (AKA Streaming Avatars.) You can find the Avatar IDs for these Public Avatars by navigating to [app.heygen.com/streaming-avatar](https://app.heygen.com/streaming-avatar) and clicking 'Select Avatar' and copying the avatar id.

In order to use a private Avatar created under your own account in Streaming, it must be upgraded to be a Streaming Avatar. Only 1. Finetune Instant Avatars and 2. Studio Avatars are able to be upgraded to Streaming Avatars. This upgrade is a one-time fee and can be purchased by navigating to app.heygen.com/streaming-avatar and clicking 'Select Avatar'.

Photo Avatars are not compatible with Streaming and cannot be used.

### Which voices can I use?

Most of HeyGen's AI Voices can be used with the Streaming API. To find the Voice IDs that you can use, please use the List Voices v2 endpoint from HeyGen: https://docs.heygen.com/reference/list-voices-v2
