Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.script.ScriptFunction", "java.util.ArrayList"], "org.jmol.thread.ScriptParallelProcessor", ["java.util.concurrent.Executors", "org.jmol.script.ScriptProcess", "org.jmol.thread.ScriptProcessRunnable", "org.jmol.util.Logger", "org.jmol.viewer.ShapeManager", "$.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.counter = 0;
this.error = null;
this.lock = null;
this.processes = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "ScriptParallelProcessor", org.jmol.script.ScriptFunction);
Clazz.prepareFields (c$, function () {
this.lock =  new JavaObject ();
this.processes =  new java.util.ArrayList ();
});
c$.getExecutor = Clazz.defineMethod (c$, "getExecutor", 
function () {
return java.util.concurrent.Executors.newCachedThreadPool ();
});
Clazz.defineMethod (c$, "runAllProcesses", 
function (viewer, inParallel) {
if (this.processes.size () == 0) return;
this.viewer = viewer;
inParallel = new Boolean (inParallel & (!viewer.isParallel () && viewer.setParallel (true))).valueOf ();
var vShapeManagers =  new java.util.ArrayList ();
this.error = null;
this.counter = 0;
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("running " + this.processes.size () + " processes on " + org.jmol.viewer.Viewer.nProcessors + " processesors inParallel=" + inParallel);
this.counter = this.processes.size ();
for (var i = this.processes.size (); --i >= 0; ) {
var shapeManager = null;
if (inParallel) {
shapeManager =  new org.jmol.viewer.ShapeManager (viewer, viewer.getModelSet ());
vShapeManagers.add (shapeManager);
}this.runProcess (this.processes.remove (0), shapeManager);
}
{
while (this.counter > 0) {
try {
this.lock.wait ();
} catch (e) {
if (Clazz.exceptionOf (e, InterruptedException)) {
} else {
throw e;
}
}
if (this.error != null) throw this.error;
}
}this.mergeResults (vShapeManagers);
viewer.setParallel (false);
}, "org.jmol.viewer.Viewer,~B");
Clazz.defineMethod (c$, "mergeResults", 
function (vShapeManagers) {
try {
for (var i = 0; i < vShapeManagers.size (); i++) this.viewer.mergeShapes (vShapeManagers.get (i).getShapes ());

} catch (e) {
if (Clazz.exceptionOf (e, Error)) {
throw e;
} else {
throw e;
}
} finally {
this.counter = -1;
vShapeManagers = null;
}
}, "java.util.List");
Clazz.defineMethod (c$, "clearShapeManager", 
function (er) {
{
this.error = er;
this.notifyAll ();
}}, "Error");
Clazz.defineMethod (c$, "addProcess", 
function (name, context) {
this.processes.add ( new org.jmol.script.ScriptProcess (name, context));
}, "~S,org.jmol.script.ScriptContext");
Clazz.defineMethod (c$, "runProcess", 
($fz = function (process, shapeManager) {
var r =  new org.jmol.thread.ScriptProcessRunnable (this, process, this.lock, shapeManager);
var exec = (shapeManager == null ? null : this.viewer.getExecutor ());
if (exec != null) {
exec.execute (r);
} else {
r.run ();
}}, $fz.isPrivate = true, $fz), "org.jmol.script.ScriptProcess,org.jmol.viewer.ShapeManager");
Clazz.defineMethod (c$, "eval", 
function (context, shapeManager) {
this.viewer.eval (context, shapeManager);
}, "org.jmol.script.ScriptContext,org.jmol.viewer.ShapeManager");
});
