Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.VibrationThread", ["java.lang.Thread"], function () {
c$ = Clazz.decorateAsClass (function () {
this.transformManager = null;
this.viewer = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "VibrationThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (transformManager, viewer) {
Clazz.superConstructor (this, org.jmol.thread.VibrationThread, []);
this.transformManager = transformManager;
this.viewer = viewer;
this.setMyName ("VibrationThread");
}, "org.jmol.viewer.TransformManager,org.jmol.viewer.Viewer");
Clazz.overrideMethod (c$, "run", 
function () {
var startTime = System.currentTimeMillis ();
var lastRepaintTime = startTime;
try {
do {
var currentTime = System.currentTimeMillis ();
var elapsed = (currentTime - lastRepaintTime);
var sleepTime = 33 - elapsed;
if (sleepTime > 0) Thread.sleep (sleepTime);
lastRepaintTime = currentTime = System.currentTimeMillis ();
elapsed = (currentTime - startTime);
var t = (elapsed % this.transformManager.vibrationPeriodMs) / this.transformManager.vibrationPeriodMs;
this.transformManager.setVibrationT (t);
this.viewer.refresh (3, "VibrationThread:run()");
} while (!this.isInterrupted ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
});
});
