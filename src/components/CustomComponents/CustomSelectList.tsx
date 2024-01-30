import { Text, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'


type Props = {
    title: string;
    data: any[];
    placeHolder: string;
    setSelected: (obj: any) => void;
  };
  
  const CustomSelectList: React.FC<Props> = ({
    title,
    data,
    placeHolder,
    setSelected,
  }) => {
    return (
      <View style={{ flexDirection: 'row' , alignItems:'center',justifyContent:'space-between'}}>
        <Text style={{ fontSize: 15, margin: 5, color:'black'}}> {title} : </Text>
        <SelectList boxStyles={{margin:5,borderWidth: 1,borderColor: '#ccc',borderRadius: 8,width:180}}
         data={data} placeholder={placeHolder} setSelected={setSelected} maxHeight={100} dropdownTextStyles={{maxWidth:170,}}/>
      </View>
    );
  };
  
  export default CustomSelectList;