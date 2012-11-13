﻿Clazz.declarePackage ("org.jmol.adapter.readers.more");
Clazz.load (["org.jmol.adapter.readers.molxyz.MolReader", "java.util.ArrayList"], "org.jmol.adapter.readers.more.JcampdxReader", ["java.io.BufferedReader", "$.StringReader", "java.lang.Float", "org.jmol.adapter.smarter.SmarterJmolAdapter", "org.jmol.util.BitSet", "$.Escape", "$.Logger", "$.Parser", "$.StringXBuilder", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.modelID = null;
this.models = null;
this.modelIdList = "";
this.peakData = null;
this.lastModel = "";
this.selectedModel = 0;
this.peakIndex = null;
this.peakFilePath = null;
this.allTypes = null;
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.more, "JcampdxReader", org.jmol.adapter.readers.molxyz.MolReader);
Clazz.prepareFields (c$, function () {
this.peakData =  new java.util.ArrayList ();
});
Clazz.overrideMethod (c$, "initializeReader", 
function () {
if (this.isTrajectory) {
org.jmol.util.Logger.warn ("TRAJECTORY keyword ignored");
this.isTrajectory = false;
}if (this.reverseModels) {
org.jmol.util.Logger.warn ("REVERSE keyword ignored");
this.reverseModels = false;
}this.selectedModel = this.desiredModelNumber;
this.desiredModelNumber = -2147483648;
this.peakFilePath = org.jmol.util.Escape.escapeStr (this.filePath);
this.htParams.remove ("modelNumber");
if (this.htParams.containsKey ("zipSet")) {
this.peakIndex = this.htParams.get ("peakIndex");
if (this.peakIndex == null) {
this.peakIndex =  Clazz.newIntArray (1, 0);
this.htParams.put ("peakIndex", this.peakIndex);
}if (!this.htParams.containsKey ("subFileName")) this.peakFilePath = org.jmol.util.Escape.escapeStr (org.jmol.util.TextFormat.split (this.filePath, '|')[0]);
} else {
this.peakIndex =  Clazz.newIntArray (1, 0);
}if (!this.checkFilterKey ("NOSYNC")) this.addJmolScript ("sync on");
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
var i = this.line.indexOf ("=");
if (i < 0 || !this.line.startsWith ("##")) return true;
var label = this.line.substring (0, i).trim ();
if (label.equals ("##$MODELS")) return this.readModels ();
if (label.equals ("##$PEAKS")) return this.readPeaks ();
return true;
});
Clazz.defineMethod (c$, "finalizeReader", 
function () {
this.processPeakData ();
Clazz.superCall (this, org.jmol.adapter.readers.more.JcampdxReader, "finalizeReader", []);
});
Clazz.defineMethod (c$, "findModelById", 
($fz = function (modelID) {
for (var i = this.atomSetCollection.getAtomSetCount (); --i >= 0; ) if (modelID.equals (this.atomSetCollection.getAtomSetAuxiliaryInfoValue (i, "modelID"))) return i;

return -1;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "readModels", 
($fz = function () {
if (this.line.indexOf ("<Models") < 0) {
this.discardLinesUntilContains2 ("<Models", "##");
if (this.line.indexOf ("<Models") < 0) return false;
}this.models = null;
this.line = "";
this.modelID = "";
var isFirst = true;
while (true) {
var model0 = this.atomSetCollection.getCurrentAtomSetIndex ();
this.discardLinesUntilNonBlank ();
if (this.line == null || !this.line.contains ("<ModelData")) break;
this.models = this.getModelAtomSetCollection ();
if (this.models != null) {
this.atomSetCollection.appendAtomSetCollection (-1, this.models);
}this.updateModelIDs (model0, isFirst);
isFirst = false;
}
return true;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "updateModelIDs", 
($fz = function (model0, isFirst) {
var n = this.atomSetCollection.getAtomSetCount ();
if (isFirst && n == model0 + 2) {
this.atomSetCollection.setAtomSetAuxiliaryInfo ("modelID", this.modelID);
return;
}for (var pt = 0, i = model0; ++i < n; ) {
this.atomSetCollection.setAtomSetAuxiliaryInfoForSet ("modelID", this.modelID + "." + (++pt), i);
}
}, $fz.isPrivate = true, $fz), "~N,~B");
c$.getAttribute = Clazz.defineMethod (c$, "getAttribute", 
($fz = function (line, tag) {
var attr = org.jmol.util.Parser.getQuotedAttribute (line, tag);
return (attr == null ? "" : attr);
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "getModelAtomSetCollection", 
($fz = function () {
this.lastModel = this.modelID;
this.modelID = org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "id");
var key = ";" + this.modelID + ";";
if (this.modelIdList.indexOf (key) >= 0) {
this.discardLinesUntilContains ("</ModelData>");
return null;
}this.modelIdList += key;
var baseModel = org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "baseModel");
var modelType = org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "type").toLowerCase ();
var vibScale = org.jmol.util.Parser.parseFloatStr (org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "vibrationScale"));
if (modelType.equals ("xyzvib")) modelType = "xyz";
 else if (modelType.length == 0) modelType = null;
var sb =  new org.jmol.util.StringXBuilder ();
while (this.readLine () != null && !this.line.contains ("</ModelData>")) sb.append (this.line).appendC ('\n');

var data = sb.toString ();
var ret = org.jmol.adapter.smarter.SmarterJmolAdapter.staticGetAtomSetCollectionReader (this.filePath, modelType,  new java.io.BufferedReader ( new java.io.StringReader (data)), this.htParams);
if (Clazz.instanceOf (ret, String)) {
org.jmol.util.Logger.warn ("" + ret);
return null;
}ret = org.jmol.adapter.smarter.SmarterJmolAdapter.staticGetAtomSetCollection (ret);
if (Clazz.instanceOf (ret, String)) {
org.jmol.util.Logger.warn ("" + ret);
return null;
}var a = ret;
if (baseModel.length == 0) baseModel = this.lastModel;
if (baseModel.length != 0) {
var ibase = this.findModelById (baseModel);
if (ibase >= 0) {
this.atomSetCollection.setAtomSetAuxiliaryInfoForSet ("jdxModelID", baseModel, ibase);
for (var i = a.getAtomSetCount (); --i >= 0; ) a.setAtomSetAuxiliaryInfoForSet ("jdxBaseModel", baseModel, i);

if (a.getBondCount () == 0) this.setBonding (a, ibase);
}}if (!Float.isNaN (vibScale)) {
org.jmol.util.Logger.info ("jdx applying vibrationScale of " + vibScale + " to " + a.getAtomCount () + " atoms");
var atoms = a.getAtoms ();
for (var i = a.getAtomCount (); --i >= 0; ) atoms[i].scaleVector (vibScale);

}org.jmol.util.Logger.info ("jdx model=" + this.modelID + " type=" + a.getFileTypeName ());
return a;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setBonding", 
($fz = function (a, ibase) {
var n0 = this.atomSetCollection.getAtomSetAtomCount (ibase);
var n = a.getAtomCount ();
if (n % n0 != 0) {
org.jmol.util.Logger.warn ("atom count in secondary model (" + n + ") is not a multiple of " + n0 + " -- bonding ignored");
return;
}var bonds = this.atomSetCollection.getBonds ();
var b0 = 0;
for (var i = 0; i < ibase; i++) b0 += this.atomSetCollection.getAtomSetBondCount (i);

var b1 = b0 + this.atomSetCollection.getAtomSetBondCount (ibase);
var ii0 = this.atomSetCollection.getAtomSetAtomIndex (ibase);
var nModels = a.getAtomSetCount ();
for (var j = 0; j < nModels; j++) {
var i0 = a.getAtomSetAtomIndex (j) - ii0;
if (a.getAtomSetAtomCount (j) != n0) {
org.jmol.util.Logger.warn ("atom set atom count in secondary model (" + a.getAtomSetAtomCount (j) + ") is not equal to " + n0 + " -- bonding ignored");
return;
}for (var i = b0; i < b1; i++) a.addNewBondWithOrder (bonds[i].atomIndex1 + i0, bonds[i].atomIndex2 + i0, bonds[i].order);

}
}, $fz.isPrivate = true, $fz), "org.jmol.adapter.smarter.AtomSetCollection,~N");
Clazz.defineMethod (c$, "readPeaks", 
($fz = function () {
if (this.line.indexOf ("<Peaks") < 0) this.discardLinesUntilContains2 ("<Peaks", "##");
if (this.line.indexOf ("<Peaks") < 0) return false;
var type = org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "type").toUpperCase ();
if (type.equals ("HNMR")) type = "1HNMR";
 else if (type.equals ("CNMR")) type = "13CNMR";
while (this.readLine () != null && !(this.line = this.line.trim ()).startsWith ("</Peaks>")) if (this.line.startsWith ("<PeakData")) this.peakData.add ("<PeakData file=" + this.peakFilePath + " index=\"" + (++this.peakIndex[0]) + "\"" + " type=\"" + type + "\" " + this.line.substring (9).trim ());

return true;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "processPeakData", 
($fz = function () {
if (this.peakData.size () == 0) return;
var bsModels =  new org.jmol.util.BitSet ();
var n = this.peakData.size ();
var havePeaks = (n > 0);
for (var p = 0; p < n; p++) {
this.line = this.peakData.get (p);
var type = org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "type");
this.modelID = org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "model");
var i = this.findModelById (this.modelID);
if (i < 0) {
org.jmol.util.Logger.warn ("cannot find model " + this.modelID + " required for " + this.line);
continue;
}this.addType (i, type);
var title = type + ": " + org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "title");
var key = "jdxAtomSelect_" + org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "type");
bsModels.set (i);
var s;
if (org.jmol.adapter.readers.more.JcampdxReader.getAttribute (this.line, "atoms").length != 0) {
var peaks = this.atomSetCollection.getAtomSetAuxiliaryInfoValue (i, key);
if (peaks == null) this.atomSetCollection.setAtomSetAuxiliaryInfoForSet (key, peaks =  new java.util.ArrayList (), i);
peaks.add (this.line);
s = type + ": ";
} else if (this.atomSetCollection.getAtomSetAuxiliaryInfoValue (i, "jdxModelSelect") == null) {
this.atomSetCollection.setAtomSetAuxiliaryInfoForSet ("name", title, i);
this.atomSetCollection.setAtomSetAuxiliaryInfoForSet ("jdxModelSelect", this.line, i);
s = "model: ";
} else {
s = "ignored: ";
}org.jmol.util.Logger.info (s + this.line);
}
n = this.atomSetCollection.getAtomSetCount ();
for (var i = n; --i >= 0; ) {
this.modelID = this.atomSetCollection.getAtomSetAuxiliaryInfoValue (i, "modelID");
if (havePeaks && !bsModels.get (i) && this.modelID.indexOf (".") >= 0) {
this.atomSetCollection.removeAtomSet (i);
n--;
}}
if (this.selectedModel == -2147483648) {
if (this.allTypes != null) this.appendLoadNote (this.allTypes);
} else {
if (this.selectedModel == 0) this.selectedModel = n - 1;
for (var i = this.atomSetCollection.getAtomSetCount (); --i >= 0; ) if (i + 1 != this.selectedModel) this.atomSetCollection.removeAtomSet (i);

if (n > 0) this.appendLoadNote (this.atomSetCollection.getAtomSetAuxiliaryInfoValue (0, "name"));
}for (var i = this.atomSetCollection.getAtomSetCount (); --i >= 0; ) this.atomSetCollection.setAtomSetNumber (i, i + 1);

this.atomSetCollection.centralize ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "addType", 
($fz = function (imodel, type) {
var types = this.addType (this.atomSetCollection.getAtomSetAuxiliaryInfoValue (imodel, "spectrumTypes"), type);
if (types == null) return;
this.atomSetCollection.setAtomSetAuxiliaryInfoForSet ("spectrumTypes", types, imodel);
var s = this.addType (this.allTypes, type);
if (s != null) this.allTypes = s;
}, $fz.isPrivate = true, $fz), "~N,~S");
Clazz.defineMethod (c$, "addType", 
($fz = function (types, type) {
if (types != null && types.contains (type)) return null;
if (types == null) types = "";
 else types += ",";
return types + type;
}, $fz.isPrivate = true, $fz), "~S,~S");
});
