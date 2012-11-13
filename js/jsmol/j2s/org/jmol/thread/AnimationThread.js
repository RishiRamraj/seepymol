Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.AnimationThread", ["java.lang.Thread", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.animationManager = null;
this.viewer = null;
this.framePointer = 0;
this.framePointer2 = 0;
this.intThread = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "AnimationThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (animationManager, viewer, framePointer, framePointer2, intAnimThread) {
Clazz.superConstructor (this, org.jmol.thread.AnimationThread, []);
this.animationManager = animationManager;
this.viewer = viewer;
this.framePointer = framePointer;
this.framePointer2 = framePointer2;
this.setMyName ("AnimationThread");
this.intThread = intAnimThread;
}, "org.jmol.viewer.AnimationManager,org.jmol.viewer.Viewer,~N,~N,~N");
Clazz.overrideMethod (c$, "run", 
function () {
var timeBegin = System.currentTimeMillis ();
var targetTime = 0;
var sleepTime;
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("animation thread " + this.intThread + " running");
this.viewer.requestRepaintAndWait ();
try {
sleepTime = targetTime - (System.currentTimeMillis () - timeBegin);
if (sleepTime > 0) Thread.sleep (sleepTime);
var isFirst = true;
while (!this.isInterrupted () && this.animationManager.$animationOn) {
if (this.animationManager.currentModelIndex == this.framePointer) {
targetTime += this.animationManager.firstFrameDelayMs;
sleepTime = targetTime - (System.currentTimeMillis () - timeBegin);
if (sleepTime > 0) Thread.sleep (sleepTime);
}if (this.animationManager.currentModelIndex == this.framePointer2) {
targetTime += this.animationManager.lastFrameDelayMs;
sleepTime = targetTime - (System.currentTimeMillis () - timeBegin);
if (sleepTime > 0) Thread.sleep (sleepTime);
}if (!isFirst && this.animationManager.lastModelPainted == this.animationManager.currentModelIndex && !this.animationManager.setAnimationNext ()) {
org.jmol.util.Logger.debug ("animation thread " + this.intThread + " exiting");
this.animationManager.setAnimationOff (false);
return;
}isFirst = false;
targetTime += Clazz.floatToInt ((1000 / this.animationManager.animationFps) + this.viewer.getFrameDelayMs (this.animationManager.currentModelIndex));
sleepTime = targetTime - (System.currentTimeMillis () - timeBegin);
while (!this.isInterrupted () && this.animationManager.$animationOn && !this.viewer.getRefreshing ()) {
Thread.sleep (10);
}
if (!this.viewer.getSpinOn ()) this.viewer.refresh (1, "animationThread");
sleepTime = targetTime - (System.currentTimeMillis () - timeBegin);
if (sleepTime > 0) Thread.sleep (sleepTime);
}
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
org.jmol.util.Logger.debug ("animation thread interrupted!");
try {
this.animationManager.setAnimationOn (false);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
} else {
throw ie;
}
}
});
});
