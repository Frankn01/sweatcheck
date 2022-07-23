import React,{useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyledContainer, TopHalf, BottomHalf , IconBg, Colors, PageTitle, InfoText, StyledButton, ButtonText, InlineGroup, TextLinkContent,TextLink,EmphasizeText} from '../components/styles';
import {Octicons, Ionicons} from '@expo/vector-icons';
import {View} from 'react-native';
import ResendTimer from '../components/ResendTimer';
import axios from 'axios';
import { baseAPIUrl } from '../components/shared';

const {brand,primary} = Colors;
const PasswordReset = ({navigation,route})=>{


    const [resendingEmail,setResendingEmail] = useState(false);
    const [resendingStatus, setResendingStatus] = useState('Resend');
    const [timeLeft,setTimeLeft] = useState(null);
    const[targetTime,setTargetTime] = useState(null);
    const [activeResend, setActiveResend] = useState(false);
 
    

    const {email,_id} = route?.params;
    const userId = _id;
   



    return <StyledContainer
            style={{
                alignItems: 'center',
            }}
        >
            <TopHalf>
                <IconBg>
                    <StatusBar style = "dark"/>
                    <Octicons name="mail" size={125} color={brand} />
                </IconBg>
            </TopHalf>
            <BottomHalf>
                <InfoText>
                    Please reset your password by using the link sent to <EmphasizeText>{`${email}`}</EmphasizeText>.
                </InfoText>
                <StyledButton onPress={()=> navigation.navigate('Login')}>
                    <ButtonText>Proceed</ButtonText>
                    <Ionicons name = "arrow-forward-circle" size={25} color={primary}/>
                </StyledButton>
                
            </BottomHalf>
        </StyledContainer>;
    
};

export default PasswordReset;