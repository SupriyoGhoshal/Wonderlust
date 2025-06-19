// const express = require("express");
// const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../Models/listing.js");
// const Nodemailer = require("nodemailer")
// const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
// const router = express.Router();


// // Render contact form
// router.get("/contact", (req, res) => {
//   res.render("listings/contact.ejs");
// });

// // Set up transporter (Example using Gmail SMTP)
// const transporter = Nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,        // your email address
//     pass: process.env.EMAIL_PASS         // your app password or email password
//   }
// });

// // Handle form submission
// router.post("/contact", wrapAsync(async (req, res) => {
//   const { firstname, lastname, email, subject, message } = req.body;

//   if (!firstname || !lastname || !email || !message) {
//     req.flash("error", "All fields are required.");
//     return res.redirect("/contact");
//   }

//   const mailOptions = {
//     from: email,
//     to: process.env.EMAIL_USER, // your email to receive the contact message
//     subject: subject || `New Contact Form Submission from ${firstname} ${lastname}`,
//     text: `
//       Name: ${firstname} ${lastname}
//       Email: ${email}
//       Message: ${message}
//     `
//   };

//   await transporter.sendMail(mailOptions);
//   req.flash("success", "Thank you for reaching out! We'll get back to you soon.");
//   res.redirect("/contact");
// }));

// // Index route
// router.get("/", async (req, res) => {
//   const AllListings = await Listing.find({});
//   res.render("listings/index.ejs", { AllListings });
// });

// // New listing route 
// router.get("/new",
//     isLoggedIn,
//      (req, res) => {
//   res.render("listings/new.ejs");
// });

// // // Show route
// router.get("/:id",
//     isLoggedIn,
//      wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id)
//   .populate("reviews").populate("owner");
//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist!");
//     res.redirect("/Listings")
//   }
//   res.render("listings/show.ejs", { listing });
// }));

// // Create route for listings
// router.post("/new",
//     isLoggedIn, validateListing,
//     wrapAsync(async (req, res) => {
//   const list = new Listing(req.body.listing);
//   await list.save();
//   req.flash("success", "New Listing Created");
//   res.redirect("/Listings");
// }));
 
// // Edit route
// router.get("/:id/edit",
//     isLoggedIn,isOwner,
//      wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("success", "Listing you requested for doesnot exist!");
//     res.redirect("/Listings")
//   }
//   res.render("listings/edit.ejs", { listing });
// }));

// // Update route
// router.put("/:id",
//     isLoggedIn,isOwner,validateListing,
//      wrapAsync(async (req, res) => {
//   let { id } = req.params;

//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success", "Listing is Updated");
//   res.redirect(`/Listings/${id}`);
// }));

// // Delete route
// router.delete("/:id",
//     isLoggedIn,isOwner,
//      wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let deleted = await Listing.findByIdAndDelete(id);
//   console.log(deleted);
//   req.flash("success", "Listing Deleted");
//   res.redirect("/Listings");
// }));

// module.exports=router;






const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const nodemailer = require("nodemailer");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const router = express.Router();

// Configure Nodemailer transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS // App password or email password
  }
});

// Render contact form
router.get("/contact", (req, res) => {
  res.render("listings/contact.ejs");
});

// Handle contact form submission
router.post(
  "/contact",
  wrapAsync(async (req, res) => {
    const { firstname, lastname, email, subject, message } = req.body;

    // Basic validation
    if (!firstname || !lastname || !email || !message) {
      req.flash("error", "All fields are required.");
      return res.redirect("/contact");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error", "Invalid email address.");
      return res.redirect("/contact");
    }

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Your email to receive the contact message
      subject: subject || `New Contact Form Submission from ${firstname} ${lastname}`,
      text: `
        Name: ${firstname} ${lastname}
        Email: ${email}
        Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    req.flash("success", "Thank you for reaching out! We'll get back to you soon.");
    res.redirect("/contact");
  })
);

// Index route - Show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
  })
);

// New listing route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show route - Display a specific listing
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/Listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Create route - Add a new listing
router.post(
  "/new",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const list = new Listing(req.body.listing);
    list.owner = req.user._id; // Associate with logged-in user
    await list.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/Listings");
  })
);

// Edit route - Render edit form for a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/Listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update route - Update an existing listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/Listings/${id}`);
  })
);

// Delete route - Delete a specific listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/Listings");
  })
);

module.exports = router;
