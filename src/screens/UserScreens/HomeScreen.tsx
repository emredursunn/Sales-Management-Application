import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CustomPressable } from '../../components/CustomComponents'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { UserStackParams } from '../../navigation/UserStackNav'
import { setLogin } from '../../redux/userSlice'
import { RootState } from '../../redux/store'

type Props = NativeStackScreenProps<UserStackParams>


//ANA MENÜ 
const HomeScreen = ({navigation}:Props) => {

  const dispatch = useDispatch()
  const username = useSelector((state: RootState) => state.user.fullname)

  const handleLogout = () => {
    dispatch(setLogin(false))
  }


  return (
    <View style={styles.container}>
      <View style={{height:200,width:200,justifyContent:'center',alignItems:'center'}}>
        <Image source={require('../../../assets/yazilim_logo.png')} style={{width:'90%', height:100}} />
        {username && <Text>Kullanıcı: {username}</Text>}
      </View>
      <CustomPressable title='SİPARİŞ AL' width={300}
      onPress={() => navigation.navigate('CreateOrderScreen')} />
      <CustomPressable title='GELEN SİPARİŞLER' width={300}
      onPress={() => navigation.navigate('OrdersScreen',{statuses:['İşlemde','Kargolandı']})} />
      <CustomPressable title='TAMAMLANAN SİPARİŞLER' width={300}
      onPress={()=>navigation.navigate('OrdersScreen',{statuses:['Teslim Edildi']})}/>
      <CustomPressable title='MÜŞTERİLER' width={300}
      onPress={()=>navigation.navigate('CustomersScreen')}/>
      <CustomPressable title='STOK DURUMU' width={300}
      onPress={()=>navigation.navigate('StockScreen')}/>
      <CustomPressable title='LOGOUT' width={300}
      onPress={()=>handleLogout()}/>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'linen'
    }
})