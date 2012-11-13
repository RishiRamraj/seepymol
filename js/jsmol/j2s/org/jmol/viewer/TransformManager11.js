Clazz.declarePackage ("org.jmol.viewer");
Clazz.load (["org.jmol.viewer.TransformManager"], "org.jmol.viewer.TransformManager11", ["java.lang.Float", "$.Thread", "org.jmol.util.Escape", "$.Hermite", "$.Logger", "$.Point3f", "$.Vector3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.navigationSlabOffset = 0;
this.zoomFactor = 3.4028235E38;
this.navMode = 1;
this.navigationDepth = 0;
this.nHits = 0;
this.multiplier = 1;
this.ptMoveToCenter = null;
Clazz.instantialize (this, arguments);
}, org.jmol.viewer, "TransformManager11", org.jmol.viewer.TransformManager);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.viewer.TransformManager11);
this.setNavFps (10);
});
Clazz.makeConstructor (c$, 
function (viewer) {
Clazz.superConstructor (this, org.jmol.viewer.TransformManager11, [viewer]);
this.setNavFps (10);
}, "org.jmol.viewer.Viewer");
Clazz.overrideMethod (c$, "setNavFps", 
function (navFps) {
this.navFps = navFps;
}, "~N");
Clazz.makeConstructor (c$, 
function (viewer, width, height) {
Clazz.superConstructor (this, org.jmol.viewer.TransformManager11, [viewer, width, height]);
this.setNavFps (10);
}, "org.jmol.viewer.Viewer,~N,~N");
Clazz.defineMethod (c$, "zoomByFactor", 
function (factor, x, y) {
if (!this.zoomEnabled || factor <= 0 || this.mode != 1) {
Clazz.superCall (this, org.jmol.viewer.TransformManager11, "zoomByFactor", [factor, x, y]);
return;
}if (this.navZ > 0) {
this.navZ /= factor;
if (this.navZ < 5) this.navZ = -5;
 else if (this.navZ > 200) this.navZ = 200;
} else if (this.navZ == 0) {
this.navZ = (factor < 1 ? 5 : -5);
} else {
this.navZ *= factor;
if (this.navZ > -5) this.navZ = 5;
 else if (this.navZ < -200) this.navZ = -200;
}}, "~N,~N,~N");
Clazz.overrideMethod (c$, "calcCameraFactors", 
function () {
if (Float.isNaN (this.cameraDepth)) {
this.cameraDepth = this.cameraDepthSetting;
this.zoomFactor = 3.4028235E38;
}this.cameraDistance = this.cameraDepth * this.screenPixelCount;
this.referencePlaneOffset = this.cameraDistance + this.screenPixelCount / 2;
this.scalePixelsPerAngstrom = (this.scale3D && !this.perspectiveDepth && this.mode != 1 ? 72 / this.scale3DAngstromsPerInch * (this.antialias ? 2 : 1) : this.screenPixelCount / this.visualRange);
this.modelRadiusPixels = this.modelRadius * this.scalePixelsPerAngstrom;
var offset100 = (2 * this.modelRadius) / this.visualRange * this.referencePlaneOffset;
if (this.mode != 1) {
this.zoomFactor = 3.4028235E38;
this.modelCenterOffset = this.referencePlaneOffset;
if (!this.scale3D || this.perspectiveDepth) this.scalePixelsPerAngstrom *= (this.modelCenterOffset / offset100) * this.zoomPercent / 100;
this.modelRadiusPixels = this.modelRadius * this.scalePixelsPerAngstrom;
return;
}if (this.zoomFactor == 3.4028235E38) {
if (this.zoomPercent > 10000) this.zoomPercent = 10000;
this.modelCenterOffset = offset100 * 100 / this.zoomPercent;
} else if (this.prevZoomSetting != this.zoomPercentSetting) {
if (this.zoomRatio == 0) this.modelCenterOffset = offset100 * 100 / this.zoomPercentSetting;
 else this.modelCenterOffset += (1 - this.zoomRatio) * this.referencePlaneOffset;
this.navMode = -1;
}this.prevZoomSetting = this.zoomPercentSetting;
this.zoomFactor = this.modelCenterOffset / this.referencePlaneOffset;
this.zoomPercent = (this.zoomFactor == 0 ? 10000 : offset100 / this.modelCenterOffset * 100);
});
Clazz.overrideMethod (c$, "getPerspectiveFactor", 
function (z) {
return (z <= 0 ? this.referencePlaneOffset : this.referencePlaneOffset / z);
}, "~N");
Clazz.overrideMethod (c$, "adjustTemporaryScreenPoint", 
function () {
var z = this.point3fScreenTemp.z;
if (Float.isNaN (z)) {
if (!this.haveNotifiedNaN) org.jmol.util.Logger.debug ("NaN seen in TransformPoint");
this.haveNotifiedNaN = true;
z = 1;
} else if (z <= 0) {
z = 1;
}this.point3fScreenTemp.z = z;
switch (this.mode) {
case 1:
this.point3fScreenTemp.x -= this.navigationShiftXY.x;
this.point3fScreenTemp.y -= this.navigationShiftXY.y;
break;
case 2:
this.point3fScreenTemp.x -= this.perspectiveShiftXY.x;
this.point3fScreenTemp.y -= this.perspectiveShiftXY.y;
break;
}
if (this.perspectiveDepth) {
var factor = this.getPerspectiveFactor (z);
this.point3fScreenTemp.x *= factor;
this.point3fScreenTemp.y *= factor;
}switch (this.mode) {
case 1:
this.point3fScreenTemp.x += this.navigationOffset.x;
this.point3fScreenTemp.y += this.navigationOffset.y;
break;
case 2:
this.point3fScreenTemp.x += this.perspectiveOffset.x;
this.point3fScreenTemp.y += this.perspectiveOffset.y;
break;
case 0:
this.point3fScreenTemp.x += this.fixedRotationOffset.x;
this.point3fScreenTemp.y += this.fixedRotationOffset.y;
break;
}
if (Float.isNaN (this.point3fScreenTemp.x) && !this.haveNotifiedNaN) {
org.jmol.util.Logger.debug ("NaN found in transformPoint ");
this.haveNotifiedNaN = true;
}this.point3iScreenTemp.set (Clazz.floatToInt (this.point3fScreenTemp.x), Clazz.floatToInt (this.point3fScreenTemp.y), Clazz.floatToInt (this.point3fScreenTemp.z));
});
Clazz.defineMethod (c$, "setScreenParameters", 
function (screenWidth, screenHeight, useZoomLarge, antialias, resetSlab, resetZoom) {
var pt = (this.mode == 1 ? org.jmol.util.Point3f.newP (this.navigationCenter) : null);
var ptoff = org.jmol.util.Point3f.newP (this.navigationOffset);
ptoff.x = ptoff.x / this.width;
ptoff.y = ptoff.y / this.height;
Clazz.superCall (this, org.jmol.viewer.TransformManager11, "setScreenParameters", [screenWidth, screenHeight, useZoomLarge, antialias, resetSlab, resetZoom]);
if (pt != null) {
this.navigationCenter.setT (pt);
this.navTranslatePercent (-1, ptoff.x * this.width, ptoff.y * this.height);
this.navigatePt (0, pt);
}}, "~N,~N,~B,~B,~B,~B");
Clazz.overrideMethod (c$, "calcNavigationPoint", 
function () {
this.calcNavigationDepthPercent ();
if (!this.navigating && this.navMode != 1) {
if (this.navigationDepth < 100 && this.navigationDepth > 0 && !Float.isNaN (this.previousX) && this.previousX == this.fixedTranslation.x && this.previousY == this.fixedTranslation.y && this.navMode != -1) this.navMode = 3;
 else this.navMode = 0;
}switch (this.navMode) {
case 1:
this.navigationOffset.set (this.width / 2, this.getNavPtHeight (), this.referencePlaneOffset);
this.zoomFactor = 3.4028235E38;
this.calcCameraFactors ();
this.calcTransformMatrix ();
this.newNavigationCenter ();
break;
case 0:
case -1:
this.fixedRotationOffset.setT (this.fixedTranslation);
this.newNavigationCenter ();
break;
case 2:
this.newNavigationCenter ();
break;
case -2:
case 3:
var pt1 =  new org.jmol.util.Point3f ();
this.matrixTransform.transform2 (this.navigationCenter, pt1);
var z = pt1.z;
this.matrixTransform.transform2 (this.fixedRotationCenter, pt1);
this.modelCenterOffset = this.referencePlaneOffset + (pt1.z - z);
this.calcCameraFactors ();
this.calcTransformMatrix ();
break;
case 4:
this.navigationOffset.z = this.referencePlaneOffset;
this.unTransformPoint (this.navigationOffset, this.navigationCenter);
break;
}
this.matrixTransform.transform2 (this.navigationCenter, this.navigationShiftXY);
if (this.viewer.getNavigationPeriodic ()) {
var pt = org.jmol.util.Point3f.newP (this.navigationCenter);
this.viewer.toUnitCell (this.navigationCenter, null);
if (pt.distance (this.navigationCenter) > 0.01) {
this.matrixTransform.transform2 (this.navigationCenter, pt);
var dz = this.navigationShiftXY.z - pt.z;
this.modelCenterOffset += dz;
this.calcCameraFactors ();
this.calcTransformMatrix ();
this.matrixTransform.transform2 (this.navigationCenter, this.navigationShiftXY);
}}this.transformPoint2 (this.fixedRotationCenter, this.fixedTranslation);
this.fixedRotationOffset.setT (this.fixedTranslation);
this.previousX = this.fixedTranslation.x;
this.previousY = this.fixedTranslation.y;
this.transformPoint2 (this.navigationCenter, this.navigationOffset);
this.navigationOffset.z = this.referencePlaneOffset;
this.navMode = 0;
this.calcNavSlabAndDepthValues ();
});
Clazz.defineMethod (c$, "getNavPtHeight", 
($fz = function () {
var navigateSurface = this.viewer.getNavigateSurface ();
return this.height / (navigateSurface ? 1 : 2);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "calcNavSlabAndDepthValues", 
function () {
this.calcSlabAndDepthValues ();
if (this.slabEnabled) {
this.slabValue = (this.mode == 1 ? -100 : 0) + Clazz.floatToInt (this.referencePlaneOffset - this.navigationSlabOffset);
if (this.zSlabPercentSetting == this.zDepthPercentSetting) this.zSlabValue = this.slabValue;
}if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("\n\nperspectiveScale: " + this.referencePlaneOffset + " screenPixelCount: " + this.screenPixelCount + "\nmodelTrailingEdge: " + (this.modelCenterOffset + this.modelRadiusPixels) + " depthValue: " + this.depthValue + "\nmodelCenterOffset: " + this.modelCenterOffset + " modelRadiusPixels: " + this.modelRadiusPixels + "\nmodelLeadingEdge: " + (this.modelCenterOffset - this.modelRadiusPixels) + " slabValue: " + this.slabValue + "\nzoom: " + this.zoomPercent + " navDepth: " + (Clazz.floatToInt (100 * this.getNavigationDepthPercent ()) / 100) + " visualRange: " + this.visualRange + "\nnavX/Y/Z/modelCenterOffset: " + this.navigationOffset.x + "/" + this.navigationOffset.y + "/" + this.navigationOffset.z + "/" + this.modelCenterOffset + " navCenter:" + this.navigationCenter);
});
Clazz.defineMethod (c$, "newNavigationCenter", 
($fz = function () {
this.mode = this.defaultMode;
var pt =  new org.jmol.util.Point3f ();
this.transformPoint2 (this.fixedRotationCenter, pt);
pt.x -= this.navigationOffset.x;
pt.y -= this.navigationOffset.y;
var f = -this.getPerspectiveFactor (pt.z);
pt.x /= f;
pt.y /= f;
pt.z = this.referencePlaneOffset;
this.matrixTransformInv.transform2 (pt, this.navigationCenter);
this.mode = 1;
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "canNavigate", 
function () {
return true;
});
Clazz.overrideMethod (c$, "resetNavigationPoint", 
function (doResetSlab) {
if (this.zoomPercent < 5 && this.mode != 1) {
this.perspectiveDepth = true;
this.mode = 1;
return;
}if (this.mode == 1) {
this.navMode = 1;
this.slabPercentSetting = 0;
this.perspectiveDepth = true;
} else if (doResetSlab) {
this.slabPercentSetting = 100;
}this.viewer.setFloatProperty ("slabRange", 0);
if (doResetSlab) {
this.slabEnabled = (this.mode == 1);
}this.zoomFactor = 3.4028235E38;
this.zoomPercentSetting = this.zoomPercent;
}, "~B");
Clazz.overrideMethod (c$, "setNavigationOffsetRelative", 
function (navigatingSurface) {
if (navigatingSurface) {
this.navigateSurface (2147483647);
return;
}if (this.navigationDepth < 0 && this.navZ > 0 || this.navigationDepth > 100 && this.navZ < 0) {
this.navZ = 0;
}this.rotateXRadians (0.017453292 * -0.02 * this.navY, null);
this.rotateYRadians (0.017453292 * .02 * this.navX, null);
var pt = this.getNavigationCenter ();
var pts =  new org.jmol.util.Point3f ();
this.transformPoint2 (pt, pts);
pts.z += this.navZ;
this.unTransformPoint (pts, pt);
this.navigatePt (0, pt);
}, "~B");
Clazz.defineMethod (c$, "navigate", 
function (keyCode, modifiers) {
var key = null;
var value = 0;
if (this.mode != 1) return;
if (keyCode == 0) {
this.nHits = 0;
this.multiplier = 1;
if (!this.navigating) return;
this.navigating = false;
return;
}this.nHits++;
if (this.nHits % 10 == 0) this.multiplier *= (this.multiplier == 4 ? 1 : 2);
var navigateSurface = this.viewer.getNavigateSurface ();
var isShiftKey = ((modifiers & 1) > 0);
var isAltKey = ((modifiers & 8) > 0);
var isCtrlKey = ((modifiers & 2) > 0);
var speed = this.viewer.getNavigationSpeed () * (isCtrlKey ? 10 : 1);
switch (keyCode) {
case 46:
this.navX = this.navY = this.navZ = 0;
this.homePosition (true);
return;
case 32:
if (!this.navOn) return;
this.navX = this.navY = this.navZ = 0;
return;
case 38:
if (this.navOn) {
if (isAltKey) {
this.navY += this.multiplier;
value = this.navY;
key = "navY";
} else {
this.navZ += this.multiplier;
value = this.navZ;
key = "navZ";
}break;
}if (navigateSurface) {
this.navigateSurface (2147483647);
break;
}if (isShiftKey) {
this.navigationOffset.y -= 2 * this.multiplier;
this.navMode = 2;
break;
}if (isAltKey) {
this.rotateXRadians (0.017453292 * -0.2 * this.multiplier, null);
this.navMode = 3;
break;
}this.modelCenterOffset -= speed * (this.viewer.getNavigationPeriodic () ? 1 : this.multiplier);
this.navMode = 4;
break;
case 40:
if (this.navOn) {
if (isAltKey) {
this.navY -= this.multiplier;
value = this.navY;
key = "navY";
} else {
this.navZ -= this.multiplier;
value = this.navZ;
key = "navZ";
}break;
}if (navigateSurface) {
this.navigateSurface (-2 * this.multiplier);
break;
}if (isShiftKey) {
this.navigationOffset.y += 2 * this.multiplier;
this.navMode = 2;
break;
}if (isAltKey) {
this.rotateXRadians (0.017453292 * .2 * this.multiplier, null);
this.navMode = 3;
break;
}this.modelCenterOffset += speed * (this.viewer.getNavigationPeriodic () ? 1 : this.multiplier);
this.navMode = 4;
break;
case 37:
if (this.navOn) {
this.navX -= this.multiplier;
value = this.navX;
key = "navX";
break;
}if (navigateSurface) {
break;
}if (isShiftKey) {
this.navigationOffset.x -= 2 * this.multiplier;
this.navMode = 2;
break;
}this.rotateYRadians (0.017453292 * 3 * -0.2 * this.multiplier, null);
this.navMode = 3;
break;
case 39:
if (this.navOn) {
this.navX += this.multiplier;
value = this.navX;
key = "navX";
break;
}if (navigateSurface) {
break;
}if (isShiftKey) {
this.navigationOffset.x += 2 * this.multiplier;
this.navMode = 2;
break;
}this.rotateYRadians (0.017453292 * 3 * .2 * this.multiplier, null);
this.navMode = 3;
break;
default:
this.navigating = false;
this.navMode = 0;
return;
}
if (key != null) this.viewer.getGlobalSettings ().setParamF (key, value);
this.navigating = true;
this.finalizeTransformParameters ();
}, "~N,~N");
Clazz.defineMethod (c$, "navigateSurface", 
($fz = function (dz) {
if (this.viewer.isRepaintPending ()) return;
this.viewer.setShapeProperty (23, "navigate", Integer.$valueOf (dz == 2147483647 ? 2 * this.multiplier : dz));
this.viewer.requestRepaintAndWait ();
}, $fz.isPrivate = true, $fz), "~N");
Clazz.overrideMethod (c$, "navigatePt", 
function (seconds, pt) {
if (seconds > 0) {
this.navigateTo (seconds, null, NaN, pt, NaN, NaN, NaN);
return;
}this.navigationCenter.setT (pt);
this.navMode = 3;
this.navigating = true;
this.finalizeTransformParameters ();
this.navigating = false;
}, "~N,org.jmol.util.Point3f");
Clazz.overrideMethod (c$, "navigateAxis", 
function (seconds, rotAxis, degrees) {
if (degrees == 0) return;
if (seconds > 0) {
this.navigateTo (seconds, rotAxis, degrees, null, NaN, NaN, NaN);
return;
}this.rotateAxisAngle (rotAxis, (degrees / 57.29577951308232));
this.navMode = 3;
this.navigating = true;
this.finalizeTransformParameters ();
this.navigating = false;
}, "~N,org.jmol.util.Vector3f,~N");
Clazz.defineMethod (c$, "setNavigationDepthPercent", 
function (timeSec, percent) {
if (timeSec > 0) {
this.navigateTo (timeSec, null, NaN, null, percent, NaN, NaN);
return;
}this.setNavigationDepthPercent (percent);
}, "~N,~N");
Clazz.overrideMethod (c$, "navTranslate", 
function (seconds, pt) {
var pt1 =  new org.jmol.util.Point3f ();
this.transformPoint2 (pt, pt1);
if (seconds > 0) {
this.navigateTo (seconds, null, NaN, null, NaN, pt1.x, pt1.y);
return;
}this.navTranslatePercent (-1, pt1.x, pt1.y);
}, "~N,org.jmol.util.Point3f");
Clazz.overrideMethod (c$, "navTranslatePercent", 
function (seconds, x, y) {
this.transformPoint2 (this.navigationCenter, this.navigationOffset);
if (seconds >= 0) {
if (!Float.isNaN (x)) x = this.width * x / 100 + (Float.isNaN (y) ? this.navigationOffset.x : (this.width / 2));
if (!Float.isNaN (y)) y = this.height * y / 100 + (Float.isNaN (x) ? this.navigationOffset.y : this.getNavPtHeight ());
}if (seconds > 0) {
this.navigateTo (seconds, null, NaN, null, NaN, x, y);
return;
}if (!Float.isNaN (x)) this.navigationOffset.x = x;
if (!Float.isNaN (y)) this.navigationOffset.y = y;
this.navMode = 2;
this.navigating = true;
this.finalizeTransformParameters ();
this.navigating = false;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "navigateTo", 
($fz = function (floatSecondsTotal, axis, degrees, center, depthPercent, xTrans, yTrans) {
if (!this.viewer.haveDisplay) floatSecondsTotal = 0;
this.ptMoveToCenter = (center == null ? this.navigationCenter : center);
var fps = 30;
var totalSteps = Clazz.floatToInt (floatSecondsTotal * fps);
if (floatSecondsTotal > 0) this.viewer.setInMotion (true);
if (degrees == 0) degrees = NaN;
if (totalSteps > 1) {
var frameTimeMillis = Clazz.doubleToInt (1000 / fps);
var targetTime = System.currentTimeMillis ();
var depthStart = this.getNavigationDepthPercent ();
var depthDelta = depthPercent - depthStart;
var xTransStart = this.navigationOffset.x;
var xTransDelta = xTrans - xTransStart;
var yTransStart = this.navigationOffset.y;
var yTransDelta = yTrans - yTransStart;
var degreeStep = degrees / totalSteps;
var aaStepCenter =  new org.jmol.util.Vector3f ();
aaStepCenter.setT (this.ptMoveToCenter);
aaStepCenter.sub (this.navigationCenter);
aaStepCenter.scale (1 / totalSteps);
var centerStart = org.jmol.util.Point3f.newP (this.navigationCenter);
for (var iStep = 1; iStep < totalSteps; ++iStep) {
this.navigating = true;
var fStep = iStep / (totalSteps - 1);
if (!Float.isNaN (degrees)) this.navigateAxis (0, axis, degreeStep);
if (center != null) {
centerStart.add (aaStepCenter);
this.navigatePt (0, centerStart);
}if (!Float.isNaN (xTrans) || !Float.isNaN (yTrans)) {
var x = NaN;
var y = NaN;
if (!Float.isNaN (xTrans)) x = xTransStart + xTransDelta * fStep;
if (!Float.isNaN (yTrans)) y = yTransStart + yTransDelta * fStep;
this.navTranslatePercent (-1, x, y);
}if (!Float.isNaN (depthPercent)) {
this.setNavigationDepthPercent (depthStart + depthDelta * fStep);
}this.navigating = false;
targetTime += frameTimeMillis;
if (System.currentTimeMillis () < targetTime) {
this.viewer.requestRepaintAndWait ();
if (!this.viewer.isScriptExecuting ()) return;
var sleepTime = (targetTime - System.currentTimeMillis ());
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
return;
} else {
throw ie;
}
}
}}}
} else {
var sleepTime = Clazz.floatToInt (floatSecondsTotal * 1000) - 30;
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
} else {
throw ie;
}
}
}}if (!Float.isNaN (xTrans) || !Float.isNaN (yTrans)) this.navTranslatePercent (-1, xTrans, yTrans);
if (!Float.isNaN (depthPercent)) this.setNavigationDepthPercent (depthPercent);
this.viewer.setInMotion (false);
}, $fz.isPrivate = true, $fz), "~N,org.jmol.util.Vector3f,~N,org.jmol.util.Point3f,~N,~N,~N");
Clazz.overrideMethod (c$, "navigateGuide", 
function (seconds, pathGuide) {
this.navigate (seconds, pathGuide, null, null, 0, 2147483647);
}, "~N,~A");
Clazz.overrideMethod (c$, "navigatePath", 
function (seconds, path, theta, indexStart, indexEnd) {
this.navigate (seconds, null, path, theta, indexStart, indexEnd);
}, "~N,~A,~A,~N,~N");
Clazz.defineMethod (c$, "navigate", 
($fz = function (seconds, pathGuide, path, theta, indexStart, indexEnd) {
if (seconds <= 0) seconds = 2;
if (!this.viewer.haveDisplay) seconds = 0;
var isPathGuide = (pathGuide != null);
var nSegments = Math.min ((isPathGuide ? pathGuide.length : path.length) - 1, indexEnd);
if (!isPathGuide) while (nSegments > 0 && path[nSegments] == null) nSegments--;

nSegments -= indexStart;
if (nSegments < 1) return;
var nPer = Clazz.doubleToInt (Math.floor (10 * seconds));
var nSteps = nSegments * nPer + 1;
var points =  new Array (nSteps + 2);
var pointGuides =  new Array (isPathGuide ? nSteps + 2 : 0);
var iPrev;
var iNext;
var iNext2;
var iNext3;
var pt;
for (var i = 0; i < nSegments; i++) {
iPrev = Math.max (i - 1, 0) + indexStart;
pt = i + indexStart;
iNext = Math.min (i + 1, nSegments) + indexStart;
iNext2 = Math.min (i + 2, nSegments) + indexStart;
iNext3 = Math.min (i + 3, nSegments) + indexStart;
if (isPathGuide) {
org.jmol.util.Hermite.getHermiteList (7, pathGuide[iPrev][0], pathGuide[pt][0], pathGuide[iNext][0], pathGuide[iNext2][0], pathGuide[iNext3][0], points, i * nPer, nPer + 1, true);
org.jmol.util.Hermite.getHermiteList (7, pathGuide[iPrev][1], pathGuide[pt][1], pathGuide[iNext][1], pathGuide[iNext2][1], pathGuide[iNext3][1], pointGuides, i * nPer, nPer + 1, true);
} else {
org.jmol.util.Hermite.getHermiteList (7, path[iPrev], path[pt], path[iNext], path[iNext2], path[iNext3], points, i * nPer, nPer + 1, true);
}}
var totalSteps = nSteps;
this.viewer.setInMotion (true);
var frameTimeMillis = Clazz.floatToInt (1000 / this.navFps);
var targetTime = System.currentTimeMillis ();
for (var iStep = 0; iStep < totalSteps; ++iStep) {
this.navigatePt (0, points[iStep]);
if (isPathGuide) {
this.alignZX (points[iStep], points[iStep + 1], pointGuides[iStep]);
}targetTime += frameTimeMillis;
if (System.currentTimeMillis () < targetTime) {
this.viewer.requestRepaintAndWait ();
if (!this.viewer.isScriptExecuting ()) return;
var sleepTime = (targetTime - System.currentTimeMillis ());
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
return;
} else {
throw ie;
}
}
}}}
}, $fz.isPrivate = true, $fz), "~N,~A,~A,~A,~N,~N");
Clazz.defineMethod (c$, "navigateSurface", 
function (timeSeconds, name) {
}, "~N,~S");
Clazz.defineMethod (c$, "alignZX", 
function (pt0, pt1, ptVectorWing) {
var pt0s =  new org.jmol.util.Point3f ();
var pt1s =  new org.jmol.util.Point3f ();
this.matrixRotate.transform2 (pt0, pt0s);
this.matrixRotate.transform2 (pt1, pt1s);
var vPath = org.jmol.util.Vector3f.newV (pt0s);
vPath.sub (pt1s);
var v = org.jmol.util.Vector3f.new3 (0, 0, 1);
var angle = vPath.angle (v);
v.cross (vPath, v);
if (angle != 0) this.navigateAxis (0, v, (angle * 57.29577951308232));
this.matrixRotate.transform2 (pt0, pt0s);
var pt2 = org.jmol.util.Point3f.newP (ptVectorWing);
pt2.add (pt0);
var pt2s =  new org.jmol.util.Point3f ();
this.matrixRotate.transform2 (pt2, pt2s);
vPath.setT (pt2s);
vPath.sub (pt0s);
vPath.z = 0;
v.set (-1, 0, 0);
angle = vPath.angle (v);
if (vPath.y < 0) angle = -angle;
v.set (0, 0, 1);
if (angle != 0) this.navigateAxis (0, v, (angle * 57.29577951308232));
if (this.viewer.getNavigateSurface ()) {
v.set (1, 0, 0);
this.navigateAxis (0, v, 20);
}this.matrixRotate.transform2 (pt0, pt0s);
this.matrixRotate.transform2 (pt1, pt1s);
this.matrixRotate.transform2 (ptVectorWing, pt2s);
}, "org.jmol.util.Point3f,org.jmol.util.Point3f,org.jmol.util.Point3f");
Clazz.overrideMethod (c$, "getNavigationCenter", 
function () {
return this.navigationCenter;
});
Clazz.overrideMethod (c$, "getNavigationDepthPercent", 
function () {
return this.navigationDepth;
});
Clazz.overrideMethod (c$, "setNavigationSlabOffsetPercent", 
function (percent) {
this.viewer.getGlobalSettings ().setParamF ("navigationSlab", percent);
this.calcCameraFactors ();
this.navigationSlabOffset = percent / 50 * this.modelRadiusPixels;
}, "~N");
Clazz.defineMethod (c$, "getNavigationSlabOffsetPercent", 
($fz = function () {
this.calcCameraFactors ();
return 50 * this.navigationSlabOffset / this.modelRadiusPixels;
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "getNavigationOffset", 
function () {
this.transformPoint2 (this.navigationCenter, this.navigationOffset);
return this.navigationOffset;
});
Clazz.defineMethod (c$, "setNavigationDepthPercent", 
($fz = function (percent) {
this.viewer.getGlobalSettings ().setParamF ("navigationDepth", percent);
this.calcCameraFactors ();
this.modelCenterOffset = this.referencePlaneOffset - (1 - percent / 50) * this.modelRadiusPixels;
this.calcCameraFactors ();
this.navMode = -1;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "calcNavigationDepthPercent", 
($fz = function () {
this.calcCameraFactors ();
this.navigationDepth = (this.modelRadiusPixels == 0 ? 50 : 50 * (1 + (this.modelCenterOffset - this.referencePlaneOffset) / this.modelRadiusPixels));
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "getNavigationOffsetPercent", 
function (XorY) {
this.getNavigationOffset ();
if (this.width == 0 || this.height == 0) return 0;
return (XorY == 'X' ? (this.navigationOffset.x - this.width / 2) * 100 / this.width : (this.navigationOffset.y - this.getNavPtHeight ()) * 100 / this.height);
}, "~S");
Clazz.overrideMethod (c$, "getNavigationText", 
function (addComments) {
this.getNavigationOffset ();
return (addComments ? " /* navigation center, translation, depth */ " : " ") + org.jmol.util.Escape.escapePt (this.navigationCenter) + " " + this.getNavigationOffsetPercent ('X') + " " + this.getNavigationOffsetPercent ('Y') + " " + this.getNavigationDepthPercent ();
}, "~B");
Clazz.overrideMethod (c$, "getNavigationState", 
function () {
if (this.mode != 1) return "";
return "# navigation state;\nnavigate 0 center " + org.jmol.util.Escape.escapePt (this.getNavigationCenter ()) + ";\nnavigate 0 translate " + this.getNavigationOffsetPercent ('X') + " " + this.getNavigationOffsetPercent ('Y') + ";\nset navigationDepth " + this.getNavigationDepthPercent () + ";\nset navigationSlab " + this.getNavigationSlabOffsetPercent () + ";\n\n";
});
Clazz.defineStatics (c$,
"NAV_MODE_IGNORE", -2,
"NAV_MODE_ZOOMED", -1,
"NAV_MODE_NONE", 0,
"NAV_MODE_RESET", 1,
"NAV_MODE_NEWXY", 2,
"NAV_MODE_NEWXYZ", 3,
"NAV_MODE_NEWZ", 4);
});
