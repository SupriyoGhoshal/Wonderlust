require("dotenv").config(); // ✅ Ensure environment variables are loaded
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

const User = require("./Models/users.js"); // ✅ Adjusted relative path
const Listing = require("./Models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("./middleware.js");

// -------------------- App Setup --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// -------------------- DB Connection --------------------
const DB_URL = process.env.MONGO_URL;
async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectDB();

// -------------------- Session & Flash --------------------
const sessionConfig = {
  secret: process.env.SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: DB_URL }),
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// // -------------------- Passport --------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// // -------------------- Flash Middleware --------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  res.send("Hi, you entered the root path.");
});
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const wishlist = require("./routes/wishlist.js")

app.use("/Listings", listingRouter)
app.use("/Listings/:id/reviews", reviewRouter)
app.use("/",userRouter)
app.use("/", wishlist)


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("errors.ejs", { message });
});

// -------------------- Server --------------------
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

