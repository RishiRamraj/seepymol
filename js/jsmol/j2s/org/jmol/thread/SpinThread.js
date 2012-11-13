Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.SpinThread", ["java.lang.Thread", "java.util.Date", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.transformManager = null;
this.viewer = null;
this.endDegrees = 0;
this.endPositions = null;
this.nDegrees = 0;
this.bsAtoms = null;
this.isNav = false;
this.$isGesture = false;
this.isReset = false;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "SpinThread", org.jmol.thread.JmolThread);
Clazz.defineMethod (c$, "isGesture", 
function () {
return this.$isGesture;
});
Clazz.makeConstructor (c$, 
function (transformManager, viewer, endDegrees, endPositions, bsAtoms, isNav, isGesture) {
Clazz.superConstructor (this, org.jmol.thread.SpinThread, []);
this.transformManager = transformManager;
this.viewer = viewer;
this.endDegrees = Math.abs (endDegrees);
this.endPositions = endPositions;
this.bsAtoms = bsAtoms;
this.isNav = isNav;
this.$isGesture = isGesture;
this.setMyName ("SpinThread" +  new java.util.Date ());
}, "org.jmol.viewer.TransformManager,org.jmol.viewer.Viewer,~N,java.util.List,org.jmol.util.BitSet,~B,~B");
Clazz.overrideMethod (c$, "run", 
function () {
var myFps = (this.isNav ? this.transformManager.navFps : this.transformManager.spinFps);
this.viewer.getGlobalSettings ().setParamB (this.isNav ? "_navigating" : "_spinning", true);
var i = 0;
var timeBegin = System.currentTimeMillis ();
var angle = 0;
var haveNotified = false;
while (!this.isInterrupted ()) {
if (this.isNav && myFps != this.transformManager.navFps) {
myFps = this.transformManager.navFps;
i = 0;
timeBegin = System.currentTimeMillis ();
} else if (!this.isNav && myFps != this.transformManager.spinFps && this.bsAtoms == null) {
myFps = this.transformManager.spinFps;
i = 0;
timeBegin = System.currentTimeMillis ();
}if (myFps == 0 || !(this.isNav ? this.transformManager.navOn : this.transformManager.spinOn)) {
this.transformManager.setSpinOn (false);
this.transformManager.setNavOn (false);
break;
}var navigatingSurface = this.viewer.getNavigateSurface ();
var refreshNeeded = (this.isNav ? (navigatingSurface || (this.transformManager.navX != 0 || this.transformManager.navY != 0)) || this.transformManager.navZ != 0 : this.transformManager.isSpinInternal && this.transformManager.internalRotationAxis.angle != 0 || this.transformManager.isSpinFixed && this.transformManager.fixedRotationAxis.angle != 0 || !this.transformManager.isSpinFixed && !this.transformManager.isSpinInternal && (this.transformManager.spinX != 0 || this.transformManager.spinY != 0 || this.transformManager.spinZ != 0));
++i;
var targetTime = Clazz.floatToInt (i * 1000 / myFps);
var currentTime = (System.currentTimeMillis () - timeBegin);
var sleepTime = (targetTime - currentTime);
if (sleepTime <= 0) {
if (!haveNotified) org.jmol.util.Logger.info ("spinFPS is set too fast (" + myFps + ") -- can't keep up!");
haveNotified = true;
} else {
var isInMotion = (this.bsAtoms == null && this.viewer.getInMotion ());
if (isInMotion) {
if (this.$isGesture) break;
sleepTime += 1000;
}try {
if (refreshNeeded && (this.transformManager.spinOn || this.transformManager.navOn) && !isInMotion) {
if (this.isNav) {
this.transformManager.setNavigationOffsetRelative (navigatingSurface);
} else if (this.transformManager.isSpinInternal || this.transformManager.isSpinFixed) {
angle = (this.transformManager.isSpinInternal ? this.transformManager.internalRotationAxis : this.transformManager.fixedRotationAxis).angle / myFps;
if (this.transformManager.isSpinInternal) {
this.transformManager.rotateAxisAngleRadiansInternal (angle, this.bsAtoms);
} else {
this.transformManager.rotateAxisAngleRadiansFixed (angle, this.bsAtoms);
}this.nDegrees += Math.abs (angle * 57.29577951308232);
} else {
if (this.transformManager.spinX != 0) {
this.transformManager.rotateXRadians (this.transformManager.spinX * 0.017453292 / myFps, null);
}if (this.transformManager.spinY != 0) {
this.transformManager.rotateYRadians (this.transformManager.spinY * 0.017453292 / myFps, null);
}if (this.transformManager.spinZ != 0) {
this.transformManager.rotateZRadians (this.transformManager.spinZ * 0.017453292 / myFps);
}}while (!this.isInterrupted () && !this.viewer.getRefreshing ()) {
Thread.sleep (10);
}
if (this.bsAtoms == null) this.viewer.refresh (1, "SpinThread:run()");
 else this.viewer.requestRepaintAndWait ();
if (!this.isNav && this.nDegrees >= this.endDegrees - 0.001) this.transformManager.setSpinOn (false);
}Thread.sleep (sleepTime);
if (this.isReset) break;
} catch (e) {
if (Clazz.exceptionOf (e, InterruptedException)) {
break;
} else {
throw e;
}
}
}}
if (this.bsAtoms != null && this.endPositions != null) {
this.viewer.setAtomCoord (this.bsAtoms, 1146095626, this.endPositions);
this.bsAtoms = null;
this.endPositions = null;
}if (!this.isReset) this.transformManager.setSpinOn (false);
});
Clazz.defineMethod (c$, "reset", 
function () {
this.isReset = true;
this.interrupt ();
});
});
