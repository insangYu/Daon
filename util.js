var util = {};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message:"이미 존재하는 아이디 입니다." };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.getDate = function(dateObj){
  if(dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
}

util.getTime = function(dateObj){
  if(dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
}

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash("errors", {login:"로그인 해주세요!"});
    res.redirect("/needlogin");
  }
}

util.noPermission = function(req, res){
  req.flash("errors", {login:"권한이 없습니다"});
  req.logout();
  res.redirect("/needlogin");
}

module.exports = util;

// private functions
function get2digits (num){
  return ("0" + num).slice(-2);
}
