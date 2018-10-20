//-------------------------------------------
//  Packages
//-------------------------------------------

var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//-------------------------------------------
//  Connect to MongoDB
//-------------------------------------------

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

//-------------------------------------------
//  Schema Setup
//-------------------------------------------

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//-------------------------------------------
//  Routes
//-------------------------------------------

app.get("/", function(req, res) {
    res.render("landing");
})

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err)
        {
            console.log("Cannot find all campgrounds:");
            console.log(err);
        }
        else
        {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
})

app.post("/campgrounds", function(req, res) {
    // Get data from form, and store them as an object into newCampground.
    var name  = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    
    // Create new Campground
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

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})

//-------------------------------------------
//  Cloud9 Port
//-------------------------------------------

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up!");
})