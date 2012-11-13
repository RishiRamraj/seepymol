Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.MinimizationThread", ["java.lang.Thread", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.minimizer = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "MinimizationThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (minimizer) {
Clazz.superConstructor (this, org.jmol.thread.MinimizationThread, []);
this.minimizer = minimizer;
this.setMyName ("MinimizationThread");
}, "org.jmol.api.MinimizerInterface");
Clazz.overrideMethod (c$, "run", 
function () {
var startTime = System.currentTimeMillis ();
var lastRepaintTime = startTime;
if (!this.minimizer.startMinimization ()) return;
try {
do {
var currentTime = System.currentTimeMillis ();
var elapsed = (currentTime - lastRepaintTime);
var sleepTime = 33 - elapsed;
if (sleepTime > 0) Thread.sleep (sleepTime);
lastRepaintTime = currentTime = System.currentTimeMillis ();
if (!this.minimizer.stepMinimization ()) this.minimizer.endMinimization ();
elapsed = (currentTime - startTime);
} while (this.minimizer.minimizationOn () && !this.isInterrupted ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (this.minimizer.minimizationOn ()) org.jmol.util.Logger.error (e.getMessage ());
} else {
throw e;
}
}
});
});
