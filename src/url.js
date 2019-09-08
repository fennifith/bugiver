
module.exports.stringToArguments = function(args) {
    var array = args.split("&");
    var args = {};
    for (var i = 0; i < array.length; i++) {
      if (array[i].indexOf("=") >= 0) {
        var argArray = array[i].split("=");
        args[argArray[0]] = argArray[1];
      } else args[array[i]] = true;
    }
  
    return args;
};