﻿Clazz.declarePackage ("org.jmol.adapter.readers.xml");
Clazz.load (["org.jmol.adapter.readers.xml.XmlReader"], "org.jmol.adapter.readers.xml.XmlVaspReader", ["java.lang.Double", "org.jmol.util.Logger", "$.Parser", "$.StringXBuilder", "$.Vector3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.vaspImplementedAttributes = null;
this.data = null;
this.name = null;
this.atomCount = 0;
this.iAtom = 0;
this.isE_wo_entrp = false;
this.isE_fr_energy = false;
this.enthalpy = null;
this.gibbsEnergy = null;
this.haveUnitCell = false;
this.atomNames = null;
this.atomSyms = null;
this.atomName = null;
this.atomSym = null;
this.a = 0;
this.b = 0;
this.c = 0;
this.alpha = 0;
this.beta = 0;
this.gamma = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml, "XmlVaspReader", org.jmol.adapter.readers.xml.XmlReader);
Clazz.prepareFields (c$, function () {
this.vaspImplementedAttributes = ["name"];
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.adapter.readers.xml.XmlVaspReader, []);
});
Clazz.overrideMethod (c$, "getImplementedAttributes", 
function () {
return this.vaspImplementedAttributes;
});
Clazz.defineMethod (c$, "processXml", 
function (parent, atomSetCollection, reader, xmlReader, handler) {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
parent.doProcessLines = true;
Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlVaspReader, "processXml", [parent, atomSetCollection, reader, xmlReader, handler]);
}, "org.jmol.adapter.readers.xml.XmlReader,org.jmol.adapter.smarter.AtomSetCollection,java.io.BufferedReader,~O,org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler");
Clazz.overrideMethod (c$, "processStartElement", 
function (namespaceURI, localName, qName, atts) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("xmlvasp: start " + localName);
if (!this.parent.continuing) return;
if ("calculation".equals (localName)) {
this.enthalpy = null;
this.gibbsEnergy = null;
return;
}if ("i".equals (localName)) {
var s = atts.get ("name");
if (s.charAt (0) != 'e') return;
this.isE_wo_entrp = s.equals ("e_wo_entrp");
this.isE_fr_energy = s.equals ("e_fr_energy");
this.keepChars = (this.isE_wo_entrp || this.isE_fr_energy);
return;
}if ("structure".equals (localName)) {
if (!this.parent.doGetModel (++this.parent.modelNumber, null)) {
this.parent.checkLastModel ();
return;
}this.parent.setFractionalCoordinates (true);
this.atomSetCollection.setDoFixPeriodic ();
this.atomSetCollection.newAtomSet ();
if (this.enthalpy != null) {
this.atomSetCollection.setAtomSetAuxiliaryInfo ("enthalpy", Double.$valueOf (this.enthalpy));
}if (this.gibbsEnergy != null) {
this.atomSetCollection.setAtomSetEnergy ("" + this.gibbsEnergy, this.parseFloatStr (this.gibbsEnergy));
this.atomSetCollection.setAtomSetAuxiliaryInfo ("gibbsEnergy", Double.$valueOf (this.gibbsEnergy));
}if (this.enthalpy != null && this.gibbsEnergy != null) this.atomSetCollection.setAtomSetName ("Enthalpy = " + this.enthalpy + " eV Gibbs Energy = " + this.gibbsEnergy + " eV");
return;
}if (!this.parent.doProcessLines) return;
if ("v".equals (localName)) {
this.keepChars = (this.data != null);
return;
}if ("c".equals (localName)) {
this.keepChars = (this.iAtom < this.atomCount);
return;
}if ("varray".equals (localName)) {
this.name = atts.get ("name");
if (this.name != null && org.jmol.util.Parser.isOneOf (this.name, "basis;positions;forces")) this.data =  new org.jmol.util.StringXBuilder ();
return;
}if ("atoms".equals (localName)) {
this.keepChars = true;
return;
}}, "~S,~S,~S,java.util.Map");
Clazz.overrideMethod (c$, "processEndElement", 
function (uri, localName, qName) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("xmlvasp: end " + localName);
while (true) {
if (!this.parent.doProcessLines) break;
if (this.isE_wo_entrp) {
this.isE_wo_entrp = false;
this.enthalpy = this.chars.trim ();
break;
}if (this.isE_fr_energy) {
this.isE_fr_energy = false;
this.gibbsEnergy = this.chars.trim ();
break;
}if ("v".equals (localName) && this.data != null) {
this.data.append (this.chars);
break;
}if ("c".equals (localName)) {
if (this.iAtom < this.atomCount) {
if (this.atomName == null) {
this.atomName = this.atomSym = this.chars.trim ();
} else {
this.atomNames[this.iAtom++] = this.atomName + this.chars.trim ();
this.atomName = null;
}}break;
}if ("atoms".equals (localName)) {
this.atomCount = this.parseIntStr (this.chars);
this.atomNames =  new Array (this.atomCount);
this.atomSyms =  new Array (this.atomCount);
this.iAtom = 0;
break;
}if ("varray".equals (localName) && this.data != null) {
if (this.name == null) {
} else if ("basis".equals (this.name) && !this.haveUnitCell) {
this.haveUnitCell = true;
var ijk = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.data.toString (), null, 9);
var va = org.jmol.util.Vector3f.new3 (ijk[0], ijk[1], ijk[2]);
var vb = org.jmol.util.Vector3f.new3 (ijk[3], ijk[4], ijk[5]);
var vc = org.jmol.util.Vector3f.new3 (ijk[6], ijk[7], ijk[8]);
this.a = va.length ();
this.b = vb.length ();
this.c = vc.length ();
va.normalize ();
vb.normalize ();
vc.normalize ();
this.alpha = (Math.acos (vb.dot (vc)) * 180 / 3.141592653589793);
this.beta = (Math.acos (va.dot (vc)) * 180 / 3.141592653589793);
this.gamma = (Math.acos (va.dot (vb)) * 180 / 3.141592653589793);
} else if ("positions".equals (this.name)) {
this.parent.setUnitCell (this.a, this.b, this.c, this.alpha, this.beta, this.gamma);
var fdata =  Clazz.newFloatArray (this.atomCount * 3, 0);
org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.data.toString (), fdata, this.atomCount * 3);
var fpt = 0;
for (var i = 0; i < this.atomCount; i++) {
var atom = this.atomSetCollection.addNewAtom ();
this.parent.setAtomCoordXYZ (atom, fdata[fpt++], fdata[fpt++], fdata[fpt++]);
atom.elementSymbol = this.atomSyms[i];
atom.atomName = this.atomNames[i];
}
} else if ("forces".equals (this.name)) {
var fdata =  Clazz.newFloatArray (this.atomCount * 3, 0);
org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.data.toString (), fdata, this.atomCount * 3);
var fpt = 0;
var i0 = this.atomSetCollection.getLastAtomSetAtomIndex ();
for (var i = 0; i < this.atomCount; i++) this.atomSetCollection.addVibrationVector (i0 + i, fdata[fpt++], fdata[fpt++], fdata[fpt++]);

}this.data = null;
break;
}if ("structure".equals (localName)) {
try {
this.parent.applySymmetryAndSetTrajectory ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
break;
}return;
}
this.chars = null;
this.keepChars = false;
}, "~S,~S,~S");
});
