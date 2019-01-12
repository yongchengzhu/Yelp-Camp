//-------------------------------------------
//  Packages
//-------------------------------------------

var express    = require("express");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var app        = express();

//-------------------------------------------
//  App Configurations
//-------------------------------------------

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//-------------------------------------------
//  Database Configurations
//-------------------------------------------

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

var Campground = require("./models/campground.js");

//
// Testing comments.
//
var seed = require("./seed.js");
seed();

//-------------------------------------------
//  Routes
//-------------------------------------------

app.get("/", function(req, res) {
    res.render("landing");
})

//
// Index Route: show all campgrounds.
//
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err)
        {
            console.log("Cannot find all campgrounds:");
            console.log(err);
        }
        else
        {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
})

//
// Create Route: add new campground to database.
//
app.post("/campgrounds", function(req, res) {
    // Get data from form, and store them as an object into newCampground.
    var name          = req.body.name;
    var image         = req.body.image;
    var description   = req.body.description;
    var newCampground = {
        name: name, 
        image: image,
        description: description
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
})

//
// New Route: show form to create a new campground.
//
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})

//
// Show Route: show information for one campground.
//    - WARN: Do NOT place this route above '/campgrounds/new'.
//
app.get("/campgrounds/:id", function(req, res) {
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
            res.render("show", {campground: foundCampground});
        }
    });
})

//-------------------------------------------
//  Cloud9 Port
//-------------------------------------------

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up!");
})