import { DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {
    title: string
    onPress: () => void,
    width?: DimensionValue,
    minWidth?:number
}

const CustomPressable = (props:Props) => {
  return (
      <Pressable style={({pressed}) => [{
        backgroundColor: pressed ? 'lightblue' : 'gray',
        width:props.width, minWidth:props.minWidth}, styles.button]}
        onPress={props.onPress}>
        <Text style={styles.buttonText}> {props.title} </Text>
      </Pressable>
  )
}

export default CustomPressable

const styles = StyleSheet.create({
    button:{
        height:50,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
    },
    buttonText:{
        fontWeight:'bold',
        color:'white'
    },
})