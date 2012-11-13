﻿Clazz.declarePackage ("org.jmol.modelsetbio");
Clazz.load (["org.jmol.modelsetbio.AlphaPolymer"], "org.jmol.modelsetbio.AminoPolymer", ["java.lang.Boolean", "java.util.ArrayList", "$.Hashtable", "org.jmol.constant.EnumStructure", "org.jmol.i18n.GT", "org.jmol.modelset.HBond", "org.jmol.modelsetbio.APBridge", "org.jmol.util.ArrayUtil", "$.BitSet", "$.Escape", "$.Logger", "$.Measure", "$.Point3f", "$.StringXBuilder", "$.TextFormat", "$.Vector3f", "org.jmol.viewer.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.structureList = null;
Clazz.instantialize (this, arguments);
}, org.jmol.modelsetbio, "AminoPolymer", org.jmol.modelsetbio.AlphaPolymer);
Clazz.makeConstructor (c$, 
function (monomers) {
Clazz.superConstructor (this, org.jmol.modelsetbio.AminoPolymer, [monomers]);
this.type = 1;
for (var i = 0; i < this.monomerCount; ++i) if (!(monomers[i]).hasOAtom ()) return;

this.hasWingPoints = true;
}, "~A");
Clazz.overrideMethod (c$, "resetHydrogenPoints", 
function () {
var ps;
var psLast = null;
for (var i = 0; i < this.monomerCount; i++) {
if ((ps = this.getProteinStructure (i)) != null && ps !== psLast) (psLast = ps).resetAxes ();
(this.monomers[i]).resetHydrogenPoint ();
}
});
Clazz.overrideMethod (c$, "calcPhiPsiAngles", 
function () {
for (var i = 0; i < this.monomerCount - 1; ++i) this.calcPhiPsiAngles2 (this.monomers[i], this.monomers[i + 1]);

return true;
});
Clazz.defineMethod (c$, "calcPhiPsiAngles2", 
($fz = function (residue1, residue2) {
var nitrogen1 = residue1.getNitrogenAtom ();
var alphacarbon1 = residue1.getLeadAtom ();
var carbon1 = residue1.getCarbonylCarbonAtom ();
var nitrogen2 = residue2.getNitrogenAtom ();
var alphacarbon2 = residue2.getLeadAtom ();
var carbon2 = residue2.getCarbonylCarbonAtom ();
residue2.setGroupParameter (1112539143, org.jmol.util.Measure.computeTorsion (carbon1, nitrogen2, alphacarbon2, carbon2, true));
residue1.setGroupParameter (1112539144, org.jmol.util.Measure.computeTorsion (nitrogen1, alphacarbon1, carbon1, nitrogen2, true));
residue1.setGroupParameter (1112539142, org.jmol.util.Measure.computeTorsion (alphacarbon1, carbon1, nitrogen2, alphacarbon2, true));
}, $fz.isPrivate = true, $fz), "org.jmol.modelsetbio.AminoMonomer,org.jmol.modelsetbio.AminoMonomer");
Clazz.overrideMethod (c$, "calculateRamachandranHelixAngle", 
function (m, qtype) {
var psiLast = (m == 0 ? NaN : this.monomers[m - 1].getGroupParameter (1112539144));
var psi = this.monomers[m].getGroupParameter (1112539144);
var phi = this.monomers[m].getGroupParameter (1112539143);
var phiNext = (m == this.monomerCount - 1 ? NaN : this.monomers[m + 1].getGroupParameter (1112539143));
var psiNext = (m == this.monomerCount - 1 ? NaN : this.monomers[m + 1].getGroupParameter (1112539144));
switch (qtype) {
default:
case 'p':
case 'r':
case 'P':
var dPhi = ((phiNext - phi) / 2 * 3.141592653589793 / 180);
var dPsi = ((psiNext - psi) / 2 * 3.141592653589793 / 180);
return (57.29577951308232 * 2 * Math.acos (Math.cos (dPsi) * Math.cos (dPhi) - Math.sin (dPsi) * Math.sin (dPhi) / 3));
case 'c':
case 'C':
return (psi - psiLast + phiNext - phi);
}
}, "~N,~S");
Clazz.defineMethod (c$, "calcRasmolHydrogenBonds", 
function (polymer, bsA, bsB, vHBonds, nMaxPerResidue, min, checkDistances, dsspIgnoreHydrogens) {
if (polymer == null) polymer = this;
if (!(Clazz.instanceOf (polymer, org.jmol.modelsetbio.AminoPolymer))) return;
var pt =  new org.jmol.util.Point3f ();
var vNH =  new org.jmol.util.Vector3f ();
var source;
var min1 = (min == null ?  Clazz.newIntArray (2, 3, 0) : null);
for (var i = 1; i < this.monomerCount; ++i) {
if (min == null) {
min1[0][0] = min1[1][0] = this.bioPolymerIndexInModel;
min1[0][1] = min1[1][1] = -2147483648;
min1[0][2] = min1[1][2] = 0;
} else {
min1 = min[i];
}if ((source = (this.monomers[i])).getNHPoint (pt, vNH, checkDistances, dsspIgnoreHydrogens)) {
var isInA = (bsA == null || bsA.get (source.getNitrogenAtom ().index));
if (!isInA) continue;
if (!checkDistances && source.getCarbonylOxygenAtom () == null) continue;
this.checkRasmolHydrogenBond (source, polymer, i, pt, (isInA ? bsB : bsA), vHBonds, min1, checkDistances);
}}
}, "org.jmol.modelsetbio.BioPolymer,org.jmol.util.BitSet,org.jmol.util.BitSet,java.util.List,~N,~A,~B,~B");
Clazz.defineMethod (c$, "checkRasmolHydrogenBond", 
($fz = function (source, polymer, indexDonor, hydrogenPoint, bsB, vHBonds, min, checkDistances) {
var sourceAlphaPoint = source.getLeadAtom ();
var sourceNitrogenPoint = source.getNitrogenAtom ();
var nitrogen = source.getNitrogenAtom ();
var m;
for (var i = polymer.monomerCount; --i >= 0; ) {
if (polymer === this && (i == indexDonor || i + 1 == indexDonor)) continue;
var target = polymer.monomers[i];
var oxygen = target.getCarbonylOxygenAtom ();
if (oxygen == null || bsB != null && !bsB.get (oxygen.index)) continue;
var targetAlphaPoint = target.getLeadAtom ();
var dist2 = sourceAlphaPoint.distanceSquared (targetAlphaPoint);
if (dist2 >= 81.0) continue;
var energy = this.calcHbondEnergy (sourceNitrogenPoint, hydrogenPoint, target, checkDistances);
if (energy < min[0][2]) {
m = min[1];
min[1] = min[0];
min[0] = m;
} else if (energy < min[1][2]) {
m = min[1];
} else {
continue;
}m[0] = polymer.bioPolymerIndexInModel;
m[1] = (energy < -500 ? i : -1 - i);
m[2] = energy;
}
if (vHBonds != null) for (var i = 0; i < 2; i++) if (min[i][1] >= 0) this.addResidueHydrogenBond (nitrogen, ((polymer).monomers[min[i][1]]).getCarbonylOxygenAtom (), (polymer === this ? indexDonor : -99), min[i][1], min[i][2] / 1000, vHBonds);

}, $fz.isPrivate = true, $fz), "org.jmol.modelsetbio.AminoMonomer,org.jmol.modelsetbio.BioPolymer,~N,org.jmol.util.Point3f,org.jmol.util.BitSet,java.util.List,~A,~B");
Clazz.defineMethod (c$, "calcHbondEnergy", 
($fz = function (nitrogenPoint, hydrogenPoint, target, checkDistances) {
var targetOxygenPoint = target.getCarbonylOxygenAtom ();
if (targetOxygenPoint == null) return 0;
var distON2 = targetOxygenPoint.distanceSquared (nitrogenPoint);
if (distON2 < 0.25) return 0;
var distOH2 = targetOxygenPoint.distanceSquared (hydrogenPoint);
if (distOH2 < 0.25) return 0;
var targetCarbonPoint = target.getCarbonylCarbonAtom ();
var distCH2 = targetCarbonPoint.distanceSquared (hydrogenPoint);
if (distCH2 < 0.25) return 0;
var distCN2 = targetCarbonPoint.distanceSquared (nitrogenPoint);
if (distCN2 < 0.25) return 0;
var distOH = Math.sqrt (distOH2);
var distCH = Math.sqrt (distCH2);
var distCN = Math.sqrt (distCN2);
var distON = Math.sqrt (distON2);
var energy = org.jmol.modelset.HBond.getEnergy (distOH, distCH, distCN, distON);
var isHbond = (energy < -500 && (!checkDistances || distCN > distCH && distOH <= 3.0));
return (!isHbond && checkDistances || energy < -9900 ? 0 : energy);
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f,org.jmol.util.Point3f,org.jmol.modelsetbio.AminoMonomer,~B");
Clazz.defineMethod (c$, "addResidueHydrogenBond", 
($fz = function (nitrogen, oxygen, indexAminoGroup, indexCarbonylGroup, energy, vHBonds) {
var order;
switch (indexAminoGroup - indexCarbonylGroup) {
case 2:
order = 6144;
break;
case 3:
order = 8192;
break;
case 4:
order = 10240;
break;
case 5:
order = 12288;
break;
case -3:
order = 14336;
break;
case -4:
order = 16384;
break;
default:
order = 4096;
}
vHBonds.add ( new org.jmol.modelset.HBond (nitrogen, oxygen, order, 1, 0, energy));
}, $fz.isPrivate = true, $fz), "org.jmol.modelset.Atom,org.jmol.modelset.Atom,~N,~N,~N,java.util.List");
c$.calculateStructuresDssp = Clazz.defineMethod (c$, "calculateStructuresDssp", 
function (bioPolymers, bioPolymerCount, vHBonds, doReport, dsspIgnoreHydrogens, setStructure) {
if (bioPolymerCount == 0) return "";
var m = bioPolymers[0].model;
var sb =  new org.jmol.util.StringXBuilder ();
sb.append ("Jmol ").append (org.jmol.viewer.Viewer.getJmolVersion ()).append (" DSSP analysis for model ").append (m.getModelNumberDotted ()).append (" - ").append (m.getModelTitle ()).append ("\n");
if (m.modelIndex == 0) sb.append ("\nW. Kabsch and C. Sander, Biopolymers, vol 22, 1983, pp 2577-2637\n").append ("\nWe thank Wolfgang Kabsch and Chris Sander for writing the DSSP software,\n").append ("and we thank the CMBI for maintaining it to the extent that it was easy to\n").append ("re-engineer for our purposes. At this point in time, we make no guarantee\n").append ("that this code gives precisely the same analysis as the code available via license\n").append ("from CMBI at http://swift.cmbi.ru.nl/gv/dssp\n");
if (setStructure && m.modelIndex == 0) sb.append ("\nAll bioshapes have been deleted and must be regenerated.\n");
if (m.nAltLocs > 0) sb.append ("\nNote: This model contains alternative locations. Use  'CONFIGURATION 1' to be consistent with CMBI DSSP.\n");
var labels =  Clazz.newCharArray (bioPolymerCount, '\0');
var bsDone =  new Array (bioPolymerCount);
var bsBad =  new org.jmol.util.BitSet ();
var haveWarned = false;
for (var i = 0; i < bioPolymerCount; i++) {
if (!(Clazz.instanceOf (bioPolymers[i], org.jmol.modelsetbio.AminoPolymer))) continue;
var ap = bioPolymers[i];
if (!haveWarned && (ap.monomers[0]).getExplicitNH () != null) {
if (dsspIgnoreHydrogens) sb.append (org.jmol.i18n.GT._ ("NOTE: Backbone amide hydrogen positions are present and will be ignored. Their positions will be approximated, as in standard DSSP analysis.\nUse {0} to not use this approximation.\n\n", "SET dsspCalculateHydrogenAlways FALSE"));
 else sb.append (org.jmol.i18n.GT._ ("NOTE: Backbone amide hydrogen positions are present and will be used. Results may differ significantly from standard DSSP analysis.\nUse {0} to ignore these hydrogen positions.\n\n", "SET dsspCalculateHydrogenAlways TRUE"));
haveWarned = true;
}bioPolymers[i].recalculateLeadMidpointsAndWingVectors ();
labels[i] =  Clazz.newCharArray (bioPolymers[i].monomerCount, '\0');
bsDone[i] =  new org.jmol.util.BitSet ();
for (var j = 0; j < ap.monomerCount; j++) if ((ap.monomers[j]).getCarbonylOxygenAtom () == null) bsBad.set (ap.monomers[j].leadAtomIndex);

}
var min = org.jmol.modelsetbio.AminoPolymer.getDualHydrogenBondArray (bioPolymers, bioPolymerCount, dsspIgnoreHydrogens);
var bridgesA =  new java.util.ArrayList ();
var bridgesP =  new java.util.ArrayList ();
var htBridges =  new java.util.Hashtable ();
var htLadders =  new java.util.Hashtable ();
org.jmol.modelsetbio.AminoPolymer.getBridges (bioPolymers, min, bridgesA, bridgesP, htBridges, htLadders, bsBad, vHBonds, bsDone);
org.jmol.modelsetbio.AminoPolymer.getSheetStructures (bioPolymers, bridgesA, bridgesP, htBridges, htLadders, labels, bsDone, doReport, setStructure);
var reports =  new Array (bioPolymerCount);
for (var i = 0; i < bioPolymerCount; i++) if (min[i] != null) reports[i] = (bioPolymers[i]).findHelixes (min[i], i, bsDone[i], labels[i], doReport, setStructure, vHBonds, bsBad);

if (doReport) {
var sbSummary =  new org.jmol.util.StringXBuilder ();
sb.append ("\n------------------------------\n");
for (var i = 0; i < bioPolymerCount; i++) if (labels[i] != null) {
var ap = bioPolymers[i];
sbSummary.append (ap.dumpSummary (labels[i]));
sb.append (reports[i]).append (ap.dumpTags ("$.1: " + String.valueOf (labels[i]), bsBad, 2));
}
if (bsBad.nextSetBit (0) >= 0) sb.append ("\nNOTE: '!' indicates a residue that is missing a backbone carbonyl oxygen atom.\n");
sb.append ("\n").append ("SUMMARY:" + sbSummary);
}return sb.toString ();
}, "~A,~N,java.util.List,~B,~B,~B");
c$.getDualHydrogenBondArray = Clazz.defineMethod (c$, "getDualHydrogenBondArray", 
($fz = function (bioPolymers, bioPolymerCount, dsspIgnoreHydrogens) {
var min = org.jmol.util.ArrayUtil.newInt4 (bioPolymerCount);
for (var i = 0; i < bioPolymerCount; i++) {
if (!(Clazz.instanceOf (bioPolymers[i], org.jmol.modelsetbio.AminoPolymer))) continue;
var n = bioPolymers[i].monomerCount;
min[i] =  Clazz.newIntArray (n, 2, 3, 0);
for (var j = 0; j < n; ++j) {
min[i][j][0][1] = min[i][j][1][1] = -2147483648;
min[i][j][0][2] = min[i][j][1][2] = 0;
}
}
for (var i = 0; i < bioPolymerCount; i++) if (min[i] != null) for (var j = 0; j < bioPolymerCount; j++) if (min[j] != null) bioPolymers[i].calcRasmolHydrogenBonds (bioPolymers[j], null, null, null, 2, min[i], false, dsspIgnoreHydrogens);


return min;
}, $fz.isPrivate = true, $fz), "~A,~N,~B");
Clazz.defineMethod (c$, "findHelixes", 
($fz = function (min, iPolymer, bsDone, labels, doReport, setStructure, vHBonds, bsBad) {
if (org.jmol.util.Logger.debugging) for (var j = 0; j < this.monomerCount; j++) org.jmol.util.Logger.debug (iPolymer + "." + this.monomers[j].getResno () + "\t" + org.jmol.util.Escape.escape (min[j]));

var bsTurn =  new org.jmol.util.BitSet ();
var line4 = this.findHelixes2 (4, min, iPolymer, org.jmol.constant.EnumStructure.HELIXALPHA, 10240, bsDone, bsTurn, labels, doReport, setStructure, vHBonds, bsBad);
var line3 = this.findHelixes2 (3, min, iPolymer, org.jmol.constant.EnumStructure.HELIX310, 8192, bsDone, bsTurn, labels, doReport, setStructure, vHBonds, bsBad);
var line5 = this.findHelixes2 (5, min, iPolymer, org.jmol.constant.EnumStructure.HELIXPI, 12288, bsDone, bsTurn, labels, doReport, setStructure, vHBonds, bsBad);
if (setStructure) this.setStructure (bsTurn, org.jmol.constant.EnumStructure.TURN);
if (doReport) {
this.setTag (labels, bsTurn, 'T');
return this.dumpTags ("$.5: " + line5 + "\n" + "$.4: " + line4 + "\n" + "$.3: " + line3, bsBad, 1);
}return "";
}, $fz.isPrivate = true, $fz), "~A,~N,org.jmol.util.BitSet,~A,~B,~B,java.util.List,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "findHelixes2", 
($fz = function (pitch, min, thisIndex, subtype, type, bsDone, bsTurn, labels, doReport, setStructure, vHBonds, bsBad) {
var bsStart =  new org.jmol.util.BitSet ();
var bsNNN =  new org.jmol.util.BitSet ();
var bsX =  new org.jmol.util.BitSet ();
var bsStop =  new org.jmol.util.BitSet ();
var bsHelix =  new org.jmol.util.BitSet ();
var warning = "";
for (var i = pitch; i < this.monomerCount; ++i) {
var i0 = i - pitch;
var bpt = 0;
if (min[i][0][0] == thisIndex && min[i][0][1] == i0 || min[i][bpt = 1][0] == thisIndex && min[i][1][1] == i0) {
var ia = this.monomers[i0].leadAtomIndex;
var ipt = bsBad.nextSetBit (ia);
if (ipt >= ia && ipt <= this.monomers[i].leadAtomIndex) continue;
bsStart.set (i0);
bsNNN.setBits (i0 + 1, i);
bsStop.set (i);
ipt = bsDone.nextSetBit (i0);
var isClear = (ipt < 0 || ipt >= i);
var addH = false;
if (i0 > 0 && bsStart.get (i0 - 1) && (pitch == 4 || isClear)) {
bsHelix.setBits (i0, i);
if (!isClear) warning += "  WARNING! Bridge to helix at " + this.monomers[ipt];
addH = true;
} else if (isClear || bsDone.nextClearBit (ipt) < i) {
addH = true;
}if (bsStop.get (i0)) bsX.set (i0);
if (addH && vHBonds != null) {
org.jmol.modelsetbio.AminoPolymer.addHbond (vHBonds, this.monomers[i], this.monomers[i0], min[i][bpt][2], type, null);
}}}
var taglines;
if (doReport) {
taglines =  Clazz.newCharArray (this.monomerCount, '\0');
this.setTag (taglines, bsNNN, String.fromCharCode (48 + pitch));
this.setTag (taglines, bsStart, '>');
this.setTag (taglines, bsStop, '<');
this.setTag (taglines, bsX, 'X');
} else {
taglines = null;
}bsDone.or (bsHelix);
bsNNN.andNot (bsDone);
bsTurn.or (bsNNN);
bsTurn.andNot (bsHelix);
if (setStructure) this.setStructure (bsHelix, subtype);
if (doReport) {
this.setTag (labels, bsHelix, String.fromCharCode (68 + pitch));
return String.valueOf (taglines) + warning;
}return "";
}, $fz.isPrivate = true, $fz), "~N,~A,~N,org.jmol.constant.EnumStructure,~N,org.jmol.util.BitSet,org.jmol.util.BitSet,~A,~B,~B,java.util.List,org.jmol.util.BitSet");
c$.getBridges = Clazz.defineMethod (c$, "getBridges", 
($fz = function (bioPolymers, min, bridgesA, bridgesP, htBridges, htLadders, bsBad, vHBonds, bsDone) {
var atoms = bioPolymers[0].model.getModelSet ().atoms;
var bridge = null;
var htTemp =  new java.util.Hashtable ();
for (var p1 = 0; p1 < min.length; p1++) if (Clazz.instanceOf (bioPolymers[p1], org.jmol.modelsetbio.AminoPolymer)) {
var ap1 = (bioPolymers[p1]);
var n = min[p1].length - 1;
for (var a = 1; a < n; a++) {
var ia = ap1.monomers[a].leadAtomIndex;
if (bsBad.get (ia)) continue;
for (var p2 = p1; p2 < min.length; p2++) if (Clazz.instanceOf (bioPolymers[p2], org.jmol.modelsetbio.AminoPolymer)) for (var b = (p1 == p2 ? a + 3 : 1); b < min[p2].length - 1; b++) {
var ap2 = bioPolymers[p2];
var ib = ap2.monomers[b].leadAtomIndex;
if (bsBad.get (ib)) continue;
if ((bridge = org.jmol.modelsetbio.AminoPolymer.getBridge (min, p1, a, p2, b, bridgesP, atoms[ia], atoms[ib], ap1, ap2, vHBonds, htTemp, false, htLadders)) != null) {
} else if ((bridge = org.jmol.modelsetbio.AminoPolymer.getBridge (min, p1, a, p2, b, bridgesA, atoms[ia], atoms[ib], ap1, ap2, vHBonds, htTemp, true, htLadders)) != null) {
bridge.isAntiparallel = true;
} else {
continue;
}if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("Bridge found " + bridge);
bsDone[p1].set (a);
bsDone[p2].set (b);
htBridges.put (ia + "-" + ib, bridge);
}

}
}
}, $fz.isPrivate = true, $fz), "~A,~A,java.util.List,java.util.List,java.util.Map,java.util.Map,org.jmol.util.BitSet,java.util.List,~A");
c$.getBridge = Clazz.defineMethod (c$, "getBridge", 
($fz = function (min, p1, a, p2, b, bridges, atom1, atom2, ap1, ap2, vHBonds, htTemp, isAntiparallel, htLadders) {
var b1 = null;
var b2 = null;
var ipt = 0;
var offsets = (isAntiparallel ? org.jmol.modelsetbio.AminoPolymer.sheetOffsets[1] : org.jmol.modelsetbio.AminoPolymer.sheetOffsets[0]);
if ((b1 = org.jmol.modelsetbio.AminoPolymer.isHbonded (a + offsets[0], b + offsets[1], p1, p2, min)) != null && (b2 = org.jmol.modelsetbio.AminoPolymer.isHbonded (b + offsets[2], a + offsets[3], p2, p1, min)) != null || (b1 = org.jmol.modelsetbio.AminoPolymer.isHbonded (a + offsets[ipt = 4], b + offsets[5], p1, p2, min)) != null && (b2 = org.jmol.modelsetbio.AminoPolymer.isHbonded (b + offsets[6], a + offsets[7], p2, p1, min)) != null) {
var bridge =  new org.jmol.modelsetbio.APBridge (atom1, atom2, htLadders);
bridges.add (bridge);
if (vHBonds != null) {
var type = (isAntiparallel ? 14336 : 6144);
org.jmol.modelsetbio.AminoPolymer.addHbond (vHBonds, ap1.monomers[a + offsets[ipt]], ap2.monomers[b + offsets[++ipt]], b1[2], type, htTemp);
org.jmol.modelsetbio.AminoPolymer.addHbond (vHBonds, ap2.monomers[b + offsets[++ipt]], ap1.monomers[a + offsets[++ipt]], b2[2], type, htTemp);
}return bridge;
}return null;
}, $fz.isPrivate = true, $fz), "~A,~N,~N,~N,~N,java.util.List,org.jmol.modelset.Atom,org.jmol.modelset.Atom,org.jmol.modelsetbio.AminoPolymer,org.jmol.modelsetbio.AminoPolymer,java.util.List,java.util.Map,~B,java.util.Map");
c$.addHbond = Clazz.defineMethod (c$, "addHbond", 
($fz = function (vHBonds, donor, acceptor, iEnergy, type, htTemp) {
var nitrogen = (donor).getNitrogenAtom ();
var oxygen = (acceptor).getCarbonylOxygenAtom ();
if (htTemp != null) {
var key = nitrogen.index + " " + oxygen.index;
if (htTemp.containsKey (key)) return;
htTemp.put (key, Boolean.TRUE);
}vHBonds.add ( new org.jmol.modelset.HBond (nitrogen, oxygen, type, 1, 0, iEnergy / 1000));
}, $fz.isPrivate = true, $fz), "java.util.List,org.jmol.modelsetbio.Monomer,org.jmol.modelsetbio.Monomer,~N,~N,java.util.Map");
c$.getSheetStructures = Clazz.defineMethod (c$, "getSheetStructures", 
($fz = function (bioPolymers, bridgesA, bridgesP, htBridges, htLadders, labels, bsDone, doReport, setStructure) {
if (bridgesA.size () == 0 && bridgesP.size () == 0) return;
org.jmol.modelsetbio.AminoPolymer.createLadders (bridgesA, htBridges, htLadders, true);
org.jmol.modelsetbio.AminoPolymer.createLadders (bridgesP, htBridges, htLadders, false);
var bsEEE =  new org.jmol.util.BitSet ();
var bsB =  new org.jmol.util.BitSet ();
var e = htLadders.keySet ().iterator ();
while (e.hasNext ()) {
var ladder = e.next ();
if (ladder[0][0] == ladder[0][1] && ladder[1][0] == ladder[1][1]) {
bsB.set (ladder[0][0]);
bsB.set (ladder[1][0]);
} else {
bsEEE.setBits (ladder[0][0], ladder[0][1] + 1);
bsEEE.setBits (ladder[1][0], ladder[1][1] + 1);
}}
var bsSheet =  new org.jmol.util.BitSet ();
var bsBridge =  new org.jmol.util.BitSet ();
for (var i = bioPolymers.length; --i >= 0; ) {
if (!(Clazz.instanceOf (bioPolymers[i], org.jmol.modelsetbio.AminoPolymer))) continue;
bsSheet.clearAll ();
bsBridge.clearAll ();
var ap = bioPolymers[i];
for (var iStart = 0; iStart < ap.monomerCount; ) {
var index = ap.monomers[iStart].leadAtomIndex;
if (bsEEE.get (index)) {
var iEnd = iStart + 1;
while (iEnd < ap.monomerCount && bsEEE.get (ap.monomers[iEnd].leadAtomIndex)) iEnd++;

bsSheet.setBits (iStart, iEnd);
iStart = iEnd;
} else {
if (bsB.get (index)) bsBridge.set (iStart);
++iStart;
}}
if (doReport) {
ap.setTag (labels[i], bsBridge, 'B');
ap.setTag (labels[i], bsSheet, 'E');
}if (setStructure) {
ap.setStructure (bsSheet, org.jmol.constant.EnumStructure.SHEET);
}bsDone[i].or (bsSheet);
bsDone[i].or (bsBridge);
}
}, $fz.isPrivate = true, $fz), "~A,java.util.List,java.util.List,java.util.Map,java.util.Map,~A,~A,~B,~B");
c$.createLadders = Clazz.defineMethod (c$, "createLadders", 
($fz = function (bridges, htBridges, htLadders, isAntiparallel) {
var dir = (isAntiparallel ? -1 : 1);
var n = bridges.size ();
for (var i = 0; i < n; i++) org.jmol.modelsetbio.AminoPolymer.checkBridge (bridges.get (i), htBridges, htLadders, isAntiparallel, 1, dir);

for (var i = 0; i < n; i++) org.jmol.modelsetbio.AminoPolymer.checkBulge (bridges.get (i), htBridges, htLadders, isAntiparallel, 1);

}, $fz.isPrivate = true, $fz), "java.util.List,java.util.Map,java.util.Map,~B");
c$.checkBridge = Clazz.defineMethod (c$, "checkBridge", 
($fz = function (bridge, htBridges, htLadders, isAntiparallel, n1, n2) {
var b = htBridges.get (bridge.a.getOffsetResidueAtom ("0", n1) + "-" + bridge.b.getOffsetResidueAtom ("0", n2));
return (b != null && bridge.addBridge (b, htLadders));
}, $fz.isPrivate = true, $fz), "org.jmol.modelsetbio.APBridge,java.util.Map,java.util.Map,~B,~N,~N");
c$.checkBulge = Clazz.defineMethod (c$, "checkBulge", 
($fz = function (bridge, htBridges, htLadders, isAntiparallel, dir) {
var dir1 = (isAntiparallel ? -1 : 1);
for (var i = 0; i < 3; i++) for (var j = (i == 0 ? 1 : 0); j < 6; j++) {
org.jmol.modelsetbio.AminoPolymer.checkBridge (bridge, htBridges, htLadders, isAntiparallel, i * dir, j * dir1);
if (j > i) org.jmol.modelsetbio.AminoPolymer.checkBridge (bridge, htBridges, htLadders, isAntiparallel, j * dir, i * dir1);
}

}, $fz.isPrivate = true, $fz), "org.jmol.modelsetbio.APBridge,java.util.Map,java.util.Map,~B,~N");
Clazz.defineMethod (c$, "setStructure", 
($fz = function (bs, type) {
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
var i2 = bs.nextClearBit (i);
if (i2 < 0) i2 = this.monomerCount;
this.addStructureProtected (type, null, 0, 0, i, i2 - 1);
i = i2;
}
}, $fz.isPrivate = true, $fz), "org.jmol.util.BitSet,org.jmol.constant.EnumStructure");
c$.isHbonded = Clazz.defineMethod (c$, "isHbonded", 
($fz = function (indexDonor, indexAcceptor, pDonor, pAcceptor, min) {
if (indexDonor < 0 || indexAcceptor < 0) return null;
var min1 = min[pDonor];
var min2 = min[pAcceptor];
if (indexDonor >= min1.length || indexAcceptor >= min2.length) return null;
return (min1[indexDonor][0][0] == pAcceptor && min1[indexDonor][0][1] == indexAcceptor ? min1[indexDonor][0] : min1[indexDonor][1][0] == pAcceptor && min1[indexDonor][1][1] == indexAcceptor ? min1[indexDonor][1] : null);
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~A");
Clazz.defineMethod (c$, "setTag", 
($fz = function (tags, bs, ch) {
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) tags[i] = ch;

}, $fz.isPrivate = true, $fz), "~A,org.jmol.util.BitSet,~S");
Clazz.defineMethod (c$, "dumpSummary", 
($fz = function (labels) {
var id = this.monomers[0].getLeadAtom ().getChainID ();
var prefix = (id == '\0' ? "" : String.valueOf (id) + ":");
var sb =  new org.jmol.util.StringXBuilder ();
var lastChar = '\u0000';
var insCode1 = '\u0000';
var insCode2 = '\u0000';
var firstResno = -1;
var lastResno = -1;
for (var i = 0; i <= this.monomerCount; i++) {
if (i == this.monomerCount || labels[i] != lastChar) {
if (lastChar != '\0') sb.appendC ('\n').appendC (lastChar).append (" : ").append (prefix).appendI (firstResno).append (insCode1 == '\0' ? "" : String.valueOf (insCode1)).append ("_").append (prefix).appendI (lastResno).append (insCode2 == '\0' ? "" : String.valueOf (insCode2));
if (i == this.monomerCount) break;
lastChar = labels[i];
firstResno = this.monomers[i].getResno ();
insCode1 = this.monomers[i].getInsertionCode ();
}lastResno = this.monomers[i].getResno ();
insCode2 = this.monomers[i].getInsertionCode ();
}
return sb.toString ();
}, $fz.isPrivate = true, $fz), "~A");
Clazz.defineMethod (c$, "dumpTags", 
($fz = function (lines, bsBad, mode) {
var prefix = this.monomers[0].getLeadAtom ().getChainID () + "." + (this.bioPolymerIndexInModel + 1);
lines = org.jmol.util.TextFormat.simpleReplace (lines, "$", prefix);
var iFirst = this.monomers[0].getResno ();
var pre = "\n" + prefix;
var sb =  new org.jmol.util.StringXBuilder ();
var sb0 =  new org.jmol.util.StringXBuilder ().append (pre + ".8: ");
var sb1 =  new org.jmol.util.StringXBuilder ().append (pre + ".7: ");
var sb2 =  new org.jmol.util.StringXBuilder ().append (pre + ".6: ");
var sb3 =  new org.jmol.util.StringXBuilder ().append (pre + ".0: ");
var i = iFirst;
for (var ii = 0; ii < this.monomerCount; ii++) {
i = this.monomers[ii].getResno ();
sb0.append (i % 100 == 0 ? "" + ((Clazz.doubleToInt (i / 100)) % 100) : " ");
sb1.append (i % 10 == 0 ? "" + ((Clazz.doubleToInt (i / 10)) % 10) : " ");
sb2.appendI (i % 10);
sb3.appendC (bsBad.get (this.monomers[ii].leadAtomIndex) ? '!' : this.monomers[ii].getGroup1 ());
}
if ((mode & 1) == 1) sb.appendSB (sb0).appendSB (sb1).appendSB (sb2);
sb.append ("\n");
sb.append (lines);
if ((mode & 2) == 2) {
sb.appendSB (sb3);
sb.append ("\n\n");
}return sb.toString ().$replace ('\0', '.');
}, $fz.isPrivate = true, $fz), "~S,org.jmol.util.BitSet,~N");
Clazz.overrideMethod (c$, "calculateStructures", 
function (alphaOnly) {
if (alphaOnly) return;
if (this.structureList == null) this.structureList = this.model.getModelSet ().getStructureList ();
var structureTags =  Clazz.newCharArray (this.monomerCount, '\0');
for (var i = 0; i < this.monomerCount - 1; ++i) {
var leadingResidue = this.monomers[i];
var trailingResidue = this.monomers[i + 1];
var phi = trailingResidue.getGroupParameter (1112539143);
var psi = leadingResidue.getGroupParameter (1112539144);
if (this.isHelix (psi, phi)) {
structureTags[i] = (phi < 0 && psi < 25 ? '4' : '3');
} else if (this.isSheet (psi, phi)) {
structureTags[i] = 's';
} else if (this.isTurn (psi, phi)) {
structureTags[i] = 't';
} else {
structureTags[i] = 'n';
}if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ((0 + (this.monomers[0].getChainID ()).charCodeAt (0)) + " aminopolymer:" + i + " " + trailingResidue.getGroupParameter (1112539143) + "," + leadingResidue.getGroupParameter (1112539144) + " " + structureTags[i]);
}
for (var start = 0; start < this.monomerCount; ++start) {
if (structureTags[start] == '4') {
var end;
for (end = start + 1; end < this.monomerCount && structureTags[end] == '4'; ++end) {
}
end--;
if (end >= start + 3) {
this.addStructureProtected (org.jmol.constant.EnumStructure.HELIX, null, 0, 0, start, end);
}start = end;
}}
for (var start = 0; start < this.monomerCount; ++start) {
if (structureTags[start] == '3') {
var end;
for (end = start + 1; end < this.monomerCount && structureTags[end] == '3'; ++end) {
}
end--;
if (end >= start + 3) {
this.addStructureProtected (org.jmol.constant.EnumStructure.HELIX, null, 0, 0, start, end);
}start = end;
}}
for (var start = 0; start < this.monomerCount; ++start) {
if (structureTags[start] == 's') {
var end;
for (end = start + 1; end < this.monomerCount && structureTags[end] == 's'; ++end) {
}
end--;
if (end >= start + 2) {
this.addStructureProtected (org.jmol.constant.EnumStructure.SHEET, null, 0, 0, start, end);
}start = end;
}}
for (var start = 0; start < this.monomerCount; ++start) {
if (structureTags[start] == 't') {
var end;
for (end = start + 1; end < this.monomerCount && structureTags[end] == 't'; ++end) {
}
end--;
if (end >= start + 2) {
this.addStructureProtected (org.jmol.constant.EnumStructure.TURN, null, 0, 0, start, end);
}start = end;
}}
}, "~B");
Clazz.defineMethod (c$, "isTurn", 
($fz = function (psi, phi) {
return org.jmol.modelsetbio.AminoPolymer.checkPhiPsi (this.structureList.get (org.jmol.constant.EnumStructure.TURN), psi, phi);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "isSheet", 
($fz = function (psi, phi) {
return org.jmol.modelsetbio.AminoPolymer.checkPhiPsi (this.structureList.get (org.jmol.constant.EnumStructure.SHEET), psi, phi);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "isHelix", 
($fz = function (psi, phi) {
return org.jmol.modelsetbio.AminoPolymer.checkPhiPsi (this.structureList.get (org.jmol.constant.EnumStructure.HELIX), psi, phi);
}, $fz.isPrivate = true, $fz), "~N,~N");
c$.checkPhiPsi = Clazz.defineMethod (c$, "checkPhiPsi", 
($fz = function (list, psi, phi) {
for (var i = 0; i < list.length; i += 4) if (phi >= list[i] && phi <= list[i + 1] && psi >= list[i + 2] && psi <= list[i + 3]) return true;

return false;
}, $fz.isPrivate = true, $fz), "~A,~N,~N");
Clazz.overrideMethod (c$, "setStructureList", 
function (structureList) {
this.structureList = structureList;
}, "java.util.Map");
Clazz.defineStatics (c$,
"maxHbondAlphaDistance", 9,
"maxHbondAlphaDistance2", 81.0,
"minimumHbondDistance2", 0.25,
"sheetOffsets", [[0, -1, 1, 0, 1, 0, 0, -1], [0, 0, 0, 0, 1, -1, 1, -1]]);
});
