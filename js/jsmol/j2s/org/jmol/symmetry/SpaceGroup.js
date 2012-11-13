﻿Clazz.declarePackage ("org.jmol.symmetry");
Clazz.load (["java.util.Hashtable"], "org.jmol.symmetry.SpaceGroup", ["java.lang.Character", "java.util.Arrays", "org.jmol.symmetry.HallInfo", "$.HallTranslation", "$.SymmetryOperation", "org.jmol.util.ArrayUtil", "$.Logger", "$.Matrix4f", "$.Parser", "$.Point3f", "$.StringXBuilder", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.index = 0;
this.name = "unknown!";
this.hallSymbol = null;
this.hmSymbol = null;
this.hmSymbolFull = null;
this.hmSymbolExt = null;
this.hmSymbolAbbr = null;
this.hmSymbolAlternative = null;
this.hmSymbolAbbrShort = null;
this.ambiguityType = '\0';
this.uniqueAxis = '\0';
this.axisChoice = '\0';
this.intlTableNumber = null;
this.intlTableNumberFull = null;
this.intlTableNumberExt = null;
this.hallInfo = null;
this.latticeParameter = 0;
this.latticeCode = '\0';
this.operations = null;
this.operationCount = 0;
this.doNormalize = true;
this.finalOperations = null;
this.xyzList = null;
Clazz.instantialize (this, arguments);
}, org.jmol.symmetry, "SpaceGroup");
Clazz.prepareFields (c$, function () {
this.xyzList =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function (doNormalize) {
this.doNormalize = doNormalize;
this.addSymmetry ("x,y,z", 0);
this.index = ($t$ = ++ org.jmol.symmetry.SpaceGroup.sgIndex, org.jmol.symmetry.SpaceGroup.prototype.sgIndex = org.jmol.symmetry.SpaceGroup.sgIndex, $t$);
}, "~B");
Clazz.makeConstructor (c$, 
($fz = function (cifLine) {
this.buildSpaceGroup (cifLine);
}, $fz.isPrivate = true, $fz), "~S");
c$.createSpaceGroup = Clazz.defineMethod (c$, "createSpaceGroup", 
function (desiredSpaceGroupIndex, name, notionalUnitcell) {
var sg = null;
if (desiredSpaceGroupIndex >= 0) {
sg = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[desiredSpaceGroupIndex];
} else {
sg = org.jmol.symmetry.SpaceGroup.determineSpaceGroupNA (name, notionalUnitcell);
if (sg == null) sg = org.jmol.symmetry.SpaceGroup.createSpaceGroupN (name);
}if (sg != null) sg.generateAllOperators (null);
return sg;
}, "~N,~S,~A");
Clazz.defineMethod (c$, "addSymmetry", 
function (xyz, opId) {
xyz = xyz.toLowerCase ();
if (xyz.indexOf ("[[") < 0 && xyz.indexOf ("x4") < 0 && (xyz.indexOf ("x") < 0 || xyz.indexOf ("y") < 0 || xyz.indexOf ("z") < 0)) return -1;
return this.addOperation (xyz, opId);
}, "~S,~N");
Clazz.defineMethod (c$, "setFinalOperations", 
function (atoms, atomIndex, count, doNormalize) {
if (this.hallInfo == null && this.latticeParameter != 0) {
var h =  new org.jmol.symmetry.HallInfo (org.jmol.symmetry.HallTranslation.getHallLatticeEquivalent (this.latticeParameter));
this.generateAllOperators (h);
}if (this.index >= org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length) {
var sg = this.getDerivedSpaceGroup ();
if (sg != null) this.name = sg.getName ();
}this.finalOperations =  new Array (this.operationCount);
if (doNormalize && count > 0 && atoms != null) {
this.finalOperations[0] =  new org.jmol.symmetry.SymmetryOperation (this.operations[0], atoms, atomIndex, count, true);
var atom = atoms[atomIndex];
var c = org.jmol.util.Point3f.newP (atom);
this.finalOperations[0].transform (c);
if (c.distance (atom) > 0.0001) for (var i = 0; i < count; i++) {
atom = atoms[atomIndex + i];
c.setT (atom);
this.finalOperations[0].transform (c);
atom.setT (c);
}
}for (var i = 0; i < this.operationCount; i++) {
this.finalOperations[i] =  new org.jmol.symmetry.SymmetryOperation (this.operations[i], atoms, atomIndex, count, doNormalize);
}
}, "~A,~N,~N,~B");
Clazz.defineMethod (c$, "getOperationCount", 
function () {
return this.finalOperations.length;
});
Clazz.defineMethod (c$, "getOperation", 
function (i) {
return this.finalOperations[i];
}, "~N");
Clazz.defineMethod (c$, "getXyz", 
function (i, doNormalize) {
return this.finalOperations[i].getXyz (doNormalize);
}, "~N,~B");
Clazz.defineMethod (c$, "newPoint", 
function (i, atom1, atom2, transX, transY, transZ) {
this.finalOperations[i].newPoint (atom1, atom2, transX, transY, transZ);
}, "~N,org.jmol.util.Point3f,org.jmol.util.Point3f,~N,~N,~N");
Clazz.defineMethod (c$, "rotateEllipsoid", 
function (i, ptTemp, axes, unitCell, ptTemp1, ptTemp2) {
return this.finalOperations[i].rotateEllipsoid (ptTemp, axes, unitCell, ptTemp1, ptTemp2);
}, "~N,org.jmol.util.Point3f,~A,org.jmol.symmetry.UnitCell,org.jmol.util.Point3f,org.jmol.util.Point3f");
c$.getInfo = Clazz.defineMethod (c$, "getInfo", 
function (spaceGroup, cellInfo) {
var sg;
if (cellInfo != null) {
if (spaceGroup.indexOf ("[") >= 0) spaceGroup = spaceGroup.substring (0, spaceGroup.indexOf ("[")).trim ();
if (spaceGroup.equals ("unspecified!")) return "no space group identified in file";
sg = org.jmol.symmetry.SpaceGroup.determineSpaceGroupNA (spaceGroup, cellInfo.getNotionalUnitCell ());
} else if (spaceGroup.equalsIgnoreCase ("ALL")) {
return org.jmol.symmetry.SpaceGroup.dumpAll ();
} else if (spaceGroup.equalsIgnoreCase ("ALLSEITZ")) {
return org.jmol.symmetry.SpaceGroup.dumpAllSeitz ();
} else {
sg = org.jmol.symmetry.SpaceGroup.determineSpaceGroupN (spaceGroup);
if (sg == null) {
sg = org.jmol.symmetry.SpaceGroup.createSpaceGroupN (spaceGroup);
} else {
var sb =  new org.jmol.util.StringXBuilder ();
while (sg != null) {
sb.append (sg.dumpInfo (null));
sg = org.jmol.symmetry.SpaceGroup.determineSpaceGroupNS (spaceGroup, sg);
}
return sb.toString ();
}}return sg == null ? "?" : sg.dumpInfo (cellInfo);
}, "~S,org.jmol.api.SymmetryInterface");
Clazz.defineMethod (c$, "dumpInfo", 
function (cellInfo) {
var info = this.dumpCanonicalSeitzList ();
if (Clazz.instanceOf (info, org.jmol.symmetry.SpaceGroup)) return (info).dumpInfo (null);
var sb =  new org.jmol.util.StringXBuilder ().append ("\nHermann-Mauguin symbol: ");
sb.append (this.hmSymbol).append (this.hmSymbolExt.length > 0 ? ":" + this.hmSymbolExt : "").append ("\ninternational table number: ").append (this.intlTableNumber).append (this.intlTableNumberExt.length > 0 ? ":" + this.intlTableNumberExt : "").append ("\n\n").appendI (this.operationCount).append (" operators").append (!this.hallInfo.hallSymbol.equals ("--") ? " from Hall symbol " + this.hallInfo.hallSymbol : "").append (": ");
for (var i = 0; i < this.operationCount; i++) {
sb.append ("\n").append (this.operations[i].xyz);
}
sb.append ("\n\n").append (this.hallInfo == null ? "invalid Hall symbol" : this.hallInfo.dumpInfo ());
sb.append ("\n\ncanonical Seitz: ").append (info).append ("\n----------------------------------------------------\n");
return sb.toString ();
}, "org.jmol.api.SymmetryInterface");
Clazz.defineMethod (c$, "getName", 
function () {
return this.name;
});
Clazz.defineMethod (c$, "getLatticeDesignation", 
function () {
return this.latticeCode + ": " + org.jmol.symmetry.HallTranslation.getLatticeDesignation (this.latticeParameter);
});
Clazz.defineMethod (c$, "setLatticeParam", 
function (latticeParameter) {
this.latticeParameter = latticeParameter;
this.latticeCode = org.jmol.symmetry.HallTranslation.getLatticeCode (latticeParameter);
if (latticeParameter > 10) {
this.latticeParameter = -org.jmol.symmetry.HallTranslation.getLatticeIndex (this.latticeCode);
}}, "~N");
Clazz.defineMethod (c$, "dumpCanonicalSeitzList", 
($fz = function () {
if (this.hallInfo == null) this.hallInfo =  new org.jmol.symmetry.HallInfo (this.hallSymbol);
this.generateAllOperators (null);
var s = this.getCanonicalSeitzList ();
if (this.index >= org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length) {
var sgDerived = org.jmol.symmetry.SpaceGroup.findSpaceGroup (s);
if (sgDerived != null) return sgDerived;
}return (this.index >= 0 && this.index < org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length ? this.hallSymbol + " = " : "") + s;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getDerivedSpaceGroup", 
function () {
if (this.index >= 0 && this.index < org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length) return this;
if (this.finalOperations != null) this.setFinalOperations (null, 0, 0, false);
var s = this.getCanonicalSeitzList ();
return org.jmol.symmetry.SpaceGroup.findSpaceGroup (s);
});
Clazz.defineMethod (c$, "getCanonicalSeitzList", 
($fz = function () {
var list =  new Array (this.operationCount);
for (var i = 0; i < this.operationCount; i++) list[i] = org.jmol.symmetry.SymmetryOperation.dumpCanonicalSeitz (this.operations[i]);

java.util.Arrays.sort (list, 0, this.operationCount);
var sb =  new org.jmol.util.StringXBuilder ().append ("\n[");
for (var i = 0; i < this.operationCount; i++) sb.append (list[i].$replace ('\t', ' ').$replace ('\n', ' ')).append ("; ");

sb.append ("]");
return sb.toString ();
}, $fz.isPrivate = true, $fz));
c$.findSpaceGroup = Clazz.defineMethod (c$, "findSpaceGroup", 
($fz = function (s) {
if (org.jmol.symmetry.SpaceGroup.canonicalSeitzList == null) ($t$ = org.jmol.symmetry.SpaceGroup.canonicalSeitzList =  new Array (org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length), org.jmol.symmetry.SpaceGroup.prototype.canonicalSeitzList = org.jmol.symmetry.SpaceGroup.canonicalSeitzList, $t$);
for (var i = 0; i < org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length; i++) {
if (org.jmol.symmetry.SpaceGroup.canonicalSeitzList[i] == null) org.jmol.symmetry.SpaceGroup.canonicalSeitzList[i] = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i].dumpCanonicalSeitzList ();
if (org.jmol.symmetry.SpaceGroup.canonicalSeitzList[i].indexOf (s) >= 0) return org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
}
return null;
}, $fz.isPrivate = true, $fz), "~S");
c$.dumpAll = Clazz.defineMethod (c$, "dumpAll", 
($fz = function () {
var sb =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length; i++) sb.append ("\n----------------------\n" + org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i].dumpInfo (null));

return sb.toString ();
}, $fz.isPrivate = true, $fz));
c$.dumpAllSeitz = Clazz.defineMethod (c$, "dumpAllSeitz", 
($fz = function () {
var sb =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length; i++) sb.append ("\n").appendO (org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i].dumpCanonicalSeitzList ());

return sb.toString ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setLattice", 
($fz = function (latticeCode, isCentrosymmetric) {
this.latticeCode = latticeCode;
this.latticeParameter = org.jmol.symmetry.HallTranslation.getLatticeIndex (latticeCode);
if (!isCentrosymmetric) this.latticeParameter = -this.latticeParameter;
}, $fz.isPrivate = true, $fz), "~S,~B");
c$.createSpaceGroupN = Clazz.defineMethod (c$, "createSpaceGroupN", 
($fz = function (name) {
name = name.trim ();
var sg = org.jmol.symmetry.SpaceGroup.determineSpaceGroupN (name);
var hallInfo;
if (sg == null) {
hallInfo =  new org.jmol.symmetry.HallInfo (name);
if (hallInfo.nRotations > 0) {
sg =  new org.jmol.symmetry.SpaceGroup ("0;--;--;" + name);
sg.hallInfo = hallInfo;
} else if (name.indexOf (",") >= 0) {
sg =  new org.jmol.symmetry.SpaceGroup ("0;--;--;--");
sg.doNormalize = false;
sg.generateOperatorsFromXyzInfo (name);
}}if (sg != null) sg.generateAllOperators (null);
return sg;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "addOperation", 
($fz = function (xyz0, opId) {
if (xyz0 == null || xyz0.length < 3) {
this.xyzList =  new java.util.Hashtable ();
return -1;
}var isSpecial = (xyz0.charAt (0) == '=');
if (isSpecial) xyz0 = xyz0.substring (1);
if (this.xyzList.containsKey (xyz0)) return this.xyzList.get (xyz0).intValue ();
var symmetryOperation =  new org.jmol.symmetry.SymmetryOperation (this.doNormalize, opId);
if (!symmetryOperation.setMatrixFromXYZ (xyz0)) {
org.jmol.util.Logger.error ("couldn't interpret symmetry operation: " + xyz0);
return -1;
}var xyz = symmetryOperation.xyz;
if (!isSpecial) {
if (this.xyzList.containsKey (xyz)) return this.xyzList.get (xyz).intValue ();
this.xyzList.put (xyz, Integer.$valueOf (this.operationCount));
}if (!xyz.equals (xyz0)) this.xyzList.put (xyz0, Integer.$valueOf (this.operationCount));
if (this.operations == null) {
this.operations =  new Array (4);
this.operationCount = 0;
}if (this.operationCount == this.operations.length) this.operations = org.jmol.util.ArrayUtil.arrayCopyObject (this.operations, this.operationCount * 2);
this.operations[this.operationCount++] = symmetryOperation;
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("\naddOperation " + this.operationCount + symmetryOperation.dumpInfo ());
return this.operationCount - 1;
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "generateOperatorsFromXyzInfo", 
($fz = function (xyzInfo) {
this.addOperation (null, 0);
this.addSymmetry ("x,y,z", 0);
var terms = org.jmol.util.TextFormat.splitChars (xyzInfo.toLowerCase (), ";");
for (var i = 0; i < terms.length; i++) this.addSymmetry (terms[i], 0);

}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "generateAllOperators", 
($fz = function (h) {
if (h == null) {
h = this.hallInfo;
if (this.operationCount > 0) return;
this.operations =  new Array (4);
this.operationCount = 0;
if (this.hallInfo == null || this.hallInfo.nRotations == 0) h = this.hallInfo =  new org.jmol.symmetry.HallInfo (this.hallSymbol);
this.setLattice (this.hallInfo.latticeCode, this.hallInfo.isCentrosymmetric);
this.addOperation (null, 0);
this.addSymmetry ("x,y,z", 0);
}var mat1 =  new org.jmol.util.Matrix4f ();
var operation =  new org.jmol.util.Matrix4f ();
var newOps =  new Array (7);
for (var i = 0; i < 7; i++) newOps[i] =  new org.jmol.util.Matrix4f ();

for (var i = 0; i < h.nRotations; i++) {
mat1.setM (h.rotationTerms[i].seitzMatrix12ths);
var nRot = h.rotationTerms[i].order;
newOps[0].setIdentity ();
var nOps = this.operationCount;
for (var j = 1; j <= nRot; j++) {
newOps[j].mul2 (mat1, newOps[0]);
newOps[0].setM (newOps[j]);
for (var k = 0; k < nOps; k++) {
operation.mul2 (newOps[j], this.operations[k]);
org.jmol.symmetry.SymmetryOperation.normalizeTranslation (operation);
var xyz = org.jmol.symmetry.SymmetryOperation.getXYZFromMatrix (operation, true, true, true);
this.addSymmetrySM (xyz, operation);
}
}
}
}, $fz.isPrivate = true, $fz), "org.jmol.symmetry.HallInfo");
Clazz.defineMethod (c$, "addSymmetrySM", 
($fz = function (xyz, operation) {
var iop = this.addOperation (xyz, 0);
if (iop < 0) return;
var symmetryOperation = this.operations[iop];
symmetryOperation.setM (operation);
}, $fz.isPrivate = true, $fz), "~S,org.jmol.util.Matrix4f");
c$.determineSpaceGroupN = Clazz.defineMethod (c$, "determineSpaceGroupN", 
($fz = function (name) {
return org.jmol.symmetry.SpaceGroup.determineSpaceGroup (name, 0, 0, 0, 0, 0, 0, -1);
}, $fz.isPrivate = true, $fz), "~S");
c$.determineSpaceGroupNS = Clazz.defineMethod (c$, "determineSpaceGroupNS", 
($fz = function (name, sg) {
return org.jmol.symmetry.SpaceGroup.determineSpaceGroup (name, 0, 0, 0, 0, 0, 0, sg.index);
}, $fz.isPrivate = true, $fz), "~S,org.jmol.symmetry.SpaceGroup");
c$.determineSpaceGroupNA = Clazz.defineMethod (c$, "determineSpaceGroupNA", 
($fz = function (name, notionalUnitcell) {
if (notionalUnitcell == null) return org.jmol.symmetry.SpaceGroup.determineSpaceGroup (name, 0, 0, 0, 0, 0, 0, -1);
return org.jmol.symmetry.SpaceGroup.determineSpaceGroup (name, notionalUnitcell[0], notionalUnitcell[1], notionalUnitcell[2], notionalUnitcell[3], notionalUnitcell[4], notionalUnitcell[5], -1);
}, $fz.isPrivate = true, $fz), "~S,~A");
c$.determineSpaceGroup = Clazz.defineMethod (c$, "determineSpaceGroup", 
($fz = function (name, a, b, c, alpha, beta, gamma, lastIndex) {
var i = org.jmol.symmetry.SpaceGroup.determineSpaceGroupIndex (name, a, b, c, alpha, beta, gamma, lastIndex);
return (i >= 0 ? org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i] : null);
}, $fz.isPrivate = true, $fz), "~S,~N,~N,~N,~N,~N,~N,~N");
c$.determineSpaceGroupIndex = Clazz.defineMethod (c$, "determineSpaceGroupIndex", 
($fz = function (name, a, b, c, alpha, beta, gamma, lastIndex) {
if (lastIndex < 0) lastIndex = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions.length;
name = name.trim ().toLowerCase ();
var nameType = (name.startsWith ("hall:") ? 5 : name.startsWith ("hm:") ? 3 : 0);
if (nameType > 0) name = name.substring (nameType);
 else if (name.contains ("[")) {
nameType = 5;
name = name.substring (0, name.indexOf ("[")).trim ();
}var nameExt = name;
var i;
var haveExtension = false;
name = name.$replace ('_', ' ');
if (name.length >= 2) {
i = (name.indexOf ("-") == 0 ? 2 : 1);
if (i < name.length && name.charAt (i) != ' ') name = name.substring (0, i) + " " + name.substring (i);
name = name.substring (0, 2).toUpperCase () + name.substring (2);
}var ext = "";
if ((i = name.indexOf (":")) > 0) {
ext = name.substring (i + 1);
name = name.substring (0, i).trim ();
haveExtension = true;
}if (nameType != 5 && !haveExtension && org.jmol.util.Parser.isOneOf (name, org.jmol.symmetry.SpaceGroup.ambiguousNames)) {
ext = "?";
haveExtension = true;
}var abbr = org.jmol.util.TextFormat.replaceAllCharacters (name, " ()", "");
var s;
if (nameType != 3 && !haveExtension) for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.hallSymbol.equals (name)) return i;
}
if (nameType != 5) {
if (nameType != 3) for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.intlTableNumberFull.equals (nameExt)) return i;
}
for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.hmSymbolFull.equals (nameExt)) return i;
}
for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.hmSymbolAlternative != null && s.hmSymbolAlternative.equals (nameExt)) return i;
}
if (haveExtension) for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.hmSymbolAbbr.equals (abbr) && s.intlTableNumberExt.equals (ext)) return i;
}
if (haveExtension) for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.hmSymbolAbbrShort.equals (abbr) && s.intlTableNumberExt.equals (ext)) return i;
}
var uniqueAxis = org.jmol.symmetry.SpaceGroup.determineUniqueAxis (a, b, c, alpha, beta, gamma);
if (!haveExtension || ext.charAt (0) == '?') for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.hmSymbolAbbr.equals (abbr) || s.hmSymbolAbbrShort.equals (abbr)) {
switch (s.ambiguityType) {
case '\0':
return i;
case 'a':
if (s.uniqueAxis == uniqueAxis || uniqueAxis == '\0') return i;
break;
case 'o':
if (ext.length == 0) {
if (s.hmSymbolExt.equals ("2")) return i;
} else if (s.hmSymbolExt.equals (ext)) return i;
break;
case 't':
if (ext.length == 0) {
if (s.axisChoice == 'h') return i;
} else if ((s.axisChoice + "").equals (ext)) return i;
break;
}
}}
}if (ext.length == 0) for (i = lastIndex; --i >= 0; ) {
s = org.jmol.symmetry.SpaceGroup.spaceGroupDefinitions[i];
if (s.intlTableNumber.equals (nameExt)) return i;
}
return -1;
}, $fz.isPrivate = true, $fz), "~S,~N,~N,~N,~N,~N,~N,~N");
c$.determineUniqueAxis = Clazz.defineMethod (c$, "determineUniqueAxis", 
($fz = function (a, b, c, alpha, beta, gamma) {
if (a == b) return (b == c ? '\0' : 'c');
if (b == c) return 'a';
if (c == a) return 'b';
if (alpha == beta) return (beta == gamma ? '\0' : 'c');
if (beta == gamma) return 'a';
if (gamma == alpha) return 'b';
return '\0';
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "buildSpaceGroup", 
($fz = function (cifLine) {
this.index = ($t$ = ++ org.jmol.symmetry.SpaceGroup.sgIndex, org.jmol.symmetry.SpaceGroup.prototype.sgIndex = org.jmol.symmetry.SpaceGroup.sgIndex, $t$);
var terms = org.jmol.util.TextFormat.splitChars (cifLine.toLowerCase (), ";");
var parts;
this.intlTableNumberFull = terms[0].trim ();
parts = org.jmol.util.TextFormat.splitChars (this.intlTableNumberFull, ":");
this.intlTableNumber = parts[0];
this.intlTableNumberExt = (parts.length == 1 ? "" : parts[1]);
this.ambiguityType = '\0';
if (this.intlTableNumberExt.length > 0) {
var term = this.intlTableNumberExt;
if (term.startsWith ("-")) term = term.substring (1);
if (term.equals ("h") || term.equals ("r")) {
this.ambiguityType = 't';
this.axisChoice = this.intlTableNumberExt.charAt (0);
} else if (this.intlTableNumberExt.startsWith ("1") || this.intlTableNumberExt.startsWith ("2")) {
this.ambiguityType = 'o';
} else if (this.intlTableNumberExt.length <= 2) {
this.ambiguityType = 'a';
this.uniqueAxis = this.intlTableNumberExt.charAt (0);
}}this.hmSymbolFull = Character.toUpperCase (terms[2].charAt (0)) + terms[2].substring (1);
parts = org.jmol.util.TextFormat.splitChars (this.hmSymbolFull, ":");
this.hmSymbol = parts[0];
this.hmSymbolExt = (parts.length == 1 ? "" : parts[1]);
var pt = this.hmSymbol.indexOf (" -3");
if (pt >= 1) if ("admn".indexOf (this.hmSymbol.charAt (pt - 1)) >= 0) {
this.hmSymbolAlternative = (this.hmSymbol.substring (0, pt) + " 3" + this.hmSymbol.substring (pt + 3)).toLowerCase ();
}this.hmSymbolAbbr = org.jmol.util.TextFormat.simpleReplace (this.hmSymbol, " ", "");
this.hmSymbolAbbrShort = org.jmol.util.TextFormat.simpleReplace (this.hmSymbol, " 1", "");
this.hmSymbolAbbrShort = org.jmol.util.TextFormat.simpleReplace (this.hmSymbolAbbrShort, " ", "");
this.hallSymbol = terms[3];
if (this.hallSymbol.length > 1) this.hallSymbol = this.hallSymbol.substring (0, 2).toUpperCase () + this.hallSymbol.substring (2);
var info = this.intlTableNumber + this.hallSymbol;
if (this.intlTableNumber.charAt (0) != '0' && org.jmol.symmetry.SpaceGroup.lastInfo.equals (info)) ($t$ = org.jmol.symmetry.SpaceGroup.ambiguousNames += this.hmSymbol + ";", org.jmol.symmetry.SpaceGroup.prototype.ambiguousNames = org.jmol.symmetry.SpaceGroup.ambiguousNames, $t$);
($t$ = org.jmol.symmetry.SpaceGroup.lastInfo = info, org.jmol.symmetry.SpaceGroup.prototype.lastInfo = org.jmol.symmetry.SpaceGroup.lastInfo, $t$);
this.name = this.hallSymbol + " [" + this.hmSymbolFull + "] #" + this.intlTableNumber;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineStatics (c$,
"canonicalSeitzList", null,
"NAME_HALL", 5,
"NAME_HM", 3,
"sgIndex", -1,
"ambiguousNames", "",
"lastInfo", "");
c$.spaceGroupDefinitions = c$.prototype.spaceGroupDefinitions = [ new org.jmol.symmetry.SpaceGroup ("1;c1^1;p 1;p 1"),  new org.jmol.symmetry.SpaceGroup ("2;ci^1;p -1;-p 1"),  new org.jmol.symmetry.SpaceGroup ("3:b;c2^1;p 1 2 1;p 2y"),  new org.jmol.symmetry.SpaceGroup ("3:b;c2^1;p 2;p 2y"),  new org.jmol.symmetry.SpaceGroup ("3:c;c2^1;p 1 1 2;p 2"),  new org.jmol.symmetry.SpaceGroup ("3:a;c2^1;p 2 1 1;p 2x"),  new org.jmol.symmetry.SpaceGroup ("4:b;c2^2;p 1 21 1;p 2yb"),  new org.jmol.symmetry.SpaceGroup ("4:b;c2^2;p 21;p 2yb"),  new org.jmol.symmetry.SpaceGroup ("4:b*;c2^2;p 1 21 1*;p 2y1"),  new org.jmol.symmetry.SpaceGroup ("4:c;c2^2;p 1 1 21;p 2c"),  new org.jmol.symmetry.SpaceGroup ("4:c*;c2^2;p 1 1 21*;p 21"),  new org.jmol.symmetry.SpaceGroup ("4:a;c2^2;p 21 1 1;p 2xa"),  new org.jmol.symmetry.SpaceGroup ("4:a*;c2^2;p 21 1 1*;p 2x1"),  new org.jmol.symmetry.SpaceGroup ("5:b1;c2^3;c 1 2 1;c 2y"),  new org.jmol.symmetry.SpaceGroup ("5:b1;c2^3;c 2;c 2y"),  new org.jmol.symmetry.SpaceGroup ("5:b2;c2^3;a 1 2 1;a 2y"),  new org.jmol.symmetry.SpaceGroup ("5:b3;c2^3;i 1 2 1;i 2y"),  new org.jmol.symmetry.SpaceGroup ("5:c1;c2^3;a 1 1 2;a 2"),  new org.jmol.symmetry.SpaceGroup ("5:c2;c2^3;b 1 1 2;b 2"),  new org.jmol.symmetry.SpaceGroup ("5:c3;c2^3;i 1 1 2;i 2"),  new org.jmol.symmetry.SpaceGroup ("5:a1;c2^3;b 2 1 1;b 2x"),  new org.jmol.symmetry.SpaceGroup ("5:a2;c2^3;c 2 1 1;c 2x"),  new org.jmol.symmetry.SpaceGroup ("5:a3;c2^3;i 2 1 1;i 2x"),  new org.jmol.symmetry.SpaceGroup ("6:b;cs^1;p 1 m 1;p -2y"),  new org.jmol.symmetry.SpaceGroup ("6:b;cs^1;p m;p -2y"),  new org.jmol.symmetry.SpaceGroup ("6:c;cs^1;p 1 1 m;p -2"),  new org.jmol.symmetry.SpaceGroup ("6:a;cs^1;p m 1 1;p -2x"),  new org.jmol.symmetry.SpaceGroup ("7:b1;cs^2;p 1 c 1;p -2yc"),  new org.jmol.symmetry.SpaceGroup ("7:b1;cs^2;p c;p -2yc"),  new org.jmol.symmetry.SpaceGroup ("7:b2;cs^2;p 1 n 1;p -2yac"),  new org.jmol.symmetry.SpaceGroup ("7:b2;cs^2;p n;p -2yac"),  new org.jmol.symmetry.SpaceGroup ("7:b3;cs^2;p 1 a 1;p -2ya"),  new org.jmol.symmetry.SpaceGroup ("7:b3;cs^2;p a;p -2ya"),  new org.jmol.symmetry.SpaceGroup ("7:c1;cs^2;p 1 1 a;p -2a"),  new org.jmol.symmetry.SpaceGroup ("7:c2;cs^2;p 1 1 n;p -2ab"),  new org.jmol.symmetry.SpaceGroup ("7:c3;cs^2;p 1 1 b;p -2b"),  new org.jmol.symmetry.SpaceGroup ("7:a1;cs^2;p b 1 1;p -2xb"),  new org.jmol.symmetry.SpaceGroup ("7:a2;cs^2;p n 1 1;p -2xbc"),  new org.jmol.symmetry.SpaceGroup ("7:a3;cs^2;p c 1 1;p -2xc"),  new org.jmol.symmetry.SpaceGroup ("8:b1;cs^3;c 1 m 1;c -2y"),  new org.jmol.symmetry.SpaceGroup ("8:b1;cs^3;c m;c -2y"),  new org.jmol.symmetry.SpaceGroup ("8:b2;cs^3;a 1 m 1;a -2y"),  new org.jmol.symmetry.SpaceGroup ("8:b3;cs^3;i 1 m 1;i -2y"),  new org.jmol.symmetry.SpaceGroup ("8:b3;cs^3;i m;i -2y"),  new org.jmol.symmetry.SpaceGroup ("8:c1;cs^3;a 1 1 m;a -2"),  new org.jmol.symmetry.SpaceGroup ("8:c2;cs^3;b 1 1 m;b -2"),  new org.jmol.symmetry.SpaceGroup ("8:c3;cs^3;i 1 1 m;i -2"),  new org.jmol.symmetry.SpaceGroup ("8:a1;cs^3;b m 1 1;b -2x"),  new org.jmol.symmetry.SpaceGroup ("8:a2;cs^3;c m 1 1;c -2x"),  new org.jmol.symmetry.SpaceGroup ("8:a3;cs^3;i m 1 1;i -2x"),  new org.jmol.symmetry.SpaceGroup ("9:b1;cs^4;c 1 c 1;c -2yc"),  new org.jmol.symmetry.SpaceGroup ("9:b1;cs^4;c c;c -2yc"),  new org.jmol.symmetry.SpaceGroup ("9:b2;cs^4;a 1 n 1;a -2yab"),  new org.jmol.symmetry.SpaceGroup ("9:b3;cs^4;i 1 a 1;i -2ya"),  new org.jmol.symmetry.SpaceGroup ("9:-b1;cs^4;a 1 a 1;a -2ya"),  new org.jmol.symmetry.SpaceGroup ("9:-b2;cs^4;c 1 n 1;c -2yac"),  new org.jmol.symmetry.SpaceGroup ("9:-b3;cs^4;i 1 c 1;i -2yc"),  new org.jmol.symmetry.SpaceGroup ("9:c1;cs^4;a 1 1 a;a -2a"),  new org.jmol.symmetry.SpaceGroup ("9:c2;cs^4;b 1 1 n;b -2ab"),  new org.jmol.symmetry.SpaceGroup ("9:c3;cs^4;i 1 1 b;i -2b"),  new org.jmol.symmetry.SpaceGroup ("9:-c1;cs^4;b 1 1 b;b -2b"),  new org.jmol.symmetry.SpaceGroup ("9:-c2;cs^4;a 1 1 n;a -2ab"),  new org.jmol.symmetry.SpaceGroup ("9:-c3;cs^4;i 1 1 a;i -2a"),  new org.jmol.symmetry.SpaceGroup ("9:a1;cs^4;b b 1 1;b -2xb"),  new org.jmol.symmetry.SpaceGroup ("9:a2;cs^4;c n 1 1;c -2xac"),  new org.jmol.symmetry.SpaceGroup ("9:a3;cs^4;i c 1 1;i -2xc"),  new org.jmol.symmetry.SpaceGroup ("9:-a1;cs^4;c c 1 1;c -2xc"),  new org.jmol.symmetry.SpaceGroup ("9:-a2;cs^4;b n 1 1;b -2xab"),  new org.jmol.symmetry.SpaceGroup ("9:-a3;cs^4;i b 1 1;i -2xb"),  new org.jmol.symmetry.SpaceGroup ("10:b;c2h^1;p 1 2/m 1;-p 2y"),  new org.jmol.symmetry.SpaceGroup ("10:b;c2h^1;p 2/m;-p 2y"),  new org.jmol.symmetry.SpaceGroup ("10:c;c2h^1;p 1 1 2/m;-p 2"),  new org.jmol.symmetry.SpaceGroup ("10:a;c2h^1;p 2/m 1 1;-p 2x"),  new org.jmol.symmetry.SpaceGroup ("11:b;c2h^2;p 1 21/m 1;-p 2yb"),  new org.jmol.symmetry.SpaceGroup ("11:b;c2h^2;p 21/m;-p 2yb"),  new org.jmol.symmetry.SpaceGroup ("11:b*;c2h^2;p 1 21/m 1*;-p 2y1"),  new org.jmol.symmetry.SpaceGroup ("11:c;c2h^2;p 1 1 21/m;-p 2c"),  new org.jmol.symmetry.SpaceGroup ("11:c*;c2h^2;p 1 1 21/m*;-p 21"),  new org.jmol.symmetry.SpaceGroup ("11:a;c2h^2;p 21/m 1 1;-p 2xa"),  new org.jmol.symmetry.SpaceGroup ("11:a*;c2h^2;p 21/m 1 1*;-p 2x1"),  new org.jmol.symmetry.SpaceGroup ("12:b1;c2h^3;c 1 2/m 1;-c 2y"),  new org.jmol.symmetry.SpaceGroup ("12:b1;c2h^3;c 2/m;-c 2y"),  new org.jmol.symmetry.SpaceGroup ("12:b2;c2h^3;a 1 2/m 1;-a 2y"),  new org.jmol.symmetry.SpaceGroup ("12:b3;c2h^3;i 1 2/m 1;-i 2y"),  new org.jmol.symmetry.SpaceGroup ("12:b3;c2h^3;i 2/m;-i 2y"),  new org.jmol.symmetry.SpaceGroup ("12:c1;c2h^3;a 1 1 2/m;-a 2"),  new org.jmol.symmetry.SpaceGroup ("12:c2;c2h^3;b 1 1 2/m;-b 2"),  new org.jmol.symmetry.SpaceGroup ("12:c3;c2h^3;i 1 1 2/m;-i 2"),  new org.jmol.symmetry.SpaceGroup ("12:a1;c2h^3;b 2/m 1 1;-b 2x"),  new org.jmol.symmetry.SpaceGroup ("12:a2;c2h^3;c 2/m 1 1;-c 2x"),  new org.jmol.symmetry.SpaceGroup ("12:a3;c2h^3;i 2/m 1 1;-i 2x"),  new org.jmol.symmetry.SpaceGroup ("13:b1;c2h^4;p 1 2/c 1;-p 2yc"),  new org.jmol.symmetry.SpaceGroup ("13:b1;c2h^4;p 2/c;-p 2yc"),  new org.jmol.symmetry.SpaceGroup ("13:b2;c2h^4;p 1 2/n 1;-p 2yac"),  new org.jmol.symmetry.SpaceGroup ("13:b2;c2h^4;p 2/n;-p 2yac"),  new org.jmol.symmetry.SpaceGroup ("13:b3;c2h^4;p 1 2/a 1;-p 2ya"),  new org.jmol.symmetry.SpaceGroup ("13:b3;c2h^4;p 2/a;-p 2ya"),  new org.jmol.symmetry.SpaceGroup ("13:c1;c2h^4;p 1 1 2/a;-p 2a"),  new org.jmol.symmetry.SpaceGroup ("13:c2;c2h^4;p 1 1 2/n;-p 2ab"),  new org.jmol.symmetry.SpaceGroup ("13:c3;c2h^4;p 1 1 2/b;-p 2b"),  new org.jmol.symmetry.SpaceGroup ("13:a1;c2h^4;p 2/b 1 1;-p 2xb"),  new org.jmol.symmetry.SpaceGroup ("13:a2;c2h^4;p 2/n 1 1;-p 2xbc"),  new org.jmol.symmetry.SpaceGroup ("13:a3;c2h^4;p 2/c 1 1;-p 2xc"),  new org.jmol.symmetry.SpaceGroup ("14:b1;c2h^5;p 1 21/c 1;-p 2ybc"),  new org.jmol.symmetry.SpaceGroup ("14:b1;c2h^5;p 21/c;-p 2ybc"),  new org.jmol.symmetry.SpaceGroup ("14:b2;c2h^5;p 1 21/n 1;-p 2yn"),  new org.jmol.symmetry.SpaceGroup ("14:b2;c2h^5;p 21/n;-p 2yn"),  new org.jmol.symmetry.SpaceGroup ("14:b3;c2h^5;p 1 21/a 1;-p 2yab"),  new org.jmol.symmetry.SpaceGroup ("14:b3;c2h^5;p 21/a;-p 2yab"),  new org.jmol.symmetry.SpaceGroup ("14:c1;c2h^5;p 1 1 21/a;-p 2ac"),  new org.jmol.symmetry.SpaceGroup ("14:c2;c2h^5;p 1 1 21/n;-p 2n"),  new org.jmol.symmetry.SpaceGroup ("14:c3;c2h^5;p 1 1 21/b;-p 2bc"),  new org.jmol.symmetry.SpaceGroup ("14:a1;c2h^5;p 21/b 1 1;-p 2xab"),  new org.jmol.symmetry.SpaceGroup ("14:a2;c2h^5;p 21/n 1 1;-p 2xn"),  new org.jmol.symmetry.SpaceGroup ("14:a3;c2h^5;p 21/c 1 1;-p 2xac"),  new org.jmol.symmetry.SpaceGroup ("15:b1;c2h^6;c 1 2/c 1;-c 2yc"),  new org.jmol.symmetry.SpaceGroup ("15:b1;c2h^6;c 2/c;-c 2yc"),  new org.jmol.symmetry.SpaceGroup ("15:b2;c2h^6;a 1 2/n 1;-a 2yab"),  new org.jmol.symmetry.SpaceGroup ("15:b3;c2h^6;i 1 2/a 1;-i 2ya"),  new org.jmol.symmetry.SpaceGroup ("15:b3;c2h^6;i 2/a;-i 2ya"),  new org.jmol.symmetry.SpaceGroup ("15:-b1;c2h^6;a 1 2/a 1;-a 2ya"),  new org.jmol.symmetry.SpaceGroup ("15:-b2;c2h^6;c 1 2/n 1;-c 2yac"),  new org.jmol.symmetry.SpaceGroup ("15:-b2;c2h^6;c 2/n;-c 2yac"),  new org.jmol.symmetry.SpaceGroup ("15:-b3;c2h^6;i 1 2/c 1;-i 2yc"),  new org.jmol.symmetry.SpaceGroup ("15:-b3;c2h^6;i 2/c;-i 2yc"),  new org.jmol.symmetry.SpaceGroup ("15:c1;c2h^6;a 1 1 2/a;-a 2a"),  new org.jmol.symmetry.SpaceGroup ("15:c2;c2h^6;b 1 1 2/n;-b 2ab"),  new org.jmol.symmetry.SpaceGroup ("15:c3;c2h^6;i 1 1 2/b;-i 2b"),  new org.jmol.symmetry.SpaceGroup ("15:-c1;c2h^6;b 1 1 2/b;-b 2b"),  new org.jmol.symmetry.SpaceGroup ("15:-c2;c2h^6;a 1 1 2/n;-a 2ab"),  new org.jmol.symmetry.SpaceGroup ("15:-c3;c2h^6;i 1 1 2/a;-i 2a"),  new org.jmol.symmetry.SpaceGroup ("15:a1;c2h^6;b 2/b 1 1;-b 2xb"),  new org.jmol.symmetry.SpaceGroup ("15:a2;c2h^6;c 2/n 1 1;-c 2xac"),  new org.jmol.symmetry.SpaceGroup ("15:a3;c2h^6;i 2/c 1 1;-i 2xc"),  new org.jmol.symmetry.SpaceGroup ("15:-a1;c2h^6;c 2/c 1 1;-c 2xc"),  new org.jmol.symmetry.SpaceGroup ("15:-a2;c2h^6;b 2/n 1 1;-b 2xab"),  new org.jmol.symmetry.SpaceGroup ("15:-a3;c2h^6;i 2/b 1 1;-i 2xb"),  new org.jmol.symmetry.SpaceGroup ("16;d2^1;p 2 2 2;p 2 2"),  new org.jmol.symmetry.SpaceGroup ("17;d2^2;p 2 2 21;p 2c 2"),  new org.jmol.symmetry.SpaceGroup ("17*;d2^2;p 2 2 21*;p 21 2"),  new org.jmol.symmetry.SpaceGroup ("17:cab;d2^2;p 21 2 2;p 2a 2a"),  new org.jmol.symmetry.SpaceGroup ("17:bca;d2^2;p 2 21 2;p 2 2b"),  new org.jmol.symmetry.SpaceGroup ("18;d2^3;p 21 21 2;p 2 2ab"),  new org.jmol.symmetry.SpaceGroup ("18:cab;d2^3;p 2 21 21;p 2bc 2"),  new org.jmol.symmetry.SpaceGroup ("18:bca;d2^3;p 21 2 21;p 2ac 2ac"),  new org.jmol.symmetry.SpaceGroup ("19;d2^4;p 21 21 21;p 2ac 2ab"),  new org.jmol.symmetry.SpaceGroup ("20;d2^5;c 2 2 21;c 2c 2"),  new org.jmol.symmetry.SpaceGroup ("20*;d2^5;c 2 2 21*;c 21 2"),  new org.jmol.symmetry.SpaceGroup ("20:cab;d2^5;a 21 2 2;a 2a 2a"),  new org.jmol.symmetry.SpaceGroup ("20:cab*;d2^5;a 21 2 2*;a 2a 21"),  new org.jmol.symmetry.SpaceGroup ("20:bca;d2^5;b 2 21 2;b 2 2b"),  new org.jmol.symmetry.SpaceGroup ("21;d2^6;c 2 2 2;c 2 2"),  new org.jmol.symmetry.SpaceGroup ("21:cab;d2^6;a 2 2 2;a 2 2"),  new org.jmol.symmetry.SpaceGroup ("21:bca;d2^6;b 2 2 2;b 2 2"),  new org.jmol.symmetry.SpaceGroup ("22;d2^7;f 2 2 2;f 2 2"),  new org.jmol.symmetry.SpaceGroup ("23;d2^8;i 2 2 2;i 2 2"),  new org.jmol.symmetry.SpaceGroup ("24;d2^9;i 21 21 21;i 2b 2c"),  new org.jmol.symmetry.SpaceGroup ("25;c2v^1;p m m 2;p 2 -2"),  new org.jmol.symmetry.SpaceGroup ("25:cab;c2v^1;p 2 m m;p -2 2"),  new org.jmol.symmetry.SpaceGroup ("25:bca;c2v^1;p m 2 m;p -2 -2"),  new org.jmol.symmetry.SpaceGroup ("26;c2v^2;p m c 21;p 2c -2"),  new org.jmol.symmetry.SpaceGroup ("26*;c2v^2;p m c 21*;p 21 -2"),  new org.jmol.symmetry.SpaceGroup ("26:ba-c;c2v^2;p c m 21;p 2c -2c"),  new org.jmol.symmetry.SpaceGroup ("26:ba-c*;c2v^2;p c m 21*;p 21 -2c"),  new org.jmol.symmetry.SpaceGroup ("26:cab;c2v^2;p 21 m a;p -2a 2a"),  new org.jmol.symmetry.SpaceGroup ("26:-cba;c2v^2;p 21 a m;p -2 2a"),  new org.jmol.symmetry.SpaceGroup ("26:bca;c2v^2;p b 21 m;p -2 -2b"),  new org.jmol.symmetry.SpaceGroup ("26:a-cb;c2v^2;p m 21 b;p -2b -2"),  new org.jmol.symmetry.SpaceGroup ("27;c2v^3;p c c 2;p 2 -2c"),  new org.jmol.symmetry.SpaceGroup ("27:cab;c2v^3;p 2 a a;p -2a 2"),  new org.jmol.symmetry.SpaceGroup ("27:bca;c2v^3;p b 2 b;p -2b -2b"),  new org.jmol.symmetry.SpaceGroup ("28;c2v^4;p m a 2;p 2 -2a"),  new org.jmol.symmetry.SpaceGroup ("28*;c2v^4;p m a 2*;p 2 -21"),  new org.jmol.symmetry.SpaceGroup ("28:ba-c;c2v^4;p b m 2;p 2 -2b"),  new org.jmol.symmetry.SpaceGroup ("28:cab;c2v^4;p 2 m b;p -2b 2"),  new org.jmol.symmetry.SpaceGroup ("28:-cba;c2v^4;p 2 c m;p -2c 2"),  new org.jmol.symmetry.SpaceGroup ("28:-cba*;c2v^4;p 2 c m*;p -21 2"),  new org.jmol.symmetry.SpaceGroup ("28:bca;c2v^4;p c 2 m;p -2c -2c"),  new org.jmol.symmetry.SpaceGroup ("28:a-cb;c2v^4;p m 2 a;p -2a -2a"),  new org.jmol.symmetry.SpaceGroup ("29;c2v^5;p c a 21;p 2c -2ac"),  new org.jmol.symmetry.SpaceGroup ("29:ba-c;c2v^5;p b c 21;p 2c -2b"),  new org.jmol.symmetry.SpaceGroup ("29:cab;c2v^5;p 21 a b;p -2b 2a"),  new org.jmol.symmetry.SpaceGroup ("29:-cba;c2v^5;p 21 c a;p -2ac 2a"),  new org.jmol.symmetry.SpaceGroup ("29:bca;c2v^5;p c 21 b;p -2bc -2c"),  new org.jmol.symmetry.SpaceGroup ("29:a-cb;c2v^5;p b 21 a;p -2a -2ab"),  new org.jmol.symmetry.SpaceGroup ("30;c2v^6;p n c 2;p 2 -2bc"),  new org.jmol.symmetry.SpaceGroup ("30:ba-c;c2v^6;p c n 2;p 2 -2ac"),  new org.jmol.symmetry.SpaceGroup ("30:cab;c2v^6;p 2 n a;p -2ac 2"),  new org.jmol.symmetry.SpaceGroup ("30:-cba;c2v^6;p 2 a n;p -2ab 2"),  new org.jmol.symmetry.SpaceGroup ("30:bca;c2v^6;p b 2 n;p -2ab -2ab"),  new org.jmol.symmetry.SpaceGroup ("30:a-cb;c2v^6;p n 2 b;p -2bc -2bc"),  new org.jmol.symmetry.SpaceGroup ("31;c2v^7;p m n 21;p 2ac -2"),  new org.jmol.symmetry.SpaceGroup ("31:ba-c;c2v^7;p n m 21;p 2bc -2bc"),  new org.jmol.symmetry.SpaceGroup ("31:cab;c2v^7;p 21 m n;p -2ab 2ab"),  new org.jmol.symmetry.SpaceGroup ("31:-cba;c2v^7;p 21 n m;p -2 2ac"),  new org.jmol.symmetry.SpaceGroup ("31:bca;c2v^7;p n 21 m;p -2 -2bc"),  new org.jmol.symmetry.SpaceGroup ("31:a-cb;c2v^7;p m 21 n;p -2ab -2"),  new org.jmol.symmetry.SpaceGroup ("32;c2v^8;p b a 2;p 2 -2ab"),  new org.jmol.symmetry.SpaceGroup ("32:cab;c2v^8;p 2 c b;p -2bc 2"),  new org.jmol.symmetry.SpaceGroup ("32:bca;c2v^8;p c 2 a;p -2ac -2ac"),  new org.jmol.symmetry.SpaceGroup ("33;c2v^9;p n a 21;p 2c -2n"),  new org.jmol.symmetry.SpaceGroup ("33*;c2v^9;p n a 21*;p 21 -2n"),  new org.jmol.symmetry.SpaceGroup ("33:ba-c;c2v^9;p b n 21;p 2c -2ab"),  new org.jmol.symmetry.SpaceGroup ("33:ba-c*;c2v^9;p b n 21*;p 21 -2ab"),  new org.jmol.symmetry.SpaceGroup ("33:cab;c2v^9;p 21 n b;p -2bc 2a"),  new org.jmol.symmetry.SpaceGroup ("33:cab*;c2v^9;p 21 n b*;p -2bc 21"),  new org.jmol.symmetry.SpaceGroup ("33:-cba;c2v^9;p 21 c n;p -2n 2a"),  new org.jmol.symmetry.SpaceGroup ("33:-cba*;c2v^9;p 21 c n*;p -2n 21"),  new org.jmol.symmetry.SpaceGroup ("33:bca;c2v^9;p c 21 n;p -2n -2ac"),  new org.jmol.symmetry.SpaceGroup ("33:a-cb;c2v^9;p n 21 a;p -2ac -2n"),  new org.jmol.symmetry.SpaceGroup ("34;c2v^10;p n n 2;p 2 -2n"),  new org.jmol.symmetry.SpaceGroup ("34:cab;c2v^10;p 2 n n;p -2n 2"),  new org.jmol.symmetry.SpaceGroup ("34:bca;c2v^10;p n 2 n;p -2n -2n"),  new org.jmol.symmetry.SpaceGroup ("35;c2v^11;c m m 2;c 2 -2"),  new org.jmol.symmetry.SpaceGroup ("35:cab;c2v^11;a 2 m m;a -2 2"),  new org.jmol.symmetry.SpaceGroup ("35:bca;c2v^11;b m 2 m;b -2 -2"),  new org.jmol.symmetry.SpaceGroup ("36;c2v^12;c m c 21;c 2c -2"),  new org.jmol.symmetry.SpaceGroup ("36*;c2v^12;c m c 21*;c 21 -2"),  new org.jmol.symmetry.SpaceGroup ("36:ba-c;c2v^12;c c m 21;c 2c -2c"),  new org.jmol.symmetry.SpaceGroup ("36:ba-c*;c2v^12;c c m 21*;c 21 -2c"),  new org.jmol.symmetry.SpaceGroup ("36:cab;c2v^12;a 21 m a;a -2a 2a"),  new org.jmol.symmetry.SpaceGroup ("36:cab*;c2v^12;a 21 m a*;a -2a 21"),  new org.jmol.symmetry.SpaceGroup ("36:-cba;c2v^12;a 21 a m;a -2 2a"),  new org.jmol.symmetry.SpaceGroup ("36:-cba*;c2v^12;a 21 a m*;a -2 21"),  new org.jmol.symmetry.SpaceGroup ("36:bca;c2v^12;b b 21 m;b -2 -2b"),  new org.jmol.symmetry.SpaceGroup ("36:a-cb;c2v^12;b m 21 b;b -2b -2"),  new org.jmol.symmetry.SpaceGroup ("37;c2v^13;c c c 2;c 2 -2c"),  new org.jmol.symmetry.SpaceGroup ("37:cab;c2v^13;a 2 a a;a -2a 2"),  new org.jmol.symmetry.SpaceGroup ("37:bca;c2v^13;b b 2 b;b -2b -2b"),  new org.jmol.symmetry.SpaceGroup ("38;c2v^14;a m m 2;a 2 -2"),  new org.jmol.symmetry.SpaceGroup ("38:ba-c;c2v^14;b m m 2;b 2 -2"),  new org.jmol.symmetry.SpaceGroup ("38:cab;c2v^14;b 2 m m;b -2 2"),  new org.jmol.symmetry.SpaceGroup ("38:-cba;c2v^14;c 2 m m;c -2 2"),  new org.jmol.symmetry.SpaceGroup ("38:bca;c2v^14;c m 2 m;c -2 -2"),  new org.jmol.symmetry.SpaceGroup ("38:a-cb;c2v^14;a m 2 m;a -2 -2"),  new org.jmol.symmetry.SpaceGroup ("39;c2v^15;a b m 2;a 2 -2b"),  new org.jmol.symmetry.SpaceGroup ("39:ba-c;c2v^15;b m a 2;b 2 -2a"),  new org.jmol.symmetry.SpaceGroup ("39:cab;c2v^15;b 2 c m;b -2a 2"),  new org.jmol.symmetry.SpaceGroup ("39:-cba;c2v^15;c 2 m b;c -2a 2"),  new org.jmol.symmetry.SpaceGroup ("39:bca;c2v^15;c m 2 a;c -2a -2a"),  new org.jmol.symmetry.SpaceGroup ("39:a-cb;c2v^15;a c 2 m;a -2b -2b"),  new org.jmol.symmetry.SpaceGroup ("40;c2v^16;a m a 2;a 2 -2a"),  new org.jmol.symmetry.SpaceGroup ("40:ba-c;c2v^16;b b m 2;b 2 -2b"),  new org.jmol.symmetry.SpaceGroup ("40:cab;c2v^16;b 2 m b;b -2b 2"),  new org.jmol.symmetry.SpaceGroup ("40:-cba;c2v^16;c 2 c m;c -2c 2"),  new org.jmol.symmetry.SpaceGroup ("40:bca;c2v^16;c c 2 m;c -2c -2c"),  new org.jmol.symmetry.SpaceGroup ("40:a-cb;c2v^16;a m 2 a;a -2a -2a"),  new org.jmol.symmetry.SpaceGroup ("41;c2v^17;a b a 2;a 2 -2ab"),  new org.jmol.symmetry.SpaceGroup ("41:ba-c;c2v^17;b b a 2;b 2 -2ab"),  new org.jmol.symmetry.SpaceGroup ("41:cab;c2v^17;b 2 c b;b -2ab 2"),  new org.jmol.symmetry.SpaceGroup ("41:-cba;c2v^17;c 2 c b;c -2ac 2"),  new org.jmol.symmetry.SpaceGroup ("41:bca;c2v^17;c c 2 a;c -2ac -2ac"),  new org.jmol.symmetry.SpaceGroup ("41:a-cb;c2v^17;a c 2 a;a -2ab -2ab"),  new org.jmol.symmetry.SpaceGroup ("42;c2v^18;f m m 2;f 2 -2"),  new org.jmol.symmetry.SpaceGroup ("42:cab;c2v^18;f 2 m m;f -2 2"),  new org.jmol.symmetry.SpaceGroup ("42:bca;c2v^18;f m 2 m;f -2 -2"),  new org.jmol.symmetry.SpaceGroup ("43;c2v^19;f d d 2;f 2 -2d"),  new org.jmol.symmetry.SpaceGroup ("43:cab;c2v^19;f 2 d d;f -2d 2"),  new org.jmol.symmetry.SpaceGroup ("43:bca;c2v^19;f d 2 d;f -2d -2d"),  new org.jmol.symmetry.SpaceGroup ("44;c2v^20;i m m 2;i 2 -2"),  new org.jmol.symmetry.SpaceGroup ("44:cab;c2v^20;i 2 m m;i -2 2"),  new org.jmol.symmetry.SpaceGroup ("44:bca;c2v^20;i m 2 m;i -2 -2"),  new org.jmol.symmetry.SpaceGroup ("45;c2v^21;i b a 2;i 2 -2c"),  new org.jmol.symmetry.SpaceGroup ("45:cab;c2v^21;i 2 c b;i -2a 2"),  new org.jmol.symmetry.SpaceGroup ("45:bca;c2v^21;i c 2 a;i -2b -2b"),  new org.jmol.symmetry.SpaceGroup ("46;c2v^22;i m a 2;i 2 -2a"),  new org.jmol.symmetry.SpaceGroup ("46:ba-c;c2v^22;i b m 2;i 2 -2b"),  new org.jmol.symmetry.SpaceGroup ("46:cab;c2v^22;i 2 m b;i -2b 2"),  new org.jmol.symmetry.SpaceGroup ("46:-cba;c2v^22;i 2 c m;i -2c 2"),  new org.jmol.symmetry.SpaceGroup ("46:bca;c2v^22;i c 2 m;i -2c -2c"),  new org.jmol.symmetry.SpaceGroup ("46:a-cb;c2v^22;i m 2 a;i -2a -2a"),  new org.jmol.symmetry.SpaceGroup ("47;d2h^1;p m m m;-p 2 2"),  new org.jmol.symmetry.SpaceGroup ("48:1;d2h^2;p n n n:1;p 2 2 -1n"),  new org.jmol.symmetry.SpaceGroup ("48:2;d2h^2;p n n n:2;-p 2ab 2bc"),  new org.jmol.symmetry.SpaceGroup ("49;d2h^3;p c c m;-p 2 2c"),  new org.jmol.symmetry.SpaceGroup ("49:cab;d2h^3;p m a a;-p 2a 2"),  new org.jmol.symmetry.SpaceGroup ("49:bca;d2h^3;p b m b;-p 2b 2b"),  new org.jmol.symmetry.SpaceGroup ("50:1;d2h^4;p b a n:1;p 2 2 -1ab"),  new org.jmol.symmetry.SpaceGroup ("50:2;d2h^4;p b a n:2;-p 2ab 2b"),  new org.jmol.symmetry.SpaceGroup ("50:1cab;d2h^4;p n c b:1;p 2 2 -1bc"),  new org.jmol.symmetry.SpaceGroup ("50:2cab;d2h^4;p n c b:2;-p 2b 2bc"),  new org.jmol.symmetry.SpaceGroup ("50:1bca;d2h^4;p c n a:1;p 2 2 -1ac"),  new org.jmol.symmetry.SpaceGroup ("50:2bca;d2h^4;p c n a:2;-p 2a 2c"),  new org.jmol.symmetry.SpaceGroup ("51;d2h^5;p m m a;-p 2a 2a"),  new org.jmol.symmetry.SpaceGroup ("51:ba-c;d2h^5;p m m b;-p 2b 2"),  new org.jmol.symmetry.SpaceGroup ("51:cab;d2h^5;p b m m;-p 2 2b"),  new org.jmol.symmetry.SpaceGroup ("51:-cba;d2h^5;p c m m;-p 2c 2c"),  new org.jmol.symmetry.SpaceGroup ("51:bca;d2h^5;p m c m;-p 2c 2"),  new org.jmol.symmetry.SpaceGroup ("51:a-cb;d2h^5;p m a m;-p 2 2a"),  new org.jmol.symmetry.SpaceGroup ("52;d2h^6;p n n a;-p 2a 2bc"),  new org.jmol.symmetry.SpaceGroup ("52:ba-c;d2h^6;p n n b;-p 2b 2n"),  new org.jmol.symmetry.SpaceGroup ("52:cab;d2h^6;p b n n;-p 2n 2b"),  new org.jmol.symmetry.SpaceGroup ("52:-cba;d2h^6;p c n n;-p 2ab 2c"),  new org.jmol.symmetry.SpaceGroup ("52:bca;d2h^6;p n c n;-p 2ab 2n"),  new org.jmol.symmetry.SpaceGroup ("52:a-cb;d2h^6;p n a n;-p 2n 2bc"),  new org.jmol.symmetry.SpaceGroup ("53;d2h^7;p m n a;-p 2ac 2"),  new org.jmol.symmetry.SpaceGroup ("53:ba-c;d2h^7;p n m b;-p 2bc 2bc"),  new org.jmol.symmetry.SpaceGroup ("53:cab;d2h^7;p b m n;-p 2ab 2ab"),  new org.jmol.symmetry.SpaceGroup ("53:-cba;d2h^7;p c n m;-p 2 2ac"),  new org.jmol.symmetry.SpaceGroup ("53:bca;d2h^7;p n c m;-p 2 2bc"),  new org.jmol.symmetry.SpaceGroup ("53:a-cb;d2h^7;p m a n;-p 2ab 2"),  new org.jmol.symmetry.SpaceGroup ("54;d2h^8;p c c a;-p 2a 2ac"),  new org.jmol.symmetry.SpaceGroup ("54:ba-c;d2h^8;p c c b;-p 2b 2c"),  new org.jmol.symmetry.SpaceGroup ("54:cab;d2h^8;p b a a;-p 2a 2b"),  new org.jmol.symmetry.SpaceGroup ("54:-cba;d2h^8;p c a a;-p 2ac 2c"),  new org.jmol.symmetry.SpaceGroup ("54:bca;d2h^8;p b c b;-p 2bc 2b"),  new org.jmol.symmetry.SpaceGroup ("54:a-cb;d2h^8;p b a b;-p 2b 2ab"),  new org.jmol.symmetry.SpaceGroup ("55;d2h^9;p b a m;-p 2 2ab"),  new org.jmol.symmetry.SpaceGroup ("55:cab;d2h^9;p m c b;-p 2bc 2"),  new org.jmol.symmetry.SpaceGroup ("55:bca;d2h^9;p c m a;-p 2ac 2ac"),  new org.jmol.symmetry.SpaceGroup ("56;d2h^10;p c c n;-p 2ab 2ac"),  new org.jmol.symmetry.SpaceGroup ("56:cab;d2h^10;p n a a;-p 2ac 2bc"),  new org.jmol.symmetry.SpaceGroup ("56:bca;d2h^10;p b n b;-p 2bc 2ab"),  new org.jmol.symmetry.SpaceGroup ("57;d2h^11;p b c m;-p 2c 2b"),  new org.jmol.symmetry.SpaceGroup ("57:ba-c;d2h^11;p c a m;-p 2c 2ac"),  new org.jmol.symmetry.SpaceGroup ("57:cab;d2h^11;p m c a;-p 2ac 2a"),  new org.jmol.symmetry.SpaceGroup ("57:-cba;d2h^11;p m a b;-p 2b 2a"),  new org.jmol.symmetry.SpaceGroup ("57:bca;d2h^11;p b m a;-p 2a 2ab"),  new org.jmol.symmetry.SpaceGroup ("57:a-cb;d2h^11;p c m b;-p 2bc 2c"),  new org.jmol.symmetry.SpaceGroup ("58;d2h^12;p n n m;-p 2 2n"),  new org.jmol.symmetry.SpaceGroup ("58:cab;d2h^12;p m n n;-p 2n 2"),  new org.jmol.symmetry.SpaceGroup ("58:bca;d2h^12;p n m n;-p 2n 2n"),  new org.jmol.symmetry.SpaceGroup ("59:1;d2h^13;p m m n:1;p 2 2ab -1ab"),  new org.jmol.symmetry.SpaceGroup ("59:2;d2h^13;p m m n:2;-p 2ab 2a"),  new org.jmol.symmetry.SpaceGroup ("59:1cab;d2h^13;p n m m:1;p 2bc 2 -1bc"),  new org.jmol.symmetry.SpaceGroup ("59:2cab;d2h^13;p n m m:2;-p 2c 2bc"),  new org.jmol.symmetry.SpaceGroup ("59:1bca;d2h^13;p m n m:1;p 2ac 2ac -1ac"),  new org.jmol.symmetry.SpaceGroup ("59:2bca;d2h^13;p m n m:2;-p 2c 2a"),  new org.jmol.symmetry.SpaceGroup ("60;d2h^14;p b c n;-p 2n 2ab"),  new org.jmol.symmetry.SpaceGroup ("60:ba-c;d2h^14;p c a n;-p 2n 2c"),  new org.jmol.symmetry.SpaceGroup ("60:cab;d2h^14;p n c a;-p 2a 2n"),  new org.jmol.symmetry.SpaceGroup ("60:-cba;d2h^14;p n a b;-p 2bc 2n"),  new org.jmol.symmetry.SpaceGroup ("60:bca;d2h^14;p b n a;-p 2ac 2b"),  new org.jmol.symmetry.SpaceGroup ("60:a-cb;d2h^14;p c n b;-p 2b 2ac"),  new org.jmol.symmetry.SpaceGroup ("61;d2h^15;p b c a;-p 2ac 2ab"),  new org.jmol.symmetry.SpaceGroup ("61:ba-c;d2h^15;p c a b;-p 2bc 2ac"),  new org.jmol.symmetry.SpaceGroup ("62;d2h^16;p n m a;-p 2ac 2n"),  new org.jmol.symmetry.SpaceGroup ("62:ba-c;d2h^16;p m n b;-p 2bc 2a"),  new org.jmol.symmetry.SpaceGroup ("62:cab;d2h^16;p b n m;-p 2c 2ab"),  new org.jmol.symmetry.SpaceGroup ("62:-cba;d2h^16;p c m n;-p 2n 2ac"),  new org.jmol.symmetry.SpaceGroup ("62:bca;d2h^16;p m c n;-p 2n 2a"),  new org.jmol.symmetry.SpaceGroup ("62:a-cb;d2h^16;p n a m;-p 2c 2n"),  new org.jmol.symmetry.SpaceGroup ("63;d2h^17;c m c m;-c 2c 2"),  new org.jmol.symmetry.SpaceGroup ("63:ba-c;d2h^17;c c m m;-c 2c 2c"),  new org.jmol.symmetry.SpaceGroup ("63:cab;d2h^17;a m m a;-a 2a 2a"),  new org.jmol.symmetry.SpaceGroup ("63:-cba;d2h^17;a m a m;-a 2 2a"),  new org.jmol.symmetry.SpaceGroup ("63:bca;d2h^17;b b m m;-b 2 2b"),  new org.jmol.symmetry.SpaceGroup ("63:a-cb;d2h^17;b m m b;-b 2b 2"),  new org.jmol.symmetry.SpaceGroup ("64;d2h^18;c m c a;-c 2ac 2"),  new org.jmol.symmetry.SpaceGroup ("64:ba-c;d2h^18;c c m b;-c 2ac 2ac"),  new org.jmol.symmetry.SpaceGroup ("64:cab;d2h^18;a b m a;-a 2ab 2ab"),  new org.jmol.symmetry.SpaceGroup ("64:-cba;d2h^18;a c a m;-a 2 2ab"),  new org.jmol.symmetry.SpaceGroup ("64:bca;d2h^18;b b c m;-b 2 2ab"),  new org.jmol.symmetry.SpaceGroup ("64:a-cb;d2h^18;b m a b;-b 2ab 2"),  new org.jmol.symmetry.SpaceGroup ("65;d2h^19;c m m m;-c 2 2"),  new org.jmol.symmetry.SpaceGroup ("65:cab;d2h^19;a m m m;-a 2 2"),  new org.jmol.symmetry.SpaceGroup ("65:bca;d2h^19;b m m m;-b 2 2"),  new org.jmol.symmetry.SpaceGroup ("66;d2h^20;c c c m;-c 2 2c"),  new org.jmol.symmetry.SpaceGroup ("66:cab;d2h^20;a m a a;-a 2a 2"),  new org.jmol.symmetry.SpaceGroup ("66:bca;d2h^20;b b m b;-b 2b 2b"),  new org.jmol.symmetry.SpaceGroup ("67;d2h^21;c m m a;-c 2a 2"),  new org.jmol.symmetry.SpaceGroup ("67:ba-c;d2h^21;c m m b;-c 2a 2a"),  new org.jmol.symmetry.SpaceGroup ("67:cab;d2h^21;a b m m;-a 2b 2b"),  new org.jmol.symmetry.SpaceGroup ("67:-cba;d2h^21;a c m m;-a 2 2b"),  new org.jmol.symmetry.SpaceGroup ("67:bca;d2h^21;b m c m;-b 2 2a"),  new org.jmol.symmetry.SpaceGroup ("67:a-cb;d2h^21;b m a m;-b 2a 2"),  new org.jmol.symmetry.SpaceGroup ("68:1;d2h^22;c c c a:1;c 2 2 -1ac"),  new org.jmol.symmetry.SpaceGroup ("68:2;d2h^22;c c c a:2;-c 2a 2ac"),  new org.jmol.symmetry.SpaceGroup ("68:1ba-c;d2h^22;c c c b:1;c 2 2 -1ac"),  new org.jmol.symmetry.SpaceGroup ("68:2ba-c;d2h^22;c c c b:2;-c 2a 2c"),  new org.jmol.symmetry.SpaceGroup ("68:1cab;d2h^22;a b a a:1;a 2 2 -1ab"),  new org.jmol.symmetry.SpaceGroup ("68:2cab;d2h^22;a b a a:2;-a 2a 2b"),  new org.jmol.symmetry.SpaceGroup ("68:1-cba;d2h^22;a c a a:1;a 2 2 -1ab"),  new org.jmol.symmetry.SpaceGroup ("68:2-cba;d2h^22;a c a a:2;-a 2ab 2b"),  new org.jmol.symmetry.SpaceGroup ("68:1bca;d2h^22;b b c b:1;b 2 2 -1ab"),  new org.jmol.symmetry.SpaceGroup ("68:2bca;d2h^22;b b c b:2;-b 2ab 2b"),  new org.jmol.symmetry.SpaceGroup ("68:1a-cb;d2h^22;b b a b:1;b 2 2 -1ab"),  new org.jmol.symmetry.SpaceGroup ("68:2a-cb;d2h^22;b b a b:2;-b 2b 2ab"),  new org.jmol.symmetry.SpaceGroup ("69;d2h^23;f m m m;-f 2 2"),  new org.jmol.symmetry.SpaceGroup ("70:1;d2h^24;f d d d:1;f 2 2 -1d"),  new org.jmol.symmetry.SpaceGroup ("70:2;d2h^24;f d d d:2;-f 2uv 2vw"),  new org.jmol.symmetry.SpaceGroup ("71;d2h^25;i m m m;-i 2 2"),  new org.jmol.symmetry.SpaceGroup ("72;d2h^26;i b a m;-i 2 2c"),  new org.jmol.symmetry.SpaceGroup ("72:cab;d2h^26;i m c b;-i 2a 2"),  new org.jmol.symmetry.SpaceGroup ("72:bca;d2h^26;i c m a;-i 2b 2b"),  new org.jmol.symmetry.SpaceGroup ("73;d2h^27;i b c a;-i 2b 2c"),  new org.jmol.symmetry.SpaceGroup ("73:ba-c;d2h^27;i c a b;-i 2a 2b"),  new org.jmol.symmetry.SpaceGroup ("74;d2h^28;i m m a;-i 2b 2"),  new org.jmol.symmetry.SpaceGroup ("74:ba-c;d2h^28;i m m b;-i 2a 2a"),  new org.jmol.symmetry.SpaceGroup ("74:cab;d2h^28;i b m m;-i 2c 2c"),  new org.jmol.symmetry.SpaceGroup ("74:-cba;d2h^28;i c m m;-i 2 2b"),  new org.jmol.symmetry.SpaceGroup ("74:bca;d2h^28;i m c m;-i 2 2a"),  new org.jmol.symmetry.SpaceGroup ("74:a-cb;d2h^28;i m a m;-i 2c 2"),  new org.jmol.symmetry.SpaceGroup ("75;c4^1;p 4;p 4"),  new org.jmol.symmetry.SpaceGroup ("76;c4^2;p 41;p 4w"),  new org.jmol.symmetry.SpaceGroup ("76*;c4^2;p 41*;p 41"),  new org.jmol.symmetry.SpaceGroup ("77;c4^3;p 42;p 4c"),  new org.jmol.symmetry.SpaceGroup ("77*;c4^3;p 42*;p 42"),  new org.jmol.symmetry.SpaceGroup ("78;c4^4;p 43;p 4cw"),  new org.jmol.symmetry.SpaceGroup ("78*;c4^4;p 43*;p 43"),  new org.jmol.symmetry.SpaceGroup ("79;c4^5;i 4;i 4"),  new org.jmol.symmetry.SpaceGroup ("80;c4^6;i 41;i 4bw"),  new org.jmol.symmetry.SpaceGroup ("81;s4^1;p -4;p -4"),  new org.jmol.symmetry.SpaceGroup ("82;s4^2;i -4;i -4"),  new org.jmol.symmetry.SpaceGroup ("83;c4h^1;p 4/m;-p 4"),  new org.jmol.symmetry.SpaceGroup ("84;c4h^2;p 42/m;-p 4c"),  new org.jmol.symmetry.SpaceGroup ("84*;c4h^2;p 42/m*;-p 42"),  new org.jmol.symmetry.SpaceGroup ("85:1;c4h^3;p 4/n:1;p 4ab -1ab"),  new org.jmol.symmetry.SpaceGroup ("85:2;c4h^3;p 4/n:2;-p 4a"),  new org.jmol.symmetry.SpaceGroup ("86:1;c4h^4;p 42/n:1;p 4n -1n"),  new org.jmol.symmetry.SpaceGroup ("86:2;c4h^4;p 42/n:2;-p 4bc"),  new org.jmol.symmetry.SpaceGroup ("87;c4h^5;i 4/m;-i 4"),  new org.jmol.symmetry.SpaceGroup ("88:1;c4h^6;i 41/a:1;i 4bw -1bw"),  new org.jmol.symmetry.SpaceGroup ("88:2;c4h^6;i 41/a:2;-i 4ad"),  new org.jmol.symmetry.SpaceGroup ("89;d4^1;p 4 2 2;p 4 2"),  new org.jmol.symmetry.SpaceGroup ("90;d4^2;p 4 21 2;p 4ab 2ab"),  new org.jmol.symmetry.SpaceGroup ("91;d4^3;p 41 2 2;p 4w 2c"),  new org.jmol.symmetry.SpaceGroup ("91*;d4^3;p 41 2 2*;p 41 2c"),  new org.jmol.symmetry.SpaceGroup ("92;d4^4;p 41 21 2;p 4abw 2nw"),  new org.jmol.symmetry.SpaceGroup ("93;d4^5;p 42 2 2;p 4c 2"),  new org.jmol.symmetry.SpaceGroup ("93*;d4^5;p 42 2 2*;p 42 2"),  new org.jmol.symmetry.SpaceGroup ("94;d4^6;p 42 21 2;p 4n 2n"),  new org.jmol.symmetry.SpaceGroup ("95;d4^7;p 43 2 2;p 4cw 2c"),  new org.jmol.symmetry.SpaceGroup ("95*;d4^7;p 43 2 2*;p 43 2c"),  new org.jmol.symmetry.SpaceGroup ("96;d4^8;p 43 21 2;p 4nw 2abw"),  new org.jmol.symmetry.SpaceGroup ("97;d4^9;i 4 2 2;i 4 2"),  new org.jmol.symmetry.SpaceGroup ("98;d4^10;i 41 2 2;i 4bw 2bw"),  new org.jmol.symmetry.SpaceGroup ("99;c4v^1;p 4 m m;p 4 -2"),  new org.jmol.symmetry.SpaceGroup ("100;c4v^2;p 4 b m;p 4 -2ab"),  new org.jmol.symmetry.SpaceGroup ("101;c4v^3;p 42 c m;p 4c -2c"),  new org.jmol.symmetry.SpaceGroup ("101*;c4v^3;p 42 c m*;p 42 -2c"),  new org.jmol.symmetry.SpaceGroup ("102;c4v^4;p 42 n m;p 4n -2n"),  new org.jmol.symmetry.SpaceGroup ("103;c4v^5;p 4 c c;p 4 -2c"),  new org.jmol.symmetry.SpaceGroup ("104;c4v^6;p 4 n c;p 4 -2n"),  new org.jmol.symmetry.SpaceGroup ("105;c4v^7;p 42 m c;p 4c -2"),  new org.jmol.symmetry.SpaceGroup ("105*;c4v^7;p 42 m c*;p 42 -2"),  new org.jmol.symmetry.SpaceGroup ("106;c4v^8;p 42 b c;p 4c -2ab"),  new org.jmol.symmetry.SpaceGroup ("106*;c4v^8;p 42 b c*;p 42 -2ab"),  new org.jmol.symmetry.SpaceGroup ("107;c4v^9;i 4 m m;i 4 -2"),  new org.jmol.symmetry.SpaceGroup ("108;c4v^10;i 4 c m;i 4 -2c"),  new org.jmol.symmetry.SpaceGroup ("109;c4v^11;i 41 m d;i 4bw -2"),  new org.jmol.symmetry.SpaceGroup ("110;c4v^12;i 41 c d;i 4bw -2c"),  new org.jmol.symmetry.SpaceGroup ("111;d2d^1;p -4 2 m;p -4 2"),  new org.jmol.symmetry.SpaceGroup ("112;d2d^2;p -4 2 c;p -4 2c"),  new org.jmol.symmetry.SpaceGroup ("113;d2d^3;p -4 21 m;p -4 2ab"),  new org.jmol.symmetry.SpaceGroup ("114;d2d^4;p -4 21 c;p -4 2n"),  new org.jmol.symmetry.SpaceGroup ("115;d2d^5;p -4 m 2;p -4 -2"),  new org.jmol.symmetry.SpaceGroup ("116;d2d^6;p -4 c 2;p -4 -2c"),  new org.jmol.symmetry.SpaceGroup ("117;d2d^7;p -4 b 2;p -4 -2ab"),  new org.jmol.symmetry.SpaceGroup ("118;d2d^8;p -4 n 2;p -4 -2n"),  new org.jmol.symmetry.SpaceGroup ("119;d2d^9;i -4 m 2;i -4 -2"),  new org.jmol.symmetry.SpaceGroup ("120;d2d^10;i -4 c 2;i -4 -2c"),  new org.jmol.symmetry.SpaceGroup ("121;d2d^11;i -4 2 m;i -4 2"),  new org.jmol.symmetry.SpaceGroup ("122;d2d^12;i -4 2 d;i -4 2bw"),  new org.jmol.symmetry.SpaceGroup ("123;d4h^1;p 4/m m m;-p 4 2"),  new org.jmol.symmetry.SpaceGroup ("124;d4h^2;p 4/m c c;-p 4 2c"),  new org.jmol.symmetry.SpaceGroup ("125:1;d4h^3;p 4/n b m:1;p 4 2 -1ab"),  new org.jmol.symmetry.SpaceGroup ("125:2;d4h^3;p 4/n b m:2;-p 4a 2b"),  new org.jmol.symmetry.SpaceGroup ("126:1;d4h^4;p 4/n n c:1;p 4 2 -1n"),  new org.jmol.symmetry.SpaceGroup ("126:2;d4h^4;p 4/n n c:2;-p 4a 2bc"),  new org.jmol.symmetry.SpaceGroup ("127;d4h^5;p 4/m b m;-p 4 2ab"),  new org.jmol.symmetry.SpaceGroup ("128;d4h^6;p 4/m n c;-p 4 2n"),  new org.jmol.symmetry.SpaceGroup ("129:1;d4h^7;p 4/n m m:1;p 4ab 2ab -1ab"),  new org.jmol.symmetry.SpaceGroup ("129:2;d4h^7;p 4/n m m:2;-p 4a 2a"),  new org.jmol.symmetry.SpaceGroup ("130:1;d4h^8;p 4/n c c:1;p 4ab 2n -1ab"),  new org.jmol.symmetry.SpaceGroup ("130:2;d4h^8;p 4/n c c:2;-p 4a 2ac"),  new org.jmol.symmetry.SpaceGroup ("131;d4h^9;p 42/m m c;-p 4c 2"),  new org.jmol.symmetry.SpaceGroup ("132;d4h^10;p 42/m c m;-p 4c 2c"),  new org.jmol.symmetry.SpaceGroup ("133:1;d4h^11;p 42/n b c:1;p 4n 2c -1n"),  new org.jmol.symmetry.SpaceGroup ("133:2;d4h^11;p 42/n b c:2;-p 4ac 2b"),  new org.jmol.symmetry.SpaceGroup ("134:1;d4h^12;p 42/n n m:1;p 4n 2 -1n"),  new org.jmol.symmetry.SpaceGroup ("134:2;d4h^12;p 42/n n m:2;-p 4ac 2bc"),  new org.jmol.symmetry.SpaceGroup ("135;d4h^13;p 42/m b c;-p 4c 2ab"),  new org.jmol.symmetry.SpaceGroup ("135*;d4h^13;p 42/m b c*;-p 42 2ab"),  new org.jmol.symmetry.SpaceGroup ("136;d4h^14;p 42/m n m;-p 4n 2n"),  new org.jmol.symmetry.SpaceGroup ("137:1;d4h^15;p 42/n m c:1;p 4n 2n -1n"),  new org.jmol.symmetry.SpaceGroup ("137:2;d4h^15;p 42/n m c:2;-p 4ac 2a"),  new org.jmol.symmetry.SpaceGroup ("138:1;d4h^16;p 42/n c m:1;p 4n 2ab -1n"),  new org.jmol.symmetry.SpaceGroup ("138:2;d4h^16;p 42/n c m:2;-p 4ac 2ac"),  new org.jmol.symmetry.SpaceGroup ("139;d4h^17;i 4/m m m;-i 4 2"),  new org.jmol.symmetry.SpaceGroup ("140;d4h^18;i 4/m c m;-i 4 2c"),  new org.jmol.symmetry.SpaceGroup ("141:1;d4h^19;i 41/a m d:1;i 4bw 2bw -1bw"),  new org.jmol.symmetry.SpaceGroup ("141:2;d4h^19;i 41/a m d:2;-i 4bd 2"),  new org.jmol.symmetry.SpaceGroup ("142:1;d4h^20;i 41/a c d:1;i 4bw 2aw -1bw"),  new org.jmol.symmetry.SpaceGroup ("142:2;d4h^20;i 41/a c d:2;-i 4bd 2c"),  new org.jmol.symmetry.SpaceGroup ("143;c3^1;p 3;p 3"),  new org.jmol.symmetry.SpaceGroup ("144;c3^2;p 31;p 31"),  new org.jmol.symmetry.SpaceGroup ("145;c3^3;p 32;p 32"),  new org.jmol.symmetry.SpaceGroup ("146:h;c3^4;r 3:h;r 3"),  new org.jmol.symmetry.SpaceGroup ("146:r;c3^4;r 3:r;p 3*"),  new org.jmol.symmetry.SpaceGroup ("147;c3i^1;p -3;-p 3"),  new org.jmol.symmetry.SpaceGroup ("148:h;c3i^2;r -3:h;-r 3"),  new org.jmol.symmetry.SpaceGroup ("148:r;c3i^2;r -3:r;-p 3*"),  new org.jmol.symmetry.SpaceGroup ("149;d3^1;p 3 1 2;p 3 2"),  new org.jmol.symmetry.SpaceGroup ("150;d3^2;p 3 2 1;p 3 2\""),  new org.jmol.symmetry.SpaceGroup ("151;d3^3;p 31 1 2;p 31 2 (0 0 4)"),  new org.jmol.symmetry.SpaceGroup ("152;d3^4;p 31 2 1;p 31 2\""),  new org.jmol.symmetry.SpaceGroup ("153;d3^5;p 32 1 2;p 32 2 (0 0 2)"),  new org.jmol.symmetry.SpaceGroup ("154;d3^6;p 32 2 1;p 32 2\""),  new org.jmol.symmetry.SpaceGroup ("155:h;d3^7;r 3 2:h;r 3 2\""),  new org.jmol.symmetry.SpaceGroup ("155:r;d3^7;r 3 2:r;p 3* 2"),  new org.jmol.symmetry.SpaceGroup ("156;c3v^1;p 3 m 1;p 3 -2\""),  new org.jmol.symmetry.SpaceGroup ("157;c3v^2;p 3 1 m;p 3 -2"),  new org.jmol.symmetry.SpaceGroup ("158;c3v^3;p 3 c 1;p 3 -2\"c"),  new org.jmol.symmetry.SpaceGroup ("159;c3v^4;p 3 1 c;p 3 -2c"),  new org.jmol.symmetry.SpaceGroup ("160:h;c3v^5;r 3 m:h;r 3 -2\""),  new org.jmol.symmetry.SpaceGroup ("160:r;c3v^5;r 3 m:r;p 3* -2"),  new org.jmol.symmetry.SpaceGroup ("161:h;c3v^6;r 3 c:h;r 3 -2\"c"),  new org.jmol.symmetry.SpaceGroup ("161:r;c3v^6;r 3 c:r;p 3* -2n"),  new org.jmol.symmetry.SpaceGroup ("162;d3d^1;p -3 1 m;-p 3 2"),  new org.jmol.symmetry.SpaceGroup ("163;d3d^2;p -3 1 c;-p 3 2c"),  new org.jmol.symmetry.SpaceGroup ("164;d3d^3;p -3 m 1;-p 3 2\""),  new org.jmol.symmetry.SpaceGroup ("165;d3d^4;p -3 c 1;-p 3 2\"c"),  new org.jmol.symmetry.SpaceGroup ("166:h;d3d^5;r -3 m:h;-r 3 2\""),  new org.jmol.symmetry.SpaceGroup ("166:r;d3d^5;r -3 m:r;-p 3* 2"),  new org.jmol.symmetry.SpaceGroup ("167:h;d3d^6;r -3 c:h;-r 3 2\"c"),  new org.jmol.symmetry.SpaceGroup ("167:r;d3d^6;r -3 c:r;-p 3* 2n"),  new org.jmol.symmetry.SpaceGroup ("168;c6^1;p 6;p 6"),  new org.jmol.symmetry.SpaceGroup ("169;c6^2;p 61;p 61"),  new org.jmol.symmetry.SpaceGroup ("170;c6^3;p 65;p 65"),  new org.jmol.symmetry.SpaceGroup ("171;c6^4;p 62;p 62"),  new org.jmol.symmetry.SpaceGroup ("172;c6^5;p 64;p 64"),  new org.jmol.symmetry.SpaceGroup ("173;c6^6;p 63;p 6c"),  new org.jmol.symmetry.SpaceGroup ("173*;c6^6;p 63*;p 63 "),  new org.jmol.symmetry.SpaceGroup ("174;c3h^1;p -6;p -6"),  new org.jmol.symmetry.SpaceGroup ("175;c6h^1;p 6/m;-p 6"),  new org.jmol.symmetry.SpaceGroup ("176;c6h^2;p 63/m;-p 6c"),  new org.jmol.symmetry.SpaceGroup ("176*;c6h^2;p 63/m*;-p 63"),  new org.jmol.symmetry.SpaceGroup ("177;d6^1;p 6 2 2;p 6 2"),  new org.jmol.symmetry.SpaceGroup ("178;d6^2;p 61 2 2;p 61 2 (0 0 5)"),  new org.jmol.symmetry.SpaceGroup ("179;d6^3;p 65 2 2;p 65 2 (0 0 1)"),  new org.jmol.symmetry.SpaceGroup ("180;d6^4;p 62 2 2;p 62 2 (0 0 4)"),  new org.jmol.symmetry.SpaceGroup ("181;d6^5;p 64 2 2;p 64 2 (0 0 2)"),  new org.jmol.symmetry.SpaceGroup ("182;d6^6;p 63 2 2;p 6c 2c"),  new org.jmol.symmetry.SpaceGroup ("182*;d6^6;p 63 2 2*;p 63 2c"),  new org.jmol.symmetry.SpaceGroup ("183;c6v^1;p 6 m m;p 6 -2"),  new org.jmol.symmetry.SpaceGroup ("184;c6v^2;p 6 c c;p 6 -2c"),  new org.jmol.symmetry.SpaceGroup ("185;c6v^3;p 63 c m;p 6c -2"),  new org.jmol.symmetry.SpaceGroup ("185*;c6v^3;p 63 c m*;p 63 -2"),  new org.jmol.symmetry.SpaceGroup ("186;c6v^4;p 63 m c;p 6c -2c"),  new org.jmol.symmetry.SpaceGroup ("186*;c6v^4;p 63 m c*;p 63 -2c"),  new org.jmol.symmetry.SpaceGroup ("187;d3h^1;p -6 m 2;p -6 2"),  new org.jmol.symmetry.SpaceGroup ("188;d3h^2;p -6 c 2;p -6c 2"),  new org.jmol.symmetry.SpaceGroup ("189;d3h^3;p -6 2 m;p -6 -2"),  new org.jmol.symmetry.SpaceGroup ("190;d3h^4;p -6 2 c;p -6c -2c"),  new org.jmol.symmetry.SpaceGroup ("191;d6h^1;p 6/m m m;-p 6 2"),  new org.jmol.symmetry.SpaceGroup ("192;d6h^2;p 6/m c c;-p 6 2c"),  new org.jmol.symmetry.SpaceGroup ("193;d6h^3;p 63/m c m;-p 6c 2"),  new org.jmol.symmetry.SpaceGroup ("193*;d6h^3;p 63/m c m*;-p 63 2"),  new org.jmol.symmetry.SpaceGroup ("194;d6h^4;p 63/m m c;-p 6c 2c"),  new org.jmol.symmetry.SpaceGroup ("194*;d6h^4;p 63/m m c*;-p 63 2c"),  new org.jmol.symmetry.SpaceGroup ("195;t^1;p 2 3;p 2 2 3"),  new org.jmol.symmetry.SpaceGroup ("196;t^2;f 2 3;f 2 2 3"),  new org.jmol.symmetry.SpaceGroup ("197;t^3;i 2 3;i 2 2 3"),  new org.jmol.symmetry.SpaceGroup ("198;t^4;p 21 3;p 2ac 2ab 3"),  new org.jmol.symmetry.SpaceGroup ("199;t^5;i 21 3;i 2b 2c 3"),  new org.jmol.symmetry.SpaceGroup ("200;th^1;p m -3;-p 2 2 3"),  new org.jmol.symmetry.SpaceGroup ("201:1;th^2;p n -3:1;p 2 2 3 -1n"),  new org.jmol.symmetry.SpaceGroup ("201:2;th^2;p n -3:2;-p 2ab 2bc 3"),  new org.jmol.symmetry.SpaceGroup ("202;th^3;f m -3;-f 2 2 3"),  new org.jmol.symmetry.SpaceGroup ("203:1;th^4;f d -3:1;f 2 2 3 -1d"),  new org.jmol.symmetry.SpaceGroup ("203:2;th^4;f d -3:2;-f 2uv 2vw 3"),  new org.jmol.symmetry.SpaceGroup ("204;th^5;i m -3;-i 2 2 3"),  new org.jmol.symmetry.SpaceGroup ("205;th^6;p a -3;-p 2ac 2ab 3"),  new org.jmol.symmetry.SpaceGroup ("206;th^7;i a -3;-i 2b 2c 3"),  new org.jmol.symmetry.SpaceGroup ("207;o^1;p 4 3 2;p 4 2 3"),  new org.jmol.symmetry.SpaceGroup ("208;o^2;p 42 3 2;p 4n 2 3"),  new org.jmol.symmetry.SpaceGroup ("209;o^3;f 4 3 2;f 4 2 3"),  new org.jmol.symmetry.SpaceGroup ("210;o^4;f 41 3 2;f 4d 2 3"),  new org.jmol.symmetry.SpaceGroup ("211;o^5;i 4 3 2;i 4 2 3"),  new org.jmol.symmetry.SpaceGroup ("212;o^6;p 43 3 2;p 4acd 2ab 3"),  new org.jmol.symmetry.SpaceGroup ("213;o^7;p 41 3 2;p 4bd 2ab 3"),  new org.jmol.symmetry.SpaceGroup ("214;o^8;i 41 3 2;i 4bd 2c 3"),  new org.jmol.symmetry.SpaceGroup ("215;td^1;p -4 3 m;p -4 2 3"),  new org.jmol.symmetry.SpaceGroup ("216;td^2;f -4 3 m;f -4 2 3"),  new org.jmol.symmetry.SpaceGroup ("217;td^3;i -4 3 m;i -4 2 3"),  new org.jmol.symmetry.SpaceGroup ("218;td^4;p -4 3 n;p -4n 2 3"),  new org.jmol.symmetry.SpaceGroup ("219;td^5;f -4 3 c;f -4a 2 3"),  new org.jmol.symmetry.SpaceGroup ("220;td^6;i -4 3 d;i -4bd 2c 3"),  new org.jmol.symmetry.SpaceGroup ("221;oh^1;p m -3 m;-p 4 2 3"),  new org.jmol.symmetry.SpaceGroup ("222:1;oh^2;p n -3 n:1;p 4 2 3 -1n"),  new org.jmol.symmetry.SpaceGroup ("222:2;oh^2;p n -3 n:2;-p 4a 2bc 3"),  new org.jmol.symmetry.SpaceGroup ("223;oh^3;p m -3 n;-p 4n 2 3"),  new org.jmol.symmetry.SpaceGroup ("224:1;oh^4;p n -3 m:1;p 4n 2 3 -1n"),  new org.jmol.symmetry.SpaceGroup ("224:2;oh^4;p n -3 m:2;-p 4bc 2bc 3"),  new org.jmol.symmetry.SpaceGroup ("225;oh^5;f m -3 m;-f 4 2 3"),  new org.jmol.symmetry.SpaceGroup ("226;oh^6;f m -3 c;-f 4a 2 3"),  new org.jmol.symmetry.SpaceGroup ("227:1;oh^7;f d -3 m:1;f 4d 2 3 -1d"),  new org.jmol.symmetry.SpaceGroup ("227:2;oh^7;f d -3 m:2;-f 4vw 2vw 3"),  new org.jmol.symmetry.SpaceGroup ("228:1;oh^8;f d -3 c:1;f 4d 2 3 -1ad"),  new org.jmol.symmetry.SpaceGroup ("228:2;oh^8;f d -3 c:2;-f 4ud 2vw 3"),  new org.jmol.symmetry.SpaceGroup ("229;oh^9;i m -3 m;-i 4 2 3"),  new org.jmol.symmetry.SpaceGroup ("230;oh^10;i a -3 d;-i 4bd 2c 3")];
});
