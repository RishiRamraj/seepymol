﻿Clazz.declarePackage ("org.jmol.shapebio");
Clazz.load (["org.jmol.shapebio.BioShapeCollection"], "org.jmol.shapebio.Backbone", ["java.lang.Float", "org.jmol.util.BitSet"], function () {
c$ = Clazz.decorateAsClass (function () {
this.bsSelected = null;
Clazz.instantialize (this, arguments);
}, org.jmol.shapebio, "Backbone", org.jmol.shapebio.BioShapeCollection);
Clazz.defineMethod (c$, "initShape", 
function () {
Clazz.superCall (this, org.jmol.shapebio.Backbone, "initShape", []);
this.madOn = 1;
this.madHelixSheet = 1500;
this.madTurnRandom = 500;
this.madDnaRna = 2000;
this.isActive = true;
});
Clazz.defineMethod (c$, "setProperty", 
function (propertyName, value, bsSelected) {
if ("bitset" === propertyName) {
this.bsSelected = value;
return;
}Clazz.superCall (this, org.jmol.shapebio.Backbone, "setProperty", [propertyName, value, bsSelected]);
}, "~S,~O,org.jmol.util.BitSet");
Clazz.overrideMethod (c$, "setShapeSizeRD", 
function (size, rd, bsSelected) {
var mad = size;
this.initialize ();
var useThisBsSelected = (this.bsSelected != null);
if (useThisBsSelected) bsSelected = this.bsSelected;
for (var iShape = this.bioShapes.length; --iShape >= 0; ) {
var bioShape = this.bioShapes[iShape];
if (bioShape.monomerCount == 0) continue;
var bondSelectionModeOr = this.viewer.getBondSelectionModeOr ();
var atomIndices = bioShape.bioPolymer.getLeadAtomIndices ();
var isVisible = (mad != 0);
if (bioShape.bsSizeSet == null) bioShape.bsSizeSet =  new org.jmol.util.BitSet ();
bioShape.isActive = true;
for (var i = bioShape.monomerCount - 1; --i >= 0; ) {
var index1 = atomIndices[i];
var index2 = atomIndices[i + 1];
var isAtom1 = bsSelected.get (index1);
var isAtom2 = bsSelected.get (index2);
if (isAtom1 && isAtom2 || useThisBsSelected && isAtom1 || bondSelectionModeOr && (isAtom1 || isAtom2)) {
bioShape.monomers[i].setShapeVisibility (this.myVisibilityFlag, isVisible);
var atomA = this.modelSet.atoms[index1];
if (rd != null) {
if (Float.isNaN (rd.values[i])) continue;
mad = Clazz.floatToShort (rd.values[i] * 2000);
}var atomB = this.modelSet.atoms[index2];
var wasVisible = (bioShape.mads[i] != 0);
if (wasVisible != isVisible) {
atomA.addDisplayedBackbone (this.myVisibilityFlag, isVisible);
atomB.addDisplayedBackbone (this.myVisibilityFlag, isVisible);
}bioShape.mads[i] = mad;
bioShape.bsSizeSet.setBitTo (i, isVisible);
bioShape.bsSizeDefault.setBitTo (i, mad == -1);
}}
}
if (useThisBsSelected) this.bsSelected = null;
}, "~N,org.jmol.atomdata.RadiusData,org.jmol.util.BitSet");
Clazz.overrideMethod (c$, "setModelClickability", 
function () {
if (this.bioShapes == null) return;
for (var iShape = this.bioShapes.length; --iShape >= 0; ) {
var bioShape = this.bioShapes[iShape];
var atomIndices = bioShape.bioPolymer.getLeadAtomIndices ();
for (var i = bioShape.monomerCount; --i >= 0; ) {
var atom = this.modelSet.atoms[atomIndices[i]];
if (atom.getNBackbonesDisplayed () > 0 && !this.modelSet.isAtomHidden (i)) atom.setClickable (this.myVisibilityFlag);
}
}
});
});
