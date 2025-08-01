const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string, required } = require("joi");

const DEFAULT_IMAGE_URL = "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=";

const listingSchema = new Schema({
  // firstname: {
  //   type: String,
  //   required: true,
  // },
  // lastname: {
  //   type: String,
  //   required : true,
  // },
  // email:{
  //   type: String,
  //   required: true,
  // },
  // subject:{
  //   type: String,
  //   required: true,
  // },
  // message:{
  //   type: String,
  //   required: true,
  // },
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: DEFAULT_IMAGE_URL,
      set: function (v) {
        return v === "" ? DEFAULT_IMAGE_URL : v;
      }
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Listing'
    }
  ]

}, { timestamps: true });

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
