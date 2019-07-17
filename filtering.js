var fs = require('fs'); 
var exports = module.exports

String.prototype.replaceAll = function(org, dest) {
	return this.split(org).join(dest);
}
String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}

var yokOb = fs.readFileSync('욕설 필터.txt','utf8').split(",").reverse(); 
var msg;
var prMsg;
var exMsg;
var msgArray =[];

var revHex;
var revDec;

exports.filtering = function(__){

	msg = __;
	prMsg = msg;
	
	for(var q = 0; q < 10; q++) {
		prMsg = prMsg.replaceAll(q, '');
	}
	
	prMsg = prMsg.replace(/\s/g, '');
	prMsg = prMsg.replace(/\n/g, '');
	prMsg = prMsg.replace(/\r/g, '');
	prMsg = prMsg.replace(/@/g, '');
	
	
	for(var q = 0; q < msg.length; q++){
    
        //console.log(msg.charAt(q));
        
        revHex = escape(msg.charAt(q).toString(16));
        //console.log(revHex);
        if(revHex.charAt(1) == 'u'){
            revDev = parseInt(revHex.replace('%u', ''), 16);
            //console.log(revDev);
        }
        else if(revHex.charAt(0) == '%'){
            revDev = parseInt(revHex.replace('%', ''), 16);
            //console.log(revDev);
        }
        else{
            revDev = parseInt(revHex, 16);
        }
	
		if(revDev < 44032 || revDev > 55295) {
		
            prMsg = prMsg.replace(msg.charAt(q), '');
            //console.log((q+1) + "번째 삭제 완료 " + prMsg);
		
		}
	
	}
	
	filtering();
    
    return msg;
}

function filtering() {

	var val;
	
	if(comp() == true){

		for(var a = 0; a < msg.length; a++){
			if(msg.charAt(a) == exMsg.charAt(0)){
				val = a;
				a = 10;
			}
		}

        //맞으면 끝.
        while(msg.charAt(val) != exMsg.charAt(exMsg.length-1)) {

            //console.log(msg.charAt(val) + " " + exMsg.charAt(exMsg.length-1));
            msg = msg.replaceAt(val, "*");

            val++;

        }

        //console.log(msg.charAt(val) + " " + exMsg.charAt(exMsg.length-1));
        msg = msg.replaceAt(val, "*");
		
	}
	

}

function comp() { 
	for(var i = 0; i < yokOb.length; i++) { 
		//°É·ÈÀ» ¶§ 
		if(prMsg.indexOf(yokOb[i]) != -1){ 
			exMsg = yokOb[i]; 
			return true; 
		} 
	} 
	//¾È °É·ÈÀ» ¶§ 
	return false; 
}

//console.log(tmp("개!!새끼야"));