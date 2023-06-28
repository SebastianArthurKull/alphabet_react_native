## Build App
https://docs.expo.dev/build/setup/

## Build APK over expo
`` eas build -p android --profile preview``

## Local Build
``npx expo prebuild -p android``

mkdir android/app/src/main/assets

``react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res``

``cd android``

``./gradlew assembleDebug``

## rest
I am creating release apk in react native using below commands. It works for me.

react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/


Windows
Permanent delete node_modules
npm cache clean –force
npm install
npm start -- --reset-cache

Open SDK -> Click on rebuild -> Fixed gradle build issue -> click on rebuild again -> generate signed apk.



https://medium.com/@adityasingh_32512/solved-unable-to-load-script-from-assets-index-android-bundle-bdc5e3a3d5ff