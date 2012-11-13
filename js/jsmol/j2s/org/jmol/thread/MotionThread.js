Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread", "org.jmol.util.AxisAngle4f", "$.Matrix3f", "$.Vector3f"], "org.jmol.thread.MotionThread", ["java.lang.Float", "$.Thread", "org.jmol.util.Point3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.transformManager = null;
this.viewer = null;
this.aaStepCenter = null;
this.aaStepNavCenter = null;
this.aaStep = null;
this.aaTotal = null;
this.matrixStart = null;
this.matrixStartInv = null;
this.matrixStep = null;
this.matrixEnd = null;
this.center = null;
this.zoom = 0;
this.xTrans = 0;
this.yTrans = 0;
this.navCenter = null;
this.xNav = 0;
this.yNav = 0;
this.navDepth = 0;
this.ptMoveToCenter = null;
this.startRotationRadius = 0;
this.targetPixelScale = 0;
this.totalSteps = 0;
this.startPixelScale = 0;
this.targetRotationRadius = 0;
this.fps = 0;
this.rotationRadiusDelta = 0;
this.pixelScaleDelta = 0;
this.zoomStart = 0;
this.zoomDelta = 0;
this.xTransStart = 0;
this.xTransDelta = 0;
this.yTransStart = 0;
this.yTransDelta = 0;
this.xNavTransStart = 0;
this.xNavTransDelta = 0;
this.yNavTransDelta = 0;
this.yNavTransStart = 0;
this.navDepthStart = 0;
this.navDepthDelta = 0;
this.targetTime = 0;
this.frameTimeMillis = 0;
this.iStep = 0;
this.asThread = false;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "MotionThread", org.jmol.thread.JmolThread);
Clazz.prepareFields (c$, function () {
this.aaStepCenter =  new org.jmol.util.Vector3f ();
this.aaStepNavCenter =  new org.jmol.util.Vector3f ();
this.aaStep =  new org.jmol.util.AxisAngle4f ();
this.aaTotal =  new org.jmol.util.AxisAngle4f ();
this.matrixStart =  new org.jmol.util.Matrix3f ();
this.matrixStartInv =  new org.jmol.util.Matrix3f ();
this.matrixStep =  new org.jmol.util.Matrix3f ();
this.matrixEnd =  new org.jmol.util.Matrix3f ();
});
Clazz.makeConstructor (c$, 
function (transformManager, viewer) {
Clazz.superConstructor (this, org.jmol.thread.MotionThread, []);
this.transformManager = transformManager;
this.viewer = viewer;
}, "org.jmol.viewer.TransformManager,org.jmol.viewer.Viewer");
Clazz.defineMethod (c$, "startMotion", 
function (asThread) {
this.asThread = asThread;
if (asThread) this.start ();
 else this.run ();
}, "~B");
Clazz.overrideMethod (c$, "run", 
function () {
if (this.totalSteps > 0) this.viewer.setInMotion (true);
try {
if (this.totalSteps == 0 || this.startMotion ()) this.endMotion ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
if (this.totalSteps > 0) this.viewer.setInMotion (false);
this.transformManager.motion = null;
});
Clazz.defineMethod (c$, "sleepThread", 
($fz = function () {
if (System.currentTimeMillis () < this.targetTime) {
this.viewer.requestRepaintAndWait ();
if (this.transformManager.motion == null || !this.asThread && !this.viewer.isScriptExecuting ()) {
return false;
}var sleepTime = (this.targetTime - System.currentTimeMillis ());
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
return false;
} else {
throw ie;
}
}
}}return true;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "set", 
function (floatSecondsTotal, center, end, zoom, xTrans, yTrans, newRotationRadius, navCenter, xNav, yNav, navDepth) {
this.center = center;
this.matrixEnd.set (end);
this.zoom = zoom;
this.xTrans = xTrans;
this.yTrans = yTrans;
this.navCenter = navCenter;
this.xNav = xNav;
this.yNav = yNav;
this.navDepth = navDepth;
this.ptMoveToCenter = (center == null ? this.transformManager.fixedRotationCenter : center);
this.startRotationRadius = this.transformManager.modelRadius;
this.targetRotationRadius = (center == null || Float.isNaN (newRotationRadius) ? this.transformManager.modelRadius : newRotationRadius <= 0 ? this.viewer.calcRotationRadius (center) : newRotationRadius);
this.startPixelScale = this.transformManager.scaleDefaultPixelsPerAngstrom;
this.targetPixelScale = (center == null ? this.startPixelScale : this.transformManager.defaultScaleToScreen (this.targetRotationRadius));
if (Float.isNaN (zoom)) zoom = this.transformManager.zoomPercent;
this.transformManager.getRotation (this.matrixStart);
this.matrixStartInv.invertM (this.matrixStart);
this.matrixStep.mul2 (this.matrixEnd, this.matrixStartInv);
this.aaTotal.setM (this.matrixStep);
this.fps = 30;
this.totalSteps = Clazz.floatToInt (floatSecondsTotal * this.fps);
if (this.totalSteps == 0) return 0;
this.frameTimeMillis = Clazz.doubleToInt (1000 / this.fps);
this.targetTime = System.currentTimeMillis ();
this.zoomStart = this.transformManager.zoomPercent;
this.zoomDelta = zoom - this.zoomStart;
this.xTransStart = this.transformManager.getTranslationXPercent ();
this.xTransDelta = xTrans - this.xTransStart;
this.yTransStart = this.transformManager.getTranslationYPercent ();
this.yTransDelta = yTrans - this.yTransStart;
this.aaStepCenter.setT (this.ptMoveToCenter);
this.aaStepCenter.sub (this.transformManager.fixedRotationCenter);
this.aaStepCenter.scale (1 / this.totalSteps);
this.pixelScaleDelta = (this.targetPixelScale - this.startPixelScale);
this.rotationRadiusDelta = (this.targetRotationRadius - this.startRotationRadius);
if (navCenter != null && this.transformManager.mode == 1) {
this.aaStepNavCenter.setT (navCenter);
this.aaStepNavCenter.sub (this.transformManager.navigationCenter);
this.aaStepNavCenter.scale (1 / this.totalSteps);
}var xNavTransStart = this.transformManager.getNavigationOffsetPercent ('X');
this.xNavTransDelta = xNav - xNavTransStart;
this.yNavTransStart = this.transformManager.getNavigationOffsetPercent ('Y');
this.yNavTransDelta = yNav - this.yNavTransStart;
var navDepthStart = this.transformManager.getNavigationDepthPercent ();
this.navDepthDelta = navDepth - navDepthStart;
return this.totalSteps;
}, "~N,org.jmol.util.Point3f,org.jmol.util.Matrix3f,~N,~N,~N,~N,org.jmol.util.Point3f,~N,~N,~N");
Clazz.defineMethod (c$, "startMotion", 
function () {
for (; this.iStep < this.totalSteps; ++this.iStep) {
if (!Float.isNaN (this.matrixEnd.m00)) {
this.transformManager.getRotation (this.matrixStart);
this.matrixStartInv.invertM (this.matrixStart);
this.matrixStep.mul2 (this.matrixEnd, this.matrixStartInv);
this.aaTotal.setM (this.matrixStep);
this.aaStep.setAA (this.aaTotal);
this.aaStep.angle /= (this.totalSteps - this.iStep);
if (this.aaStep.angle == 0) this.matrixStep.setIdentity ();
 else this.matrixStep.setAA (this.aaStep);
this.matrixStep.mul (this.matrixStart);
}var fStep = this.iStep / (this.totalSteps - 1);
this.transformManager.modelRadius = this.startRotationRadius + this.rotationRadiusDelta * fStep;
this.transformManager.scaleDefaultPixelsPerAngstrom = this.startPixelScale + this.pixelScaleDelta * fStep;
if (!Float.isNaN (this.xTrans)) {
this.transformManager.zoomToPercent (this.zoomStart + this.zoomDelta * fStep);
this.transformManager.translateToPercent ('x', this.xTransStart + this.xTransDelta * fStep);
this.transformManager.translateToPercent ('y', this.yTransStart + this.yTransDelta * fStep);
}this.transformManager.setRotation (this.matrixStep);
if (this.center != null) this.transformManager.fixedRotationCenter.add (this.aaStepCenter);
if (this.navCenter != null && this.transformManager.mode == 1) {
var pt = org.jmol.util.Point3f.newP (this.transformManager.navigationCenter);
pt.add (this.aaStepNavCenter);
this.transformManager.navigatePt (0, pt);
if (!Float.isNaN (this.xNav) && !Float.isNaN (this.yNav)) this.transformManager.navTranslatePercent (0, this.xNavTransStart + this.xNavTransDelta * fStep, this.yNavTransStart + this.yNavTransDelta * fStep);
if (!Float.isNaN (this.navDepth)) this.transformManager.setNavigationDepthPercent (0, this.navDepthStart + this.navDepthDelta * fStep);
}this.targetTime += this.frameTimeMillis;
if (!this.sleepThread ()) return false;
}
return true;
});
Clazz.defineMethod (c$, "endMotion", 
function () {
this.transformManager.setRotationRadius (this.targetRotationRadius, true);
this.transformManager.scaleDefaultPixelsPerAngstrom = this.targetPixelScale;
if (this.center != null) this.transformManager.moveRotationCenter (this.center, !this.transformManager.windowCentered);
if (!Float.isNaN (this.xTrans)) {
this.transformManager.zoomToPercent (this.zoom);
this.transformManager.translateToPercent ('x', this.xTrans);
this.transformManager.translateToPercent ('y', this.yTrans);
}this.transformManager.setRotation (this.matrixEnd);
if (this.navCenter != null && this.transformManager.mode == 1) {
this.transformManager.navigationCenter.setT (this.navCenter);
if (!Float.isNaN (this.xNav) && !Float.isNaN (this.yNav)) this.transformManager.navTranslatePercent (0, this.xNav, this.yNav);
if (!Float.isNaN (this.navDepth)) this.transformManager.setNavigationDepthPercent (0, this.navDepth);
}});
});
