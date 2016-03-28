
exports.jsStrings = jsStrings;

var spaceChar = {' ':true,'\n':true,'\r':true};
var tokenChar = {};
"(:[-*&^%-+/!~|=;".split('').forEach( function(c){
    tokenChar[c] = true;
});
var escapeMap = { 'n':'\n','t':'\t','s':'\s','r':'\r' , 'v':"\v","b":'\b','f':'\f'};
    
function jsStrings(str){
    var len = str.length;
    
    var listStrings = [];
    var status = onCode;
    var ss = false;
    for(var i = 0; i < len ; i++){
        var char = str[i];
        status(char,i,str);
    }
    
    function onCode(char,i,str){
        if(char == '"' || char == "'" || char == "`"){
            ss = {};
            ss.start = i+1;
            ss.q = char;
            ss.content = '';
            status = onString;
            return;
        }
        
        if(char == "/"){
            status = onSlash;
            status(char,i,str);
        }
    }
    
    
    function onSlash(char,i,str){
        var nextChar = str[i+1];
        
        if(nextChar == "/"){
            status = onComment1;
            return;
        }
        
        if(nextChar == "*"){
            ss = 1;
            status = onComment2;
            return;
        } 
        
        var j = i-1;
        while(spaceChar[str[j]]) j--;
        if(tokenChar[str[j]] || j==0){
            status = onRegex;
        }else{
            status = onCode;
        }
    }
    
    function onRegexEscape(char,i,str){
        status = onRegex;
    }
    
    function onRegex(char,i,str){
        if(char === "\\"){
            status = onRegexEscape;
        }
        if(char === "/"){
            status = onCode;
        }
    }
    
    function onComment1(char,i,str){
        if(char == "\n" ||  char == "\r"){
            status = onCode;
        }
    }

    function onComment2(char,i,str){
        if(ss == 1) return ss = false;
        if(ss == 2) {
            status = onCode;
            ss = false;
        }
        if(char === "*" &&  str[i+1] === "/"){
            ss = 2;
        }
    }
    
    function onString(char,i,str){
        if(char == "\\"){
            status = onEscape;
            return;
        }
            
        if(ss.q == char){
            ss.end = i;
            listStrings.push(ss);
            ss = false;
            status = onCode;
            return;
        }
        ss.content += char;
    }
    

    function onEscape(char,i,str){
        if(ss.escapeObj){
            ss.escapeObj.c += char;
            if(ss.escapeObj.c.length >= ss.escapeObj.l ){
                status = onString;
                ss.content += String.fromCharCode(parseInt(ss.escapeObj.c,16));
                delete ss.escapeObj;
            }
        }else if(char == "x" || char == "u"){
            ss.escapeObj = {};
            ss.escapeObj.l = ( char == "x" ? 2 : 4 );
            ss.escapeObj.t = char;
            ss.escapeObj.c = '';
        }else{
            ss.content += escapeMap[char] || char;
            status = onString;
        }
    }
    
    
    
    
    return listStrings;
}