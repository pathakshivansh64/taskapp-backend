const mongoose=require('mongoose');
require('dotenv').config({path:'./.env'})


const connecttoMongo= async ()=>{
   await mongoose.connect(`${process.env.MongoUri}`).then(()=>{
      console.log('connnected to mongo successfully');
    }).catch((e)=>console.log("error",e))


}

module.exports=connecttoMongo;