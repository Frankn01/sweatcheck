import styled from 'styled-components/native';
import {View,Text,Image,TextInput,TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
    primary: '#C0C0C0',
    secondary: '#E5E7EB',
    tertiary: '#1F2937',
    darkLight: '#9CA3AF',
    brand: '#800000',
    green: '#ffffff',
    red: '#EF4444',
    gray: '#808080',
    darkGreen: '#006400',
    lightGreen: 'rgba(16,185,129,0.1)',
    black: '#000000',
};

const{primary,secondary,tertiary,darkLight,brand,green,red,gray} = Colors;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight+20}px;
    background-color: ${primary};
    padding-bottom: 80px;
`;

export const StyledContainerApp = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight+200}px;
    padding-bottom: 500px;
    background-color: ${primary};


`;
export const WorkoutListContainer = styled.View`
    flex: 1;
    background-color: ${primary};
    paddingTop: 40px;
    paddingHorizontal:
`;
export const StyledContainerStat = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight}px;
    padding-bottom: 90px;
    background-color: ${primary};


`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    background-color: ${primary};
`;
export const WelcomeContainer=styled(InnerContainer)`
    padding: 25px;
    padding-top: 1px;
    justify-content: center;
`;
export const PageLogo = styled.Image`
    width: 250px;
    height: 250px;
`;

export const MuscleGroup = styled.Image`
    width: 200px;
    height: 200px;
    margin:auto;
    
`;

export const Avatar = styled.Image`
    width: 100px;
    height: 100px;
    margin:auto;
    border-radius:50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
`;
export const CircleLogo = styled.Image`
    width: 150px;
    height: 150px;
    margin:auto;
    border-radius:75px;
    border-width: 2px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const WelcomeImage = styled.Image`
    height: 50%;
    min-width:100%;
`;
export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;

    ${(props) => props.welcome&&`
        font-size: 35px;
    `}
`;

export const Subtitle = styled.Text`
    font-size: 18px;
    margin-bottom:20px;
    letter-spacing: 1px;
    text-align: center;
    font-weight: bold;
    color: ${tertiary};
    align-self: center;
    ${(props) => props.welcome&&`
        margin-bottom: 5px;
        font-weight: normal;
    `}
    ${(props) => props.link&&`
        color: ${brand};
        font-size: 17px;
    `}
`;

export const CurrentWorkouts = styled.Text`
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    color: ${brand};
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledFormAreaApp = styled.View`
    width: 100%;
`;
export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding:15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top:38px;
    position: absolute;
    z-index:1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top:38px;
    position: absolute;
    z-index:1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    border-radius: 7px;
    margin-vertical: 5px;
    height: 60px;
    align-items: center;
    ${(props)=>props.login == true && `
        background-color: ${gray};
        flex-direction: row;
        justify-content: center;
        
    `}
    ${(props)=>props.result == true && `
        background-color: ${brand};
        flex-direction: row;
        justify-content: center;
        
    `}
`;
export const StyledButtonWorkout = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    border-radius: 7px;
    margin-vertical: 5px;
    height: 50px;
    align-items: center;
    width: 300px;

    
`;

export const ButtonText = styled.Text`
    color: ${green} ;
    font-size: 16px;
    ${(props)=>props.google == true && `
        padding-left: 15px;
    `}
`;

export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px;
    color: ${props=>props.type=='SUCCESS' ? green : red};
`;

export const Line = styled.View`
    height: 1px;
    width:100%;
    background-color: ${darkLight};
    margin-vertical: 10px;

`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction:row;
    align-items:center;
    padding:10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-content:center;
    color: ${tertiary};
    font-size:15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content:center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${brand};
    font-size:15px;

    ${(props)=>{
        const{resendStatus}=props;
        if(resendStatus==='Failed!'){
            return `color: ${Colors.red}`;
        }else if(resendStatus ==='Sent!'){
            return `color: ${Colors.darkgreen}`;
        }
    }}
`;

export const ExerciseModal = styled.View`
    align-self:center;

`;

//verification components
export const TopHalf = styled.View`
    flex: 1;
    justify-content: center;
    padding: 20px;
`;

export const IconBg = styled.View`
    width: 250px;
    height: 250px;
    background-color: ${Colors.green};
    border-radius: 250px;
    justify-content: center;
    align-items: center;
`;
export const BottomHalf = styled(TopHalf)`
    justify-content: space-around;
`;

export const InfoText = styled.Text`
    color: ${Colors.black};
    font-size: 15px;
    text-align: center;
`;

export const InlineGroup = styled.View`
    flex-direction: row;
    padding: 10px;
    justify-content: center;
    align-items: center;
`;

export const EmphasizeText = styled.Text`
    font-weight: bold;
    font-size: 16px;
`;

export const StatView = styled.View`
    justify-content: center;
    flex-direction:row;
    align-items:center;
    padding:1px;
    background-color: ${brand};
    width: 340px;
    height: 50px;
    border-radius: 10px;
    
`;

export const StatText = styled.Text`
    color: ${green};
    margin: auto;
    align-items:center;
    padding:1px;
    background-color: ${brand};
    width: 345px;
    height: 50px;
    border-radius: 7px;
    border-width: 2px;
    border-color: ${primary};
`;

export const QuoteText = styled.Text`
    color: ${green};
    margin: auto;
    align-self:center;
    padding:15px;
    background-color: ${brand};
    width: 250px;
    height: 200px;
    border-radius: 7px;
    font-weight: bold
    font-size: 21px;
    font-style: italic
    text-align:center
    
`;