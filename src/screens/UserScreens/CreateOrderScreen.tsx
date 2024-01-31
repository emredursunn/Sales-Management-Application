  import { Alert, FlatList, Image, Keyboard, Modal, StyleSheet, Text, View } from 'react-native'
  import React, { useState } from 'react'
  import { IdandQuantity, Order, Product } from '../../types/types'
  import products from '../../utils/products.json'
  import { useSelector } from 'react-redux'
  import { RootState } from '../../redux/store'
  import { useDispatch } from 'react-redux'
  import { addOrder } from '../../redux/orderSlice'
  import { CustomPressable, CustomTextInput, CustomSelectList } from '../../components/CustomComponents'
  import { AntDesign } from '@expo/vector-icons';
  import { decreaseStock } from '../../redux/stockSlice'


  //SİPARİŞ ALMA SAYFASI. SEPETE STOK KONTROLÜ YAPILIP ÜRÜN EKLENİYOR.
  //ARDINDAN SİPARİŞİN BİLGİLERİ SEÇİLİP REDUX'A KAYDEDİLİYOR.
  const CreateOrderScreen = () => {

    const dispatch = useDispatch()

    const [visible, setVisible] = useState<boolean>(false)

    //sepete eklenen ürünler
    const [addedProducts, setAddedProducts]  = useState<IdandQuantity[]>([])

    const [date, setDate] = useState<Date>(new Date())


    const orderList = useSelector((state: RootState) => state.orders.orderList);
    const stockList = useSelector((state: RootState) => state.stock.stockList)

    // Check if orderList is not empty
    const orderId = orderList.length > 0 ? parseInt(orderList[orderList.length - 1].orderId) + 1 : 1;


    //customer selectlist için data
    const customers = useSelector((state: RootState) => state.customers.customerList)
    const [customerId, setCustomerId] = useState<string |null>(null)
    const customerData = customers.map((customer) => ({ key: customer.customerId, value: customer.fullname }));  
    
    //durumlar selectlist için data
    const [status, setStatus] = useState<string | null>(null)
    const statustData = ['Kargolandı','Teslim Edildi',"İşlemde"]

    //ürünler selectlist için data
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
    const productsData = products.map((product) => ({key: product.productId, value:product.productName}))
    const [quantity, setQuantity] = useState<number>(0)


    //sepet tutarını hesaplıyor
    const totalPrice = addedProducts.reduce((total, iaq) => {
      const product = products.find((p: Product) => p.productId === iaq.productId);
      if (product) {
        return total + product.productPrice * iaq.productQuantity;
      }
      return total;
    }, 0);


    const addProduct = () => {
      //üründen sepette var mı diye kontrollüyoruz
      if(quantity < 1){
        Alert.alert("Adeti doğru giriniz")
      }
      else{
        if (selectedProductId) {
          const stock = stockList.find((s) => s.productId === selectedProductId)?.productQuantity
          const existProduct = addedProducts.find((p) => p.productId === selectedProductId);
          if(stock){
            //ÜRÜN DAHA ÖNCE EKLENDİ İSE
            if (existProduct) {
              if((existProduct.productQuantity + quantity) <= stock){
                setAddedProducts((prevProducts) =>
                  prevProducts.map((p) =>
                    p.productId === selectedProductId
                      ? { ...p, productQuantity: p.productQuantity + quantity }
                      : p
                  )
                );
              }else{
                Alert.alert(`ÜRÜN STOĞU YETERSİZ \n Maksimum: ${stock}`)
              }
            }else {
              //ÜRÜN İLK KEZ EKLENİYOR İSE
              if(quantity<=stock){
                const iaq: IdandQuantity = { productId: selectedProductId, productQuantity: quantity };
                setAddedProducts((prevProducts) => [...prevProducts, iaq]);
              }else{
                Alert.alert(`ÜRÜN STOĞU YETERSİZ \n Maksimum: ${stock}`)
              }
            }
          }else{
            Alert.alert("STOK TÜKENDİ!")
          }
        }else{
          Alert.alert("Ürün Seçiniz!")
        }
        Keyboard.dismiss();
      };
    }
      
      const deleteProduct = (product:IdandQuantity) => {
        const updatedProducts = addedProducts.filter((p) => p.productId != product.productId)
        setAddedProducts(updatedProducts)
      }


    //siparişi oluşturuyoruz
    const createNewOrder = () => {
      if(customerId && status){     
        const order : Order = {
          customerId: customerId,
          totalPrice: totalPrice,
          date: date.toLocaleDateString(),
          status: status,
          products: addedProducts,
          orderId: orderId.toString()
        }

        dispatch(addOrder(order))
        
        //STOK AZALTMA İŞLEMİ
        addedProducts.every((iaq) => 
          dispatch(decreaseStock({
          productId:iaq.productId,
          productQuantity:(iaq.productQuantity)
        }))  )

        setVisible(false)
        Alert.alert("Sipariş oluşturuldu!")
        setQuantity(0)
        setAddedProducts([])
        setStatus(null)
        setCustomerId(null)
      }
      else{
        Alert.alert("Bilgileri eksiksiz giriniz!")
      }
    }

    const RenderItem = ({ item }: { item: IdandQuantity }) => {
      const product = products.find((product) => product.productId === item.productId);
      return (
        <View style={{flexDirection:'row'}}>
          <AntDesign style={{marginRight:20,marginBottom:20}} name="delete" size={24} color="red" onPress={() =>  {deleteProduct(item)
          console.log(addedProducts)}} />
          <Text>
            {product ? (
              `${item.productQuantity} X ${product.productName} : ${item.productQuantity * product.productPrice}`
              ) : (
                'Invalid Product'
                )}
          </Text> 
        </View>
      );
    };
    
    

    return (
        <View style={styles.container}>

          <View style={{justifyContent:'center',alignItems:'center',height:100,width:200}}>
            <Image source={require('../../../assets/yazilim_logo.png')} style={{height:'50%',width:'50%'}} ></Image>
            <Text style={{fontWeight:'bold'}}>ÜRÜN EKLEME</Text>
          </View>       

          <View style= {{marginTop:20}}>
            <CustomSelectList
              title={'Ürün Giriniz'} 
              data={productsData} 
              placeHolder='Ürün Seçiniz'
              setSelected={(selectedValue) => setSelectedProductId(selectedValue) }
            />
          </View>

          
        <View style={styles.addSection}>
          <CustomTextInput
            title='Adet: '
            isSecureText={false}
            placeHolder='Adet Giriniz'
            value={quantity.toString()}
            onChangeText={(newQuantity) => {
              const parsedQuantity = newQuantity === '' ? 0 : parseInt(newQuantity, 10);
              setQuantity(parsedQuantity)}}
              style={[{ inputContainer: styles.inputContainer }, {label:{color:'black',fontSize:15,marginRight:50}}]}
              keyboardType='numeric'
          />

          <CustomPressable title='ÜRÜN EKLE' onPress={addProduct} />
        </View>

        <Modal visible={visible} transparent={false} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={{justifyContent:'center',alignItems:'center',height:100,width:200,marginBottom:50}}>
            <Image source={require('../../../assets/yazilim_logo.png')} style={{height:'50%',width:'100%'}} ></Image>
            <Text style={{fontWeight:'bold'}}>ÜRÜN EKLEME</Text>
          </View>  
          <CustomSelectList
            title={'Müşteri İsmi'}
            data={customerData}
            placeHolder='Müşteri Seçiniz'
            setSelected={(selectedValue) => {
              setCustomerId(selectedValue);
            }}
          />
          <CustomSelectList
            title={'Sipariş Durumu'}
            data={statustData}
            placeHolder='Durum Seçiniz'
            setSelected={(selectedValue) => {
              setStatus(selectedValue);
            }}
          />
          <CustomPressable title='Tamamla' minWidth={150}
          onPress={() => createNewOrder()}/>
        </View>
      </Modal>

        <View style={styles.bottom}>
          {addedProducts.length === 0 ? (
            <Text style={{ fontSize: 20 }}>SEPET BOŞ</Text>
          ) : (
            <View style={{borderWidth:1,borderColor:'darkblue'}}>
              <FlatList data={addedProducts} renderItem={RenderItem} />
              <CustomPressable title='SİPARİŞ OLUŞTUR' onPress={() => setVisible(true)} />
            </View>
          )}
        </View>

      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: 'linen',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
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
    addSection: {
      marginBottom: 20,
      padding: 16,
      borderRadius: 8,
    },
    bottom: {
      flex: 2,
      marginTop: 20,
      padding: 16,
      borderRadius: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      width: '60%',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 30,
    },
    image:{
      width: '100%',
      height: 100,
      marginTop:20,
      resizeMode: 'contain',
    },
  });

  export default CreateOrderScreen

