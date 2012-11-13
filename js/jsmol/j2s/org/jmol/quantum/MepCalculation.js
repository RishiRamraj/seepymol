﻿Clazz.declarePackage ("org.jmol.quantum");
Clazz.load (["org.jmol.api.MepCalculationInterface", "org.jmol.quantum.QuantumCalculation"], "org.jmol.quantum.MepCalculation", ["java.io.ByteArrayInputStream", "java.lang.Float", "java.util.Hashtable", "org.jmol.io.JmolBinary", "org.jmol.util.Logger", "$.Parser"], function () {
c$ = Clazz.decorateAsClass (function () {
this.distanceMode = 0;
this.potentials = null;
this.atomCoordAngstroms = null;
this.bsSelected = null;
this.htAtomicPotentials = null;
this.resourceName = null;
Clazz.instantialize (this, arguments);
}, org.jmol.quantum, "MepCalculation", org.jmol.quantum.QuantumCalculation, org.jmol.api.MepCalculationInterface);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.quantum.MepCalculation, []);
this.rangeBohrOrAngstroms = 8;
this.distanceMode = 0;
this.unitFactor = 1;
});
Clazz.overrideMethod (c$, "assignPotentials", 
function (atoms, potentials, bsAromatic, bsCarbonyl, bsIgnore, data) {
this.getAtomicPotentials (data, null);
for (var i = 0; i < atoms.length; i++) {
var f;
if (bsIgnore != null && bsIgnore.get (i)) {
f = NaN;
} else {
f = this.getTabulatedPotential (atoms[i]);
if (Float.isNaN (f)) f = 0;
}if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.info (atoms[i].getInfo () + " " + f);
potentials[i] = f;
}
}, "~A,~A,org.jmol.util.BitSet,org.jmol.util.BitSet,org.jmol.util.BitSet,~S");
Clazz.defineMethod (c$, "setup", 
function (calcType, potentials, atomCoordAngstroms, bsSelected) {
if (calcType >= 0) this.distanceMode = calcType;
this.potentials = potentials;
this.atomCoordAngstroms = atomCoordAngstroms;
this.bsSelected = bsSelected;
}, "~N,~A,~A,org.jmol.util.BitSet");
Clazz.overrideMethod (c$, "calculate", 
function (volumeData, bsSelected, atomCoordAngstroms, potentials, calcType) {
this.setup (calcType, potentials, atomCoordAngstroms, bsSelected);
this.voxelData = volumeData.getVoxelData ();
this.countsXYZ = volumeData.getVoxelCounts ();
this.initialize (this.countsXYZ[0], this.countsXYZ[1], this.countsXYZ[2], null);
this.setupCoordinates (volumeData.getOriginFloat (), volumeData.getVolumetricVectorLengths (), bsSelected, atomCoordAngstroms, null, false);
this.setXYZBohr (this.points);
this.process ();
}, "org.jmol.api.VolumeDataInterface,org.jmol.util.BitSet,~A,~A,~N");
Clazz.defineMethod (c$, "getValueAtPoint", 
function (pt) {
var value = 0;
for (var i = this.bsSelected.nextSetBit (0); i >= 0; i = this.bsSelected.nextSetBit (i + 1)) {
var x = this.potentials[i];
var d2 = pt.distanceSquared (this.atomCoordAngstroms[i]);
value += this.valueFor (x, d2, this.distanceMode);
}
return value;
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "process", 
function () {
for (var atomIndex = this.qmAtoms.length; --atomIndex >= 0; ) {
if ((this.thisAtom = this.qmAtoms[atomIndex]) == null) continue;
var x0 = this.potentials[atomIndex];
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.info ("process map for atom " + atomIndex + this.thisAtom + "  charge=" + x0);
this.thisAtom.setXYZ (this, true);
for (var ix = this.xMax; --ix >= this.xMin; ) {
var dX = this.X2[ix];
for (var iy = this.yMax; --iy >= this.yMin; ) {
var dXY = dX + this.Y2[iy];
for (var iz = this.zMax; --iz >= this.zMin; ) {
this.voxelData[ix][iy][iz] += this.valueFor (x0, dXY + this.Z2[iz], this.distanceMode);
}
}
}
}
});
Clazz.overrideMethod (c$, "valueFor", 
function (x0, d2, distanceMode) {
switch (distanceMode) {
case 0:
return (d2 == 0 ? x0 * Infinity : x0 / Math.sqrt (d2));
case 2:
return x0 / (1 + Math.sqrt (d2));
case 1:
return x0 * Math.exp (-Math.sqrt (d2) / 2);
case 3:
return x0 * Math.exp (-Math.sqrt (d2));
}
return x0;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "getTabulatedPotential", 
function (atom) {
var name = atom.getAtomType ();
var g1 = atom.getGroup1 ('\0');
var type = atom.getBioStructureTypeName ();
if (g1.length == 0) {
g1 = atom.getGroup3 (true);
if (g1 == null) g1 = "";
}var key = g1 + name;
var o = this.htAtomicPotentials.get (key);
if (o == null && type.length > 0) o = this.htAtomicPotentials.get ("_" + type.charAt (0) + name);
return (Clazz.instanceOf (o, Float) ? (o).floatValue () : NaN);
}, "org.jmol.modelset.Atom");
Clazz.defineMethod (c$, "getAtomicPotentials", 
function (data, resourceName) {
var br = null;
this.htAtomicPotentials =  new java.util.Hashtable ();
try {
var is;
if (data == null) {
var url = null;
if ((url = this.getClass ().getResource (resourceName)) == null) {
org.jmol.util.Logger.error ("Couldn't find file: " + resourceName);
return;
}is = url.getContent ();
} else {
is =  new java.io.ByteArrayInputStream (data.getBytes ());
}br = org.jmol.io.JmolBinary.getInputStreamReader (is);
var line;
while ((line = br.readLine ()) != null) {
if (line.startsWith ("#")) continue;
var vs = org.jmol.util.Parser.getTokens (line);
if (vs.length < 2) continue;
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.info (line);
this.htAtomicPotentials.put (vs[0],  new Float (org.jmol.util.Parser.parseFloatStr (vs[1])));
}
br.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.error ("Exception " + e.getMessage () + " in getResource " + resourceName);
try {
br.close ();
} catch (ee) {
if (Clazz.exceptionOf (ee, Exception)) {
} else {
throw ee;
}
}
} else {
throw e;
}
}
}, "~S,~S");
Clazz.defineStatics (c$,
"ONE_OVER_D", 0,
"E_MINUS_D_OVER_2", 1,
"ONE_OVER_ONE_PLUS_D", 2,
"E_MINUS_D", 3);
});
