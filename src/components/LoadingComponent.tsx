import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoadingComponent = () => {
  
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/mava_beyaz.png")}/>
      <ActivityIndicator color={'white'} size={24} />
      <Text style={styles.text}>YÜKLENİYOR...</Text>
    </View>
  )
}

export default LoadingComponent

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'darkblue',
    justifyContent:'center',
    alignItems:'center'
  },
  text:{
    fontSize:20,
    color:'white'
  },
  image:{
    height:200,
    width:'100%',
    resizeMode:'center'
  }
})