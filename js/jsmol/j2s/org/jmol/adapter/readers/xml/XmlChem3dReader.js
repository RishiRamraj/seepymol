Clazz.declarePackage ("org.jmol.adapter.readers.xml");
Clazz.load (["org.jmol.adapter.readers.xml.XmlReader", "java.util.ArrayList"], "org.jmol.adapter.readers.xml.XmlChem3dReader", ["java.lang.Boolean", "$.Float", "java.util.Hashtable", "org.jmol.adapter.smarter.Atom", "org.jmol.api.Interface", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.orbitals = null;
this.moData = null;
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml, "XmlChem3dReader", org.jmol.adapter.readers.xml.XmlReader);
Clazz.prepareFields (c$, function () {
this.orbitals =  new java.util.ArrayList ();
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.adapter.readers.xml.XmlChem3dReader, []);
});
Clazz.overrideMethod (c$, "getImplementedAttributes", 
function () {
return ["id", "symbol", "cartCoords", "bondAtom1", "bondAtom2", "bondOrder", "gridDatXDim", "gridDatYDim", "gridDatZDim", "gridDatXSize", "gridDatYSize", "gridDatZSize", "gridDatOrigin", "gridDatDat", "calcPartialCharges", "calcAtoms"];
});
Clazz.defineMethod (c$, "processXml", 
function (parent, atomSetCollection, reader, xmlReader, handler) {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlChem3dReader, "processXml", [parent, atomSetCollection, reader, xmlReader, handler]);
this.setMOData (this.moData);
}, "org.jmol.adapter.readers.xml.XmlReader,org.jmol.adapter.smarter.AtomSetCollection,java.io.BufferedReader,~O,org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler");
Clazz.overrideMethod (c$, "processStartElement", 
function (namespaceURI, localName, qName, atts) {
var tokens;
if ("model".equals (localName)) {
this.atomSetCollection.newAtomSet ();
return;
}if ("atom".equals (localName)) {
this.atom =  new org.jmol.adapter.smarter.Atom ();
this.atom.atomName = atts.get ("id");
this.atom.elementSymbol = atts.get ("symbol");
if (atts.containsKey ("cartCoords")) {
var xyz = atts.get ("cartCoords");
tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (xyz);
this.atom.set (this.parseFloatStr (tokens[0]), this.parseFloatStr (tokens[1]), this.parseFloatStr (tokens[2]));
}return;
}if ("bond".equals (localName)) {
var atom1 = atts.get ("bondAtom1");
var atom2 = atts.get ("bondAtom2");
var order = 1;
if (atts.containsKey ("bondOrder")) order = this.parseIntStr (atts.get ("bondOrder"));
this.atomSetCollection.addNewBondFromNames (atom1, atom2, order);
return;
}if ("electronicStructureCalculation".equals (localName)) {
tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (atts.get ("calcPartialCharges"));
var tokens2 = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (atts.get ("calcAtoms"));
for (var i = this.parseIntStr (tokens[0]); --i >= 0; ) this.atomSetCollection.mapPartialCharge (tokens2[i + 1], this.parseFloatStr (tokens[i + 1]));

}if ("gridData".equals (localName)) {
var nPointsX = this.parseIntStr (atts.get ("gridDatXDim"));
var nPointsY = this.parseIntStr (atts.get ("gridDatYDim"));
var nPointsZ = this.parseIntStr (atts.get ("gridDatZDim"));
var xStep = this.parseFloatStr (atts.get ("gridDatXSize")) / (nPointsX);
var yStep = this.parseFloatStr (atts.get ("gridDatYSize")) / (nPointsY);
var zStep = this.parseFloatStr (atts.get ("gridDatZSize")) / (nPointsZ);
tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (atts.get ("gridDatOrigin"));
var ox = this.parseFloatStr (tokens[0]);
var oy = this.parseFloatStr (tokens[1]);
var oz = this.parseFloatStr (tokens[2]);
tokens = org.jmol.adapter.smarter.AtomSetCollectionReader.getTokensStr (atts.get ("gridDatData"));
var pt = 1;
var voxelData =  Clazz.newFloatArray (nPointsX, nPointsY, nPointsZ, 0);
var sum = 0;
for (var z = 0; z < nPointsZ; z++) for (var y = 0; y < nPointsY; y++) for (var x = 0; x < nPointsX; x++) {
var f = this.parseFloatStr (tokens[pt++]);
voxelData[x][y][z] = f;
sum += f * f;
}


sum = (1 / Math.sqrt (sum));
for (var z = 0; z < nPointsZ; z++) for (var y = 0; y < nPointsY; y++) for (var x = 0; x < nPointsX; x++) {
voxelData[x][y][z] *= sum;
}


var vd = org.jmol.api.Interface.getOptionInterface ("jvxl.data.VolumeData");
vd.setVoxelCounts (nPointsX, nPointsY, nPointsZ);
vd.setVolumetricVector (0, xStep, 0, 0);
vd.setVolumetricVector (1, 0, yStep, 0);
vd.setVolumetricVector (2, 0, 0, zStep);
vd.setVolumetricOrigin (ox, oy, oz);
vd.setVoxelDataAsArray (voxelData);
if (this.moData == null) {
this.moData =  new java.util.Hashtable ();
this.moData.put ("defaultCutoff", Float.$valueOf (0.01));
this.moData.put ("haveVolumeData", Boolean.TRUE);
this.moData.put ("calculationType", "Chem3D");
this.orbitals =  new java.util.ArrayList ();
this.moData.put ("mos", this.orbitals);
}var mo =  new java.util.Hashtable ();
mo.put ("volumeData", vd);
this.orbitals.add (mo);
org.jmol.util.Logger.info ("Chem3D molecular orbital data displayable using ISOSURFACE MO " + this.orbitals.size ());
return;
}}, "~S,~S,~S,java.util.Map");
Clazz.overrideMethod (c$, "processEndElement", 
function (uri, localName, qName) {
if ("atom".equals (localName)) {
if (this.atom.elementSymbol != null && !Float.isNaN (this.atom.z)) {
this.parent.setAtomCoord (this.atom);
this.atomSetCollection.addAtomWithMappedName (this.atom);
}this.atom = null;
return;
}this.keepChars = false;
this.chars = null;
}, "~S,~S,~S");
});
