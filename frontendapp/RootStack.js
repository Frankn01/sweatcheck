import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import AddStats from '../screens/AddStats';
import ViewProgress from '../screens/ViewProgress';
import Verification from '../screens/LinkVerification';
import { Colors } from '../components/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';
import ForgotPassword from './../screens/ForgotPassword';
import PasswordReset from './../screens/PasswordReset';

const {primary, tertiary} =Colors;
const Stack = createNativeStackNavigator();

const RootStack = () =>{
    return(
        <CredentialsContext.Consumer>
            {({storedCredentials}) => (
                <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle:{
                            backgroundColor: 'transparent'
                        },
                        headerTintColor: tertiary,
                        headerTransparent: true,
                        headerTitle: '',
                        headerLeftContainerStyle:{
                            paddingLeft: 20
                        },
                        cardStyle:{backgroundColor:'#C0C0C0'}
                    }}
                    initialRouteName = "Login"
                >
                {storedCredentials ?
                (<><Stack.Screen name="Welcome" component={Welcome}/>
                    <Stack.Screen name="AddStats" component={AddStats}/>
                    <Stack.Screen name="ViewProgress" component={ViewProgress}/>
                </>
                )
                : (<>
                    
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
                    <Stack.Screen name = "PasswordReset" component={PasswordReset}/>
                    <Stack.Screen name="Signup" component={Signup}/>
                    <Stack.Screen name="Verification" component={Verification}/>
                    
                </>)
            }
                    
                </Stack.Navigator>
            </NavigationContainer>

            )}
        </CredentialsContext.Consumer>
        
    )
}

export default RootStack;