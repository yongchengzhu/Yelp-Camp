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
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
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

router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("./comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    });
});

router.put("/:comment_id", function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
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