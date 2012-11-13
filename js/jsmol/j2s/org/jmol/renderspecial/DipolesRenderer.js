﻿Clazz.declarePackage ("org.jmol.renderspecial");
Clazz.load (["org.jmol.render.ShapeRenderer", "org.jmol.util.Point3f", "$.Vector3f"], "org.jmol.renderspecial.DipolesRenderer", ["org.jmol.util.Colix", "$.Point3i"], function () {
c$ = Clazz.decorateAsClass (function () {
this.dipoleVectorScale = 0;
this.offset = null;
this.screens = null;
this.points = null;
this.cross0 = null;
this.cross1 = null;
this.diameter = 0;
this.headWidthPixels = 0;
this.crossWidthPixels = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.renderspecial, "DipolesRenderer", org.jmol.render.ShapeRenderer);
Clazz.prepareFields (c$, function () {
this.offset =  new org.jmol.util.Vector3f ();
this.screens =  new Array (6);
this.points =  new Array (6);
{
for (var i = 0; i < 6; i++) {
this.screens[i] =  new org.jmol.util.Point3i ();
this.points[i] =  new org.jmol.util.Point3f ();
}
}this.cross0 =  new org.jmol.util.Point3f ();
this.cross1 =  new org.jmol.util.Point3f ();
});
Clazz.defineMethod (c$, "render", 
function () {
var dipoles = this.shape;
this.dipoleVectorScale = this.viewer.getDipoleScale ();
var needTranslucent = false;
for (var i = dipoles.dipoleCount; --i >= 0; ) {
var dipole = dipoles.dipoles[i];
if (dipole.visibilityFlags != 0 && this.transform (dipole) && this.renderDipoleVector (dipole)) needTranslucent = true;
}
return needTranslucent;
});
Clazz.defineMethod (c$, "transform", 
($fz = function (dipole) {
var vector = dipole.vector;
this.offset.setT (vector);
if (dipole.center == null) {
this.offset.scale (dipole.offsetAngstroms / dipole.dipoleValue);
if (this.dipoleVectorScale < 0) this.offset.add (vector);
this.points[0].setT (dipole.origin);
this.points[0].add (this.offset);
} else {
this.offset.scale (-0.5 * this.dipoleVectorScale);
this.points[0].setT (dipole.center);
this.points[0].add (this.offset);
if (dipole.offsetAngstroms != 0) {
this.offset.setT (vector);
this.offset.scale (dipole.offsetAngstroms / dipole.dipoleValue);
this.points[0].add (this.offset);
}}this.points[1].scaleAdd2 (this.dipoleVectorScale * 0.1, vector, this.points[0]);
this.points[2].scaleAdd2 (this.dipoleVectorScale * (0.14), vector, this.points[0]);
this.points[3].scaleAdd2 (this.dipoleVectorScale / 2, vector, this.points[0]);
this.points[4].scaleAdd2 (this.dipoleVectorScale * 0.9, vector, this.points[0]);
this.points[5].scaleAdd2 (this.dipoleVectorScale, vector, this.points[0]);
if (dipole.atoms[0] != null && this.modelSet.isAtomHidden (dipole.atoms[0].getIndex ())) return false;
this.offset.setT (this.points[3]);
this.offset.cross (this.offset, vector);
if (this.offset.length () == 0) {
this.offset.set (this.points[3].x + 0.2345, this.points[3].y + 0.1234, this.points[3].z + 0.4321);
this.offset.cross (this.offset, vector);
}this.offset.scale (dipole.offsetSide / this.offset.length ());
for (var i = 0; i < 6; i++) this.points[i].add (this.offset);

for (var i = 0; i < 6; i++) this.viewer.transformPtScr (this.points[i], this.screens[i]);

this.viewer.transformPt3f (this.points[1], this.cross0);
this.viewer.transformPt3f (this.points[2], this.cross1);
this.mad = dipole.mad;
this.diameter = this.viewer.scaleToScreen (this.screens[3].z, this.mad);
this.headWidthPixels = Clazz.doubleToInt (Math.floor (this.diameter * 2.0));
if (this.headWidthPixels < this.diameter + 5) this.headWidthPixels = this.diameter + 5;
this.crossWidthPixels = this.headWidthPixels;
return true;
}, $fz.isPrivate = true, $fz), "org.jmol.shapespecial.Dipole");
Clazz.defineMethod (c$, "renderDipoleVector", 
($fz = function (dipole) {
var colixA = (dipole.bond == null ? dipole.colix : org.jmol.util.Colix.getColixInherited (dipole.colix, dipole.bond.getColix ()));
var colixB = colixA;
if (dipole.atoms[0] != null) {
colixA = org.jmol.util.Colix.getColixInherited (colixA, dipole.atoms[0].getColix ());
colixB = org.jmol.util.Colix.getColixInherited (colixB, dipole.atoms[1].getColix ());
}if (colixA == 0) colixA = 5;
if (colixB == 0) colixB = 5;
if (this.dipoleVectorScale < 0) {
var c = colixA;
colixA = colixB;
colixB = c;
}this.colix = colixA;
if (this.colix == colixB) {
if (!this.g3d.setColix (this.colix)) return true;
this.g3d.fillCylinder (1, this.diameter, this.screens[0], this.screens[4]);
if (!dipole.noCross) this.g3d.fillCylinderBits (2, this.crossWidthPixels, this.cross0, this.cross1);
this.g3d.fillConeScreen (2, this.headWidthPixels, this.screens[4], this.screens[5], false);
return false;
}var needTranslucent = false;
if (this.g3d.setColix (this.colix)) {
this.g3d.fillCylinder (1, this.diameter, this.screens[0], this.screens[3]);
if (!dipole.noCross) this.g3d.fillCylinderBits (2, this.crossWidthPixels, this.cross0, this.cross1);
} else {
needTranslucent = true;
}this.colix = colixB;
if (this.g3d.setColix (this.colix)) {
this.g3d.fillCylinder (4, this.diameter, this.screens[3], this.screens[4]);
this.g3d.fillConeScreen (2, this.headWidthPixels, this.screens[4], this.screens[5], false);
} else {
needTranslucent = true;
}return needTranslucent;
}, $fz.isPrivate = true, $fz), "org.jmol.shapespecial.Dipole");
Clazz.defineStatics (c$,
"cylinderBase", 0,
"cross", 1,
"crossEnd", 2,
"center", 3,
"arrowHeadBase", 4,
"arrowHeadTip", 5,
"arrowHeadOffset", 0.9,
"arrowHeadWidthFactor", 2,
"crossOffset", 0.1,
"crossWidth", 0.04);
});
