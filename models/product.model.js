const mongoose=require('mongoose')

const ProSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number
    },
    category:{
        type:String,
        required:true
    },
    picture:{
        type:String
    },
    addedOn:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        default:'active'
    },
    addedBy:{
        type:String
    }
})



module.exports=mongoose.model('product',ProSchema)