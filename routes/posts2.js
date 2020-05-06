

var express  = require("express");
var router   = express.Router();
var Post2     = require("../models/Post2");
var util     = require("../util");
var User     = require("../models/User");


// Index
router.get("/index", function(req, res){
  Post2.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts2){
    if(err) return res.json(err);
    res.render("posts2/index", {posts2:posts2});
  });
});

// posts/Index
router.get("/posts2/index", function(req, res){
  Post2.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts2){
    if(err) return res.json(err);
    res.render("posts2/index", {posts2:posts2});
  });
});

// New
router.get("/new", util.isLoggedin, function(req, res){
  var post2 = req.flash("post2")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("posts2/new", { post2:post2, errors:errors });
});

// create
router.post("/", util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  Post2.create(req.body, function(err, post2){
    if(err){
      req.flash("post2", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts2/new");
    }
    res.redirect("/posts2/index");
  });
});

// show
router.get("/:id", function(req, res){
  Post2.findOne({_id:req.params.id})
  .populate("author")
  .exec(function(err, post2){
    if(err) return res.json(err);
    res.render("posts2/show", {post2:post2});
  });
});

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function(req, res){
  var post2 = req.flash("post2")[0];
  var errors = req.flash("errors")[0] || {};
  if(!post2){
    Post1.findOne({_id:req.params.id}, function(err, post2){
      if(err) return res.json(err);
      res.render("posts2/edit", { post2:post2, errors:errors });
    });
  } else {
    post2._id = req.params.id;
    res.render("posts2/edit", { post2:post2, errors:errors });
  }
});

// update
router.put("/:id", util.isLoggedin, checkPermission, function(req, res){
  req.body.updatedAt = Date.now();
  Post1.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash("post2", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts2/"+req.params.id+"/edit");
    }
    res.redirect("/posts2/"+req.params.id);
  });
});

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, function(req, res){
  Post1.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts2/index");
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
