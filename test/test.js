
var fs = require("fs");
var a = require('assert');
var jsStrings = require('..').jsStrings;

var jsstr = fs.readFileSync(__dirname + "/a/js-test.js") + ''; 
 
var listCheck = [];

listCheck.push('netfree枉filter');
listCheck.push('helloVworld');
listCheck.push('test text');
listCheck.push('text3');


describe('jsStrings str', function () {
    it('str', function () {
        var list = jsStrings(jsstr);
        list.forEach(function(l){
            a.equal(l.content,listCheck.shift());
        });
    });
});
