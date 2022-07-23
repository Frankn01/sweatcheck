import React,{useState,useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import{View, ActivityIndicator} from 'react-native';
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
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import {Octicons,Ionicons, Fontisto} from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from './../components/CredentialsContext';
import {baseAPIUrl} from '../components/shared';


const{brand,darkLight,primary} = Colors;
const Signup = ({navigation}) =>{
    const [hidePassword,setHidePassword] = useState(true);
    const [message, setMessage]=useState();
    const [messageType,setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleSignup = (credentials, setSubmitting)=>{
        handleMessage(null);
        const url= `${baseAPIUrl}/api/user/signup`;
        
        axios
            .post(url,credentials)
            .then((response)=>{
                const result = response.data;
                const {message,status,data}=result;

                if(status !== 'PENDING'){
                    handleMessage(message,status);
                    
                }else{
               
                    navigation.navigate('Verification',{...data});
                    //persistLogin({...data}, message,status);
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
               
                <PageTitle>Sweat Check</PageTitle>
                <Subtitle>Signup for your Sweat Check</Subtitle>
                <Formik
                    initialValues={{firstName: '', lastName: '',email: '', login:'',password: '', confirmPassword:''}}
                    onSubmit={(values, {setSubmitting})=>{
                        if(values.login =='' || values.password=='' || values.firstName =='' || values.lastName=='' || values.email =='' || values.confirmPassword==''){
                            handleMessage('Please fill all the fields');
                            setSubmitting(false);
                        }else if(values.password != values.confirmPassword){
                            handleMessage('Passwords do not match');
                            setSubmitting(false);
                        }else{
                            handleSignup(values,setSubmitting);
                        }
                    }}
                >{({handleChange, handleBlur, handleSubmit,values,isSubmitting})=>(
                    <StyledFormArea>
                        <MyTextInput 
                        label="First Name"
                        icon ="typography"
                        placeholder= "John"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('firstName')}
                        onBlur = {handleBlur('firstName')}
                        value = {values.firstName}

                        />
                        <MyTextInput 
                        label="Last Name"
                        icon ="typography"
                        placeholder= "Doe"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('lastName')}
                        onBlur = {handleBlur('lastName')}
                        value = {values.lastName}

                        />

                        <MyTextInput 
                        label="Email Address"
                        icon ="mail"
                        placeholder= "johnd@gmail.com"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('email')}
                        onBlur = {handleBlur('email')}
                        value = {values.email}
                        keyboardType= "email-address"

                        />

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
                        placeholder= "* * * * * * *"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('password')}
                        onBlur = {handleBlur('password')}
                        value = {values.password}
                        secureTextEntry = {hidePassword}
                        isPassword = {true}
                        hidePassword = {hidePassword}
                        setHidePassword={setHidePassword}
                        />

                        <MyTextInput 
                        label="Confirm Password"
                        icon ="lock"
                        placeholder= "* * * * * * *"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('confirmPassword')}
                        onBlur = {handleBlur('confirmPassword')}
                        value = {values.confirmPassword}
                        secureTextEntry = {hidePassword}
                        isPassword = {true}
                        hidePassword = {hidePassword}
                        setHidePassword={setHidePassword}
                        />
                     
                        <MsgBox type={messageType}>{message}</MsgBox>
                        {!isSubmitting &&
                            (<StyledButton onPress = {handleSubmit}>
                            <ButtonText>
                                Signup
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
                            <ExtraText>Already have an account? </ExtraText>
                            <TextLink onPress={()=> navigation.navigate("Login")}>
                                <TextLinkContent>Login</TextLinkContent>
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
export default Signup;