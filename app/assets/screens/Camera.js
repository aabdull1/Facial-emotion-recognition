import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as tf from '@tensorflow/tfjs';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';

const CameraScreen=()=> {
  const [type, setType] = useState(CameraType.front);
  const [faceData, setFaceData] = useState([]);
  // Bounding box
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef();
  const [emotionPredictor, setEmotionPredictor] = useState("");
  const [emotion, setEmotion] = useState("");
  
  //const imageCapture = async () => {
  //  const imageData = await cameraRef.current.takePictureAsync({base64: true})
  //}

  useEffect(() => {
    async function loadModel(){
      console.log("[+] Starting application");
      const tfReady = await tf.ready();
      console.log("[+] Loading trained model");
      const modelJson = await require('../model/emotion.json');
      const modelWeights = await require('../model/emotion_weights.bin');
      const emotionPredictor = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      console.log("[+] Model loading complete")
      setEmotionPredictor(emotionPredictor);
    };
    loadModel();
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function getFaceDataView() {
    if(faceData.length===0){
      return(<View></View>)
    } else {
      return(
        <View style={{
            position: 'absolute',
            top: y,
            left: x,
            width: width,
            height: height,
            borderColor: "red",
            borderWidth: 2
          }}
          >
        </View>
      )
    }
  }

  const getEmotion = async (inputTensor) => {
        let result = await emotionPredictor.predict(inputTensor).data()
        return result.indexOf(Math.max(...result))
      }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    //const [origin, size] = faces.bounds
    if(faceData.length===0 || faces[0]===undefined){
      console.log("No faces found")
    } else {
      const face = faces[0]
      const {origin, size} = faces[0].bounds
      let x = origin.x
      let y = origin.y
      let h = size.height
      let w = size.width
      setX(x)
      setY(y)
      setWidth(w)
      setHeight(h)
      
      // Transformation for ML model
      let normFactor = (w + h)/2

      function normX(xIn){
        return((xIn - x)/w)
      }

      function normY(yIn){
        return((yIn - y)/h)
      }

      let rightEyeX = normX(face.RIGHT_EYE.x)
      let rightEyeY = normY(face.RIGHT_EYE.y)
      let leftEyeX = normX(face.LEFT_EYE.x)
      let leftEyeY = normY(face.LEFT_EYE.y)
      let noseCenterX = normX(face.NOSE_BASE.x)
      let noseCenterY = normY(face.NOSE_BASE.y)
      let mouthCenterX = normX(face.BOTTOM_MOUTH.x)
      let mouthCenterY = normY(face.BOTTOM_MOUTH.y)
      let mouthRightX = normX(face.RIGHT_MOUTH.x)
      let mouthRightY = normY(face.RIGHT_MOUTH.y)
      let mouthLeftX = normX(face.LEFT_MOUTH.x)
      let mouthLeftY = normY(face.LEFT_MOUTH.y)
        
      let inputTensor = tf.tensor([
          rightEyeX, rightEyeY, 
          leftEyeX, leftEyeY, 
          noseCenterX, noseCenterY,
          mouthCenterX, mouthCenterY,
          mouthRightX, mouthRightY,
          mouthLeftX, mouthLeftY
        ], [1, 12])
        
      getEmotion(inputTensor)
        .then(data => {
          if(data == 0)
            setEmotion("Happy")
          else if(data == 1)
            setEmotion("Neutral")
          else
            setEmotion("Sad")
        })

    }
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef} 
        style={styles.camera} 
        type={type}
        pictureSize={"320x240"}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true
          }}
        >
        {getFaceDataView()}
      </Camera>
      <Text style={styles.emotion}> Detected emotion: {emotion} </Text>
      <Button title="Flip Camera" onPress={toggleCameraType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    height: '75%',
    position: 'relative' 
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  emotion: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10
  }
});
export default CameraScreen;