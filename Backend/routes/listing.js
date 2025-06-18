const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const router = express.Router();

// Index route
router.get("/", async (req, res) => {
  const AllListings = await Listing.find({});
  res.render("listings/index.ejs", { AllListings });
});

// New listing route 
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
router.get("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/Listings")
  }
  res.render("listings/show.ejs", { listing });
}));

// Create route for listings
router.post("/new",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const list = new Listing(req.body.listing);
  await list.save();
  req.flash("success", "New Listing Created");
  res.redirect("/Listings");
}));

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    // throw new ExpressError(404, "Listing not found");
    // req.flash("success", "Listing you requested for doesnot exist!");
    res.redirect("/Listings")
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // req.flash("success", "Listing is Updated");
  res.redirect(`/Listings/${id}`);
}));

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  // req.flash("success", "Listing Deleted");
  res.redirect("/Listings");
}));

module.exports=router;