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
    StatView,
    StatText,
    CircleLogo,
    QuoteText
  
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
    const [quotecontent,setQuoteContent]=useState();
    const [quoteauthor,setQuoteAuthor]=useState();
    const [message, setMessage]=useState();
    const [messageType,setMessageType] = useState();
    const [statData,setStatData]=useState([]);
    const [statLoading,setStatLoading]=useState(true);
    const [statRefesh,setStatRefresh]=useState(true);
    const url= `${baseAPIUrl}/api/workouts/all/`;
   
    const fetchData = async ()=> {

        const resp = await fetch(url,{
            headers: new Headers({
              "tok": token
            })
          });
        const data = await resp.json();
        setData (data);
        setLoading(false);
        setRefreshing(false);
    };

  
  useEffect(()=>{
    fetchData();
  },[]);

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
   
  }

  const getQuote = async()=>{
    const quoteUrl = `https://api.quotable.io/random?tags=motivational&maxLength=100`
    const response = await fetch(quoteUrl);
    const quotedata = await response.json();
    setQuoteContent(quotedata.content);
    setQuoteAuthor(quotedata.author);
  }
  useEffect(()=>{
    getQuote();
  },[]);

console.log(statData);

    const [modalOpen, setModalOpen] = useState(false);
    
    const [text,setText] = useState("Not Selected");

    const [exerciseId,setexerciseId] = useState(null);


    return (
        <KeyboardAvoidingWrapper>
        <StyledContainerStat>
        
            <StatusBar style = "dark"/>
                <PageTitle>View Progress</PageTitle>
                <EmphasizeText>Selected exercise: {text} </EmphasizeText>
                <StyledButton onPress = {()=> setModalOpen(true)}>
                        <ButtonText>
                            Select exercise
                        </ButtonText>
                </StyledButton>
                <Modal visible = {modalOpen} animationType='slide' theme = {{colors:{backdrop:'#C0C0C0',},}}>
                    <StyledButton onPress = {()=> setModalOpen(false)}>
                        <ButtonText>
                            Close
                        </ButtonText>
                    </StyledButton>
                    <Line/>
                    <FlatList
                
                        data={data}
                        renderItem={({item})=>{
                            let items = [];
                           
                        
                                 if(item.userEXERCISES){
                                    items = item.userEXERCISES.map(row =>{
                                      
                                      return <StyledButton login = {true} onPress ={()=>{setText(row.name);setModalOpen(false);setexerciseId(row.exerciseID);fetchGraphData(row.exerciseID); }}>
                                      <ButtonText>
                                          {row.name}
                                      </ButtonText>
                                  </StyledButton>
                                          
                                })  
                            }
                         
                            return (
                                
                                <View>
                                  {items}
                                </View>
                              )
                        }}
                        keyExtractor={(item) => {return item._id}}
                        refreshControl = {
                            <RefreshControl refreshing= {refreshing} onRefresh = {fetchData}/>
                          }
                        />
                    
                </Modal>
               
                <Line/>
                <Subtitle>
                    Most Recent Stats
                </Subtitle>
                
                {refreshing ? <ActivityIndicator/> : null}
    <FlatList
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems:'center'}}
          justify
          data={statData}
          renderItem={({item})=>(
           
           
                <StatText>
                    Date: {item.createdAt.slice(0,10)} {'\n'}   Reps: {item.reps}                     Sets: {item.sets}                     Weight: {item.weight}
                </StatText>
             

          )}
          keyExtractor={(item) => item._id}
          refreshControl = {
            <RefreshControl refreshing= {refreshing} onRefresh = {fetchGraphData}/>
          }
        />
                <Subtitle >
                    To view all stats, please visit the Sweat Check website at
                </Subtitle>
                <TouchableOpacity onPress={() => Linking.openURL('https://beldeeb.github.io/SweatCheck/')}>
                    <Subtitle link = {true}>
                    https://beldeeb.github.io/SweatCheck/
                    </Subtitle>
                </TouchableOpacity>
          <QuoteText>
            "{quotecontent}" {'\n'} {'\n'}-{quoteauthor}
          </QuoteText>
            <CircleLogo resizeMode="cover" source={require('./../assets/logo.png')} />
        </StyledContainerStat>
        </KeyboardAvoidingWrapper>

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