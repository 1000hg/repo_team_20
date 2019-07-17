
var fs = require("fs");

var bad = fs.readFileSync("욕설 필터.txt","utf8")

var replaceMap = {"1":"&"};
var repRegExp = new RegExp(Object.keys(replaceMap).join("|"), "gi");
function replaceFunc(str){
	return replaceMap[str];
}
 
str = str.replace(repRegExp, replaceFunc);

console.log(str)