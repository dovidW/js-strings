
var fs = require("fs");

var jsStrings = require('..').jsStrings;

var jsstr = fs.readFileSync(__dirname + "/js-test.js") + ''; 
  
var list = jsStrings(jsstr);

console.log(list);