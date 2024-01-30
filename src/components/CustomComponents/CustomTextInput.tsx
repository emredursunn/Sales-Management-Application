// CustomTextInput component
import { StyleSheet, Text, View, TextInput,  KeyboardTypeOptions} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  isSecureText: boolean;
  placeHolder: string;
  onChangeText: (text: string) => void;
  value: string;
  style?: [ inputContainer?: Record<string, any>,
    label?: Record<string, any>,
    textInput?: Record<string, any>],
  keyboardType?: KeyboardTypeOptions
};

const CustomTextInput = (props: Props) => {

  const containerStyle = props.style?.[0]?.inputContainer || styles.inputContainer;
  const labelStyle = props.style?.[1]?.label || styles.label;
  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{props.title}</Text>
      <TextInput
        style={styles.textInput}
        secureTextEntry={props.isSecureText}
        placeholder={props.placeHolder}
        onChangeText={props.onChangeText}
        value={props.value}
        keyboardType= {props.keyboardType}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', 
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginRight: 8,
    marginBottom:8,
  },
  textInput: {
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: 'lightblue',
  },
});
