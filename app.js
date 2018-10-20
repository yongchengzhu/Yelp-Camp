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
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//-------------------------------------------
//  Temporary method to create new entries.
//-------------------------------------------

// Campground.create({
//     name       : "Granite Hill",
//     image      : "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f0c179a6e8bdbd_340.jpg",
//     description: "This is a huge granite hill, no bathrooms, no water, beautiful granite!"
// }, function(err, campground) {
//     if (err)
//     {
//         console.log("Cannot create new campground:")
//         console.log(err);
//     }
//     else
//     {
//         console.log("New campground is created:")
//         console.log(campground);
//     }
// })

//-------------------------------------------
//  Routes
//-------------------------------------------


app.get("/", function(req, res) {
    res.render("landing");
})

// Index Route: show all campgrounds.
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

// Create Route: add new campground to database.
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

// New Route: show form to create a new campground.
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})

// Show Route: show information for one campground.
// * Important note - Do NOT place this above /campgrounds/new.
app.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    
    Campground.findById(id, function(err, foundCampground) {
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