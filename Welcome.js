import React,{useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import{View} from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import{
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    Subtitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    Colors,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    WelcomeContainer,
    WelcomeImage,
    Avatar,
    CurrentWorkouts,
    StyledContainerApp,
    WorkoutListContainer
}from './../components/styles';

import {Octicons,Ionicons, Fontisto} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';
import axios from 'axios';
import {baseAPIUrl} from '../components/shared';
import GetWorkouts from '../components/GetWorkouts';
const{brand,darkLight,primary} = Colors;


const Welcome = ({navigation}) =>{
    const [hidePassword,setHidePassword] = useState(true);
    
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const{firstName, lastName, login} = storedCredentials;

    const clearLogin=()=>{
        AsyncStorage.removeItem('sweatcheckCredentials')
        .then(()=>{
            setStoredCredentials("");
        })
        .catch(error => console.log(error))
    }

    return (
        <GetWorkouts/>    
    );
}


export default Welcome;