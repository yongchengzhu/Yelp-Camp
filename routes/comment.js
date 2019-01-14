var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");

//
// New Route: show form to create new comment for a campground.
//
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// 
// Create Route: add new comment to database.
// 
router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, createdComment) {
                if (err) {
                    res.redirect("/campgrounds");
                }
                else {
                    foundCampground.comments.push(createdComment);
                    foundCampground.save(function(err, savedCampground) {
                        if (err) {
                            res.redirect("/campgrounds");
                        }
                        else {
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
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