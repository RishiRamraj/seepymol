﻿Clazz.declarePackage ("org.jmol.renderspecial");
Clazz.load (["org.jmol.render.MeshRenderer", "org.jmol.util.BitSet", "$.Point3f", "$.Point3i", "$.Vector3f"], "org.jmol.renderspecial.DrawRenderer", ["org.jmol.shapespecial.Draw", "org.jmol.util.AxisAngle4f", "$.Colix", "$.Hermite", "$.Matrix3f", "$.Measure"], function () {
c$ = Clazz.decorateAsClass (function () {
this.drawType = null;
this.dmesh = null;
this.controlHermites = null;
this.vpt0 = null;
this.vpt1 = null;
this.vpt2 = null;
this.vTemp = null;
this.vTemp2 = null;
this.pt0f = null;
this.pt0i = null;
this.bsHandles = null;
Clazz.instantialize (this, arguments);
}, org.jmol.renderspecial, "DrawRenderer", org.jmol.render.MeshRenderer);
Clazz.prepareFields (c$, function () {
this.vpt0 =  new org.jmol.util.Point3f ();
this.vpt1 =  new org.jmol.util.Point3f ();
this.vpt2 =  new org.jmol.util.Point3f ();
this.vTemp =  new org.jmol.util.Vector3f ();
this.vTemp2 =  new org.jmol.util.Vector3f ();
this.pt0f =  new org.jmol.util.Point3f ();
this.pt0i =  new org.jmol.util.Point3i ();
this.bsHandles =  new org.jmol.util.BitSet ();
});
Clazz.defineMethod (c$, "render", 
function () {
this.needTranslucent = false;
this.imageFontScaling = this.viewer.getImageFontScaling ();
var draw = this.shape;
for (var i = draw.meshCount; --i >= 0; ) if (this.renderMesh (this.dmesh = draw.meshes[i])) this.renderInfo ();

return this.needTranslucent;
});
Clazz.overrideMethod (c$, "isPolygonDisplayable", 
function (i) {
return org.jmol.shapespecial.Draw.isPolygonDisplayable (this.dmesh, i) && (this.dmesh.modelFlags == null || this.dmesh.bsMeshesVisible.get (i));
}, "~N");
Clazz.defineMethod (c$, "renderMesh", 
function (mesh) {
if (mesh.connections != null) {
if (mesh.connections[0] < 0) return false;
mesh.vertices =  new Array (4);
mesh.vertexCount = 4;
var c = mesh.connections;
for (var i = 0; i < 4; i++) {
mesh.vertices[i] = (c[i] < 0 ? mesh.vertices[i - 1] : this.viewer.getAtomPoint3f (c[i]));
}
mesh.recalcAltVertices = true;
}return Clazz.superCall (this, org.jmol.renderspecial.DrawRenderer, "renderMesh", [mesh]);
}, "org.jmol.shape.Mesh");
Clazz.defineMethod (c$, "render2", 
function (isExport) {
this.drawType = this.dmesh.drawType;
this.diameter = this.dmesh.diameter;
this.width = this.dmesh.width;
if (this.mesh.connections != null) this.getConnectionPoints ();
if (this.mesh.lineData != null) {
this.drawLineData (this.mesh.lineData);
return;
}var isDrawPickMode = (this.viewer.getPickingMode () == 4);
var nPoints = this.vertexCount;
var isCurved = ((this.drawType === org.jmol.shapespecial.Draw.EnumDrawType.CURVE || this.drawType === org.jmol.shapespecial.Draw.EnumDrawType.ARROW || this.drawType === org.jmol.shapespecial.Draw.EnumDrawType.ARC) && this.vertexCount >= 2);
var isSegments = (this.drawType === org.jmol.shapespecial.Draw.EnumDrawType.LINE_SEGMENT);
if (this.width > 0 && isCurved) {
this.pt1f.set (0, 0, 0);
var n = (this.drawType === org.jmol.shapespecial.Draw.EnumDrawType.ARC ? 2 : this.vertexCount);
for (var i = 0; i < n; i++) this.pt1f.add (this.vertices[i]);

this.pt1f.scale (1 / n);
this.viewer.transformPtScr (this.pt1f, this.pt1i);
this.diameter = this.viewer.scaleToScreen (this.pt1i.z, Clazz.doubleToInt (Math.floor (this.width * 1000)));
if (this.diameter == 0) this.diameter = 1;
}if ((this.dmesh.isVector) && this.dmesh.haveXyPoints) {
var ptXY = 0;
for (var i = 0; i < 2; i++) if (this.vertices[i].z == 3.4028235E38 || this.vertices[i].z == -3.4028235E38) ptXY += i + 1;

if (--ptXY < 2) {
this.renderXyArrow (ptXY);
return;
}}var tension = 5;
switch (this.drawType) {
default:
Clazz.superCall (this, org.jmol.renderspecial.DrawRenderer, "render2", [false]);
break;
case org.jmol.shapespecial.Draw.EnumDrawType.CIRCULARPLANE:
if (this.dmesh.scale > 0) this.width *= this.dmesh.scale;
Clazz.superCall (this, org.jmol.renderspecial.DrawRenderer, "render2", [false]);
break;
case org.jmol.shapespecial.Draw.EnumDrawType.CIRCLE:
this.viewer.transformPtScr (this.vertices[0], this.pt1i);
if (this.diameter == 0 && this.width == 0) this.width = 1.0;
if (this.dmesh.scale > 0) this.width *= this.dmesh.scale;
if (this.width > 0) this.diameter = this.viewer.scaleToScreen (this.pt1i.z, Clazz.doubleToInt (Math.floor (this.width * 1000)));
if (this.diameter > 0 && (this.mesh.drawTriangles || this.mesh.fillTriangles)) this.g3d.drawFilledCircle (this.colix, this.mesh.fillTriangles ? this.colix : 0, this.diameter, this.pt1i.x, this.pt1i.y, this.pt1i.z);
break;
case org.jmol.shapespecial.Draw.EnumDrawType.CURVE:
case org.jmol.shapespecial.Draw.EnumDrawType.LINE_SEGMENT:
break;
case org.jmol.shapespecial.Draw.EnumDrawType.ARC:
var nDegreesOffset = (this.vertexCount > 3 ? this.vertices[3].x : 0);
var theta = (this.vertexCount > 3 ? this.vertices[3].y : 360);
if (theta == 0) return;
var fractionalOffset = (this.vertexCount > 3 ? this.vertices[3].z : 0);
this.vTemp.setT (this.vertices[1]);
this.vTemp.sub (this.vertices[0]);
this.pt1f.scaleAdd2 (fractionalOffset, this.vTemp, this.vertices[0]);
var mat =  new org.jmol.util.Matrix3f ();
mat.setAA (org.jmol.util.AxisAngle4f.newVA (this.vTemp, (nDegreesOffset * 3.141592653589793 / 180)));
if (this.vertexCount > 2) this.vTemp2.setT (this.vertices[2]);
 else this.vTemp2.setT (org.jmol.shapespecial.Draw.randomPoint ());
this.vTemp2.sub (this.vertices[0]);
this.vTemp2.cross (this.vTemp, this.vTemp2);
this.vTemp2.cross (this.vTemp2, this.vTemp);
this.vTemp2.normalize ();
this.vTemp2.scale (this.dmesh.scale / 2);
mat.transform (this.vTemp2);
var degrees = theta / 5;
while (Math.abs (degrees) > 5) degrees /= 2;

nPoints = Math.round (theta / degrees) + 1;
while (nPoints < 10) {
degrees /= 2;
nPoints = Math.round (theta / degrees) + 1;
}
mat.setAA (org.jmol.util.AxisAngle4f.newVA (this.vTemp, (degrees * 3.141592653589793 / 180)));
this.screens = this.viewer.allocTempScreens (nPoints);
var iBase = nPoints - (this.dmesh.scale < 2 ? 3 : 3);
for (var i = 0; i < nPoints; i++) {
if (i == iBase) this.vpt0.setT (this.vpt1);
this.vpt1.scaleAdd2 (1, this.vTemp2, this.pt1f);
if (i == 0) this.vpt2.setT (this.vpt1);
this.viewer.transformPtScr (this.vpt1, this.screens[i]);
mat.transform (this.vTemp2);
}
if (this.dmesh.isVector && !this.dmesh.noHead) {
this.renderArrowHead (this.vpt0, this.vpt1, 0.3, false, false, this.dmesh.isBarb);
this.viewer.transformPtScr (this.pt1f, this.screens[nPoints - 1]);
}this.pt1f.setT (this.vpt2);
break;
case org.jmol.shapespecial.Draw.EnumDrawType.ARROW:
if (this.vertexCount == 2) {
this.renderArrowHead (this.vertices[0], this.vertices[1], 0, false, true, this.dmesh.isBarb);
break;
}var nHermites = 5;
if (this.controlHermites == null || this.controlHermites.length < nHermites + 1) {
this.controlHermites =  new Array (nHermites + 1);
}org.jmol.util.Hermite.getHermiteList (tension, this.vertices[this.vertexCount - 3], this.vertices[this.vertexCount - 2], this.vertices[this.vertexCount - 1], this.vertices[this.vertexCount - 1], this.vertices[this.vertexCount - 1], this.controlHermites, 0, nHermites, true);
this.renderArrowHead (this.controlHermites[nHermites - 2], this.controlHermites[nHermites - 1], 0, false, false, this.dmesh.isBarb);
break;
}
if (this.diameter == 0) this.diameter = 3;
if (isCurved) {
for (var i = 0, i0 = 0; i < nPoints - 1; i++) {
this.g3d.fillHermite (tension, this.diameter, this.diameter, this.diameter, this.screens[i0], this.screens[i], this.screens[i + 1], this.screens[i + (i == nPoints - 2 ? 1 : 2)]);
i0 = i;
}
} else if (isSegments) {
for (var i = 0; i < nPoints - 1; i++) this.drawLine (i, i + 1, true, this.vertices[i], this.vertices[i + 1], this.screens[i], this.screens[i + 1]);

}if (isDrawPickMode && !isExport) {
this.renderHandles ();
}}, "~B");
Clazz.defineMethod (c$, "getConnectionPoints", 
($fz = function () {
this.vertexCount = 3;
var dmax = 3.4028235E38;
var i0 = 0;
var j0 = 0;
for (var i = 0; i < 2; i++) for (var j = 2; j < 4; j++) {
var d = this.vertices[i].distance (this.vertices[j]);
if (d < dmax) {
dmax = d;
i0 = i;
j0 = j;
}}

this.vpt0.setT (this.vertices[0]);
this.vpt0.add (this.vertices[1]);
this.vpt0.scale (0.5);
this.vpt2.setT (this.vertices[2]);
this.vpt2.add (this.vertices[3]);
this.vpt2.scale (0.5);
this.vpt1.setT (this.vpt0);
this.vpt1.add (this.vpt2);
this.vpt1.scale (0.5);
this.vertices[3] = org.jmol.util.Point3f.newP (this.vertices[i0]);
this.vertices[3].add (this.vertices[j0]);
this.vertices[3].scale (0.5);
this.vertices[1] = org.jmol.util.Point3f.newP (this.vpt1);
this.vertices[0] = org.jmol.util.Point3f.newP (this.vpt0);
this.vertices[2] = org.jmol.util.Point3f.newP (this.vpt2);
for (var i = 0; i < 4; i++) this.viewer.transformPtScr (this.vertices[i], this.screens[i]);

var f = 1;
var endoffset = 0.2;
var offsetside = 10 * this.width;
this.vpt0.set (this.screens[0].x, this.screens[0].y, this.screens[0].z);
this.vpt1.set (this.screens[1].x, this.screens[1].y, this.screens[1].z);
this.vpt2.set (this.screens[3].x, this.screens[3].y, this.screens[3].z);
var dx = (this.screens[1].x - this.screens[0].x) * f;
var dy = (this.screens[1].y - this.screens[0].y) * f;
if (dmax == 0 || org.jmol.util.Measure.computeTorsion (this.vpt2, this.vpt0, org.jmol.util.Point3f.new3 (this.vpt0.x, this.vpt0.y, 10000), this.vpt1, false) > 0) {
dx = -dx;
dy = -dy;
}this.vpt2.set (dy, -dx, 0);
this.vpt1.add (this.vpt2);
this.viewer.unTransformPoint (this.vpt1, this.vertices[1]);
this.vpt2.scale (offsetside);
this.vTemp.setT (this.vertices[1]);
this.vTemp.sub (this.vertices[0]);
this.vTemp.scale (endoffset);
this.vertices[0].add (this.vTemp);
this.vTemp.setT (this.vertices[1]);
this.vTemp.sub (this.vertices[2]);
this.vTemp.scale (endoffset);
this.vertices[2].add (this.vTemp);
for (var i = 0; i < 3; i++) {
this.viewer.transformPtScr (this.vertices[i], this.screens[i]);
if (offsetside != 0) {
this.screens[i].x += Math.round (this.vpt2.x);
this.screens[i].y += Math.round (this.vpt2.y);
this.vpt1.set (this.screens[i].x, this.screens[i].y, this.screens[i].z);
this.viewer.unTransformPoint (this.vpt1, this.vertices[i]);
}}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "drawLineData", 
($fz = function (lineData) {
if (this.diameter == 0) this.diameter = 3;
for (var i = lineData.size (); --i >= 0; ) {
var pts = lineData.get (i);
this.viewer.transformPtScr (pts[0], this.pt1i);
this.viewer.transformPtScr (pts[1], this.pt2i);
this.drawLine (-1, -2, true, pts[0], pts[1], this.pt1i, this.pt2i);
}
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "renderXyArrow", 
($fz = function (ptXY) {
var ptXYZ = 1 - ptXY;
var arrowPt =  new Array (2);
arrowPt[ptXYZ] = this.vpt1;
arrowPt[ptXY] = this.vpt0;
this.vpt0.set (this.screens[ptXY].x, this.screens[ptXY].y, this.screens[ptXY].z);
this.viewer.rotatePoint (this.vertices[ptXYZ], this.vpt1);
this.vpt1.z *= -1;
var zoomDimension = this.viewer.getScreenDim ();
var scaleFactor = zoomDimension / 20;
this.vpt1.scaleAdd2 (this.dmesh.scale * scaleFactor, this.vpt1, this.vpt0);
if (this.diameter == 0) this.diameter = 1;
this.pt1i.set (Math.round (this.vpt0.x), Math.round (this.vpt0.y), Math.round (this.vpt0.z));
this.pt2i.set (Math.round (this.vpt1.x), Math.round (this.vpt1.y), Math.round (this.vpt1.z));
if (this.diameter < 0) this.g3d.drawDottedLine (this.pt1i, this.pt2i);
 else this.g3d.fillCylinder (2, this.diameter, this.pt1i, this.pt2i);
this.renderArrowHead (this.vpt0, this.vpt1, 0, true, false, false);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "renderArrowHead", 
($fz = function (pt1, pt2, factor2, isTransformed, withShaft, isBarb) {
if (this.dmesh.noHead) return;
var fScale = this.dmesh.drawArrowScale;
if (fScale == 0) fScale = this.viewer.getDefaultDrawArrowScale () * (this.dmesh.connections == null ? 1 : 0.5);
if (fScale <= 0) fScale = 0.5;
if (isTransformed) fScale *= 40;
if (factor2 > 0) fScale *= factor2;
this.pt0f.setT (pt1);
this.pt2f.setT (pt2);
var d = this.pt0f.distance (this.pt2f);
if (d == 0) return;
this.vTemp.setT (this.pt2f);
this.vTemp.sub (this.pt0f);
this.vTemp.normalize ();
this.vTemp.scale (fScale / 5);
if (!withShaft) this.pt2f.add (this.vTemp);
this.vTemp.scale (5);
this.pt1f.setT (this.pt2f);
this.pt1f.sub (this.vTemp);
if (isTransformed) {
this.pt1i.set (Math.round (this.pt1f.x), Math.round (this.pt1f.y), Math.round (this.pt1f.z));
this.pt2i.set (Math.round (this.pt2f.x), Math.round (this.pt2f.y), Math.round (this.pt2f.z));
} else {
this.viewer.transformPtScr (this.pt2f, this.pt2i);
this.viewer.transformPtScr (this.pt1f, this.pt1i);
this.viewer.transformPtScr (this.pt0f, this.pt0i);
}if (this.pt2i.z == 1 || this.pt1i.z == 1) return;
var headDiameter;
if (this.diameter > 0) {
headDiameter = this.diameter * 3;
} else {
this.vTemp.set (this.pt2i.x - this.pt1i.x, this.pt2i.y - this.pt1i.y, this.pt2i.z - this.pt1i.z);
headDiameter = Math.round (this.vTemp.length () * .5);
this.diameter = Clazz.doubleToInt (headDiameter / 5);
}if (this.diameter < 1) this.diameter = 1;
if (headDiameter > 2) this.g3d.fillConeScreen (2, headDiameter, this.pt1i, this.pt2i, isBarb);
if (withShaft) this.g3d.fillCylinderScreen3I (4, this.diameter, this.pt0i, this.pt1i, null, null, this.mad / 2000);
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f,org.jmol.util.Point3f,~N,~B,~B,~B");
Clazz.defineMethod (c$, "renderHandles", 
($fz = function () {
var diameter = Math.round (10 * this.imageFontScaling);
switch (this.drawType) {
case org.jmol.shapespecial.Draw.EnumDrawType.NONE:
return;
default:
var colixFill = org.jmol.util.Colix.getColixTranslucent3 (23, true, 0.5);
this.bsHandles.clearAll ();
for (var i = this.dmesh.polygonCount; --i >= 0; ) {
if (!this.isPolygonDisplayable (i)) continue;
var vertexIndexes = this.dmesh.polygonIndexes[i];
if (vertexIndexes == null) continue;
for (var j = (this.dmesh.isTriangleSet ? 3 : vertexIndexes.length); --j >= 0; ) {
var k = vertexIndexes[j];
if (this.bsHandles.get (k)) continue;
this.bsHandles.set (k);
this.g3d.drawFilledCircle (23, colixFill, diameter, this.screens[k].x, this.screens[k].y, this.screens[k].z);
}
}
break;
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "renderInfo", 
($fz = function () {
if (this.mesh.title == null || this.viewer.getDrawHover () || !this.g3d.setColix (this.viewer.getColixBackgroundContrast ())) return;
for (var i = this.dmesh.polygonCount; --i >= 0; ) if (this.isPolygonDisplayable (i)) {
var fid = this.g3d.getFontFid (14 * this.imageFontScaling);
this.g3d.setFontFid (fid);
var s = this.mesh.title[i < this.mesh.title.length ? i : this.mesh.title.length - 1];
var pt = 0;
if (s.length > 1 && s.charAt (0) == '>') {
pt = this.dmesh.polygonIndexes[i].length - 1;
s = s.substring (1);
if (this.drawType === org.jmol.shapespecial.Draw.EnumDrawType.ARC) this.pt1f.setT (this.pt2f);
}if (this.drawType !== org.jmol.shapespecial.Draw.EnumDrawType.ARC) this.pt1f.setT (this.vertices[this.dmesh.polygonIndexes[i][pt]]);
this.viewer.transformPtScr (this.pt1f, this.pt1i);
var offset = Math.round (5 * this.imageFontScaling);
this.g3d.drawString (s, null, this.pt1i.x + offset, this.pt1i.y - offset, this.pt1i.z, this.pt1i.z);
break;
}
}, $fz.isPrivate = true, $fz));
});
