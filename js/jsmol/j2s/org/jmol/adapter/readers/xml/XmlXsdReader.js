Clazz.declarePackage ("org.jmol.adapter.readers.xml");
Clazz.load (["org.jmol.adapter.readers.xml.XmlReader", "org.jmol.util.BitSet"], "org.jmol.adapter.readers.xml.XmlXsdReader", ["java.lang.Float", "org.jmol.adapter.smarter.Atom", "org.jmol.util.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.bsBackbone = null;
this.iChain = -1;
this.iGroup = 0;
this.iAtom = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml, "XmlXsdReader", org.jmol.adapter.readers.xml.XmlReader);
Clazz.prepareFields (c$, function () {
this.bsBackbone =  new org.jmol.util.BitSet ();
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.adapter.readers.xml.XmlXsdReader, []);
});
Clazz.overrideMethod (c$, "getImplementedAttributes", 
function () {
return ["ID", "XYZ", "Connections", "Components", "IsBackboneAtom", "Connects", "Type", "Name"];
});
Clazz.defineMethod (c$, "processXml", 
function (parent, atomSetCollection, reader, xmlReader, handler) {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
parent.htParams.put ("backboneAtoms", this.bsBackbone);
Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlXsdReader, "processXml", [parent, atomSetCollection, reader, xmlReader, handler]);
atomSetCollection.clearSymbolicMap ();
}, "org.jmol.adapter.readers.xml.XmlReader,org.jmol.adapter.smarter.AtomSetCollection,java.io.BufferedReader,~O,org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler");
Clazz.overrideMethod (c$, "processStartElement", 
function (namespaceURI, localName, qName, atts) {
var tokens;
if ("Molecule".equals (localName)) {
this.atomSetCollection.newAtomSet ();
this.atomSetCollection.setAtomSetName (atts.get ("Name"));
return;
}if ("LinearChain".equals (localName)) {
this.iGroup = 0;
this.iChain++;
}if ("RepeatUnit".equals (localName)) {
this.iGroup++;
}if ("Atom3d".equals (localName)) {
this.atom =  new org.jmol.adapter.smarter.Atom ();
this.atom.elementSymbol = atts.get ("Components");
this.atom.atomName = atts.get ("ID");
this.atom.atomSerial = ++this.iAtom;
if (this.iChain >= 0) this.atom.chainID = String.fromCharCode ((this.iChain - 1) % 26 + 65);
this.atom.group3 = "UNK";
if (this.iGroup == 0) this.iGroup = 1;
this.atom.sequenceNumber = this.iGroup;
var xyz = atts.get ("XYZ");
if (xyz != null) {
tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (xyz.$replace (',', ' '));
this.atom.set (this.parseFloatStr (tokens[0]), this.parseFloatStr (tokens[1]), this.parseFloatStr (tokens[2]));
}var isBackbone = "1".equals (atts.get ("IsBackboneAtom"));
if (isBackbone) this.bsBackbone.set (this.iAtom);
return;
}if ("Bond".equals (localName)) {
var atoms = org.jmol.util.TextFormat.split (atts.get ("Connects"), ',');
var order = 1;
if (atts.containsKey ("Type")) {
var type = atts.get ("Type");
if (type.equals ("Double")) order = 2;
 else if (type.equals ("Triple")) order = 3;
}this.atomSetCollection.addNewBondFromNames (atoms[0], atoms[1], order);
return;
}}, "~S,~S,~S,java.util.Map");
Clazz.overrideMethod (c$, "processEndElement", 
function (uri, localName, qName) {
if ("Atom3d".equals (localName)) {
if (this.atom.elementSymbol != null && !Float.isNaN (this.atom.z)) {
this.parent.setAtomCoord (this.atom);
this.atomSetCollection.addAtomWithMappedName (this.atom);
}this.atom = null;
return;
}this.keepChars = false;
this.chars = null;
}, "~S,~S,~S");
});
