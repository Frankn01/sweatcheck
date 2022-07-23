import React, { Component, useEffect, useState , useContext} from 'react'
import { TouchableOpacity,SafeAreaView, StyleSheet, ActivityIndicator, ListView, Text, View, Alert, FlatList ,RefreshControl} from 'react-native'
import { useNavigation } from '@react-navigation/native'
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
  WorkoutListContainer,
  StyledFormAreaApp,
  StyledButtonWorkout
}from './../components/styles';
import axios from 'axios'
import { baseAPIUrl } from './shared';
import { CredentialsContext } from './../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';




const GetWorkouts = () =>{
  const navigation = useNavigation(); 
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const{firstName, lastName, login,_id,token} = storedCredentials;
  const [refreshing, setRefreshing] = useState(true);
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(true);

  const url= `${baseAPIUrl}/api/workouts/all/`;// the 14 can be deleted once noah and ivan update url, contact api
  
  const fetchData = async ()=> {
    // new changes important for token stuff   vvvv
    const resp = await fetch(url,{
      headers: new Headers({
        "tok": token
      })
    });

    // new changesimportent for token stuff ^^^^
    const data = await resp.json();
    setData (data);
    setLoading(false);
    setRefreshing(false);
  };

  
  useEffect(()=>{
    fetchData();
  },[]);


  const clearLogin=()=>{
    AsyncStorage.removeItem('sweatcheckCredentials')
    .then(()=>{
        setStoredCredentials("");
    })
    .catch(error => console.log(error))
  } 



  return(
    <View style={styles.container}>
      <PageTitle welcome = {true}>Sweat Check</PageTitle>
        <Subtitle welcome = {true}>Welcome to your Sweat Check!</Subtitle>
        <Subtitle welcome = {true}>{firstName}</Subtitle>

        <Avatar resizeMode="cover" source={require('./../assets/logo.png')} />
        <CurrentWorkouts>Current Workouts</CurrentWorkouts>
        <Line/>

    {refreshing ? <ActivityIndicator/> : null}
    <FlatList
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems:'center'}}
          justify
          data={data}
          renderItem={({item})=>(
            <StyledButtonWorkout onPress={()=> navigation.navigate('AddStats',{workoutId:item._id})}>
              <ButtonText>{item.name}</ButtonText>
            </StyledButtonWorkout>

          )}
          keyExtractor={(item) => item._id}
          refreshControl = {
            <RefreshControl refreshing= {refreshing} onRefresh = {fetchData}/>
          }
        />

    <StyledFormAreaApp>
    <Line/>
          <StyledButton result = {true} onPress = {()=> navigation.navigate('ViewProgress')}>
              <ButtonText>
                  View Progress
              </ButtonText>
          </StyledButton> 
          <Line/>         
          <StyledButton login = {true} onPress = {clearLogin}>
              <ButtonText>
                  Logout
              </ButtonText>
          </StyledButton>
          
          
      </StyledFormAreaApp>

    </View>
        
  );
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor:'#C0C0C0'
    }
});

export default GetWorkouts;