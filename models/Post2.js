//헌팅턴병

var mongoose = require("mongoose");
var util     = require("../util");

// schema
var postSchema2 = mongoose.Schema({
  title:{type:String, required:[true,"Title is required!"]},
  body:{type:String, required:[true,"Body is required!"]},
  author:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true}
});

// virtuals
postSchema2.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

postSchema2.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

postSchema2.virtual("updatedDate")
.get(function(){
  return util.getDate(this.updatedAt);
});

postSchema2.virtual("updatedTime")
.get(function(){
  return util.getTime(this.updatedAt);
});

// model & export
var Post2 = mongoose.model("post2", postSchema2);
module.exports = Post2;
