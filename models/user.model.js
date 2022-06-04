const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String
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



module.exports=mongoose.model('user',UserSchema)