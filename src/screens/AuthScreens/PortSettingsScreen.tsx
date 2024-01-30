import { Image, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { CustomPressable, CustomTextInput } from '../../components/CustomComponents'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParams } from '../../navigation/AuthStackNav'
import { Text } from 'react-native'

type Props = NativeStackScreenProps<AuthStackParams>

const PortSettingsScreen = ({navigation} : Props) => {

  const [host, setHost] = useState<string>("")
  const [port, setPort] = useState<string>("")

  return (
    <View style={styles.container}> 

      <View style={{justifyContent:'center',alignItems:'center',maxHeight:300}}>
        <Image style={{maxWidth:'90%',maxHeight:'20%',marginBottom:20}} source={require('../../../assets/yazilim_logo.png')}/>
        <Text style={{fontWeight:'bold',fontSize:20}}> PORT SEÇİM EKRANI </Text>        
      </View>

      <View style={{justifyContent:'center',alignItems:'center'}}>

      <CustomTextInput title={"Host"}
                isSecureText={false} 
                placeHolder='Host Giriniz'
                onChangeText={(text) => setHost(text)}
                value={host}
                />

      <CustomTextInput title={"Port"}
                isSecureText={false} 
                placeHolder='Port Giriniz'
                onChangeText={(text) => setPort(text)}
                value={port}
                />
        
      <CustomPressable title={'KAYDET'}
                width={'80%'}
                onPress={() => navigation.navigate('LoginScreen')} />
     </View>
    </View>
  )
}

export default PortSettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linen',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
})