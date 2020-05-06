var express = require("express");
var router  = express.Router();
var passport= require("../config/passport");
var User     = require("../models/User");
var util     = require("../util");

// Home
router.get("/", function(req, res){
  res.render("home/index");
});
router.get("/about", function(req, res){
  res.render("home/about");
});

router.get("/dictionary", function(req, res){
  res.render("home/dictionary");
});

router.get("/community", function(req, res){
  res.render("home/community");
});

router.get("/map", function(req, res){
  res.render("home/map");
});

router.get("/application", util.isLoggedin, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err){
      return res.json(err);
    } 
    res.render("home/application", {user:user});
  });
});

router.get("/application_ex1", function(req, res){
  res.render("home/application_ex1");
});

router.get("/application_write", function(req, res){
  res.render("home/application_write");
});

router.get("/schedule", util.isLoggedin, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err){
      return res.json(err);
    } 
    res.render("home/schedule", {user:user});
  });
});

router.get("/calendar", util.isLoggedin, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err){
      return res.json(err);
    } 
    res.render("home/calendar", {user:user});
  });
});


router.get("/search", util.isLoggedin, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err){
      return res.json(err);
    } 
    res.render("home/search", {user:user});
  });
});

router.get("/result", function(req, res){
  res.render("home/result");
});

router.get("/chat", util.isLoggedin, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err){
      return res.json(err);
    } 
    res.render("home/chat", {user:user});
  });
});

// create
router.post("/new", function(req, res){
  User.create(req.body, function(err, user){
    if(err){
      req.flash("user", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/new");
    }
    res.redirect("/");
  });
});

// Logout
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// Login
router.get("/login", function (req,res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    username:username,
    errors:errors
  });
});

// Login
router.get("/needlogin", function (req,res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/needlogin", {
    username:username,
    errors:errors
  });
});

// Post Login
router.post("/login",
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = "아이디를 입력해 주세요";
    }
    if(!req.body.password){
      isValid = false;
      errors.password = "비밀번호를 입력해 주세요";
    }

    if(isValid){
      next();
    } else {
      req.flash("errors",errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    successRedirect : "/",
    failureRedirect : "/login"
  }
));

module.exports = router;

// private functions
function checkPermission(req, res, next){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    if(user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}




