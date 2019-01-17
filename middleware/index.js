var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // 
    // If user is logged in.
    // 
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                res.redirect("back");
            }
            else {
                // 
                // If the user owns this campground.
                //    * Check if campground.author.id matches user._id.
                // 
                if (foundCampground.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    res.redirect("back");
                };
            }
        });
    }
    else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // 
    // Check if user is logged in.
    // 
    if (req.isAuthenticated()) {
        // 
        // Check if user id matches comment id.
        // 
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                if (req.user._id.equals(foundComment.author.id)) {
                    return next();
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "Please log in first.");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;