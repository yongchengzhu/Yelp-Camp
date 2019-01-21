var express = require("express");
var router = express.Router();

var Campground = require("../models/campground.js");
var middleware = require("../middleware");

//
// Index Route: show all campgrounds.
//
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err)
        {
            console.log("Cannot find all campgrounds:");
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
})

//
// Create Route: add new campground to database.
//
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Get data from form, and store them as an object into newCampground.
    var name          = req.body.name;
    var price         = req.body.price;
    var image         = req.body.image;
    var description   = req.body.description;
    var author        = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };
    
    Campground.create(newCampground, function(err, campground) {
        if (err)
        {
            console.log("Cannot create campground:");
            console.log(err);
        }
        else
        {
            // Redirect and to '/campgrounds'.
            res.redirect("/campgrounds");
        }
    });
});

//
// New Route: show form to create a new campground.
//
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//
// Show Route: show information for one campground.
//    - WARN: Do NOT place this route above '/campgrounds/new'.
//
router.get("/:id", function(req, res) {
    // 
    // Note: "comments" is in lowercase; referencing the 'key' inside a campground object.
    // 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err)
        {
            console.log("Cannot find Campground ID:");
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// 
// Edit Route: edit campground information.
// 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // 
    // If user is logged in.
    // 
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// 
// Update Route: update campground information.
// 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// 
// Delete Route: destroy this campground.
// 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, removedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;