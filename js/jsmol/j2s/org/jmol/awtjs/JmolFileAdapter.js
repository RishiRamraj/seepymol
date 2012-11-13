Clazz.declarePackage ("org.jmol.awtjs");
Clazz.load (["org.jmol.api.JmolFileAdapterInterface"], "org.jmol.awtjs.JmolFileAdapter", ["java.net.UnknownServiceException"], function () {
c$ = Clazz.declareType (org.jmol.awtjs, "JmolFileAdapter", null, org.jmol.api.JmolFileAdapterInterface);
Clazz.overrideMethod (c$, "getBufferedFileInputStream", 
function (name) {
try {
throw  new java.net.UnknownServiceException ("No local file reading in JavaScript version of Jmol");
} catch (e) {
if (Clazz.exceptionOf (e, java.io.IOException)) {
return e.getMessage ();
} else {
throw e;
}
}
}, "~S");
Clazz.overrideMethod (c$, "getBufferedURLInputStream", 
function (url, outputBytes, post) {
try {
var conn = url.openConnection ();
if (outputBytes != null) conn.outputBytes (outputBytes);
 else if (post != null) conn.outputString (post);
return conn.getStringXBuilder ();
} catch (e) {
if (Clazz.exceptionOf (e, java.io.IOException)) {
return e.getMessage ();
} else {
throw e;
}
}
}, "java.net.URL,~A,~S");
});
