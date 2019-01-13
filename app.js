//------------------------------------------------------------------------------
//  Packages
//------------------------------------------------------------------------------

var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var express    = require("express");
var app        = express();

var passport      = require("passport");
var LocalStrategy = require("passport-local");

//------------------------------------------------------------------------------
//  App Configurations
//------------------------------------------------------------------------------

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//------------------------------------------------------------------------------
//  Database Configurations
//------------------------------------------------------------------------------

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");

//
// Testing comments.
//
var seed = require("./seed.js");
seed();

//------------------------------------------------------------------------------
//  Passport Configurations
//------------------------------------------------------------------------------

app.use(require("express-session")({
    secret: "Imagine reading a post, but over the course of it the quality seems to deteriorate and it gets wose an wose, where the swenetence stwucture and gwammer rewerts to a pwoint of uttew non swence, an u jus dont wanna wead it anymwore (o´ω｀o) awd twa wol owdewl",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 
// Pass req.user to every route as middleware.
// 
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//------------------------------------------------------------------------------
//  Campground Routes
//------------------------------------------------------------------------------

//
// Landing Route: welcome page.
//
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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
});

//
// New Route: show form to create a new campground.
//
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

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
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//------------------------------------------------------------------------------
//  Comment Routes
//------------------------------------------------------------------------------

//
// New Route: show form to create new comment for a campground.
//
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

//------------------------------------------------------------------------------
//  Authentication Routes
//------------------------------------------------------------------------------

// 
// Register: New Route
// 
app.get("/register", function(req, res) {
    res.render("register");
});

// 
// Register: Create route
// 
app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, createdUser) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

// 
// Login: New route
// 
app.get("/login", function(req, res) {
    res.render("login");
});

// 
// Login: Create route
// 
app.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res) {
    
});

// 
// Logout Route
// 
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
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

//------------------------------------------------------------------------------
//  Cloud9 Port
//------------------------------------------------------------------------------

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up!");
})