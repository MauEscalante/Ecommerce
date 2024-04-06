import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const salesSchema=new Schema({
    buyer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    amount:Number,
    products:[{
        _id: false,
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity:Number
    }]
    
},{
    timestamps:true,
    versionKey:false
})

export default model("Sales",salesSchema)