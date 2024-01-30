import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginScreen, PortSettingsScreen } from '../screens'

export type AuthStackParams = {
    LoginScreen:undefined,
    PortSettingsScreen:undefined
}

const AuthStack = createNativeStackNavigator<AuthStackParams>()

const AuthStackNav = () => {
  return (
    <AuthStack.Navigator initialRouteName='LoginScreen' screenOptions={{headerShown:false}}>
      <AuthStack.Screen name='LoginScreen' component={LoginScreen}/>
      <AuthStack.Screen name='PortSettingsScreen' component={PortSettingsScreen}/>
    </AuthStack.Navigator>
  )
}

export default AuthStackNav