import React,{useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import{RefreshControl, View,Modal, Text, FlatList, Linking, TouchableOpacity,Image, StyleSheet, ActivityIndicator} from 'react-native';

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
    StyledFormAreaApp,
    StyledContainerApp,
    Avatar,
    ExerciseModal,
    StyledContainerStat,
    StyledButtonWorkout,
    EmphasizeText,
    Button,
    MuscleGroup,
    StatView
  
}from './../components/styles';
const{brand,darkLight,primary,green,gray} = Colors;

import { baseAPIUrl } from '../components/shared';
import { CredentialsContext } from '../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { ExecutionEnvironment } from 'expo-constants';
import axios from 'axios';
import{
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  }from 'react-native-chart-kit'


const ViewProgress = ({navigation,route}) =>{
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const{firstName, lastName, login,_id,token} = storedCredentials;
    const [refreshing, setRefreshing] = useState(true);
    const userId = _id;
    const [data, setData] = useState([]);
    const [loading,setLoading]=useState(true);
    const [message, setMessage]=useState();
    const [messageType,setMessageType] = useState();
    const [statData,setStatData]=useState([]);
    const [statLoading,setStatLoading]=useState(true);
    const [statRefesh,setStatRefresh]=useState(true);


  const fetchGraphData = async (exerciseId)=>{
    const statUrl = `${baseAPIUrl}/api/workouts/all/stats/${exerciseId}/?_limit=7`
    const response = await fetch(statUrl,{
        headers: new Headers({
            "tok":token
        })
    });
    const statData = await response.json();
    
    setStatLoading(false);
    setStatRefresh(false);
    setStatData(statData.slice(0,7));
    console.log(statUrl);
  }

 
console.log(statData);



    
 
   
    return (
        <View>
                <Subtitle>
                    Most Recent Stats
                </Subtitle>
                
                {refreshing ? <ActivityIndicator/> : null}
    <FlatList
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems:'center'}}
          justify
          data={statData}
          renderItem={({item})=>(
           
            <StatView>
                <Text>
                    Date: {item.createdAt} Reps: {item.reps} Sets: {item.sets} Weight: {item.weight}
                </Text>
            </StatView>

          )}
          keyExtractor={(item) => item._id}
          refreshControl = {
            <RefreshControl refreshing= {refreshing} onRefresh = {fetchGraphData}/>
          }
        />
          </View>

    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flex: 1,
    },
    row: {
      padding: 15,
      marginBottom: 5,
      backgroundColor: '#C0C0C0',
      flexDirection: 'column'
    },
  })

  const MyTextInput = ({label,...props})=>{
    return(
        <View>
            
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            
        </View>
    )
}
export default ViewProgress;