import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import ModalComponent from "../../components/ModalComponent";
import { View } from "react-native";
import TableComponent from "../../components/TableComponent";
import { CustomPressable, CustomTextInput } from "../../components/CustomComponents";
import { AntDesign, Ionicons     } from '@expo/vector-icons';
import { addCustomer, deleteCustomer } from "../../redux/customerSlice";
import { Customer } from "../../types/types";
import { Feather } from '@expo/vector-icons';
import {Linking} from 'react-native'
import { useNavigation } from "@react-navigation/native";

//MÜŞTERİLER BU SAYFADA GÖSTERİLİYOR.EKLEME VE SİLME İŞLEMLERİ YAPILABİLİYOR.
const CustomersScreen = () => {

    const navigation = useNavigation()

    //REDUX'TAN ALINAN MÜŞTERİ LİSTESİ
    const customers = useSelector((state: RootState) => state.customers.customerList)
    const dispatch = useDispatch()
    
    const tableHead = ['Id','Fullname','Age','Phone']
    const [tableData, setTableData] = useState<string[][]>([])

    //ARAMA ÇUBUĞU İÇİN
    const [searchText,setSearchText] = useState<string>("")

    //SEÇİLEN SATIRDAKİ OBJENİN ID'Sİ
    const [activeItemId,setActiveItemId] = useState<string | null>(null)

    const [visibleDetailsModal,setVisibleDetailsModal] = useState<boolean>(false)
    const [visibleNewCustomerModal, setVisibleNewCustomerModal] = useState<boolean>(false)

    //YENİ MÜŞTERİ YARATMAK İÇİN 
    const [name,setName] = useState<string>("")
    const [surname, setSurname] = useState("");
    const [age,setAge] = useState<string>("")
    const [phone,setPhone] = useState<string>("")
    
    //CUSTOMERS'I REDUXTAN ALIP KAYDEDİYORUZ
    useEffect(() => {
        const newData = customers.map((c) =>{
            if(c.fullname.toLowerCase().includes(searchText.toLowerCase()) || c.phone.includes(searchText)){
               return [c.customerId,c.fullname,c.age.toString(),c.phone]
            }
            return []
        })
        .filter((row) => row.length > 0)
        setTableData(newData)
    }, [customers, searchText])


    //İSİM SOYİSİM İÇİN SADECE HARFLERE İZİN VERİLİYOR
    const handleNameChange = (text:string) => {
      const onlyLetters = text.replace(/[^A-Za-z]/g, '');
      setName(onlyLetters);
    };
    const handleSurnameChange = (text:string) => {
      const onlyLetters = text.replace(/[^A-Za-z]/g, '');
      setSurname(onlyLetters);
    };

    const handleDetailModal = () => {
        setVisibleDetailsModal(!visibleDetailsModal)
    }

    const handleAddingCustomerModal = () => {
      setVisibleNewCustomerModal(!visibleNewCustomerModal)
      setName("")
      setSurname("")
      setAge("")
      setPhone("") 
    }

    
    const makeCall = () => {
      const activeCustomer = customers.find((c) => c.customerId === activeItemId);
    
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
    
    //REDUX'TAN MÜŞTERİ SİLME
    const deleteItem = () => {
        dispatch(deleteCustomer(activeItemId))
        setActiveItemId(null)
    }
    
    //REDUX'A MÜŞTERİ EKLEME
    const addItem = () => {
      let newCustomerId;

      if (customers.length > 0) {
        newCustomerId = parseInt(customers[customers.length - 1].customerId) + 1;
      } else {
        newCustomerId = 1;
      }
      if (age  && name  && surname  && phone ) {
        if (parseInt(age) > 18) {
          if (phone[0] !== "0" && phone.length === 10){
            const isPhoneExists = customers.some((c) => c.phone === "+90" + phone)
            if(!isPhoneExists){
              const newCustomer: Customer = {
                customerId: newCustomerId.toString(),
                fullname: name + " " + surname,
                age: parseInt(age),
                phone: "+90" + phone
              };
              dispatch(addCustomer(newCustomer));
              Alert.alert("Müşteri başarıyla Eklendi");
              handleAddingCustomerModal()
            }else{
              Alert.alert("Bu numara zaten kayıtlı!")
            }
          }else{
            Alert.alert("Geçerli bir numara giriniz!")
          }
        }else {
          Alert.alert("18 yaşından küçükler kayıt olamaz");
        }
      }else {
        Alert.alert("Bilgileri eksiksiz Giriniz!");
      }
    };
    

    return (
        <View style={styles.container}>
    
          {/*  HEADER BAR- SEARCH BAR AND ADD CUSTOMER BUTTON  */}
          <View style={{flexDirection:'row',alignItems:'center'}}>

            <AntDesign name="search1" size={20} color="gray" style={{marginTop:32}}/>
            <CustomTextInput title='' 
            placeHolder='Müşteri İsmi | Telefon Numarası'
            value={searchText} 
            onChangeText={setSearchText}
            isSecureText={false} 
            style={[{inputContainer: {margin:20,marginLeft:5,marginBottom:10,minWidth:250}}, {label:{fontWeight:500, marginBottom:10}}]}/>
            <AntDesign name="adduser" size={40} color="darkblue" onPress={handleAddingCustomerModal} style={{marginTop:20,paddingLeft:20}} />
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
                name="deleteuser"
                size={32}
                color={activeItemId ? 'white' : 'black'} 
                onPress={activeItemId ? () => deleteItem() : undefined} />
            <Ionicons
             name="information-circle-outline" 
             size={32} 
             color={activeItemId ? 'white' : 'black'} 
             onPress={activeItemId ? () => handleDetailModal() : undefined}/>
             <Feather name="phone-call" size={32} color={activeItemId ? "white" : "black"} onPress={activeItemId ? () => makeCall() : undefined} />
          </View>
    
          {/* MÜŞTERİ DETAY MODALI */}
          <Modal visible={visibleDetailsModal} animationType='slide' transparent={false}>
            {activeItemId && <ModalComponent list={customers} activeItemId={activeItemId} handleModal={handleDetailModal}  />}
          </Modal>

          {/*   YENİ MÜŞTERİ EKLEME MODALI */   }
          <Modal visible={visibleNewCustomerModal} animationType='slide' transparent={false}>
            <View style={styles.modalContainer}>

              <TouchableOpacity onPress={handleAddingCustomerModal} style={styles.closeButton}>
                <Text style={{ fontSize: 20, color: 'black' }}>X</Text>
              </TouchableOpacity>

                <View style={{justifyContent:'center',alignItems:'center',height:100}}>
                  <Image source={require('../../../assets/yazilim_logo.png')} style={{height:'50%',width:'50%'}} ></Image>
                  <Text style={{fontWeight:'bold'}}>YENİ MÜŞTERİ KAYDI</Text>
                </View>

                <CustomTextInput title="Ad : " isSecureText={false}  onChangeText={handleNameChange} value={name} placeHolder="Ad" keyboardType="ascii-capable" style={[{inputContainer: {maxWidth:250,margin:10}}, {label:{marginBottom:5}}]} />
                <CustomTextInput title="Soyad : " isSecureText={false}  onChangeText={handleSurnameChange} value={surname} placeHolder="Soyad" keyboardType="ascii-capable" style={[{inputContainer: {maxWidth:250,margin:10}}, {label:{marginBottom:5}}]} />
                <CustomTextInput title="Yaş : " isSecureText={false}  onChangeText={setAge} value={age} placeHolder="Yaş" keyboardType="number-pad" style={[{inputContainer: {maxWidth:250,margin:10}}, {label:{marginBottom:5}}]}/>
                <CustomTextInput title="Numara : " isSecureText={false} onChangeText={setPhone} value={phone} placeHolder="5554567890 (Sıfırla başlamayınız)" keyboardType="number-pad" style={[{inputContainer: {maxWidth:250,margin:10}}, {label:{marginBottom:5}}]}/>
                <View style={{alignItems:'center'}}>
                <CustomPressable title="Kaydet" onPress={addItem} width={200}/>
              </View>
            </View>
          </Modal>
    
        </View>
      );
    };
    
export default CustomersScreen
    
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
    height:'70%',
    margin: '10%',
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
});


