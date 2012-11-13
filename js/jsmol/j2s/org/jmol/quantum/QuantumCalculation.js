﻿Clazz.declarePackage ("org.jmol.quantum");
Clazz.load (null, "org.jmol.quantum.QuantumCalculation", ["org.jmol.quantum.QMAtom", "org.jmol.util.Escape", "$.Logger", "$.Point3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.doDebug = false;
this.bsExcluded = null;
this.voxelData = null;
this.vd = null;
this.countsXYZ = null;
this.points = null;
this.xMin = 0;
this.xMax = 0;
this.yMin = 0;
this.yMax = 0;
this.zMin = 0;
this.zMax = 0;
this.qmAtoms = null;
this.atomIndex = 0;
this.thisAtom = null;
this.firstAtomOffset = 0;
this.xBohr = null;
this.yBohr = null;
this.zBohr = null;
this.originBohr = null;
this.stepBohr = null;
this.nX = 0;
this.nY = 0;
this.nZ = 0;
this.X = null;
this.Y = null;
this.Z = null;
this.X2 = null;
this.Y2 = null;
this.Z2 = null;
this.rangeBohrOrAngstroms = 10;
this.unitFactor = 1.8897161;
this.volume = 1;
Clazz.instantialize (this, arguments);
}, org.jmol.quantum, "QuantumCalculation");
Clazz.prepareFields (c$, function () {
this.originBohr =  Clazz.newFloatArray (3, 0);
this.stepBohr =  Clazz.newFloatArray (3, 0);
});
Clazz.defineMethod (c$, "initialize", 
function (nX, nY, nZ, points) {
if (points != null) {
this.points = points;
nX = nY = nZ = points.length;
}this.nX = this.xMax = nX;
this.nY = this.yMax = nY;
this.nZ = this.zMax = nZ;
if (this.xBohr != null && this.xBohr.length >= nX) return;
this.xBohr =  Clazz.newFloatArray (nX, 0);
this.yBohr =  Clazz.newFloatArray (nY, 0);
this.zBohr =  Clazz.newFloatArray (nZ, 0);
this.X =  Clazz.newFloatArray (nX, 0);
this.Y =  Clazz.newFloatArray (nY, 0);
this.Z =  Clazz.newFloatArray (nZ, 0);
this.X2 =  Clazz.newFloatArray (nX, 0);
this.Y2 =  Clazz.newFloatArray (nY, 0);
this.Z2 =  Clazz.newFloatArray (nZ, 0);
}, "~N,~N,~N,~A");
Clazz.defineMethod (c$, "setupCoordinates", 
function (originXYZ, stepsXYZ, bsSelected, atomCoordAngstroms, points, renumber) {
if (points == null) {
this.volume = 1;
for (var i = 3; --i >= 0; ) {
this.originBohr[i] = originXYZ[i] * this.unitFactor;
this.stepBohr[i] = stepsXYZ[i] * this.unitFactor;
this.volume *= this.stepBohr[i];
}
org.jmol.util.Logger.info ("QuantumCalculation:\n origin = " + org.jmol.util.Escape.escape (originXYZ) + "\n steps = " + org.jmol.util.Escape.escape (stepsXYZ) + "\n origin(Bohr)= " + org.jmol.util.Escape.escape (this.originBohr) + "\n steps(Bohr)= " + org.jmol.util.Escape.escape (this.stepBohr) + "\n counts= " + this.nX + " " + this.nY + " " + this.nZ);
}if (atomCoordAngstroms != null) {
this.qmAtoms =  new Array (renumber ? bsSelected.cardinality () : atomCoordAngstroms.length);
var isAll = (bsSelected == null);
var i0 = (isAll ? this.qmAtoms.length - 1 : bsSelected.nextSetBit (0));
for (var i = i0, j = 0; i >= 0; i = (isAll ? i - 1 : bsSelected.nextSetBit (i + 1))) this.qmAtoms[renumber ? j++ : i] =  new org.jmol.quantum.QMAtom (i, atomCoordAngstroms[i], this.X, this.Y, this.Z, this.X2, this.Y2, this.Z2, (this.bsExcluded != null && this.bsExcluded.get (i)), this.unitFactor);

}}, "~A,~A,org.jmol.util.BitSet,~A,~A,~B");
Clazz.defineMethod (c$, "process", 
function (pt) {
this.doDebug = false;
if (this.points == null || this.nX != 1) this.initializeOnePoint ();
this.points[0].setT (pt);
this.voxelData[0][0][0] = 0;
this.setXYZBohr (this.points);
this.processPoints ();
return this.voxelData[0][0][0];
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "processPoints", 
function () {
this.process ();
});
Clazz.defineMethod (c$, "initializeOnePoint", 
function () {
this.points =  new Array (1);
this.points[0] =  new org.jmol.util.Point3f ();
this.voxelData =  Clazz.newFloatArray (1, 1, 1, 0);
this.xMin = this.yMin = this.zMin = 0;
this.initialize (1, 1, 1, this.points);
});
Clazz.defineMethod (c$, "setXYZBohr", 
function (points) {
this.setXYZBohr (this.xBohr, 0, this.nX, points);
this.setXYZBohr (this.yBohr, 1, this.nY, points);
this.setXYZBohr (this.zBohr, 2, this.nZ, points);
}, "~A");
Clazz.defineMethod (c$, "setXYZBohr", 
($fz = function (bohr, i, n, points) {
if (points != null) {
var x = 0;
for (var j = 0; j < n; j++) {
switch (i) {
case 0:
x = points[j].x;
break;
case 1:
x = points[j].y;
break;
case 2:
x = points[j].z;
break;
}
bohr[j] = x * this.unitFactor;
}
return;
}bohr[0] = this.originBohr[i];
var inc = this.stepBohr[i];
for (var j = 0; ++j < n; ) bohr[j] = bohr[j - 1] + inc;

}, $fz.isPrivate = true, $fz), "~A,~N,~N,~A");
Clazz.defineMethod (c$, "setMinMax", 
function (ix) {
this.yMax = this.zMax = (ix < 0 ? this.xMax : ix + 1);
this.yMin = this.zMin = (ix < 0 ? 0 : ix);
}, "~N");
Clazz.defineStatics (c$,
"bohr_per_angstrom", 1.8897161);
});
