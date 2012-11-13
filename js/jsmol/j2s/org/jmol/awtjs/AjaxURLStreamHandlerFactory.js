Clazz.declarePackage ("org.jmol.awtjs");
Clazz.load (["java.net.URLStreamHandlerFactory", "java.util.Hashtable"], "org.jmol.awtjs.AjaxURLStreamHandlerFactory", ["org.jmol.awtjs.AjaxURLStreamHandler"], function () {
c$ = Clazz.decorateAsClass (function () {
this.htFactories = null;
Clazz.instantialize (this, arguments);
}, org.jmol.awtjs, "AjaxURLStreamHandlerFactory", null, java.net.URLStreamHandlerFactory);
Clazz.prepareFields (c$, function () {
this.htFactories =  new java.util.Hashtable ();
});
Clazz.overrideMethod (c$, "createURLStreamHandler", 
function (protocol) {
var fac = this.htFactories.get (protocol);
if (fac == null) this.htFactories.put (protocol, fac =  new org.jmol.awtjs.AjaxURLStreamHandler (protocol));
return (fac.protocol == null ? null : fac);
}, "~S");
});
