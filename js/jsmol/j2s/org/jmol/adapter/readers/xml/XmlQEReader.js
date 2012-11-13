Clazz.declarePackage ("org.jmol.adapter.readers.xml");
Clazz.load (["org.jmol.adapter.readers.xml.XmlReader"], "org.jmol.adapter.readers.xml.XmlQEReader", ["org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atomCount = 0;
this.a = 0;
this.b = 0;
this.c = 0;
this.alpha = 0;
this.beta = 0;
this.gamma = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml, "XmlQEReader", org.jmol.adapter.readers.xml.XmlReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.adapter.readers.xml.XmlQEReader, []);
});
Clazz.overrideMethod (c$, "getImplementedAttributes", 
function () {
return ["SPECIES", "TAU"];
});
Clazz.defineMethod (c$, "processXml", 
function (parent, atomSetCollection, reader, xmlReader, handler) {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
parent.doProcessLines = true;
Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlQEReader, "processXml", [parent, atomSetCollection, reader, xmlReader, handler]);
}, "org.jmol.adapter.readers.xml.XmlReader,org.jmol.adapter.smarter.AtomSetCollection,java.io.BufferedReader,~O,org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler");
Clazz.overrideMethod (c$, "processStartElement", 
function (namespaceURI, localName, qName, atts) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("xmlqe: start " + localName);
if (!this.parent.continuing) return;
if ("NUMBER_OF_ATOMS".equals (localName) || "CELL_DIMENSIONS".equals (localName) || "AT".equals (localName)) {
this.keepChars = true;
return;
}if (localName.startsWith ("ATOM.")) {
var xyz = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensFloat (atts.get ("TAU"), null, 3);
this.atom = this.atomSetCollection.addNewAtom ();
this.atom.elementSymbol = atts.get ("SPECIES").trim ();
this.parent.setAtomCoordXYZ (this.atom, xyz[0] * 0.5291772, xyz[1] * 0.5291772, xyz[2] * 0.5291772);
}if ("structure".equals (localName)) {
if (!this.parent.doGetModel (++this.parent.modelNumber, null)) {
this.parent.checkLastModel ();
return;
}this.parent.setFractionalCoordinates (true);
this.atomSetCollection.setDoFixPeriodic ();
this.atomSetCollection.newAtomSet ();
return;
}if (!this.parent.doProcessLines) return;
}, "~S,~S,~S,java.util.Map");
Clazz.overrideMethod (c$, "processEndElement", 
function (uri, localName, qName) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("xmlqe: end " + localName);
while (true) {
if (!this.parent.doProcessLines) break;
if ("NUMBER_OF_ATOMS".equals (localName)) {
this.atomCount = this.parseIntStr (this.chars);
break;
}if ("CELL_DIMENSIONS".equals (localName)) {
this.parent.setFractionalCoordinates (true);
var data = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.chars, null, 6);
this.a = data[0];
this.b = (data[1] == 0 ? this.a : data[1]);
this.c = (data[2] == 0 ? this.a : data[2]);
this.alpha = (data[3] == 0 ? 90 : data[3]);
this.beta = (data[4] == 0 ? 90 : data[4]);
this.gamma = (data[5] == 0 ? 90 : data[5]);
break;
}if ("AT".equals (localName)) {
var m = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensFloat (this.chars, null, 9);
for (var i = 0; i < 9; i += 3) {
m[i] *= this.a;
m[i + 1] *= this.b;
m[i + 2] *= this.c;
}
this.parent.addPrimitiveLatticeVector (0, m, 0);
this.parent.addPrimitiveLatticeVector (1, m, 3);
this.parent.addPrimitiveLatticeVector (2, m, 6);
break;
}if ("GEOMETRY_INFO".equals (localName)) {
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
