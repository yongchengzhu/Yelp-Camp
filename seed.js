var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

var seeds = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
];

function seedDB() {
    Campground.deleteMany({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Removed all campgrounds.");
            
            Comment.deleteMany({}, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Removed all comments.");
                    
                    seeds.forEach(function(seed) {
                        //
                        // Create a campground.
                        //
                        Campground.create(seed, function(err, createdCampground) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Created: " + createdCampground.name);
                                //
                                // Create a comment under each created campground.
                                //
                                Comment.create({
                                    text: "This place is great, but I wish there was internet.",
                                    author: "Homer"
                                }, function(err, createdComment) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("Created: " + createdComment.text);
                                        //
                                        // Push this comment into Campground.comments, then save it.
                                        //
                                        createdCampground.comments.push(createdComment);
                                        createdCampground.save(function(err, savedCampground) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                console.log("Successfully saved comments into " + createdCampground.name);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = seedDB;