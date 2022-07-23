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
    MuscleGroup
  
}from './../components/styles';
const{brand,darkLight,primary,green,gray} = Colors;

import { baseAPIUrl } from '../components/shared';
import { CredentialsContext } from '../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { ExecutionEnvironment } from 'expo-constants';
import axios from 'axios';


const AddStats = ({navigation,route}) =>{
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const{firstName, lastName, login,_id,token} = storedCredentials;
    const [refreshing, setRefreshing] = useState(true);
    const userId = _id;
    const [showImage,setshowImage] = useState('flex');
    const [textButton,setTextButton]=useState('Hide Muscle Group');
    const [data, setData] = useState([]);
    const [loading,setLoading]=useState(true);
    const [message, setMessage]=useState();
    const [messageType,setMessageType] = useState();
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


  const handleStats = (stats, setSubmitting)=>{
    handleMessage(null);
    const url= `${baseAPIUrl}/api/workouts/stats/${exerciseId}`;
    console.log(url);
    axios
        .post(url,stats)
        .then((response)=>{
            const result = response.data;
            const {message,status}=result;

            if(status !== 'SUCCESS'){
                handleMessage(message,status);
                
            }else{
           
                handleMessage(message,status);
               
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
    const [modalOpen, setModalOpen] = useState(false);
    
    const [text,setText] = useState("Not Selected");

    const [exerciseId,setexerciseId] = useState(null);
    const [musclegroup,setMusclegroup] = useState(null);
    const [image, setImage]=useState()
  

    const {workoutId} = route.params;

    const letToggle = ()=>{
        if(showImage==='flex'){
            setshowImage('none');
            setTextButton('Show Muscle Group');
        }else{
            handleImage(musclegroup);
            setshowImage('flex');
            setTextButton('Hide Muscle Group')
        }
    }
    
     
    var Lats = require('../assets/Lats.png')
    var Abs = require('../assets/Abs.png')
    var Biceps = require('../assets/Biceps.png')
    var Calves = require('../assets/Calves.png')
    var Chest = require('../assets/Chest.png')
    var Forearm = require('../assets/Forearm.png')
    var Glutes = require('../assets/Glutes.png')
    var Hamstrings = require('../assets/Hamstrings.png')
    var Lowerback = require('../assets/Lowerback.png')
    var Midback = require('../assets/Midback.png')
    var Quads = require('../assets/Quads.png')
    var Shoulders = require('../assets/Shoulders.png')
    var Traps = require('../assets/Traps.png')
    var DefaultBack = require('../assets/DefaultBack.png')

    // sets the image in Add stats page
    const handleImage =  async(musclegroup)=>{
        switch (musclegroup) {
            case "Abs":
                MuscleGroup.source = Abs
                break;
            case "Lats":
                MuscleGroup.source = Lats
                break;
            case "Biceps":
                MuscleGroup.source = Biceps
                break;
            case "Calves":
                MuscleGroup.source = Calves
                break;
            case "Chest":
                MuscleGroup.source = Chest
                break;
            case "Forearm":
                MuscleGroup.source = Forearm
                break;
                case "Glutes":
                MuscleGroup.source = Glutes
                break;
            case "Hamstrings":
                MuscleGroup.source = Hamstrings
                break;
                case "Lowerback":
                MuscleGroup.source = Lowerback
                break;
            case "Midback":
                MuscleGroup.source = Midback
                break;
            case "Quads":
                MuscleGroup.source = Quads
                break; 
            case "Shoulders":
                MuscleGroup.source = Shoulders
                break;
            case "Traps":
                MuscleGroup.source = Traps
                break; 
            default:
                console.log("none selected")
                MuscleGroup.source = DefaultBack
                break;
        }}

        useEffect(()=>{
            handleImage();
          },[]);

    return (
        <KeyboardAvoidingWrapper>
        <StyledContainerStat>
        
            <StatusBar style = "dark"/>
                <PageTitle>Add your stats</PageTitle>
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
                            
                            if(item._id === workoutId){
                                 if(item.userEXERCISES){
                                    console.log(item.userEXERCISES)
                                    items = item.userEXERCISES.map(row =>{console.log(row.name);
                                        console.log(row.exerciseID);
                                        console.log(row.musclegroup);
                                      return <StyledButton login = {true} onPress ={()=>{setText(row.name);setModalOpen(false);setexerciseId(row.exerciseID);setMusclegroup(row.musclegroup); handleImage(row.musclegroup)}}>
                                      <ButtonText>
                                          {row.name}
                                      </ButtonText>
                                  </StyledButton>
                                })
                            }
                            }
                           
                            if(item._id === workoutId)
                            return (
                                
                                <View>
                                    <PageTitle>
                                    {item.name}
                                    </PageTitle>
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
                <Formik
                    initialValues={{sets:'', reps: '', weight: '',exerciseID:(exerciseId), userID:(userId)}}
                    onSubmit={(values, {setSubmitting})=>{
                        console.log(values);
                        if(values.reps =='' || values.sets=='' || values.weight ==''){
                            handleMessage('Please fill all the fields');
                            setSubmitting(false);
                        }else{
                           console.log(userId);
                           console.log(exerciseId);
                            handleStats(values,setSubmitting);
                        }
                    }}
                >{({handleChange, handleBlur, handleSubmit,values})=>(
                    <StyledFormAreaApp>
                        
                        <MyTextInput 
                        label="Sets"
                        placeholder= "Input a number"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('sets')}
                        onBlur = {handleBlur('sets')}
                        value = {values.sets}
                        keyboardType= "numeric"

                        />
                        <MyTextInput 
                        label="Reps"
                        placeholder= "Input a number"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('reps')}
                        onBlur = {handleBlur('reps')}
                        value = {values.reps}
                        keyboardType= "numeric"

                        />
                        <MyTextInput 
                        label="Weight"
                        placeholder= "Input a number"
                        placeholderTextColor = {darkLight}
                        onChangeText = {handleChange('weight')}
                        onBlur = {handleBlur('weight')}
                        value = {values.weight}
                        keyboardType= "numeric"

                        />
                        
                        <MuscleGroup source={MuscleGroup.source} style = {{width:150, height: 150, resizeMode:'contain' ,display:showImage}} />
                        <Line/>
                        <StyledButton login = {true} onPress={letToggle}>
                            <ButtonText>
                                {textButton}
                            </ButtonText>
                        </StyledButton>
                        <MsgBox type = {messageType}>{message}</MsgBox>
                        <StyledButton onPress = {handleSubmit}>
                            <ButtonText>
                                Save Stats
                            </ButtonText>
                        </StyledButton>
                        
                    </StyledFormAreaApp>
                )   
                }
                </Formik>
                <Subtitle >
                    To view all stats, please visit the Sweat Check website at
                </Subtitle>
                <TouchableOpacity onPress={() => Linking.openURL('https://beldeeb.github.io/SweatCheck/')}>
                    <Subtitle link = {true}>
                    https://beldeeb.github.io/SweatCheck/
                    </Subtitle>
                </TouchableOpacity>
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
export default AddStats;