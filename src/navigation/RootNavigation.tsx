import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import UserStackNav from './UserStackNav'
import AuthStackNav from './AuthStackNav'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'


const RootNavigation = () => {
  const isAuth: boolean = useSelector((state: RootState) => state.user.isAuth);

  return (
    <NavigationContainer>
      {isAuth ? 
        <UserStackNav />
       : 
        <AuthStackNav />
      }
    </NavigationContainer>
  );
};


export default RootNavigation