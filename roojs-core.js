

 





window["undefined"] = window["undefined"];



var  Roo = {}; 



 
Roo.apply = function(o, c, A){
    if(A){
        
        Roo.apply(o, A);
    }
    if(o && c && typeof  c == 'object'){
        for(var  p  in  c){
            o[p] = c[p];
        }
    }
    return  o;
};


(function(){
    var  B = 0;
    var  ua = navigator.userAgent.toLowerCase();

    var  C = document.compatMode == "CSS1Compat",
        D = ua.indexOf("opera") > -1,
        E = (/webkit|khtml/).test(ua),
        F = ua.indexOf("msie") > -1,
        G = ua.indexOf("msie 7") > -1,
        H = !E && ua.indexOf("gecko") > -1,
        I = F && !C,
        J = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1),
        K = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1),
        L = (ua.indexOf("linux") != -1),
        M = window.location.href.toLowerCase().indexOf("https") === 0;

    
	if(F && !G){
        try{
            document.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }


    Roo.apply(Roo, {
        

        isStrict : C,
        

        isSecure : M,
        

        isReady : false,
        

        
        debug: false,

        

        enableGarbageCollector : true,

        

        enableListenerCollection:false,

        

        SSL_SECURE_URL : "javascript:false",

        

        BLANK_IMAGE_URL : "http:/"+"/localhost/s.gif",

        emptyFn : function(){},

        

        applyIf : function(o, c){
            if(o && c){
                for(var  p  in  c){
                    if(typeof  o[p] == "undefined"){ o[p] = c[p]; }
                }
            }
            return  o;
        },

        

        addBehaviors : function(o){
            if(!Roo.isReady){
                Roo.onReady(function(){
                    Roo.addBehaviors(o);
                });
                return;
            }
            var  N = {}; 
            for(var  b  in  o){
                var  parts = b.split('@');
                if(parts[1]){ 
                    var  s = parts[0];
                    if(!N[s]){
                        N[s] = Roo.select(s);
                    }

                    N[s].on(parts[1], o[b]);
                }
            }

            N = null;
        },

        

        id : function(el, O){
            O = O || "roo-gen";
            el = Roo.getDom(el);
            var  id = O + (++B);
            return  el ? (el.id ? el.id : (el.id = id)) : id;
        },
         
       
        

        extend : function(){
            
            var  io = function(o){
                for(var  m  in  o){
                    this[m] = o[m];
                }
            };
            return  function(sb, sp, P){
                if(typeof  sp == 'object'){ 
                    P = sp;
                    sp = sb;
                    sb = function(){sp.apply(this, arguments);};
                }
                var  F = function(){}, sbp, spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new  F();
                sbp.constructor=sb;
                sb.superclass=spp;
                
                if(spp.constructor == Object.prototype.constructor){
                    spp.constructor=sp;
                   
                }

                
                sb.override = function(o){
                    Roo.override(sb, o);
                };
                sbp.override = io;
                Roo.override(sb, P);
                return  sb;
            };
        }(),

        

        override : function(P, Q){
            if(Q){
                var  p = P.prototype;
                for(var  method  in  Q){
                    p[method] = Q[method];
                }
            }
        },
        

        namespace : function(){
            var  a=arguments, o=null, i, j, d, rt;
            for (i=0; i<a.length; ++i) {
                d=a[i].split(".");
                rt = d[0];
                

                eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
                for (j=1; j<d.length; ++j) {
                    o[d[j]]=o[d[j]] || {};
                    o=o[d[j]];
                }
            }
        },
        

         
        factory : function(c, ns)
        {
            
            if (!c.xtype   || (!ns && !c.xns) ||  (c.xns === false)) { 
                return  c;
            }

            ns = c.xns ? c.xns : ns; 
            if (c.constructor == ns[c.xtype]) {
                return  c;
            }
            if (ns[c.xtype]) {
                if (Roo.debug) Roo.log("Roo.Factory(" + c.xtype + ")");
                var  ret = new  ns[c.xtype](c);
                ret.xns = false;
                return  ret;
            }

            c.xns = false; 
            return  c;
        },
         

        log : function(s)
        {
            if ((typeof(console) == 'undefined') || (typeof(console.log) == 'undefined')) {
                return; 
            }

            console.log(s);
            
        },
        

        urlEncode : function(o){
            if(!o){
                return  "";
            }
            var  R = [];
            for(var  key  in  o){
                var  ov = o[key], k = encodeURIComponent(key);
                var  type = typeof  ov;
                if(type == 'undefined'){
                    R.push(k, "=&");
                }else  if(type != "function" && type != "object"){
                    R.push(k, "=", encodeURIComponent(ov), "&");
                }else  if(ov  instanceof  Array){
                    if (ov.length) {
	                    for(var  i = 0, len = ov.length; i < len; i++) {
	                        R.push(k, "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
	                    }
	                } else  {
	                    R.push(k, "=&");
	                }
                }
            }

            R.pop();
            return  R.join("");
        },

        

        urlDecode : function(S, T){
            if(!S || !S.length){
                return  {};
            }
            var  U = {};
            var  V = S.split('&');
            var  W, X, Y;
            for(var  i = 0, len = V.length; i < len; i++){
                W = V[i].split('=');
                X = decodeURIComponent(W[0]);
                Y = decodeURIComponent(W[1]);
                if(T !== true){
                    if(typeof  U[X] == "undefined"){
                        U[X] = Y;
                    }else  if(typeof  U[X] == "string"){
                        U[X] = [U[X]];
                        U[X].push(Y);
                    }else {
                        U[X].push(Y);
                    }
                }else {
                    U[X] = Y;
                }
            }
            return  U;
        },

        

        each : function(Z, fn, f){
            if(typeof  Z.length == "undefined" || typeof  Z == "string"){
                Z = [Z];
            }
            for(var  i = 0, len = Z.length; i < len; i++){
                if(fn.call(f || Z[i], Z[i], i, Z) === false){ return  i; };
            }
        },

        
        combine : function(){
            var  as = arguments, l = as.length, r = [];
            for(var  i = 0; i < l; i++){
                var  a = as[i];
                if(a  instanceof  Array){
                    r = r.concat(a);
                }else  if(a.length !== undefined && !a.substr){
                    r = r.concat(Array.prototype.slice.call(a, 0));
                }else {
                    r.push(a);
                }
            }
            return  r;
        },

        

        escapeRe : function(s) {
            return  s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
        },

        
        callback : function(cb, g, h, n){
            if(typeof  cb == "function"){
                if(n){
                    cb.defer(n, g, h || []);
                }else {
                    cb.apply(g, h || []);
                }
            }
        },

        

        getDom : function(el){
            if(!el){
                return  null;
            }
            return  el.dom ? el.dom : (typeof  el == 'string' ? document.getElementById(el) : el);
        },

        

        getCmp : function(id){
            return  Roo.ComponentMgr.get(id);
        },
         
        num : function(v, q){
            if(typeof  v != 'number'){
                return  q;
            }
            return  v;
        },

        destroy : function(){
            for(var  i = 0, a = arguments, len = a.length; i < len; i++) {
                var  as = a[i];
                if(as){
                    if(as.dom){
                        as.removeAllListeners();
                        as.remove();
                        continue;
                    }
                    if(typeof  as.purgeListeners == 'function'){
                        as.purgeListeners();
                    }
                    if(typeof  as.destroy == 'function'){
                        as.destroy();
                    }
                }
            }
        },

        
        

        type : function(o){
            if(o === undefined || o === null){
                return  false;
            }
            if(o.htmlElement){
                return  'element';
            }
            var  t = typeof  o;
            if(t == 'object' && o.nodeName) {
                switch(o.nodeType) {
                    case  1: return  'element';
                    case  3: return  (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if(t == 'object' || t == 'function') {
                switch(o.constructor) {
                    case  Array: return  'array';
                    case  RegExp: return  'regexp';
                }
                if(typeof  o.length == 'number' && typeof  o.item == 'function') {
                    return  'nodelist';
                }
            }
            return  t;
        },

        

        isEmpty : function(v, u){
            return  v === null || v === undefined || (!u ? v === '' : false);
        },
        
        

        isOpera : D,
        

        isSafari : E,
        

        isIE : F,
        

        isIE7 : G,
        

        isGecko : H,
        

        isBorderBox : I,
        

        isWindows : J,
        

        isLinux : L,
        

        isMac : K,

        

        useShims : ((F && !G) || (H && K))
    });


})();

Roo.namespace("Roo", "Roo.util", "Roo.grid", "Roo.dd", "Roo.tree", "Roo.data",
                "Roo.form", "Roo.menu", "Roo.state", "Roo.lib", "Roo.layout", "Roo.app", "Roo.ux");




(function() {    
    
    if(Roo.isIE) {
        function  A() {
            var  p = Function.prototype;
            delete  p.createSequence;
            delete  p.defer;
            delete  p.createDelegate;
            delete  p.createCallback;
            delete  p.createInterceptor;

            window.detachEvent("onunload", A);
        }

        window.attachEvent("onunload", A);
    }
})();




Roo.apply(Function.prototype, {
     

    createCallback : function(
){
        
        var  B = arguments;
        var  C = this;
        return  function() {
            return  C.apply(window, B);
        };
    },

    

    createDelegate : function(D, E, F){
        var  G = this;
        return  function() {
            var  H = E || arguments;
            if(F === true){
                H = Array.prototype.slice.call(arguments, 0);
                H = H.concat(E);
            }else  if(typeof  F == "number"){
                H = Array.prototype.slice.call(arguments, 0); 
                var  applyArgs = [F, 0].concat(E); 
                Array.prototype.splice.apply(H, applyArgs); 
            }
            return  G.apply(D || window, H);
        };
    },

    

    defer : function(H, I, J, K){
        var  fn = this.createDelegate(I, J, K);
        if(H){
            return  setTimeout(fn, H);
        }

        fn();
        return  0;
    },
    

    createSequence : function(L, M){
        if(typeof  L != "function"){
            return  this;
        }
        var  N = this;
        return  function() {
            var  O = N.apply(this || window, arguments);
            L.apply(M || this || window, arguments);
            return  O;
        };
    },

    

    createInterceptor : function(O, P){
        if(typeof  O != "function"){
            return  this;
        }
        var  Q = this;
        return  function() {
            O.target = this;
            O.method = Q;
            if(O.apply(P || this || window, arguments) === false){
                return;
            }
            return  Q.apply(this || window, arguments);
        };
    }
});




Roo.applyIf(String, {
    
    

    
    

    escape : function(A) {
        return  A.replace(/('|\\)/g, "\\$1");
    },

    

    leftPad : function (B, C, ch) {
        var  D = new  String(B);
        if(ch === null || ch === undefined || ch === '') {
            ch = " ";
        }
        while (D.length < C) {
            D = ch + D;
        }
        return  D;
    },

    

    format : function(E){
        var  F = Array.prototype.slice.call(arguments, 1);
        return  E.replace(/\{(\d+)\}/g, function(m, i){
            return  Roo.util.Format.htmlEncode(F[i]);
        });
    }
});



 
String.prototype.toggle = function(G, H){
    return  this == G ? H : G;
};



 

Roo.applyIf(Number.prototype, {
    

    constrain : function(A, B){
        return  Math.min(Math.max(this, A), B);
    }
});


 

Roo.applyIf(Array.prototype, {
    

    indexOf : function(o){
       for (var  i = 0, len = this.length; i < len; i++){
 	      if(this[i] == o) return  i;
       }
 	   return  -1;
    },

    

    remove : function(o){
       var  A = this.indexOf(o);
       if(A != -1){
           this.splice(A, 1);
       }
    },
    

    map : function(B )
    {
        var  C = this.length >>> 0;
        if (typeof  B != "function")
            throw  new  TypeError();

        var  D = new  Array(C);
        var  E = arguments[1];
        for (var  i = 0; i < C; i++)
        {
            if (i  in  this)
                D[i] = B.call(E, this[i], i, this);
        }

        return  D;
    }
    
});


 








 
 
 


Date.prototype.getElapsed = function(A) {
	return  Math.abs((A || new  Date()).getTime()-this.getTime());
};




Date.parseFunctions = {count:0};

Date.parseRegexes = [];

Date.formatFunctions = {count:0};


Date.prototype.dateFormat = function(B) {
    if (Date.formatFunctions[B] == null) {
        Date.createNewFormat(B);
    }
    var  C = Date.formatFunctions[B];
    return  this[C]();
};




Date.prototype.format = Date.prototype.dateFormat;


Date.createNewFormat = function(D) {
    var  E = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[D] = E;
    var  F = "Date.prototype." + E + " = function(){return ";
    var  G = false;
    var  ch = '';
    for (var  i = 0; i < D.length; ++i) {
        ch = D.charAt(i);
        if (!G && ch == "\\") {
            G = true;
        }
        else  if (G) {
            G = false;
            F += "'" + String.escape(ch) + "' + ";
        }
        else  {
            F += Date.getFormatCode(ch);
        }
    }
    

    eval(F.substring(0, F.length - 3) + ";}");
};


Date.getFormatCode = function(H) {
    switch (H) {
    case  "d":
        return  "String.leftPad(this.getDate(), 2, '0') + ";
    case  "D":
        return  "Date.dayNames[this.getDay()].substring(0, 3) + ";
    case  "j":
        return  "this.getDate() + ";
    case  "l":
        return  "Date.dayNames[this.getDay()] + ";
    case  "S":
        return  "this.getSuffix() + ";
    case  "w":
        return  "this.getDay() + ";
    case  "z":
        return  "this.getDayOfYear() + ";
    case  "W":
        return  "this.getWeekOfYear() + ";
    case  "F":
        return  "Date.monthNames[this.getMonth()] + ";
    case  "m":
        return  "String.leftPad(this.getMonth() + 1, 2, '0') + ";
    case  "M":
        return  "Date.monthNames[this.getMonth()].substring(0, 3) + ";
    case  "n":
        return  "(this.getMonth() + 1) + ";
    case  "t":
        return  "this.getDaysInMonth() + ";
    case  "L":
        return  "(this.isLeapYear() ? 1 : 0) + ";
    case  "Y":
        return  "this.getFullYear() + ";
    case  "y":
        return  "('' + this.getFullYear()).substring(2, 4) + ";
    case  "a":
        return  "(this.getHours() < 12 ? 'am' : 'pm') + ";
    case  "A":
        return  "(this.getHours() < 12 ? 'AM' : 'PM') + ";
    case  "g":
        return  "((this.getHours() % 12) ? this.getHours() % 12 : 12) + ";
    case  "G":
        return  "this.getHours() + ";
    case  "h":
        return  "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') + ";
    case  "H":
        return  "String.leftPad(this.getHours(), 2, '0') + ";
    case  "i":
        return  "String.leftPad(this.getMinutes(), 2, '0') + ";
    case  "s":
        return  "String.leftPad(this.getSeconds(), 2, '0') + ";
    case  "O":
        return  "this.getGMTOffset() + ";
    case  "T":
        return  "this.getTimezone() + ";
    case  "Z":
        return  "(this.getTimezoneOffset() * -60) + ";
    default:
        return  "'" + String.escape(H) + "' + ";
    }
};



Date.parseDate = function(I, J) {
    if (Date.parseFunctions[J] == null) {
        Date.createParser(J);
    }
    var  K = Date.parseFunctions[J];
    return  Date[K](I);
};


Date.createParser = function(L) {
    var  M = "parse" + Date.parseFunctions.count++;
    var  N = Date.parseRegexes.length;
    var  O = 1;
    Date.parseFunctions[L] = M;

    var  P = "Date." + M + " = function(input){\n"
        + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, o, z, v;\n"
        + "var d = new Date();\n"
        + "y = d.getFullYear();\n"
        + "m = d.getMonth();\n"
        + "d = d.getDate();\n"
        + "var results = input.match(Date.parseRegexes[" + N + "]);\n"
        + "if (results && results.length > 0) {";
    var  Q = "";

    var  R = false;
    var  ch = '';
    for (var  i = 0; i < L.length; ++i) {
        ch = L.charAt(i);
        if (!R && ch == "\\") {
            R = true;
        }
        else  if (R) {
            R = false;
            Q += String.escape(ch);
        }
        else  {
            var  obj = Date.formatCodeToRegex(ch, O);
            O += obj.g;
            Q += obj.s;
            if (obj.g && obj.c) {
                P += obj.c;
            }
        }
    }


    P += "if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
        + "{v = new Date(y, m, d, h, i, s);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
        + "{v = new Date(y, m, d, h, i);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0)\n"
        + "{v = new Date(y, m, d, h);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0)\n"
        + "{v = new Date(y, m, d);}\n"
        + "else if (y >= 0 && m >= 0)\n"
        + "{v = new Date(y, m);}\n"
        + "else if (y >= 0)\n"
        + "{v = new Date(y);}\n"
        + "}return (v && (z || o))?\n" 
        + "    ((z)? v.add(Date.SECOND, (v.getTimezoneOffset() * 60) + (z*1)) :\n" 
        + "        v.add(Date.HOUR, (v.getGMTOffset() / 100) + (o / -100))) : v\n" 
        + ";}";

    Date.parseRegexes[N] = new  RegExp("^" + Q + "$");
    

    eval(P);
};


Date.formatCodeToRegex = function(S, T) {
    switch (S) {
    case  "D":
        return  {g:0,
        c:null,
        s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
    case  "j":
        return  {g:1,
            c:"d = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{1,2})"}; 
    case  "d":
        return  {g:1,
            c:"d = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{2})"}; 
    case  "l":
        return  {g:0,
            c:null,
            s:"(?:" + Date.dayNames.join("|") + ")"};
    case  "S":
        return  {g:0,
            c:null,
            s:"(?:st|nd|rd|th)"};
    case  "w":
        return  {g:0,
            c:null,
            s:"\\d"};
    case  "z":
        return  {g:0,
            c:null,
            s:"(?:\\d{1,3})"};
    case  "W":
        return  {g:0,
            c:null,
            s:"(?:\\d{2})"};
    case  "F":
        return  {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + T + "].substring(0, 3)], 10);\n",
            s:"(" + Date.monthNames.join("|") + ")"};
    case  "M":
        return  {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + T + "]], 10);\n",
            s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
    case  "n":
        return  {g:1,
            c:"m = parseInt(results[" + T + "], 10) - 1;\n",
            s:"(\\d{1,2})"}; 
    case  "m":
        return  {g:1,
            c:"m = parseInt(results[" + T + "], 10) - 1;\n",
            s:"(\\d{2})"}; 
    case  "t":
        return  {g:0,
            c:null,
            s:"\\d{1,2}"};
    case  "L":
        return  {g:0,
            c:null,
            s:"(?:1|0)"};
    case  "Y":
        return  {g:1,
            c:"y = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{4})"};
    case  "y":
        return  {g:1,
            c:"var ty = parseInt(results[" + T + "], 10);\n"
                + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s:"(\\d{1,2})"};
    case  "a":
        return  {g:1,
            c:"if (results[" + T + "] == 'am') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(am|pm)"};
    case  "A":
        return  {g:1,
            c:"if (results[" + T + "] == 'AM') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(AM|PM)"};
    case  "g":
    case  "G":
        return  {g:1,
            c:"h = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{1,2})"}; 
    case  "h":
    case  "H":
        return  {g:1,
            c:"h = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{2})"}; 
    case  "i":
        return  {g:1,
            c:"i = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{2})"};
    case  "s":
        return  {g:1,
            c:"s = parseInt(results[" + T + "], 10);\n",
            s:"(\\d{2})"};
    case  "O":
        return  {g:1,
            c:[
                "o = results[", T, "];\n",
                "var sn = o.substring(0,1);\n", 
                "var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);\n", 
                "var mn = o.substring(3,5) % 60;\n", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n", 
                "    (sn + String.leftPad(hr, 2, 0) + String.leftPad(mn, 2, 0)) : null;\n"
            ].join(""),
            s:"([+\-]\\d{4})"};
    case  "T":
        return  {g:0,
            c:null,
            s:"[A-Z]{1,4}"}; 
    case  "Z":
        return  {g:1,
            c:"z = results[" + T + "];\n" 
                  + "z = (-43200 <= z*1 && z*1 <= 50400)? z : null;\n",
            s:"([+\-]?\\d{1,5})"}; 
    default:
        return  {g:0,
            c:null,
            s:String.escape(S)};
    }
};



Date.prototype.getTimezone = function() {
    return  this.toString().replace(/^.*? ([A-Z]{1,4})[\-+][0-9]{4} .*$/, "$1");
};



Date.prototype.getGMTOffset = function() {
    return  (this.getTimezoneOffset() > 0 ? "-" : "+")
        + String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0")
        + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
};



Date.prototype.getDayOfYear = function() {
    var  U = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var  i = 0; i < this.getMonth(); ++i) {
        U += Date.daysInMonth[i];
    }
    return  U + this.getDate() - 1;
};



Date.prototype.getWeekOfYear = function() {
    
    var  V = this.getDayOfYear() + (4 - this.getDay());
    
    var  W = new  Date(this.getFullYear(), 0, 1);
    var  X = (7 - W.getDay() + 4);
    return  String.leftPad(((V - X) / 7) + 1, 2, "0");
};



Date.prototype.isLeapYear = function() {
    var  Y = this.getFullYear();
    return  ((Y & 3) == 0 && (Y % 100 || (Y % 400 == 0 && Y)));
};



Date.prototype.getFirstDayOfMonth = function() {
    var  Z = (this.getDay() - (this.getDate() - 1)) % 7;
    return  (Z < 0) ? (Z + 7) : Z;
};



Date.prototype.getLastDayOfMonth = function() {
    var  a = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return  (a < 0) ? (a + 7) : a;
};




Date.prototype.getFirstDateOfMonth = function() {
    return  new  Date(this.getFullYear(), this.getMonth(), 1);
};



Date.prototype.getLastDateOfMonth = function() {
    return  new  Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
};


Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return  Date.daysInMonth[this.getMonth()];
};



Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
        case  1:
        case  21:
        case  31:
            return  "st";
        case  2:
        case  22:
            return  "nd";
        case  3:
        case  23:
            return  "rd";
        default:
            return  "th";
    }
};


Date.daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];



Date.monthNames =
   ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];



Date.dayNames =
   ["Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"];


Date.y2kYear = 50;

Date.monthNumbers = {
    Jan:0,
    Feb:1,
    Mar:2,
    Apr:3,
    May:4,
    Jun:5,
    Jul:6,
    Aug:7,
    Sep:8,
    Oct:9,
    Nov:10,
    Dec:11};



Date.prototype.clone = function() {
	return  new  Date(this.getTime());
};



Date.prototype.clearTime = function(b){
    if(b){
        return  this.clone().clearTime();
    }

    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return  this;
};



if(Roo.isSafari){
    Date.brokenSetMonth = Date.prototype.setMonth;
	Date.prototype.setMonth = function(c){
		if(c <= -1){
			var  n = Math.ceil(-c);
			var  back_year = Math.ceil(n/12);
			var  month = (n % 12) ? 12 - n % 12 : 0 ;
			this.setFullYear(this.getFullYear() - back_year);
			return  Date.brokenSetMonth.call(this, month);
		} else  {
			return  Date.brokenSetMonth.apply(this, arguments);
		}
	};
}




Date.MILLI = "ms";


Date.SECOND = "s";


Date.MINUTE = "mi";


Date.HOUR = "h";


Date.DAY = "d";


Date.MONTH = "mo";


Date.YEAR = "y";



Date.prototype.add = function(e, f){
  var  d = this.clone();
  if (!e || f === 0) return  d;
  switch(e.toLowerCase()){
    case  Date.MILLI:
      d.setMilliseconds(this.getMilliseconds() + f);
      break;
    case  Date.SECOND:
      d.setSeconds(this.getSeconds() + f);
      break;
    case  Date.MINUTE:
      d.setMinutes(this.getMinutes() + f);
      break;
    case  Date.HOUR:
      d.setHours(this.getHours() + f);
      break;
    case  Date.DAY:
      d.setDate(this.getDate() + f);
      break;
    case  Date.MONTH:
      var  a = this.getDate();
      if(a > 28){
          a = Math.min(a, this.getFirstDateOfMonth().add('mo', f).getLastDateOfMonth().getDate());
      }

      d.setDate(a);
      d.setMonth(this.getMonth() + f);
      break;
    case  Date.YEAR:
      d.setFullYear(this.getFullYear() + f);
      break;
  }
  return  d;
};



Roo.lib.Dom = {
    getViewWidth : function(A) {
        return  A ? this.getDocumentWidth() : this.getViewportWidth();
    },

    getViewHeight : function(B) {
        return  B ? this.getDocumentHeight() : this.getViewportHeight();
    },

    getDocumentHeight: function() {
        var  C = (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight;
        return  Math.max(C, this.getViewportHeight());
    },

    getDocumentWidth: function() {
        var  D = (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth;
        return  Math.max(D, this.getViewportWidth());
    },

    getViewportHeight: function() {
        var  E = self.innerHeight;
        var  F = document.compatMode;

        if ((F || Roo.isIE) && !Roo.isOpera) {
            E = (F == "CSS1Compat") ?
                     document.documentElement.clientHeight :
                     document.body.clientHeight;
        }

        return  E;
    },

    getViewportWidth: function() {
        var  G = self.innerWidth;
        var  H = document.compatMode;

        if (H || Roo.isIE) {
            G = (H == "CSS1Compat") ?
                    document.documentElement.clientWidth :
                    document.body.clientWidth;
        }
        return  G;
    },

    isAncestor : function(p, c) {
        p = Roo.getDom(p);
        c = Roo.getDom(c);
        if (!p || !c) {
            return  false;
        }

        if (p.contains && !Roo.isSafari) {
            return  p.contains(c);
        } else  if (p.compareDocumentPosition) {
            return  !!(p.compareDocumentPosition(c) & 16);
        } else  {
            var  parent = c.parentNode;
            while (parent) {
                if (parent == p) {
                    return  true;
                }
                else  if (!parent.tagName || parent.tagName.toUpperCase() == "HTML") {
                    return  false;
                }

                parent = parent.parentNode;
            }
            return  false;
        }
    },

    getRegion : function(el) {
        return  Roo.lib.Region.getRegion(el);
    },

    getY : function(el) {
        return  this.getXY(el)[1];
    },

    getX : function(el) {
        return  this.getXY(el)[0];
    },

    getXY : function(el) {
        var  p, pe, b, I, bd = document.body;
        el = Roo.getDom(el);
        var  J = Roo.lib.AnimBase.fly;
        if (el.getBoundingClientRect) {
            b = el.getBoundingClientRect();
            I = J(document).getScroll();
            return  [b.left + I.left, b.top + I.top];
        }
        var  x = 0, y = 0;

        p = el;

        var  K = J(el).getStyle("position") == "absolute";

        while (p) {

            x += p.offsetLeft;
            y += p.offsetTop;

            if (!K && J(p).getStyle("position") == "absolute") {
                K = true;
            }

            if (Roo.isGecko) {
                pe = J(p);

                var  bt = parseInt(pe.getStyle("borderTopWidth"), 10) || 0;
                var  bl = parseInt(pe.getStyle("borderLeftWidth"), 10) || 0;


                x += bl;
                y += bt;


                if (p != el && pe.getStyle('overflow') != 'visible') {
                    x += bl;
                    y += bt;
                }
            }

            p = p.offsetParent;
        }

        if (Roo.isSafari && K) {
            x -= bd.offsetLeft;
            y -= bd.offsetTop;
        }

        if (Roo.isGecko && !K) {
            var  dbd = J(bd);
            x += parseInt(dbd.getStyle("borderLeftWidth"), 10) || 0;
            y += parseInt(dbd.getStyle("borderTopWidth"), 10) || 0;
        }


        p = el.parentNode;
        while (p && p != bd) {
            if (!Roo.isOpera || (p.tagName != 'TR' && J(p).getStyle("display") != "inline")) {
                x -= p.scrollLeft;
                y -= p.scrollTop;
            }

            p = p.parentNode;
        }
        return  [x, y];
    },
 
  


    setXY : function(el, xy) {
        el = Roo.fly(el, '_setXY');
        el.position();
        var  L = el.translatePoints(xy);
        if (xy[0] !== false) {
            el.dom.style.left = L.left + "px";
        }
        if (xy[1] !== false) {
            el.dom.style.top = L.top + "px";
        }
    },

    setX : function(el, x) {
        this.setXY(el, [x, false]);
    },

    setY : function(el, y) {
        this.setXY(el, [false, y]);
    }
};




Roo.lib.Event = function() {
    var  A = false;
    var  B = [];
    var  C = [];
    var  D = 0;
    var  E = [];
    var  F = 0;
    var  G = null;

    return  {
        POLL_RETRYS: 200,
        POLL_INTERVAL: 20,
        EL: 0,
        TYPE: 1,
        FN: 2,
        WFN: 3,
        OBJ: 3,
        ADJ_SCOPE: 4,
        _interval: null,

        startInterval: function() {
            if (!this._interval) {
                var  self = this;
                var  callback = function() {
                    self._tryPreloadAttach();
                };
                this._interval = setInterval(callback, this.POLL_INTERVAL);

            }
        },

        onAvailable: function(h, k, m, n) {
            E.push({ id:         h,
                fn:         k,
                obj:        m,
                override:   n,
                checkReady: false    });

            D = this.POLL_RETRYS;
            this.startInterval();
        },


        addListener: function(el, o, fn) {
            el = Roo.getDom(el);
            if (!el || !fn) {
                return  false;
            }

            if ("unload" == o) {
                C[C.length] =
                [el, o, fn];
                return  true;
            }

            var  p = function(e) {
                return  fn(Roo.lib.Event.getEvent(e));
            };

            var  li = [el, o, fn, p];

            var  q = B.length;
            B[q] = li;

            this.doAdd(el, o, p, false);
            return  true;

        },


        removeListener: function(el, r, fn) {
            var  i, s;

            el = Roo.getDom(el);

            if(!fn) {
                return  this.purgeElement(el, false, r);
            }


            if ("unload" == r) {

                for (i = 0,s = C.length; i < s; i++) {
                    var  li = C[i];
                    if (li &&
                        li[0] == el &&
                        li[1] == r &&
                        li[2] == fn) {
                        C.splice(i, 1);
                        return  true;
                    }
                }

                return  false;
            }

            var  u = null;


            var  v = arguments[3];

            if ("undefined" == typeof  v) {
                v = this._getCacheIndex(el, r, fn);
            }

            if (v >= 0) {
                u = B[v];
            }

            if (!el || !u) {
                return  false;
            }


            this.doRemove(el, r, u[this.WFN], false);

            delete  B[v][this.WFN];
            delete  B[v][this.FN];
            B.splice(v, 1);

            return  true;

        },


        getTarget: function(ev, w) {
            ev = ev.browserEvent || ev;
            var  t = ev.target || ev.srcElement;
            return  this.resolveTextNode(t);
        },


        resolveTextNode: function(z) {
            if (Roo.isSafari && z && 3 == z.nodeType) {
                return  z.parentNode;
            } else  {
                return  z;
            }
        },


        getPageX: function(ev) {
            ev = ev.browserEvent || ev;
            var  x = ev.pageX;
            if (!x && 0 !== x) {
                x = ev.clientX || 0;

                if (Roo.isIE) {
                    x += this.getScroll()[1];
                }
            }

            return  x;
        },


        getPageY: function(ev) {
            ev = ev.browserEvent || ev;
            var  y = ev.pageY;
            if (!y && 0 !== y) {
                y = ev.clientY || 0;

                if (Roo.isIE) {
                    y += this.getScroll()[0];
                }
            }


            return  y;
        },


        getXY: function(ev) {
            ev = ev.browserEvent || ev;
            return  [this.getPageX(ev), this.getPageY(ev)];
        },


        getRelatedTarget: function(ev) {
            ev = ev.browserEvent || ev;
            var  t = ev.relatedTarget;
            if (!t) {
                if (ev.type == "mouseout") {
                    t = ev.toElement;
                } else  if (ev.type == "mouseover") {
                    t = ev.fromElement;
                }
            }

            return  this.resolveTextNode(t);
        },


        getTime: function(ev) {
            ev = ev.browserEvent || ev;
            if (!ev.time) {
                var  t = new  Date().getTime();
                try {
                    ev.time = t;
                } catch(ex) {
                    this.lastError = ex;
                    return  t;
                }
            }

            return  ev.time;
        },


        stopEvent: function(ev) {
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },


        stopPropagation: function(ev) {
            ev = ev.browserEvent || ev;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else  {
                ev.cancelBubble = true;
            }
        },


        preventDefault: function(ev) {
            ev = ev.browserEvent || ev;
            if(ev.preventDefault) {
                ev.preventDefault();
            } else  {
                ev.returnValue = false;
            }
        },


        getEvent: function(e) {
            var  ev = e || window.event;
            if (!ev) {
                var  c = this.getEvent.caller;
                while (c) {
                    ev = c.arguments[0];
                    if (ev && Event == ev.constructor) {
                        break;
                    }

                    c = c.caller;
                }
            }
            return  ev;
        },


        getCharCode: function(ev) {
            ev = ev.browserEvent || ev;
            return  ev.charCode || ev.keyCode || 0;
        },


        _getCacheIndex: function(el, AA, fn) {
            for (var  i = 0,s = B.length; i < s; ++i) {
                var  li = B[i];
                if (li &&
                    li[this.FN] == fn &&
                    li[this.EL] == el &&
                    li[this.TYPE] == AA) {
                    return  i;
                }
            }

            return  -1;
        },


        elCache: {},


        getEl: function(id) {
            return  document.getElementById(id);
        },


        clearCache: function() {
        },


        _load: function(e) {
            A = true;
            var  EU = Roo.lib.Event;


            if (Roo.isIE) {
                EU.doRemove(window, "load", EU._load);
            }
        },


        _tryPreloadAttach: function() {

            if (this.locked) {
                return  false;
            }


            this.locked = true;


            var  AB = !A;
            if (!AB) {
                AB = (D > 0);
            }


            var  AC = [];
            for (var  i = 0,s = E.length; i < s; ++i) {
                var  item = E[i];
                if (item) {
                    var  el = this.getEl(item.id);

                    if (el) {
                        if (!item.checkReady ||
                            A ||
                            el.nextSibling ||
                            (document && document.body)) {

                            var  scope = el;
                            if (item.override) {
                                if (item.override === true) {
                                    scope = item.obj;
                                } else  {
                                    scope = item.override;
                                }
                            }

                            item.fn.call(scope, item.obj);
                            E[i] = null;
                        }
                    } else  {
                        AC.push(item);
                    }
                }
            }


            D = (AC.length === 0) ? 0 : D - 1;

            if (AB) {

                this.startInterval();
            } else  {
                clearInterval(this._interval);
                this._interval = null;
            }


            this.locked = false;

            return  true;

        },


        purgeElement: function(el, AD, AE) {
            var  AF = this.getListeners(el, AE);
            if (AF) {
                for (var  i = 0,s = AF.length; i < s; ++i) {
                    var  l = AF[i];
                    this.removeListener(el, l.type, l.fn);
                }
            }

            if (AD && el && el.childNodes) {
                for (i = 0,s = el.childNodes.length; i < s; ++i) {
                    this.purgeElement(el.childNodes[i], AD, AE);
                }
            }
        },


        getListeners: function(el, AG) {
            var  AH = [], AI;
            if (!AG) {
                AI = [B, C];
            } else  if (AG == "unload") {
                AI = [C];
            } else  {
                AI = [B];
            }

            for (var  j = 0; j < AI.length; ++j) {
                var  searchList = AI[j];
                if (searchList && searchList.length > 0) {
                    for (var  i = 0,s = searchList.length; i < s; ++i) {
                        var  l = searchList[i];
                        if (l && l[this.EL] === el &&
                            (!AG || AG === l[this.TYPE])) {
                            AH.push({
                                type:   l[this.TYPE],
                                fn:     l[this.FN],
                                obj:    l[this.OBJ],
                                adjust: l[this.ADJ_SCOPE],
                                index:  i
                            });
                        }
                    }
                }
            }

            return  (AH.length) ? AH : null;
        },


        _unload: function(e) {

            var  EU = Roo.lib.Event, i, j, l, AJ, AK;

            for (i = 0,AJ = C.length; i < AJ; ++i) {
                l = C[i];
                if (l) {
                    var  scope = window;
                    if (l[EU.ADJ_SCOPE]) {
                        if (l[EU.ADJ_SCOPE] === true) {
                            scope = l[EU.OBJ];
                        } else  {
                            scope = l[EU.ADJ_SCOPE];
                        }
                    }

                    l[EU.FN].call(scope, EU.getEvent(e), l[EU.OBJ]);
                    C[i] = null;
                    l = null;
                    scope = null;
                }
            }


            C = null;

            if (B && B.length > 0) {
                j = B.length;
                while (j) {
                    AK = j - 1;
                    l = B[AK];
                    if (l) {
                        EU.removeListener(l[EU.EL], l[EU.TYPE],
                                l[EU.FN], AK);
                    }

                    j = j - 1;
                }

                l = null;

                EU.clearCache();
            }


            EU.doRemove(window, "unload", EU._unload);

        },


        getScroll: function() {
            var  dd = document.documentElement, db = document.body;
            if (dd && (dd.scrollTop || dd.scrollLeft)) {
                return  [dd.scrollTop, dd.scrollLeft];
            } else  if (db) {
                return  [db.scrollTop, db.scrollLeft];
            } else  {
                return  [0, 0];
            }
        },


        doAdd: function () {
            if (window.addEventListener) {
                return  function(el, AL, fn, AM) {
                    el.addEventListener(AL, fn, (AM));
                };
            } else  if (window.attachEvent) {
                return  function(el, AL, fn, AM) {
                    el.attachEvent("on" + AL, fn);
                };
            } else  {
                return  function() {
                };
            }
        }(),


        doRemove: function() {
            if (window.removeEventListener) {
                return  function (el, AL, fn, AM) {
                    el.removeEventListener(AL, fn, (AM));
                };
            } else  if (window.detachEvent) {
                return  function (el, AL, fn) {
                    el.detachEvent("on" + AL, fn);
                };
            } else  {
                return  function() {
                };
            }
        }()
    };
    
}();
(function() {     
   
    var  E = Roo.lib.Event;
    E.on = E.addListener;
    E.un = E.removeListener;

    if (document && document.body) {
        E._load();
    } else  {
        E.doAdd(window, "load", E._load);
    }

    E.doAdd(window, "unload", E._unload);
    E._tryPreloadAttach();
})();





(function() {
    
    Roo.lib.Ajax = {
        request : function(A, B, cb, C, D) {
            if(D){
                var  hs = D.headers;
                if(hs){
                    for(var  h  in  hs){
                        if(hs.hasOwnProperty(h)){
                            this.initHeader(h, hs[h], false);
                        }
                    }
                }
                if(D.xmlData){
                    this.initHeader('Content-Type', 'text/xml', false);
                    A = 'POST';
                    C = D.xmlData;
                }
            }

            return  this.asyncRequest(A, B, cb, C);
        },

        serializeForm : function(E) {
            if(typeof  E == 'string') {
                E = (document.getElementById(E) || document.forms[E]);
            }

            var  el, F, G, H, I = '', J = false;
            for (var  i = 0; i < E.elements.length; i++) {
                el = E.elements[i];
                H = E.elements[i].disabled;
                F = E.elements[i].name;
                G = E.elements[i].value;

                if (!H && F){
                    switch (el.type)
                            {
                        case  'select-one':
                        case  'select-multiple':
                            for (var  j = 0; j < el.options.length; j++) {
                                if (el.options[j].selected) {
                                    if (Roo.isIE) {
                                        I += encodeURIComponent(F) + '=' + encodeURIComponent(el.options[j].attributes['value'].specified ? el.options[j].value : el.options[j].text) + '&';
                                    }
                                    else  {
                                        I += encodeURIComponent(F) + '=' + encodeURIComponent(el.options[j].hasAttribute('value') ? el.options[j].value : el.options[j].text) + '&';
                                    }
                                }
                            }
                            break;
                        case  'radio':
                        case  'checkbox':
                            if (el.checked) {
                                I += encodeURIComponent(F) + '=' + encodeURIComponent(G) + '&';
                            }
                            break;
                        case  'file':

                        case  undefined:

                        case  'reset':

                        case  'button':

                            break;
                        case  'submit':
                            if(J == false) {
                                I += encodeURIComponent(F) + '=' + encodeURIComponent(G) + '&';
                                J = true;
                            }
                            break;
                        default:
                            I += encodeURIComponent(F) + '=' + encodeURIComponent(G) + '&';
                            break;
                    }
                }
            }

            I = I.substr(0, I.length - 1);
            return  I;
        },

        headers:{},

        hasHeaders:false,

        useDefaultHeader:true,

        defaultPostHeader:'application/x-www-form-urlencoded',

        useDefaultXhrHeader:true,

        defaultXhrHeader:'XMLHttpRequest',

        hasDefaultHeaders:true,

        defaultHeaders:{},

        poll:{},

        timeout:{},

        pollInterval:50,

        transactionId:0,

        setProgId:function(id)
        {
            this.activeX.unshift(id);
        },

        setDefaultPostHeader:function(b)
        {
            this.useDefaultHeader = b;
        },

        setDefaultXhrHeader:function(b)
        {
            this.useDefaultXhrHeader = b;
        },

        setPollingInterval:function(i)
        {
            if (typeof  i == 'number' && isFinite(i)) {
                this.pollInterval = i;
            }
        },

        createXhrObject:function(K)
        {
            var  L,M;
            try
            {

                M = new  XMLHttpRequest();

                L = { conn:M, tId:K };
            }
            catch(e)
            {
                for (var  i = 0; i < this.activeX.length; ++i) {
                    try
                    {

                        http = new  ActiveXObject(this.activeX[i]);

                        obj = { conn:http, tId:transactionId };
                        break;
                    }
                    catch(e) {
                    }
                }
            }
            finally
            {
                return  L;
            }
        },

        getConnectionObject:function()
        {
            var  o;
            var  N = this.transactionId;

            try
            {
                o = this.createXhrObject(N);
                if (o) {
                    this.transactionId++;
                }
            }
            catch(e) {
            }
            finally
            {
                return  o;
            }
        },

        asyncRequest:function(O, P, Q, R)
        {
            var  o = this.getConnectionObject();

            if (!o) {
                return  null;
            }
            else  {
                o.conn.open(O, P, true);

                if (this.useDefaultXhrHeader) {
                    if (!this.defaultHeaders['X-Requested-With']) {
                        this.initHeader('X-Requested-With', this.defaultXhrHeader, true);
                    }
                }

                if(R && this.useDefaultHeader){
                    this.initHeader('Content-Type', this.defaultPostHeader);
                }

                 if (this.hasDefaultHeaders || this.hasHeaders) {
                    this.setHeader(o);
                }


                this.handleReadyState(o, Q);
                o.conn.send(R || null);

                return  o;
            }
        },

        handleReadyState:function(o, S)
        {
            var  T = this;

            if (S && S.timeout) {
                this.timeout[o.tId] = window.setTimeout(function() {
                    T.abort(o, S, true);
                }, S.timeout);
            }


            this.poll[o.tId] = window.setInterval(
                    function() {
                        if (o.conn && o.conn.readyState == 4) {
                            window.clearInterval(T.poll[o.tId]);
                            delete  T.poll[o.tId];

                            if(S && S.timeout) {
                                window.clearTimeout(T.timeout[o.tId]);
                                delete  T.timeout[o.tId];
                            }


                            T.handleTransactionResponse(o, S);
                        }
                    }
                    , this.pollInterval);
        },

        handleTransactionResponse:function(o, U, V)
        {

            if (!U) {
                this.releaseObject(o);
                return;
            }

            var  W, X;

            try
            {
                if (o.conn.status !== undefined && o.conn.status != 0) {
                    W = o.conn.status;
                }
                else  {
                    W = 13030;
                }
            }
            catch(e) {


                httpStatus = 13030;
            }

            if (W >= 200 && W < 300) {
                X = this.createResponseObject(o, U.argument);
                if (U.success) {
                    if (!U.scope) {
                        U.success(X);
                    }
                    else  {


                        U.success.apply(U.scope, [X]);
                    }
                }
            }
            else  {
                switch (W) {

                    case  12002:
                    case  12029:
                    case  12030:
                    case  12031:
                    case  12152:
                    case  13030:
                        X = this.createExceptionObject(o.tId, U.argument, (V ? V : false));
                        if (U.failure) {
                            if (!U.scope) {
                                U.failure(X);
                            }
                            else  {
                                U.failure.apply(U.scope, [X]);
                            }
                        }
                        break;
                    default:
                        X = this.createResponseObject(o, U.argument);
                        if (U.failure) {
                            if (!U.scope) {
                                U.failure(X);
                            }
                            else  {
                                U.failure.apply(U.scope, [X]);
                            }
                        }
                }
            }


            this.releaseObject(o);
            X = null;
        },

        createResponseObject:function(o, Y)
        {
            var  Z = {};
            var  a = {};

            try
            {
                var  headerStr = o.conn.getAllResponseHeaders();
                var  header = headerStr.split('\n');
                for (var  i = 0; i < header.length; i++) {
                    var  delimitPos = header[i].indexOf(':');
                    if (delimitPos != -1) {
                        a[header[i].substring(0, delimitPos)] = header[i].substring(delimitPos + 2);
                    }
                }
            }
            catch(e) {
            }


            Z.tId = o.tId;
            Z.status = o.conn.status;
            Z.statusText = o.conn.statusText;
            Z.getResponseHeader = a;
            Z.getAllResponseHeaders = headerStr;
            Z.responseText = o.conn.responseText;
            Z.responseXML = o.conn.responseXML;

            if (typeof  Y !== undefined) {
                Z.argument = Y;
            }

            return  Z;
        },

        createExceptionObject:function(c, d, f)
        {
            var  g = 0;
            var  k = 'communication failure';
            var  l = -1;
            var  m = 'transaction aborted';

            var  n = {};

            n.tId = c;
            if (f) {
                n.status = l;
                n.statusText = m;
            }
            else  {
                n.status = g;
                n.statusText = k;
            }

            if (d) {
                n.argument = d;
            }

            return  n;
        },

        initHeader:function(p, q, r)
        {
            var  s = (r) ? this.defaultHeaders : this.headers;

            if (s[p] === undefined) {
                s[p] = q;
            }
            else  {


                s[p] = q + "," + s[p];
            }

            if (r) {
                this.hasDefaultHeaders = true;
            }
            else  {
                this.hasHeaders = true;
            }
        },


        setHeader:function(o)
        {
            if (this.hasDefaultHeaders) {
                for (var  prop  in  this.defaultHeaders) {
                    if (this.defaultHeaders.hasOwnProperty(prop)) {
                        o.conn.setRequestHeader(prop, this.defaultHeaders[prop]);
                    }
                }
            }

            if (this.hasHeaders) {
                for (var  prop  in  this.headers) {
                    if (this.headers.hasOwnProperty(prop)) {
                        o.conn.setRequestHeader(prop, this.headers[prop]);
                    }
                }

                this.headers = {};
                this.hasHeaders = false;
            }
        },

        resetDefaultHeaders:function() {
            delete  this.defaultHeaders;
            this.defaultHeaders = {};
            this.hasDefaultHeaders = false;
        },

        abort:function(o, t, u)
        {
            if(this.isCallInProgress(o)) {
                o.conn.abort();
                window.clearInterval(this.poll[o.tId]);
                delete  this.poll[o.tId];
                if (u) {
                    delete  this.timeout[o.tId];
                }


                this.handleTransactionResponse(o, t, true);

                return  true;
            }
            else  {
                return  false;
            }
        },


        isCallInProgress:function(o)
        {
            if (o && o.conn) {
                return  o.conn.readyState != 4 && o.conn.readyState != 0;
            }
            else  {

                return  false;
            }
        },


        releaseObject:function(o)
        {

            o.conn = null;

            o = null;
        },

        activeX:[
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP',
        'Microsoft.XMLHTTP'
        ]


    };
})();



Roo.lib.Region = function(t, r, b, l) {
    this.top = t;
    this[1] = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
    this[0] = l;
};


Roo.lib.Region.prototype = {
    contains : function(A) {
        return  ( A.left >= this.left &&
                 A.right <= this.right &&
                 A.top >= this.top &&
                 A.bottom <= this.bottom    );

    },

    getArea : function() {
        return  ( (this.bottom - this.top) * (this.right - this.left) );
    },

    intersect : function(B) {
        var  t = Math.max(this.top, B.top);
        var  r = Math.min(this.right, B.right);
        var  b = Math.min(this.bottom, B.bottom);
        var  l = Math.max(this.left, B.left);

        if (b >= t && r >= l) {
            return  new  Roo.lib.Region(t, r, b, l);
        } else  {
            return  null;
        }
    },
    union : function(C) {
        var  t = Math.min(this.top, C.top);
        var  r = Math.max(this.right, C.right);
        var  b = Math.max(this.bottom, C.bottom);
        var  l = Math.min(this.left, C.left);

        return  new  Roo.lib.Region(t, r, b, l);
    },

    adjust : function(t, l, b, r) {
        this.top += t;
        this.left += l;
        this.right += r;
        this.bottom += b;
        return  this;
    }
};

Roo.lib.Region.getRegion = function(el) {
    var  p = Roo.lib.Dom.getXY(el);

    var  t = p[1];
    var  r = p[0] + el.offsetWidth;
    var  b = p[1] + el.offsetHeight;
    var  l = p[0];

    return  new  Roo.lib.Region(t, r, b, l);
};






Roo.lib.Point = function(x, y) {
    if (x  instanceof  Array) {
        y = x[1];
        x = x[0];
    }

    this.x = this.right = this.left = this[0] = x;
    this.y = this.top = this.bottom = this[1] = y;
};

Roo.lib.Point.prototype = new  Roo.lib.Region();



 
(function() {   

    Roo.lib.Anim = {
        scroll : function(el, A, B, C, cb, D) {
            this.run(el, A, B, C, cb, D, Roo.lib.Scroll);
        },

        motion : function(el, E, F, G, cb, H) {
            this.run(el, E, F, G, cb, H, Roo.lib.Motion);
        },

        color : function(el, I, J, K, cb, L) {
            this.run(el, I, J, K, cb, L, Roo.lib.ColorAnim);
        },

        run : function(el, M, N, O, cb, P, Q) {
            Q = Q || Roo.lib.AnimBase;
            if (typeof  O == "string") {
                O = Roo.lib.Easing[O];
            }
            var  R = new  Q(el, M, N, O);
            R.animateX(function() {
                Roo.callback(cb, P);
            });
            return  R;
        }
    };
})();



(function() {    
    var  A;
    
    function  B(el) {
        if (!A) {
            A = new  Roo.Element.Flyweight();
        }

        A.dom = el;
        return  A;
    }


    
    
   
    
    Roo.lib.AnimBase = function(el, C, D, E) {
        if (el) {
            this.init(el, C, D, E);
        }
    };

    Roo.lib.AnimBase.fly = B;
    
    
    
    Roo.lib.AnimBase.prototype = {

        toString: function() {
            var  el = this.getEl();
            var  id = el.id || el.tagName;
            return  ("Anim " + id);
        },

        patterns: {
            noNegatives:        /width|height|opacity|padding/i,
            offsetAttribute:  /^((width|height)|(top|left))$/,
            defaultUnit:        /width|height|top$|bottom$|left$|right$/i,
            offsetUnit:         /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i
        },


        doMethod: function(C, D, E) {
            return  this.method(this.currentFrame, D, E - D, this.totalFrames);
        },


        setAttribute: function(F, G, H) {
            if (this.patterns.noNegatives.test(F)) {
                G = (G > 0) ? G : 0;
            }


            Roo.fly(this.getEl(), '_anim').setStyle(F, G + H);
        },


        getAttribute: function(I) {
            var  el = this.getEl();
            var  J = B(el).getStyle(I);

            if (J !== 'auto' && !this.patterns.offsetUnit.test(J)) {
                return  parseFloat(J);
            }

            var  a = this.patterns.offsetAttribute.exec(I) || [];
            var  K = !!( a[3] );
            var  L = !!( a[2] );


            if (L || (B(el).getStyle('position') == 'absolute' && K)) {
                J = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
            } else  {
                J = 0;
            }

            return  J;
        },


        getDefaultUnit: function(M) {
            if (this.patterns.defaultUnit.test(M)) {
                return  'px';
            }

            return  '';
        },

        animateX : function(N, O) {
            var  f = function() {
                this.onComplete.removeListener(f);
                if (typeof  N == "function") {
                    N.call(O || this, this);
                }
            };
            this.onComplete.addListener(f, this);
            this.animate();
        },


        setRuntimeAttribute: function(P) {
            var  Q;
            var  R;
            var  S = this.attributes;

            this.runtimeAttributes[P] = {};

            var  T = function(U) {
                return  (typeof  U !== 'undefined');
            };

            if (!T(S[P]['to']) && !T(S[P]['by'])) {
                return  false;
            }


            Q = ( T(S[P]['from']) ) ? S[P]['from'] : this.getAttribute(P);


            if (T(S[P]['to'])) {
                R = S[P]['to'];
            } else  if (T(S[P]['by'])) {
                if (Q.constructor == Array) {
                    R = [];
                    for (var  i = 0, len = Q.length; i < len; ++i) {
                        R[i] = Q[i] + S[P]['by'][i];
                    }
                } else  {
                    R = Q + S[P]['by'];
                }
            }


            this.runtimeAttributes[P].start = Q;
            this.runtimeAttributes[P].end = R;


            this.runtimeAttributes[P].unit = ( T(S[P].unit) ) ? S[P]['unit'] : this.getDefaultUnit(P);
        },


        init: function(el, U, V, W) {

            var  X = false;


            var  Y = null;


            var  Z = 0;


            el = Roo.getDom(el);


            this.attributes = U || {};


            this.duration = V || 1;


            this.method = W || Roo.lib.Easing.easeNone;


            this.useSeconds = true;


            this.currentFrame = 0;


            this.totalFrames = Roo.lib.AnimMgr.fps;


            this.getEl = function() {
                return  el;
            };


            this.isAnimated = function() {
                return  X;
            };


            this.getStartTime = function() {
                return  Y;
            };

            this.runtimeAttributes = {};


            this.animate = function() {
                if (this.isAnimated()) {
                    return  false;
                }


                this.currentFrame = 0;

                this.totalFrames = ( this.useSeconds ) ? Math.ceil(Roo.lib.AnimMgr.fps * this.duration) : this.duration;

                Roo.lib.AnimMgr.registerElement(this);
            };


            this.stop = function(e) {
                if (e) {
                    this.currentFrame = this.totalFrames;
                    this._onTween.fire();
                }

                Roo.lib.AnimMgr.stop(this);
            };

            var  b = function() {
                this.onStart.fire();

                this.runtimeAttributes = {};
                for (var  P  in  this.attributes) {
                    this.setRuntimeAttribute(P);
                }


                X = true;
                Z = 0;
                Y = new  Date();
            };


            var  c = function() {
                var  e = {
                    duration: new  Date() - this.getStartTime(),
                    currentFrame: this.currentFrame
                };

                e.toString = function() {
                    return  (
                            'duration: ' + e.duration +
                            ', currentFrame: ' + e.currentFrame
                            );
                };

                this.onTween.fire(e);

                var  g = this.runtimeAttributes;

                for (var  P  in  g) {
                    this.setAttribute(P, this.doMethod(P, g[P].start, g[P].end), g[P].unit);
                }


                Z += 1;
            };

            var  d = function() {
                var  e = (new  Date() - Y) / 1000 ;

                var  g = {
                    duration: e,
                    frames: Z,
                    fps: Z / e
                };

                g.toString = function() {
                    return  (
                            'duration: ' + g.duration +
                            ', frames: ' + g.frames +
                            ', fps: ' + g.fps
                            );
                };

                X = false;
                Z = 0;
                this.onComplete.fire(g);
            };


            this._onStart = new  Roo.util.Event(this);
            this.onStart = new  Roo.util.Event(this);
            this.onTween = new  Roo.util.Event(this);
            this._onTween = new  Roo.util.Event(this);
            this.onComplete = new  Roo.util.Event(this);
            this._onComplete = new  Roo.util.Event(this);
            this._onStart.addListener(b);
            this._onTween.addListener(c);
            this._onComplete.addListener(d);
        }
    };
})();




Roo.lib.AnimMgr = new  function() {

        var  A = null;


        var  B = [];


        var  C = 0;


        this.fps = 1000;


        this.delay = 1;


        this.registerElement = function(F) {
            B[B.length] = F;
            C += 1;
            F._onStart.fire();
            this.start();
        };


        this.unRegister = function(F, G) {
            F._onComplete.fire();
            G = G || D(F);
            if (G != -1) {
                B.splice(G, 1);
            }


            C -= 1;
            if (C <= 0) {
                this.stop();
            }
        };


        this.start = function() {
            if (A === null) {
                A = setInterval(this.run, this.delay);
            }
        };


        this.stop = function(F) {
            if (!F) {
                clearInterval(A);

                for (var  i = 0, len = B.length; i < len; ++i) {
                    if (B[0].isAnimated()) {
                        this.unRegister(B[0], 0);
                    }
                }


                B = [];
                A = null;
                C = 0;
            }
            else  {
                this.unRegister(F);
            }
        };


        this.run = function() {
            for (var  i = 0, len = B.length; i < len; ++i) {
                var  tween = B[i];
                if (!tween || !tween.isAnimated()) {
                    continue;
                }

                if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null)
                {
                    tween.currentFrame += 1;

                    if (tween.useSeconds) {
                        E(tween);
                    }

                    tween._onTween.fire();
                }
                else  {
                    Roo.lib.AnimMgr.stop(tween, i);
                }
            }
        };

        var  D = function(F) {
            for (var  i = 0, len = B.length; i < len; ++i) {
                if (B[i] == F) {
                    return  i;
                }
            }
            return  -1;
        };


        var  E = function(F) {
            var  G = F.totalFrames;
            var  H = F.currentFrame;
            var  I = (F.currentFrame * F.duration * 1000 / F.totalFrames);
            var  J = (new  Date() - F.getStartTime());
            var  K = 0;

            if (J < F.duration * 1000) {
                K = Math.round((J / I - 1) * F.currentFrame);
            } else  {
                K = G - (H + 1);
            }
            if (K > 0 && isFinite(K)) {
                if (F.currentFrame + K >= G) {
                    K = G - (H + 1);
                }


                F.currentFrame += K;
            }
        };
    };


Roo.lib.Bezier = new  function() {

        this.getPosition = function(A, t) {
            var  n = A.length;
            var  B = [];

            for (var  i = 0; i < n; ++i) {
                B[i] = [A[i][0], A[i][1]];
            }

            for (var  j = 1; j < n; ++j) {
                for (i = 0; i < n - j; ++i) {
                    B[i][0] = (1 - t) * B[i][0] + t * B[parseInt(i + 1, 10)][0];
                    B[i][1] = (1 - t) * B[i][1] + t * B[parseInt(i + 1, 10)][1];
                }
            }

            return  [ B[0][0], B[0][1] ];

        };
    };


(function() {

    Roo.lib.ColorAnim = function(el, D, E, F) {
        Roo.lib.ColorAnim.superclass.constructor.call(this, el, D, E, F);
    };

    Roo.extend(Roo.lib.ColorAnim, Roo.lib.AnimBase);

    var  A = Roo.lib.AnimBase.fly;
    var  Y = Roo.lib;
    var  B = Y.ColorAnim.superclass;
    var  C = Y.ColorAnim.prototype;

    C.toString = function() {
        var  el = this.getEl();
        var  id = el.id || el.tagName;
        return  ("ColorAnim " + id);
    };

    C.patterns.color = /color$/i;
    C.patterns.rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    C.patterns.hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    C.patterns.hex3 = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    C.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/;


    C.parseColor = function(s) {
        if (s.length == 3) {
            return  s;
        }

        var  c = this.patterns.hex.exec(s);
        if (c && c.length == 4) {
            return  [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
        }


        c = this.patterns.rgb.exec(s);
        if (c && c.length == 4) {
            return  [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
        }


        c = this.patterns.hex3.exec(s);
        if (c && c.length == 4) {
            return  [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
        }

        return  null;
    };
    
    C.getAttribute = function(D) {
        var  el = this.getEl();
        if (this.patterns.color.test(D)) {
            var  val = A(el).getStyle(D);

            if (this.patterns.transparent.test(val)) {
                var  parent = el.parentNode;
                val = A(parent).getStyle(D);

                while (parent && this.patterns.transparent.test(val)) {
                    parent = parent.parentNode;
                    val = A(parent).getStyle(D);
                    if (parent.tagName.toUpperCase() == 'HTML') {
                        val = '#fff';
                    }
                }
            }
        } else  {
            val = B.getAttribute.call(this, D);
        }

        return  val;
    };
    C.getAttribute = function(D) {
        var  el = this.getEl();
        if (this.patterns.color.test(D)) {
            var  val = A(el).getStyle(D);

            if (this.patterns.transparent.test(val)) {
                var  parent = el.parentNode;
                val = A(parent).getStyle(D);

                while (parent && this.patterns.transparent.test(val)) {
                    parent = parent.parentNode;
                    val = A(parent).getStyle(D);
                    if (parent.tagName.toUpperCase() == 'HTML') {
                        val = '#fff';
                    }
                }
            }
        } else  {
            val = B.getAttribute.call(this, D);
        }

        return  val;
    };

    C.doMethod = function(D, E, F) {
        var  G;

        if (this.patterns.color.test(D)) {
            G = [];
            for (var  i = 0, len = E.length; i < len; ++i) {
                G[i] = B.doMethod.call(this, D, E[i], F[i]);
            }


            G = 'rgb(' + Math.floor(G[0]) + ',' + Math.floor(G[1]) + ',' + Math.floor(G[2]) + ')';
        }
        else  {
            G = B.doMethod.call(this, D, E, F);
        }

        return  G;
    };

    C.setRuntimeAttribute = function(D) {
        B.setRuntimeAttribute.call(this, D);

        if (this.patterns.color.test(D)) {
            var  attributes = this.attributes;
            var  start = this.parseColor(this.runtimeAttributes[D].start);
            var  end = this.parseColor(this.runtimeAttributes[D].end);

            if (typeof  attributes[D]['to'] === 'undefined' && typeof  attributes[D]['by'] !== 'undefined') {
                end = this.parseColor(attributes[D].by);

                for (var  i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + end[i];
                }
            }


            this.runtimeAttributes[D].start = start;
            this.runtimeAttributes[D].end = end;
        }
    };
})();




Roo.lib.Easing = {


    easeNone: function (t, b, c, d) {
        return  c * t / d + b;
    },


    easeIn: function (t, b, c, d) {
        return  c * (t /= d) * t + b;
    },


    easeOut: function (t, b, c, d) {
        return  -c * (t /= d) * (t - 2) + b;
    },


    easeBoth: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return  c / 2 * t * t + b;
        }

        return  -c / 2 * ((--t) * (t - 2) - 1) + b;
    },


    easeInStrong: function (t, b, c, d) {
        return  c * (t /= d) * t * t * t + b;
    },


    easeOutStrong: function (t, b, c, d) {
        return  -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },


    easeBothStrong: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return  c / 2 * t * t * t * t + b;
        }

        return  -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },



    elasticIn: function (t, b, c, d, a, p) {
        if (t == 0) {
            return  b;
        }
        if ((t /= d) == 1) {
            return  b + c;
        }
        if (!p) {
            p = d * .3;
        }

        if (!a || a < Math.abs(c)) {
            a = c;
            var  s = p / 4;
        }
        else  {
            var  s = p / (2 * Math.PI) * Math.asin(c / a);
        }

        return  -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },


    elasticOut: function (t, b, c, d, a, p) {
        if (t == 0) {
            return  b;
        }
        if ((t /= d) == 1) {
            return  b + c;
        }
        if (!p) {
            p = d * .3;
        }

        if (!a || a < Math.abs(c)) {
            a = c;
            var  s = p / 4;
        }
        else  {
            var  s = p / (2 * Math.PI) * Math.asin(c / a);
        }

        return  a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },


    elasticBoth: function (t, b, c, d, a, p) {
        if (t == 0) {
            return  b;
        }

        if ((t /= d / 2) == 2) {
            return  b + c;
        }

        if (!p) {
            p = d * (.3 * 1.5);
        }

        if (!a || a < Math.abs(c)) {
            a = c;
            var  s = p / 4;
        }
        else  {
            var  s = p / (2 * Math.PI) * Math.asin(c / a);
        }

        if (t < 1) {
            return  -.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                          Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return  a * Math.pow(2, -10 * (t -= 1)) *
               Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },



    backIn: function (t, b, c, d, s) {
        if (typeof  s == 'undefined') {
            s = 1.70158;
        }
        return  c * (t /= d) * t * ((s + 1) * t - s) + b;
    },


    backOut: function (t, b, c, d, s) {
        if (typeof  s == 'undefined') {
            s = 1.70158;
        }
        return  c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },


    backBoth: function (t, b, c, d, s) {
        if (typeof  s == 'undefined') {
            s = 1.70158;
        }

        if ((t /= d / 2 ) < 1) {
            return  c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return  c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },


    bounceIn: function (t, b, c, d) {
        return  c - Roo.lib.Easing.bounceOut(d - t, 0, c, d) + b;
    },


    bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return  c * (7.5625 * t * t) + b;
        } else  if (t < (2 / 2.75)) {
            return  c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else  if (t < (2.5 / 2.75)) {
            return  c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        }
        return  c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    },


    bounceBoth: function (t, b, c, d) {
        if (t < d / 2) {
            return  Roo.lib.Easing.bounceIn(t * 2, 0, c, d) * .5 + b;
        }
        return  Roo.lib.Easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
};


    (function() {
        Roo.lib.Motion = function(el, E, F, G) {
            if (el) {
                Roo.lib.Motion.superclass.constructor.call(this, el, E, F, G);
            }
        };

        Roo.extend(Roo.lib.Motion, Roo.lib.ColorAnim);


        var  Y = Roo.lib;
        var  A = Y.Motion.superclass;
        var  B = Y.Motion.prototype;

        B.toString = function() {
            var  el = this.getEl();
            var  id = el.id || el.tagName;
            return  ("Motion " + id);
        };

        B.patterns.points = /^points$/i;

        B.setAttribute = function(E, F, G) {
            if (this.patterns.points.test(E)) {
                G = G || 'px';
                A.setAttribute.call(this, 'left', F[0], G);
                A.setAttribute.call(this, 'top', F[1], G);
            } else  {
                A.setAttribute.call(this, E, F, G);
            }
        };

        B.getAttribute = function(E) {
            if (this.patterns.points.test(E)) {
                var  val = [
                        A.getAttribute.call(this, 'left'),
                        A.getAttribute.call(this, 'top')
                        ];
            } else  {
                val = A.getAttribute.call(this, E);
            }

            return  val;
        };

        B.doMethod = function(E, F, G) {
            var  H = null;

            if (this.patterns.points.test(E)) {
                var  t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;
                H = Y.Bezier.getPosition(this.runtimeAttributes[E], t);
            } else  {
                H = A.doMethod.call(this, E, F, G);
            }
            return  H;
        };

        B.setRuntimeAttribute = function(E) {
            if (this.patterns.points.test(E)) {
                var  el = this.getEl();
                var  attributes = this.attributes;
                var  start;
                var  control = attributes['points']['control'] || [];
                var  end;
                var  i, len;

                if (control.length > 0 && !(control[0]  instanceof  Array)) {
                    control = [control];
                } else  {
                    var  tmp = [];
                    for (i = 0,len = control.length; i < len; ++i) {
                        tmp[i] = control[i];
                    }

                    control = tmp;
                }


                Roo.fly(el).position();

                if (D(attributes['points']['from'])) {
                    Roo.lib.Dom.setXY(el, attributes['points']['from']);
                }
                else  {
                    Roo.lib.Dom.setXY(el, Roo.lib.Dom.getXY(el));
                }


                start = this.getAttribute('points');


                if (D(attributes['points']['to'])) {
                    end = C.call(this, attributes['points']['to'], start);

                    var  pageXY = Roo.lib.Dom.getXY(this.getEl());
                    for (i = 0,len = control.length; i < len; ++i) {
                        control[i] = C.call(this, control[i], start);
                    }


                } else  if (D(attributes['points']['by'])) {
                    end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1] ];

                    for (i = 0,len = control.length; i < len; ++i) {
                        control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                    }
                }


                this.runtimeAttributes[E] = [start];

                if (control.length > 0) {
                    this.runtimeAttributes[E] = this.runtimeAttributes[E].concat(control);
                }


                this.runtimeAttributes[E][this.runtimeAttributes[E].length] = end;
            }
            else  {
                A.setRuntimeAttribute.call(this, E);
            }
        };

        var  C = function(E, F) {
            var  G = Roo.lib.Dom.getXY(this.getEl());
            E = [ E[0] - G[0] + F[0], E[1] - G[1] + F[1] ];

            return  E;
        };

        var  D = function(E) {
            return  (typeof  E !== 'undefined');
        };
    })();



    (function() {
        Roo.lib.Scroll = function(el, C, D, E) {
            if (el) {
                Roo.lib.Scroll.superclass.constructor.call(this, el, C, D, E);
            }
        };

        Roo.extend(Roo.lib.Scroll, Roo.lib.ColorAnim);


        var  Y = Roo.lib;
        var  A = Y.Scroll.superclass;
        var  B = Y.Scroll.prototype;

        B.toString = function() {
            var  el = this.getEl();
            var  id = el.id || el.tagName;
            return  ("Scroll " + id);
        };

        B.doMethod = function(C, D, E) {
            var  F = null;

            if (C == 'scroll') {
                F = [
                        this.method(this.currentFrame, D[0], E[0] - D[0], this.totalFrames),
                        this.method(this.currentFrame, D[1], E[1] - D[1], this.totalFrames)
                        ];

            } else  {
                F = A.doMethod.call(this, C, D, E);
            }
            return  F;
        };

        B.getAttribute = function(C) {
            var  D = null;
            var  el = this.getEl();

            if (C == 'scroll') {
                D = [ el.scrollLeft, el.scrollTop ];
            } else  {
                D = A.getAttribute.call(this, C);
            }

            return  D;
        };

        B.setAttribute = function(C, D, E) {
            var  el = this.getEl();

            if (C == 'scroll') {
                el.scrollLeft = D[0];
                el.scrollTop = D[1];
            } else  {
                A.setAttribute.call(this, C, D, E);
            }
        };
    })();



 



Roo.DomHelper = function(){
    var  A = null;
    var  B = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
    var  C = /^table|tbody|tr|td$/i;
    var  D = {};
    
    

    var  E = function(o){
        if(typeof  o == 'string'){
            return  o;
        }
        var  b = "";
        if(!o.tag){
            o.tag = "div";
        }

        b += "<" + o.tag;
        for(var  attr  in  o){
            if(attr == "tag" || attr == "children" || attr == "cn" || attr == "html" || typeof  o[attr] == "function") continue;
            if(attr == "style"){
                var  s = o["style"];
                if(typeof  s == "function"){
                    s = s.call();
                }
                if(typeof  s == "string"){
                    b += ' style="' + s + '"';
                }else  if(typeof  s == "object"){
                    b += ' style="';
                    for(var  key  in  s){
                        if(typeof  s[key] != "function"){
                            b += key + ":" + s[key] + ";";
                        }
                    }

                    b += '"';
                }
            }else {
                if(attr == "cls"){
                    b += ' class="' + o["cls"] + '"';
                }else  if(attr == "htmlFor"){
                    b += ' for="' + o["htmlFor"] + '"';
                }else {
                    b += " " + attr + '="' + o[attr] + '"';
                }
            }
        }
        if(B.test(o.tag)){
            b += "/>";
        }else {
            b += ">";
            var  cn = o.children || o.cn;
            if(cn){
                
                if((cn  instanceof  Array) || (Roo.isSafari && typeof(cn.join) == "function")){
                    for(var  i = 0, len = cn.length; i < len; i++) {
                        b += E(cn[i], b);
                    }
                }else {
                    b += E(cn, b);
                }
            }
            if(o.html){
                b += o.html;
            }

            b += "</" + o.tag + ">";
        }
        return  b;
    };

    
    

    var  F = function(o, M){
         
        
        var  ns = false;
        if (o.ns && o.ns != 'html') {
               
            if (o.xmlns && typeof(D[o.ns]) == 'undefined') {
                D[o.ns] = o.xmlns;
                ns = o.xmlns;
            }
            if (typeof(D[o.ns]) == 'undefined') {
                console.log("Trying to create namespace element " + o.ns + ", however no xmlns was sent to builder previously");
            }

            ns = D[o.ns];
        }
        
        
        if (typeof(o) == 'string') {
            return  M.appendChild(document.createTextNode(o));
        }

        o.tag = o.tag || div;
        if (o.ns && Roo.isIE) {
            ns = false;
            o.tag = o.ns + ':' + o.tag;
            
        }
        var  el = ns ? document.createElementNS( ns, o.tag||'div') :  document.createElement(o.tag||'div');
        var  N = el.setAttribute ? true : false; 
        for(var  attr  in  o){
            
            if(attr == "tag" || attr == "ns" ||attr == "xmlns" ||attr == "children" || attr == "cn" || attr == "html" || 
                    attr == "style" || typeof  o[attr] == "function") continue;
                    
            if(attr=="cls" && Roo.isIE){
                el.className = o["cls"];
            }else {
                if(N) el.setAttribute(attr=="cls" ? 'class' : attr, o[attr]);
                else  el[attr] = o[attr];
            }
        }

        Roo.DomHelper.applyStyles(el, o.style);
        var  cn = o.children || o.cn;
        if(cn){
            
             if((cn  instanceof  Array) || (Roo.isSafari && typeof(cn.join) == "function")){
                for(var  i = 0, len = cn.length; i < len; i++) {
                    F(cn[i], el);
                }
            }else {
                F(cn, el);
            }
        }
        if(o.html){
            el.innerHTML = o.html;
        }
        if(M){
           M.appendChild(el);
        }
        return  el;
    };

    var  G = function(M, s, h, e){
        A.innerHTML = [s, h, e].join('');
        var  i = -1, el = A;
        while(++i < M){
            el = el.firstChild;
        }
        return  el;
    };

    
    var  ts = '<table>',
        te = '</table>',
        H = ts+'<tbody>',
        I = '</tbody>'+te,
        J = H + '<tr>',
        K = '</tr>'+I;

    

    var  L = function(M, N, el, O){
        if(!A){
            A = document.createElement('div');
        }
        var  P;
        var  Q = null;
        if(M == 'td'){
            if(N == 'afterbegin' || N == 'beforeend'){ 
                return;
            }
            if(N == 'beforebegin'){
                Q = el;
                el = el.parentNode;
            } else {
                Q = el.nextSibling;
                el = el.parentNode;
            }

            P = G(4, J, O, K);
        }
        else  if(M == 'tr'){
            if(N == 'beforebegin'){
                Q = el;
                el = el.parentNode;
                P = G(3, H, O, I);
            } else  if(N == 'afterend'){
                Q = el.nextSibling;
                el = el.parentNode;
                P = G(3, H, O, I);
            } else { 
                if(N == 'afterbegin'){
                    Q = el.firstChild;
                }

                P = G(4, J, O, K);
            }
        } else  if(M == 'tbody'){
            if(N == 'beforebegin'){
                Q = el;
                el = el.parentNode;
                P = G(2, ts, O, te);
            } else  if(N == 'afterend'){
                Q = el.nextSibling;
                el = el.parentNode;
                P = G(2, ts, O, te);
            } else {
                if(N == 'afterbegin'){
                    Q = el.firstChild;
                }

                P = G(3, H, O, I);
            }
        } else { 
            if(N == 'beforebegin' || N == 'afterend'){ 
                return;
            }
            if(N == 'afterbegin'){
                Q = el.firstChild;
            }

            P = G(2, ts, O, te);
        }

        el.insertBefore(P, Q);
        return  P;
    };

    return  {
    

    useDom : false,

    

    markup : function(o){
        return  E(o);
    },

    

    applyStyles : function(el, c){
        if(c){
           el = Roo.fly(el);
           if(typeof  c == "string"){
               var  re = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
               var  matches;
               while ((matches = re.exec(c)) != null){
                   el.setStyle(matches[1], matches[2]);
               }
           }else  if (typeof  c == "object"){
               for (var  style  in  c){
                  el.setStyle(style, c[style]);
               }
           }else  if (typeof  c == "function"){
                Roo.DomHelper.applyStyles(el, c.call());
           }
        }
    },

    

    insertHtml : function(d, el, e){
        d = d.toLowerCase();
        if(el.insertAdjacentHTML){
            if(C.test(el.tagName)){
                var  rs;
                if(rs = L(el.tagName.toLowerCase(), d, el, e)){
                    return  rs;
                }
            }
            switch(d){
                case  "beforebegin":
                    el.insertAdjacentHTML('BeforeBegin', e);
                    return  el.previousSibling;
                case  "afterbegin":
                    el.insertAdjacentHTML('AfterBegin', e);
                    return  el.firstChild;
                case  "beforeend":
                    el.insertAdjacentHTML('BeforeEnd', e);
                    return  el.lastChild;
                case  "afterend":
                    el.insertAdjacentHTML('AfterEnd', e);
                    return  el.nextSibling;
            }
            throw  'Illegal insertion point -> "' + d + '"';
        }
        var  f = el.ownerDocument.createRange();
        var  g;
        switch(d){
             case  "beforebegin":
                f.setStartBefore(el);
                g = f.createContextualFragment(e);
                el.parentNode.insertBefore(g, el);
                return  el.previousSibling;
             case  "afterbegin":
                if(el.firstChild){
                    f.setStartBefore(el.firstChild);
                    g = f.createContextualFragment(e);
                    el.insertBefore(g, el.firstChild);
                    return  el.firstChild;
                }else {
                    el.innerHTML = e;
                    return  el.firstChild;
                }
            case  "beforeend":
                if(el.lastChild){
                    f.setStartAfter(el.lastChild);
                    g = f.createContextualFragment(e);
                    el.appendChild(g);
                    return  el.lastChild;
                }else {
                    el.innerHTML = e;
                    return  el.lastChild;
                }
            case  "afterend":
                f.setStartAfter(el);
                g = f.createContextualFragment(e);
                el.parentNode.insertBefore(g, el.nextSibling);
                return  el.nextSibling;
            }
            throw  'Illegal insertion point -> "' + d + '"';
    },

    

    insertBefore : function(el, o, h){
        return  this.doInsert(el, o, h, "beforeBegin");
    },

    

    insertAfter : function(el, o, j){
        return  this.doInsert(el, o, j, "afterEnd", "nextSibling");
    },

    

    insertFirst : function(el, o, k){
        return  this.doInsert(el, o, k, "afterBegin");
    },

    
    doInsert : function(el, o, l, m, n){
        el = Roo.getDom(el);
        var  p;
        if(this.useDom || o.ns){
            p = F(o, null);
            el.parentNode.insertBefore(p, n ? el[n] : el);
        }else {
            var  e = E(o);
            p = this.insertHtml(m, el, e);
        }
        return  l ? Roo.get(p, true) : p;
    },

    

    append : function(el, o, q){
        el = Roo.getDom(el);
        var  r;
        if(this.useDom || o.ns){
            r = F(o, null);
            el.appendChild(r);
        }else {
            var  e = E(o);
            r = this.insertHtml("beforeEnd", el, e);
        }
        return  q ? Roo.get(r, true) : r;
    },

    

    overwrite : function(el, o, t){
        el = Roo.getDom(el);
        if (o.ns) {
          
            while (el.childNodes.length) {
                el.removeChild(el.firstChild);
            }

            F(o, el);
        } else  {
            el.innerHTML = E(o);   
        }
        
        return  t ? Roo.get(el.firstChild, true) : el.firstChild;
    },

    

    createTemplate : function(o){
        var  u = E(o);
        return  new  Roo.Template(u);
    }
    };
}();



 


Roo.Template = function(A){
    
    if(A  instanceof  Array){
        A = A.join("");
    }else  if(arguments.length > 1){
        A = Array.prototype.join.call(arguments, "");
    }
    
    
    if (typeof(A) == 'object') {
        Roo.apply(this,A)
    } else  {
        
        this.html = A;
    }
    
    
};
Roo.Template.prototype = {
    
    

    html : '',
    

    applyTemplate : function(values){
        try {
            
            if(this.compiled){
                return  this.compiled(values);
            }
            var  useF = this.disableFormats !== true;
            var  fm = Roo.util.Format, tpl = this;
            var  fn = function(m, E, F, G){
                if(F && useF){
                    if(F.substr(0, 5) == "this."){
                        return  tpl.call(F.substr(5), values[E], values);
                    }else {
                        if(G){
                            
                            
                            
                            var  re = /^\s*['"](.*)["']\s*$/;
                            G = G.split(',');
                            for(var  i = 0, len = G.length; i < len; i++){
                                G[i] = G[i].replace(re, "$1");
                            }

                            G = [values[E]].concat(G);
                        }else {
                            G = [values[E]];
                        }
                        return  fm[F].apply(fm, G);
                    }
                }else {
                    return  values[E] !== undefined ? values[E] : "";
                }
            };
            return  this.html.replace(this.re, fn);
        } catch (e) {
            Roo.log(e);
            throw  e;
        }
         
    },
    
    

    set : function(B, C){
        this.html = B;
        this.compiled = null;
        if(C){
            this.compile();
        }
        return  this;
    },
    
    

    disableFormats : false,
    
    

    re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
    
    

    compile : function(){
        var  fm = Roo.util.Format;
        var  D = this.disableFormats !== true;
        var  E = Roo.isGecko ? "+" : ",";
        var  fn = function(m, G, H, I){
            if(H && D){
                I = I ? ',' + I : "";
                if(H.substr(0, 5) != "this."){
                    H = "fm." + H + '(';
                }else {
                    H = 'this.call("'+ H.substr(5) + '", ';
                    I = ", values";
                }
            }else {
                I= ''; H = "(values['" + G + "'] == undefined ? '' : ";
            }
            return  "'"+ E + H + "values['" + G + "']" + I + ")"+E+"'";
        };
        var  F;
        
        if(Roo.isGecko){
            F = "this.compiled = function(values){ return '" +
                   this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
                    "';};";
        }else {
            F = ["this.compiled = function(values){ return ['"];
            F.push(this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn));
            F.push("'].join('');};");
            F = F.join('');
        }
        

        eval(F);
        return  this;
    },
    
    
    call : function(G, H, I){
        return  this[G](H, I);
    },
    
    

    insertFirst: function(el, J, K){
        return  this.doInsert('afterBegin', el, J, K);
    },

    

    insertBefore: function(el, L, M){
        return  this.doInsert('beforeBegin', el, L, M);
    },

    

    insertAfter : function(el, N, O){
        return  this.doInsert('afterEnd', el, N, O);
    },
    
    

    append : function(el, P, Q){
        return  this.doInsert('beforeEnd', el, P, Q);
    },

    doInsert : function(R, el, S, T){
        el = Roo.getDom(el);
        var  U = Roo.DomHelper.insertHtml(R, el, this.applyTemplate(S));
        return  T ? Roo.get(U, true) : U;
    },

    

    overwrite : function(el, V, W){
        el = Roo.getDom(el);
        el.innerHTML = this.applyTemplate(V);
        return  W ? Roo.get(el.firstChild, true) : el.firstChild;
    }
};


