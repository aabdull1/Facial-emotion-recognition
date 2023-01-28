import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

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
  
  //const imageCapture = async () => {
  //  const imageData = await cameraRef.current.takePictureAsync({base64: true})
  //}

/*  useEffect(() => {
    const interval = setInterval(
      () => {
        cameraRef.current.takePictureAsync({base64: false, scale: 0.5, exif: false})
        .then( data => {imgURI = data.uri})
        .then( () => {console.log(imgURI)})
      }, 5000);
    return () => clearInterval(interval);
  }, []);*/

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



  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    //const [origin, size] = faces.bounds
    if(faceData.length===0 || faces[0]===undefined){
      console.log("No faces found")
    } else {
      const {origin, size} = faces[0].bounds
      setX(origin.x);
      setY(origin.y);
      setWidth(size.width)
      setHeight(size.height)
      cameraRef.current.takePictureAsync({base64: true, exif: false, quality: 0, skipProcessing: false})
        .then( data => {img = data.base64})
        .then( () => {console.log(img)}) 
      /*cameraRef.current.getAvailablePictureSizesAsync('4:3')
        .then( data => console.log(data))*/
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
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 1500,
          }}
        >
      {getFaceDataView()}
      </Camera>
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
  faces:{
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
});
export default CameraScreen;