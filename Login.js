import React,{useState, useEffect, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import {Formik} from 'formik';
import{View,ActivityIndicator, Platform} from 'react-native';
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
    TextLinkContent
}from './../components/styles';

import {Octicons,Ionicons, Fontisto} from '@expo/vector-icons';
const{brand,darkLight,primary,green,gray} = Colors;
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { baseAPIUrl } from '../components/shared';

//google sign in
import * as GoogleSignIn from 'expo-google-sign-in';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from './../components/CredentialsContext';



const Login = ({navigation,route}) =>{
    const [hidePassword,setHidePassword] = useState(true);
    const [message, setMessage]=useState();
    const [messageType,setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const handleLogin = (credentials, setSubmitting)=>{
        handleMessage(null);
        const url= baseAPIUrl+ '/api/user/signin';

        axios
            .post(url,credentials)
            .then((response)=>{
                const {message,status,data:data}= response.data;
                if(status !== 'SUCCESS'){
                    handleMessage(message,status);
                }else{
                    persistLogin({...data[0],...data} ,message,status);     // send the data in the stored credentials, holds token
                }
                setSubmitting(false);
            })
            .catch((error)=>{
            console.log(error);
            setSubmitting(false);
            handleMessage('An error occurred. Check your network and try again');
        });
    };

    const handleMessage = (message,type='FAILED')=>{
        setMessage(message);
        setMessageType(type);
    };


    const persistLogin=(credentials,message,status)=>{
        AsyncStorage.setItem('sweatcheckCredentials',JSON.stringify(credentials))
        .then(()=>{
            handleMessage(message,status);
            setStoredCredentials(credentials);
        })
        .catch((error)=>{
            console.log(error);
            handleMessage('Persisting login failed');
        })
    }
    
    return (
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style = "dark"/>
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/logo.png')} />
                <PageTitle>Sweat Check</PageTitle>
                <Subtitle>The ultimate fitness tool!</Subtitle>
                <Formik
                    initialValues={{login:'', password: ''}}
                    onSubmit={(values,{setSubmitting})=>{
                        if(values.login =='' || values.password==''){
                            handleMessage('Please fill all the fields');
                            setSubmitting(false);
                        }else{
                            handleLogin(values,setSubmitting);
                        }
                        
                    }}
                >{({handleChange, handleBlur, handleSubmit,values,isSubmitting})=>(
                    <StyledFormArea>
                        <MyTextInput 
                        label="Username"
                        icon ="person"
                        placeholder= "johndoe123"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('login')}
                        onBlur = {handleBlur('login')}
                        value = {values.login}

                        />
                        <MyTextInput 
                        label="Password"
                        icon ="lock"
                        placeholder= "*******"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('password')}
                        onBlur = {handleBlur('password')}
                        value = {values.password}
                        secureTextEntry = {hidePassword}
                        isPassword = {true}
                        hidePassword = {hidePassword}
                        setHidePassword={setHidePassword}
                        />
                        <MsgBox type={messageType}>{message}</MsgBox>
                        {!isSubmitting &&
                            (<StyledButton onPress = {handleSubmit}>
                            <ButtonText>
                                Login
                            </ButtonText>
                        </StyledButton>
                        )}

                        {isSubmitting && (
                        <StyledButton disabled = {true}>
                            <ActivityIndicator size="large" color = {primary}/>
                        </StyledButton>
                        )}
                        
                        <Line/>
                       
                        <ExtraView>
                            <ExtraText>Don't have an account? </ExtraText>
                            <TextLink onPress={()=> navigation.navigate("Signup")}>
                                <TextLinkContent>Signup</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                        <ExtraView>
                        <ExtraText>Forgot your password? </ExtraText>
                            <TextLink onPress={()=> navigation.navigate("ForgotPassword")}>
                                <TextLinkContent>Click Here</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                    </StyledFormArea>
                )

                }

                </Formik>
            </InnerContainer>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label,icon,isPassword,hidePassword,setHidePassword,...props})=>{
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword &&(
                <RightIcon onPress = {()=> setHidePassword(!hidePassword)}>
                    <Ionicons name = {hidePassword ? 'md-eye-off' : 'md-eye'}size={30} color={darkLight}/>
                </RightIcon>
            )}
        </View>
    )
}
export default Login;