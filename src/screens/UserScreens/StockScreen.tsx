import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import products from '../../utils/products.json'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CustomPressable, CustomTextInput } from "../../components/CustomComponents";
import TableComponent from "../../components/TableComponent";
import { AntDesign } from '@expo/vector-icons';
import { editStock } from "../../redux/stockSlice";



//STOKLARI BU SAYFADA GÖRÜYORUZ SİPARİŞ ALINDIKÇA STOKLAR GÜNCELLENİYOR.
const StockScreen = () => {
    
    const [visible,setVisible] = useState<boolean>(false)
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [tableData, setTableData] = useState<string[][]>([]);

    const dispatch = useDispatch()
    const stockList = useSelector((state: RootState) => state.stock.stockList)
    const [newStock,setNewStock] = useState<string>("")

    const tableHead = ['ÜRÜN ID', 'ÜRÜN ADI' ,'STOK']
  
    const [searchText,setSearchText] = useState<string>("")

    useEffect(() => {
        const newData = stockList.map((stock) => {
            const productName = products.find((p) => p.productId === stock.productId)?.productName
            if(productName){
                if(stock.productId.includes(searchText.toLowerCase()) || productName.toLowerCase().includes(searchText.toLowerCase())){
                    return [stock.productId,productName,stock.productQuantity.toString()]
                }}
            return []
        }).filter((row) => row.length > 0)
        setTableData(newData)
    },[stockList,searchText])

    const handleModal = () => {
        setVisible(!visible)
    }

    const handleEditStock = () => {
        dispatch(editStock({
            productId:activeItemId,
            productQuantity:newStock
        }))
        setVisible(false)
    }

    return (
        <View style={styles.container}>
    
          {/*  HEADER BAR- SEARCH BAR AND ADD CUSTOMER BUTTON  */}
          <View style={{flexDirection:'row',alignItems:'center'}}>

            <AntDesign name="search1" size={20} color="gray" style={{marginTop:32}}/>
            <CustomTextInput title='' 
            placeHolder='Ürün ID | ÜRÜN ADI'
            value={searchText} 
            onChangeText={setSearchText}
            isSecureText={false} 
            style={[{inputContainer: {margin:20,marginLeft:5,marginBottom:10,minWidth:250}}, {label:{fontWeight:500, marginBottom:10}}]}/>
          </View>
    
          {/* TABLE */}
          <View style={{ height: '80%', width: '100%' }}>
            <TableComponent tableData={tableData} 
            tableHead={tableHead} 
            setActiveItem={setActiveItemId} />
          </View>
    
          {/* BOTTOM BAR */}
          <View style={styles.bottom}>
            <AntDesign name="edit" size={32} 
            color={activeItemId ? "white" : "gray"}
            onPress={activeItemId ? () => handleModal() : undefined} />
          </View>

          <Modal visible={visible}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={handleModal} style={styles.closeButton}>
                    <Text style={{ fontSize: 20, color: 'black' }}>X</Text>
                </TouchableOpacity>
                <CustomTextInput title="Yeni Stok giriniz: " placeHolder="100" isSecureText={false} value={newStock} onChangeText={setNewStock}/>
                <View style={{alignItems:'center'}}>
                    <CustomPressable title="KAYDET" onPress={handleEditStock} width={150}/>
                </View>
            </View>
          </Modal>
    </View>
    )
}

export default StockScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    bottom: {
        flexDirection:'row',
        width: '100%',
        height: 50,
        position: 'absolute',
        bottom: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'darkblue',
    },
    modalContainer: {
        backgroundColor: 'linen',
        width: '80%',
        height:'50%',
        margin: '10%',
        marginTop:'30%',
        borderRadius: 30,
        borderWidth:2,
        borderColor:'darkblue',
        justifyContent:'center',
      },
      closeButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'lightgray',
        position:'absolute',
        right:1,
        top:1
      },
})