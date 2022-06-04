const mongoose=require('mongoose')

const CatSchema=new mongoose.Schema({
    description:{
        type:String
    },
    name:{
        type:String,
        unique:true
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



module.exports=mongoose.model('category',CatSchema)