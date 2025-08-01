// routes/wishlist.js
const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing");
const { isLoggedIn } = require("../middleware");

// Add to wishlist
router.post("/wishlists/add", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.body;
    const user = req.user;
    
    if (!user.wishlist.includes(listingId)) {
      user.wishlist.push(listingId);
      await user.save();
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Remove from wishlist
router.post("/wishlists/remove", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.body;
    const user = req.user;
    
    user.wishlist = user.wishlist.filter(id => id.toString() !== listingId);
    await user.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// View wishlist page
router.get("/wishlists", isLoggedIn, async (req, res) => {
  try {
    const user = await req.user.populate("wishlist");
    res.render("profileContent/wishlist.ejs", { listings: user.wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    req.flash("error", "Failed to load wishlist");
    res.redirect("/Listings");
  }
});

router.get("/profile", (req,res)=>{
    res.render("profileContent/profile.ejs")
})

module.exports = router;