# Android App for Facial Emotion Recognition

In this project, we have developed an Android App for detection facial emotions. The app is capable of detecting one of three emotions (Happy, Sad, Neutral).

The Android app's frontend is developed with React Native. The neural network model that predicts the emotion is designed with TensorFlow.

# Running the App

## Requirements

1. Node JS version 16 is required. The easiest way to setup version 16 is using node version manager (https://github.com/nvm-sh/nvm)

```
nvm install 16
nvm use 16
node -v
```

2. Expo CLI

## Setup
1. Clone this repository
2. `cd` into this directory
3. Install Expo CLI

```
npm expo install
```
4. Start expo client
```
npm expo start
```
The terminal prints a QR code.
5. On your android device, install the Expo Go client from the Google Play Store. After installation, open the app and scan the QR code.
6. If everything goes well, the app should be loaded.
