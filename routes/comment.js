var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");
var middleware = require("../middleware");

//
// New Route: show form to create new comment for a campground.
//
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, createdComment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
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
                            req.flash("success", "Successfully crearted comment!");
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});

// 
// Edit Route: show form to edit comment.
// 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("./comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    });
});

// 
// Update Route: save editted comment.
// 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
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
// Delete Route: delete a comment.
// 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req ,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment) {
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
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     else {
//         res.redirect("/login");
//     }
// }

// function checkCommentOwnership(req, res, next) {
//     // 
//     // Check if user is logged in.
//     // 
//     if (req.isAuthenticated()) {
//         // 
//         // Check if user id matches comment id.
//         // 
//         Comment.findById(req.params.comment_id, function(err, foundComment) {
//             if (err) {
//                 res.redirect("back");
//             }
//             else {
//                 if (req.user._id.equals(foundComment.author.id)) {
//                     return next();
//                 }
//             }
//         });
//     }
//     else {
//         res.redirect("back");
//     }
// }

module.exports = router;