﻿Clazz.declarePackage ("org.jmol.viewer");
Clazz.load (["org.jmol.constant.EnumStereoMode", "org.jmol.util.AxisAngle4f", "$.Matrix3f", "$.Matrix4f", "$.Point3f", "$.Point3i", "$.Vector3f"], "org.jmol.viewer.TransformManager", ["java.lang.Float", "$.Thread", "java.util.Hashtable", "org.jmol.thread.MotionThread", "$.SpinThread", "$.VibrationThread", "org.jmol.util.Escape", "$.Point4f", "$.Quaternion", "$.StringXBuilder", "org.jmol.viewer.StateManager"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.perspectiveModel = 11;
this.cameraScaleFactor = 0;
this.referencePlaneOffset = 0;
this.aperatureAngle = 0;
this.cameraDistanceFromCenter = 0;
this.modelCenterOffset = 0;
this.modelRadius = 0;
this.modelRadiusPixels = 0;
this.navigationCenter = null;
this.navigationOffset = null;
this.navigationShiftXY = null;
this.matrixTemp = null;
this.vectorTemp = null;
this.haveNotifiedNaN = false;
this.spinX = 0;
this.spinY = 30;
this.spinZ = 0;
this.spinFps = 30;
this.navX = 0;
this.navY = 0;
this.navZ = 0;
this.navFps = NaN;
this.isSpinInternal = false;
this.isSpinFixed = false;
this.isSpinSelected = false;
this.fixedRotationOffset = null;
this.fixedRotationCenter = null;
this.perspectiveOffset = null;
this.perspectiveShiftXY = null;
this.rotationCenterDefault = null;
this.rotationRadiusDefault = 0;
this.fixedRotationAxis = null;
this.internalRotationAxis = null;
this.internalTranslation = null;
this.internalRotationCenter = null;
this.internalRotationAngle = 0;
this.matrixRotate = null;
this.matrixTemp3 = null;
this.matrixTemp4 = null;
this.axisangleT = null;
this.vectorT = null;
this.vectorT2 = null;
this.pointT2 = null;
this.rotationAxis = null;
this.rotationRate = 0;
this.arcBall0 = null;
this.arcBall1 = null;
this.arcBallAxis = null;
this.arcBall0Rotation = null;
this.fixedTranslation = null;
this.xTranslationFraction = 0.5;
this.yTranslationFraction = 0.5;
this.prevZoomSetting = 0;
this.previousX = 0;
this.previousY = 0;
this.zoomEnabled = true;
this.zoomPercent = 100;
this.zoomPercentSetting = 100;
this.zoomRatio = 0;
this.slabEnabled = false;
this.internalSlab = false;
this.zShadeEnabled = false;
this.slabPercentSetting = 0;
this.depthPercentSetting = 0;
this.zSlabPercentSetting = 50;
this.zDepthPercentSetting = 0;
this.zSlabPoint = null;
this.slabValue = 0;
this.depthValue = 0;
this.zSlabValue = 0;
this.zDepthValue = 0;
this.slabRange = 0;
this.slabPlane = null;
this.depthPlane = null;
this.perspectiveDepth = true;
this.scale3D = false;
this.cameraDepth = NaN;
this.cameraDepthSetting = 3;
this.visualRange = 0;
this.cameraDistance = 1000;
this.width = 0;
this.height = 0;
this.screenPixelCount = 0;
this.scalePixelsPerAngstrom = 0;
this.scaleDefaultPixelsPerAngstrom = 0;
this.scale3DAngstromsPerInch = 0;
this.antialias = false;
this.useZoomLarge = false;
this.screenWidth = 0;
this.screenHeight = 0;
this.matrixTransform = null;
this.matrixTransformInv = null;
this.point3fScreenTemp = null;
this.point3iScreenTemp = null;
this.point3fVibrationTemp = null;
this.navigating = false;
this.mode = 0;
this.defaultMode = 0;
this.pointTsp = null;
this.untransformedPoint = null;
this.ptTest1 = null;
this.ptTest2 = null;
this.ptTest3 = null;
this.aaTest1 = null;
this.matrixTest = null;
this.motion = null;
this.spinOn = false;
this.navOn = false;
this.spinThread = null;
this.vibrationOn = false;
this.vibrationPeriod = 0;
this.vibrationPeriodMs = 0;
this.vibrationAmplitude = 0;
this.vibrationRadians = 0;
this.vibrationScale = 0;
this.vibrationThread = null;
this.stereoMode = null;
this.stereoColors = null;
this.stereoDegrees = NaN;
this.stereoRadians = 0;
this.stereoFrame = false;
this.matrixStereo = null;
this.windowCentered = false;
this.frameOffsets = null;
this.frameOffset = null;
this.bsSelectedAtoms = null;
this.ptOffset = null;
Clazz.instantialize (this, arguments);
}, org.jmol.viewer, "TransformManager");
Clazz.prepareFields (c$, function () {
this.navigationCenter =  new org.jmol.util.Point3f ();
this.navigationOffset =  new org.jmol.util.Point3f ();
this.navigationShiftXY =  new org.jmol.util.Point3f ();
this.matrixTemp =  new org.jmol.util.Matrix4f ();
this.vectorTemp =  new org.jmol.util.Vector3f ();
this.fixedRotationOffset =  new org.jmol.util.Point3f ();
this.fixedRotationCenter =  new org.jmol.util.Point3f ();
this.perspectiveOffset =  new org.jmol.util.Point3f ();
this.perspectiveShiftXY =  new org.jmol.util.Point3f ();
this.rotationCenterDefault =  new org.jmol.util.Point3f ();
this.fixedRotationAxis =  new org.jmol.util.AxisAngle4f ();
this.internalRotationAxis =  new org.jmol.util.AxisAngle4f ();
this.internalRotationCenter = org.jmol.util.Point3f.new3 (0, 0, 0);
this.matrixRotate =  new org.jmol.util.Matrix3f ();
this.matrixTemp3 =  new org.jmol.util.Matrix3f ();
this.matrixTemp4 =  new org.jmol.util.Matrix4f ();
this.axisangleT =  new org.jmol.util.AxisAngle4f ();
this.vectorT =  new org.jmol.util.Vector3f ();
this.vectorT2 =  new org.jmol.util.Vector3f ();
this.pointT2 =  new org.jmol.util.Point3f ();
this.rotationAxis =  new org.jmol.util.Vector3f ();
this.arcBall0 =  new org.jmol.util.Vector3f ();
this.arcBall1 =  new org.jmol.util.Vector3f ();
this.arcBallAxis =  new org.jmol.util.Vector3f ();
this.arcBall0Rotation =  new org.jmol.util.Matrix3f ();
this.fixedTranslation =  new org.jmol.util.Point3f ();
this.matrixTransform =  new org.jmol.util.Matrix4f ();
this.matrixTransformInv =  new org.jmol.util.Matrix4f ();
this.point3fScreenTemp =  new org.jmol.util.Point3f ();
this.point3iScreenTemp =  new org.jmol.util.Point3i ();
this.point3fVibrationTemp =  new org.jmol.util.Point3f ();
this.pointTsp =  new org.jmol.util.Point3f ();
this.untransformedPoint =  new org.jmol.util.Point3f ();
this.ptTest1 =  new org.jmol.util.Point3f ();
this.ptTest2 =  new org.jmol.util.Point3f ();
this.ptTest3 =  new org.jmol.util.Point3f ();
this.aaTest1 =  new org.jmol.util.AxisAngle4f ();
this.matrixTest =  new org.jmol.util.Matrix3f ();
this.stereoMode = org.jmol.constant.EnumStereoMode.NONE;
this.matrixStereo =  new org.jmol.util.Matrix3f ();
this.frameOffset =  new org.jmol.util.Point3f ();
this.ptOffset =  new org.jmol.util.Point3f ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.makeConstructor (c$, 
function (viewer) {
this.viewer = viewer;
}, "org.jmol.viewer.Viewer");
Clazz.makeConstructor (c$, 
function (viewer, width, height) {
this.setViewer (viewer, width, height);
}, "org.jmol.viewer.Viewer,~N,~N");
Clazz.defineMethod (c$, "setViewer", 
function (viewer, width, height) {
this.viewer = viewer;
this.setScreenParameters (width, height, true, false, true, true);
}, "org.jmol.viewer.Viewer,~N,~N");
Clazz.defineMethod (c$, "getNavigationManager", 
function (viewer, width, height) {
var t =  new org.jmol.viewer.TransformManager11 ();
t.setViewer (viewer, width, height);
return t;
}, "org.jmol.viewer.Viewer,~N,~N");
Clazz.defineMethod (c$, "homePosition", 
function (resetSpin) {
if (resetSpin) this.setSpinOn (false);
this.setNavOn (false);
this.navFps = 10;
this.navX = this.navY = this.navZ = 0;
this.rotationCenterDefault.setT (this.viewer.getBoundBoxCenter ());
this.setFixedRotationCenter (this.rotationCenterDefault);
this.rotationRadiusDefault = this.setRotationRadius (0, true);
this.windowCentered = true;
this.setRotationCenterAndRadiusXYZ (null, true);
this.matrixRotate.setIdentity ();
var m = this.viewer.getModelSetAuxiliaryInfoValue ("defaultOrientationMatrix");
if (m != null) this.matrixRotate.set (m);
this.setZoomEnabled (true);
this.zoomToPercent (this.viewer.isModelKitMode () ? 50 : 100);
this.zoomPercent = this.zoomPercentSetting;
this.slabReset ();
this.resetFitToScreen (true);
if (this.viewer.isJmolDataFrame ()) {
this.fixedRotationCenter.set (0, 0, 0);
} else {
if (this.viewer.getAxesOrientationRasmol ()) this.rotateX (3.141592653589793);
}this.viewer.saveOrientation ("default");
if (this.mode == 1) this.setNavigationMode (true);
}, "~B");
Clazz.defineMethod (c$, "clear", 
function () {
this.clearVibration ();
this.clearSpin ();
this.stopMotion ();
this.fixedRotationCenter.set (0, 0, 0);
this.navigating = false;
this.slabPlane = null;
this.depthPlane = null;
this.zSlabPoint = null;
this.resetNavigationPoint (true);
});
Clazz.defineMethod (c$, "getState", 
function (sfunc) {
var commands =  new org.jmol.util.StringXBuilder ();
if (sfunc != null) {
sfunc.append ("  _setPerspectiveState;\n");
commands.append ("function _setPerspectiveState() {\n");
}org.jmol.viewer.StateManager.appendCmd (commands, "set perspectiveModel " + this.perspectiveModel);
org.jmol.viewer.StateManager.appendCmd (commands, "set scaleAngstromsPerInch " + this.scale3DAngstromsPerInch);
org.jmol.viewer.StateManager.appendCmd (commands, "set perspectiveDepth " + this.perspectiveDepth);
org.jmol.viewer.StateManager.appendCmd (commands, "set visualRange " + this.visualRange);
if (!this.isWindowCentered ()) org.jmol.viewer.StateManager.appendCmd (commands, "set windowCentered false");
org.jmol.viewer.StateManager.appendCmd (commands, "set cameraDepth " + this.cameraDepth);
if (this.mode == 1) org.jmol.viewer.StateManager.appendCmd (commands, "set navigationMode true");
org.jmol.viewer.StateManager.appendCmd (commands, this.viewer.getBoundBoxCommand (false));
org.jmol.viewer.StateManager.appendCmd (commands, "center " + org.jmol.util.Escape.escapePt (this.fixedRotationCenter));
commands.append (this.viewer.getSavedOrienationText (null));
org.jmol.viewer.StateManager.appendCmd (commands, this.getMoveToText (0, false));
if (this.stereoMode !== org.jmol.constant.EnumStereoMode.NONE) org.jmol.viewer.StateManager.appendCmd (commands, "stereo " + (this.stereoColors == null ? this.stereoMode.getName () : org.jmol.util.Escape.escapeColor (this.stereoColors[0]) + " " + org.jmol.util.Escape.escapeColor (this.stereoColors[1])) + " " + this.stereoDegrees);
if (this.mode != 1 && !this.zoomEnabled) org.jmol.viewer.StateManager.appendCmd (commands, "zoom off");
commands.append ("  slab ").appendI (this.slabPercentSetting).append (";depth ").appendI (this.depthPercentSetting).append (this.slabEnabled && this.mode != 1 ? ";slab on" : "").append (";\n");
commands.append ("  set slabRange ").appendF (this.slabRange).append (";\n");
if (this.zShadeEnabled) commands.append ("  set zShade;\n");
try {
if (this.zSlabPoint != null) commands.append ("  set zSlab ").append (org.jmol.util.Escape.escapePt (this.zSlabPoint)).append (";\n");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
if (this.slabPlane != null) commands.append ("  slab plane ").append (org.jmol.util.Escape.escape (this.slabPlane)).append (";\n");
if (this.depthPlane != null) commands.append ("  depth plane ").append (org.jmol.util.Escape.escape (this.depthPlane)).append (";\n");
commands.append (this.getSpinState (true)).append ("\n");
if (this.viewer.modelSetHasVibrationVectors () && this.vibrationOn) org.jmol.viewer.StateManager.appendCmd (commands, "set vibrationPeriod " + this.vibrationPeriod + ";vibration on");
if (this.mode == 1) {
commands.append (this.getNavigationState ());
if (this.depthPlane != null || this.slabPlane != null) commands.append ("  slab on;\n");
}if (sfunc != null) commands.append ("}\n\n");
return commands.toString ();
}, "org.jmol.util.StringXBuilder");
Clazz.defineMethod (c$, "getSpinState", 
function (isAll) {
var s = "  set spinX " + Clazz.floatToInt (this.spinX) + "; set spinY " + Clazz.floatToInt (this.spinY) + "; set spinZ " + Clazz.floatToInt (this.spinZ) + "; set spinFps " + Clazz.floatToInt (this.spinFps) + ";";
if (!Float.isNaN (this.navFps)) s += "  set navX " + Clazz.floatToInt (this.navX) + "; set navY " + Clazz.floatToInt (this.navY) + "; set navZ " + Clazz.floatToInt (this.navZ) + "; set navFps " + Clazz.floatToInt (this.navFps) + ";";
if (this.navOn) s += " navigation on;";
if (!this.spinOn) return s;
var prefix = (this.isSpinSelected ? "\n  select " + org.jmol.util.Escape.escape (this.viewer.getSelectionSet (false)) + ";\n  rotateSelected" : "\n ");
if (this.isSpinInternal) {
var pt = org.jmol.util.Point3f.newP (this.internalRotationCenter);
pt.sub (this.rotationAxis);
s += prefix + " spin " + this.rotationRate + " " + org.jmol.util.Escape.escapePt (this.internalRotationCenter) + " " + org.jmol.util.Escape.escapePt (pt);
} else if (this.isSpinFixed) {
s += prefix + " spin axisangle " + org.jmol.util.Escape.escapePt (this.rotationAxis) + " " + this.rotationRate;
} else {
s += " spin on";
}return s + ";";
}, "~B");
Clazz.defineMethod (c$, "setFixedRotationCenter", 
($fz = function (center) {
if (center == null) return;
this.fixedRotationCenter.setT (center);
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "setRotationPointXY", 
function (center) {
var newCenterScreen = this.transformPoint (center);
this.fixedTranslation.set (newCenterScreen.x, newCenterScreen.y, 0);
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "spinXYBy", 
function (xDelta, yDelta, speed) {
if (xDelta == 0 && yDelta == 0) {
if (this.spinThread != null && this.spinThread.isGesture ()) this.clearSpin ();
return;
}this.clearSpin ();
var pt1 = org.jmol.util.Point3f.newP (this.fixedRotationCenter);
var ptScreen =  new org.jmol.util.Point3f ();
this.transformPoint2 (pt1, ptScreen);
var pt2 = org.jmol.util.Point3f.new3 (-yDelta, xDelta, 0);
pt2.add (ptScreen);
this.unTransformPoint (pt2, pt2);
this.viewer.setInMotion (false);
this.rotateAboutPointsInternal (pt2, pt1, 10 * speed, NaN, false, true, null, true, null, null);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateArcBall", 
function (x, y, factor) {
var radius2 = (this.screenPixelCount >> 2) * this.screenPixelCount;
x -= this.fixedTranslation.x;
y -= this.fixedTranslation.y;
var z = radius2 - x * x - y * y;
z = (z < 0 ? -1 : 1) * Math.sqrt (Math.abs (z));
if (factor == 0) {
this.arcBall0Rotation.set (this.matrixRotate);
this.arcBall0.set (x, -y, z);
if (!Float.isNaN (z)) this.arcBall0.normalize ();
return;
}if (Float.isNaN (this.arcBall0.z) || Float.isNaN (z)) return;
this.arcBall1.set (x, -y, z);
this.arcBall1.normalize ();
this.arcBallAxis.cross (this.arcBall0, this.arcBall1);
this.axisangleT.setVA (this.arcBallAxis, factor * Math.acos (this.arcBall0.dot (this.arcBall1)));
this.matrixRotate.set (this.arcBall0Rotation);
this.rotateAxisAngle2 (this.axisangleT, null);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateXYBy", 
function (xDelta, yDelta, bsAtoms) {
this.rotateXRadians (yDelta * 0.017453292, bsAtoms);
this.rotateYRadians (xDelta * 0.017453292, bsAtoms);
}, "~N,~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "rotateZBy", 
function (zDelta, x, y) {
if (x != 2147483647 && y != 2147483647) this.resetXYCenter (x, y);
this.rotateZRadians ((zDelta / 57.29577951308232));
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateFront", 
function () {
this.matrixRotate.setIdentity ();
});
Clazz.defineMethod (c$, "rotateX", 
function (angleRadians) {
this.matrixRotate.rotX (angleRadians);
}, "~N");
Clazz.defineMethod (c$, "rotateY", 
function (angleRadians) {
this.matrixRotate.rotY (angleRadians);
}, "~N");
Clazz.defineMethod (c$, "rotateZ", 
function (angleRadians) {
this.matrixRotate.rotZ (angleRadians);
}, "~N");
Clazz.defineMethod (c$, "applyRotation", 
($fz = function (mNew, isInternal, bsAtoms, translation) {
if (bsAtoms == null) {
this.matrixRotate.mul2 (mNew, this.matrixRotate);
return;
}this.viewer.moveAtoms (mNew, this.matrixRotate, translation, this.internalRotationCenter, isInternal, bsAtoms);
if (translation != null) {
this.internalRotationCenter.add (translation);
}}, $fz.isPrivate = true, $fz), "org.jmol.util.Matrix3f,~B,org.jmol.util.BitSet,org.jmol.util.Vector3f");
Clazz.defineMethod (c$, "rotateXRadians", 
function (angleRadians, bsAtoms) {
this.matrixTemp3.rotX (angleRadians);
this.applyRotation (this.matrixTemp3, false, bsAtoms, null);
}, "~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "rotateYRadians", 
function (angleRadians, bsAtoms) {
this.matrixTemp3.rotY (angleRadians);
this.applyRotation (this.matrixTemp3, false, bsAtoms, null);
}, "~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "rotateZRadians", 
function (angleRadians) {
this.matrixTemp3.rotZ (angleRadians);
this.applyRotation (this.matrixTemp3, false, null, null);
}, "~N");
Clazz.defineMethod (c$, "rotateAxisAngle", 
function (rotAxis, radians) {
this.axisangleT.setVA (rotAxis, radians);
this.rotateAxisAngle2 (this.axisangleT, null);
}, "org.jmol.util.Vector3f,~N");
Clazz.defineMethod (c$, "rotateAxisAngle2", 
($fz = function (axisAngle, bsAtoms) {
this.matrixTemp3.setAA (axisAngle);
this.applyRotation (this.matrixTemp3, false, bsAtoms, null);
}, $fz.isPrivate = true, $fz), "org.jmol.util.AxisAngle4f,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "rotateAxisAngleAtCenter", 
function (rotCenter, rotAxis, degreesPerSecond, endDegrees, isSpin, bsAtoms) {
if (rotCenter != null) this.moveRotationCenter (rotCenter, true);
this.setSpinOn (false);
this.setNavOn (false);
if (this.viewer.isHeadless ()) {
if (isSpin && endDegrees == 3.4028235E38) return false;
isSpin = false;
}if (Float.isNaN (degreesPerSecond) || degreesPerSecond == 0 || endDegrees == 0) return false;
if (rotCenter != null) {
this.setRotationPointXY (rotCenter);
}this.setFixedRotationCenter (rotCenter);
this.rotationAxis.setT (rotAxis);
this.rotationRate = degreesPerSecond;
if (isSpin) {
this.fixedRotationAxis.setVA (rotAxis, degreesPerSecond * 0.017453292);
this.isSpinInternal = false;
this.isSpinFixed = true;
this.isSpinSelected = (bsAtoms != null);
this.setSpin (true, endDegrees, null, bsAtoms, false);
return false;
}var radians = endDegrees * 0.017453292;
this.fixedRotationAxis.setVA (rotAxis, endDegrees);
this.rotateAxisAngleRadiansFixed (radians, bsAtoms);
return true;
}, "org.jmol.util.Point3f,org.jmol.util.Vector3f,~N,~N,~B,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "rotateAxisAngleRadiansFixed", 
function (angleRadians, bsAtoms) {
this.axisangleT.setAA (this.fixedRotationAxis);
this.axisangleT.angle = angleRadians;
this.rotateAxisAngle2 (this.axisangleT, bsAtoms);
}, "~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "rotateAboutPointsInternal", 
function (point1, point2, degreesPerSecond, endDegrees, isClockwise, isSpin, bsAtoms, isGesture, translation, finalPoints) {
this.setSpinOn (false);
this.setNavOn (false);
if (this.viewer.isHeadless ()) {
if (isSpin && endDegrees == 3.4028235E38) return false;
isSpin = false;
}if ((translation == null || translation.length () < 0.001) && (!isSpin || endDegrees == 0 || Float.isNaN (degreesPerSecond) || degreesPerSecond == 0) && (isSpin || endDegrees == 0)) return false;
var axis = org.jmol.util.Vector3f.newV (point2);
axis.sub (point1);
if (isClockwise) axis.scale (-1.0);
this.internalRotationCenter.setT (point1);
this.rotationAxis.setT (axis);
this.rotationRate = degreesPerSecond;
if (translation == null) {
this.internalTranslation = null;
} else {
this.internalTranslation = org.jmol.util.Vector3f.newV (translation);
}var isSelected = (bsAtoms != null);
if (isSpin) {
var nFrames = Clazz.doubleToInt (Math.abs (endDegrees) / Math.abs (degreesPerSecond) * this.spinFps + 0.5);
if (!Float.isNaN (endDegrees)) {
this.rotationRate = degreesPerSecond = endDegrees / nFrames * this.spinFps;
if (translation != null) this.internalTranslation.scale (1 / (nFrames));
}this.internalRotationAxis.setVA (axis, this.rotationRate * 0.017453292);
this.isSpinInternal = true;
this.isSpinFixed = false;
this.isSpinSelected = isSelected;
this.setSpin (true, endDegrees, finalPoints, bsAtoms, isGesture);
return false;
}var radians = endDegrees * 0.017453292;
this.internalRotationAxis.setVA (axis, radians);
this.rotateAxisAngleRadiansInternal (radians, bsAtoms);
return true;
}, "org.jmol.util.Point3f,org.jmol.util.Point3f,~N,~N,~B,~B,org.jmol.util.BitSet,~B,org.jmol.util.Vector3f,java.util.List");
Clazz.defineMethod (c$, "rotateAxisAngleRadiansInternal", 
function (radians, bsAtoms) {
this.internalRotationAngle = radians;
this.vectorT.set (this.internalRotationAxis.x, this.internalRotationAxis.y, this.internalRotationAxis.z);
this.matrixRotate.transform2 (this.vectorT, this.vectorT2);
this.axisangleT.setVA (this.vectorT2, radians);
this.matrixTemp3.setAA (this.axisangleT);
this.applyRotation (this.matrixTemp3, true, bsAtoms, this.internalTranslation);
if (bsAtoms == null) this.getNewFixedRotationCenter ();
}, "~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "getNewFixedRotationCenter", 
function () {
this.axisangleT.setAA (this.internalRotationAxis);
this.axisangleT.angle = -this.internalRotationAngle;
this.matrixTemp4.setAA (this.axisangleT);
this.vectorT.setT (this.internalRotationCenter);
this.pointT2.setT (this.fixedRotationCenter);
this.pointT2.sub (this.vectorT);
var pt =  new org.jmol.util.Point3f ();
this.matrixTemp4.transform2 (this.pointT2, pt);
pt.add (this.vectorT);
this.setRotationCenterAndRadiusXYZ (pt, false);
});
Clazz.defineMethod (c$, "setTranslationFractions", 
function () {
this.xTranslationFraction = this.fixedTranslation.x / this.width;
this.yTranslationFraction = this.fixedTranslation.y / this.height;
});
Clazz.defineMethod (c$, "centerAt", 
function (x, y, pt) {
if (pt == null) {
this.translateXYBy (x, y);
return;
}if (this.windowCentered) this.viewer.setBooleanProperty ("windowCentered", false);
this.fixedTranslation.x = x;
this.fixedTranslation.y = y;
this.setFixedRotationCenter (pt);
}, "~N,~N,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "percentToPixels", 
function (xyz, percent) {
switch (xyz) {
case 'x':
return Clazz.doubleToInt (Math.floor (percent / 100 * this.width));
case 'y':
return Clazz.doubleToInt (Math.floor (percent / 100 * this.height));
case 'z':
return Clazz.doubleToInt (Math.floor (percent / 100 * this.screenPixelCount));
}
return 0;
}, "~S,~N");
Clazz.defineMethod (c$, "angstromsToPixels", 
function (distance) {
return Clazz.doubleToInt (Math.floor (this.scalePixelsPerAngstrom * distance));
}, "~N");
Clazz.defineMethod (c$, "translateXYBy", 
function (xDelta, yDelta) {
this.fixedTranslation.x += xDelta;
this.fixedTranslation.y += yDelta;
this.setTranslationFractions ();
}, "~N,~N");
Clazz.defineMethod (c$, "translateToPercent", 
function (type, percent) {
switch (type) {
case 'x':
this.xTranslationFraction = 0.5 + percent / 100;
this.fixedTranslation.x = this.width * this.xTranslationFraction;
return;
case 'y':
this.yTranslationFraction = 0.5 + percent / 100;
this.fixedTranslation.y = this.height * this.yTranslationFraction;
return;
case 'z':
if (this.mode == 1) this.setNavigationDepthPercent (0, percent);
return;
}
}, "~S,~N");
Clazz.defineMethod (c$, "getTranslationXPercent", 
function () {
return (this.width == 0 ? 0 : (this.fixedTranslation.x - this.width / 2) * 100 / this.width);
});
Clazz.defineMethod (c$, "getTranslationYPercent", 
function () {
return (this.height == 0 ? 0 : (this.fixedTranslation.y - this.height / 2) * 100 / this.height);
});
Clazz.defineMethod (c$, "getTranslationZPercent", 
function () {
return 0;
});
Clazz.defineMethod (c$, "getTranslationScript", 
function () {
var info = "";
var f = this.getTranslationXPercent ();
if (f != 0.0) info += "translate x " + f + ";";
f = this.getTranslationYPercent ();
if (f != 0.0) info += "translate y " + f + ";";
return info;
});
Clazz.defineMethod (c$, "getOrientationText", 
function (type) {
switch (type) {
case 4130:
return this.getMoveToText (1, false);
case 1073742132:
return this.getRotationQuaternion ().toString ();
case 1073742178:
var sb =  new org.jmol.util.StringXBuilder ();
org.jmol.viewer.TransformManager.truncate2 (sb, this.getTranslationXPercent ());
org.jmol.viewer.TransformManager.truncate2 (sb, this.getTranslationYPercent ());
return sb.toString ();
default:
return this.getMoveToText (1, true) + "\n#OR\n" + this.getRotateZyzText (true);
}
}, "~N");
Clazz.defineMethod (c$, "getOrientationInfo", 
function () {
var info =  new java.util.Hashtable ();
info.put ("moveTo", this.getMoveToText (1, false));
info.put ("center", "center " + this.getCenterText ());
info.put ("centerPt", this.fixedRotationCenter);
var aa =  new org.jmol.util.AxisAngle4f ();
this.getAxisAngle (aa);
info.put ("axisAngle", aa);
info.put ("quaternion", org.jmol.util.Quaternion.newAA (aa).toPoint4f ());
info.put ("rotationMatrix", this.matrixRotate);
info.put ("rotateZYZ", this.getRotateZyzText (false));
info.put ("rotateXYZ", this.getRotateXyzText ());
info.put ("transXPercent",  new Float (this.getTranslationXPercent ()));
info.put ("transYPercent",  new Float (this.getTranslationYPercent ()));
info.put ("zoom",  new Float (this.zoomPercent));
info.put ("modelRadius",  new Float (this.modelRadius));
if (this.mode == 1) {
info.put ("navigationCenter", "navigate center " + org.jmol.util.Escape.escapePt (this.navigationCenter));
info.put ("navigationOffsetXPercent",  new Float (this.getNavigationOffsetPercent ('X')));
info.put ("navigationOffsetYPercent",  new Float (this.getNavigationOffsetPercent ('Y')));
info.put ("navigationDepthPercent",  new Float (this.getNavigationDepthPercent ()));
}return info;
});
Clazz.defineMethod (c$, "getAxisAngle", 
function (axisAngle) {
axisAngle.setM (this.matrixRotate);
}, "org.jmol.util.AxisAngle4f");
Clazz.defineMethod (c$, "getTransformText", 
function () {
return this.matrixRotate.toString ();
});
Clazz.defineMethod (c$, "getMatrixRotate", 
function () {
return this.matrixRotate;
});
Clazz.defineMethod (c$, "setRotation", 
function (matrixRotation) {
if (!Float.isNaN (matrixRotation.m00)) this.matrixRotate.set (matrixRotation);
}, "org.jmol.util.Matrix3f");
Clazz.defineMethod (c$, "getRotation", 
function (matrixRotation) {
matrixRotation.set (this.matrixRotate);
}, "org.jmol.util.Matrix3f");
Clazz.defineMethod (c$, "zoomBy", 
function (pixels) {
if (pixels > 20) pixels = 20;
 else if (pixels < -20) pixels = -20;
var deltaPercent = pixels * this.zoomPercentSetting / 50;
if (deltaPercent == 0) deltaPercent = (pixels > 0 ? 1 : (deltaPercent < 0 ? -1 : 0));
this.zoomRatio = (deltaPercent + this.zoomPercentSetting) / this.zoomPercentSetting;
this.zoomPercentSetting += deltaPercent;
}, "~N");
Clazz.defineMethod (c$, "getZoomPercentFloat", 
function () {
return this.zoomPercent;
});
Clazz.defineMethod (c$, "zoomToPercent", 
function (percentZoom) {
this.zoomPercentSetting = percentZoom;
this.zoomRatio = 0;
}, "~N");
Clazz.defineMethod (c$, "translateZBy", 
function (pixels) {
if (pixels >= this.screenPixelCount) return;
var sppa = this.scalePixelsPerAngstrom / (1 - pixels * 1.0 / this.screenPixelCount);
if (sppa >= this.screenPixelCount) return;
var newZoomPercent = sppa / this.scaleDefaultPixelsPerAngstrom * 100;
this.zoomRatio = newZoomPercent / this.zoomPercentSetting;
this.zoomPercentSetting = newZoomPercent;
}, "~N");
Clazz.defineMethod (c$, "zoomByFactor", 
function (factor, x, y) {
if (factor <= 0 || !this.zoomEnabled) return;
this.zoomRatio = factor;
this.zoomPercentSetting *= factor;
this.resetXYCenter (x, y);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "resetXYCenter", 
($fz = function (x, y) {
if (x == 2147483647 || y == 2147483647) return;
if (this.windowCentered) this.viewer.setBooleanProperty ("windowCentered", false);
var pt =  new org.jmol.util.Point3f ();
this.transformPoint2 (this.fixedRotationCenter, pt);
pt.set (x, y, pt.z);
this.unTransformPoint (pt, pt);
this.fixedTranslation.set (x, y, 0);
this.setFixedRotationCenter (pt);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "zoomByPercent", 
function (percentZoom) {
var deltaPercent = percentZoom * this.zoomPercentSetting / 100;
if (deltaPercent == 0) deltaPercent = (percentZoom < 0) ? -1 : 1;
this.zoomRatio = (deltaPercent + this.zoomPercentSetting) / this.zoomPercentSetting;
this.zoomPercentSetting += deltaPercent;
}, "~N");
Clazz.defineMethod (c$, "setScaleAngstromsPerInch", 
function (angstromsPerInch) {
this.scale3D = (angstromsPerInch > 0);
if (this.scale3D) this.scale3DAngstromsPerInch = angstromsPerInch;
this.perspectiveDepth = !this.scale3D;
}, "~N");
Clazz.defineMethod (c$, "setZslabPoint", 
function (pt) {
this.zSlabPoint = (pt == null ? null : org.jmol.util.Point3f.newP (pt));
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "setSlabRange", 
function (value) {
this.slabRange = value;
}, "~N");
Clazz.defineMethod (c$, "setSlabEnabled", 
function (slabEnabled) {
this.slabEnabled = slabEnabled;
this.viewer.getGlobalSettings ().setParamB ("slabEnabled", slabEnabled);
}, "~B");
Clazz.defineMethod (c$, "setZShadeEnabled", 
function (zShadeEnabled) {
this.zShadeEnabled = zShadeEnabled;
this.viewer.getGlobalSettings ().setParamB ("zShade", zShadeEnabled);
}, "~B");
Clazz.defineMethod (c$, "setZoomEnabled", 
function (zoomEnabled) {
this.zoomEnabled = zoomEnabled;
this.viewer.getGlobalSettings ().setParamB ("zoomEnabled", zoomEnabled);
}, "~B");
Clazz.defineMethod (c$, "slabReset", 
function () {
this.slabToPercent (100);
this.depthToPercent (0);
this.depthPlane = null;
this.slabPlane = null;
this.setSlabEnabled (false);
this.setZShadeEnabled (false);
});
Clazz.defineMethod (c$, "getSlabPercentSetting", 
function () {
return this.slabPercentSetting;
});
Clazz.defineMethod (c$, "slabByPercentagePoints", 
function (percentage) {
this.slabPlane = null;
this.slabPercentSetting += percentage;
this.slabDepthChanged ();
if (this.depthPercentSetting >= this.slabPercentSetting) this.depthPercentSetting = this.slabPercentSetting - 1;
}, "~N");
Clazz.defineMethod (c$, "slabDepthChanged", 
($fz = function () {
this.viewer.getGlobalSettings ().setParamI ("slab", this.slabPercentSetting);
this.viewer.getGlobalSettings ().setParamI ("depth", this.depthPercentSetting);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "depthByPercentagePoints", 
function (percentage) {
this.depthPlane = null;
this.depthPercentSetting += percentage;
if (this.slabPercentSetting <= this.depthPercentSetting) this.slabPercentSetting = this.depthPercentSetting + 1;
this.slabDepthChanged ();
}, "~N");
Clazz.defineMethod (c$, "slabDepthByPercentagePoints", 
function (percentage) {
this.slabPlane = null;
this.depthPlane = null;
this.slabPercentSetting += percentage;
this.depthPercentSetting += percentage;
this.slabDepthChanged ();
}, "~N");
Clazz.defineMethod (c$, "slabToPercent", 
function (percentSlab) {
this.viewer.setFloatProperty ("slabRange", 0);
this.slabPercentSetting = percentSlab;
this.slabPlane = null;
if (this.depthPercentSetting >= this.slabPercentSetting) this.depthPercentSetting = this.slabPercentSetting - 1;
this.slabDepthChanged ();
}, "~N");
Clazz.defineMethod (c$, "depthToPercent", 
function (percentDepth) {
this.viewer.getGlobalSettings ().setParamI ("depth", percentDepth);
this.depthPercentSetting = percentDepth;
if (this.slabPercentSetting <= this.depthPercentSetting) this.slabPercentSetting = this.depthPercentSetting + 1;
this.slabDepthChanged ();
}, "~N");
Clazz.defineMethod (c$, "zSlabToPercent", 
function (percentSlab) {
this.zSlabPercentSetting = percentSlab;
if (this.zDepthPercentSetting > this.zSlabPercentSetting) this.zDepthPercentSetting = percentSlab;
}, "~N");
Clazz.defineMethod (c$, "zDepthToPercent", 
function (percentDepth) {
this.zDepthPercentSetting = percentDepth;
if (this.zDepthPercentSetting > this.zSlabPercentSetting) this.zSlabPercentSetting = percentDepth;
}, "~N");
Clazz.defineMethod (c$, "slabInternal", 
function (plane, isDepth) {
if (isDepth) {
this.depthPlane = plane;
this.depthPercentSetting = 0;
} else {
this.slabPlane = plane;
this.slabPercentSetting = 100;
}}, "org.jmol.util.Point4f,~B");
Clazz.defineMethod (c$, "setSlabDepthInternal", 
function (isDepth) {
this.finalizeTransformParameters ();
if (isDepth) this.depthPlane = null;
 else this.slabPlane = null;
this.slabInternal (this.getSlabDepthPlane (isDepth), isDepth);
}, "~B");
Clazz.defineMethod (c$, "getSlabDepthPlane", 
function (isDepth) {
if (isDepth) {
if (this.depthPlane != null) return this.depthPlane;
} else {
if (this.slabPlane != null) return this.slabPlane;
}var m = this.matrixTransform;
return org.jmol.util.Point4f.new4 (-m.m20, -m.m21, -m.m22, -m.m23 + (isDepth ? this.depthValue : this.slabValue));
}, "~B");
Clazz.defineMethod (c$, "checkInternalSlab", 
function (pt) {
return (this.slabPlane != null && pt.x * this.slabPlane.x + pt.y * this.slabPlane.y + pt.z * this.slabPlane.z + this.slabPlane.w > 0 || this.depthPlane != null && pt.x * this.depthPlane.x + pt.y * this.depthPlane.y + pt.z * this.depthPlane.z + this.depthPlane.w < 0);
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "getCameraFactors", 
function () {
this.aperatureAngle = (Math.atan2 (this.screenPixelCount / 2, this.referencePlaneOffset) * 2 * 180 / 3.141592653589793);
this.cameraDistanceFromCenter = this.referencePlaneOffset / this.scalePixelsPerAngstrom;
var ptRef = org.jmol.util.Point3f.new3 (Clazz.doubleToInt (this.screenWidth / 2), Clazz.doubleToInt (this.screenHeight / 2), this.referencePlaneOffset);
this.unTransformPoint (ptRef, ptRef);
var ptCamera = org.jmol.util.Point3f.new3 (Clazz.doubleToInt (this.screenWidth / 2), Clazz.doubleToInt (this.screenHeight / 2), 0);
this.viewer.unTransformPoint (ptCamera, ptCamera);
ptCamera.sub (this.fixedRotationCenter);
var pt = org.jmol.util.Point3f.new3 (Clazz.doubleToInt (this.screenWidth / 2), Clazz.doubleToInt (this.screenHeight / 2), this.cameraDistanceFromCenter * this.scalePixelsPerAngstrom);
this.viewer.unTransformPoint (pt, pt);
pt.sub (this.fixedRotationCenter);
ptCamera.add (pt);
return [ptRef, ptCamera, this.fixedRotationCenter, org.jmol.util.Point3f.new3 (this.cameraDistanceFromCenter, this.aperatureAngle, this.scalePixelsPerAngstrom)];
});
Clazz.defineMethod (c$, "getFrontPlane", 
function () {
return Clazz.floatToInt (this.cameraDistance);
});
Clazz.defineMethod (c$, "setPerspectiveDepth", 
function (perspectiveDepth) {
if (this.perspectiveDepth == perspectiveDepth) return;
this.perspectiveDepth = perspectiveDepth;
this.resetFitToScreen (false);
}, "~B");
Clazz.defineMethod (c$, "getPerspectiveDepth", 
function () {
return this.perspectiveDepth;
});
Clazz.defineMethod (c$, "setCameraDepthPercent", 
function (percent) {
this.resetNavigationPoint (true);
var screenMultiples = (percent < 0 ? -percent / 100 : percent);
if (screenMultiples == 0) return;
this.cameraDepthSetting = screenMultiples;
this.cameraDepth = NaN;
}, "~N");
Clazz.defineMethod (c$, "setVisualRange", 
function (angstroms) {
this.visualRange = angstroms;
}, "~N");
Clazz.defineMethod (c$, "getUnscaledTransformMatrix", 
function () {
var unscaled =  new org.jmol.util.Matrix4f ();
unscaled.setIdentity ();
this.vectorTemp.setT (this.fixedRotationCenter);
this.matrixTemp.setZero ();
this.matrixTemp.setTranslation (this.vectorTemp);
unscaled.sub (this.matrixTemp);
this.matrixTemp.set (this.matrixRotate);
unscaled.mul2 (this.matrixTemp, unscaled);
return unscaled;
});
Clazz.defineMethod (c$, "setScreenParameters", 
function (screenWidth, screenHeight, useZoomLarge, antialias, resetSlab, resetZoom) {
this.screenWidth = screenWidth;
this.screenHeight = screenHeight;
this.useZoomLarge = useZoomLarge;
this.antialias = antialias;
this.width = (antialias ? screenWidth * 2 : screenWidth);
this.height = (antialias ? screenHeight * 2 : screenHeight);
this.scaleFitToScreen (false, useZoomLarge, resetSlab, resetZoom);
this.finalizeTransformParameters ();
}, "~N,~N,~B,~B,~B,~B");
Clazz.defineMethod (c$, "setAntialias", 
function (TF) {
var isNew = (this.antialias != TF);
this.antialias = TF;
this.width = (this.antialias ? this.screenWidth * 2 : this.screenWidth);
this.height = (this.antialias ? this.screenHeight * 2 : this.screenHeight);
if (isNew) this.scaleFitToScreen (false, this.useZoomLarge, false, false);
}, "~B");
Clazz.defineMethod (c$, "defaultScaleToScreen", 
function (radius) {
return this.screenPixelCount / 2 / radius;
}, "~N");
Clazz.defineMethod (c$, "resetFitToScreen", 
($fz = function (andCenter) {
this.scaleFitToScreen (andCenter, this.viewer.getZoomLarge (), true, true);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "scaleFitToScreen", 
function (andCenter, zoomLarge, resetSlab, resetZoom) {
if (this.width == 0 || this.height == 0) {
this.screenPixelCount = 1;
} else {
this.fixedTranslation.set (this.width * (andCenter ? 0.5 : this.xTranslationFraction), this.height * (andCenter ? 0.5 : this.yTranslationFraction), 0);
this.setTranslationFractions ();
if (resetZoom) this.resetNavigationPoint (resetSlab);
this.screenPixelCount = (zoomLarge == (this.height > this.width) ? this.height : this.width);
}if (this.screenPixelCount > 2) this.screenPixelCount -= 2;
this.scaleDefaultPixelsPerAngstrom = this.defaultScaleToScreen (this.modelRadius);
}, "~B,~B,~B,~B");
Clazz.defineMethod (c$, "scaleToScreen", 
function (z, milliAngstroms) {
if (milliAngstroms == 0 || z < 2) return 0;
var pixelSize = Clazz.floatToInt (this.scaleToPerspective (z, milliAngstroms * this.scalePixelsPerAngstrom / 1000));
return (pixelSize > 0 ? pixelSize : 1);
}, "~N,~N");
Clazz.defineMethod (c$, "unscaleToScreen", 
function (z, screenDistance) {
var d = screenDistance / this.scalePixelsPerAngstrom;
return (this.perspectiveDepth ? d / this.getPerspectiveFactor (z) : d);
}, "~N,~N");
Clazz.defineMethod (c$, "scaleToPerspective", 
function (z, sizeAngstroms) {
return (this.perspectiveDepth ? sizeAngstroms * this.getPerspectiveFactor (z) : sizeAngstroms);
}, "~N,~N");
Clazz.defineMethod (c$, "getMatrixtransform", 
function () {
return this.matrixTransform;
});
Clazz.defineMethod (c$, "setNavigationMode", 
function (TF) {
if (TF && this.canNavigate ()) this.mode = 1;
 else this.mode = this.defaultMode;
this.resetNavigationPoint (true);
}, "~B");
Clazz.defineMethod (c$, "isNavigating", 
function () {
return this.navigating || this.navOn;
});
Clazz.defineMethod (c$, "finalizeTransformParameters", 
function () {
this.haveNotifiedNaN = false;
this.fixedRotationOffset.setT (this.fixedTranslation);
this.internalSlab = this.slabEnabled && (this.slabPlane != null || this.depthPlane != null);
var newZoom = this.getZoomSetting ();
if (this.zoomPercent != newZoom) {
this.zoomPercent = newZoom;
if (!this.viewer.getFontCaching ()) this.viewer.getGraphicsData ().clearFontCache ();
}this.calcCameraFactors ();
this.calcTransformMatrix ();
if (this.mode == 1) this.calcNavigationPoint ();
 else this.calcSlabAndDepthValues ();
});
Clazz.defineMethod (c$, "getZoomSetting", 
function () {
if (this.zoomPercentSetting < 5) this.zoomPercentSetting = 5;
if (this.zoomPercentSetting > 200000) this.zoomPercentSetting = 200000;
return (this.zoomEnabled || this.mode == 1 ? this.zoomPercentSetting : 100);
});
Clazz.defineMethod (c$, "calcSlabAndDepthValues", 
function () {
if (this.slabRange < 1) this.slabValue = this.zValueFromPercent (this.slabPercentSetting);
 else this.slabValue = Clazz.doubleToInt (Math.floor (this.modelCenterOffset * this.slabRange / (2 * this.modelRadius) * (this.zoomPercentSetting / 100)));
this.depthValue = this.zValueFromPercent (this.depthPercentSetting);
if (this.zSlabPercentSetting == this.zDepthPercentSetting) {
this.zSlabValue = this.slabValue;
this.zDepthValue = this.depthValue;
} else {
this.zSlabValue = this.zValueFromPercent (this.zSlabPercentSetting);
this.zDepthValue = this.zValueFromPercent (this.zDepthPercentSetting);
}if (this.zSlabPoint != null) {
try {
this.transformPoint2 (this.zSlabPoint, this.pointT2);
this.zSlabValue = Clazz.floatToInt (this.pointT2.z);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}this.viewer.getGlobalSettings ().setParamS ("_slabPlane", org.jmol.util.Escape.escape (this.getSlabDepthPlane (false)));
this.viewer.getGlobalSettings ().setParamS ("_depthPlane", org.jmol.util.Escape.escape (this.getSlabDepthPlane (true)));
if (this.slabEnabled) return;
this.slabValue = 0;
this.depthValue = 2147483647;
});
Clazz.defineMethod (c$, "zValueFromPercent", 
function (zPercent) {
return Clazz.doubleToInt (Math.floor ((1 - zPercent / 50) * this.modelRadiusPixels + this.modelCenterOffset));
}, "~N");
Clazz.defineMethod (c$, "calcTransformMatrix", 
function () {
this.matrixTransform.setIdentity ();
this.vectorTemp.setT (this.fixedRotationCenter);
this.vectorTemp.sub (this.frameOffset);
this.matrixTemp.setZero ();
this.matrixTemp.setTranslation (this.vectorTemp);
this.matrixTransform.sub (this.matrixTemp);
this.matrixTemp.set (this.stereoFrame ? this.matrixStereo : this.matrixRotate);
this.matrixTransform.mul2 (this.matrixTemp, this.matrixTransform);
this.matrixTemp.setIdentity ();
this.matrixTemp.m00 = this.matrixTemp.m11 = this.matrixTemp.m22 = this.scalePixelsPerAngstrom;
this.matrixTemp.m11 = this.matrixTemp.m22 = -this.scalePixelsPerAngstrom;
this.matrixTransform.mul2 (this.matrixTemp, this.matrixTransform);
this.matrixTransform.m23 += this.modelCenterOffset;
try {
this.matrixTransformInv.invertM (this.matrixTransform);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("ERROR INVERTING matrixTransform!");
} else {
throw e;
}
}
});
Clazz.defineMethod (c$, "rotatePoint", 
function (pt, ptRot) {
this.matrixRotate.transform2 (pt, ptRot);
ptRot.y = -ptRot.y;
}, "org.jmol.util.Point3f,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "transformPoints", 
function (count, angstroms, screens) {
for (var i = count; --i >= 0; ) screens[i].setT (this.transformPoint (angstroms[i]));

}, "~N,~A,~A");
Clazz.defineMethod (c$, "transformPointScr", 
function (pointAngstroms, pointScreen) {
pointScreen.setT (this.transformPoint (pointAngstroms));
}, "org.jmol.util.Point3f,org.jmol.util.Point3i");
Clazz.defineMethod (c$, "transformPointNoClip2", 
function (pointAngstroms, pointScreen) {
pointScreen.setT (this.transformPointNoClip (pointAngstroms));
}, "org.jmol.util.Point3f,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "transformPoint", 
function (pointAngstroms) {
if (pointAngstroms.z == 3.4028235E38 || pointAngstroms.z == -3.4028235E38) return this.transformScreenPoint (pointAngstroms);
this.matrixTransform.transform2 (pointAngstroms, this.point3fScreenTemp);
this.adjustTemporaryScreenPoint ();
if (this.internalSlab && this.checkInternalSlab (pointAngstroms)) this.point3iScreenTemp.z = 1;
return this.point3iScreenTemp;
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "transformScreenPoint", 
($fz = function (ptXyp) {
if (ptXyp.z == -3.4028235E38) {
this.point3iScreenTemp.x = Clazz.doubleToInt (Math.floor (ptXyp.x / 100 * this.screenWidth));
this.point3iScreenTemp.y = Clazz.doubleToInt (Math.floor ((1 - ptXyp.y / 100) * this.screenHeight));
} else {
this.point3iScreenTemp.x = Clazz.floatToInt (ptXyp.x);
this.point3iScreenTemp.y = (this.screenHeight - Clazz.floatToInt (ptXyp.y));
}if (this.antialias) {
this.point3iScreenTemp.x <<= 1;
this.point3iScreenTemp.y <<= 1;
}this.matrixTransform.transform2 (this.fixedRotationCenter, this.pointTsp);
this.point3iScreenTemp.z = Clazz.floatToInt (this.pointTsp.z);
return this.point3iScreenTemp;
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "transformPointNoClip", 
function (pointAngstroms) {
this.matrixTransform.transform2 (pointAngstroms, this.point3fScreenTemp);
this.adjustTemporaryScreenPoint ();
return this.point3fScreenTemp;
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "transformPointVib", 
function (pointAngstroms, vibrationVector) {
this.point3fVibrationTemp.setT (pointAngstroms);
if (this.vibrationOn && vibrationVector != null) this.point3fVibrationTemp.scaleAdd2 (this.vibrationAmplitude, vibrationVector, pointAngstroms);
this.matrixTransform.transform2 (this.point3fVibrationTemp, this.point3fScreenTemp);
this.adjustTemporaryScreenPoint ();
if (this.internalSlab && this.checkInternalSlab (pointAngstroms)) this.point3iScreenTemp.z = 1;
return this.point3iScreenTemp;
}, "org.jmol.util.Point3f,org.jmol.util.Vector3f");
Clazz.defineMethod (c$, "transformPoint2", 
function (pointAngstroms, screen) {
this.matrixTransform.transform2 (pointAngstroms, this.point3fScreenTemp);
this.adjustTemporaryScreenPoint ();
if (this.internalSlab && this.checkInternalSlab (pointAngstroms)) this.point3fScreenTemp.z = 1;
screen.setT (this.point3fScreenTemp);
}, "org.jmol.util.Point3f,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "transformVector", 
function (vectorAngstroms, vectorTransformed) {
this.matrixTransform.transformV2 (vectorAngstroms, vectorTransformed);
}, "org.jmol.util.Vector3f,org.jmol.util.Vector3f");
Clazz.defineMethod (c$, "unTransformPoint", 
function (screenPt, coordPt) {
this.untransformedPoint.setT (screenPt);
switch (this.mode) {
case 1:
this.untransformedPoint.x -= this.navigationOffset.x;
this.untransformedPoint.y -= this.navigationOffset.y;
break;
case 2:
this.untransformedPoint.x -= this.perspectiveOffset.x;
this.untransformedPoint.y -= this.perspectiveOffset.y;
break;
case 0:
this.untransformedPoint.x -= this.fixedRotationOffset.x;
this.untransformedPoint.y -= this.fixedRotationOffset.y;
}
if (this.perspectiveDepth) {
var factor = this.getPerspectiveFactor (this.untransformedPoint.z);
this.untransformedPoint.x /= factor;
this.untransformedPoint.y /= factor;
}switch (this.mode) {
case 1:
this.untransformedPoint.x += this.navigationShiftXY.x;
this.untransformedPoint.y += this.navigationShiftXY.y;
break;
case 2:
this.untransformedPoint.x += this.perspectiveShiftXY.x;
this.untransformedPoint.y += this.perspectiveShiftXY.y;
break;
}
this.matrixTransformInv.transform2 (this.untransformedPoint, coordPt);
}, "org.jmol.util.Point3f,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "move", 
function (dRot, dZoom, dTrans, dSlab, floatSecondsTotal, fps) {
var slab = this.getSlabPercentSetting ();
var transX = this.getTranslationXPercent ();
var transY = this.getTranslationYPercent ();
var transZ = this.getTranslationZPercent ();
var timeBegin = System.currentTimeMillis ();
var timePerStep = Clazz.doubleToInt (1000 / fps);
var totalSteps = Clazz.floatToInt (fps * floatSecondsTotal);
if (totalSteps <= 0) totalSteps = 1;
var radiansPerDegreePerStep = (1 / 57.29577951308232 / totalSteps);
var radiansXStep = radiansPerDegreePerStep * dRot.x;
var radiansYStep = radiansPerDegreePerStep * dRot.y;
var radiansZStep = radiansPerDegreePerStep * dRot.z;
if (floatSecondsTotal > 0) this.viewer.setInMotion (true);
var zoomPercent0 = this.zoomPercent;
for (var i = 1; i <= totalSteps; ++i) {
if (dRot.x != 0) this.rotateXRadians (radiansXStep, null);
if (dRot.y != 0) this.rotateYRadians (radiansYStep, null);
if (dRot.z != 0) this.rotateZRadians (radiansZStep);
if (dZoom != 0) this.zoomToPercent (zoomPercent0 + dZoom * i / totalSteps);
if (dTrans.x != 0) this.translateToPercent ('x', transX + dTrans.x * i / totalSteps);
if (dTrans.y != 0) this.translateToPercent ('y', transY + dTrans.y * i / totalSteps);
if (dTrans.z != 0) this.translateToPercent ('z', transZ + dTrans.z * i / totalSteps);
if (dSlab != 0) this.slabToPercent (Clazz.doubleToInt (Math.floor (slab + dSlab * i / totalSteps)));
var timeSpent = (System.currentTimeMillis () - timeBegin);
var timeAllowed = i * timePerStep;
if (timeSpent < timeAllowed) {
this.viewer.requestRepaintAndWait ();
if (!this.viewer.isScriptExecuting ()) break;
timeSpent = (System.currentTimeMillis () - timeBegin);
var timeToSleep = timeAllowed - timeSpent;
if (timeToSleep > 0) {
try {
Thread.sleep (timeToSleep);
} catch (e) {
if (Clazz.exceptionOf (e, InterruptedException)) {
} else {
throw e;
}
}
}}}
this.viewer.setInMotion (false);
}, "org.jmol.util.Vector3f,~N,org.jmol.util.Vector3f,~N,~N,~N");
Clazz.defineMethod (c$, "isInPosition", 
function (axis, degrees) {
if (Float.isNaN (degrees)) return true;
this.aaTest1.setVA (axis, (degrees / 57.29577951308232));
this.ptTest1.set (4.321, 1.23456, 3.14159);
this.getRotation (this.matrixTest);
this.matrixTest.transform2 (this.ptTest1, this.ptTest2);
this.matrixTest.setAA (this.aaTest1);
this.matrixTest.transform2 (this.ptTest1, this.ptTest3);
return (this.ptTest3.distance (this.ptTest2) < 0.1);
}, "org.jmol.util.Vector3f,~N");
Clazz.defineMethod (c$, "moveTo", 
function (floatSecondsTotal, center, rotAxis, degrees, matrixEnd, zoom, xTrans, yTrans, newRotationRadius, navCenter, xNav, yNav, navDepth) {
if (matrixEnd == null) {
matrixEnd =  new org.jmol.util.Matrix3f ();
var axis = org.jmol.util.Vector3f.newV (rotAxis);
if (Float.isNaN (degrees)) {
matrixEnd.m00 = NaN;
} else if (degrees < 0.01 && degrees > -0.01) {
matrixEnd.setIdentity ();
} else {
if (axis.x == 0 && axis.y == 0 && axis.z == 0) {
return;
}var aaMoveTo =  new org.jmol.util.AxisAngle4f ();
aaMoveTo.setVA (axis, (degrees / 57.29577951308232));
matrixEnd.setAA (aaMoveTo);
}}try {
if (this.motion == null) this.motion =  new org.jmol.thread.MotionThread (this, this.viewer);
var nSteps = this.motion.set (floatSecondsTotal, center, matrixEnd, zoom, xTrans, yTrans, newRotationRadius, navCenter, xNav, yNav, navDepth);
if (nSteps <= 0 || this.viewer.waitForMoveTo ()) {
this.motion.startMotion (false);
this.motion = null;
} else {
this.motion.startMotion (true);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}, "~N,org.jmol.util.Point3f,org.jmol.util.Tuple3f,~N,org.jmol.util.Matrix3f,~N,~N,~N,~N,org.jmol.util.Point3f,~N,~N,~N");
Clazz.defineMethod (c$, "stopMotion", 
function () {
this.motion = null;
});
Clazz.defineMethod (c$, "getRotationQuaternion", 
function () {
return org.jmol.util.Quaternion.newM (this.matrixRotate);
});
Clazz.defineMethod (c$, "getRotationText", 
function () {
this.axisangleT.setM (this.matrixRotate);
var degrees = (this.axisangleT.angle * 57.29577951308232);
var sb =  new org.jmol.util.StringXBuilder ();
this.vectorT.set (this.axisangleT.x, this.axisangleT.y, this.axisangleT.z);
if (degrees < 0.01) return "{0 0 1 0}";
this.vectorT.normalize ();
this.vectorT.scale (1000);
sb.append ("{");
org.jmol.viewer.TransformManager.truncate0 (sb, this.vectorT.x);
org.jmol.viewer.TransformManager.truncate0 (sb, this.vectorT.y);
org.jmol.viewer.TransformManager.truncate0 (sb, this.vectorT.z);
org.jmol.viewer.TransformManager.truncate2 (sb, degrees);
sb.append ("}");
return sb.toString ();
});
Clazz.defineMethod (c$, "getMoveToText", 
function (timespan, addComments) {
var sb =  new org.jmol.util.StringXBuilder ();
sb.append ("moveto ");
if (addComments) sb.append ("/* time, axisAngle */ ");
sb.appendF (timespan);
sb.append (" ").append (this.getRotationText ());
if (addComments) sb.append (" /* zoom, translation */ ");
org.jmol.viewer.TransformManager.truncate2 (sb, this.zoomPercentSetting);
org.jmol.viewer.TransformManager.truncate2 (sb, this.getTranslationXPercent ());
org.jmol.viewer.TransformManager.truncate2 (sb, this.getTranslationYPercent ());
sb.append (" ");
if (addComments) sb.append (" /* center, rotationRadius */ ");
sb.append (this.getCenterText ());
sb.append (" ").appendF (this.modelRadius);
sb.append (this.getNavigationText (addComments));
sb.append (";");
return sb.toString ();
}, "~N,~B");
Clazz.defineMethod (c$, "getCenterText", 
($fz = function () {
return org.jmol.util.Escape.escapePt (this.fixedRotationCenter);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getRotateXyzText", 
($fz = function () {
var sb =  new org.jmol.util.StringXBuilder ();
var m20 = this.matrixRotate.m20;
var rY = -(Math.asin (m20) * 57.29577951308232);
var rX;
var rZ;
if (m20 > .999 || m20 < -0.999) {
rX = -(Math.atan2 (this.matrixRotate.m12, this.matrixRotate.m11) * 57.29577951308232);
rZ = 0;
} else {
rX = (Math.atan2 (this.matrixRotate.m21, this.matrixRotate.m22) * 57.29577951308232);
rZ = (Math.atan2 (this.matrixRotate.m10, this.matrixRotate.m00) * 57.29577951308232);
}sb.append ("reset");
sb.append (";center ").append (this.getCenterText ());
if (rX != 0) {
sb.append ("; rotate x");
org.jmol.viewer.TransformManager.truncate2 (sb, rX);
}if (rY != 0) {
sb.append ("; rotate y");
org.jmol.viewer.TransformManager.truncate2 (sb, rY);
}if (rZ != 0) {
sb.append ("; rotate z");
org.jmol.viewer.TransformManager.truncate2 (sb, rZ);
}sb.append (";");
this.addZoomTranslationNavigationText (sb);
return sb.toString ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "addZoomTranslationNavigationText", 
($fz = function (sb) {
if (this.zoomPercent != 100) {
sb.append (" zoom");
org.jmol.viewer.TransformManager.truncate2 (sb, this.zoomPercent);
sb.append (";");
}var tX = this.getTranslationXPercent ();
if (tX != 0) {
sb.append (" translate x");
org.jmol.viewer.TransformManager.truncate2 (sb, tX);
sb.append (";");
}var tY = this.getTranslationYPercent ();
if (tY != 0) {
sb.append (" translate y");
org.jmol.viewer.TransformManager.truncate2 (sb, tY);
sb.append (";");
}if (this.modelRadius != this.rotationRadiusDefault || this.modelRadius == 10) {
sb.append (" set rotationRadius");
org.jmol.viewer.TransformManager.truncate2 (sb, this.modelRadius);
sb.append (";");
}if (this.mode == 1) {
sb.append ("navigate 0 center ").append (org.jmol.util.Escape.escapePt (this.navigationCenter));
sb.append (";navigate 0 translate");
org.jmol.viewer.TransformManager.truncate2 (sb, this.getNavigationOffsetPercent ('X'));
org.jmol.viewer.TransformManager.truncate2 (sb, this.getNavigationOffsetPercent ('Y'));
sb.append (";navigate 0 depth ");
org.jmol.viewer.TransformManager.truncate2 (sb, this.getNavigationDepthPercent ());
sb.append (";");
}}, $fz.isPrivate = true, $fz), "org.jmol.util.StringXBuilder");
Clazz.defineMethod (c$, "getRotateZyzText", 
($fz = function (iAddComment) {
var sb =  new org.jmol.util.StringXBuilder ();
var m = this.viewer.getModelSetAuxiliaryInfoValue ("defaultOrientationMatrix");
if (m == null) {
m = this.matrixRotate;
} else {
m = org.jmol.util.Matrix3f.newM (m);
m.invert ();
m.mul2 (this.matrixRotate, m);
}var m22 = m.m22;
var rY = (Math.acos (m22) * 57.29577951308232);
var rZ1;
var rZ2;
if (m22 > .999 || m22 < -0.999) {
rZ1 = (Math.atan2 (m.m10, m.m11) * 57.29577951308232);
rZ2 = 0;
} else {
rZ1 = (Math.atan2 (m.m21, -m.m20) * 57.29577951308232);
rZ2 = (Math.atan2 (m.m12, m.m02) * 57.29577951308232);
}if (rZ1 != 0 && rY != 0 && rZ2 != 0 && iAddComment) sb.append ("#Follows Z-Y-Z convention for Euler angles\n");
sb.append ("reset");
sb.append (";center ").append (this.getCenterText ());
if (rZ1 != 0) {
sb.append ("; rotate z");
org.jmol.viewer.TransformManager.truncate2 (sb, rZ1);
}if (rY != 0) {
sb.append ("; rotate y");
org.jmol.viewer.TransformManager.truncate2 (sb, rY);
}if (rZ2 != 0) {
sb.append ("; rotate z");
org.jmol.viewer.TransformManager.truncate2 (sb, rZ2);
}sb.append (";");
this.addZoomTranslationNavigationText (sb);
return sb.toString ();
}, $fz.isPrivate = true, $fz), "~B");
c$.truncate0 = Clazz.defineMethod (c$, "truncate0", 
($fz = function (sb, val) {
sb.appendC (' ');
sb.appendI (Math.round (val));
}, $fz.isPrivate = true, $fz), "org.jmol.util.StringXBuilder,~N");
c$.truncate2 = Clazz.defineMethod (c$, "truncate2", 
($fz = function (sb, val) {
sb.appendC (' ');
sb.appendF (Math.round (val * 100) / 100);
}, $fz.isPrivate = true, $fz), "org.jmol.util.StringXBuilder,~N");
Clazz.defineMethod (c$, "setSpinXYZ", 
function (x, y, z) {
if (!Float.isNaN (x)) this.spinX = x;
if (!Float.isNaN (y)) this.spinY = y;
if (!Float.isNaN (z)) this.spinZ = z;
if (this.isSpinInternal || this.isSpinFixed) this.clearSpin ();
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setSpinFps", 
function (value) {
if (value <= 0) value = 1;
 else if (value > 50) value = 50;
this.spinFps = value;
}, "~N");
Clazz.defineMethod (c$, "setNavXYZ", 
function (x, y, z) {
if (!Float.isNaN (x)) this.navX = x;
if (!Float.isNaN (y)) this.navY = y;
if (!Float.isNaN (z)) this.navZ = z;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setNavFps", 
function (value) {
}, "~N");
Clazz.defineMethod (c$, "clearSpin", 
($fz = function () {
this.setSpinOn (false);
this.setNavOn (false);
this.isSpinInternal = false;
this.isSpinFixed = false;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getSpinOn", 
function () {
return this.spinOn;
});
Clazz.defineMethod (c$, "getNavOn", 
function () {
return this.navOn;
});
Clazz.defineMethod (c$, "setSpinOn", 
function (spinOn) {
this.setSpin (spinOn, 3.4028235E38, null, null, false);
}, "~B");
Clazz.defineMethod (c$, "setSpin", 
($fz = function (spinOn, endDegrees, endPositions, bsAtoms, isGesture) {
if (this.navOn && spinOn) this.setNavOn (false);
this.spinOn = spinOn;
this.viewer.getGlobalSettings ().setParamB ("_spinning", spinOn);
if (spinOn) {
if (this.spinThread == null) {
this.spinThread =  new org.jmol.thread.SpinThread (this, this.viewer, endDegrees, endPositions, bsAtoms, false, isGesture);
if (bsAtoms == null) this.spinThread.start ();
 else this.spinThread.run ();
}} else if (this.spinThread != null) {
this.spinThread.reset ();
this.spinThread = null;
}}, $fz.isPrivate = true, $fz), "~B,~N,java.util.List,org.jmol.util.BitSet,~B");
Clazz.defineMethod (c$, "setNavOn", 
function (navOn) {
if (Float.isNaN (this.navFps)) return;
var wasOn = this.navOn;
if (navOn && this.spinOn) this.setSpin (false, 0, null, null, false);
this.navOn = navOn;
this.viewer.getGlobalSettings ().setParamB ("_navigating", navOn);
if (navOn) {
if (this.navX == 0 && this.navY == 0 && this.navZ == 0) this.navZ = 1;
if (this.navFps == 0) this.navFps = 10;
if (this.spinThread == null) {
this.spinThread =  new org.jmol.thread.SpinThread (this, this.viewer, 0, null, null, true, false);
this.spinThread.start ();
}} else if (wasOn) {
if (this.spinThread != null) {
this.spinThread.interrupt ();
this.spinThread = null;
}}}, "~B");
Clazz.defineMethod (c$, "setVibrationScale", 
function (scale) {
this.vibrationScale = scale;
}, "~N");
Clazz.defineMethod (c$, "setNavigationOffsetRelative", 
function (navigatingSurface) {
}, "~B");
Clazz.defineMethod (c$, "setVibrationPeriod", 
function (period) {
if (Float.isNaN (period)) {
period = this.vibrationPeriod;
} else if (period == 0) {
this.vibrationPeriod = 0;
this.vibrationPeriodMs = 0;
} else {
this.vibrationPeriod = Math.abs (period);
this.vibrationPeriodMs = Clazz.floatToInt (this.vibrationPeriod * 1000);
if (period > 0) return;
period = -period;
}this.setVibrationOn (period > 0 && this.viewer.modelHasVibrationVectors (this.viewer.getCurrentModelIndex ()));
}, "~N");
Clazz.defineMethod (c$, "setVibrationT", 
function (t) {
this.vibrationRadians = (t * 6.283185307179586);
if (this.vibrationScale == 0) this.vibrationScale = this.viewer.getVibrationScale ();
this.vibrationAmplitude = Math.cos (this.vibrationRadians) * this.vibrationScale;
}, "~N");
Clazz.defineMethod (c$, "isVibrationOn", 
function () {
return this.vibrationOn;
});
Clazz.defineMethod (c$, "setVibrationOn", 
($fz = function (vibrationOn) {
if (!vibrationOn) {
if (this.vibrationThread != null) {
this.vibrationThread.interrupt ();
this.vibrationThread = null;
}this.vibrationOn = false;
return;
}if (this.viewer.getModelCount () < 1) {
this.vibrationOn = false;
return;
}if (this.vibrationThread == null) {
this.vibrationThread =  new org.jmol.thread.VibrationThread (this, this.viewer);
this.vibrationThread.start ();
}this.vibrationOn = true;
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "clearVibration", 
($fz = function () {
this.setVibrationOn (false);
this.vibrationScale = 0;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setStereoMode2", 
function (twoColors) {
this.stereoMode = org.jmol.constant.EnumStereoMode.CUSTOM;
this.stereoColors = twoColors;
}, "~A");
Clazz.defineMethod (c$, "setStereoMode", 
function (stereoMode) {
this.stereoColors = null;
this.stereoMode = stereoMode;
}, "org.jmol.constant.EnumStereoMode");
Clazz.defineMethod (c$, "setStereoDegrees", 
function (stereoDegrees) {
this.stereoDegrees = stereoDegrees;
this.stereoRadians = stereoDegrees * 0.017453292;
}, "~N");
Clazz.defineMethod (c$, "getStereoRotationMatrix", 
function (stereoFrame) {
this.stereoFrame = stereoFrame;
if (!stereoFrame) return this.matrixRotate;
this.matrixTemp3.rotY (-this.stereoRadians);
this.matrixStereo.mul2 (this.matrixTemp3, this.matrixRotate);
return this.matrixStereo;
}, "~B");
Clazz.defineMethod (c$, "isWindowCentered", 
function () {
return this.windowCentered;
});
Clazz.defineMethod (c$, "setWindowCentered", 
function (TF) {
this.windowCentered = TF;
this.resetNavigationPoint (true);
}, "~B");
Clazz.defineMethod (c$, "getRotationCenter", 
function () {
return this.fixedRotationCenter;
});
Clazz.defineMethod (c$, "getRotationRadius", 
function () {
return this.modelRadius;
});
Clazz.defineMethod (c$, "setRotationRadius", 
function (angstroms, doAll) {
angstroms = (this.modelRadius = (angstroms <= 0 ? this.viewer.calcRotationRadius (this.fixedRotationCenter) : angstroms));
if (doAll) this.viewer.setRotationRadius (angstroms, false);
return angstroms;
}, "~N,~B");
Clazz.defineMethod (c$, "setRotationCenterAndRadiusXYZ", 
($fz = function (newCenterOfRotation, andRadius) {
this.resetNavigationPoint (false);
if (newCenterOfRotation == null) {
this.setFixedRotationCenter (this.rotationCenterDefault);
this.modelRadius = this.rotationRadiusDefault;
return;
}this.setFixedRotationCenter (newCenterOfRotation);
if (andRadius && this.windowCentered) this.modelRadius = this.viewer.calcRotationRadius (this.fixedRotationCenter);
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f,~B");
Clazz.defineMethod (c$, "setRotCenterRel", 
($fz = function (relativeTo, pt) {
var pt1 = org.jmol.util.Point3f.newP (pt);
if (relativeTo === "average") pt1.add (this.viewer.getAverageAtomPoint ());
 else if (relativeTo === "boundbox") pt1.add (this.viewer.getBoundBoxCenter ());
 else if (relativeTo !== "absolute") pt1.setT (this.rotationCenterDefault);
this.setRotationCenterAndRadiusXYZ (pt1, true);
}, $fz.isPrivate = true, $fz), "~S,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "setNewRotationCenter", 
function (center, doScale) {
if (center == null) center = this.rotationCenterDefault;
if (this.windowCentered) {
this.translateToPercent ('x', 0);
this.translateToPercent ('y', 0);
this.setRotationCenterAndRadiusXYZ (center, true);
if (doScale) this.resetFitToScreen (true);
} else {
this.moveRotationCenter (center, true);
}}, "org.jmol.util.Point3f,~B");
Clazz.defineMethod (c$, "moveRotationCenter", 
function (center, toXY) {
this.setRotationCenterAndRadiusXYZ (center, false);
if (toXY) this.setRotationPointXY (this.fixedRotationCenter);
}, "org.jmol.util.Point3f,~B");
Clazz.defineMethod (c$, "setCenter", 
function () {
this.setRotationCenterAndRadiusXYZ (this.fixedRotationCenter, true);
});
Clazz.defineMethod (c$, "setCenterAt", 
function (relativeTo, pt) {
this.setRotCenterRel (relativeTo, pt);
this.resetFitToScreen (true);
}, "~S,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "canNavigate", 
function () {
return false;
});
Clazz.defineMethod (c$, "navigate", 
function (keyCode, modifiers) {
}, "~N,~N");
Clazz.defineMethod (c$, "navigatePt", 
function (seconds, center) {
}, "~N,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "navigateAxis", 
function (seconds, rotAxis, degrees) {
}, "~N,org.jmol.util.Vector3f,~N");
Clazz.defineMethod (c$, "navigatePath", 
function (seconds, path, theta, indexStart, indexEnd) {
}, "~N,~A,~A,~N,~N");
Clazz.defineMethod (c$, "navigateGuide", 
function (timeSeconds, pathGuide) {
}, "~N,~A");
Clazz.defineMethod (c$, "navTranslate", 
function (seconds, pt) {
}, "~N,org.jmol.util.Point3f");
Clazz.defineMethod (c$, "navTranslatePercent", 
function (seconds, x, y) {
}, "~N,~N,~N");
Clazz.defineMethod (c$, "calcNavigationPoint", 
function () {
});
Clazz.defineMethod (c$, "resetNavigationPoint", 
function (doResetSlab) {
}, "~B");
Clazz.defineMethod (c$, "getNavigationState", 
function () {
return "";
});
Clazz.defineMethod (c$, "setNavigationDepthPercent", 
function (timeSec, percent) {
this.viewer.getGlobalSettings ().setParamF ("navigationDepth", percent);
}, "~N,~N");
Clazz.defineMethod (c$, "getNavigationCenter", 
function () {
return null;
});
Clazz.defineMethod (c$, "getNavigationOffset", 
function () {
return null;
});
Clazz.defineMethod (c$, "getNavigationDepthPercent", 
function () {
return NaN;
});
Clazz.defineMethod (c$, "getNavigationOffsetPercent", 
function (XorY) {
return 0;
}, "~S");
Clazz.defineMethod (c$, "setNavigationSlabOffsetPercent", 
function (offset) {
this.viewer.getGlobalSettings ().setParamF ("navigationSlab", offset);
}, "~N");
Clazz.defineMethod (c$, "getNavigationText", 
function (addComments) {
return "";
}, "~B");
Clazz.defineMethod (c$, "setFrameOffset", 
function (modelIndex) {
if (this.frameOffsets == null || modelIndex < 0 || modelIndex >= this.frameOffsets.length) this.frameOffset.set (0, 0, 0);
 else this.frameOffset.setT (this.frameOffsets[modelIndex]);
}, "~N");
Clazz.defineMethod (c$, "setFrameOffsets", 
function (offsets) {
this.frameOffsets = offsets;
}, "~A");
Clazz.defineMethod (c$, "navigateSurface", 
function (timeSeconds, name) {
}, "~N,~S");
Clazz.defineMethod (c$, "setSelectedTranslation", 
function (bsAtoms, xyz, xy) {
this.bsSelectedAtoms = bsAtoms;
switch (xyz) {
case 'X':
case 'x':
this.ptOffset.x += xy;
break;
case 'Y':
case 'y':
this.ptOffset.y += xy;
break;
case 'Z':
case 'z':
this.ptOffset.z += xy;
break;
}
}, "org.jmol.util.BitSet,~S,~N");
Clazz.defineStatics (c$,
"twoPI", 6.283185307179586,
"degreesPerRadian", 57.29577951308232,
"DEFAULT_NAV_FPS", 10,
"DEFAULT_SPIN_Y", 30,
"DEFAULT_SPIN_FPS", 30,
"MAXIMUM_ZOOM_PERCENTAGE", 200000,
"MAXIMUM_ZOOM_PERSPECTIVE_DEPTH", 10000,
"MODE_STANDARD", 0,
"MODE_NAVIGATION", 1,
"MODE_PERSPECTIVE_CENTER", 2,
"DEFAULT_PERSPECTIVE_MODEL", 11);
});
