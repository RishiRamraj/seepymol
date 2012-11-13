﻿Clazz.declarePackage ("org.jmol.render");
Clazz.load (["org.jmol.render.CageRenderer", "org.jmol.util.Point3f"], "org.jmol.render.UccageRenderer", ["org.jmol.util.BoxInfo", "$.Colix", "$.SimpleUnitCell", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.fid = 0;
this.verticesT = null;
this.fset0 = null;
this.cell0 = null;
this.cell1 = null;
this.offset = null;
this.offsetT = null;
Clazz.instantialize (this, arguments);
}, org.jmol.render, "UccageRenderer", org.jmol.render.CageRenderer);
Clazz.prepareFields (c$, function () {
this.verticesT =  new Array (8);
{
for (var i = 8; --i >= 0; ) {
this.verticesT[i] =  new org.jmol.util.Point3f ();
}
}this.fset0 = org.jmol.util.Point3f.new3 (555, 555, 1);
this.cell0 =  new org.jmol.util.Point3f ();
this.cell1 =  new org.jmol.util.Point3f ();
this.offset =  new org.jmol.util.Point3f ();
this.offsetT =  new org.jmol.util.Point3f ();
});
Clazz.overrideMethod (c$, "setEdges", 
function () {
this.tickEdges = org.jmol.util.BoxInfo.uccageTickEdges;
});
Clazz.defineMethod (c$, "initRenderer", 
function () {
Clazz.superCall (this, org.jmol.render.UccageRenderer, "initRenderer", []);
this.draw000 = false;
});
Clazz.defineMethod (c$, "render", 
function () {
this.imageFontScaling = this.viewer.getImageFontScaling ();
this.font3d = this.g3d.getFont3DScaled ((this.shape).font3d, this.imageFontScaling);
var mad = this.viewer.getObjectMad (5);
if (mad == 0 || this.viewer.isJmolDataFrame () || this.viewer.isNavigating () && this.viewer.getNavigationPeriodic ()) return false;
this.colix = this.viewer.getObjectColix (5);
var needTranslucent = org.jmol.util.Colix.isColixTranslucent (this.colix);
if (!this.isExport && needTranslucent != this.g3d.isPass2 ()) return needTranslucent;
this.render1 (mad);
return false;
});
Clazz.defineMethod (c$, "render1", 
($fz = function (mad) {
this.g3d.setColix (this.colix);
var unitcell = this.viewer.getCurrentUnitCell ();
if (unitcell == null) return;
this.isPolymer = unitcell.isPolymer ();
this.isSlab = unitcell.isSlab ();
var vertices = unitcell.getUnitCellVertices ();
this.offset.setT (unitcell.getCartesianOffset ());
var fset = unitcell.getUnitCellMultiplier ();
var haveMultiple = (fset != null);
if (!haveMultiple) fset = this.fset0;
org.jmol.util.SimpleUnitCell.ijkToPoint3f (Clazz.floatToInt (fset.x), this.cell0, 0);
org.jmol.util.SimpleUnitCell.ijkToPoint3f (Clazz.floatToInt (fset.y), this.cell1, 1);
var firstLine;
var allow0;
var allow1;
if (fset.z < 0) {
this.cell0.scale (-1 / fset.z);
this.cell1.scale (-1 / fset.z);
}var axisPoints = this.viewer.getAxisPoints ();
var drawAllLines = (this.viewer.getObjectMad (1) == 0 || this.viewer.getAxesScale () < 2 || axisPoints == null);
var aPoints = axisPoints;
for (var x = Clazz.floatToInt (this.cell0.x); x < this.cell1.x; x++) {
for (var y = Clazz.floatToInt (this.cell0.y); y < this.cell1.y; y++) {
for (var z = Clazz.floatToInt (this.cell0.z); z < this.cell1.z; z++) {
if (haveMultiple) {
this.offsetT.set (x, y, z);
this.offsetT.scale (Math.abs (fset.z));
unitcell.toCartesian (this.offsetT, true);
this.offsetT.add (this.offset);
aPoints = (x == 0 && y == 0 && z == 0 ? axisPoints : null);
firstLine = (drawAllLines || aPoints == null ? 0 : 3);
allow0 = 0xFF;
allow1 = 0xFF;
} else {
this.offsetT.setT (this.offset);
firstLine = (drawAllLines ? 0 : 3);
allow0 = 0xFF;
allow1 = 0xFF;
}for (var i = 8; --i >= 0; ) this.verticesT[i].add2 (vertices[i], this.offsetT);

this.render (mad, this.verticesT, aPoints, firstLine, allow0, allow1, Math.abs (fset.z));
}
}
}
if (this.viewer.getDisplayCellParameters () && !this.viewer.isPreviewOnly () && !unitcell.isPeriodic ()) this.renderInfo (unitcell);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "nfformat", 
($fz = function (x) {
return (org.jmol.util.TextFormat.formatDecimal (x, 3));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "renderInfo", 
($fz = function (symmetry) {
if (this.isExport || !this.g3d.setColix (this.viewer.getColixBackgroundContrast ())) return;
this.fid = this.g3d.getFontFidFS ("Monospaced", 14 * this.imageFontScaling);
this.g3d.setFontFid (this.fid);
var lineheight = Clazz.doubleToInt (Math.floor (15 * this.imageFontScaling));
var x = Clazz.doubleToInt (Math.floor (5 * this.imageFontScaling));
var y = lineheight;
var spaceGroup = symmetry.getSpaceGroupName ();
if (this.isPolymer) spaceGroup = "polymer";
 else if (this.isSlab) spaceGroup = "slab";
if ( new Boolean (spaceGroup != null & !spaceGroup.equals ("-- [--]")).valueOf ()) {
y += lineheight;
this.g3d.drawStringNoSlab (spaceGroup, null, x, y, 0);
}y += lineheight;
this.g3d.drawStringNoSlab ("a=" + this.nfformat (symmetry.getUnitCellInfoType (0)) + "\u00C5", null, x, y, 0);
if (!this.isPolymer) {
y += lineheight;
this.g3d.drawStringNoSlab ("b=" + this.nfformat (symmetry.getUnitCellInfoType (1)) + "\u00C5", null, x, y, 0);
}if (!this.isPolymer && !this.isSlab) {
y += lineheight;
this.g3d.drawStringNoSlab ("c=" + this.nfformat (symmetry.getUnitCellInfoType (2)) + "\u00C5", null, x, y, 0);
}if (!this.isPolymer) {
if (!this.isSlab) {
y += lineheight;
this.g3d.drawStringNoSlab ("\u03B1=" + this.nfformat (symmetry.getUnitCellInfoType (3)) + "\u00B0", null, x, y, 0);
y += lineheight;
this.g3d.drawStringNoSlab ("\u03B2=" + this.nfformat (symmetry.getUnitCellInfoType (4)) + "\u00B0", null, x, y, 0);
}y += lineheight;
this.g3d.drawStringNoSlab ("\u03B3=" + this.nfformat (symmetry.getUnitCellInfoType (5)) + "\u00B0", null, x, y, 0);
}}, $fz.isPrivate = true, $fz), "org.jmol.api.SymmetryInterface");
});
