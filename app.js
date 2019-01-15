//------------------------------------------------------------------------------
//  Packages
//------------------------------------------------------------------------------

var methodOverride = require("method-override");
var LocalStrategy  = require("passport-local");
var bodyParser     = require("body-parser");
var passport       = require("passport");
var mongoose       = require("mongoose");
var express        = require("express");
var app            = express();

//------------------------------------------------------------------------------
//  App Configurations
//------------------------------------------------------------------------------

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

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

// 
// Seed the database.
// 
// seed();

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
//  Routes Configuration
//------------------------------------------------------------------------------

var campgroundRoutes = require("./routes/campground.js");
var commentRoutes    = require("./routes/comment.js");
var indexRoutes      = require("./routes/index.js");

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

//------------------------------------------------------------------------------
//  Cloud9 Port
//------------------------------------------------------------------------------

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up!");
})