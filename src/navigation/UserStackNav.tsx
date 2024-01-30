import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen, CreateOrderScreen, CustomersScreen, OrdersScreen, StockScreen } from '../screens'
import MyDrawer from './DrawerNavigator'




export type UserStackParams = {
    HomeScreen:undefined,
    CreateOrderScreen:undefined,
    OrdersScreen:{
      statuses:string[]
    },
    CustomersScreen:undefined,
    StockScreen:undefined
}

export const UserStack = createNativeStackNavigator<UserStackParams>()


const UserStackNav = () => {
  return (
    <UserStack.Navigator initialRouteName='HomeScreen' screenOptions={{headerShown:false}}>
      <UserStack.Screen name='HomeScreen' component={HomeScreen}/>
      <UserStack.Screen name='CreateOrderScreen' component={CreateOrderScreen} />
      <UserStack.Screen name='OrdersScreen' component={OrdersScreen} />
      <UserStack.Screen name='CustomersScreen' component={CustomersScreen} />
      <UserStack.Screen name='StockScreen' component={StockScreen} />
    </UserStack.Navigator>
  )
}


export default UserStackNav