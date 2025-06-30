const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirecturl } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../Models/users.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome, you are signed up!");
            res.redirect("/login");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// router.post("/login",saveRedirecturl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),wrapAsync(async (req, res) => {
//         req.flash("success", "Welcome, you are logged in!");
//         const redirectUrl = res.locals.redirectUrl || "/listings";
//         res.redirect(redirectUrl);
//     })
// );
// router.post("/login", async (req,res)=>{
//     const {id, email, password} = req.body;

//     if(!email) req.flash("error", "Please enter email");
//     const user = await User.findById(id);
//     if(user.password == password) {
//         res.redirect("/listings");
//         req.flash("success", "Welcome, you are logged in!");
//     }
// })

router.post(
    "/login",
    saveRedirecturl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome, you are logged in!");
        const redirectUrl = res.locals.redirectUrl || "/Listings";
        res.redirect(redirectUrl);
    }
);


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/Listings");
    });
});



module.exports = router;






// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const { saveRedirecturl } = require("../middleware");
// const wrapAsync = require("../utils/wrapAsync");
// const User = require("../Models/users.js");

// // Render signup form
// router.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// });

// // Handle signup logic
// router.post(
//     "/signup",
//     wrapAsync(async (req, res, next) => {
//         try {
//             const { username, email, password } = req.body;
//             const newUser = new User({ username, email });
//             const registeredUser = await User.register(newUser, password); // Passport-local-mongoose handles hashing

//             req.login(registeredUser, (err) => {
//                 if (err) return next(err);
//                 req.flash("success", "Welcome, you are signed up!");
//                 res.redirect("/Listings");
//             });
//         } catch (err) {
//             req.flash("error", err.message);
//             res.redirect("/signup");
//         }
//     })
// );

// // Render login form
// router.get("/login", (req, res) => {
//     res.render("users/login.ejs");
// });

// // Handle login logic
// router.post(
//     "/login",
//     saveRedirecturl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true,
//     }),
//     (req, res) => {
//         req.flash("success", "Welcome back!");
//         const redirectUrl = res.locals.redirectUrl || "/Listings";
//         res.redirect(redirectUrl);
//     }
// );

// // Logout route
// router.get("/logout", (req, res, next) => {
//     req.logout((err) => {
//         if (err) return next(err);
//         req.flash("success", "You have been logged out.");
//         res.redirect("/Listings");
//     });
// });

// module.exports = router;
