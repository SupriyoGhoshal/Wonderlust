
const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing= require("../Models/listing.js");

const MONGO_UR= "mongodb://127.0.0.1:27017/airbnb";
main().then(() =>{
    console.log("connected to db");
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_UR);
}
const initDB = async() => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("done");
}

initDB();
