Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.CommandWatcherThread", ["java.lang.Thread", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.scriptManager = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "CommandWatcherThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (scriptManager) {
Clazz.superConstructor (this, org.jmol.thread.CommandWatcherThread, []);
this.scriptManager = scriptManager;
this.setMyName ("CommmandWatcherThread");
this.start ();
}, "org.jmol.viewer.ScriptManager");
Clazz.overrideMethod (c$, "run", 
function () {
Thread.currentThread ().setPriority (1);
var commandDelay = 50;
while (!this.$interrupted) {
try {
Thread.sleep (commandDelay);
if (!this.$interrupted) {
this.scriptManager.runScriptNow ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, InterruptedException)) {
var ie = e$$;
{
org.jmol.util.Logger.warn ("CommandWatcher InterruptedException! " + this);
break;
}
} else if (Clazz.exceptionOf (e$$, Exception)) {
var ie = e$$;
{
var s = "script processing ERROR:\n\n" + ie.toString ();
for (var i = 0; i < ie.getStackTrace ().length; i++) {
s += "\n" + ie.getStackTrace ()[i].toString ();
}
org.jmol.util.Logger.warn ("CommandWatcher Exception! " + s);
break;
}
} else {
throw e$$;
}
}
}
this.scriptManager.clearCommandWatcherThread ();
});
});
