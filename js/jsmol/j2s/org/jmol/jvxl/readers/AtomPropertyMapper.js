﻿Clazz.declarePackage ("org.jmol.jvxl.readers");
Clazz.load (["org.jmol.jvxl.readers.AtomDataReader"], "org.jmol.jvxl.readers.AtomPropertyMapper", ["java.lang.Float", "org.jmol.api.Interface", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.mepCalc = null;
this.mepType = null;
this.calcType = 0;
this.doSmoothProperty = false;
this.iter = null;
this.smoothingPower = 0;
this.iAtomSurface = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.jvxl.readers, "AtomPropertyMapper", org.jmol.jvxl.readers.AtomDataReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.jvxl.readers.AtomPropertyMapper, []);
});
Clazz.defineMethod (c$, "init", 
function (sg) {
Clazz.superCall (this, org.jmol.jvxl.readers.AtomPropertyMapper, "init", [sg]);
this.mepType = sg.getReaderData ();
}, "org.jmol.jvxl.readers.SurfaceGenerator");
Clazz.defineMethod (c$, "setup", 
function (isMapData) {
Clazz.superCall (this, org.jmol.jvxl.readers.AtomPropertyMapper, "setup", [isMapData]);
this.haveSurfaceAtoms = true;
this.volumeData.sr = this;
this.volumeData.doIterate = false;
this.point = this.params.point;
this.doSmoothProperty = this.params.propertySmoothing;
this.doUseIterator = true;
if (this.doSmoothProperty) {
this.smoothingPower = this.params.propertySmoothingPower;
if (this.smoothingPower < 0) this.smoothingPower = 0;
 else if (this.smoothingPower > 10) this.smoothingPower = 10;
if (this.smoothingPower == 0) this.doSmoothProperty = false;
this.smoothingPower = (this.smoothingPower - 11) / 2;
}this.maxDistance = this.params.propertyDistanceMax;
if (this.mepType != null) {
this.doSmoothProperty = true;
if (this.params.mep_calcType >= 0) this.calcType = this.params.mep_calcType;
this.mepCalc = org.jmol.api.Interface.getOptionInterface ("quantum." + this.mepType + "Calculation");
}if (!this.doSmoothProperty && this.maxDistance == 2147483647) this.maxDistance = 5;
this.getAtoms (this.params.bsSelected, this.doAddHydrogens, true, false, false, true, false, NaN);
if (this.meshDataServer != null) this.meshDataServer.fillMeshData (this.meshData, 1, null);
if (!this.doSmoothProperty && this.meshData.vertexSource != null) {
this.hasColorData = true;
for (var i = this.meshData.vertexCount; --i >= 0; ) {
var iAtom = this.meshData.vertexSource[i];
if (iAtom >= 0) {
this.meshData.vertexValues[i] = this.params.theProperty[iAtom];
} else {
this.hasColorData = false;
break;
}}
}this.setHeader ("property", this.params.calculationType);
this.setRanges (this.params.solvent_ptsPerAngstrom, this.params.solvent_gridMax, 0);
this.params.cutoff = 0;
}, "~B");
Clazz.defineMethod (c$, "setVolumeData", 
function () {
if (this.params.thePlane != null) Clazz.superCall (this, org.jmol.jvxl.readers.AtomPropertyMapper, "setVolumeData", []);
});
Clazz.overrideMethod (c$, "initializeMapping", 
function () {
if (this.params.showTiming) org.jmol.util.Logger.startTimer ("property mapping");
if (this.bsNearby != null) this.bsMySelected.or (this.bsNearby);
this.iter = this.atomDataServer.getSelectedAtomIterator (this.bsMySelected, false, false, false);
});
Clazz.overrideMethod (c$, "finalizeMapping", 
function () {
this.iter.release ();
this.iter = null;
if (this.params.showTiming) org.jmol.util.Logger.checkTimer ("property mapping", false);
});
Clazz.overrideMethod (c$, "generateCube", 
function () {
});
Clazz.overrideMethod (c$, "getSurfaceAtomIndex", 
function () {
return this.iAtomSurface;
});
Clazz.overrideMethod (c$, "getValueAtPoint", 
function (pt) {
var dmin = 3.4028235E38;
var dminNearby = 3.4028235E38;
var value = (this.doSmoothProperty ? 0 : NaN);
var vdiv = 0;
this.atomDataServer.setIteratorForPoint (this.iter, this.modelIndex, pt, this.maxDistance);
this.iAtomSurface = -1;
while (this.iter.hasNext ()) {
var ia = this.iter.next ();
var iAtom = this.myIndex[ia];
var isNearby = (iAtom >= this.firstNearbyAtom);
var ptA = this.atomXyz[iAtom];
var p = this.atomProp[iAtom];
if (Float.isNaN (p)) continue;
var d2 = pt.distanceSquared (ptA);
if (isNearby) {
if (d2 < dminNearby) {
dminNearby = d2;
if (!this.doSmoothProperty && dminNearby < dmin) {
dmin = d2;
value = NaN;
}}} else if (d2 < dmin) {
dmin = d2;
this.iAtomSurface = iAtom;
if (!this.doSmoothProperty) value = p;
}if (this.mepCalc != null) {
value += this.mepCalc.valueFor (p, d2, this.calcType);
} else if (this.doSmoothProperty) {
d2 = Math.pow (d2, this.smoothingPower);
vdiv += d2;
value += d2 * p;
}}
return (this.mepCalc != null ? value : this.doSmoothProperty ? (vdiv == 0 || dminNearby < dmin ? NaN : value / vdiv) : value);
}, "org.jmol.util.Point3f");
});
