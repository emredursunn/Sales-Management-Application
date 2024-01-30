import { StyleSheet, Text, View, Pressable, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { CustomTextInput, CustomPressable } from '../../components/CustomComponents'
import LoadingComponent from '../../components/LoadingComponent'
import { Feather } from '@expo/vector-icons'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthStackNav';
import { useDispatch } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import { setLogin, setFullname } from '../../redux/userSlice';


type Props = NativeStackScreenProps<AuthStackParams> 

const LoginScreen = ({navigation}:Props) => {

    const [name,setName] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(false)

    const dispatch = useDispatch();

    const handleLogin = () => {
        if (name === '' || password === '') {
          Alert.alert('Bilgileri doldurunuz!');
        } else {
          setIsLoading(true);
    
          setTimeout(() => {
            try {
                dispatch(setLogin(true));
                dispatch(setFullname(name))
            } catch (error) {
              Alert.alert("Bir sorun Oluştu!")
            } finally {
              setIsLoading(false);
            }
          }, 1500);
        }
      };

  return (

    isLoading ? <LoadingComponent /> : (
    <View style={styles.container}>
        
        <View style={{justifyContent:'center',alignItems:'center',maxHeight:300}}>
          <Image style={{maxWidth:'90%',maxHeight:'20%',marginBottom:20}} source={require('../../../assets/yazilim_logo.png')}/>
          <Text style={{fontWeight:'bold',fontSize:20}}> GİRİŞ EKRANI </Text>        
        </View>

        <Pressable style={styles.settingsbtn}
            onPress={() => navigation.navigate('PortSettingsScreen')}>
            <Feather name="settings" size={34} color="darkblue" />
        </Pressable>

        <CustomTextInput title={"Kullanıcı Adı"}
            isSecureText={false} 
            placeHolder='Kullanıcı Adı Giriniz'
            onChangeText={(text) => setName(text)}
            value={name}
        />

        <CustomTextInput title={"Şifre"}
            isSecureText={true} 
            placeHolder='Şifre Giriniz'
            onChangeText={(text) => setPassword(text)}
            value={password}
        />

        <View style={styles.bottomContainer}>
            <CheckBox checkedColor='darkblue'
                checked={checked}
                onPress={() => setChecked(!checked)}
            />
            <Text style={{paddingTop:18, color:'gray'}}>Beni Hatırla </Text>
        </View>
        
        <View style={{marginLeft:'30%'}}>
          <CustomPressable title={'GİRİŞ'}
            width={'50%'}
            onPress={() => handleLogin()} />
        </View>

    </View>
    )
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'linen',
        justifyContent: 'center',
        paddingHorizontal: 20,
      },
      bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 'auto',
        marginTop: 15,
      },
    image:{
      width: '100%',
      height: 200,
      resizeMode: 'contain',
    },
    settingsbtn:{
        position:'absolute',
        height:50,
        width:50,
        top:40,
        right:20
    }
})