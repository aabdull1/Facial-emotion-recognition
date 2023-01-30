import React, {useEffect, useRef} from 'react';
import {Button, DrawerLayoutAndroidComponent, Text, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CameraScreen from './app/assets/screens/Camera';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{title: 'Emotion detector'}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to emotion recognition App</Text>
      <Button
        style={styles.button}
        title="Open Camera"
        onPress={() =>
          navigation.navigate('Camera')
        }
    />
    </View>
  );
};
const MainScreen = ({navigation}) => {
  return (
    <CameraScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    margin: 10,
  }
})

export default MyStack;
