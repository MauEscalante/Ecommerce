import axios from "axios";
import {
  PAYPAL_API,
  HOST,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
  STRIPE_SECRET,
  SECRET_JWT
} from "../config.js";
import Stripe from "stripe"
import Product from "../models/Product.js";
const stripe=new Stripe(STRIPE_SECRET)
import jwt from "jsonwebtoken";
import Sales from "../models/Sales.js";




///////////////////PAYPAL//////////////////
export const createOrder = async (req, res) => {
  try {
    const cartProducts=req.body;
    let id=0

    //obtener usuario a travez del token
    const decodedToken = jwt.verify(req.headers["x-access-token"], SECRET_JWT); 
    // El ID del usuario estará disponible en la información decodificada del token
    const userId = decodedToken.userId;

    const newSale = new Sales({
        buyer_id: userId,
        amount:0,
        products:[]
    });
    
    const carrito=[]
    for (const product of cartProducts) {
        id++;
  
        // Obtener la información del producto desde la base de datos
        const productInfo = await Product.findById(product.id, { price: 1 });
        const productPrice=productInfo.price*product.cantidad

        //actualizo el json
        newSale.products.push({
            productId: product.id,
            quantity: product.cantidad
        });

        newSale.amount += productPrice;
  
        // Crear el objeto correspondiente para purchase_units
        const unit = {
          reference_id: id,
          amount: {
            currency_code: "USD",
            value: productPrice,
          },
          quantity: product.cantidad
        };
  
        carrito.push(unit);
      }

    // Guardar el documento newSale en la base de datos  
    const savedSale=await newSale.save();
    const saleId=savedSale._id
    

    const order = {
      intent: "CAPTURE",
      
      purchase_units: carrito,
      
      application_context: {
        brand_name: "marify.com",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",

        return_url: `${HOST}/payment/capture-paypal-order`,
        cancel_url: `${HOST}/payment/cancel-paypal-order/${saleId}`,
      },
    };
    console.log(order.purchase_units)
    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");


    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

   
    // make a request//////////
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    
    console.log(response.data);

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something goes wrong");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log("response ",response.data)
    console.log("purchase paymentes ", response.data.purchase_units[1].payments.captures[0]);
    console.log("purchase ", response.data.purchase_units[0].shipping);

    res.sendStatus(200)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const cancelPayment = async (req, res) => {
    try{
        const {saleId} = req.params
        const deletedSale = await Sales.findByIdAndDelete(saleId);
        res.send({success:false,message:"Pago cancelado" });
    }catch(error){
        console.log(error)
    }
    
}


///////////////////Stripe//////////////////
export const createSession=async (req,res)=>{
  try{
      const cartProducts=req.body;

    //obtener usuario a travez del token
    const decodedToken = jwt.verify(req.headers["x-access-token"], SECRET_JWT); 
    // El ID del usuario estará disponible en la información decodificada del token
    const userId = decodedToken.userId;

    const newSale = new Sales({
        buyer_id: userId,
        amount:0,
        products:[]
    });

      let carrito=[]
      for (const item of cartProducts) {
        // Obtener información del producto desde la base de datos
        const productInfo = await Product.findById(item.id);
        const productPrice=productInfo.price*item.cantidad
        // Construir el objeto de producto para el line_items
        const productForLineItem = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: productInfo.name,
                },
                unit_amount: productPrice * 100,
            },
            quantity: item.cantidad,
        };

      //actualizo el json
      newSale.products.push({
        productId: item.id,
        quantity: item.cantidad
      });
      
      //actualizo el monto de la venta
      newSale.amount += productPrice;

    // Agregar el producto al carrito
    carrito.push(productForLineItem);
  }
  // Guardar el documento newSale en la base de datos  
  const savedSale=await newSale.save();
  const saleId=savedSale._id
  
  const session=await stripe.checkout.sessions.create({
    line_items:carrito,
  
    mode:"payment",
    success_url:`${HOST}/payment/success`,
    cancel_url: `${HOST}/payment/cancel/${saleId}`
  })
  return res.json({url:session.url})
  }catch(error){
    return res.status(500).json({ message: error });
  }
}

export const paymentSuccess=(req,res)=>{
  return res.status(200)
}

export const paymentCancel=async (req,res)=>{
  const {saleId} = req.params
  const deletedSale = await Sales.findByIdAndDelete(saleId);
  return res.status(400).json({message:"El usuario cancelo la solicitud"})
}


