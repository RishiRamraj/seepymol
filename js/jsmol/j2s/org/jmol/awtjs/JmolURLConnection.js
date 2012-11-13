Clazz.declarePackage ("org.jmol.awtjs");
Clazz.load (["java.net.URLConnection"], "org.jmol.awtjs.JmolURLConnection", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.bytesOut = null;
this.postOut = "";
Clazz.instantialize (this, arguments);
}, org.jmol.awtjs, "JmolURLConnection", java.net.URLConnection);
Clazz.defineMethod (c$, "doAjax", 
($fz = function () {
return null;
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "connect", 
function () {
});
Clazz.defineMethod (c$, "outputBytes", 
function (bytes) {
this.bytesOut = bytes;
}, "~A");
Clazz.defineMethod (c$, "outputString", 
function (post) {
this.postOut = post;
}, "~S");
Clazz.defineMethod (c$, "getStringXBuilder", 
function () {
return this.doAjax ();
});
});
