﻿Clazz.declarePackage ("org.jmol.renderspecial");
Clazz.load (["org.jmol.render.ShapeRenderer", "org.jmol.util.Point3f", "$.Point3i", "$.Vector3f"], "org.jmol.renderspecial.VectorsRenderer", ["org.jmol.shape.Shape"], function () {
c$ = Clazz.decorateAsClass (function () {
this.vector2 = null;
this.pointVectorEnd = null;
this.pointArrowHead = null;
this.screenVectorEnd = null;
this.screenArrowHead = null;
this.headOffsetVector = null;
this.diameter = 0;
this.headWidthPixels = 0;
this.vectorScale = 0;
this.vectorSymmetry = false;
this.headScale = 0;
this.doShaft = false;
Clazz.instantialize (this, arguments);
}, org.jmol.renderspecial, "VectorsRenderer", org.jmol.render.ShapeRenderer);
Clazz.prepareFields (c$, function () {
this.vector2 =  new org.jmol.util.Vector3f ();
this.pointVectorEnd =  new org.jmol.util.Point3f ();
this.pointArrowHead =  new org.jmol.util.Point3f ();
this.screenVectorEnd =  new org.jmol.util.Point3i ();
this.screenArrowHead =  new org.jmol.util.Point3i ();
this.headOffsetVector =  new org.jmol.util.Vector3f ();
});
Clazz.defineMethod (c$, "render", 
function () {
var vectors = this.shape;
if (!vectors.isActive) return false;
var mads = vectors.mads;
if (mads == null) return false;
var atoms = vectors.atoms;
var colixes = vectors.colixes;
var needTranslucent = false;
for (var i = this.modelSet.getAtomCount (); --i >= 0; ) {
var atom = atoms[i];
if (!atom.isVisible (this.myVisibilityFlag)) continue;
var vibrationVector = this.viewer.getVibrationVector (i);
if (vibrationVector == null) continue;
this.vectorScale = this.viewer.getVectorScale ();
this.vectorSymmetry = this.viewer.getVectorSymmetry ();
if (!this.transform (mads[i], atom, vibrationVector)) continue;
if (!this.g3d.setColix (org.jmol.shape.Shape.getColix (colixes, i, atom))) {
needTranslucent = true;
continue;
}this.renderVector (atom);
if (this.vectorSymmetry) {
this.vector2.setT (vibrationVector);
this.vector2.scale (-1);
this.transform (mads[i], atom, this.vector2);
this.renderVector (atom);
}}
return needTranslucent;
});
Clazz.defineMethod (c$, "transform", 
($fz = function (mad, atom, vibrationVector) {
var len = vibrationVector.length ();
if (Math.abs (len * this.vectorScale) < 0.01) return false;
this.headScale = -0.2;
if (this.vectorScale < 0) this.headScale = -this.headScale;
this.doShaft = (0.1 + Math.abs (this.headScale / len) < Math.abs (this.vectorScale));
this.headOffsetVector.setT (vibrationVector);
this.headOffsetVector.scale (this.headScale / len);
this.pointVectorEnd.scaleAdd2 (this.vectorScale, vibrationVector, atom);
this.pointArrowHead.setT (this.pointVectorEnd);
this.pointArrowHead.add (this.headOffsetVector);
this.screenArrowHead.setT (this.viewer.transformPtVib (this.pointArrowHead, vibrationVector));
this.screenVectorEnd.setT (this.viewer.transformPtVib (this.pointVectorEnd, vibrationVector));
this.diameter = (mad < 1 ? 1 : mad <= 20 ? mad : this.viewer.scaleToScreen (this.screenVectorEnd.z, mad));
this.headWidthPixels = Math.round (this.diameter * 2.0);
if (this.headWidthPixels < this.diameter + 2) this.headWidthPixels = this.diameter + 2;
return true;
}, $fz.isPrivate = true, $fz), "~N,org.jmol.modelset.Atom,org.jmol.util.Vector3f");
Clazz.defineMethod (c$, "renderVector", 
($fz = function (atom) {
if (this.doShaft) this.g3d.fillCylinderScreen (1, this.diameter, atom.screenX, atom.screenY, atom.screenZ, this.screenArrowHead.x, this.screenArrowHead.y, this.screenArrowHead.z);
this.g3d.fillConeScreen (2, this.headWidthPixels, this.screenArrowHead, this.screenVectorEnd, false);
}, $fz.isPrivate = true, $fz), "org.jmol.modelset.Atom");
Clazz.defineStatics (c$,
"arrowHeadOffset", -0.2);
});
