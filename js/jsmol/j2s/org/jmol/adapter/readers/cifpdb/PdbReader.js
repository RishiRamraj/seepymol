﻿Clazz.declarePackage ("org.jmol.adapter.readers.cifpdb");
Clazz.load (["org.jmol.adapter.smarter.AtomSetCollectionReader", "java.util.Hashtable"], "org.jmol.adapter.readers.cifpdb.PdbReader", ["java.lang.Boolean", "$.Float", "java.util.ArrayList", "org.jmol.adapter.smarter.Atom", "$.Structure", "org.jmol.api.Interface", "$.JmolAdapter", "org.jmol.constant.EnumStructure", "org.jmol.util.Escape", "$.Logger", "$.Matrix4f", "$.Point3f", "$.StringXBuilder", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.lineLength = 0;
this.pdbHeader = null;
this.applySymmetry = false;
this.getTlsGroups = false;
this.isMultiModel = false;
this.haveMappedSerials = false;
this.isConnectStateBug = false;
this.isLegacyModelType = false;
this.gromacsWideFormat = false;
this.isPQR = false;
this.htFormul = null;
this.htHetero = null;
this.htSites = null;
this.htElementsInCurrentGroup = null;
this.htMolIds = null;
this.vCompnds = null;
this.vBiomts = null;
this.vBiomolecules = null;
this.vTlsModels = null;
this.sbTlsErrors = null;
this.chainAtomCounts = null;
this.sbIgnored = null;
this.sbSelected = null;
this.sbConect = null;
this.sb = null;
this.atomCount = 0;
this.maxSerial = 0;
this.nUNK = 0;
this.nRes = 0;
this.currentCompnd = null;
this.currentGroup3 = null;
this.currentKey = null;
this.currentResno = -2147483648;
this.configurationPtr = -2147483648;
this.resetKey = true;
this.$compnd = null;
this.conformationIndex = 0;
this.fileAtomIndex = 0;
this.lastAltLoc = '\0';
this.lastAtomData = null;
this.lastAtomIndex = 0;
this.lastGroup = -2147483648;
this.lastInsertion = '\0';
this.lastSourceSerial = -2147483648;
this.lastTargetSerial = -2147483648;
this.tlsGroupID = 0;
this.haveDoubleBonds = false;
this.dataT = null;
this.tlsU = null;
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.cifpdb, "PdbReader", org.jmol.adapter.smarter.AtomSetCollectionReader);
Clazz.prepareFields (c$, function () {
this.htFormul =  new java.util.Hashtable ();
this.dataT =  Clazz.newFloatArray (8, 0);
});
Clazz.overrideMethod (c$, "initializeReader", 
function () {
this.setIsPDB ();
this.pdbHeader = (this.getHeader ?  new org.jmol.util.StringXBuilder () : null);
this.applySymmetry = !this.checkFilterKey ("NOSYMMETRY");
this.getTlsGroups = this.checkFilterKey ("TLS");
if (this.htParams.containsKey ("vTlsModels")) {
this.vTlsModels = this.htParams.remove ("vTlsModels");
}if (this.checkFilterKey ("CONF ")) {
this.configurationPtr = this.parseIntAt (this.filter, this.filter.indexOf ("CONF ") + 5);
this.sbIgnored =  new org.jmol.util.StringXBuilder ();
this.sbSelected =  new org.jmol.util.StringXBuilder ();
}this.isLegacyModelType = (this.stateScriptVersionInt < 120000);
this.isConnectStateBug = (this.stateScriptVersionInt >= 120151 && this.stateScriptVersionInt <= 120220 || this.stateScriptVersionInt >= 120300 && this.stateScriptVersionInt <= 120320);
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
var ptOption = ((this.lineLength = this.line.length) < 6 ? -1 : "ATOM    HETATM  MODEL   CONECT  HELIX   SHEET   TURN    HET     HETNAM  ANISOU  SITE    CRYST1  SCALE1  SCALE2  SCALE3  EXPDTA  FORMUL  REMARK  HEADER  COMPND  SOURCE  TITLE   ".indexOf (this.line.substring (0, 6))) >> 3;
var isAtom = (ptOption == 0 || ptOption == 1);
var isModel = (ptOption == 2);
var serial = (isAtom ? this.parseIntRange (this.line, 6, 11) : 0);
var isNewModel = ((this.isTrajectory || this.isSequential) && !this.isMultiModel && isAtom && serial == 1);
if (this.getHeader) {
if (isAtom || isModel) this.getHeader = false;
 else this.pdbHeader.append (this.line).appendC ('\n');
}if (isModel || isNewModel) {
this.isMultiModel = isModel;
this.getHeader = false;
var modelNo = (isNewModel ? this.modelNumber + 1 : this.getModelNumber ());
this.modelNumber = (this.bsModels == null ? modelNo : this.modelNumber + 1);
if (!this.doGetModel (this.modelNumber, null)) {
this.handleTlsMissingModels ();
return this.checkLastModel ();
}this.atomSetCollection.connectAll (this.maxSerial, this.isConnectStateBug);
if (this.atomCount > 0) this.applySymmetryAndSetTrajectory ();
this.model (modelNo);
if (this.isLegacyModelType || !isAtom) return true;
}if (this.isMultiModel && !this.doProcessLines) return true;
if (isAtom) {
this.getHeader = false;
this.atom (serial);
return true;
}switch (ptOption) {
case 3:
this.conect ();
return true;
case 4:
case 5:
case 6:
this.structure ();
return true;
case 7:
this.het ();
return true;
case 8:
this.hetnam ();
return true;
case 9:
this.anisou ();
return true;
case 10:
this.site ();
return true;
case 11:
this.cryst1 ();
return true;
case 12:
case 13:
case 14:
this.scale (ptOption - 11);
return true;
case 15:
this.expdta ();
return true;
case 16:
this.formul ();
return true;
case 17:
if (this.line.contains ("The B-factors in this file hold atomic radii")) {
this.isPQR = true;
return true;
}if (this.line.contains ("This file does not adhere to the PDB standard")) {
this.gromacsWideFormat = true;
return true;
}if (this.line.startsWith ("REMARK 350")) {
this.remark350 ();
return false;
}if (this.line.startsWith ("REMARK 290")) {
this.remark290 ();
return false;
}if (this.getTlsGroups) {
if (this.line.indexOf ("TLS DETAILS") > 0) return this.remarkTls ();
}this.checkCurrentLineForScript ();
return true;
case 18:
this.header ();
return true;
case 19:
case 20:
this.compnd (ptOption == 20);
return true;
case 21:
this.title ();
return true;
}
return true;
});
Clazz.defineMethod (c$, "finalizeReader", 
function () {
this.checkNotPDB ();
this.atomSetCollection.connectAll (this.maxSerial, this.isConnectStateBug);
if (this.vBiomolecules != null && this.vBiomolecules.size () > 0 && this.atomSetCollection.getAtomCount () > 0) {
this.atomSetCollection.setAtomSetAuxiliaryInfo ("biomolecules", this.vBiomolecules);
this.setBiomoleculeAtomCounts ();
if (this.vBiomts != null && this.applySymmetry) {
this.atomSetCollection.applySymmetry (this.vBiomts, this.notionalUnitCell, this.applySymmetryToBonds, this.filter);
this.vTlsModels = null;
}}if (this.vTlsModels != null) {
var symmetry = org.jmol.api.Interface.getOptionInterface ("symmetry.Symmetry");
var n = this.atomSetCollection.getAtomSetCount ();
if (n == this.vTlsModels.size ()) {
for (var i = n; --i >= 0; ) this.setTlsGroups (i, i, symmetry);

} else {
org.jmol.util.Logger.info (n + " models but " + this.vTlsModels.size () + " TLS descriptions");
if (this.vTlsModels.size () == 1) {
org.jmol.util.Logger.info (" -- assuming all models have the same TLS description -- check REMARK 3 for details.");
for (var i = n; --i >= 0; ) this.setTlsGroups (0, i, symmetry);

}}this.checkForResidualBFactors (symmetry);
}if (this.sbTlsErrors != null) {
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("tlsErrors", this.sbTlsErrors.toString ());
this.appendLoadNote (this.sbTlsErrors.toString ());
}Clazz.superCall (this, org.jmol.adapter.readers.cifpdb.PdbReader, "finalizeReader", []);
if (this.vCompnds != null) this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("compoundSource", this.vCompnds);
if (this.htSites != null) {
this.addSites (this.htSites);
}if (this.pdbHeader != null) this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("fileHeader", this.pdbHeader.toString ());
if (this.configurationPtr > 0) {
org.jmol.util.Logger.info (this.sbSelected.toString ());
org.jmol.util.Logger.info (this.sbIgnored.toString ());
}});
Clazz.defineMethod (c$, "checkForResidualBFactors", 
($fz = function (symmetry) {
var atoms = this.atomSetCollection.getAtoms ();
var isResidual = false;
for (var i = this.atomSetCollection.getAtomCount (); --i >= 0; ) {
var anisou = this.tlsU.get (atoms[i]);
if (anisou == null) continue;
var resid = anisou[7] - (anisou[0] + anisou[1] + anisou[2]) / 3;
if (resid < 0 || Float.isNaN (resid)) {
isResidual = true;
break;
}}
org.jmol.util.Logger.info ("TLS analysis suggests Bfactors are " + (isResidual ? "" : "NOT") + " residuals");
for (var entry, $entry = this.tlsU.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var anisou = entry.getValue ();
var resid = anisou[7];
if (resid == 0) continue;
if (!isResidual) resid -= (anisou[0] + anisou[1] + anisou[2]) / 3;
anisou[0] += resid;
anisou[1] += resid;
anisou[2] += resid;
entry.getKey ().ellipsoid[1] = symmetry.getEllipsoid (anisou);
System.out.println ("TLS-U:  " + org.jmol.util.Escape.escape (anisou));
anisou = (entry.getKey ().anisoBorU);
if (anisou != null) System.out.println ("ANISOU: " + org.jmol.util.Escape.escape (anisou));
}
this.tlsU = null;
}, $fz.isPrivate = true, $fz), "org.jmol.api.SymmetryInterface");
Clazz.defineMethod (c$, "header", 
($fz = function () {
if (this.lineLength < 8) return;
this.appendLoadNote (this.line.substring (7).trim ());
if (this.lineLength >= 66) this.atomSetCollection.setCollectionName (this.line.substring (62, 66));
if (this.lineLength > 50) this.line = this.line.substring (0, 50);
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("CLASSIFICATION", this.line.substring (7).trim ());
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "title", 
($fz = function () {
if (this.lineLength < 10) return;
this.appendLoadNote (this.line.substring (10).trim ());
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "compnd", 
($fz = function (isSource) {
if (!isSource) {
if (this.$compnd == null) this.$compnd = "";
 else this.$compnd += " ";
var s = this.line;
if (this.lineLength > 62) s = s.substring (0, 62);
this.$compnd += s.substring (10).trim ();
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("COMPND", this.$compnd);
}if (this.vCompnds == null) {
if (isSource) return;
this.vCompnds =  new java.util.ArrayList ();
this.htMolIds =  new java.util.Hashtable ();
this.currentCompnd =  new java.util.Hashtable ();
this.currentCompnd.put ("select", "(*)");
this.currentKey = "MOLECULE";
this.htMolIds.put ("", this.currentCompnd);
}if (isSource && this.resetKey) {
this.resetKey = false;
this.currentKey = "SOURCE";
this.currentCompnd = this.htMolIds.get ("");
}this.line = this.line.substring (10, Math.min (this.lineLength, 72)).trim ();
var pt = this.line.indexOf (":");
if (pt < 0 || pt > 0 && this.line.charAt (pt - 1) == '\\') pt = this.line.length;
var key = this.line.substring (0, pt).trim ();
var value = (pt < this.line.length ? this.line.substring (pt + 1) : null);
if (key.equals ("MOL_ID")) {
if (value == null) return;
if (isSource) {
this.currentCompnd = this.htMolIds.remove (value);
return;
}this.currentCompnd =  new java.util.Hashtable ();
this.vCompnds.add (this.currentCompnd);
this.htMolIds.put (value, this.currentCompnd);
}if (this.currentCompnd == null) return;
if (value == null) {
value = this.currentCompnd.get (this.currentKey);
if (value == null) value = "";
value += key;
if (this.vCompnds.size () == 0) this.vCompnds.add (this.currentCompnd);
} else {
this.currentKey = key;
}if (value.endsWith (";")) value = value.substring (0, value.length - 1);
this.currentCompnd.put (this.currentKey, value);
if (this.currentKey.equals ("CHAIN")) this.currentCompnd.put ("select", "(:" + org.jmol.util.TextFormat.simpleReplace (org.jmol.util.TextFormat.simpleReplace (value, ", ", ",:"), " ", "") + ")");
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "setBiomoleculeAtomCounts", 
($fz = function () {
for (var i = this.vBiomolecules.size (); --i >= 0; ) {
var biomolecule = this.vBiomolecules.get (i);
var chain = biomolecule.get ("chains");
var nTransforms = (biomolecule.get ("biomts")).size ();
var nAtoms = 0;
for (var j = chain.length - 1; --j >= 0; ) if (chain.charAt (j) == ':') nAtoms += this.chainAtomCounts[chain.charCodeAt (j + 1)];

biomolecule.put ("atomCount", Integer.$valueOf (nAtoms * nTransforms));
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "remark350", 
($fz = function () {
var biomts = null;
this.vBiomolecules =  new java.util.ArrayList ();
this.chainAtomCounts =  Clazz.newIntArray (255, 0);
var title = "";
var chainlist = "";
var iMolecule = 0;
var needLine = true;
var info = null;
var nBiomt = 0;
var mIdent =  new org.jmol.util.Matrix4f ();
mIdent.setIdentity ();
while (true) {
if (needLine) this.readLine ();
 else needLine = true;
if (this.line == null || !this.line.startsWith ("REMARK 350")) break;
try {
if (this.line.startsWith ("REMARK 350 BIOMOLECULE:")) {
if (nBiomt > 0) org.jmol.util.Logger.info ("biomolecule " + iMolecule + ": number of transforms: " + nBiomt);
info =  new java.util.Hashtable ();
biomts =  new java.util.ArrayList ();
iMolecule = this.parseIntStr (this.line.substring (this.line.indexOf (":") + 1));
title = this.line.trim ();
info.put ("molecule", Integer.$valueOf (iMolecule));
info.put ("title", title);
info.put ("chains", "");
info.put ("biomts", biomts);
this.vBiomolecules.add (info);
nBiomt = 0;
}if (this.line.indexOf ("APPLY THE FOLLOWING TO CHAINS:") >= 0) {
if (info == null) {
needLine = false;
this.line = "REMARK 350 BIOMOLECULE: 1  APPLY THE FOLLOWING TO CHAINS:";
continue;
}chainlist = ":" + this.line.substring (41).trim ().$replace (' ', ':');
needLine = false;
while (this.readLine () != null && this.line.indexOf ("BIOMT") < 0 && this.line.indexOf ("350") == 7) chainlist += ":" + this.line.substring (11).trim ().$replace (' ', ':');

if (this.checkFilterKey ("BIOMOLECULE " + iMolecule + ";")) {
this.setFilter (this.filter.$replace (':', '_') + chainlist);
org.jmol.util.Logger.info ("filter set to \"" + this.filter + "\"");
this.vBiomts = biomts;
}info.put ("chains", chainlist);
continue;
}if (this.line.startsWith ("REMARK 350   BIOMT1 ")) {
nBiomt++;
var mat =  Clazz.newFloatArray (16, 0);
for (var i = 0; i < 12; ) {
var tokens = this.getTokens ();
mat[i++] = this.parseFloatStr (tokens[4]);
mat[i++] = this.parseFloatStr (tokens[5]);
mat[i++] = this.parseFloatStr (tokens[6]);
mat[i++] = this.parseFloatStr (tokens[7]);
if (i == 4 || i == 8) this.readLine ();
}
mat[15] = 1;
var m4 =  new org.jmol.util.Matrix4f ();
m4.setA (mat);
if (m4.equals (mIdent)) biomts.add (0, m4);
 else biomts.add (m4);
continue;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.vBiomts = null;
this.vBiomolecules = null;
return;
} else {
throw e;
}
}
}
if (nBiomt > 0) org.jmol.util.Logger.info ("biomolecule " + iMolecule + ": number of transforms: " + nBiomt);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "remark290", 
($fz = function () {
while (this.readLine () != null && this.line.startsWith ("REMARK 290")) {
if (this.line.indexOf ("NNNMMM   OPERATOR") >= 0) {
while (this.readLine () != null) {
var tokens = this.getTokens ();
if (tokens.length < 4) break;
this.setSymmetryOperator (tokens[3]);
}
}}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "atom", 
($fz = function (serial) {
var atom =  new org.jmol.adapter.smarter.Atom ();
atom.atomName = this.line.substring (12, 16).trim ();
var ch = this.line.charAt (16);
if (ch != ' ') atom.alternateLocationID = ch;
atom.group3 = this.parseTokenRange (this.line, 17, 20);
ch = this.line.charAt (21);
if (this.chainAtomCounts != null) this.chainAtomCounts[ch.charCodeAt (0)]++;
atom.chainID = ch;
atom.sequenceNumber = this.parseIntRange (this.line, 22, 26);
atom.insertionCode = org.jmol.api.JmolAdapter.canonizeInsertionCode (this.line.charAt (26));
atom.isHetero = this.line.startsWith ("HETATM");
atom.elementSymbol = this.deduceElementSymbol (atom.isHetero);
if (!this.filterPDBAtom (atom, this.fileAtomIndex++)) return;
atom.atomSerial = serial;
if (serial > this.maxSerial) this.maxSerial = serial;
if (atom.group3 == null) {
if (this.currentGroup3 != null) {
this.currentGroup3 = null;
this.currentResno = -2147483648;
this.htElementsInCurrentGroup = null;
}} else if (!atom.group3.equals (this.currentGroup3) || atom.sequenceNumber != this.currentResno) {
this.currentGroup3 = atom.group3;
this.currentResno = atom.sequenceNumber;
this.htElementsInCurrentGroup = this.htFormul.get (atom.group3);
this.nRes++;
if (atom.group3.equals ("UNK")) this.nUNK++;
}if (this.gromacsWideFormat) {
this.setAtomCoordXYZ (atom, this.parseFloatRange (this.line, 30, 40), this.parseFloatRange (this.line, 40, 50), this.parseFloatRange (this.line, 50, 60));
} else {
var charge = 0;
if (this.lineLength >= 80) {
var chMagnitude = this.line.charAt (78);
var chSign = this.line.charAt (79);
if (chSign >= '0' && chSign <= '7') {
var chT = chSign;
chSign = chMagnitude;
chMagnitude = chT;
}if ((chSign == '+' || chSign == '-' || chSign == ' ') && chMagnitude >= '0' && chMagnitude <= '7') {
charge = chMagnitude.charCodeAt (0) - 48;
if (chSign == '-') charge = -charge;
}}atom.formalCharge = charge;
this.setAtomCoordXYZ (atom, this.parseFloatRange (this.line, 30, 38), this.parseFloatRange (this.line, 38, 46), this.parseFloatRange (this.line, 46, 54));
}this.setAdditionalAtomParameters (atom);
if (this.haveMappedSerials) this.atomSetCollection.addAtomWithMappedSerialNumber (atom);
 else this.atomSetCollection.addAtom (atom);
if (this.atomCount++ == 0) this.atomSetCollection.setAtomSetAuxiliaryInfo ("isPDB", Boolean.TRUE);
if (atom.isHetero) {
if (this.htHetero != null) {
this.atomSetCollection.setAtomSetAuxiliaryInfo ("hetNames", this.htHetero);
this.htHetero = null;
}}}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "filterPDBAtom", 
function (atom, iAtom) {
if (!this.filterAtom (atom, iAtom)) return false;
if (this.configurationPtr > 0) {
if (atom.sequenceNumber != this.lastGroup || atom.insertionCode != this.lastInsertion) {
this.conformationIndex = this.configurationPtr - 1;
this.lastGroup = atom.sequenceNumber;
this.lastInsertion = atom.insertionCode;
this.lastAltLoc = '\0';
}if (atom.alternateLocationID != '\0') {
var msg = " atom [" + atom.group3 + "]" + atom.sequenceNumber + (atom.insertionCode == '\0' ? "" : "^" + atom.insertionCode) + (atom.chainID == '\0' ? "" : ":" + atom.chainID) + "." + atom.atomName + "%" + atom.alternateLocationID + "\n";
if (this.conformationIndex >= 0 && atom.alternateLocationID != this.lastAltLoc) {
this.lastAltLoc = atom.alternateLocationID;
this.conformationIndex--;
}if (this.conformationIndex < 0 && atom.alternateLocationID != this.lastAltLoc) {
this.sbIgnored.append ("ignoring").append (msg);
return false;
}this.sbSelected.append ("loading").append (msg);
}}return true;
}, "org.jmol.adapter.smarter.Atom,~N");
Clazz.defineMethod (c$, "setAdditionalAtomParameters", 
function (atom) {
if (this.isPQR) {
if (this.gromacsWideFormat) {
atom.partialCharge = this.parseFloatStr (this.line.substring (60, 68));
atom.radius = org.jmol.adapter.readers.cifpdb.PdbReader.fixRadius (this.parseFloatStr (this.line.substring (68, 76)));
} else {
var tokens = this.getTokens ();
var pt = tokens.length - 2 - (this.line.length > 75 ? 1 : 0);
atom.partialCharge = this.parseFloatStr (tokens[pt++]);
atom.radius = org.jmol.adapter.readers.cifpdb.PdbReader.fixRadius (this.parseFloatStr (tokens[pt]));
}return;
}var floatOccupancy;
if (this.gromacsWideFormat) {
floatOccupancy = this.parseFloatStr (this.line.substring (60, 68));
atom.bfactor = org.jmol.adapter.readers.cifpdb.PdbReader.fixRadius (this.parseFloatStr (this.line.substring (68, 76)));
} else {
floatOccupancy = this.parseFloatRange (this.line, 54, 60);
atom.bfactor = this.parseFloatRange (this.line, 60, 66);
}atom.occupancy = (Float.isNaN (floatOccupancy) ? 100 : Clazz.floatToInt (floatOccupancy * 100));
}, "org.jmol.adapter.smarter.Atom");
Clazz.defineMethod (c$, "deduceElementSymbol", 
function (isHetero) {
if (this.lineLength >= 78) {
var ch76 = this.line.charAt (76);
var ch77 = this.line.charAt (77);
if (ch76 == ' ' && org.jmol.adapter.smarter.Atom.isValidElementSymbol (ch77)) return "" + ch77;
if (org.jmol.adapter.smarter.Atom.isValidElementSymbolNoCaseSecondChar2 (ch76, ch77)) return "" + ch76 + ch77;
}var ch12 = this.line.charAt (12);
var ch13 = this.line.charAt (13);
if ((this.htElementsInCurrentGroup == null || this.htElementsInCurrentGroup.get (this.line.substring (12, 14)) != null) && org.jmol.adapter.smarter.Atom.isValidElementSymbolNoCaseSecondChar2 (ch12, ch13)) return (isHetero || ch12 != 'H' ? "" + ch12 + ch13 : "H");
if (ch12 == 'H') return "H";
if ((this.htElementsInCurrentGroup == null || this.htElementsInCurrentGroup.get ("" + ch13) != null) && org.jmol.adapter.smarter.Atom.isValidElementSymbol (ch13)) return "" + ch13;
if (ch12 != ' ' && (this.htElementsInCurrentGroup == null || this.htElementsInCurrentGroup.get ("" + ch12) != null) && org.jmol.adapter.smarter.Atom.isValidElementSymbol (ch12)) return "" + ch12;
var ch14 = this.line.charAt (14);
if (ch12 == ' ' && ch13 != 'X' && (this.htElementsInCurrentGroup == null || this.htElementsInCurrentGroup.get (this.line.substring (13, 15)) != null) && org.jmol.adapter.smarter.Atom.isValidElementSymbolNoCaseSecondChar2 (ch13, ch14)) return "" + ch13 + ch14;
return "Xx";
}, "~B");
Clazz.defineMethod (c$, "conect", 
($fz = function () {
if (this.sbConect == null) {
this.sbConect =  new org.jmol.util.StringXBuilder ();
this.sb =  new org.jmol.util.StringXBuilder ();
} else {
this.sb.setLength (0);
}var sourceSerial = -1;
sourceSerial = this.parseIntRange (this.line, 6, 11);
if (sourceSerial < 0) return;
for (var i = 0; i < 9; i += (i == 5 ? 2 : 1)) {
var offset = i * 5 + 11;
var offsetEnd = offset + 5;
var targetSerial = (offsetEnd <= this.lineLength ? this.parseIntRange (this.line, offset, offsetEnd) : -1);
if (targetSerial < 0) continue;
var isDoubleBond = (sourceSerial == this.lastSourceSerial && targetSerial == this.lastTargetSerial);
if (isDoubleBond) this.haveDoubleBonds = true;
this.lastSourceSerial = sourceSerial;
this.lastTargetSerial = targetSerial;
var isSwapped = (targetSerial < sourceSerial);
var i1;
if (isSwapped) {
i1 = targetSerial;
targetSerial = sourceSerial;
} else {
i1 = sourceSerial;
}var st = ";" + i1 + " " + targetSerial + ";";
if (this.sbConect.indexOf (st) >= 0 && !isDoubleBond) continue;
if (this.haveDoubleBonds) {
var st1 = "--" + st;
if (this.sbConect.indexOf (st1) >= 0) continue;
this.sbConect.append (st);
this.sb.append (st1);
} else {
this.sbConect.append (st);
}this.atomSetCollection.addConnection ([i1, targetSerial, i < 4 ? 1 : 2048]);
}
this.sbConect.appendSB (this.sb);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "structure", 
($fz = function () {
var structureType = org.jmol.constant.EnumStructure.NONE;
var substructureType = org.jmol.constant.EnumStructure.NONE;
var startChainIDIndex;
var startIndex;
var endChainIDIndex;
var endIndex;
var strandCount = 0;
if (this.line.startsWith ("HELIX ")) {
structureType = org.jmol.constant.EnumStructure.HELIX;
startChainIDIndex = 19;
startIndex = 21;
endChainIDIndex = 31;
endIndex = 33;
if (this.line.length >= 40) substructureType = org.jmol.adapter.smarter.Structure.getHelixType (this.parseIntStr (this.line.substring (38, 40)));
} else if (this.line.startsWith ("SHEET ")) {
structureType = org.jmol.constant.EnumStructure.SHEET;
startChainIDIndex = 21;
startIndex = 22;
endChainIDIndex = 32;
endIndex = 33;
strandCount = this.parseIntStr (this.line.substring (14, 16));
} else if (this.line.startsWith ("TURN  ")) {
structureType = org.jmol.constant.EnumStructure.TURN;
startChainIDIndex = 19;
startIndex = 20;
endChainIDIndex = 30;
endIndex = 31;
} else return;
if (this.lineLength < endIndex + 4) return;
var structureID = this.line.substring (11, 15).trim ();
var serialID = this.parseIntStr (this.line.substring (7, 10));
var startChainID = this.line.charAt (startChainIDIndex);
var startSequenceNumber = this.parseIntRange (this.line, startIndex, startIndex + 4);
var startInsertionCode = this.line.charAt (startIndex + 4);
var endChainID = this.line.charAt (endChainIDIndex);
var endSequenceNumber = this.parseIntRange (this.line, endIndex, endIndex + 4);
var endInsertionCode = ' ';
if (this.lineLength > endIndex + 4) endInsertionCode = this.line.charAt (endIndex + 4);
if (substructureType === org.jmol.constant.EnumStructure.NONE) substructureType = structureType;
var structure =  new org.jmol.adapter.smarter.Structure (-1, structureType, substructureType, structureID, serialID, strandCount, startChainID, startSequenceNumber, startInsertionCode, endChainID, endSequenceNumber, endInsertionCode);
this.atomSetCollection.addStructure (structure);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getModelNumber", 
($fz = function () {
var startModelColumn = 6;
var endModelColumn = 14;
if (endModelColumn > this.lineLength) endModelColumn = this.lineLength;
var iModel = this.parseIntRange (this.line, startModelColumn, endModelColumn);
return (iModel == -2147483648 ? 0 : iModel);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "model", 
($fz = function (modelNumber) {
this.checkNotPDB ();
this.haveMappedSerials = false;
this.sbConect = null;
this.atomSetCollection.newAtomSet ();
this.atomSetCollection.setAtomSetAuxiliaryInfo ("isPDB", Boolean.TRUE);
this.atomSetCollection.setCurrentAtomSetNumber (modelNumber);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "checkNotPDB", 
($fz = function () {
var isPDB = (this.nRes == 0 || this.nUNK != this.nRes);
this.atomSetCollection.setCheckSpecial (!isPDB);
this.atomSetCollection.setAtomSetAuxiliaryInfo ("isPDB", isPDB ? Boolean.TRUE : Boolean.FALSE);
this.nUNK = this.nRes = 0;
this.currentGroup3 = null;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "cryst1", 
($fz = function () {
var a = this.getFloat (6, 9);
if (a == 1) a = NaN;
this.setUnitCell (a, this.getFloat (15, 9), this.getFloat (24, 9), this.getFloat (33, 7), this.getFloat (40, 7), this.getFloat (47, 7));
this.setSpaceGroupName (org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, 55, 66));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getFloat", 
($fz = function (ich, cch) {
return this.parseFloatRange (this.line, ich, ich + cch);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "scale", 
($fz = function (n) {
var pt = n * 4 + 2;
this.setUnitCellItem (pt++, this.getFloat (10, 10));
this.setUnitCellItem (pt++, this.getFloat (20, 10));
this.setUnitCellItem (pt++, this.getFloat (30, 10));
this.setUnitCellItem (pt++, this.getFloat (45, 10));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "expdta", 
($fz = function () {
if (this.line.toUpperCase ().indexOf ("NMR") >= 0) this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("isNMRdata", "true");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "formul", 
($fz = function () {
var groupName = this.parseTokenRange (this.line, 12, 15);
var formula = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, 19, 70);
var ichLeftParen = formula.indexOf ('(');
if (ichLeftParen >= 0) {
var ichRightParen = formula.indexOf (')');
if (ichRightParen < 0 || ichLeftParen >= ichRightParen || ichLeftParen + 1 == ichRightParen) return;
formula = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (formula, ichLeftParen + 1, ichRightParen);
}var htElementsInGroup = this.htFormul.get (groupName);
if (htElementsInGroup == null) this.htFormul.put (groupName, htElementsInGroup =  new java.util.Hashtable ());
this.next[0] = 0;
var elementWithCount;
while ((elementWithCount = this.parseTokenNext (formula)) != null) {
if (elementWithCount.length < 2) continue;
var chFirst = elementWithCount.charAt (0);
var chSecond = elementWithCount.charAt (1);
if (org.jmol.adapter.smarter.Atom.isValidElementSymbolNoCaseSecondChar2 (chFirst, chSecond)) htElementsInGroup.put ("" + chFirst + chSecond, Boolean.TRUE);
 else if (org.jmol.adapter.smarter.Atom.isValidElementSymbol (chFirst)) htElementsInGroup.put ("" + chFirst, Boolean.TRUE);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "het", 
($fz = function () {
if (this.line.length < 30) {
return;
}if (this.htHetero == null) {
this.htHetero =  new java.util.Hashtable ();
}var groupName = this.parseTokenRange (this.line, 7, 10);
if (this.htHetero.containsKey (groupName)) {
return;
}var hetName = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, 30, 70);
this.htHetero.put (groupName, hetName);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "hetnam", 
($fz = function () {
if (this.htHetero == null) {
this.htHetero =  new java.util.Hashtable ();
}var groupName = this.parseTokenRange (this.line, 11, 14);
var hetName = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, 15, 70);
if (groupName == null) {
org.jmol.util.Logger.error ("ERROR: HETNAM record does not contain a group name: " + this.line);
return;
}var htName = this.htHetero.get (groupName);
if (htName != null) {
hetName = htName + hetName;
}this.htHetero.put (groupName, hetName);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "anisou", 
($fz = function () {
var data =  Clazz.newFloatArray (8, 0);
data[6] = 1;
var serial = this.parseIntRange (this.line, 6, 11);
var index;
if (this.line.substring (6, 26).equals (this.lastAtomData)) {
index = this.lastAtomIndex;
} else {
if (!this.haveMappedSerials) this.atomSetCollection.createAtomSerialMap ();
index = this.atomSetCollection.getAtomIndexFromSerial (serial);
this.haveMappedSerials = true;
}if (index < 0) {
return;
}var atom = this.atomSetCollection.getAtom (index);
for (var i = 28, pt = 0; i < 70; i += 7, pt++) data[pt] = this.parseFloatRange (this.line, i, i + 7);

for (var i = 0; i < 6; i++) {
if (Float.isNaN (data[i])) {
org.jmol.util.Logger.error ("Bad ANISOU record: " + this.line);
return;
}data[i] /= 10000;
}
this.atomSetCollection.setAnisoBorU (atom, data, 12);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "site", 
($fz = function () {
if (this.htSites == null) {
this.htSites =  new java.util.Hashtable ();
}var nResidues = this.parseIntRange (this.line, 15, 17);
var siteID = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, 11, 14);
var htSite = this.htSites.get (siteID);
if (htSite == null) {
htSite =  new java.util.Hashtable ();
htSite.put ("nResidues", Integer.$valueOf (nResidues));
htSite.put ("groups", "");
this.htSites.put (siteID, htSite);
}var groups = htSite.get ("groups");
for (var i = 0; i < 4; i++) {
var pt = 18 + i * 11;
var resName = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, pt, pt + 3);
if (resName.length == 0) break;
var chainID = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, pt + 4, pt + 5);
var seq = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, pt + 5, pt + 9);
var iCode = org.jmol.adapter.smarter.AtomSetCollectionReader.parseTrimmedRange (this.line, pt + 9, pt + 10);
groups += (groups.length == 0 ? "" : ",") + "[" + resName + "]" + seq;
if (iCode.length > 0) groups += "^" + iCode;
if (chainID.length > 0) groups += ":" + chainID;
htSite.put ("groups", groups);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "remarkTls", 
($fz = function () {
var nGroups = 0;
var iGroup = 0;
var components = null;
var tlsGroups = null;
var tlsGroup = null;
var ranges = null;
var range = null;
var remark = this.line.substring (0, 11);
while (this.readLine () != null && this.line.startsWith (remark)) {
try {
var tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (this.line.substring (10).$replace (':', ' '));
if (tokens.length < 2) continue;
org.jmol.util.Logger.info (this.line);
if (tokens[1].equalsIgnoreCase ("GROUP")) {
tlsGroup =  new java.util.Hashtable ();
ranges =  new java.util.ArrayList ();
tlsGroup.put ("ranges", ranges);
tlsGroups.add (tlsGroup);
this.tlsGroupID = this.parseIntStr (tokens[tokens.length - 1]);
tlsGroup.put ("id", Integer.$valueOf (this.tlsGroupID));
} else if (tokens[0].equalsIgnoreCase ("NUMBER")) {
if (tokens[2].equalsIgnoreCase ("COMPONENTS")) {
} else {
nGroups = this.parseIntStr (tokens[tokens.length - 1]);
if (nGroups < 1) break;
if (this.vTlsModels == null) this.vTlsModels =  new java.util.ArrayList ();
tlsGroups =  new java.util.ArrayList ();
this.appendLoadNote (this.line.substring (11).trim ());
}} else if (tokens[0].equalsIgnoreCase ("COMPONENTS")) {
components = this.line;
} else if (tokens[0].equalsIgnoreCase ("RESIDUE")) {
range =  new java.util.Hashtable ();
var chain1;
var chain2;
var res1;
var res2;
if (tokens.length == 6) {
chain1 = tokens[2].charAt (0);
chain2 = tokens[4].charAt (0);
res1 = this.parseIntStr (tokens[3]);
res2 = this.parseIntStr (tokens[5]);
} else {
var toC = components.indexOf (" C ");
var fromC = components.indexOf (" C ", toC + 4);
chain1 = this.line.charAt (fromC);
chain2 = this.line.charAt (toC);
res1 = this.parseIntStr (this.line.substring (fromC + 1, toC));
res2 = this.parseIntStr (this.line.substring (toC + 1));
}if (chain1 == chain2) {
range.put ("chains", "" + chain1 + chain2);
if (res1 <= res2) {
range.put ("residues", [res1, res2]);
ranges.add (range);
} else {
this.tlsAddError (" TLS group residues are not in order (range ignored)");
}} else {
this.tlsAddError (" TLS group chains are different (range ignored)");
}} else if (tokens[0].equalsIgnoreCase ("SELECTION")) {
var chain = '\u0000';
for (var i = 1; i < tokens.length; i++) {
if (tokens[i].toUpperCase ().indexOf ("CHAIN") >= 0) {
chain = tokens[++i].charAt (0);
continue;
}var resno = this.parseIntStr (tokens[i]);
if (resno == -2147483648) continue;
range =  new java.util.Hashtable ();
range.put ("residues", [resno, this.parseIntStr (tokens[++i])]);
if (chain != '\0') range.put ("chains", "" + chain + chain);
ranges.add (range);
}
} else if (tokens[0].equalsIgnoreCase ("ORIGIN")) {
var origin =  new org.jmol.util.Point3f ();
tlsGroup.put ("origin", origin);
if (tokens.length == 8) {
origin.set (this.parseFloatStr (tokens[5]), this.parseFloatStr (tokens[6]), this.parseFloatStr (tokens[7]));
} else {
var n = this.line.length;
origin.set (this.parseFloatStr (this.line.substring (n - 27, n - 18)), this.parseFloatStr (this.line.substring (n - 18, n - 9)), this.parseFloatStr (this.line.substring (n - 9, n)));
}if (Float.isNaN (origin.x) || Float.isNaN (origin.y) || Float.isNaN (origin.z)) {
origin.set (NaN, NaN, NaN);
this.tlsAddError ("invalid origin: " + this.line);
}} else if (tokens[1].equalsIgnoreCase ("TENSOR")) {
var tensorType = tokens[0].charAt (0);
var s = (this.readLine ().substring (10) + this.readLine ().substring (10) + this.readLine ().substring (10)).$replace (tensorType, ' ').$replace (':', ' ');
tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (s);
var tensor =  Clazz.newFloatArray (3, 3, 0);
tlsGroup.put ("t" + tensorType, tensor);
for (var i = 0; i < tokens.length; i++) {
var ti = tokens[i].charCodeAt (0) - 49;
var tj = tokens[i].charCodeAt (1) - 49;
tensor[ti][tj] = this.parseFloatStr (tokens[++i]);
if (ti < tj) tensor[tj][ti] = tensor[ti][tj];
}
for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) if (Float.isNaN (tensor[i][j])) {
this.tlsAddError ("invalid tensor: " + org.jmol.util.Escape.escapeFloatAA (tensor, false));
}

if (tensorType == 'S' && ++iGroup == nGroups) {
org.jmol.util.Logger.info (nGroups + " TLS groups read");
this.readLine ();
break;
}}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.error (this.line + "\nError in TLS parser: ");
System.out.println (e.getMessage ());
tlsGroups = null;
break;
} else {
throw e;
}
}
}
if (tlsGroups != null) {
var groups =  new java.util.Hashtable ();
groups.put ("groupCount", Integer.$valueOf (nGroups));
groups.put ("groups", tlsGroups);
this.vTlsModels.add (groups);
}return (nGroups < 1);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "handleTlsMissingModels", 
($fz = function () {
this.vTlsModels = null;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setTlsGroups", 
($fz = function (iGroup, iModel, symmetry) {
org.jmol.util.Logger.info ("TLS model " + (iModel + 1) + " set " + (iGroup + 1));
var tlsGroupInfo = this.vTlsModels.get (iGroup);
var groups = tlsGroupInfo.get ("groups");
var index0 = this.atomSetCollection.getAtomSetAtomIndex (iModel);
var data =  Clazz.newIntArray (this.atomSetCollection.getAtomSetAtomCount (iModel), 0);
var indexMax = index0 + data.length;
var atoms = this.atomSetCollection.getAtoms ();
var nGroups = groups.size ();
for (var i = 0; i < nGroups; i++) {
var group = groups.get (i);
var ranges = group.get ("ranges");
this.tlsGroupID = (group.get ("id")).intValue ();
for (var j = ranges.size (); --j >= 0; ) {
var chains = ranges.get (j).get ("chains");
var residues = ranges.get (j).get ("residues");
var chain0 = chains.charAt (0);
var chain1 = chains.charAt (1);
var res0 = residues[0];
var res1 = residues[1];
var index1 = this.findAtomForRange (index0, indexMax, chain0, res0, false);
var index2 = (index1 >= 0 ? this.findAtomForRange (index1, indexMax, chain1, res1, false) : -1);
if (index2 < 0) {
org.jmol.util.Logger.info ("TLS processing terminated");
return;
}org.jmol.util.Logger.info ("TLS ID=" + this.tlsGroupID + " model atom index range " + index1 + "-" + index2);
var isSameChain = (chain0 == chain1);
for (var iAtom = index0; iAtom < indexMax; iAtom++) {
var atom = atoms[iAtom];
if (isSameChain ? atom.sequenceNumber >= res0 && atom.sequenceNumber <= res1 : atom.chainID > chain0 && atom.chainID < chain1 || atom.chainID == chain0 && atom.sequenceNumber >= res0 || atom.chainID == chain1 && atom.sequenceNumber <= res1) {
data[iAtom - index0] = this.tlsGroupID;
this.setTlsEllipsoid (atom, group, symmetry);
}}
}
}
var sdata =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < data.length; i++) sdata.appendI (data[i]).appendC ('\n');

this.atomSetCollection.setAtomSetAtomProperty ("tlsGroup", sdata.toString (), iModel);
this.atomSetCollection.setAtomSetAuxiliaryInfoForSet ("TLS", tlsGroupInfo, iModel);
this.atomSetCollection.setEllipsoids ();
}, $fz.isPrivate = true, $fz), "~N,~N,org.jmol.api.SymmetryInterface");
Clazz.defineMethod (c$, "findAtomForRange", 
($fz = function (atom1, atom2, chain, resno, isLast) {
var iAtom = this.findAtom (atom1, atom2, chain, resno, true);
return (isLast && iAtom >= 0 ? this.findAtom (iAtom, atom2, chain, resno, false) : iAtom);
}, $fz.isPrivate = true, $fz), "~N,~N,~S,~N,~B");
Clazz.defineMethod (c$, "findAtom", 
($fz = function (atom1, atom2, chain, resno, isTrue) {
var atoms = this.atomSetCollection.getAtoms ();
for (var i = atom1; i < atom2; i++) {
var atom = atoms[i];
if ((atom.chainID == chain && atom.sequenceNumber == resno) == isTrue) return i;
}
if (isTrue) {
org.jmol.util.Logger.warn ("PdbReader findAtom chain=" + chain + " resno=" + resno + " not found");
this.tlsAddError ("atom not found: chain=" + chain + " resno=" + resno);
}return (isTrue ? -1 : atom2);
}, $fz.isPrivate = true, $fz), "~N,~N,~S,~N,~B");
Clazz.defineMethod (c$, "setTlsEllipsoid", 
($fz = function (atom, group, symmetry) {
var origin = group.get ("origin");
if (Float.isNaN (origin.x)) return;
var T = group.get ("tT");
var L = group.get ("tL");
var S = group.get ("tS");
if (T == null || L == null || S == null) return;
var x = (atom.x - origin.x) * 0.017453292;
var y = (atom.y - origin.y) * 0.017453292;
var z = (atom.z - origin.z) * 0.017453292;
var xx = x * x;
var yy = y * y;
var zz = z * z;
var xy = x * y;
var xz = x * z;
var yz = y * z;
this.dataT[0] = T[0][0];
this.dataT[1] = T[1][1];
this.dataT[2] = T[2][2];
this.dataT[3] = T[0][1];
this.dataT[4] = T[0][2];
this.dataT[5] = T[1][2];
this.dataT[6] = 12;
var anisou =  Clazz.newFloatArray (8, 0);
var bresidual = (Float.isNaN (atom.bfactor) ? 0 : atom.bfactor / 78.95683);
anisou[0] = this.dataT[0] + L[1][1] * zz + L[2][2] * yy - 2 * L[1][2] * yz + 2 * S[1][0] * z - 2 * S[2][0] * y;
anisou[1] = this.dataT[1] + L[0][0] * zz + L[2][2] * xx - 2 * L[2][0] * xz - 2 * S[0][1] * z + 2 * S[2][1] * x;
anisou[2] = this.dataT[2] + L[0][0] * yy + L[1][1] * xx - 2 * L[0][1] * xy - 2 * S[1][2] * x + 2 * S[0][2] * y;
anisou[3] = this.dataT[3] - L[2][2] * xy + L[1][2] * xz + L[2][0] * yz - L[0][1] * zz - S[0][0] * z + S[1][1] * z + S[2][0] * x - S[2][1] * y;
anisou[4] = this.dataT[4] - L[1][1] * xz + L[1][2] * xy - L[2][0] * yy + L[0][1] * yz + S[0][0] * y - S[2][2] * y + S[1][2] * z - S[1][0] * x;
anisou[5] = this.dataT[5] - L[0][0] * yz - L[1][2] * xx + L[2][0] * xy + L[0][1] * xz - S[1][1] * x + S[2][2] * x + S[0][1] * y - S[0][2] * z;
anisou[6] = 12;
anisou[7] = bresidual;
if (Float.isNaN (bresidual)) System.out.println ("hmm");
if (this.tlsU == null) this.tlsU =  new java.util.Hashtable ();
this.tlsU.put (atom, anisou);
atom.ellipsoid = [null, null, symmetry.getEllipsoid (this.dataT)];
}, $fz.isPrivate = true, $fz), "org.jmol.adapter.smarter.Atom,java.util.Map,org.jmol.api.SymmetryInterface");
Clazz.defineMethod (c$, "tlsAddError", 
($fz = function (error) {
if (this.sbTlsErrors == null) this.sbTlsErrors =  new org.jmol.util.StringXBuilder ();
this.sbTlsErrors.append (this.fileName).appendC ('\t').append ("TLS group ").appendI (this.tlsGroupID).appendC ('\t').append (error).appendC ('\n');
}, $fz.isPrivate = true, $fz), "~S");
c$.fixRadius = Clazz.defineMethod (c$, "fixRadius", 
function (r) {
return (r < 0.9 ? 1 : r);
}, "~N");
Clazz.defineStatics (c$,
"lineOptions", "ATOM    HETATM  MODEL   CONECT  HELIX   SHEET   TURN    HET     HETNAM  ANISOU  SITE    CRYST1  SCALE1  SCALE2  SCALE3  EXPDTA  FORMUL  REMARK  HEADER  COMPND  SOURCE  TITLE   ",
"RAD_PER_DEG", (0.017453292519943295),
"_8PI2_", (78.95683520871486));
});
