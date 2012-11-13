Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["java.lang.Thread"], "org.jmol.thread.JmolThread", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.$name = "JmolThread";
this.$interrupted = false;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "JmolThread", Thread);
Clazz.defineMethod (c$, "setMyName", 
function (name) {
this.$name = name;
Clazz.superCall (this, org.jmol.thread.JmolThread, "setName", [name]);
}, "~S");
Clazz.defineMethod (c$, "start", 
function () {
{
}});
Clazz.defineMethod (c$, "interrupt", 
function () {
this.$interrupted = true;
{
}});
});
