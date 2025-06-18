const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {validateReview} = require("../middleware.js")

const router = express.Router({mergeParams: true});

// Reviews Route
// Post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!")
    res.redirect(`/Listings/${listing._id}`);
  }));
  
// Delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/Listings/${id}`);
}));

module.exports = router;
