
export type Customer = {
    customerId:string,
    fullname: string,
    age:number,
    phone: string,
}

export type Order = {
    orderId:string,
    customerId:string,
    products: IdandQuantity[],
    totalPrice:number,
    status:string,
    date:string,
}

export type Product = {
    productId:string,
    productName:string,
    productPrice:number,
}

export type IdandQuantity= {
    productId:string,
    productQuantity:number
}