Clazz.declarePackage ("org.jmol.adapter.readers.xml");
Clazz.load (["org.jmol.adapter.readers.xml.XmlCmlReader", "$.XmlReader"], "org.jmol.adapter.readers.xml.XmlMolproReader", null, function () {
c$ = Clazz.decorateAsClass (function () {
if (!Clazz.isClassDefined ("org.jmol.adapter.readers.xml.XmlMolproReader.MolproHandler")) {
org.jmol.adapter.readers.xml.XmlMolproReader.$XmlMolproReader$MolproHandler$ ();
}
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml, "XmlMolproReader", org.jmol.adapter.readers.xml.XmlCmlReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.adapter.readers.xml.XmlMolproReader, []);
});
Clazz.overrideMethod (c$, "getImplementedAttributes", 
function () {
return ["id", "length", "type", "x3", "y3", "z3", "elementType", "name", "groups", "cartesianLength", "primitives", "minL", "maxL", "angular", "contractions", "occupation", "energy", "symmetryID", "wavenumber", "units"];
});
Clazz.defineMethod (c$, "processStartElement2", 
function (localName, atts) {
if (localName.equals ("normalCoordinate")) {
this.keepChars = false;
if (!this.parent.doGetVibration (++this.vibrationNumber)) return;
try {
this.atomSetCollection.cloneLastAtomSet ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println (e.getMessage ());
this.atomSetCollection.errorMessage = "Error processing normalCoordinate: " + e.getMessage ();
this.vibrationNumber = 0;
return;
} else {
throw e;
}
}
if (atts.containsKey ("wavenumber")) {
var wavenumber = atts.get ("wavenumber");
var units = "cm^-1";
if (atts.containsKey ("units")) {
units = atts.get ("units");
if (units.startsWith ("inverseCent")) units = "cm^-1";
}this.atomSetCollection.setAtomSetFrequency (null, null, wavenumber, units);
this.keepChars = true;
}return;
}if (localName.equals ("vibrations")) {
this.vibrationNumber = 0;
return;
}}, "~S,java.util.Map");
Clazz.defineMethod (c$, "processEndElement2", 
function (localName) {
if (localName.equals ("normalCoordinate")) {
if (!this.keepChars) return;
var atomCount = this.atomSetCollection.getLastAtomSetAtomCount ();
var baseAtomIndex = this.atomSetCollection.getLastAtomSetAtomIndex ();
this.tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (this.chars);
for (var offset = this.tokens.length - atomCount * 3, i = 0; i < atomCount; i++) {
this.atomSetCollection.addVibrationVector (i + baseAtomIndex, this.parseFloatStr (this.tokens[offset++]), this.parseFloatStr (this.tokens[offset++]), this.parseFloatStr (this.tokens[offset++]));
}
}}, "~S");
Clazz.overrideMethod (c$, "getHandler", 
function (xmlReader) {
return Clazz.innerTypeInstance (org.jmol.adapter.readers.xml.XmlMolproReader.MolproHandler, this, null, xmlReader);
}, "~O");
c$.$XmlMolproReader$MolproHandler$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml.XmlMolproReader, "MolproHandler", org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler, null, Clazz.innerTypeInstance (org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler, this, null, Clazz.inheritArgs));
Clazz.defineMethod (c$, "startElement", 
function (a, b, c, d) {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlMolproReader.MolproHandler, "startElement", [a, b, c, d]);
this.b$["org.jmol.adapter.readers.xml.XmlMolproReader"].processStartElement2 (b, this.atts);
}, "~S,~S,~S,org.xml.sax.Attributes");
Clazz.defineMethod (c$, "endElement", 
function (a, b, c) {
this.b$["org.jmol.adapter.readers.xml.XmlMolproReader"].processEndElement2 (b);
Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlMolproReader.MolproHandler, "endElement", [a, b, c]);
}, "~S,~S,~S");
c$ = Clazz.p0p ();
};
});
