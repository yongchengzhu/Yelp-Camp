var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user.js");

//
// Landing Route: welcome page.
//
router.get("/", function(req, res) {
    res.render("landing");
})

// 
// Register: New Route
// 
router.get("/register", function(req, res) {
    res.render("register");
});

// 
// Register: Create route
// 
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, createdUser) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

// 
// Login: New route
// 
router.get("/login", function(req, res) {
    res.render("login");
});

// 
// Login: Create route
// 
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res) {
    
});

// 
// Logout Route
// 
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// 
// Middleware
// 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;