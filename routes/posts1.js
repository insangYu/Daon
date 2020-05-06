

var express  = require("express");
var router   = express.Router();
var Post1     = require("../models/Post1");
var util     = require("../util");
var User     = require("../models/User");


// Index
router.get("/index", function(req, res){
  Post1.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts1){
    if(err) return res.json(err);
    res.render("posts1/index", {posts1:posts1});
  });
});

// posts/Index
router.get("/posts1/index", function(req, res){
  Post1.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts1){
    if(err) return res.json(err);
    res.render("posts1/index", {posts1:posts1});
  });
});

// New
router.get("/new", util.isLoggedin, function(req, res){
  var post1 = req.flash("post1")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("posts1/new", { post1:post1, errors:errors });
});

// create
router.post("/", util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  Post1.create(req.body, function(err, post1){
    if(err){
      req.flash("post1", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts1/new");
    }
    res.redirect("/posts1/index");
  });
});

// show
router.get("/:id", function(req, res){
  Post1.findOne({_id:req.params.id})
  .populate("author")
  .exec(function(err, post1){
    if(err) return res.json(err);
    res.render("posts1/show", {post1:post1});
  });
});

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function(req, res){
  var post1 = req.flash("post1")[0];
  var errors = req.flash("errors")[0] || {};
  if(!post1){
    Post1.findOne({_id:req.params.id}, function(err, post1){
      if(err) return res.json(err);
      res.render("posts1/edit", { post1:post1, errors:errors });
    });
  } else {
    post1._id = req.params.id;
    res.render("posts1/edit", { post1:post1, errors:errors });
  }
});

// update
router.put("/:id", util.isLoggedin, checkPermission, function(req, res){
  req.body.updatedAt = Date.now();
  Post1.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash("post1", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts1/"+req.params.id+"/edit");
    }
    res.redirect("/posts1/"+req.params.id);
  });
});

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, function(req, res){
  Post1.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts1/index");
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  Post1.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}
