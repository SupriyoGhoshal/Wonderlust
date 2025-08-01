const mongoose = require("mongoose");
require("dotenv").config()
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
const MONGO_URL = process.env.MONGO_URL
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68525d2730707c34c09c6db4"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();