Roo.Template.prototype.apply = Roo.Template.prototype.applyTemplate;


Roo.DomHelper.Template = Roo.Template;



Roo.Template.from = function(el){
    el = Roo.getDom(el);
    return  new  Roo.Template(el.value || el.innerHTML);
};


 





Roo.DomQuery = function(){
    var  A = {}, simpleCache = {}, valueCache = {};
    var  B = /\S/;
    var  C = /^\s+|\s+$/g;
    var  D = /\{(\d+)\}/g;
    var  E = /^(\s?[\/>+~]\s?|\s|$)/;
    var  F = /^(#)?([\w-\*]+)/;
    var  G = /(\d*)n\+?(\d*)/, H = /\D/;

    function  I(p, T){
        var  i = 0;
        var  n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == T){
                   return  n;
               }
            }

            n = n.nextSibling;
        }
        return  null;
    };

    function  J(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return  n;
    };

    function  K(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return  n;
    };

    function  L(d){
        var  n = d.firstChild, ni = -1;
 	    while(n){
 	        var  nx = n.nextSibling;
 	        if(n.nodeType == 3 && !B.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else {
 	            n.nodeIndex = ++ni;
 	        }

 	        n = nx;
 	    }
 	    return  this;
 	};

    function  byClassName(c, a, v){
        if(!v){
            return  c;
        }
        var  r = [], ri = -1, cn;
        for(var  i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return  r;
    };

    function  attrValue(n, T){
        if(!n.tagName && typeof  n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return  null;
        }
        if(T == "for"){
            return  n.htmlFor;
        }
        if(T == "class" || T == "className"){
            return  n.className;
        }
        return  n.getAttribute(T) || n[T];

    };

    function  getNodes(ns, T, U){
        var  V = [], ri = -1, cs;
        if(!ns){
            return  V;
        }

        U = U || "*";
        if(typeof  ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!T){
            for(var  i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(U);
                for(var  j = 0, ci; ci = cs[j]; j++){
                    V[++ri] = ci;
                }
            }
        }else  if(T == "/" || T == ">"){
            var  utag = U.toUpperCase();
            for(var  i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.children || ni.childNodes;
                for(var  j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == U  || U == '*'){
                        V[++ri] = cj;
                    }
                }
            }
        }else  if(T == "+"){
            var  utag = U.toUpperCase();
            for(var  i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == U || U == '*')){
                    V[++ri] = n;
                }
            }
        }else  if(T == "~"){
            for(var  i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && (n.nodeType != 1 || (U == '*' || n.tagName.toLowerCase()!=U)));
                if(n){
                    V[++ri] = n;
                }
            }
        }
        return  V;
    };

    function  M(a, b){
        if(b.slice){
            return  a.concat(b);
        }
        for(var  i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return  a;
    }

    function  byTag(cs, T){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!T){
            return  cs;
        }
        var  r = [], ri = -1;
        T = T.toLowerCase();
        for(var  i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==T){
                r[++ri] = ci;
            }
        }
        return  r;
    };

    function  N(cs, T, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return  cs;
        }
        var  r = [], ri = -1;
        for(var  i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return  r;
            }
        }
        return  r;
    };

    function  byAttribute(cs, T, U, op, V){
        var  r = [], ri = -1, st = V=="{";
        var  f = Roo.DomQuery.operators[op];
        for(var  i = 0, ci; ci = cs[i]; i++){
            var  a;
            if(st){
                a = Roo.DomQuery.getStyle(ci, T);
            }
            else  if(T == "class" || T == "className"){
                a = ci.className;
            }else  if(T == "for"){
                a = ci.htmlFor;
            }else  if(T == "href"){
                a = ci.getAttribute("href", 2);
            }else {
                a = ci.getAttribute(T);
            }
            if((f && f(a, U)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return  r;
    };

    function  byPseudo(cs, T, U){
        return  Roo.DomQuery.pseudos[T](cs, U);
    };

    
    
    
    var  O = window.ActiveXObject ? true : false;

    
    
    
    

    var  batch = 30803; 

    var  P = 30803;

    function  Q(cs){
        var  d = ++P;
        cs[0].setAttribute("_nodup", d);
        var  r = [cs[0]];
        for(var  i = 1, len = cs.length; i < len; i++){
            var  c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var  i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return  r;
    }

    function  nodup(cs){
        if(!cs){
            return  [];
        }
        var  T = cs.length, c, i, r = cs, cj, ri = -1;
        if(!T || typeof  cs.nodeType != "undefined" || T == 1){
            return  cs;
        }
        if(O && typeof  cs[0].selectSingleNode != "undefined"){
            return  Q(cs);
        }
        var  d = ++P;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else {
                r = [];
                for(var  j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return  r;
            }
        }
        return  r;
    }

    function  R(c1, c2){
        var  d = ++P;
        for(var  i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }
        var  r = [];
        for(var  i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var  i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return  r;
    }

    function  S(c1, c2){
        var  T = c1.length;
        if(!T){
            return  c2;
        }
        if(O && c1[0].selectSingleNode){
            return  R(c1, c2);
        }
        var  d = ++P;
        for(var  i = 0; i < T; i++){
            c1[i]._qdiff = d;
        }
        var  r = [];
        for(var  i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return  r;
    }

    function  quickId(ns, T, U, id){
        if(ns == U){
           var  d = U.ownerDocument || U;
           return  d.getElementById(id);
        }

        ns = getNodes(ns, T, "*");
        return  N(ns, null, id);
    }

    return  {
        getStyle : function(el, AA){
            return  Roo.fly(el).getStyle(AA);
        },
        

        compile : function(AB, AC){
            AC = AC || "select";
            
            var  fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"];
            var  q = AB, mode, lq;
            var  tk = Roo.DomQuery.matchers;
            var  AD = tk.length;
            var  mm;

            
            var  AE = q.match(E);
            if(AE && AE[1]){
                fn[fn.length] = 'mode="'+AE[1].replace(C, "")+'";';
                q = q.replace(AE[1], "");
            }
            
            while(AB.substr(0, 1)=="/"){
                AB = AB.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var  tm = q.match(F);
                if(AC == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else {
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }

                        q = q.replace(tm[0], "");
                    }else  if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else {
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else {
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }

                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(E))){
                    var  matched = false;
                    for(var  j = 0; j < AD; j++){
                        var  t = tk[j];
                        var  m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(D, function(x, i){
                                                    return  m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    
                    if(!matched){
                        throw  'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(C, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }

            fn[fn.length] = "return nodup(n);\n}";
            
             
 
            eval(fn.join(""));
            return  f;
        },

        

        select : function(AF, AG, AH){
            if(!AG || AG == document){
                AG = document;
            }
            if(typeof  AG == "string"){
                AG = document.getElementById(AG);
            }
            var  AI = AF.split(",");
            var  AJ = [];
            for(var  i = 0, len = AI.length; i < len; i++){
                var  p = AI[i].replace(C, "");
                if(!A[p]){
                    A[p] = Roo.DomQuery.compile(p);
                    if(!A[p]){
                        throw  p + " is not a valid selector";
                    }
                }
                var  z = A[p](AG);
                if(z && z != document){
                    AJ = AJ.concat(z);
                }
            }
            if(AI.length > 1){
                return  nodup(AJ);
            }
            return  AJ;
        },

        

        selectNode : function(AK, AL){
            return  Roo.DomQuery.select(AK, AL)[0];
        },

        

        selectValue : function(AM, AN, AO){
            AM = AM.replace(C, "");
            if(!valueCache[AM]){
                valueCache[AM] = Roo.DomQuery.compile(AM, "select");
            }
            var  n = valueCache[AM](AN);
            n = n[0] ? n[0] : n;
            var  v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return  ((v === null||v === undefined||v==='') ? AO : v);
        },

        

        selectNumber : function(AP, AQ, AR){
            var  v = Roo.DomQuery.selectValue(AP, AQ, AR || 0);
            return  parseFloat(v);
        },

        

        is : function(el, ss){
            if(typeof  el == "string"){
                el = document.getElementById(el);
            }
            var  AS = (el  instanceof  Array);
            var  AT = Roo.DomQuery.filter(AS ? el : [el], ss);
            return  AS ? (AT.length == el.length) : (AT.length > 0);
        },

        

        filter : function(AU, ss, AV){
            ss = ss.replace(C, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Roo.DomQuery.compile(ss, "simple");
            }
            var  AW = simpleCache[ss](AU);
            return  AV ? S(AW, AU) : AW;
        },

        

        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        

        operators : {
            "=" : function(a, v){
                return  a == v;
            },
            "!=" : function(a, v){
                return  a != v;
            },
            "^=" : function(a, v){
                return  a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return  a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return  a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return  (a % v) == 0;
            },
            "|=" : function(a, v){
                return  a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return  a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        

        pseudos : {
            "first-child" : function(c){
                var  r = [], ri = -1, n;
                for(var  i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "last-child" : function(c){
                var  r = [], ri = -1, n;
                for(var  i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "nth-child" : function(c, a) {
                var  r = [], ri = -1;
                var  m = G.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !H.test(a) && "n+" + a || a);
                var  f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var  i = 0, n; n = c[i]; i++){
                    var  pn = n.parentNode;
                    if (batch != pn._batch) {
                        var  j = 0;
                        for(var  cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }

                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else  if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return  r;
            },

            "only-child" : function(c){
                var  r = [], ri = -1;;
                for(var  i = 0, ci; ci = c[i]; i++){
                    if(!K(ci) && !J(ci)){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "empty" : function(c){
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    var  cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "contains" : function(c, v){
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "nodeValue" : function(c, v){
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "checked" : function(c){
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "not" : function(c, ss){
                return  Roo.DomQuery.filter(c, ss, true);
            },

            "odd" : function(c){
                return  this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return  this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return  c[a-1] || [];
            },

            "first" : function(c){
                return  c[0] || [];
            },

            "last" : function(c){
                return  c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var  s = Roo.DomQuery.select;
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "next" : function(c, ss){
                var  is = Roo.DomQuery.is;
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    var  n = J(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return  r;
            },

            "prev" : function(c, ss){
                var  is = Roo.DomQuery.is;
                var  r = [], ri = -1;
                for(var  i = 0, ci; ci = c[i]; i++){
                    var  n = K(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return  r;
            }
        }
    };
}();



Roo.query = Roo.DomQuery.select;







Roo.util.Observable = function(A){
    
    A = A|| {};
    this.addEvents(A.events || {});
    if (A.events) {
        delete  A.events; 
    }

     
    Roo.apply(this, A);
    
    if(this.listeners){
        this.on(this.listeners);
        delete  this.listeners;
    }
};
Roo.util.Observable.prototype = {
    

    
    
    

    fireEvent : function(){
        var  ce = this.events[arguments[0].toLowerCase()];
        if(typeof  ce == "object"){
            return  ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
        }else {
            return  true;
        }
    },

    
    filterOptRe : /^(?:scope|delay|buffer|single)$/,

    

    addListener : function(B, fn, C, o){
        if(typeof  B == "object"){
            o = B;
            for(var  e  in  o){
                if(this.filterOptRe.test(e)){
                    continue;
                }
                if(typeof  o[e] == "function"){
                    
                    this.addListener(e, o[e], o.scope,  o);
                }else {
                    
                    this.addListener(e, o[e].fn, o[e].scope, o[e]);
                }
            }
            return;
        }

        o = (!o || typeof  o == "boolean") ? {} : o;
        B = B.toLowerCase();
        var  ce = this.events[B] || true;
        if(typeof  ce == "boolean"){
            ce = new  Roo.util.Event(this, B);
            this.events[B] = ce;
        }

        ce.addListener(fn, C, o);
    },

    

    removeListener : function(D, fn, E){
        var  ce = this.events[D.toLowerCase()];
        if(typeof  ce == "object"){
            ce.removeListener(fn, E);
        }
    },

    

    purgeListeners : function(){
        for(var  evt  in  this.events){
            if(typeof  this.events[evt] == "object"){
                 this.events[evt].clearListeners();
            }
        }
    },

    relayEvents : function(o, F){
        var  G = function(H){
            return  function(){
                return  this.fireEvent.apply(this, Roo.combine(H, Array.prototype.slice.call(arguments, 0)));
            };
        };
        for(var  i = 0, len = F.length; i < len; i++){
            var  ename = F[i];
            if(!this.events[ename]){ this.events[ename] = true; };
            o.on(ename, G(ename), this);
        }
    },

    

    addEvents : function(o){
        if(!this.events){
            this.events = {};
        }

        Roo.applyIf(this.events, o);
    },

    

    hasListener : function(H){
        var  e = this.events[H];
        return  typeof  e == "object" && e.listeners.length > 0;
    }
};


Roo.util.Observable.prototype.on = Roo.util.Observable.prototype.addListener;


Roo.util.Observable.prototype.un = Roo.util.Observable.prototype.removeListener;



Roo.util.Observable.capture = function(o, fn, I){
    o.fireEvent = o.fireEvent.createInterceptor(fn, I);
};



Roo.util.Observable.releaseCapture = function(o){
    o.fireEvent = Roo.util.Observable.prototype.fireEvent;
};

(function(){

    var  J = function(h, o, M){
        var  N = new  Roo.util.DelayedTask();
        return  function(){
            N.delay(o.buffer, h, M, Array.prototype.slice.call(arguments, 0));
        };
    };

    var  K = function(h, e, fn, M){
        return  function(){
            e.removeListener(fn, M);
            return  h.apply(M, arguments);
        };
    };

    var  L = function(h, o, M){
        return  function(){
            var  N = Array.prototype.slice.call(arguments, 0);
            setTimeout(function(){
                h.apply(M, N);
            }, o.delay || 10);
        };
    };

    Roo.util.Event = function(M, N){
        this.name = N;
        this.obj = M;
        this.listeners = [];
    };

    Roo.util.Event.prototype = {
        addListener : function(fn, M, N){
            var  o = N || {};
            M = M || this.obj;
            if(!this.isListening(fn, M)){
                var  l = {fn: fn, scope: M, options: o};
                var  h = fn;
                if(o.delay){
                    h = L(h, o, M);
                }
                if(o.single){
                    h = K(h, this, fn, M);
                }
                if(o.buffer){
                    h = J(h, o, M);
                }

                l.fireFn = h;
                if(!this.firing){ 
                    this.listeners.push(l);
                }else {
                    this.listeners = this.listeners.slice(0);
                    this.listeners.push(l);
                }
            }
        },

        findListener : function(fn, O){
            O = O || this.obj;
            var  ls = this.listeners;
            for(var  i = 0, len = ls.length; i < len; i++){
                var  l = ls[i];
                if(l.fn == fn && l.scope == O){
                    return  i;
                }
            }
            return  -1;
        },

        isListening : function(fn, P){
            return  this.findListener(fn, P) != -1;
        },

        removeListener : function(fn, Q){
            var  R;
            if((R = this.findListener(fn, Q)) != -1){
                if(!this.firing){
                    this.listeners.splice(R, 1);
                }else {
                    this.listeners = this.listeners.slice(0);
                    this.listeners.splice(R, 1);
                }
                return  true;
            }
            return  false;
        },

        clearListeners : function(){
            this.listeners = [];
        },

        fire : function(){
            var  ls = this.listeners, S, T = ls.length;
            if(T > 0){
                this.firing = true;
                var  args = Array.prototype.slice.call(arguments, 0);
                for(var  i = 0; i < T; i++){
                    var  l = ls[i];
                    if(l.fireFn.apply(l.scope||this.obj||window, arguments) === false){
                        this.firing = false;
                        return  false;
                    }
                }

                this.firing = false;
            }
            return  true;
        }
    };
})();





Roo.EventManager = function(){
    var  A, B, C = false;
    var  F, G, H, I;
    var  E = Roo.lib.Event;
    var  D = Roo.lib.Dom;


    var  J = function(){
        if(!C){
            C = true;
            Roo.isReady = true;
            if(B){
                clearInterval(B);
            }
            if(Roo.isGecko || Roo.isOpera) {
                document.removeEventListener("DOMContentLoaded", J, false);
            }
            if(Roo.isIE){
                var  defer = document.getElementById("ie-deferred-loader");
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(A){
                A.fire();
                A.clearListeners();
            }
        }
    };
    
    var  K = function(){
        A = new  Roo.util.Event();
        if(Roo.isGecko || Roo.isOpera) {
            document.addEventListener("DOMContentLoaded", J, false);
        }else  if(Roo.isIE){
            document.write("<s"+'cript id="ie-deferred-loader" defer="defer" src="/'+'/:"></s'+"cript>");
            var  defer = document.getElementById("ie-deferred-loader");
            defer.onreadystatechange = function(){
                if(this.readyState == "complete"){
                    J();
                }
            };
        }else  if(Roo.isSafari){ 
            B = setInterval(function(){
                var  rs = document.readyState;
                if(rs == "complete") {
                    J();     
                 }
            }, 10);
        }

        
        E.on(window, "load", J);
    };

    var  L = function(h, o){
        var  S = new  Roo.util.DelayedTask(h);
        return  function(e){
            
            e = new  Roo.EventObjectImpl(e);
            S.delay(o.buffer, h, null, [e]);
        };
    };

    var  M = function(h, el, S, fn){
        return  function(e){
            Roo.EventManager.removeListener(el, S, fn);
            h(e);
        };
    };

    var  N = function(h, o){
        return  function(e){
            
            e = new  Roo.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };

    var  O = function(S, T, U, fn, V){
        var  o = (!U || typeof  U == "boolean") ? {} : U;
        fn = fn || o.fn; V = V || o.scope;
        var  el = Roo.getDom(S);
        if(!el){
            throw  "Error listening for \"" + T + '\". Element "' + S + '" doesn\'t exist.';
        }
        var  h = function(e){
            e = Roo.EventObject.setEvent(e);
            var  t;
            if(o.delegate){
                t = e.getTarget(o.delegate, el);
                if(!t){
                    return;
                }
            }else {
                t = e.target;
            }
            if(o.stopEvent === true){
                e.stopEvent();
            }
            if(o.preventDefault === true){
               e.preventDefault();
            }
            if(o.stopPropagation === true){
                e.stopPropagation();
            }

            if(o.normalized === false){
                e = e.browserEvent;
            }


            fn.call(V || el, e, t, o);
        };
        if(o.delay){
            h = N(h, o);
        }
        if(o.single){
            h = M(h, el, T, fn);
        }
        if(o.buffer){
            h = L(h, o);
        }

        fn._handlers = fn._handlers || [];
        fn._handlers.push([Roo.id(el), T, h]);

        E.on(el, T, h);
        if(T == "mousewheel" && el.addEventListener){ 
            el.addEventListener("DOMMouseScroll", h, false);
            E.on(window, 'unload', function(){
                el.removeEventListener("DOMMouseScroll", h, false);
            });
        }
        if(T == "mousedown" && el == document){ 
            Roo.EventManager.stoppedMouseDownEvent.addListener(h);
        }
        return  h;
    };

    var  P = function(el, S, fn){
        var  id = Roo.id(el), T = fn._handlers, hd = fn;
        if(T){
            for(var  i = 0, len = T.length; i < len; i++){
                var  h = T[i];
                if(h[0] == id && h[1] == S){
                    hd = h[2];
                    T.splice(i, 1);
                    break;
                }
            }
        }

        E.un(el, S, hd);
        el = Roo.getDom(el);
        if(S == "mousewheel" && el.addEventListener){
            el.removeEventListener("DOMMouseScroll", hd, false);
        }
        if(S == "mousedown" && el == document){ 
            Roo.EventManager.stoppedMouseDownEvent.removeListener(hd);
        }
    };

    var  Q = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
    
    var  R = {
        
        
        

        
        
        

        wrap : function(fn, S, T){
            return  function(e){
                Roo.EventObject.setEvent(e);
                fn.call(T ? S || window : window, Roo.EventObject, S);
            };
        },
        
        

        addListener : function(U, V, fn, W, X){
            if(typeof  V == "object"){
                var  o = V;
                for(var  e  in  o){
                    if(Q.test(e)){
                        continue;
                    }
                    if(typeof  o[e] == "function"){
                        
                        O(U, e, o, o[e], o.scope);
                    }else {
                        
                        O(U, e, o[e]);
                    }
                }
                return;
            }
            return  O(U, V, X, fn, W);
        },
        
        

        removeListener : function(Y, Z, fn){
            return  P(Y, Z, fn);
        },
        
        

        onDocumentReady : function(fn, a, b){
            if(C){ 
                A.addListener(fn, a, b);
                A.fire();
                A.clearListeners();
                return;
            }
            if(!A){
                K();
            }

            A.addListener(fn, a, b);
        },
        
        

        onWindowResize : function(fn, c, d){
            if(!F){
                F = new  Roo.util.Event();
                G = new  Roo.util.DelayedTask(function(){
                    F.fire(D.getViewWidth(), D.getViewHeight());
                });
                E.on(window, "resize", function(){
                    if(Roo.isIE){
                        G.delay(50);
                    }else {
                        F.fire(D.getViewWidth(), D.getViewHeight());
                    }
                });
            }

            F.addListener(fn, c, d);
        },

        

        onTextResize : function(fn, f, g){
            if(!H){
                H = new  Roo.util.Event();
                var  textEl = new  Roo.Element(document.createElement('div'));
                textEl.dom.className = 'x-text-resize';
                textEl.dom.innerHTML = 'X';
                textEl.appendTo(document.body);
                I = textEl.dom.offsetHeight;
                setInterval(function(){
                    if(textEl.dom.offsetHeight != I){
                        H.fire(I, I = textEl.dom.offsetHeight);
                    }
                }, this.textResizeInterval);
            }

            H.addListener(fn, f, g);
        },

        

        removeResizeListener : function(fn, j){
            if(F){
                F.removeListener(fn, j);
            }
        },

        
        fireResize : function(){
            if(F){
                F.fire(D.getViewWidth(), D.getViewHeight());
            }   
        },
        

        ieDeferSrc : false,
        

        textResizeInterval : 50
    };
    
    

    
     

    R.on = R.addListener;
    R.un = R.removeListener;

    R.stoppedMouseDownEvent = new  Roo.util.Event();
    return  R;
}();


Roo.onReady = Roo.EventManager.onDocumentReady;

Roo.onReady(function(){
    var  bd = Roo.get(document.body);
    if(!bd){ return; }

    var  S = [
            Roo.isIE ? "roo-ie"
            : Roo.isGecko ? "roo-gecko"
            : Roo.isOpera ? "roo-opera"
            : Roo.isSafari ? "roo-safari" : ""];

    if(Roo.isMac){
        S.push("roo-mac");
    }
    if(Roo.isLinux){
        S.push("roo-linux");
    }
    if(Roo.isBorderBox){
        S.push('roo-border-box');
    }
    if(Roo.isStrict){ 
        var  p = bd.dom.parentNode;
        if(p){
            p.className += ' roo-strict';
        }
    }

    bd.addClass(S.join(' '));
});



Roo.EventObject = function(){
    
    var  E = Roo.lib.Event;
    
    
    var  T = {
        63234 : 37, 
        63235 : 39, 
        63232 : 38, 
        63233 : 40, 
        63276 : 33, 
        63277 : 34, 
        63272 : 46, 
        63273 : 36, 
        63275 : 35  
    };

    
    var  U = Roo.isIE ? {1:0,4:1,2:2} :
                (Roo.isSafari ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Roo.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };
    Roo.EventObjectImpl.prototype = {
        

            

        
        
        

        browserEvent : null,
        

        button : -1,
        

        shiftKey : false,
        

        ctrlKey : false,
        

        altKey : false,

        

        BACKSPACE : 8,
        

        TAB : 9,
        

        RETURN  : 13,
        

        ENTER : 13,
        

        SHIFT : 16,
        

        CONTROL : 17,
        

        ESC : 27,
        

        SPACE : 32,
        

        PAGEUP : 33,
        

        PAGEDOWN : 34,
        

        END : 35,
        

        HOME : 36,
        

        LEFT : 37,
        

        UP : 38,
        

        RIGHT : 39,
        

        DOWN : 40,
        

        DELETE  : 46,
        

        F5 : 116,

           

        setEvent : function(e){
            if(e == this || (e && e.browserEvent)){ 
                return  e;
            }

            this.browserEvent = e;
            if(e){
                
                this.button = e.button ? U[e.button] : (e.which ? e.which-1 : -1);
                if(e.type == 'click' && this.button == -1){
                    this.button = 0;
                }

                this.type = e.type;
                this.shiftKey = e.shiftKey;
                
                this.ctrlKey = e.ctrlKey || e.metaKey;
                this.altKey = e.altKey;
                
                this.keyCode = e.keyCode;
                
                this.charCode = (e.type == 'keyup' || e.type == 'keydown') ? 0 : e.charCode;
                
                this.target = E.getTarget(e);
                
                this.xy = E.getXY(e);
            }else {
                this.button = -1;
                this.shiftKey = false;
                this.ctrlKey = false;
                this.altKey = false;
                this.keyCode = 0;
                this.charCode =0;
                this.target = null;
                this.xy = [0, 0];
            }
            return  this;
        },

        

        stopEvent : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Roo.EventManager.stoppedMouseDownEvent.fire(this);
                }

                E.stopEvent(this.browserEvent);
            }
        },

        

        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        

        isNavKeyPress : function(){
            var  k = this.keyCode;
            k = Roo.isSafari ? (T[k] || k) : k;
            return  (k >= 33 && k <= 40) || k == this.RETURN  || k == this.TAB || k == this.ESC;
        },

        isSpecialKey : function(){
            var  k = this.keyCode;
            return  (this.type == 'keypress' && this.ctrlKey) || k == 9 || k == 13  || k == 40 || k == 27 ||
            (k == 16) || (k == 17) ||
            (k >= 18 && k <= 20) ||
            (k >= 33 && k <= 35) ||
            (k >= 36 && k <= 39) ||
            (k >= 44 && k <= 45);
        },
        

        stopPropagation : function(){
            if(this.browserEvent){
                if(this.type == 'mousedown'){
                    Roo.EventManager.stoppedMouseDownEvent.fire(this);
                }

                E.stopPropagation(this.browserEvent);
            }
        },

        

        getCharCode : function(){
            return  this.charCode || this.keyCode;
        },

        

        getKey : function(){
            var  k = this.keyCode || this.charCode;
            return  Roo.isSafari ? (T[k] || k) : k;
        },

        

        getPageX : function(){
            return  this.xy[0];
        },

        

        getPageY : function(){
            return  this.xy[1];
        },

        

        getTime : function(){
            if(this.browserEvent){
                return  E.getTime(this.browserEvent);
            }
            return  null;
        },

        

        getXY : function(){
            return  this.xy;
        },

        

        getTarget : function(V, W, X){
            return  V ? Roo.fly(this.target).findParent(V, W, X) : this.target;
        },
        

        getRelatedTarget : function(){
            if(this.browserEvent){
                return  E.getRelatedTarget(this.browserEvent);
            }
            return  null;
        },

        

        getWheelDelta : function(){
            var  e = this.browserEvent;
            var  Y = 0;
            if(e.wheelDelta){ 

                Y = e.wheelDelta/120;
            }else  if(e.detail){ 

                Y = -e.detail/3;
            }
            return  Y;
        },

        

        hasModifier : function(){
            return  !!((this.ctrlKey || this.altKey) || this.shiftKey);
        },

        

        within : function(el, Z){
            var  t = this[Z ? "getRelatedTarget" : "getTarget"]();
            return  t && Roo.fly(el).contains(t);
        },

        getPoint : function(){
            return  new  Roo.lib.Point(this.xy[0], this.xy[1]);
        }
    };

    return  new  Roo.EventObjectImpl();
}();
            
    



 

 
(function(){
    var  D = Roo.lib.Dom;
    var  E = Roo.lib.Event;
    var  A = Roo.lib.Anim;

    
    var  B = {};
    var  C = /(-[a-z])/gi;
    var  F = function(m, a){ return  a.charAt(1).toUpperCase(); };
    var  G = document.defaultView;



    Roo.Element = function(J, K){
        var  L = typeof  J == "string" ?
                document.getElementById(J) : J;
        if(!L){ 
            return  null;
        }
        var  id = L.id;
        if(K !== true && id && Roo.Element.cache[id]){ 
            return  Roo.Element.cache[id];
        }


        

        this.dom = L;

        

        this.id = id || Roo.id(L);
    };

    var  El = Roo.Element;

    El.prototype = {
        

        originalDisplay : "",

        visibilityMode : 1,
        

        defaultUnit : "px",
        

        setVisibilityMode : function(J){
            this.visibilityMode = J;
            return  this;
        },
        

        enableDisplayMode : function(K){
            this.setVisibilityMode(El.DISPLAY);
            if(typeof  K != "undefined") this.originalDisplay = K;
            return  this;
        },

        

        findParent : function(L, M, N){
            var  p = this.dom, b = document.body, O = 0, dq = Roo.DomQuery, P;
            M = M || 50;
            if(typeof  M != "number"){
                P = Roo.getDom(M);
                M = 10;
            }
            while(p && p.nodeType == 1 && O < M && p != b && p != P){
                if(dq.is(p, L)){
                    return  N ? Roo.get(p) : p;
                }

                O++;
                p = p.parentNode;
            }
            return  null;
        },


        

        findParentNode : function(Q, R, S){
            var  p = Roo.fly(this.dom.parentNode, '_internal');
            return  p ? p.findParent(Q, R, S) : null;
        },

        

        up : function(T, U){
            return  this.findParentNode(T, U, true);
        },



        

        is : function(V){
            return  Roo.DomQuery.is(this.dom, V);
        },

        

        animate : function(W, X, Y, Z, c){
            this.anim(W, {duration: X, callback: Y, easing: Z}, c);
            return  this;
        },

        

        anim : function(e, g, h, j, k, cb){
            h = h || 'run';
            g = g || {};
            var  l = Roo.lib.Anim[h](
                this.dom, e,
                (g.duration || j) || .35,
                (g.easing || k) || 'easeOut',
                function(){
                    Roo.callback(cb, this);
                    Roo.callback(g.callback, g.scope || this, [this, g]);
                },
                this
            );
            g.anim = l;
            return  l;
        },

        
        preanim : function(a, i){
            return  !a[i] ? false : (typeof  a[i] == "object" ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
        },

        

        clean : function(o){
            if(this.isCleaned && o !== true){
                return  this;
            }
            var  ns = /\S/;
            var  d = this.dom, n = d.firstChild, ni = -1;
            while(n){
                var  nx = n.nextSibling;
                if(n.nodeType == 3 && !ns.test(n.nodeValue)){
                    d.removeChild(n);
                }else {
                    n.nodeIndex = ++ni;
                }

                n = nx;
            }

            this.isCleaned = true;
            return  this;
        },

        
        calcOffsetsTo : function(el){
            el = Roo.get(el);
            var  d = el.dom;
            var  q = false;
            if(el.getStyle('position') == 'static'){
                el.position('relative');
                q = true;
            }
            var  x = 0, y =0;
            var  op = this.dom;
            while(op && op != d && op.tagName != 'HTML'){
                x+= op.offsetLeft;
                y+= op.offsetTop;
                op = op.offsetParent;
            }
            if(q){
                el.position('static');
            }
            return  [x, y];
        },

        

        scrollIntoView : function(u, v){
            var  c = Roo.getDom(u) || document.body;
            var  el = this.dom;

            var  o = this.calcOffsetsTo(c),
                l = o[0],
                t = o[1],
                b = t+el.offsetHeight,
                r = l+el.offsetWidth;

            var  ch = c.clientHeight;
            var  ct = parseInt(c.scrollTop, 10);
            var  cl = parseInt(c.scrollLeft, 10);
            var  cb = ct + ch;
            var  cr = cl + c.clientWidth;

            if(t < ct){
                c.scrollTop = t;
            }else  if(b > cb){
                c.scrollTop = b-ch;
            }

            if(v !== false){
                if(l < cl){
                    c.scrollLeft = l;
                }else  if(r > cr){
                    c.scrollLeft = r-c.clientWidth;
                }
            }
            return  this;
        },

        
        scrollChildIntoView : function(w, z){
            Roo.fly(w, '_scrollChildIntoView').scrollIntoView(this, z);
        },

        

        autoHeight : function(AA, AB, AC, AD){
            var  AE = this.getHeight();
            this.clip();
            this.setHeight(1); 
            setTimeout(function(){
                var  AG = parseInt(this.dom.scrollHeight, 10); 
                if(!AA){
                    this.setHeight(AG);
                    this.unclip();
                    if(typeof  AC == "function"){
                        AC();
                    }
                }else {
                    this.setHeight(AE); 
                    this.setHeight(AG, AA, AB, function(){
                        this.unclip();
                        if(typeof  AC == "function") AC();
                    }.createDelegate(this), AD);
                }
            }.createDelegate(this), 0);
            return  this;
        },

        

        contains : function(el){
            if(!el){return  false;}
            return  D.isAncestor(this.dom, el.dom ? el.dom : el);
        },

        

        isVisible : function(AF) {
            var  AG = !(this.getStyle("visibility") == "hidden" || this.getStyle("display") == "none");
            if(AF !== true || !AG){
                return  AG;
            }
            var  p = this.dom.parentNode;
            while(p && p.tagName.toLowerCase() != "body"){
                if(!Roo.fly(p, '_isVisible').isVisible()){
                    return  false;
                }

                p = p.parentNode;
            }
            return  true;
        },

        

        select : function(AH, AI){
            return  El.select(AH, AI, this.dom);
        },

        

        query : function(AJ, AK){
            return  Roo.DomQuery.select(AJ, this.dom);
        },

        

        child : function(AL, AM){
            var  n = Roo.DomQuery.selectNode(AL, this.dom);
            return  AM ? n : Roo.get(n);
        },

        

        down : function(AN, AO){
            var  n = Roo.DomQuery.selectNode(" > " + AN, this.dom);
            return  AO ? n : Roo.get(n);
        },

        

        initDD : function(AP, AQ, AR){
            var  dd = new  Roo.dd.DD(Roo.id(this.dom), AP, AQ);
            return  Roo.apply(dd, AR);
        },

        

        initDDProxy : function(AS, AT, AU){
            var  dd = new  Roo.dd.DDProxy(Roo.id(this.dom), AS, AT);
            return  Roo.apply(dd, AU);
        },

        

        initDDTarget : function(AV, AW, AX){
            var  dd = new  Roo.dd.DDTarget(Roo.id(this.dom), AV, AW);
            return  Roo.apply(dd, AX);
        },

        

         setVisible : function(AY, AZ){
            if(!AZ || !A){
                if(this.visibilityMode == El.DISPLAY){
                    this.setDisplayed(AY);
                }else {
                    this.fixDisplay();
                    this.dom.style.visibility = AY ? "visible" : "hidden";
                }
            }else {
                
                var  dom = this.dom;
                var  J = this.visibilityMode;
                if(AY){
                    this.setOpacity(.01);
                    this.setVisible(true);
                }

                this.anim({opacity: { to: (AY?1:0) }},
                      this.preanim(arguments, 1),
                      null, .35, 'easeIn', function(){
                         if(!AY){
                             if(J == El.DISPLAY){
                                 dom.style.display = "none";
                             }else {
                                 dom.style.visibility = "hidden";
                             }

                             Roo.get(dom).setOpacity(1);
                         }
                     });
            }
            return  this;
        },

        

        isDisplayed : function() {
            return  this.getStyle("display") != "none";
        },

        

        toggle : function(Aa){
            this.setVisible(!this.isVisible(), this.preanim(arguments, 0));
            return  this;
        },

        

        setDisplayed : function(Ab) {
            if(typeof  Ab == "boolean"){
               Ab = Ab ? this.originalDisplay : "none";
            }

            this.setStyle("display", Ab);
            return  this;
        },

        

        focus : function() {
            try{
                this.dom.focus();
            }catch(e){}
            return  this;
        },

        

        blur : function() {
            try{
                this.dom.blur();
            }catch(e){}
            return  this;
        },

        

        addClass : function(Ac){
            if(Ac  instanceof  Array){
                for(var  i = 0, len = Ac.length; i < len; i++) {
                    this.addClass(Ac[i]);
                }
            }else {
                if(Ac && !this.hasClass(Ac)){
                    this.dom.className = this.dom.className + " " + Ac;
                }
            }
            return  this;
        },

        

        radioClass : function(Ad){
            var  Ae = this.dom.parentNode.childNodes;
            for(var  i = 0; i < Ae.length; i++) {
                var  s = Ae[i];
                if(s.nodeType == 1){
                    Roo.get(s).removeClass(Ad);
                }
            }

            this.addClass(Ad);
            return  this;
        },

        

        removeClass : function(Af){
            if(!Af || !this.dom.className){
                return  this;
            }
            if(Af  instanceof  Array){
                for(var  i = 0, len = Af.length; i < len; i++) {
                    this.removeClass(Af[i]);
                }
            }else {
                if(this.hasClass(Af)){
                    var  re = this.classReCache[Af];
                    if (!re) {
                       re = new  RegExp('(?:^|\\s+)' + Af + '(?:\\s+|$)', "g");
                       this.classReCache[Af] = re;
                    }

                    this.dom.className =
                        this.dom.className.replace(re, " ");
                }
            }
            return  this;
        },

        
        classReCache: {},

        

        toggleClass : function(Ag){
            if(this.hasClass(Ag)){
                this.removeClass(Ag);
            }else {
                this.addClass(Ag);
            }
            return  this;
        },

        

        hasClass : function(Ah){
            return  Ah && (' '+this.dom.className+' ').indexOf(' '+Ah+' ') != -1;
        },

        

        replaceClass : function(Ai, Aj){
            this.removeClass(Ai);
            this.addClass(Aj);
            return  this;
        },

        

        getStyles : function(){
            var  a = arguments, Ak = a.length, r = {};
            for(var  i = 0; i < Ak; i++){
                r[a[i]] = this.getStyle(a[i]);
            }
            return  r;
        },

        

        getStyle : function(){
            return  G && G.getComputedStyle ?
                function(Al){
                    var  el = this.dom, v, cs, Am;
                    if(Al == 'float'){
                        Al = "cssFloat";
                    }
                    if(el.style && (v = el.style[Al])){
                        return  v;
                    }
                    if(cs = G.getComputedStyle(el, "")){
                        if(!(Am = B[Al])){
                            Am = B[Al] = Al.replace(C, F);
                        }
                        return  cs[Am];
                    }
                    return  null;
                } :
                function(Al){
                    var  el = this.dom, v, cs, Am;
                    if(Al == 'opacity'){
                        if(typeof  el.style.filter == 'string'){
                            var  m = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
                            if(m){
                                var  fv = parseFloat(m[1]);
                                if(!isNaN(fv)){
                                    return  fv ? fv / 100 : 0;
                                }
                            }
                        }
                        return  1;
                    }else  if(Al == 'float'){
                        Al = "styleFloat";
                    }
                    if(!(Am = B[Al])){
                        Am = B[Al] = Al.replace(C, F);
                    }
                    if(v = el.style[Am]){
                        return  v;
                    }
                    if(cs = el.currentStyle){
                        return  cs[Am];
                    }
                    return  null;
                };
        }(),

        

        setStyle : function(Al, Am){
            if(typeof  Al == "string"){
                
                if (Al == 'float') {
                    this.setStyle(Roo.isIE ? 'styleFloat'  : 'cssFloat', Am);
                    return  this;
                }
                
                var  camel;
                if(!(camel = B[Al])){
                    camel = B[Al] = Al.replace(C, F);
                }
                
                if(camel == 'opacity') {
                    this.setOpacity(Am);
                }else {
                    this.dom.style[camel] = Am;
                }
            }else {
                for(var  style  in  Al){
                    if(typeof  Al[style] != "function"){
                       this.setStyle(style, Al[style]);
                    }
                }
            }
            return  this;
        },

        

        applyStyles : function(An){
            Roo.DomHelper.applyStyles(this.dom, An);
            return  this;
        },

        

        getX : function(){
            return  D.getX(this.dom);
        },

        

        getY : function(){
            return  D.getY(this.dom);
        },

        

        getXY : function(){
            return  D.getXY(this.dom);
        },

        

        setX : function(x, Ao){
            if(!Ao || !A){
                D.setX(this.dom, x);
            }else {
                this.setXY([x, this.getY()], this.preanim(arguments, 1));
            }
            return  this;
        },

        

        setY : function(y, Ap){
            if(!Ap || !A){
                D.setY(this.dom, y);
            }else {
                this.setXY([this.getX(), y], this.preanim(arguments, 1));
            }
            return  this;
        },

        

        setLeft : function(Aq){
            this.setStyle("left", this.addUnits(Aq));
            return  this;
        },

        

        setTop : function(Ar){
            this.setStyle("top", this.addUnits(Ar));
            return  this;
        },

        

        setRight : function(As){
            this.setStyle("right", this.addUnits(As));
            return  this;
        },

        

        setBottom : function(At){
            this.setStyle("bottom", this.addUnits(At));
            return  this;
        },

        

        setXY : function(Au, Av){
            if(!Av || !A){
                D.setXY(this.dom, Au);
            }else {
                this.anim({points: {to: Au}}, this.preanim(arguments, 1), 'motion');
            }
            return  this;
        },

        

        setLocation : function(x, y, Aw){
            this.setXY([x, y], this.preanim(arguments, 2));
            return  this;
        },

        

        moveTo : function(x, y, Ax){
            this.setXY([x, y], this.preanim(arguments, 2));
            return  this;
        },

        

        getRegion : function(){
            return  D.getRegion(this.dom);
        },

        

        getHeight : function(Ay){
            var  h = this.dom.offsetHeight || 0;
            return  Ay !== true ? h : h-this.getBorderWidth("tb")-this.getPadding("tb");
        },

        

        getWidth : function(Az){
            var  w = this.dom.offsetWidth || 0;
            return  Az !== true ? w : w-this.getBorderWidth("lr")-this.getPadding("lr");
        },

        

        getComputedHeight : function(){
            var  h = Math.max(this.dom.offsetHeight, this.dom.clientHeight);
            if(!h){
                h = parseInt(this.getStyle('height'), 10) || 0;
                if(!this.isBorderBox()){
                    h += this.getFrameWidth('tb');
                }
            }
            return  h;
        },

        

        getComputedWidth : function(){
            var  w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
            if(!w){
                w = parseInt(this.getStyle('width'), 10) || 0;
                if(!this.isBorderBox()){
                    w += this.getFrameWidth('lr');
                }
            }
            return  w;
        },

        

        getSize : function(A0){
            return  {width: this.getWidth(A0), height: this.getHeight(A0)};
        },

        

        getViewSize : function(){
            var  d = this.dom, A1 = document, aw = 0, ah = 0;
            if(d == A1 || d == A1.body){
                return  {width : D.getViewWidth(), height: D.getViewHeight()};
            }else {
                return  {
                    width : d.clientWidth,
                    height: d.clientHeight
                };
            }
        },

        

        getValue : function(A2){
            return  A2 ? parseInt(this.dom.value, 10) : this.dom.value;
        },

        
        adjustWidth : function(A3){
            if(typeof  A3 == "number"){
                if(this.autoBoxAdjust && !this.isBorderBox()){
                   A3 -= (this.getBorderWidth("lr") + this.getPadding("lr"));
                }
                if(A3 < 0){
                    A3 = 0;
                }
            }
            return  A3;
        },

        
        adjustHeight : function(A4){
            if(typeof  A4 == "number"){
               if(this.autoBoxAdjust && !this.isBorderBox()){
                   A4 -= (this.getBorderWidth("tb") + this.getPadding("tb"));
               }
               if(A4 < 0){
                   A4 = 0;
               }
            }
            return  A4;
        },

        

        setWidth : function(A5, A6){
            A5 = this.adjustWidth(A5);
            if(!A6 || !A){
                this.dom.style.width = this.addUnits(A5);
            }else {
                this.anim({width: {to: A5}}, this.preanim(arguments, 1));
            }
            return  this;
        },

        

         setHeight : function(A7, A8){
            A7 = this.adjustHeight(A7);
            if(!A8 || !A){
                this.dom.style.height = this.addUnits(A7);
            }else {
                this.anim({height: {to: A7}}, this.preanim(arguments, 1));
            }
            return  this;
        },

        

         setSize : function(A9, BA, BB){
            if(typeof  A9 == "object"){ 
                BA = A9.height; A9 = A9.width;
            }

            A9 = this.adjustWidth(A9); BA = this.adjustHeight(BA);
            if(!BB || !A){
                this.dom.style.width = this.addUnits(A9);
                this.dom.style.height = this.addUnits(BA);
            }else {
                this.anim({width: {to: A9}, height: {to: BA}}, this.preanim(arguments, 2));
            }
            return  this;
        },

        

        setBounds : function(x, y, BC, BD, BE){
            if(!BE || !A){
                this.setSize(BC, BD);
                this.setLocation(x, y);
            }else {
                BC = this.adjustWidth(BC); BD = this.adjustHeight(BD);
                this.anim({points: {to: [x, y]}, width: {to: BC}, height: {to: BD}},
                              this.preanim(arguments, 4), 'motion');
            }
            return  this;
        },

        

        setRegion : function(BF, BG){
            this.setBounds(BF.left, BF.top, BF.right-BF.left, BF.bottom-BF.top, this.preanim(arguments, 1));
            return  this;
        },

        

        addListener : function(BH, fn, BI, BJ){
            Roo.EventManager.on(this.dom,  BH, fn, BI || this, BJ);
        },

        

        removeListener : function(BK, fn){
            Roo.EventManager.removeListener(this.dom,  BK, fn);
            return  this;
        },

        

        removeAllListeners : function(){
            E.purgeElement(this.dom);
            return  this;
        },

        relayEvent : function(BL, BM){
            this.on(BL, function(e){
                BM.fireEvent(BL, e);
            });
        },

        

         setOpacity : function(BN, BO){
            if(!BO || !A){
                var  s = this.dom.style;
                if(Roo.isIE){
                    s.zoom = 1;
                    s.filter = (s.filter || '').replace(/alpha\([^\)]*\)/gi,"") +
                               (BN == 1 ? "" : "alpha(opacity=" + BN * 100 + ")");
                }else {
                    s.opacity = BN;
                }
            }else {
                this.anim({opacity: {to: BN}}, this.preanim(arguments, 1), null, .35, 'easeIn');
            }
            return  this;
        },

        

        getLeft : function(BP){
            if(!BP){
                return  this.getX();
            }else {
                return  parseInt(this.getStyle("left"), 10) || 0;
            }
        },

        

        getRight : function(BQ){
            if(!BQ){
                return  this.getX() + this.getWidth();
            }else {
                return  (this.getLeft(true) + this.getWidth()) || 0;
            }
        },

        

        getTop : function(BR) {
            if(!BR){
                return  this.getY();
            }else {
                return  parseInt(this.getStyle("top"), 10) || 0;
            }
        },

        

        getBottom : function(BS){
            if(!BS){
                return  this.getY() + this.getHeight();
            }else {
                return  (this.getTop(true) + this.getHeight()) || 0;
            }
        },

        

        position : function(BT, BU, x, y){
            if(!BT){
               if(this.getStyle('position') == 'static'){
                   this.setStyle('position', 'relative');
               }
            }else {
                this.setStyle("position", BT);
            }
            if(BU){
                this.setStyle("z-index", BU);
            }
            if(x !== undefined && y !== undefined){
                this.setXY([x, y]);
            }else  if(x !== undefined){
                this.setX(x);
            }else  if(y !== undefined){
                this.setY(y);
            }
        },

        

        clearPositioning : function(BV){
            BV = BV ||'';
            this.setStyle({
                "left": BV,
                "right": BV,
                "top": BV,
                "bottom": BV,
                "z-index": "",
                "position" : "static"
            });
            return  this;
        },

        

        getPositioning : function(){
            var  l = this.getStyle("left");
            var  t = this.getStyle("top");
            return  {
                "position" : this.getStyle("position"),
                "left" : l,
                "right" : l ? "" : this.getStyle("right"),
                "top" : t,
                "bottom" : t ? "" : this.getStyle("bottom"),
                "z-index" : this.getStyle("z-index")
            };
        },

        

        getBorderWidth : function(BW){
            return  this.addStyles(BW, El.borders);
        },

        

        getPadding : function(BX){
            return  this.addStyles(BX, El.paddings);
        },

        

        setPositioning : function(pc){
            this.applyStyles(pc);
            if(pc.right == "auto"){
                this.dom.style.right = "";
            }
            if(pc.bottom == "auto"){
                this.dom.style.bottom = "";
            }
            return  this;
        },

        
        fixDisplay : function(){
            if(this.getStyle("display") == "none"){
                this.setStyle("visibility", "hidden");
                this.setStyle("display", this.originalDisplay); 
                if(this.getStyle("display") == "none"){ 
                    this.setStyle("display", "block");
                }
            }
        },

        

         setLeftTop : function(BY, BZ){
            this.dom.style.left = this.addUnits(BY);
            this.dom.style.top = this.addUnits(BZ);
            return  this;
        },

        

         move : function(Ba, Bb, Bc){
            var  xy = this.getXY();
            Ba = Ba.toLowerCase();
            switch(Ba){
                case  "l":
                case  "left":
                    this.moveTo(xy[0]-Bb, xy[1], this.preanim(arguments, 2));
                    break;
               case  "r":
               case  "right":
                    this.moveTo(xy[0]+Bb, xy[1], this.preanim(arguments, 2));
                    break;
               case  "t":
               case  "top":
               case  "up":
                    this.moveTo(xy[0], xy[1]-Bb, this.preanim(arguments, 2));
                    break;
               case  "b":
               case  "bottom":
               case  "down":
                    this.moveTo(xy[0], xy[1]+Bb, this.preanim(arguments, 2));
                    break;
            }
            return  this;
        },

        

        clip : function(){
            if(!this.isClipped){
               this.isClipped = true;
               this.originalClip = {
                   "o": this.getStyle("overflow"),
                   "x": this.getStyle("overflow-x"),
                   "y": this.getStyle("overflow-y")
               };
               this.setStyle("overflow", "hidden");
               this.setStyle("overflow-x", "hidden");
               this.setStyle("overflow-y", "hidden");
            }
            return  this;
        },

        

        unclip : function(){
            if(this.isClipped){
                this.isClipped = false;
                var  o = this.originalClip;
                if(o.o){this.setStyle("overflow", o.o);}
                if(o.x){this.setStyle("overflow-x", o.x);}
                if(o.y){this.setStyle("overflow-y", o.y);}
            }
            return  this;
        },


        

        getAnchorXY : function(Bd, Be, s){
            
            

            var  w, h, vp = false;
            if(!s){
                var  d = this.dom;
                if(d == document.body || d == document){
                    vp = true;
                    w = D.getViewWidth(); h = D.getViewHeight();
                }else {
                    w = this.getWidth(); h = this.getHeight();
                }
            }else {
                w = s.width;  h = s.height;
            }
            var  x = 0, y = 0, r = Math.round;
            switch((Bd || "tl").toLowerCase()){
                case  "c":
                    x = r(w*.5);
                    y = r(h*.5);
                break;
                case  "t":
                    x = r(w*.5);
                    y = 0;
                break;
                case  "l":
                    x = 0;
                    y = r(h*.5);
                break;
                case  "r":
                    x = w;
                    y = r(h*.5);
                break;
                case  "b":
                    x = r(w*.5);
                    y = h;
                break;
                case  "tl":
                    x = 0;
                    y = 0;
                break;
                case  "bl":
                    x = 0;
                    y = h;
                break;
                case  "br":
                    x = w;
                    y = h;
                break;
                case  "tr":
                    x = w;
                    y = 0;
                break;
            }
            if(Be === true){
                return  [x, y];
            }
            if(vp){
                var  sc = this.getScroll();
                return  [x + sc.left, y + sc.top];
            }
            
            var  o = this.getXY();
            return  [x+o[0], y+o[1]];
        },

        

        getAlignToXY : function(el, p, o){
            el = Roo.get(el);
            var  d = this.dom;
            if(!el.dom){
                throw  "Element.alignTo with an element that doesn't exist";
            }
            var  c = false; 
            var  p1 = "", p2 = "";
            o = o || [0,0];

            if(!p){
                p = "tl-bl";
            }else  if(p == "?"){
                p = "tl-bl?";
            }else  if(p.indexOf("-") == -1){
                p = "tl-" + p;
            }

            p = p.toLowerCase();
            var  m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
            if(!m){
               throw  "Element.alignTo with an invalid alignment " + p;
            }

            p1 = m[1]; p2 = m[2]; c = !!m[3];

            
            
            var  a1 = this.getAnchorXY(p1, true);
            var  a2 = el.getAnchorXY(p2, false);
            var  x = a2[0] - a1[0] + o[0];
            var  y = a2[1] - a1[1] + o[1];
            if(c){
                
                var  w = this.getWidth(), h = this.getHeight(), r = el.getRegion();
                
                var  dw = D.getViewWidth()-5, dh = D.getViewHeight()-5;

                
                
                
                var  p1y = p1.charAt(0), p1x = p1.charAt(p1.length-1);
               var  p2y = p2.charAt(0), p2x = p2.charAt(p2.length-1);
               var  swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
               var  swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));

               var  A1 = document;
               var  scrollX = (A1.documentElement.scrollLeft || A1.body.scrollLeft || 0)+5;
               var  scrollY = (A1.documentElement.scrollTop || A1.body.scrollTop || 0)+5;

               if((x+w) > dw + scrollX){
                    x = swapX ? r.left-w : dw+scrollX-w;
                }
               if(x < scrollX){
                   x = swapX ? r.right : scrollX;
               }
               if((y+h) > dh + scrollY){
                    y = swapY ? r.top-h : dh+scrollY-h;
                }
               if (y < scrollY){
                   y = swapY ? r.bottom : scrollY;
               }
            }
            return  [x,y];
        },

        
        getConstrainToXY : function(){
            var  os = {top:0, left:0, bottom:0, right: 0};

            return  function(el, Bf, Bg, Bh){
                el = Roo.get(el);
                Bg = Bg ? Roo.applyIf(Bg, os) : os;

                var  vw, vh, vx = 0, vy = 0;
                if(el.dom == document.body || el.dom == document){
                    vw = Roo.lib.Dom.getViewWidth();
                    vh = Roo.lib.Dom.getViewHeight();
                }else {
                    vw = el.dom.clientWidth;
                    vh = el.dom.clientHeight;
                    if(!Bf){
                        var  vxy = el.getXY();
                        vx = vxy[0];
                        vy = vxy[1];
                    }
                }

                var  s = el.getScroll();

                vx += Bg.left + s.left;
                vy += Bg.top + s.top;

                vw -= Bg.right;
                vh -= Bg.bottom;

                var  vr = vx+vw;
                var  vb = vy+vh;

                var  xy = Bh || (!Bf ? this.getXY() : [this.getLeft(true), this.getTop(true)]);
                var  x = xy[0], y = xy[1];
                var  w = this.dom.offsetWidth, h = this.dom.offsetHeight;

                
                var  Bi = false;

                
                if((x + w) > vr){
                    x = vr - w;
                    Bi = true;
                }
                if((y + h) > vb){
                    y = vb - h;
                    Bi = true;
                }
                
                if(x < vx){
                    x = vx;
                    Bi = true;
                }
                if(y < vy){
                    y = vy;
                    Bi = true;
                }
                return  Bi ? [x, y] : false;
            };
        }(),

        
        adjustForConstraints : function(xy, Bf, Bg){
            return  this.getConstrainToXY(Bf || document, false, Bg, xy) ||  xy;
        },

        

        alignTo : function(Bh, Bi, Bj, Bk){
            var  xy = this.getAlignToXY(Bh, Bi, Bj);
            this.setXY(xy, this.preanim(arguments, 3));
            return  this;
        },

        

        anchorTo : function(el, Bl, Bm, Bn, Bo, Bp){
            var  Bq = function(){
                this.alignTo(el, Bl, Bm, Bn);
                Roo.callback(Bp, this);
            };
            Roo.EventManager.onWindowResize(Bq, this);
            var  tm = typeof  Bo;
            if(tm != 'undefined'){
                Roo.EventManager.on(window, 'scroll', Bq, this,
                    {buffer: tm == 'number' ? Bo : 50});
            }

            Bq.call(this); 
            return  this;
        },
        

        clearOpacity : function(){
            if (window.ActiveXObject) {
                if(typeof  this.dom.style.filter == 'string' && (/alpha/i).test(this.dom.style.filter)){
                    this.dom.style.filter = "";
                }
            } else  {
                this.dom.style.opacity = "";
                this.dom.style["-moz-opacity"] = "";
                this.dom.style["-khtml-opacity"] = "";
            }
            return  this;
        },

        

        hide : function(Br){
            this.setVisible(false, this.preanim(arguments, 0));
            return  this;
        },

        

        show : function(Bs){
            this.setVisible(true, this.preanim(arguments, 0));
            return  this;
        },

        

        addUnits : function(Bt){
            return  Roo.Element.addUnits(Bt, this.defaultUnit);
        },

        

        beginMeasure : function(){
            var  el = this.dom;
            if(el.offsetWidth || el.offsetHeight){
                return  this; 
            }
            var  Bu = [];
            var  p = this.dom, b = document.body; 
            while((!el.offsetWidth && !el.offsetHeight) && p && p.tagName && p != b){
                var  pe = Roo.get(p);
                if(pe.getStyle('display') == 'none'){
                    Bu.push({el: p, visibility: pe.getStyle("visibility")});
                    p.style.visibility = "hidden";
                    p.style.display = "block";
                }

                p = p.parentNode;
            }

            this._measureChanged = Bu;
            return  this;

        },

        

        endMeasure : function(){
            var  Bv = this._measureChanged;
            if(Bv){
                for(var  i = 0, Ak = Bv.length; i < Ak; i++) {
                    var  r = Bv[i];
                    r.el.style.visibility = r.visibility;
                    r.el.style.display = "none";
                }

                this._measureChanged = null;
            }
            return  this;
        },

        

        update : function(Bw, Bx, By){
            if(typeof  Bw == "undefined"){
                Bw = "";
            }
            if(Bx !== true){
                this.dom.innerHTML = Bw;
                if(typeof  By == "function"){
                    By();
                }
                return  this;
            }
            var  id = Roo.id();
            var  Bz = this.dom;

            Bw += '<span id="' + id + '"></span>';

            E.onAvailable(id, function(){
                var  hd = document.getElementsByTagName("head")[0];
                var  re = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
                var  B0 = /\ssrc=([\'\"])(.*?)\1/i;
                var  B1 = /\stype=([\'\"])(.*?)\1/i;

                var  B2;
                while(B2 = re.exec(Bw)){
                    var  attrs = B2[1];
                    var  srcMatch = attrs ? attrs.match(B0) : false;
                    if(srcMatch && srcMatch[2]){
                       var  s = document.createElement("script");
                       s.src = srcMatch[2];
                       var  typeMatch = attrs.match(B1);
                       if(typeMatch && typeMatch[2]){
                           s.type = typeMatch[2];
                       }

                       hd.appendChild(s);
                    }else  if(B2[2] && B2[2].length > 0){
                        if(window.execScript) {
                           window.execScript(B2[2]);
                        } else  {
                            

                           window.eval(B2[2]);
                        }
                    }
                }
                var  el = document.getElementById(id);
                if(el){el.parentNode.removeChild(el);}
                if(typeof  By == "function"){
                    By();
                }
            });
            Bz.innerHTML = Bw.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "");
            return  this;
        },

        

        load : function(){
            var  um = this.getUpdateManager();
            um.update.apply(um, arguments);
            return  this;
        },

        

        getUpdateManager : function(){
            if(!this.updateManager){
                this.updateManager = new  Roo.UpdateManager(this);
            }
            return  this.updateManager;
        },

        

        unselectable : function(){
            this.dom.unselectable = "on";
            this.swallowEvent("selectstart", true);
            this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
            this.addClass("x-unselectable");
            return  this;
        },

        

        getCenterXY : function(){
            return  this.getAlignToXY(document, 'c-c');
        },

        

        center : function(B0){
            this.alignTo(B0 || document, 'c-c');
            return  this;
        },

        

        isBorderBox : function(){
            return  I[this.dom.tagName.toLowerCase()] || Roo.isBorderBox;
        },

        

        getBox : function(B1, B2){
            var  xy;
            if(!B2){
                xy = this.getXY();
            }else {
                var  BY = parseInt(this.getStyle("left"), 10) || 0;
                var  BZ = parseInt(this.getStyle("top"), 10) || 0;
                xy = [BY, BZ];
            }
            var  el = this.dom, w = el.offsetWidth, h = el.offsetHeight, bx;
            if(!B1){
                bx = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: w, height: h};
            }else {
                var  l = this.getBorderWidth("l")+this.getPadding("l");
                var  r = this.getBorderWidth("r")+this.getPadding("r");
                var  t = this.getBorderWidth("t")+this.getPadding("t");
                var  b = this.getBorderWidth("b")+this.getPadding("b");
                bx = {x: xy[0]+l, y: xy[1]+t, 0: xy[0]+l, 1: xy[1]+t, width: w-(l+r), height: h-(t+b)};
            }

            bx.right = bx.x + bx.width;
            bx.bottom = bx.y + bx.height;
            return  bx;
        },

        

        getFrameWidth : function(B3, B4){
            return  B4 && Roo.isBorderBox ? 0 : (this.getPadding(B3) + this.getBorderWidth(B3));
        },

        

        setBox : function(B5, B6, B7){
            var  w = B5.width, h = B5.height;
            if((B6 && !this.autoBoxAdjust) && !this.isBorderBox()){
               w -= (this.getBorderWidth("lr") + this.getPadding("lr"));
               h -= (this.getBorderWidth("tb") + this.getPadding("tb"));
            }

            this.setBounds(B5.x, B5.y, w, h, this.preanim(arguments, 2));
            return  this;
        },

        

         repaint : function(){
            var  B8 = this.dom;
            this.addClass("x-repaint");
            setTimeout(function(){
                Roo.get(B8).removeClass("x-repaint");
            }, 1);
            return  this;
        },

        

        getMargins : function(B9){
            if(!B9){
                return  {
                    top: parseInt(this.getStyle("margin-top"), 10) || 0,
                    left: parseInt(this.getStyle("margin-left"), 10) || 0,
                    bottom: parseInt(this.getStyle("margin-bottom"), 10) || 0,
                    right: parseInt(this.getStyle("margin-right"), 10) || 0
                };
            }else {
                return  this.addStyles(B9, El.margins);
             }
        },

        
        addStyles : function(CA, CB){
            var  CC = 0, v, w;
            for(var  i = 0, Ak = CA.length; i < Ak; i++){
                v = this.getStyle(CB[CA.charAt(i)]);
                if(v){
                     w = parseInt(v, 10);
                     if(w){ CC += w; }
                }
            }
            return  CC;
        },

        

        createProxy : function(CD, CE, CF){
            if(CE){
                CE = Roo.getDom(CE);
            }else {
                CE = document.body;
            }

            CD = typeof  CD == "object" ?
                CD : {tag : "div", cls: CD};
            var  CG = Roo.DomHelper.append(CE, CD, true);
            if(CF){
               CG.setBox(this.getBox());
            }
            return  CG;
        },

        

        mask : function(CH, CI){
            if(this.getStyle("position") == "static"){
                this.setStyle("position", "relative");
            }
            if(!this._mask){
                this._mask = Roo.DomHelper.append(this.dom, {cls:"roo-el-mask"}, true);
            }

            this.addClass("x-masked");
            this._mask.setDisplayed(true);
            if(typeof  CH == 'string'){
                if(!this._maskMsg){
                    this._maskMsg = Roo.DomHelper.append(this.dom, {cls:"roo-el-mask-msg", cn:{tag:'div'}}, true);
                }
                var  mm = this._maskMsg;
                mm.dom.className = CI ? "roo-el-mask-msg " + CI : "roo-el-mask-msg";
                mm.dom.firstChild.innerHTML = CH;
                mm.setDisplayed(true);
                mm.center(this);
            }
            if(Roo.isIE && !(Roo.isIE7 && Roo.isStrict) && this.getStyle('height') == 'auto'){ 
                this._mask.setHeight(this.getHeight());
            }
            return  this._mask;
        },

        

        unmask : function(CJ){
            if(this._mask){
                if(CJ === true){
                    this._mask.remove();
                    delete  this._mask;
                    if(this._maskMsg){
                        this._maskMsg.remove();
                        delete  this._maskMsg;
                    }
                }else {
                    this._mask.setDisplayed(false);
                    if(this._maskMsg){
                        this._maskMsg.setDisplayed(false);
                    }
                }
            }

            this.removeClass("x-masked");
        },

        

        isMasked : function(){
            return  this._mask && this._mask.isVisible();
        },

        

        createShim : function(){
            var  el = document.createElement('iframe');
            el.frameBorder = 'no';
            el.className = 'roo-shim';
            if(Roo.isIE && Roo.isSecure){
                el.src = Roo.SSL_SECURE_URL;
            }
            var  CK = Roo.get(this.dom.parentNode.insertBefore(el, this.dom));
            CK.autoBoxAdjust = false;
            return  CK;
        },

        

        remove : function(){
            if(this.dom.parentNode){
                this.dom.parentNode.removeChild(this.dom);
            }
            delete  El.cache[this.dom.id];
        },

        

        addClassOnOver : function(CL, CM){
            this.on("mouseover", function(){
                Roo.fly(this, '_internal').addClass(CL);
            }, this.dom);
            var  CN = function(e){
                if(CM !== true || !e.within(this, true)){
                    Roo.fly(this, '_internal').removeClass(CL);
                }
            };
            this.on("mouseout", CN, this.dom);
            return  this;
        },

        

        addClassOnFocus : function(CO){
            this.on("focus", function(){
                Roo.fly(this, '_internal').addClass(CO);
            }, this.dom);
            this.on("blur", function(){
                Roo.fly(this, '_internal').removeClass(CO);
            }, this.dom);
            return  this;
        },
        

        addClassOnClick : function(CP){
            var  CQ = this.dom;
            this.on("mousedown", function(){
                Roo.fly(CQ, '_internal').addClass(CP);
                var  d = Roo.get(document);
                var  fn = function(){
                    Roo.fly(CQ, '_internal').removeClass(CP);
                    d.removeListener("mouseup", fn);
                };
                d.on("mouseup", fn);
            });
            return  this;
        },

        

        swallowEvent : function(CR, CS){
            var  fn = function(e){
                e.stopPropagation();
                if(CS){
                    e.preventDefault();
                }
            };
            if(CR  instanceof  Array){
                for(var  i = 0, Ak = CR.length; i < Ak; i++){
                     this.on(CR[i], fn);
                }
                return  this;
            }

            this.on(CR, fn);
            return  this;
        },

        

      fitToParentDelegate : Roo.emptyFn, 

        

        fitToParent : function(CT, CU) {
          Roo.EventManager.removeResizeListener(this.fitToParentDelegate); 
          this.fitToParentDelegate = Roo.emptyFn; 
          if (CT === true && !this.dom.parentNode) { 
            return;
          }
          var  p = Roo.get(CU || this.dom.parentNode);
          this.setSize(p.getComputedWidth() - p.getFrameWidth('lr'), p.getComputedHeight() - p.getFrameWidth('tb'));
          if (CT === true) {
            this.fitToParentDelegate = this.fitToParent.createDelegate(this, [true, CU]);
            Roo.EventManager.onWindowResize(this.fitToParentDelegate);
          }
          return  this;
        },

        

        getNextSibling : function(){
            var  n = this.dom.nextSibling;
            while(n && n.nodeType != 1){
                n = n.nextSibling;
            }
            return  n;
        },

        

        getPrevSibling : function(){
            var  n = this.dom.previousSibling;
            while(n && n.nodeType != 1){
                n = n.previousSibling;
            }
            return  n;
        },


        

        appendChild: function(el){
            el = Roo.get(el);
            el.appendTo(this);
            return  this;
        },

        

        createChild: function(CV, CW, CX){
            CV = CV || {tag:'div'};
            if(CW){
                return  Roo.DomHelper.insertBefore(CW, CV, CX !== true);
            }
            return  Roo.DomHelper[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, CV,  CX !== true);
        },

        

        appendTo: function(el){
            el = Roo.getDom(el);
            el.appendChild(this.dom);
            return  this;
        },

        

        insertBefore: function(el){
            el = Roo.getDom(el);
            el.parentNode.insertBefore(this.dom, el);
            return  this;
        },

        

        insertAfter: function(el){
            el = Roo.getDom(el);
            el.parentNode.insertBefore(this.dom, el.nextSibling);
            return  this;
        },

        

        insertFirst: function(el, CY){
            el = el || {};
            if(typeof  el == 'object' && !el.nodeType){ 
                return  this.createChild(el, this.dom.firstChild, CY);
            }else {
                el = Roo.getDom(el);
                this.dom.insertBefore(el, this.dom.firstChild);
                return  !CY ? Roo.get(el) : el;
            }
        },

        

        insertSibling: function(el, CZ, Ca){
            CZ = CZ ? CZ.toLowerCase() : 'before';
            el = el || {};
            var  rt, Cb = CZ == 'before' ? this.dom : this.dom.nextSibling;

            if(typeof  el == 'object' && !el.nodeType){ 
                if(CZ == 'after' && !this.dom.nextSibling){
                    rt = Roo.DomHelper.append(this.dom.parentNode, el, !Ca);
                }else {
                    rt = Roo.DomHelper[CZ == 'after' ? 'insertAfter' : 'insertBefore'](this.dom, el, !Ca);
                }

            }else {
                rt = this.dom.parentNode.insertBefore(Roo.getDom(el),
                            CZ == 'before' ? this.dom : this.dom.nextSibling);
                if(!Ca){
                    rt = Roo.get(rt);
                }
            }
            return  rt;
        },

        

        wrap: function(Cc, Cd){
            if(!Cc){
                Cc = {tag: "div"};
            }
            var  Ce = Roo.DomHelper.insertBefore(this.dom, Cc, !Cd);
            Ce.dom ? Ce.dom.appendChild(this.dom) : Ce.appendChild(this.dom);
            return  Ce;
        },

        

        replace: function(el){
            el = Roo.get(el);
            this.insertBefore(el);
            el.remove();
            return  this;
        },

        

        insertHtml : function(Cf, Cg, Ch){
            var  el = Roo.DomHelper.insertHtml(Cf, this.dom, Cg);
            return  Ch ? Roo.get(el) : el;
        },

        

        set : function(o, Ci){
            var  el = this.dom;
            Ci = typeof  Ci == 'undefined' ? (el.setAttribute ? true : false) : Ci;
            for(var  attr  in  o){
                if(attr == "style" || typeof  o[attr] == "function") continue;
                if(attr=="cls"){
                    el.className = o["cls"];
                }else {
                    if(Ci) el.setAttribute(attr, o[attr]);
                    else  el[attr] = o[attr];
                }
            }
            if(o.style){
                Roo.DomHelper.applyStyles(el, o.style);
            }
            return  this;
        },

        

        addKeyListener : function(Cj, fn, Ck){
            var  Cl;
            if(typeof  Cj != "object" || Cj  instanceof  Array){
                Cl = {
                    key: Cj,
                    fn: fn,
                    scope: Ck
                };
            }else {
                Cl = {
                    key : Cj.key,
                    shift : Cj.shift,
                    ctrl : Cj.ctrl,
                    alt : Cj.alt,
                    fn: fn,
                    scope: Ck
                };
            }
            return  new  Roo.KeyMap(this, Cl);
        },

        

        addKeyMap : function(Cm){
            return  new  Roo.KeyMap(this, Cm);
        },

        

         isScrollable : function(){
            var  Cn = this.dom;
            return  Cn.scrollHeight > Cn.clientHeight || Cn.scrollWidth > Cn.clientWidth;
        },

        


        scrollTo : function(Co, Cp, Cq){
            var  Cr = Co.toLowerCase() == "left" ? "scrollLeft" : "scrollTop";
            if(!Cq || !A){
                this.dom[Cr] = Cp;
            }else {
                var  to = Cr == "scrollLeft" ? [Cp, this.dom.scrollTop] : [this.dom.scrollLeft, Cp];
                this.anim({scroll: {"to": to}}, this.preanim(arguments, 2), 'scroll');
            }
            return  this;
        },

        

         scroll : function(Cs, Ct, Cu){
             if(!this.isScrollable()){
                 return;
             }
             var  el = this.dom;
             var  l = el.scrollLeft, t = el.scrollTop;
             var  w = el.scrollWidth, h = el.scrollHeight;
             var  cw = el.clientWidth, ch = el.clientHeight;
             Cs = Cs.toLowerCase();
             var  Cv = false;
             var  a = this.preanim(arguments, 2);
             switch(Cs){
                 case  "l":
                 case  "left":
                     if(w - l > cw){
                         var  v = Math.min(l + Ct, w-cw);
                         this.scrollTo("left", v, a);
                         Cv = true;
                     }
                     break;
                case  "r":
                case  "right":
                     if(l > 0){
                         var  v = Math.max(l - Ct, 0);
                         this.scrollTo("left", v, a);
                         Cv = true;
                     }
                     break;
                case  "t":
                case  "top":
                case  "up":
                     if(t > 0){
                         var  v = Math.max(t - Ct, 0);
                         this.scrollTo("top", v, a);
                         Cv = true;
                     }
                     break;
                case  "b":
                case  "bottom":
                case  "down":
                     if(h - t > ch){
                         var  v = Math.min(t + Ct, h-ch);
                         this.scrollTo("top", v, a);
                         Cv = true;
                     }
                     break;
             }
             return  Cv;
        },

        

        translatePoints : function(x, y){
            if(typeof  x == 'object' || x  instanceof  Array){
                y = x[1]; x = x[0];
            }
            var  p = this.getStyle('position');
            var  o = this.getXY();

            var  l = parseInt(this.getStyle('left'), 10);
            var  t = parseInt(this.getStyle('top'), 10);

            if(isNaN(l)){
                l = (p == "relative") ? 0 : this.dom.offsetLeft;
            }
            if(isNaN(t)){
                t = (p == "relative") ? 0 : this.dom.offsetTop;
            }

            return  {left: (x - o[0] + l), top: (y - o[1] + t)};
        },

        

        getScroll : function(){
            var  d = this.dom, Cw = document;
            if(d == Cw || d == Cw.body){
                var  l = window.pageXOffset || Cw.documentElement.scrollLeft || Cw.body.scrollLeft || 0;
                var  t = window.pageYOffset || Cw.documentElement.scrollTop || Cw.body.scrollTop || 0;
                return  {left: l, top: t};
            }else {
                return  {left: d.scrollLeft, top: d.scrollTop};
            }
        },

        

        getColor : function(Cx, Cy, Cz){
            var  v = this.getStyle(Cx);
            if(!v || v == "transparent" || v == "inherit") {
                return  Cy;
            }
            var  C0 = typeof  Cz == "undefined" ? "#" : Cz;
            if(v.substr(0, 4) == "rgb("){
                var  rvs = v.slice(4, v.length -1).split(",");
                for(var  i = 0; i < 3; i++){
                    var  h = parseInt(rvs[i]).toString(16);
                    if(h < 16){
                        h = "0" + h;
                    }

                    C0 += h;
                }
            } else  {
                if(v.substr(0, 1) == "#"){
                    if(v.length == 4) {
                        for(var  i = 1; i < 4; i++){
                            var  c = v.charAt(i);
                            C0 +=  c + c;
                        }
                    }else  if(v.length == 7){
                        C0 += v.substr(1);
                    }
                }
            }
            return (C0.length > 5 ? C0.toLowerCase() : Cy);
        },

        

        boxWrap : function(C1){
            C1 = C1 || 'x-box';
            var  el = Roo.get(this.insertHtml('beforeBegin', String.format('<div class="{0}">'+El.boxMarkup+'</div>', C1)));
            el.child('.'+C1+'-mc').dom.appendChild(this.dom);
            return  el;
        },

        

        getAttributeNS : Roo.isIE ? function(ns, C2){
            var  d = this.dom;
            var  C3 = typeof  d[ns+":"+C2];
            if(C3 != 'undefined' && C3 != 'unknown'){
                return  d[ns+":"+C2];
            }
            return  d[C2];
        } : function(ns, C4){
            var  d = this.dom;
            return  d.getAttributeNS(ns, C4) || d.getAttribute(ns+":"+C4) || d.getAttribute(C4) || d[C4];
        }
    };

    var  ep = El.prototype;

    

    ep.on = ep.addListener;
        
    ep.mon = ep.addListener;

    

    ep.un = ep.removeListener;

    

    ep.autoBoxAdjust = true;

    
    El.unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;

    
    El.addUnits = function(v, J){
        if(v === "" || v == "auto"){
            return  v;
        }
        if(v === undefined){
            return  '';
        }
        if(typeof  v == "number" || !El.unitPattern.test(v)){
            return  v + (J || 'px');
        }
        return  v;
    };

    
    El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
    

    El.VISIBILITY = 1;
    

    El.DISPLAY = 2;

    El.borders = {l: "border-left-width", r: "border-right-width", t: "border-top-width", b: "border-bottom-width"};
    El.paddings = {l: "padding-left", r: "padding-right", t: "padding-top", b: "padding-bottom"};
    El.margins = {l: "margin-left", r: "margin-right", t: "margin-top", b: "margin-bottom"};



    

    El.cache = {};

    var  H;

    

    El.get = function(el){
        var  ex, J, id;
        if(!el){ return  null; }
        if(typeof  el == "string"){ 
            if(!(J = document.getElementById(el))){
                return  null;
            }
            if(ex = El.cache[el]){
                ex.dom = J;
            }else {
                ex = El.cache[el] = new  El(J);
            }
            return  ex;
        }else  if(el.tagName){ 
            if(!(id = el.id)){
                id = Roo.id(el);
            }
            if(ex = El.cache[id]){
                ex.dom = el;
            }else {
                ex = El.cache[id] = new  El(el);
            }
            return  ex;
        }else  if(el  instanceof  El){
            if(el != H){
                el.dom = document.getElementById(el.id) || el.dom; 
                                                              
                El.cache[el.id] = el; 
            }
            return  el;
        }else  if(el.isComposite){
            return  el;
        }else  if(el  instanceof  Array){
            return  El.select(el);
        }else  if(el == document){
            
            if(!H){
                var  f = function(){};
                f.prototype = El.prototype;
                H = new  f();
                H.dom = document;
            }
            return  H;
        }
        return  null;
    };

    
    El.uncache = function(el){
        for(var  i = 0, a = arguments, len = a.length; i < len; i++) {
            if(a[i]){
                delete  El.cache[a[i].id || a[i]];
            }
        }
    };

    
    
    
    El.garbageCollect = function(){
        if(!Roo.enableGarbageCollector){
            clearInterval(El.collectorThread);
            return;
        }
        for(var  eid  in  El.cache){
            var  el = El.cache[eid], d = el.dom;
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            if(!d || !d.parentNode || (!d.offsetParent && !document.getElementById(eid))){
                delete  El.cache[eid];
                if(d && Roo.enableListenerCollection){
                    E.purgeElement(d);
                }
            }
        }
    }

    El.collectorThreadId = setInterval(El.garbageCollect, 30000);


    
    El.Flyweight = function(J){
        this.dom = J;
    };
    El.Flyweight.prototype = El.prototype;

    El._flyweights = {};
    

    El.fly = function(el, J){
        J = J || '_global';
        el = Roo.getDom(el);
        if(!el){
            return  null;
        }
        if(!El._flyweights[J]){
            El._flyweights[J] = new  El.Flyweight();
        }

        El._flyweights[J].dom = el;
        return  El._flyweights[J];
    };

    

    Roo.get = El.get;
    

    Roo.fly = El.fly;

    
    var  I = Roo.isStrict ? {
        select:1
    } : {
        input:1, select:1, textarea:1
    };
    if(Roo.isIE || Roo.isGecko){
        I['button'] = 1;
    }



    Roo.EventManager.on(window, 'unload', function(){
        delete  El.cache;
        delete  El._flyweights;
    });
})();




if(Roo.DomQuery){
    Roo.Element.selectorFunction = Roo.DomQuery.select;
}


Roo.Element.select = function(J, K, L){
    var  M;
    if(typeof  J == "string"){
        M = Roo.Element.selectorFunction(J, L);
    }else  if(J.length !== undefined){
        M = J;
    }else {
        throw  "Invalid selector";
    }
    if(K === true){
        return  new  Roo.CompositeElement(M);
    }else {
        return  new  Roo.CompositeElementLite(M);
    }
};


Roo.select = Roo.Element.select;





















Roo.enableFx = true;



Roo.Fx = {
	

    slideIn : function(A, o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){

            A = A || "t";

            
            this.fixDisplay();

            
            var  r = this.getFxRestore();
            var  b = this.getBox();
            
            this.setSize(b);

            
            var  B = this.fxWrap(r.pos, o, "hidden");

            var  st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";

            
            var  C = function(){
                el.fxUnwrap(B, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
            
            var  a, pt = {to: [b.x, b.y]}, bw = {to: b.width}, bh = {to: b.height};

            switch(A.toLowerCase()){
                case  "t":
                    B.setSize(b.width, 0);
                    st.left = st.bottom = "0";
                    a = {height: bh};
                break;
                case  "l":
                    B.setSize(0, b.height);
                    st.right = st.top = "0";
                    a = {width: bw};
                break;
                case  "r":
                    B.setSize(0, b.height);
                    B.setX(b.right);
                    st.left = st.top = "0";
                    a = {width: bw, points: pt};
                break;
                case  "b":
                    B.setSize(b.width, 0);
                    B.setY(b.bottom);
                    st.left = st.top = "0";
                    a = {height: bh, points: pt};
                break;
                case  "tl":
                    B.setSize(0, 0);
                    st.right = st.bottom = "0";
                    a = {width: bw, height: bh};
                break;
                case  "bl":
                    B.setSize(0, 0);
                    B.setY(b.y+b.height);
                    st.right = st.top = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
                case  "br":
                    B.setSize(0, 0);
                    B.setXY([b.right, b.bottom]);
                    st.left = st.top = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
                case  "tr":
                    B.setSize(0, 0);
                    B.setX(b.x+b.width);
                    st.left = st.bottom = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
            }

            this.dom.style.visibility = "visible";
            B.show();

            arguments.callee.anim = B.fxanim(a,
                o,
                'motion',
                .5,
                'easeOut', C);
        });
        return  this;
    },
    
	

    slideOut : function(B, o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){

            B = B || "t";

            
            var  r = this.getFxRestore();
            
            var  b = this.getBox();
            
            this.setSize(b);

            
            var  C = this.fxWrap(r.pos, o, "visible");

            var  st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";

            C.setSize(b);

            var  D = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else {
                    el.hide();
                }


                el.fxUnwrap(C, r.pos, o);

                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            var  a, E = {to: 0};
            switch(B.toLowerCase()){
                case  "t":
                    st.left = st.bottom = "0";
                    a = {height: E};
                break;
                case  "l":
                    st.right = st.top = "0";
                    a = {width: E};
                break;
                case  "r":
                    st.left = st.top = "0";
                    a = {width: E, points: {to:[b.right, b.y]}};
                break;
                case  "b":
                    st.left = st.top = "0";
                    a = {height: E, points: {to:[b.x, b.bottom]}};
                break;
                case  "tl":
                    st.right = st.bottom = "0";
                    a = {width: E, height: E};
                break;
                case  "bl":
                    st.right = st.top = "0";
                    a = {width: E, height: E, points: {to:[b.x, b.bottom]}};
                break;
                case  "br":
                    st.left = st.top = "0";
                    a = {width: E, height: E, points: {to:[b.x+b.width, b.bottom]}};
                break;
                case  "tr":
                    st.left = st.bottom = "0";
                    a = {width: E, height: E, points: {to:[b.right, b.y]}};
                break;
            }


            arguments.callee.anim = C.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", D);
        });
        return  this;
    },

	

    puff : function(o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            this.clearOpacity();
            this.show();

            
            var  r = this.getFxRestore();
            var  st = this.dom.style;

            var  C = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else {
                    el.hide();
                }


                el.clearOpacity();

                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                el.afterFx(o);
            };

            var  D = this.getWidth();
            var  E = this.getHeight();

            arguments.callee.anim = this.fxanim({
                    width : {to: this.adjustWidth(D * 2)},
                    height : {to: this.adjustHeight(E * 2)},
                    points : {by: [-(D * .5), -(E * .5)]},
                    opacity : {to: 0},
                    fontSize: {to:200, unit: "%"}
                },
                o,
                'motion',
                .5,
                "easeOut", C);
        });
        return  this;
    },

	

    switchOff : function(o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            this.clearOpacity();
            this.clip();

            
            var  r = this.getFxRestore();
            var  st = this.dom.style;

            var  C = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else {
                    el.hide();
                }


                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            this.fxanim({opacity:{to:0.3}}, null, null, .1, null, function(){
                this.clearOpacity();
                (function(){
                    this.fxanim({
                        height:{to:1},
                        points:{by:[0, this.getHeight() * .5]}
                    }, o, 'motion', 0.3, 'easeIn', C);
                }).defer(100, this);
            });
        });
        return  this;
    },

    
	
    highlight : function(C, o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            C = C || "ffff9c";
            attr = o.attr || "backgroundColor";

            this.clearOpacity();
            this.show();

            var  D = this.getColor(attr);
            var  E = this.dom.style[attr];
            endColor = (o.endColor || D) || "ffffff";

            var  F = function(){
                el.dom.style[attr] = E;
                el.afterFx(o);
            };

            var  a = {};
            a[attr] = {from: C, to: endColor};
            arguments.callee.anim = this.fxanim(a,
                o,
                'color',
                1,
                'easeIn', F);
        });
        return  this;
    },

   

    frame : function(D, E, o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            D = D || "#C3DAF9";
            if(D.length == 6){
                D = "#" + D;
            }

            E = E || 1;
            duration = o.duration || 1;
            this.show();

            var  b = this.getBox();
            var  F = function(){
                var  G = this.createProxy({

                     style:{
                        visbility:"hidden",
                        position:"absolute",
                        "z-index":"35000", 
                        border:"0px solid " + D
                     }
                  });
                var  H = Roo.isBorderBox ? 2 : 1;
                G.animate({
                    top:{from:b.y, to:b.y - 20},
                    left:{from:b.x, to:b.x - 20},
                    borderWidth:{from:0, to:10},
                    opacity:{from:1, to:0},
                    height:{from:b.height, to:(b.height + (20*H))},
                    width:{from:b.width, to:(b.width + (20*H))}
                }, duration, function(){
                    G.remove();
                });
                if(--E > 0){
                     F.defer((duration/2)*1000, this);
                }else {
                    el.afterFx(o);
                }
            };
            F.call(this);
        });
        return  this;
    },

   

    pause : function(F){
        var  el = this.getFxEl();
        var  o = {};

        el.queueFx(o, function(){
            setTimeout(function(){
                el.afterFx(o);
            }, F * 1000);
        });
        return  this;
    },

   

    fadeIn : function(o){
        var  el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            this.setOpacity(0);
            this.fixDisplay();
            this.dom.style.visibility = 'visible';
            var  to = o.endOpacity || 1;
            arguments.callee.anim = this.fxanim({opacity:{to:to}},
                o, null, .5, "easeOut", function(){
                if(to == 1){
                    this.clearOpacity();
                }

                el.afterFx(o);
            });
        });
        return  this;
    },

   

    fadeOut : function(o){
        var  el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            arguments.callee.anim = this.fxanim({opacity:{to:o.endOpacity || 0}},
                o, null, .5, "easeOut", function(){
                if(this.visibilityMode == Roo.Element.DISPLAY || o.useDisplay){
                     this.dom.style.display = "none";
                }else {
                     this.dom.style.visibility = "hidden";
                }

                this.clearOpacity();
                el.afterFx(o);
            });
        });
        return  this;
    },

   

    scale : function(w, h, o){
        this.shift(Roo.apply({}, o, {
            width: w,
            height: h
        }));
        return  this;
    },

   

    shift : function(o){
        var  el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            var  a = {}, w = o.width, h = o.height, x = o.x, y = o.y,  op = o.opacity;
            if(w !== undefined){
                a.width = {to: this.adjustWidth(w)};
            }
            if(h !== undefined){
                a.height = {to: this.adjustHeight(h)};
            }
            if(x !== undefined || y !== undefined){
                a.points = {to: [
                    x !== undefined ? x : this.getX(),
                    y !== undefined ? y : this.getY()
                ]};
            }
            if(op !== undefined){
                a.opacity = {to: op};
            }
            if(o.xy !== undefined){
                a.points = {to: o.xy};
            }

            arguments.callee.anim = this.fxanim(a,
                o, 'motion', .35, "easeOut", function(){
                el.afterFx(o);
            });
        });
        return  this;
    },

	

    ghost : function(G, o){
        var  el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            G = G || "b";

            
            var  r = this.getFxRestore();
            var  w = this.getWidth(),
                h = this.getHeight();

            var  st = this.dom.style;

            var  H = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else {
                    el.hide();
                }


                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            var  a = {opacity: {to: 0}, points: {}}, pt = a.points;
            switch(G.toLowerCase()){
                case  "t":
                    pt.by = [0, -h];
                break;
                case  "l":
                    pt.by = [-w, 0];
                break;
                case  "r":
                    pt.by = [w, 0];
                break;
                case  "b":
                    pt.by = [0, h];
                break;
                case  "tl":
                    pt.by = [-w, -h];
                break;
                case  "bl":
                    pt.by = [-w, h];
                break;
                case  "br":
                    pt.by = [w, h];
                break;
                case  "tr":
                    pt.by = [w, -h];
                break;
            }


            arguments.callee.anim = this.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", H);
        });
        return  this;
    },

	

    syncFx : function(){
        this.fxDefaults = Roo.apply(this.fxDefaults || {}, {
            block : false,
            concurrent : true,
            stopFx : false
        });
        return  this;
    },

	

    sequenceFx : function(){
        this.fxDefaults = Roo.apply(this.fxDefaults || {}, {
            block : false,
            concurrent : false,
            stopFx : false
        });
        return  this;
    },

	

    nextFx : function(){
        var  ef = this.fxQueue[0];
        if(ef){
            ef.call(this);
        }
    },

	

    hasActiveFx : function(){
        return  this.fxQueue && this.fxQueue[0];
    },

	

    stopFx : function(){
        if(this.hasActiveFx()){
            var  cur = this.fxQueue[0];
            if(cur && cur.anim && cur.anim.isAnimated()){
                this.fxQueue = [cur]; 
                cur.anim.stop(true);
            }
        }
        return  this;
    },

	

    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return  true;
           }
           return  false;
        }
        return  true;
    },

	

    hasFxBlock : function(){
        var  q = this.fxQueue;
        return  q && q[0] && q[0].block;
    },

	

    queueFx : function(o, fn){
        if(!this.fxQueue){
            this.fxQueue = [];
        }
        if(!this.hasFxBlock()){
            Roo.applyIf(o, this.fxDefaults);
            if(!o.concurrent){
                var  run = this.beforeFx(o);
                fn.block = o.block;
                this.fxQueue.push(fn);
                if(run){
                    this.nextFx();
                }
            }else {
                fn.call(this);
            }
        }
        return  this;
    },

	

    fxWrap : function(H, o, I){
        var  J;
        if(!o.wrap || !(J = Roo.get(o.wrap))){
            var  wrapXY;
            if(o.fixPosition){
                wrapXY = this.getXY();
            }
            var  div = document.createElement("div");
            div.style.visibility = I;
            J = Roo.get(this.dom.parentNode.insertBefore(div, this.dom));
            J.setPositioning(H);
            if(J.getStyle("position") == "static"){
                J.position("relative");
            }

            this.clearPositioning('auto');
            J.clip();
            J.dom.appendChild(this.dom);
            if(wrapXY){
                J.setXY(wrapXY);
            }
        }
        return  J;
    },

	

    fxUnwrap : function(K, L, o){
        this.clearPositioning();
        this.setPositioning(L);
        if(!o.wrap){
            K.dom.parentNode.insertBefore(this.dom, K.dom);
            K.remove();
        }
    },

	

    getFxRestore : function(){
        var  st = this.dom.style;
        return  {pos: this.getPositioning(), width: st.width, height : st.height};
    },

	

    afterFx : function(o){
        if(o.afterStyle){
            this.applyStyles(o.afterStyle);
        }
        if(o.afterCls){
            this.addClass(o.afterCls);
        }
        if(o.remove === true){
            this.remove();
        }

        Roo.callback(o.callback, o.scope, [this]);
        if(!o.concurrent){
            this.fxQueue.shift();
            this.nextFx();
        }
    },

	

    getFxEl : function(){ 
        return  Roo.get(this.dom);
    },

	

    fxanim : function(M, N, O, P, Q, cb){
        O = O || 'run';
        N = N || {};
        var  R = Roo.lib.Anim[O](
            this.dom, M,
            (N.duration || P) || .35,
            (N.easing || Q) || 'easeOut',
            function(){
                Roo.callback(cb, this);
            },
            this
        );
        N.anim = R;
        return  R;
    }
};


Roo.Fx.resize = Roo.Fx.scale;



Roo.apply(Roo.Element.prototype, Roo.Fx);






Roo.CompositeElement = function(A){
    this.elements = [];
    this.addElements(A);
};
Roo.CompositeElement.prototype = {
    isComposite: true,
    addElements : function(B){
        if(!B) return  this;
        if(typeof  B == "string"){
            B = Roo.Element.selectorFunction(B);
        }
        var  C = this.elements;
        var  D = C.length-1;
        for(var  i = 0, len = B.length; i < len; i++) {
        	C[++D] = Roo.get(B[i]);
        }
        return  this;
    },

    

    fill : function(E){
        this.elements = [];
        this.add(E);
        return  this;
    },

    

    filter : function(F){
        var  G = [];
        this.each(function(el){
            if(el.is(F)){
                G[G.length] = el.dom;
            }
        });
        this.fill(G);
        return  this;
    },

    invoke : function(fn, H){
        var  I = this.elements;
        for(var  i = 0, len = I.length; i < len; i++) {
        	Roo.Element.prototype[fn].apply(I[i], H);
        }
        return  this;
    },
    

    add : function(J){
        if(typeof  J == "string"){
            this.addElements(Roo.Element.selectorFunction(J));
        }else  if(J.length !== undefined){
            this.addElements(J);
        }else {
            this.addElements([J]);
        }
        return  this;
    },
    

    each : function(fn, K){
        var  L = this.elements;
        for(var  i = 0, len = L.length; i < len; i++){
            if(fn.call(K || L[i], L[i], this, i) === false) {
                break;
            }
        }
        return  this;
    },

    

    item : function(M){
        return  this.elements[M] || null;
    },

    

    first : function(){
        return  this.item(0);
    },

    

    last : function(){
        return  this.item(this.elements.length-1);
    },

    

    getCount : function(){
        return  this.elements.length;
    },

    

    contains : function(el){
        return  this.indexOf(el) !== -1;
    },

    

    indexOf : function(el){
        return  this.elements.indexOf(Roo.get(el));
    },


    

    removeElement : function(el, N){
        if(el  instanceof  Array){
            for(var  i = 0, len = el.length; i < len; i++){
                this.removeElement(el[i]);
            }
            return  this;
        }
        var  O = typeof  el == 'number' ? el : this.indexOf(el);
        if(O !== -1){
            if(N){
                var  d = this.elements[O];
                if(d.dom){
                    d.remove();
                }else {
                    d.parentNode.removeChild(d);
                }
            }

            this.elements.splice(O, 1);
        }
        return  this;
    },

    

    replaceElement : function(el, P, Q){
        var  R = typeof  el == 'number' ? el : this.indexOf(el);
        if(R !== -1){
            if(Q){
                this.elements[R].replaceWith(P);
            }else {
                this.elements.splice(R, 1, Roo.get(P))
            }
        }
        return  this;
    },

    

    clear : function(){
        this.elements = [];
    }
};
(function(){
    Roo.CompositeElement.createCall = function(S, T){
        if(!S[T]){
            S[T] = function(){
                return  this.invoke(T, arguments);
            };
        }
    };
    for(var  fnName  in  Roo.Element.prototype){
        if(typeof  Roo.Element.prototype[fnName] == "function"){
            Roo.CompositeElement.createCall(Roo.CompositeElement.prototype, fnName);
        }
    };
})();






Roo.CompositeElementLite = function(A){
    Roo.CompositeElementLite.superclass.constructor.call(this, A);
    this.el = new  Roo.Element.Flyweight();
};
Roo.extend(Roo.CompositeElementLite, Roo.CompositeElement, {
    addElements : function(B){
        if(B){
            if(B  instanceof  Array){
                this.elements = this.elements.concat(B);
            }else {
                var  yels = this.elements;
                var  index = yels.length-1;
                for(var  i = 0, len = B.length; i < len; i++) {
                    yels[++index] = B[i];
                }
            }
        }
        return  this;
    },
    invoke : function(fn, C){
        var  D = this.elements;
        var  el = this.el;
        for(var  i = 0, len = D.length; i < len; i++) {
            el.dom = D[i];
        	Roo.Element.prototype[fn].apply(el, C);
        }
        return  this;
    },
    

    item : function(E){
        if(!this.elements[E]){
            return  null;
        }

        this.el.dom = this.elements[E];
        return  this.el;
    },

    
    addListener : function(F, G, H, I){
        var  J = this.elements;
        for(var  i = 0, len = J.length; i < len; i++) {
            Roo.EventManager.on(J[i], F, G, H || J[i], I);
        }
        return  this;
    },

    

    each : function(fn, K){
        var  L = this.elements;
        var  el = this.el;
        for(var  i = 0, len = L.length; i < len; i++){
            el.dom = L[i];
        	if(fn.call(K || el, el, this, i) === false){
                break;
            }
        }
        return  this;
    },

    indexOf : function(el){
        return  this.elements.indexOf(Roo.getDom(el));
    },

    replaceElement : function(el, M, N){
        var  O = typeof  el == 'number' ? el : this.indexOf(el);
        if(O !== -1){
            M = Roo.getDom(M);
            if(N){
                var  d = this.elements[O];
                d.parentNode.insertBefore(M, d);
                d.parentNode.removeChild(d);
            }

            this.elements.splice(O, 1, M);
        }
        return  this;
    }
});
Roo.CompositeElementLite.prototype.on = Roo.CompositeElementLite.prototype.addListener;





 



Roo.data.Connection = function(A){
    Roo.apply(this, A);
    this.addEvents({
        

        "beforerequest" : true,
        

        "requestcomplete" : true,
        

        "requestexception" : true
    });
    Roo.data.Connection.superclass.constructor.call(this);
};

Roo.extend(Roo.data.Connection, Roo.util.Observable, {
    

    

    

    

    

    timeout : 30000,
    

    autoAbort:false,

    

    disableCaching: true,

    

    request : function(o){
        if(this.fireEvent("beforerequest", this, o) !== false){
            var  p = o.params;

            if(typeof  p == "function"){
                p = p.call(o.scope||window, o);
            }
            if(typeof  p == "object"){
                p = Roo.urlEncode(o.params);
            }
            if(this.extraParams){
                var  extras = Roo.urlEncode(this.extraParams);
                p = p ? (p + '&' + extras) : extras;
            }

            var  url = o.url || this.url;
            if(typeof  url == 'function'){
                url = url.call(o.scope||window, o);
            }

            if(o.form){
                var  form = Roo.getDom(o.form);
                url = url || form.action;

                var  enctype = form.getAttribute("enctype");
                if(o.isUpload || (enctype && enctype.toLowerCase() == 'multipart/form-data')){
                    return  this.doFormUpload(o, p, url);
                }
                var  f = Roo.lib.Ajax.serializeForm(form);
                p = p ? (p + '&' + f) : f;
            }

            var  hs = o.headers;
            if(this.defaultHeaders){
                hs = Roo.apply(hs || {}, this.defaultHeaders);
                if(!o.headers){
                    o.headers = hs;
                }
            }

            var  cb = {
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {options: o},
                timeout : this.timeout
            };

            var  method = o.method||this.method||(p ? "POST" : "GET");

            if(method == 'GET' && (this.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
                url += (url.indexOf('?') != -1 ? '&' : '?') + '_dc=' + (new  Date().getTime());
            }

            if(typeof  o.autoAbort == 'boolean'){ 
                if(o.autoAbort){
                    this.abort();
                }
            }else  if(this.autoAbort !== false){
                this.abort();
            }

            if((method == 'GET' && p) || o.xmlData){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
                p = '';
            }

            this.transId = Roo.lib.Ajax.request(method, url, cb, p, o);
            return  this.transId;
        }else {
            Roo.callback(o.callback, o.scope, [o, null, null]);
            return  null;
        }
    },

    

    isLoading : function(B){
        if(B){
            return  Roo.lib.Ajax.isCallInProgress(B);
        }else {
            return  this.transId ? true : false;
        }
    },

    

    abort : function(C){
        if(C || this.isLoading()){
            Roo.lib.Ajax.abort(C || this.transId);
        }
    },

    
    handleResponse : function(D){
        this.transId = false;
        var  E = D.argument.options;
        D.argument = E ? E.argument : null;
        this.fireEvent("requestcomplete", this, D, E);
        Roo.callback(E.success, E.scope, [D, E]);
        Roo.callback(E.callback, E.scope, [E, true, D]);
    },

    
    handleFailure : function(F, e){
        this.transId = false;
        var  G = F.argument.options;
        F.argument = G ? G.argument : null;
        this.fireEvent("requestexception", this, F, G, e);
        Roo.callback(G.failure, G.scope, [F, G]);
        Roo.callback(G.callback, G.scope, [G, false, F]);
    },

    
    doFormUpload : function(o, ps, H){
        var  id = Roo.id();
        var  I = document.createElement('iframe');
        I.id = id;
        I.name = id;
        I.className = 'x-hidden';
        if(Roo.isIE){
            I.src = Roo.SSL_SECURE_URL;
        }

        document.body.appendChild(I);

        if(Roo.isIE){
           document.frames[id].name = id;
        }

        var  J = Roo.getDom(o.form);
        J.target = id;
        J.method = 'POST';
        J.enctype = J.encoding = 'multipart/form-data';
        if(H){
            J.action = H;
        }

        var  K, hd;
        if(ps){ 
            K = [];
            ps = Roo.urlDecode(ps, false);
            for(var  k  in  ps){
                if(ps.hasOwnProperty(k)){
                    hd = document.createElement('input');
                    hd.type = 'hidden';
                    hd.name = k;
                    hd.value = ps[k];
                    J.appendChild(hd);
                    K.push(hd);
                }
            }
        }

        function  cb(){
            var  r = {  
                responseText : '',
                responseXML : null
            };

            r.argument = o ? o.argument : null;

            try { 
                var  doc;
                if(Roo.isIE){
                    doc = I.contentWindow.document;
                }else  {
                    doc = (I.contentDocument || window.frames[id].document);
                }
                if(doc && doc.body){
                    r.responseText = doc.body.innerHTML;
                }
                if(doc && doc.XMLDocument){
                    r.responseXML = doc.XMLDocument;
                }else  {
                    r.responseXML = doc;
                }
            }
            catch(e) {
                
            }


            Roo.EventManager.removeListener(I, 'load', cb, this);

            this.fireEvent("requestcomplete", this, r, o);
            Roo.callback(o.success, o.scope, [r, o]);
            Roo.callback(o.callback, o.scope, [o, true, r]);

            setTimeout(function(){document.body.removeChild(I);}, 100);
        }


        Roo.EventManager.on(I, 'load', cb, this);
        J.submit();

        if(K){ 
            for(var  i = 0, len = K.length; i < len; i++){
                J.removeChild(K[i]);
            }
        }
    }
});



Roo.Ajax = new  Roo.data.Connection({
    
   

    

    

    

    

    


    


    

    

    

    

    

    


    

    autoAbort : false,

    

    serializeForm : function(L){
        return  Roo.lib.Ajax.serializeForm(L);
    }
});


 


Roo.Ajax = new  Roo.data.Connection({
    
    
    

    
   

    

    

    

    

    


    


    

    

    

    

    

    


    

    autoAbort : false,

    

    serializeForm : function(A){
        return  Roo.lib.Ajax.serializeForm(A);
    }
});



 


Roo.UpdateManager = function(el, A){
    el = Roo.get(el);
    if(!A && el.updateManager){
        return  el.updateManager;
    }

    

    this.el = el;
    

    this.defaultUrl = null;

    this.addEvents({
        

        "beforeupdate": true,
        

        "update": true,
        

        "failure": true
    });
    var  d = Roo.UpdateManager.defaults;
    

    this.sslBlankUrl = d.sslBlankUrl;
    

    this.disableCaching = d.disableCaching;
    

    this.indicatorText = d.indicatorText;
    

    this.showLoadIndicator = d.showLoadIndicator;
    

    this.timeout = d.timeout;

    

    this.loadScripts = d.loadScripts;

    

    this.transaction = null;

    

    this.autoRefreshProcId = null;
    

    this.refreshDelegate = this.refresh.createDelegate(this);
    

    this.updateDelegate = this.update.createDelegate(this);
    

    this.formUpdateDelegate = this.formUpdate.createDelegate(this);
    

    this.successDelegate = this.processSuccess.createDelegate(this);
    

    this.failureDelegate = this.processFailure.createDelegate(this);

    if(!this.renderer){
     

    this.renderer = new  Roo.UpdateManager.BasicRenderer();
    }

    
    Roo.UpdateManager.superclass.constructor.call(this);
};

Roo.extend(Roo.UpdateManager, Roo.util.Observable, {
    

    getEl : function(){
        return  this.el;
    },
    

    update : function(B, C, D, E){
        if(this.fireEvent("beforeupdate", this.el, B, C) !== false){
            var  method = this.method, cfg;
            if(typeof  B == "object"){ 
                cfg = B;
                B = cfg.url;
                C = C || cfg.params;
                D = D || cfg.callback;
                E = E || cfg.discardUrl;
                if(D && cfg.scope){
                    D = D.createDelegate(cfg.scope);
                }
                if(typeof  cfg.method != "undefined"){method = cfg.method;};
                if(typeof  cfg.nocache != "undefined"){this.disableCaching = cfg.nocache;};
                if(typeof  cfg.text != "undefined"){this.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
                if(typeof  cfg.scripts != "undefined"){this.loadScripts = cfg.scripts;};
                if(typeof  cfg.timeout != "undefined"){this.timeout = cfg.timeout;};
            }

            this.showLoading();
            if(!E){
                this.defaultUrl = B;
            }
            if(typeof  B == "function"){
                B = B.call(this);
            }


            method = method || (C ? "POST" : "GET");
            if(method == "GET"){
                B = this.prepareUrl(B);
            }

            var  o = Roo.apply(cfg ||{}, {
                url : B,
                params: C,
                success: this.successDelegate,
                failure: this.failureDelegate,
                callback: undefined,
                timeout: (this.timeout*1000),
                argument: {"url": B, "form": null, "callback": D, "params": C}
            });

            this.transaction = Roo.Ajax.request(o);
        }
    },

    

    formUpdate : function(F, G, H, I){
        if(this.fireEvent("beforeupdate", this.el, F, G) !== false){
            if(typeof  G == "function"){
                G = G.call(this);
            }

            F = Roo.getDom(F);
            this.transaction = Roo.Ajax.request({
                form: F,
                url:G,
                success: this.successDelegate,
                failure: this.failureDelegate,
                timeout: (this.timeout*1000),
                argument: {"url": G, "form": F, "callback": I, "reset": H}
            });
            this.showLoading.defer(1, this);
        }
    },

    

    refresh : function(J){
        if(this.defaultUrl == null){
            return;
        }

        this.update(this.defaultUrl, null, J, true);
    },

    

    startAutoRefresh : function(K, L, M, N, O){
        if(O){
            this.update(L || this.defaultUrl, M, N, true);
        }
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }

        this.autoRefreshProcId = setInterval(this.update.createDelegate(this, [L || this.defaultUrl, M, N, true]), K*1000);
    },

    

     stopAutoRefresh : function(){
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
            delete  this.autoRefreshProcId;
        }
    },

    isAutoRefreshing : function(){
       return  this.autoRefreshProcId ? true : false;
    },
    

    showLoading : function(){
        if(this.showLoadIndicator){
            this.el.update(this.indicatorText);
        }
    },

    

    prepareUrl : function(P){
        if(this.disableCaching){
            var  append = "_dc=" + (new  Date().getTime());
            if(P.indexOf("?") !== -1){
                P += "&" + append;
            }else {
                P += "?" + append;
            }
        }
        return  P;
    },

    

    processSuccess : function(Q){
        this.transaction = null;
        if(Q.argument.form && Q.argument.reset){
            try{ 
                Q.argument.form.reset();
            }catch(e){}
        }
        if(this.loadScripts){
            this.renderer.render(this.el, Q, this,
                this.updateComplete.createDelegate(this, [Q]));
        }else {
            this.renderer.render(this.el, Q, this);
            this.updateComplete(Q);
        }
    },

    updateComplete : function(R){
        this.fireEvent("update", this.el, R);
        if(typeof  R.argument.callback == "function"){
            R.argument.callback(this.el, true, R);
        }
    },

    

    processFailure : function(S){
        this.transaction = null;
        this.fireEvent("failure", this.el, S);
        if(typeof  S.argument.callback == "function"){
            S.argument.callback(this.el, false, S);
        }
    },

    

    setRenderer : function(T){
        this.renderer = T;
    },

    getRenderer : function(){
       return  this.renderer;
    },

    

    setDefaultUrl : function(U){
        this.defaultUrl = U;
    },

    

    abort : function(){
        if(this.transaction){
            Roo.Ajax.abort(this.transaction);
        }
    },

    

    isUpdating : function(){
        if(this.transaction){
            return  Roo.Ajax.isLoading(this.transaction);
        }
        return  false;
    }
});



   Roo.UpdateManager.defaults = {
       

         timeout : 30,

         

        loadScripts : false,

        

        sslBlankUrl : (Roo.SSL_SECURE_URL || "javascript:false"),
        

        disableCaching : false,
        

        showLoadIndicator : true,
        

        indicatorText : '<div class="loading-indicator">Loading...</div>'
   };



Roo.UpdateManager.updateElement = function(el, V, W, X){
    var  um = Roo.get(el, true).getUpdateManager();
    Roo.apply(um, X);
    um.update(V, W, X ? X.callback : null);
};

Roo.UpdateManager.update = Roo.UpdateManager.updateElement;


Roo.UpdateManager.BasicRenderer = function(){};

Roo.UpdateManager.BasicRenderer.prototype = {
    

     render : function(el, Y, Z, a){
        el.update(Y.responseText, Z.loadScripts, a);
    }
};






Roo.util.DelayedTask = function(fn, A, B){
    var  id = null, d, t;

    var  C = function(){
        var  D = new  Date().getTime();
        if(D - t >= d){
            clearInterval(id);
            id = null;
            fn.apply(A, B || []);
        }
    };
    

    this.delay = function(D, E, F, G){
        if(id && D != d){
            this.cancel();
        }

        d = D;
        t = new  Date().getTime();
        fn = E || fn;
        A = F || A;
        B = G || B;
        if(!id){
            id = setInterval(C, d);
        }
    };

    

    this.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};


 
 
Roo.util.TaskRunner = function(A){
    A = A || 10;
    var  B = [], C = [];
    var  id = 0;
    var  D = false;

    var  E = function(){
        D = false;
        clearInterval(id);
        id = 0;
    };

    var  F = function(){
        if(!D){
            D = true;
            id = setInterval(H, A);
        }
    };

    var  G = function(I){
        C.push(I);
        if(I.onStop){
            I.onStop();
        }
    };

    var  H = function(){
        if(C.length > 0){
            for(var  i = 0, len = C.length; i < len; i++){
                B.remove(C[i]);
            }

            C = [];
            if(B.length < 1){
                E();
                return;
            }
        }
        var  I = new  Date().getTime();
        for(var  i = 0, len = B.length; i < len; ++i){
            var  t = B[i];
            var  itime = I - t.taskRunTime;
            if(t.interval <= itime){
                var  rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
                t.taskRunTime = I;
                if(rt === false || t.taskRunCount === t.repeat){
                    G(t);
                    return;
                }
            }
            if(t.duration && t.duration <= (I - t.taskStartTime)){
                G(t);
            }
        }
    };

    

    this.start = function(I){
        B.push(I);
        I.taskStartTime = new  Date().getTime();
        I.taskRunTime = 0;
        I.taskRunCount = 0;
        F();
        return  I;
    };

    this.stop = function(I){
        G(I);
        return  I;
    };

    this.stopAll = function(){
        E();
        for(var  i = 0, len = B.length; i < len; i++){
            if(B[i].onStop){
                B[i].onStop();
            }
        }

        B = [];
        C = [];
    };
};

Roo.TaskMgr = new  Roo.util.TaskRunner();



 


Roo.util.MixedCollection = function(A, B){
    this.items = [];
    this.map = {};
    this.keys = [];
    this.length = 0;
    this.addEvents({
        

        "clear" : true,
        

        "add" : true,
        

        "replace" : true,
        

        "remove" : true,
        "sort" : true
    });
    this.allowFunctions = A === true;
    if(B){
        this.getKey = B;
    }

    Roo.util.MixedCollection.superclass.constructor.call(this);
};

Roo.extend(Roo.util.MixedCollection, Roo.util.Observable, {
    allowFunctions : false,
    


    add : function(C, o){
        if(arguments.length == 1){
            o = arguments[0];
            C = this.getKey(o);
        }
        if(typeof  C == "undefined" || C === null){
            this.length++;
            this.items.push(o);
            this.keys.push(null);
        }else {
            var  old = this.map[C];
            if(old){
                return  this.replace(C, o);
            }

            this.length++;
            this.items.push(o);
            this.map[C] = o;
            this.keys.push(C);
        }

        this.fireEvent("add", this.length-1, o, C);
        return  o;
    },
   


    getKey : function(o){
         return  o.id; 
    },
   


    replace : function(D, o){
        if(arguments.length == 1){
            o = arguments[0];
            D = this.getKey(o);
        }
        var  E = this.item(D);
        if(typeof  D == "undefined" || D === null || typeof  E == "undefined"){
             return  this.add(D, o);
        }
        var  F = this.indexOfKey(D);
        this.items[F] = o;
        this.map[D] = o;
        this.fireEvent("replace", D, E, o);
        return  o;
    },
   


    addAll : function(G){
        if(arguments.length > 1 || G  instanceof  Array){
            var  args = arguments.length > 1 ? arguments : G;
            for(var  i = 0, len = args.length; i < len; i++){
                this.add(args[i]);
            }
        }else {
            for(var  D  in  G){
                if(this.allowFunctions || typeof  G[D] != "function"){
                    this.add(D, G[D]);
                }
            }
        }
    },
   


    each : function(fn, H){
        var  I = [].concat(this.items); 
        for(var  i = 0, len = I.length; i < len; i++){
            if(fn.call(H || I[i], I[i], i, len) === false){
                break;
            }
        }
    },
   


    eachKey : function(fn, J){
        for(var  i = 0, len = this.keys.length; i < len; i++){
            fn.call(J || window, this.keys[i], this.items[i], i, len);
        }
    },
   


    find : function(fn, K){
        for(var  i = 0, len = this.items.length; i < len; i++){
            if(fn.call(K || window, this.items[i], this.keys[i])){
                return  this.items[i];
            }
        }
        return  null;
    },
   


    insert : function(L, M, o){
        if(arguments.length == 2){
            o = arguments[1];
            M = this.getKey(o);
        }
        if(L >= this.length){
            return  this.add(M, o);
        }

        this.length++;
        this.items.splice(L, 0, o);
        if(typeof  M != "undefined" && M != null){
            this.map[M] = o;
        }

        this.keys.splice(L, 0, M);
        this.fireEvent("add", L, o, M);
        return  o;
    },
   


    remove : function(o){
        return  this.removeAt(this.indexOf(o));
    },
   


    removeAt : function(N){
        if(N < this.length && N >= 0){
            this.length--;
            var  o = this.items[N];
            this.items.splice(N, 1);
            var  M = this.keys[N];
            if(typeof  M != "undefined"){
                delete  this.map[M];
            }

            this.keys.splice(N, 1);
            this.fireEvent("remove", o, M);
        }
    },
   


    removeKey : function(O){
        return  this.removeAt(this.indexOfKey(O));
    },
   


    getCount : function(){
        return  this.length; 
    },
   


    indexOf : function(o){
        if(!this.items.indexOf){
            for(var  i = 0, len = this.items.length; i < len; i++){
                if(this.items[i] == o) return  i;
            }
            return  -1;
        }else {
            return  this.items.indexOf(o);
        }
    },
   


    indexOfKey : function(P){
        if(!this.keys.indexOf){
            for(var  i = 0, len = this.keys.length; i < len; i++){
                if(this.keys[i] == P) return  i;
            }
            return  -1;
        }else {
            return  this.keys.indexOf(P);
        }
    },
   


    item : function(Q){
        var  R = typeof  this.map[Q] != "undefined" ? this.map[Q] : this.items[Q];
        return  typeof  R != 'function' || this.allowFunctions ? R : null; 
    },
    


    itemAt : function(S){
        return  this.items[S];
    },
    


    key : function(T){
        return  this.map[T];
    },
   


    contains : function(o){
        return  this.indexOf(o) != -1;
    },
   


    containsKey : function(U){
        return  typeof  this.map[U] != "undefined";
    },
   


    clear : function(){
        this.length = 0;
        this.items = [];
        this.keys = [];
        this.map = {};
        this.fireEvent("clear");
    },
   


    first : function(){
        return  this.items[0]; 
    },
   


    last : function(){
        return  this.items[this.length-1];   
    },
    
    _sort : function(V, W, fn){
        var  X = String(W).toUpperCase() == "DESC" ? -1 : 1;
        fn = fn || function(a, b){
            return  a-b;
        };
        var  c = [], k = this.keys, Y = this.items;
        for(var  i = 0, len = Y.length; i < len; i++){
            c[c.length] = {key: k[i], value: Y[i], index: i};
        }

        c.sort(function(a, b){
            var  v = fn(a[V], b[V]) * X;
            if(v == 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return  v;
        });
        for(var  i = 0, len = c.length; i < len; i++){
            Y[i] = c[i].value;
            k[i] = c[i].key;
        }

        this.fireEvent("sort", this);
    },
    
    

    sort : function(Z, fn){
        this._sort("value", Z, fn);
    },
    
    

    keySort : function(a, fn){
        this._sort("key", a, fn || function(a, b){
            return  String(a).toUpperCase()-String(b).toUpperCase();
        });
    },
    
    

    getRange : function(b, d){
        var  e = this.items;
        if(e.length < 1){
            return  [];
        }

        b = b || 0;
        d = Math.min(typeof  d == "undefined" ? this.length-1 : d, this.length-1);
        var  r = [];
        if(b <= d){
            for(var  i = b; i <= d; i++) {
        	    r[r.length] = e[i];
            }
        }else {
            for(var  i = b; i >= d; i--) {
        	    r[r.length] = e[i];
            }
        }
        return  r;
    },
        
    

    filter : function(f, g){
        if(!g.exec){ 
            g = String(g);
            if(g.length == 0){
                return  this.clone();
            }

            g = new  RegExp("^" + Roo.escapeRe(g), "i");
        }
        return  this.filterBy(function(o){
            return  o && g.test(o[f]);
        });
	},
    
    

    filterBy : function(fn, h){
        var  r = new  Roo.util.MixedCollection();
        r.getKey = this.getKey;
        var  k = this.keys, it = this.items;
        for(var  i = 0, len = it.length; i < len; i++){
            if(fn.call(h||this, it[i], k[i])){
				r.add(k[i], it[i]);
			}
        }
        return  r;
    },
    
    

    clone : function(){
        var  r = new  Roo.util.MixedCollection();
        var  k = this.keys, it = this.items;
        for(var  i = 0, len = it.length; i < len; i++){
            r.add(k[i], it[i]);
        }

        r.getKey = this.getKey;
        return  r;
    }
});


Roo.util.MixedCollection.prototype.get = Roo.util.MixedCollection.prototype.item;




Roo.util.JSON = new  (function(){
    var  useHasOwn = {}.hasOwnProperty ? true : false;
    
    
    
    
    var  pad = function(n) {
        return  n < 10 ? "0" + n : n;
    };
    
    var  m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };

    var  encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return  '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var  c = m[b];
                if(c){
                    return  c;
                }

                c = b.charCodeAt();
                return  "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return  '"' + s + '"';
    };
    
    var  encodeArray = function(o){
        var  a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof  v) {
                    case  "undefined":
                    case  "function":
                    case  "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }

                        a.push(v === null ? "null" : Roo.util.JSON.encode(v));
                        b = true;
                }
            }

            a.push("]");
            return  a.join("");
    };
    
    var  encodeDate = function(o){
        return  '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };
    
    

    this.encode = function(o){
        if(typeof  o == "undefined" || o === null){
            return  "null";
        }else  if(o  instanceof  Array){
            return  encodeArray(o);
        }else  if(o  instanceof  Date){
            return  encodeDate(o);
        }else  if(typeof  o == "string"){
            return  encodeString(o);
        }else  if(typeof  o == "number"){
            return  isFinite(o) ? String(o) : "null";
        }else  if(typeof  o == "boolean"){
            return  String(o);
        }else  {
            var  a = ["{"], b, i, v;
            for (i  in  o) {
                if(!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof  v) {
                    case  "undefined":
                    case  "function":
                    case  "unknown":
                        break;
                    default:
                        if(b){
                            a.push(',');
                        }

                        a.push(this.encode(i), ":",
                                v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }

            a.push("}");
            return  a.join("");
        }
    };
    
    

    this.decode = function(json){
        

        return  eval("(" + json + ')');
    };
})();


Roo.encode = Roo.util.JSON.encode;


Roo.decode = Roo.util.JSON.decode;



 


Roo.util.Format = function(){
    var  A = /^\s+|\s+$/g;
    return  {
        

        ellipsis : function(R, S){
            if(R && R.length > S){
                return  R.substr(0, S-3)+"...";
            }
            return  R;
        },

        

        undef : function(T){
            return  typeof  T != "undefined" ? T : "";
        },

        

        htmlEncode : function(U){
            return  !U ? U : String(U).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        

        htmlDecode : function(V){
            return  !V ? V : String(V).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
        },

        

        trim : function(W){
            return  String(W).replace(A, "");
        },

        

        substr : function(X, Y, Z){
            return  String(X).substr(Y, Z);
        },

        

        lowercase : function(a){
            return  String(a).toLowerCase();
        },

        

        uppercase : function(b){
            return  String(b).toUpperCase();
        },

        

        capitalize : function(c){
            return  !c ? c : c.charAt(0).toUpperCase() + c.substr(1).toLowerCase();
        },

        
        call : function(value, fn){
            if(arguments.length > 2){
                var  args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                 
                return  
  eval(fn).apply(window, args);
            }else {
                

                return  
 eval(fn).call(window, value);
            }
        },

        

        usMoney : function(v){
            v = (Math.round((v-0)*100))/100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
            v = String(v);
            var  ps = v.split('.');
            var  d = ps[0];
            var  e = ps[1] ? '.'+ ps[1] : '.00';
            var  r = /(\d+)(\d{3})/;
            while (r.test(d)) {
                d = d.replace(r, '$1' + ',' + '$2');
            }
            return  "$" + d + e ;
        },

        

        date : function(v, f){
            if(!v){
                return  "";
            }
            if(!(v  instanceof  Date)){
                v = new  Date(Date.parse(v));
            }
            return  v.dateFormat(f || "m/d/Y");
        },

        

        dateRenderer : function(g){
            return  function(v){
                return  Roo.util.Format.date(v, g);  
            };
        },

        
        stripTagsRE : /<\/?[^>]+>/gi,
        
        

        stripTags : function(v){
            return  !v ? v : String(v).replace(this.stripTagsRE, "");
        }
    };
}();




 



Roo.MasterTemplate = function(){
    Roo.MasterTemplate.superclass.constructor.apply(this, arguments);
    this.originalHtml = this.html;
    var  st = {};
    var  m, re = this.subTemplateRe;
    re.lastIndex = 0;
    var  A = 0;
    while(m = re.exec(this.html)){
        var  name = m[1], content = m[2];
        st[A] = {
            name: name,
            index: A,
            buffer: [],
            tpl : new  Roo.Template(content)
        };
        if(name){
            st[name] = st[A];
        }

        st[A].tpl.compile();
        st[A].tpl.call = this.call.createDelegate(this);
        A++;
    }

    this.subCount = A;
    this.subs = st;
};
Roo.extend(Roo.MasterTemplate, Roo.Template, {
    

    subTemplateRe : /<tpl(?:\sname="([\w-]+)")?>((?:.|\n)*?)<\/tpl>/gi,

    

     add : function(B, C){
        if(arguments.length == 1){
            C = arguments[0];
            B = 0;
        }
        var  s = this.subs[B];
        s.buffer[s.buffer.length] = s.tpl.apply(C);
        return  this;
    },

    

    fill : function(D, E, F){
        var  a = arguments;
        if(a.length == 1 || (a.length == 2 && typeof  a[1] == "boolean")){
            E = a[0];
            D = 0;
            F = a[1];
        }
        if(F){
            this.reset();
        }
        for(var  i = 0, len = E.length; i < len; i++){
            this.add(D, E[i]);
        }
        return  this;
    },

    

     reset : function(){
        var  s = this.subs;
        for(var  i = 0; i < this.subCount; i++){
            s[i].buffer = [];
        }
        return  this;
    },

    applyTemplate : function(G){
        var  s = this.subs;
        var  H = -1;
        this.html = this.originalHtml.replace(this.subTemplateRe, function(m, I){
            return  s[++H].buffer.join("");
        });
        return  Roo.MasterTemplate.superclass.applyTemplate.call(this, G);
    },

    apply : function(){
        return  this.applyTemplate.apply(this, arguments);
    },

    compile : function(){return  this;}
});



Roo.MasterTemplate.prototype.addAll = Roo.MasterTemplate.prototype.fill;
 

Roo.MasterTemplate.from = function(el, I){
    el = Roo.getDom(el);
    return  new  Roo.MasterTemplate(el.value || el.innerHTML, I || '');
};



 


Roo.util.CSS = function(){
	var  A = null;
   	var  B = document;

    var  C = /(-[a-z])/gi;
    var  D = function(m, a){ return  a.charAt(1).toUpperCase(); };

   return  {
   

    createStyleSheet : function(P, id){
        var  ss;
        var  Q = B.getElementsByTagName("head")[0];
        var  R = B.createElement("style");
        R.setAttribute("type", "text/css");
        if(id){
            R.setAttribute("id", id);
        }
        if (typeof(P) != 'string') {
            
            
            
            
            var  cssTextNew = [];
            for(var  n  in  P) {
                var  citems = [];
                for(var  k  in  P[n]) {
                    citems.push( k + ' : ' +P[n][k] + ';' );
                }

                cssTextNew.push( n + ' { ' + citems.join(' ') + '} ');
                
            }

            P = cssTextNew.join("\n");
            
        }
       
       
       if(Roo.isIE){
           Q.appendChild(R);
           ss = R.styleSheet;
           ss.cssText = P;
       }else {
           try{
                R.appendChild(B.createTextNode(P));
           }catch(e){
               R.cssText = P; 
           }

           Q.appendChild(R);
           ss = R.styleSheet ? R.styleSheet : (R.sheet || B.styleSheets[B.styleSheets.length-1]);
       }

       this.cacheStyleSheet(ss);
       return  ss;
   },

   

   removeStyleSheet : function(id){
       var  S = B.getElementById(id);
       if(S){
           S.parentNode.removeChild(S);
       }
   },

   

   swapStyleSheet : function(id, T){
       this.removeStyleSheet(id);
       var  ss = B.createElement("link");
       ss.setAttribute("rel", "stylesheet");
       ss.setAttribute("type", "text/css");
       ss.setAttribute("id", id);
       ss.setAttribute("href", T);
       B.getElementsByTagName("head")[0].appendChild(ss);
   },
   
   

   refreshCache : function(){
       return  this.getRules(true);
   },

   
   cacheStyleSheet : function(ss){
       if(!R){
           R = {};
       }
       try{
           var  ssRules = ss.cssRules || ss.rules;
           for(var  j = ssRules.length-1; j >= 0; --j){
               R[ssRules[j].selectorText] = ssRules[j];
           }
       }catch(e){}
   },
   
   

   getRules : function(U){
   		if(R == null || U){
   			R = {};
   			var  ds = B.styleSheets;
   			for(var  i =0, len = ds.length; i < len; i++){
   			    try{
    		        this.cacheStyleSheet(ds[i]);
    		    }catch(e){} 
	        }
   		}
   		return  R;
   	},
   	
   	

   getRule : function(V, W){
   		var  rs = this.getRules(W);
   		if(!(V  instanceof  Array)){
   		    return  rs[V];
   		}
   		for(var  i = 0; i < V.length; i++){
			if(rs[V[i]]){
				return  rs[V[i]];
			}
		}
		return  null;
   	},
   	
   	
   	

   updateRule : function(X, Y, Z){
   		if(!(X  instanceof  Array)){
   			var  rule = this.getRule(X);
   			if(rule){
   				rule.style[Y.replace(C, D)] = Z;
   				return  true;
   			}
   		}else {
   			for(var  i = 0; i < X.length; i++){
   				if(this.updateRule(X[i], Y, Z)){
   					return  true;
   				}
   			}
   		}
   		return  false;
   	}
   };	
}();



 



Roo.util.ClickRepeater = function(el, A)
{
    this.el = Roo.get(el);
    this.el.unselectable();

    Roo.apply(this, A);

    this.addEvents({
    

        "mousedown" : true,
    

        "click" : true,
    

        "mouseup" : true
    });

    this.el.on("mousedown", this.handleMouseDown, this);
    if(this.preventDefault || this.stopDefault){
        this.el.on("click", function(e){
            if(this.preventDefault){
                e.preventDefault();
            }
            if(this.stopDefault){
                e.stopEvent();
            }
        }, this);
    }

    
    if(this.handler){
        this.on("click", this.handler,  this.scope || this);
    }


    Roo.util.ClickRepeater.superclass.constructor.call(this);
};

Roo.extend(Roo.util.ClickRepeater, Roo.util.Observable, {
    interval : 20,
    delay: 250,
    preventDefault : true,
    stopDefault : false,
    timer : 0,

    
    handleMouseDown : function(){
        clearTimeout(this.timer);
        this.el.blur();
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }

        this.mousedownTime = new  Date();

        Roo.get(document).on("mouseup", this.handleMouseUp, this);
        this.el.on("mouseout", this.handleMouseOut, this);

        this.fireEvent("mousedown", this);
        this.fireEvent("click", this);
        
        this.timer = this.click.defer(this.delay || this.interval, this);
    },

    
    click : function(){
        this.fireEvent("click", this);
        this.timer = this.click.defer(this.getInterval(), this);
    },

    
    getInterval: function(){
        if(!this.accelerate){
            return  this.interval;
        }
        var  B = this.mousedownTime.getElapsed();
        if(B < 500){
            return  400;
        }else  if(B < 1700){
            return  320;
        }else  if(B < 2600){
            return  250;
        }else  if(B < 3500){
            return  180;
        }else  if(B < 4400){
            return  140;
        }else  if(B < 5300){
            return  80;
        }else  if(B < 6200){
            return  50;
        }else {
            return  10;
        }
    },

    
    handleMouseOut : function(){
        clearTimeout(this.timer);
        if(this.pressClass){
            this.el.removeClass(this.pressClass);
        }

        this.el.on("mouseover", this.handleMouseReturn, this);
    },

    
    handleMouseReturn : function(){
        this.el.un("mouseover", this.handleMouseReturn);
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }

        this.click();
    },

    
    handleMouseUp : function(){
        clearTimeout(this.timer);
        this.el.un("mouseover", this.handleMouseReturn);
        this.el.un("mouseout", this.handleMouseOut);
        Roo.get(document).un("mouseup", this.handleMouseUp);
        this.el.removeClass(this.pressClass);
        this.fireEvent("mouseup", this);
    }
});



 


Roo.KeyNav = function(el, A){
    this.el = Roo.get(el);
    Roo.apply(this, A);
    if(!this.disabled){
        this.disabled = true;
        this.enable();
    }
};

Roo.KeyNav.prototype = {
    

    disabled : false,
    

    defaultEventAction: "stopEvent",
    

    forceKeyDown : false,

    
    prepareEvent : function(e){
        var  k = e.getKey();
        var  h = this.keyToHandler[k];
        
        
        
        if(Roo.isSafari && h && k >= 37 && k <= 40){
            e.stopEvent();
        }
    },

    
    relay : function(e){
        var  k = e.getKey();
        var  h = this.keyToHandler[k];
        if(h && this[h]){
            if(this.doRelay(e, this[h], h) !== true){
                e[this.defaultEventAction]();
            }
        }
    },

    
    doRelay : function(e, h, B){
        return  h.call(this.scope || this, e);
    },

    
    enter : false,
    left : false,
    right : false,
    up : false,
    down : false,
    tab : false,
    esc : false,
    pageUp : false,
    pageDown : false,
    del : false,
    home : false,
    end : false,

    
    keyToHandler : {
        37 : "left",
        39 : "right",
        38 : "up",
        40 : "down",
        33 : "pageUp",
        34 : "pageDown",
        46 : "del",
        36 : "home",
        35 : "end",
        13 : "enter",
        27 : "esc",
        9  : "tab"
    },

	

	enable: function(){
		if(this.disabled){
            
            
            if(this.forceKeyDown || Roo.isIE || Roo.isAir){
                this.el.on("keydown", this.relay,  this);
            }else {
                this.el.on("keydown", this.prepareEvent,  this);
                this.el.on("keypress", this.relay,  this);
            }

		    this.disabled = false;
		}
	},

	

	disable: function(){
		if(!this.disabled){
		    if(this.forceKeyDown || Roo.isIE || Roo.isAir){
                this.el.un("keydown", this.relay);
            }else {
                this.el.un("keydown", this.prepareEvent);
                this.el.un("keypress", this.relay);
            }

		    this.disabled = true;
		}
	}
};



 


Roo.KeyMap = function(el, A, B){
    this.el  = Roo.get(el);
    this.eventName = B || "keydown";
    this.bindings = [];
    if(A){
        this.addBinding(A);
    }

    this.enable();
};

Roo.KeyMap.prototype = {
    

    stopEvent : false,

    

	addBinding : function(C){
        if(C  instanceof  Array){
            for(var  i = 0, len = C.length; i < len; i++){
                this.addBinding(C[i]);
            }
            return;
        }
        var  D = C.key,
            E = C.shift, 
            F = C.ctrl, 
            G = C.alt,
            fn = C.fn,
            H = C.scope;
        if(typeof  D == "string"){
            var  ks = [];
            var  keyString = D.toUpperCase();
            for(var  j = 0, len = keyString.length; j < len; j++){
                ks.push(keyString.charCodeAt(j));
            }

            D = ks;
        }
        var  I = D  instanceof  Array;
        var  J = function(e){
            if((!E || e.shiftKey) && (!F || e.ctrlKey) &&  (!G || e.altKey)){
                var  k = e.getKey();
                if(I){
                    for(var  i = 0, len = D.length; i < len; i++){
                        if(D[i] == k){
                          if(this.stopEvent){
                              e.stopEvent();
                          }

                          fn.call(H || window, k, e);
                          return;
                        }
                    }
                }else {
                    if(k == D){
                        if(this.stopEvent){
                           e.stopEvent();
                        }

                        fn.call(H || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(J);  
	},

    

    on : function(K, fn, L){
        var  M, N, O, P;
        if(typeof  K == "object" && !(K  instanceof  Array)){
            M = K.key;
            N = K.shift;
            O = K.ctrl;
            P = K.alt;
        }else {
            M = K;
        }

        this.addBinding({
            key: M,
            shift: N,
            ctrl: O,
            alt: P,
            fn: fn,
            scope: L
        })
    },

    
    handleKeyDown : function(e){
	    if(this.enabled){ 
    	    var  b = this.bindings;
    	    for(var  i = 0, len = b.length; i < len; i++){
    	        b[i].call(this, e);
    	    }
	    }
	},
	
	

	isEnabled : function(){
	    return  this.enabled;  
	},
	
	

	enable: function(){
		if(!this.enabled){
		    this.el.on(this.eventName, this.handleKeyDown, this);
		    this.enabled = true;
		}
	},

	

	disable: function(){
		if(this.enabled){
		    this.el.removeListener(this.eventName, this.handleKeyDown, this);
		    this.enabled = false;
		}
	}
};



 


Roo.util.TextMetrics = function(){
    var  A;
    return  {
        

        measure : function(el, E, F){
            if(!A){
                A = Roo.util.TextMetrics.Instance(el, F);
            }

            A.bind(el);
            A.setFixedWidth(F || 'auto');
            return  A.getSize(E);
        },

        

        createInstance : function(el, G){
            return  Roo.util.TextMetrics.Instance(el, G);
        }
    };
}();

 

Roo.util.TextMetrics.Instance = function(B, C){
    var  ml = new  Roo.Element(document.createElement('div'));
    document.body.appendChild(ml.dom);
    ml.position('absolute');
    ml.setLeftTop(-1000, -1000);
    ml.hide();

    if(C){
        ml.setWidth(C);
    }
     
    var  D = {
        

        getSize : function(E){
            ml.update(E);
            var  s = ml.getSize();
            ml.update('');
            return  s;
        },

        

        bind : function(el){
            ml.setStyle(
                Roo.fly(el).getStyles('font-size','font-style', 'font-weight', 'font-family','line-height')
            );
        },

        

        setFixedWidth : function(F){
            ml.setWidth(F);
        },

        

        getWidth : function(G){
            ml.dom.style.width = 'auto';
            return  this.getSize(G).width;
        },

        

        getHeight : function(H){
            return  this.getSize(H).height;
        }
    };

    D.bind(B);

    return  D;
};


Roo.Element.measureText = Roo.util.TextMetrics.measure;





Roo.state.Provider = function(){
    

    this.addEvents({
        "statechange": true
    });
    this.state = {};
    Roo.state.Provider.superclass.constructor.call(this);
};
Roo.extend(Roo.state.Provider, Roo.util.Observable, {
    

    get : function(A, B){
        return  typeof  this.state[A] == "undefined" ?
            B : this.state[A];
    },
    
    

    clear : function(C){
        delete  this.state[C];
        this.fireEvent("statechange", this, C, null);
    },
    
    

    set : function(D, E){
        this.state[D] = E;
        this.fireEvent("statechange", this, D, E);
    },
    
    

    decodeValue : function(F){
        var  re = /^(a|n|d|b|s|o)\:(.*)$/;
        var  G = re.exec(unescape(F));
        if(!G || !G[1]) return; 
        var  H = G[1];
        var  v = G[2];
        switch(H){
            case  "n":
                return  parseFloat(v);
            case  "d":
                return  new  Date(Date.parse(v));
            case  "b":
                return  (v == "1");
            case  "a":
                var  all = [];
                var  values = v.split("^");
                for(var  i = 0, len = values.length; i < len; i++){
                    all.push(this.decodeValue(values[i]));
                }
                return  all;
           case  "o":
                var  all = {};
                var  values = v.split("^");
                for(var  i = 0, len = values.length; i < len; i++){
                    var  kv = values[i].split("=");
                    all[kv[0]] = this.decodeValue(kv[1]);
                }
                return  all;
           default:
                return  v;
        }
    },
    
    

    encodeValue : function(v){
        var  I;
        if(typeof  v == "number"){
            I = "n:" + v;
        }else  if(typeof  v == "boolean"){
            I = "b:" + (v ? "1" : "0");
        }else  if(v  instanceof  Date){
            I = "d:" + v.toGMTString();
        }else  if(v  instanceof  Array){
            var  flat = "";
            for(var  i = 0, len = v.length; i < len; i++){
                flat += this.encodeValue(v[i]);
                if(i != len-1) flat += "^";
            }

            I = "a:" + flat;
        }else  if(typeof  v == "object"){
            var  flat = "";
            for(var  key  in  v){
                if(typeof  v[key] != "function"){
                    flat += key + "=" + this.encodeValue(v[key]) + "^";
                }
            }

            I = "o:" + flat.substring(0, flat.length-1);
        }else {
            I = "s:" + v;
        }
        return  escape(I);        
    }
});






Roo.state.Manager = function(){
    var  A = new  Roo.state.Provider();
    
    return  {
        

        setProvider : function(H){
            A = H;
        },
        
        

        get : function(I, J){
            return  A.get(I, J);
        },
        
        

         set : function(K, L){
            A.set(K, L);
        },
        
        

        clear : function(M){
            A.clear(M);
        },
        
        

        getProvider : function(){
            return  A;
        }
    };
}();





Roo.state.CookieProvider = function(A){
    Roo.state.CookieProvider.superclass.constructor.call(this);
    this.path = "/";
    this.expires = new  Date(new  Date().getTime()+(1000*60*60*24*7)); 
    this.domain = null;
    this.secure = false;
    Roo.apply(this, A);
    this.state = this.readCookies();
};

Roo.extend(Roo.state.CookieProvider, Roo.state.Provider, {
    
    set : function(B, C){
        if(typeof  C == "undefined" || C === null){
            this.clear(B);
            return;
        }

        this.setCookie(B, C);
        Roo.state.CookieProvider.superclass.set.call(this, B, C);
    },

    
    clear : function(D){
        this.clearCookie(D);
        Roo.state.CookieProvider.superclass.clear.call(this, D);
    },

    
    readCookies : function(){
        var  E = {};
        var  c = document.cookie + ";";
        var  re = /\s?(.*?)=(.*?);/g;
    	var  F;
    	while((F = re.exec(c)) != null){
            var  D = F[1];
            var  C = F[2];
            if(D && D.substring(0,3) == "ys-"){
                E[D.substr(3)] = this.decodeValue(C);
            }
        }
        return  E;
    },

    
    setCookie : function(G, H){
        document.cookie = "ys-"+ G + "=" + this.encodeValue(H) +
           ((this.expires == null) ? "" : ("; expires=" + this.expires.toGMTString())) +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    },

    
    clearCookie : function(I){
        document.cookie = "ys-" + I + "=null; expires=Thu, 01-Jan-70 00:00:01 GMT" +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    }
});
