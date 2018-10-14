//-------------------------------------------
//  Packages
//-------------------------------------------

var express = require("express");
var app     = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//-------------------------------------------
//  Routes
//-------------------------------------------

var campgrounds = [
        {name: "Salmon Creek", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104496f9c271a0ebb7bb_340.jpg"},
        {name: "Granite Hill", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f9c271a0ebb7bb_340.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"}
    ];

app.get("/", function(req, res) {
    res.render("landing");
})

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", function(req, res) {
    // Get data from form, and push to 'campgrounds' array.
    var name  = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    
    // Redirect and to '/campgrounds'.
    res.redirect("/campgrounds");
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