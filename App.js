import * as React from 'react';
import {Button, DrawerLayoutAndroidComponent, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CameraScreen from './app/assets/Screen/camera';



const myApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 25 }}> Welcome to our </Text>
      <Text style={{ fontSize: 30, textAlign: 'center' }}> Face Emotion Detection</Text>
      <Text style={{ fontSize: 25 }}> App! </Text>
      <Button
        title="Go to Camera->"
        color="#808080" />

    </View>
    
  );
};
const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome to Face Emotion Detection App!', textAlign: "center", alignItems: "center"}}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const HomeScreen = ({navigation}) => {
  return (
    <Button
      title="Go to Camera->"
      onPress={() =>
        navigation.navigate('CameraS')
      }
    />
  );
};
const CameraS = ({navigation}) => {
  return (
    <CameraScreen />
  );
};


export default MyStack;