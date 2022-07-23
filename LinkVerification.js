import React,{useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyledContainer, TopHalf, BottomHalf , IconBg, Colors, PageTitle, InfoText, StyledButton, ButtonText, InlineGroup, TextLinkContent,TextLink,EmphasizeText} from '../components/styles';
import {Octicons, Ionicons} from '@expo/vector-icons';
import {View} from 'react-native';
import ResendTimer from './../components/ResendTimer';
import axios from 'axios';
import { baseAPIUrl } from '../components/shared';

const {brand,primary} = Colors;
const Verification = ({navigation,route})=>{


    const [resendingEmail,setResendingEmail] = useState(false);
    const [resendingStatus, setResendingStatus] = useState('Resend');
    const [timeLeft,setTimeLeft] = useState(null);
    const[targetTime,setTargetTime] = useState(null);
    const [activeResend, setActiveResend] = useState(false);
    let resendTimerInterval;
    

    const {email,_id} = route?.params;
    const userId = _id;
    const calculateTimeLeft = (finalTime)=>{
        const difference = finalTime- +new Date();
        if(difference>=0){
            setTimeLeft(Math.round(difference/1000));
        }else{
            setTimeLeft(null);
            clearInterval(resendTimerInterval);
            setActiveResend(true);
        }
    };

    const triggerTimer = (targetTimeInSeconds = 30)=>{
        setTargetTime(targetTimeInSeconds);
        setActiveResend(false);
        const finalTime = +new Date() + targetTimeInSeconds*1000;
        resendTimerInterval = setInterval(()=>(
            calculateTimeLeft(finalTime),1000
        ));
    };

    useEffect(()=>{
        triggerTimer();
        return ()=>{
            clearInterval(resendTimerInterval);
        };
    }, []);

    const resendEmail = async ()=>{
        setResendingEmail(true);
        const url = `${baseAPIUrl}/api/user/resendVerificationLink`;
        try{
            console.log(userId);
            await axios.post(url, {email,userId});
            setResendingStatus('Sent!');
        }catch(error){
            setResendingStatus('Failed!');
            alert(`Resending email failed! ${error.message}`);
        }
        setResendingEmail(false);
        setTimeout(()=>{
            setResendingStatus('Resend');
            setActiveResend(false);
            triggerTimer();
        },5000);
    };



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
                    Please verify your account by using the link sent to <EmphasizeText>{`${email}`}</EmphasizeText>.
                </InfoText>
                <StyledButton onPress={()=> navigation.navigate('Login')}>
                    <ButtonText>Proceed</ButtonText>
                    <Ionicons name = "arrow-forward-circle" size={25} color={primary}/>
                </StyledButton>
                <ResendTimer
                    activeResend={activeResend}
                    resendingEmail={resendingEmail}
                    resendingStatus = {resendingStatus}
                    timeLeft={timeLeft}
                    targetTime = {targetTime}
                    resendEmail = {resendEmail}
                />
            </BottomHalf>
        </StyledContainer>;
    
};

export default Verification;