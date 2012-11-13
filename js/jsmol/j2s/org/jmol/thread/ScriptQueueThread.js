Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.ScriptQueueThread", ["java.lang.Thread", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.scriptManager = null;
this.viewer = null;
this.startedByCommandThread = false;
this.pt = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "ScriptQueueThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (scriptManager, viewer, startedByCommandThread, pt) {
Clazz.superConstructor (this, org.jmol.thread.ScriptQueueThread, []);
this.scriptManager = scriptManager;
this.viewer = viewer;
this.startedByCommandThread = startedByCommandThread;
this.pt = pt;
this.setMyName ("QueueThread" + pt);
this.start ();
}, "org.jmol.viewer.ScriptManager,org.jmol.viewer.Viewer,~B,~N");
Clazz.overrideMethod (c$, "run", 
function () {
while (this.scriptManager.scriptQueue.size () != 0) {
if (!this.runNextScript ()) try {
Thread.sleep (100);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.error (this + " Exception " + e.getMessage ());
break;
} else {
throw e;
}
}
}
this.scriptManager.queueThreadFinished (this.pt);
});
Clazz.defineMethod (c$, "runNextScript", 
($fz = function () {
if (this.scriptManager.scriptQueue.size () == 0) return false;
var scriptItem = this.scriptManager.getScriptItem (false, this.startedByCommandThread);
if (scriptItem == null) return false;
var script = scriptItem.get (0);
var statusList = scriptItem.get (1);
var returnType = scriptItem.get (2);
var isScriptFile = (scriptItem.get (3)).booleanValue ();
var isQuiet = (scriptItem.get (4)).booleanValue ();
if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.info ("Queue[" + this.pt + "][" + this.scriptManager.scriptQueue.size () + "] scripts; running: " + script);
}this.scriptManager.scriptQueue.remove (0);
this.viewer.evalStringWaitStatusQueued (returnType, script, statusList, isScriptFile, isQuiet, true);
if (this.scriptManager.scriptQueue.size () == 0) {
return false;
}return true;
}, $fz.isPrivate = true, $fz));
});
