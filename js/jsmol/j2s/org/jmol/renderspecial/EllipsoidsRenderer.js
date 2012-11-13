﻿Clazz.declarePackage ("org.jmol.renderspecial");
Clazz.load (["org.jmol.render.ShapeRenderer", "org.jmol.util.BitSet", "$.Matrix3f", "$.Matrix4f", "$.Point3f", "$.Point3i", "$.Vector3f", "org.jmol.viewer.JmolConstants"], "org.jmol.renderspecial.EllipsoidsRenderer", ["java.lang.Float", "org.jmol.shape.Shape", "org.jmol.util.Normix", "$.Quadric"], function () {
c$ = Clazz.decorateAsClass (function () {
this.ellipsoids = null;
this.drawDots = false;
this.drawArcs = false;
this.drawAxes = false;
this.drawFill = false;
this.drawBall = false;
this.wireframeOnly = false;
this.dotCount = 0;
this.coords = null;
this.axes = null;
this.factoredLengths = null;
this.diameter = 0;
this.diameter0 = 0;
this.selectedOctant = -1;
this.selectedPoints = null;
this.iCutout = -1;
this.mat = null;
this.mTemp = null;
this.mDeriv = null;
this.matScreenToCartesian = null;
this.matScreenToEllipsoid = null;
this.matEllipsoidToScreen = null;
this.coef = null;
this.v1 = null;
this.v2 = null;
this.v3 = null;
this.pt1 = null;
this.pt2 = null;
this.s0 = null;
this.s1 = null;
this.s2 = null;
this.dotScale = 0;
this.screens = null;
this.points = null;
this.dx = 0;
this.perspectiveFactor = 0;
this.center = null;
this.fillArc = false;
this.bsTemp = null;
Clazz.instantialize (this, arguments);
}, org.jmol.renderspecial, "EllipsoidsRenderer", org.jmol.render.ShapeRenderer);
Clazz.prepareFields (c$, function () {
this.factoredLengths =  Clazz.newFloatArray (3, 0);
this.selectedPoints =  new Array (3);
this.mat =  new org.jmol.util.Matrix3f ();
this.mTemp =  new org.jmol.util.Matrix3f ();
this.mDeriv =  new org.jmol.util.Matrix4f ();
this.matScreenToCartesian =  new org.jmol.util.Matrix3f ();
this.matScreenToEllipsoid =  new org.jmol.util.Matrix3f ();
this.matEllipsoidToScreen =  new org.jmol.util.Matrix3f ();
this.coef =  Clazz.newDoubleArray (10, 0);
this.v1 =  new org.jmol.util.Vector3f ();
this.v2 =  new org.jmol.util.Vector3f ();
this.v3 =  new org.jmol.util.Vector3f ();
this.pt1 =  new org.jmol.util.Point3f ();
this.pt2 =  new org.jmol.util.Point3f ();
this.s0 =  new org.jmol.util.Point3i ();
this.s1 =  new org.jmol.util.Point3i ();
this.s2 =  new org.jmol.util.Point3i ();
this.screens =  new Array (32);
this.points =  new Array (6);
{
for (var i = 0; i < this.points.length; i++) this.points[i] =  new org.jmol.util.Point3f ();

for (var i = 0; i < this.screens.length; i++) this.screens[i] =  new org.jmol.util.Point3i ();

}this.bsTemp =  new org.jmol.util.BitSet ();
});
Clazz.defineMethod (c$, "render", 
function () {
this.ellipsoids = this.shape;
if (this.ellipsoids.madset == null && !this.ellipsoids.haveEllipsoids) return false;
this.wireframeOnly = (this.viewer.getWireframeRotation () && this.viewer.getInMotion ());
this.drawAxes = this.viewer.getBooleanProperty ("ellipsoidAxes");
this.drawArcs = this.viewer.getBooleanProperty ("ellipsoidArcs");
this.drawBall = this.viewer.getBooleanProperty ("ellipsoidBall") && !this.wireframeOnly;
this.drawDots = this.viewer.getBooleanProperty ("ellipsoidDots") && !this.wireframeOnly;
this.drawFill = this.viewer.getBooleanProperty ("ellipsoidFill") && !this.wireframeOnly;
this.fillArc = this.drawFill && !this.drawBall;
this.diameter0 = Math.round ((this.viewer.getParameter ("ellipsoidAxisDiameter")).floatValue () * 1000);
if (this.drawBall) this.drawDots = false;
if (!this.drawDots && !this.drawArcs && !this.drawBall) this.drawAxes = true;
if (this.drawDots) {
this.drawArcs = false;
this.drawFill = false;
this.dotScale = this.viewer.getDotScale ();
}if (this.drawDots) {
this.dotCount = (this.viewer.getParameter ("ellipsoidDotCount")).intValue ();
if (this.coords == null || this.coords.length != this.dotCount * 3) this.coords =  Clazz.newIntArray (this.dotCount * 3, 0);
}var m4 = this.viewer.getMatrixtransform ();
m4.setRotationScale (this.mat);
this.matScreenToCartesian.invertM (this.mat);
var needTranslucent = false;
var atoms = this.modelSet.atoms;
for (var i = this.modelSet.getAtomCount (); --i >= 0; ) {
var atom = atoms[i];
if (!atom.isVisible (this.myVisibilityFlag)) continue;
if (atom.screenZ <= 1) continue;
var ellipsoid2 = atom.getEllipsoid ();
if (ellipsoid2 == null) continue;
for (var j = 0; j < ellipsoid2.length; j++) {
if (ellipsoid2[j] == null || this.ellipsoids.madset[j] == null || this.ellipsoids.madset[j][i] == 0) continue;
this.colix = org.jmol.shape.Shape.getColix (this.ellipsoids.colixset[j], i, atom);
if (this.g3d.setColix (this.colix)) this.render1 (atom, ellipsoid2[j]);
 else needTranslucent = true;
}
}
if (this.ellipsoids.haveEllipsoids) {
var e = this.ellipsoids.htEllipsoids.values ().iterator ();
while (e.hasNext ()) {
var ellipsoid = e.next ();
if (ellipsoid.visible && ellipsoid.isValid) {
if (this.g3d.setColix (this.colix = ellipsoid.colix)) this.renderEllipsoid (ellipsoid);
 else needTranslucent = true;
}}
}this.coords = null;
return needTranslucent;
});
Clazz.defineMethod (c$, "render1", 
($fz = function (atom, ellipsoid) {
this.s0.set (atom.screenX, atom.screenY, atom.screenZ);
var isOK = true;
for (var i = 3; --i >= 0; ) {
this.factoredLengths[i] = ellipsoid.lengths[i] * ellipsoid.$scale;
if (Float.isNaN (this.factoredLengths[i])) isOK = false;
 else if (this.factoredLengths[i] < 0.2) this.factoredLengths[i] = 0.2;
}
this.axes = ellipsoid.vectors;
if (this.axes == null) {
this.axes = org.jmol.renderspecial.EllipsoidsRenderer.unitVectors;
}this.setMatrices ();
this.center = atom;
this.setAxes (1.0);
if (this.g3d.isClippedXY (this.dx + this.dx, atom.screenX, atom.screenY)) return;
this.diameter = this.viewer.scaleToScreen (atom.screenZ, this.wireframeOnly ? 1 : this.diameter0);
if (!isOK || this.drawBall) {
this.renderBall ();
if (!isOK) return;
if (this.drawArcs || this.drawAxes) {
this.g3d.setColix (this.viewer.getColixBackgroundContrast ());
if (this.drawAxes) this.renderAxes ();
if (this.drawArcs) this.renderArcs (atom);
this.g3d.setColix (this.colix);
}} else {
if (this.drawAxes) this.renderAxes ();
if (this.drawArcs) this.renderArcs (atom);
}if (this.drawDots) this.renderDots (atom);
}, $fz.isPrivate = true, $fz), "org.jmol.modelset.Atom,org.jmol.util.Quadric");
Clazz.defineMethod (c$, "setMatrices", 
($fz = function () {
org.jmol.util.Quadric.setEllipsoidMatrix (this.axes, this.factoredLengths, this.v1, this.mat);
this.matScreenToEllipsoid.mul2 (this.mat, this.matScreenToCartesian);
this.matEllipsoidToScreen.invertM (this.matScreenToEllipsoid);
this.perspectiveFactor = this.viewer.scaleToPerspective (this.s0.z, 1.0);
this.matScreenToEllipsoid.mulf (1 / this.perspectiveFactor);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setAxes", 
($fz = function (f) {
for (var i = 0; i < 6; i++) {
var iAxis = org.jmol.renderspecial.EllipsoidsRenderer.axisPoints[i];
var i012 = Math.abs (iAxis) - 1;
this.points[i].scaleAdd2 (f * this.factoredLengths[i012] * (iAxis < 0 ? -1 : 1), this.axes[i012], this.center);
this.pt1.setT (org.jmol.renderspecial.EllipsoidsRenderer.unitAxisVectors[i]);
this.pt1.scale (f);
this.matEllipsoidToScreen.transform (this.pt1);
this.screens[i].set (Math.round (this.s0.x + this.pt1.x * this.perspectiveFactor), Math.round (this.s0.y + this.pt1.y * this.perspectiveFactor), Math.round (this.pt1.z + this.s0.z));
}
this.dx = 2 + this.viewer.scaleToScreen (this.s0.z, Math.round (f * (Float.isNaN (this.factoredLengths[2]) ? 1.0 : this.factoredLengths[2]) * 1000));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "renderAxes", 
($fz = function () {
if (this.drawBall && this.drawFill) {
this.g3d.fillCylinder (2, this.diameter, this.s0, this.selectedPoints[0]);
this.g3d.fillCylinder (2, this.diameter, this.s0, this.selectedPoints[1]);
this.g3d.fillCylinder (2, this.diameter, this.s0, this.selectedPoints[2]);
return;
}this.g3d.fillCylinder (2, this.diameter, this.screens[0], this.screens[1]);
this.g3d.fillCylinder (2, this.diameter, this.screens[2], this.screens[3]);
this.g3d.fillCylinder (2, this.diameter, this.screens[4], this.screens[5]);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "renderDots", 
($fz = function (ptAtom) {
for (var i = 0; i < this.coords.length; ) {
var fx = Math.random ();
var fy = Math.random ();
fx *= (Math.random () > 0.5 ? -1 : 1);
fy *= (Math.random () > 0.5 ? -1 : 1);
var fz = Math.sqrt (1 - fx * fx - fy * fy);
if (Float.isNaN (fz)) continue;
fz = (Math.random () > 0.5 ? -1 : 1) * fz;
this.pt1.scaleAdd2 (fx * this.factoredLengths[0], this.axes[0], ptAtom);
this.pt1.scaleAdd2 (fy * this.factoredLengths[1], this.axes[1], this.pt1);
this.pt1.scaleAdd2 (fz * this.factoredLengths[2], this.axes[2], this.pt1);
this.viewer.transformPtScr (this.pt1, this.s1);
this.coords[i++] = this.s1.x;
this.coords[i++] = this.s1.y;
this.coords[i++] = this.s1.z;
}
this.g3d.drawPoints (this.dotCount, this.coords, this.dotScale);
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "renderArcs", 
($fz = function (ptAtom) {
if (this.g3d.drawEllipse (ptAtom, this.points[0], this.points[2], this.fillArc, this.wireframeOnly)) {
this.g3d.drawEllipse (ptAtom, this.points[2], this.points[5], this.fillArc, this.wireframeOnly);
this.g3d.drawEllipse (ptAtom, this.points[5], this.points[0], this.fillArc, this.wireframeOnly);
return;
}for (var i = 1; i < 8; i += 2) {
var pt = i * 3;
this.renderArc (ptAtom, org.jmol.renderspecial.EllipsoidsRenderer.octants[pt], org.jmol.renderspecial.EllipsoidsRenderer.octants[pt + 1]);
this.renderArc (ptAtom, org.jmol.renderspecial.EllipsoidsRenderer.octants[pt + 1], org.jmol.renderspecial.EllipsoidsRenderer.octants[pt + 2]);
this.renderArc (ptAtom, org.jmol.renderspecial.EllipsoidsRenderer.octants[pt + 2], org.jmol.renderspecial.EllipsoidsRenderer.octants[pt]);
}
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "renderArc", 
($fz = function (ptAtom, ptA, ptB) {
this.v1.setT (this.points[ptA]);
this.v1.sub (ptAtom);
this.v2.setT (this.points[ptB]);
this.v2.sub (ptAtom);
var d1 = this.v1.length ();
var d2 = this.v2.length ();
this.v1.normalize ();
this.v2.normalize ();
this.v3.cross (this.v1, this.v2);
this.pt1.setT (this.points[ptA]);
this.s1.setT (this.screens[ptA]);
var normix = org.jmol.util.Normix.get2SidedNormix (this.v3, this.bsTemp);
if (!this.fillArc && !this.wireframeOnly) this.screens[6].setT (this.s1);
for (var i = 0, pt = 0; i < 18; i++, pt += 2) {
this.pt2.scaleAdd2 (org.jmol.renderspecial.EllipsoidsRenderer.cossin[pt] * d1, this.v1, ptAtom);
this.pt2.scaleAdd2 (org.jmol.renderspecial.EllipsoidsRenderer.cossin[pt + 1] * d2, this.v2, this.pt2);
this.viewer.transformPtScr (this.pt2, this.s2);
if (this.fillArc) this.g3d.fillTriangle3CN (this.s0, this.colix, normix, this.s1, this.colix, normix, this.s2, this.colix, normix);
 else if (this.wireframeOnly) this.g3d.fillCylinder (2, this.diameter, this.s1, this.s2);
 else this.screens[i + 7].setT (this.s2);
this.pt1.setT (this.pt2);
this.s1.setT (this.s2);
}
if (!this.fillArc && !this.wireframeOnly) for (var i = 0; i < 18; i++) {
this.g3d.fillHermite (5, this.diameter, this.diameter, this.diameter, this.screens[i == 0 ? i + 6 : i + 5], this.screens[i + 6], this.screens[i + 7], this.screens[i == 17 ? i + 7 : i + 8]);
}
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f,~N,~N");
Clazz.defineMethod (c$, "renderEllipsoid", 
function (ellipsoid) {
this.axes = ellipsoid.axes;
for (var i = 0; i < 3; i++) this.factoredLengths[i] = ellipsoid.lengths[i];

this.viewer.transformPtScr (ellipsoid.center, this.s0);
this.setMatrices ();
this.center = ellipsoid.center;
this.setAxes (1);
this.renderBall ();
}, "org.jmol.shapespecial.Ellipsoids.Ellipsoid");
Clazz.defineMethod (c$, "renderBall", 
function () {
this.setSelectedOctant ();
org.jmol.util.Quadric.getEquationForQuadricWithCenter (this.s0.x, this.s0.y, this.s0.z, this.matScreenToEllipsoid, this.v1, this.mTemp, this.coef, this.mDeriv);
this.g3d.fillEllipsoid (this.center, this.points, this.s0.x, this.s0.y, this.s0.z, this.dx + this.dx, this.matScreenToEllipsoid, this.coef, this.mDeriv, this.selectedOctant, this.selectedOctant >= 0 ? this.selectedPoints : null);
});
Clazz.defineMethod (c$, "setSelectedOctant", 
($fz = function () {
var zMin = 2147483647;
this.selectedOctant = -1;
this.iCutout = -1;
if (this.drawFill) {
for (var i = 0; i < 8; i++) {
var ptA = org.jmol.renderspecial.EllipsoidsRenderer.octants[i * 3];
var ptB = org.jmol.renderspecial.EllipsoidsRenderer.octants[i * 3 + 1];
var ptC = org.jmol.renderspecial.EllipsoidsRenderer.octants[i * 3 + 2];
var z = this.screens[ptA].z + this.screens[ptB].z + this.screens[ptC].z;
if (z < zMin) {
zMin = z;
this.iCutout = i;
}}
this.s1.setT (this.selectedPoints[0] = this.screens[org.jmol.renderspecial.EllipsoidsRenderer.octants[this.iCutout * 3]]);
this.s1.add (this.selectedPoints[1] = this.screens[org.jmol.renderspecial.EllipsoidsRenderer.octants[this.iCutout * 3 + 1]]);
this.s1.add (this.selectedPoints[2] = this.screens[org.jmol.renderspecial.EllipsoidsRenderer.octants[this.iCutout * 3 + 2]]);
this.s1.scaleAdd (-3, this.s0, this.s1);
this.pt1.set (this.s1.x, this.s1.y, this.s1.z);
this.matScreenToEllipsoid.transform (this.pt1);
this.selectedOctant = org.jmol.util.Quadric.getOctant (this.pt1);
}}, $fz.isPrivate = true, $fz));
Clazz.defineStatics (c$,
"toRadians", 0.017453292,
"cossin",  Clazz.newFloatArray (36, 0));
{
for (var i = 5, pt = 0; i <= 90; i += 5) {
org.jmol.renderspecial.EllipsoidsRenderer.cossin[pt++] = Math.cos (i * 0.017453292);
org.jmol.renderspecial.EllipsoidsRenderer.cossin[pt++] = Math.sin (i * 0.017453292);
}
}Clazz.defineStatics (c$,
"axisPoints", [-1, 1, -2, 2, -3, 3],
"octants", [5, 0, 3, 5, 2, 0, 4, 0, 2, 4, 3, 0, 5, 2, 1, 5, 1, 3, 4, 3, 1, 4, 1, 2]);
c$.unitVectors = c$.prototype.unitVectors = [org.jmol.viewer.JmolConstants.axisX, org.jmol.viewer.JmolConstants.axisY, org.jmol.viewer.JmolConstants.axisZ];
c$.unitAxisVectors = c$.prototype.unitAxisVectors = [org.jmol.viewer.JmolConstants.axisNX, org.jmol.viewer.JmolConstants.axisX, org.jmol.viewer.JmolConstants.axisNY, org.jmol.viewer.JmolConstants.axisY, org.jmol.viewer.JmolConstants.axisNZ, org.jmol.viewer.JmolConstants.axisZ];
});
