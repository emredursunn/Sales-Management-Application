import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Customer, IdandQuantity, Order } from "../types/types";
import products from '../utils/products.json'
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Feather } from '@expo/vector-icons';


type Props = {
  list:Order[] | Customer[],
  activeItemId:string,
  handleModal: () => void
}


const ModalComponent = ({ list, activeItemId, handleModal }: Props) => {

    //Liste Dolu boş kontrolü
    if (list.length === 0) {
        return null;
    }
    
    //ORDERLİST VEYA CUSTOMERLİSTE GÖRE KENDİNİ DÜZENLİYOR.
    return (
        'orderId' in list[0] ? (
        isOrderArray(list) && RenderOrderDetailsAndProducts(list,activeItemId,handleModal)
        ) : (
          isCustomerArray(list) && RenderCustomerDetails(list, activeItemId,handleModal)
        )
    );
}
  
export default ModalComponent

const isOrderArray = (list: Order[] | Customer[]): list is Order[] => {
    return 'orderId' in list[0];
  };

const isCustomerArray = (list:Order[] | Customer[]) : list is Customer[] => {
return 'customerId' in list[0]
}

const RenderCustomerDetails = (list:Customer[], activeItemId:string, handleModal: () => void) => {
    const customer = list.find((c) => c.customerId === activeItemId)
    return(
        <View style={[styles.modalContainer, {justifyContent:'center', maxHeight:300,marginTop:100}]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleModal}>
            <Text>X</Text>
          </TouchableOpacity>

          <View style={{justifyContent:'center',alignItems:'center',height:100,paddingBottom:30}}>
              <Image source={require('../../assets/yazilim_logo.png')} style={{height:'50%',width:'50%'}} ></Image>
              <Text style={{fontWeight:'bold'}}>MÜŞTERİ BİLGİLERİ</Text>
            </View>

            <View style={{flexDirection:'row',marginLeft:30}}>
              <View style={{marginRight:8}}>
                <Text style={styles.textStyle}>Id: </Text>
                <Text style={styles.textStyle}>İsim: </Text>
                <Text style={styles.textStyle}>Yaş: </Text>
                <Text style={styles.textStyle}>İletişim: </Text>
              </View>
              <View>
                <Text style={styles.textStyle}>{customer?.customerId}</Text>
                <Text style={styles.textStyle}>{customer?.fullname}</Text>
                <Text style={styles.textStyle}>{customer?.age}</Text>
                <Text style={styles.textStyle}>{customer?.phone}</Text>
              </View>
            </View>
        </View>
    )
}

const RenderOrderDetailsAndProducts = (list: Order[], activeItemId: string, handleModal: () => void) => {
  const order = list.find((order: Order) => order.orderId === activeItemId);
  const customers = useSelector((state: RootState) => state.customers.customerList);
  const customerName = customers.find((c: Customer) => c.customerId === order?.customerId)?.fullname;

  const getTotalProductCount = (order: Order): number => {
    return order.products.reduce((total, product) => total + product.productQuantity, 0);
  };

  const renderProducts = () => {
    return order?.products.map((item: IdandQuantity) => {
      const product = products.find((p) => p.productId === item.productId);
      return product ? (
        <View key={item.productId}>
          <Text>
            {item.productQuantity} X {product.productName} : {item.productQuantity * product.productPrice}
          </Text>
        </View>
      ) : null;
    });
  };

  return (
    <View style={styles.modalContainer}>

      <View style={{justifyContent:'center',alignItems:'center',height:100}}>
        <Image source={require('../../assets/yazilim_logo.png')} style={{height:'50%',width:'50%'}} ></Image>
        <Text style={{fontWeight:'bold'}}>SİPARİŞ DETAYLARI</Text>
      </View>
      <View style={styles.modalHeader}>
        
        <Text>Sipariş No: {activeItemId} </Text>
        {customerName && <Text>Müşteri: {customerName} </Text>}
        {order && <Text>Sipariş Tarihi: {order.date}</Text>}
        {order && <Text>Sipariş Detayı: {getTotalProductCount(order)} Ürün, {order.status}</Text>}
        {order && <Text>Toplam: {order.totalPrice.toString()} </Text>}
      </View>
        <TouchableOpacity onPress={handleModal} style={styles.closeButton}>
          <Text style={{ fontSize: 20, color: 'black' }}>X</Text>
        </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.productsListStyle}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}> ÜRÜN LİSTESİ </Text>
        {renderProducts()}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'linen',
    width: '80%',
    height:'70%',
    margin: '10%',
    borderRadius: 10,
    borderWidth:2,
    borderColor:'darkblue', 
  },
  modalHeader:{
    backgroundColor:'white',
    margin:5,
    marginTop:50,
    padding:8,
  },
  productsListStyle: {
    paddingVertical: 5,
    paddingHorizontal:15,
    backgroundColor:'white',
    margin:5,
    marginTop:50,
    padding:8,
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
  textStyle: {
    fontSize:20
  }
})
