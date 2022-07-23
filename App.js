import React, {useState,} from 'react';

//screens

import RootStack from './navigators/RootStack';

import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from './components/CredentialsContext';
import Verification from './screens/LinkVerification';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications
  const [appReady,setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  const checkLoginCredentials = ()=>{
    AsyncStorage.getItem('sweatcheckCredentials')
    .then((result)=>{
      if(result !==null){
        setStoredCredentials(JSON.parse(result));
      }else{
        setStoredCredentials(null);
      }
    })
    .catch(error=> console.log(error))
  }
  if(!appReady){
    return( 
    <AppLoading
      startAsync={checkLoginCredentials}
      onFinish={()=> setAppReady(true)}
      onError={console.warn}
    />)
  }
  return (
  <CredentialsContext.Provider value = {{storedCredentials,setStoredCredentials}}>
    <RootStack/>
  </CredentialsContext.Provider>
  );
  return <Verification/>
  
}

