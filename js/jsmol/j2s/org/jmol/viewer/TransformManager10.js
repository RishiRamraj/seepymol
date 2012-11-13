Clazz.declarePackage ("org.jmol.viewer");
Clazz.load (["org.jmol.viewer.TransformManager"], "org.jmol.viewer.TransformManager10", ["java.lang.Float", "org.jmol.util.Logger"], function () {
c$ = Clazz.declareType (org.jmol.viewer, "TransformManager10", org.jmol.viewer.TransformManager);
Clazz.makeConstructor (c$, 
function (viewer) {
Clazz.superConstructor (this, org.jmol.viewer.TransformManager10, [viewer]);
this.perspectiveModel = 10;
}, "org.jmol.viewer.Viewer");
Clazz.makeConstructor (c$, 
function (viewer, width, height) {
Clazz.superConstructor (this, org.jmol.viewer.TransformManager10, [viewer, width, height]);
this.perspectiveModel = 10;
}, "org.jmol.viewer.Viewer,~N,~N");
Clazz.overrideMethod (c$, "calcCameraFactors", 
function () {
if (Float.isNaN (this.cameraDepth)) {
this.cameraDepth = this.cameraDepthSetting;
}this.cameraDistance = this.cameraDepth * this.screenPixelCount;
this.cameraScaleFactor = 1.02 + 0.5 / this.cameraDepth;
this.scalePixelsPerAngstrom = (this.scale3D && !this.perspectiveDepth ? 72 / this.scale3DAngstromsPerInch * (this.antialias ? 2 : 1) : this.scaleDefaultPixelsPerAngstrom * this.zoomPercent / 100 * this.cameraScaleFactor);
this.modelRadiusPixels = this.modelRadius * this.scalePixelsPerAngstrom;
this.modelCenterOffset = this.cameraDistance + this.modelRadiusPixels;
this.referencePlaneOffset = this.cameraDistance;
});
Clazz.overrideMethod (c$, "getPerspectiveFactor", 
function (z) {
var factor = (z <= 0 ? this.referencePlaneOffset : this.referencePlaneOffset / z);
if (this.zoomPercent >= 10000) factor += (this.zoomPercent - 10000) / (190000) * (1 - factor);
return factor;
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
if (this.perspectiveDepth) {
var factor = this.getPerspectiveFactor (z);
this.point3fScreenTemp.x *= factor;
this.point3fScreenTemp.y *= factor;
}this.point3fScreenTemp.x += this.fixedRotationOffset.x;
this.point3fScreenTemp.y += this.fixedRotationOffset.y;
if (Float.isNaN (this.point3fScreenTemp.x) && !this.haveNotifiedNaN) {
org.jmol.util.Logger.debug ("NaN found in transformPoint ");
this.haveNotifiedNaN = true;
}this.point3iScreenTemp.set (Clazz.floatToInt (this.point3fScreenTemp.x), Clazz.floatToInt (this.point3fScreenTemp.y), Clazz.floatToInt (this.point3fScreenTemp.z));
});
});
