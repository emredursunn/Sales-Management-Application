  import React, { useState } from 'react';
  import { StyleSheet, View, Text, DimensionValue, FlatList, TouchableOpacity } from 'react-native';

  type Props = {
      tableHead: string[],
      tableData: string[][],
      setActiveItem?: (orderId:string) => void 
  }

  const TableComponent = ({tableHead,tableData,setActiveItem}:Props) => {

    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    
    const renderHead = (tableHeadList: string[]) => {
      const columnWidth = (100 / tableHeadList.length) + '%' as DimensionValue;
      return (
        <View style={styles.table_head}>
          {tableHeadList.map((header, i) => (
            <View key={i} style={{ width: columnWidth, justifyContent:'center', alignItems:'center'}}>
              <Text style={[styles.text,{color:'white'}]}>{header}</Text>
            </View>
          ))}
        </View>
      );
    };

    
    const renderBody = ({item, index} : {item:string[],index:number}) => {

      const columnWidth = (100 / item.length) + '%' as DimensionValue
      return(
        <TouchableOpacity key={index} style={[styles.table_body, selectedRow === index && styles.selectedRow]}
          onPress={setActiveItem ? () => {setSelectedRow(index)
            setActiveItem(item[0])
            console.log(item[0])}
            : undefined}>
            {item.map((cell,j) => (
              <View key={j} style={{width:columnWidth, justifyContent:'center', alignItems:'center'}}>
                <Text style={[styles.text, {fontSize:10}]}>{cell}</Text>
                </View>
            ))}
        </TouchableOpacity>
      )
    }

    return (
    <View style={styles.wrapper}>

          {/* TABLE HEAD */}
          {renderHead(tableHead)}

          {/* TABLE BODY */}
          <FlatList data={tableData}
          renderItem={renderBody}
          extraData={selectedRow}/>

        </View>
    );


  }

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:19
    },
    table_head: {
      flexDirection: 'row',
      backgroundColor: 'darkblue',
      padding: 10,
      justifyContent:'space-between'
    },
    table_body: {
      flexDirection: 'row',
      padding: 10,
      justifyContent:'space-between'
    },
    text: {
      fontSize: 12,
      color: 'black',
    },
    selectedRow:{
      backgroundColor:'lightblue'
    }
  });

  export default TableComponent;