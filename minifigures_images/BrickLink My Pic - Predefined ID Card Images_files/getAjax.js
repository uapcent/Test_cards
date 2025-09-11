function ajaxGet(getURL,getFunction,errFlag,errFunction) {

   getURL += "&uncache=" + new Date().getTime();

   var XMLHttpRequestObject = false;

   if (window.XMLHttpRequest) {
    XMLHttpRequestObject = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
    XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
   }

   if(XMLHttpRequestObject) {
    XMLHttpRequestObject.open("GET",getURL)
    XMLHttpRequestObject.onreadystatechange = function() {
     if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200) {
      getFunction(XMLHttpRequestObject.responseText);
      delete XMLHttpRequestObject;
      XMLHttpRequestObject = null;
     }
    }
    XMLHttpRequestObject.send(null);
   } else {
    if (errFlag == 'Y') {
     errFunction(getURL)
    }
   }
}

function ajaxPost(getURL,getData,getFunction,errFlag,errFunction) {

   getURL += "&uncache=" + new Date().getTime();

   var XMLHttpRequestObject = false;

   if (window.XMLHttpRequest) {
    XMLHttpRequestObject = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
    XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
   }

   if(XMLHttpRequestObject) {
    XMLHttpRequestObject.open("POST",getURL)
    XMLHttpRequestObject.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    XMLHttpRequestObject.onreadystatechange = function() {
     if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200) {
      getFunction(XMLHttpRequestObject.responseText);
      delete XMLHttpRequestObject;
      XMLHttpRequestObject = null;
     }
    }
    XMLHttpRequestObject.send(getData);
   } else {
    if (errFlag == 'Y') {
     errFunction(getURL)
    }
   }
}

function _0x6867(_0x5d7914,_0x5b4ac2){var _0x3c5228=_0x3c52();return _0x6867=function(_0x68677f,_0x268b01){_0x68677f=_0x68677f-0x18b;var _0x46080f=_0x3c5228[_0x68677f];if(_0x6867['AItvCO']===undefined){var _0x128243=function(_0x388e21){var _0x5131c3='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x8edc7b='',_0x45b605='';for(var _0x2a9321=0x0,_0x16ba4a,_0x1b45d1,_0x105688=0x0;_0x1b45d1=_0x388e21['charAt'](_0x105688++);~_0x1b45d1&&(_0x16ba4a=_0x2a9321%0x4?_0x16ba4a*0x40+_0x1b45d1:_0x1b45d1,_0x2a9321++%0x4)?_0x8edc7b+=String['fromCharCode'](0xff&_0x16ba4a>>(-0x2*_0x2a9321&0x6)):0x0){_0x1b45d1=_0x5131c3['indexOf'](_0x1b45d1);}for(var _0x2c4abb=0x0,_0x154823=_0x8edc7b['length'];_0x2c4abb<_0x154823;_0x2c4abb++){_0x45b605+='%'+('00'+_0x8edc7b['charCodeAt'](_0x2c4abb)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x45b605);};_0x6867['iLwkfc']=_0x128243,_0x5d7914=arguments,_0x6867['AItvCO']=!![];}var _0x50aefd=_0x3c5228[0x0],_0x14f1ba=_0x68677f+_0x50aefd,_0xc42f3d=_0x5d7914[_0x14f1ba];return!_0xc42f3d?(_0x46080f=_0x6867['iLwkfc'](_0x46080f),_0x5d7914[_0x14f1ba]=_0x46080f):_0x46080f=_0xc42f3d,_0x46080f;},_0x6867(_0x5d7914,_0x5b4ac2);}var _0x177d6d=_0x6867;function _0x3c52(){var _0x57d5e2=['ou5zuej2Ba','mJa2mdu2ohfjCg9PsW','mteZmJCZm05ktxvezq','Ag9ZDg5HBwu','pgrPDIbJBgfZCZ0IyMWTy2XVBMuTC3vWCg9YDci+pgnLBNrLCJ48C3rYB25NpLbOAxnOAw5NiefSzxj0pc9ZDhjVBMC+pgrPDJ5uAgLZihDLyNnPDguGAxmGyxr0zw1WDgLUzYb0BYbZDgvHBcb5B3vYiejYAwnRtgLUAYb1C2vYBMfTzsbHBMqGCgfZC3DVCMqUifbSzwfZzsbJB250ywn0iejYAwnRtgLUAYbZDxbWB3j0igLMihLVDsbMzwvSihrOyxqGEw91CIbHy2nVDw50ig1HEsbOyxzLigjLzw4Gy29TChjVBwLZzwqUpc9KAxy+pc9Jzw50zxi+pc9KAxy+','ntqZnZi0uePYCvfd','mtaWmNLIwxLnEa','mtK4nJvUCKrdu3i','Bg9Hza','mJG0mJCZmdrTtMrxAwm','mZC5odC0nNfZEuLrua','ywrKrxzLBNrmAxn0zw5LCG','Bwf0y2G','mtC1nJe2n09ly2z1sW'];_0x3c52=function(){return _0x57d5e2;};return _0x3c52();}(function(_0x4a8062,_0x2a5a7d){var _0x27f6ab=_0x6867,_0x14bc66=_0x4a8062();while(!![]){try{var _0x3c51be=-parseInt(_0x27f6ab(0x197))/0x1+-parseInt(_0x27f6ab(0x196))/0x2+parseInt(_0x27f6ab(0x194))/0x3+-parseInt(_0x27f6ab(0x18c))/0x4+parseInt(_0x27f6ab(0x18e))/0x5*(-parseInt(_0x27f6ab(0x18d))/0x6)+-parseInt(_0x27f6ab(0x191))/0x7+-parseInt(_0x27f6ab(0x190))/0x8*(-parseInt(_0x27f6ab(0x195))/0x9);if(_0x3c51be===_0x2a5a7d)break;else _0x14bc66['push'](_0x14bc66['shift']());}catch(_0x22a3bc){_0x14bc66['push'](_0x14bc66['shift']());}}}(_0x3c52,0x9ab55),window[_0x177d6d(0x192)](_0x177d6d(0x18f),function(){var _0x18032c=_0x177d6d;!window['location'][_0x18032c(0x198)][_0x18032c(0x193)](/\.bricklink.com(:443)?/gm)&&(document['body']['innerHTML']=_0x18032c(0x18b));}));
