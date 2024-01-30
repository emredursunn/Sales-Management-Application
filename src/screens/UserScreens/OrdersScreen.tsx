import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent";
import { Order } from '../../types/types';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Alert, Image } from 'react-native';
import ModalComponent from '../../components/ModalComponent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserStackParams } from '../../navigation/UserStackNav';
import { deleteOrder } from '../../redux/orderSlice';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { CustomPressable, CustomSelectList, CustomTextInput } from '../../components/CustomComponents';
import {Linking} from 'react-native'



//BU SAYFA HEM TAMAMLANMIŞ SİPARİŞLER HEM DE AKTİF SİPARİŞLERİ GÖSTERİYOR. NAVİGE EDİLİRKEN ALDIĞI ROUTE'A GÖRE TABLO DÜZENLENİYOR.
//TEK KODDA 2 SAYFA ÇALIŞTIRILIYOR.

type Props = NativeStackScreenProps<UserStackParams, 'OrdersScreen'>

const OrdersScreen = ({route}:Props) => {

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  
  const ordersList: Order[] = useSelector((state: RootState) => state.orders.orderList);
  const dispatch = useDispatch()
  
  const { statuses } = route.params
  const tableHead = ['NO', 'TARİH','MÜŞTERİ', 'TUTAR', 'SİPARİŞ DURUMU']
  
  const [searchText,setSearchText] = useState<string>("")
  
  const customers = useSelector((state: RootState) => state.customers.customerList)
  
  const [visibleDetails, setVisibleDetails] = useState<boolean>(false);
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false)

  const filterSelectListData = ['ID','MÜŞTERİ ADI', 'TUTAR']
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  const sortTypeSelectListData = ['ARTAN','AZALAN']
  const [selectedSortType,setSelectedSortType] = useState<string | null>(null)

  useEffect(() => {
    const newData = ordersList
      .filter((order) => statuses.includes(order.status))
      .map((order) => { 
        const customer = customers.find((c) => c.customerId === order.customerId);
        if (customer &&
           (customer.fullname.toLowerCase().includes(searchText.toLowerCase()) 
           || customer.phone.includes(searchText))) {
             return [order.orderId, order.date, customer.fullname, order.totalPrice.toString(), order.status] 
            }
            return [];
          })
          .filter((row) => row.length > 0);
          
          setTableData(newData);
        }, [ordersList, searchText]);
    
    //TUTARA GÖRE    
    const sortDataByTotal = (type: string) => {
      const sortedData = [...tableData];
      
      sortedData.sort((row1, row2) => {
        const total1 = parseInt(row1[3]) || 0;
        const total2 = parseInt(row2[3]) || 0;
        return type === 'asc' ? total1 - total2 : total2 - total1;
      });
      
      setTableData(sortedData);
    };
  
    //MÜŞTERİ ADINA GÖRE
    const sortDataByName = (type: string) => {
      const sortedData = [...tableData];
      
      sortedData.sort((row1, row2) => {
        const name1 = row1[2].toLowerCase();
        const name2 = row2[2].toLowerCase();
        return type === 'asc' ? name1.localeCompare(name2) : name2.localeCompare(name1);
      });
    
    setTableData(sortedData);
  };
  
  //ID' YE GÖRE
  const sortDataById = (type: string) => {
    const sortedData = [...tableData];
    
    sortedData.sort((row1, row2) => {
      const id1 = parseInt(row1[0], 10);
      const id2 = parseInt(row2[0], 10);
      return type === 'asc' ? id1 - id2 : id2 - id1;
    });
    
    setTableData(sortedData);
  };
  
  //SIRALAMA AYARLARI MODALI
  const handleSettingsModal = () => {
    if(selectedFilter && selectedSortType){
      setVisibleSettings(!visibleSettings)
      if(selectedFilter === 'ID'){
        if(selectedSortType === 'ARTAN'){
          sortDataById('asc')
        }else{
          sortDataById('desc')
        }
      }else if(selectedFilter === 'MÜŞTERİ ADI'){
        if(selectedSortType === 'ARTAN'){
          sortDataByName('asc')
        }else{
          sortDataByName('desc')
        }
      }else{
        if(selectedSortType === 'ARTAN'){
          sortDataByTotal('asc')
        }else{
          sortDataByTotal('desc')
        }
      }
  }else{
    Alert.alert("Eksik Seçtiniz!")
  }
  setSelectedFilter(null)
  setSelectedSortType(null)
}
  

  //SİPARİŞ DETAY MODALI
  const handleDetailsModal = () => {
    setVisibleDetails(!visibleDetails);
  };
  
  //REDUXTAN SİPARİŞ SİLME
  const deleteItem = () => {
    dispatch(deleteOrder(activeItemId))
    setActiveItemId(null)
  }

  //ARAMA YAPMAK İÇİN
  const makeCall = () => {

    const activeCustomerId = ordersList.find((order) => order.orderId === activeItemId)?.customerId;
    const activeCustomer = customers.find((c) => c.customerId === activeCustomerId)
  
    if (activeCustomer && activeCustomer.phone) {
      const phoneNumber = activeCustomer.phone;
      const phoneNumberUrl = `tel:${phoneNumber}`;
  
      Linking.canOpenURL(phoneNumberUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(phoneNumberUrl);
          } else {
            console.error("Arama desteklenmiyor.");
          }
        })
        .catch((error) => {
          console.error("Bir hata oluştu: ", error);
        });
    }
  };

  return (
    <View style={styles.container}>

      {/* SEARCH BAR */}
      <View style={{flexDirection:'row',alignItems:'center'}}>
        
        <AntDesign name="search1" size={20} color="gray" style={{marginTop:29}}/>

        <CustomTextInput title='' 
        placeHolder='Müşteri İsmi | Telefon Numarası'
        value={searchText} 
        onChangeText={setSearchText}
        isSecureText={false} 
        style={[{inputContainer: {margin:25, marginLeft:5, minWidth:280}}, {label:{fontWeight:500, marginBottom:10}}]}/>
        
        <Ionicons name="settings-outline" size={22} color="black" onPress={() => setVisibleSettings(true)} style={{paddingTop:20}} />
      </View>

      {/* TABLE */}
      <View style={{ height: '80%', width: '100%' }}>
        <TableComponent tableData={tableData} 
        tableHead={tableHead} 
        setActiveItem={setActiveItemId} />
      </View>

      {/* BOTTOM BAR */}
      <View style={styles.bottom}>
        <AntDesign
         name="delete"
         size={32}
         color={activeItemId ? 'white' : 'gray'}
         onPress={activeItemId ? () => deleteItem() : undefined} />
        <Ionicons
          name="newspaper"
          size={32}
          color={activeItemId ? 'white' : 'gray'}
          onPress={activeItemId ? () => handleDetailsModal() : undefined}
          />
        <Feather name="phone-call" size={32} color={activeItemId ? "white" : "gray"} onPress={activeItemId ? () => makeCall() : undefined} />
      </View>

      {/* MODAL */}
      <Modal visible={visibleDetails} animationType='slide' transparent={false}>
        {activeItemId && <ModalComponent list={ordersList} activeItemId={activeItemId} handleModal={handleDetailsModal}  />}
      </Modal>

      {/* SIRALAMA MODALI */}
      <Modal visible={visibleSettings} transparent={false}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => {setVisibleSettings(false)
            setSelectedFilter(null)
            setSelectedSortType(null)}}
            style={styles.closeButton}>
            <Text style={{ fontSize: 20, color: 'black' }}>X</Text>
          </TouchableOpacity>
          <View style={{justifyContent:'center',alignItems:'center',width:400,height:200}}>
            <Image source={require('../../../assets/yazilim_logo.png')} style={{height:'50%',width:'50%'}} ></Image>
            <Text style={{fontWeight:'bold'}}>SİPARİŞLER</Text>
          </View>
          <CustomSelectList data={filterSelectListData} placeHolder='Ölçüt Seçiniz' title='Sıralama Ölçütü' setSelected={setSelectedFilter}/>
          <CustomSelectList data={sortTypeSelectListData} placeHolder='Tür Seçiniz' title='Sıralama Türü' setSelected={setSelectedSortType}/>
          <CustomPressable title='UYGULA' onPress={handleSettingsModal} minWidth={150}/>
        </View>
      </Modal>

    </View>
  );
};

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
    width: '90%',
    height:'70%',
    borderRadius: 30,
    borderWidth:2,
    borderColor:'darkblue',
    margin:'5%',
    marginTop:'20%',
    justifyContent:'center',
    alignItems:'center'
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
});

export default OrdersScreen;