﻿Clazz.declarePackage ("org.jmol.jvxl.readers");
Clazz.load (["org.jmol.jvxl.readers.PolygonFileReader"], "org.jmol.jvxl.readers.PmeshReader", ["org.jmol.jvxl.data.JvxlCoder", "org.jmol.util.Logger", "$.Point3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.isBinary = false;
this.nPolygons = 0;
this.pmeshError = null;
this.type = null;
this.isClosedFace = false;
this.fixedCount = 0;
this.onePerLine = false;
this.vertexBase = 0;
this.vertexMap = null;
this.tokens = null;
this.iToken = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.jvxl.readers, "PmeshReader", org.jmol.jvxl.readers.PolygonFileReader);
Clazz.prepareFields (c$, function () {
this.tokens =  new Array (0);
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.jvxl.readers.PmeshReader, []);
});
Clazz.defineMethod (c$, "init2", 
function (sg, br) {
Clazz.superCall (this, org.jmol.jvxl.readers.PmeshReader, "init2", [sg, br]);
var fileName = (sg.getReaderData ())[0];
if (fileName == null) return;
this.type = "pmesh";
this.setHeader ();
this.isBinary = this.checkBinary (fileName);
this.isClosedFace = !this.isBinary;
}, "org.jmol.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.defineMethod (c$, "setHeader", 
function () {
this.jvxlFileHeaderBuffer.append (this.type + " file format\nvertices and triangles only\n");
org.jmol.jvxl.data.JvxlCoder.jvxlCreateHeaderWithoutTitleOrAtoms (this.volumeData, this.jvxlFileHeaderBuffer);
});
Clazz.defineMethod (c$, "checkBinary", 
function (fileName) {
try {
this.br.mark (4);
var buf =  Clazz.newCharArray (5, '\0');
this.br.read (buf, 0, 5);
if (( String.instantialize (buf)).startsWith ("PM\u0001\u0000")) {
this.br.close ();
this.binarydoc = this.newBinaryDocument ();
this.binarydoc.setStream (this.sg.getAtomDataServer ().getBufferedInputStream (fileName), (buf[4] == '\0'));
return true;
}this.br.reset ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return false;
}, "~S");
Clazz.overrideMethod (c$, "getSurfaceData", 
function () {
if (this.readVerticesAndPolygons ()) org.jmol.util.Logger.info ((this.isBinary ? "binary " : "") + this.type + " file contains " + this.nVertices + " vertices and " + this.nPolygons + " polygons for " + this.nTriangles + " triangles");
 else org.jmol.util.Logger.error (this.params.fileName + ": " + (this.pmeshError == null ? "Error reading pmesh data " : this.pmeshError));
});
Clazz.defineMethod (c$, "readVerticesAndPolygons", 
function () {
try {
if (this.isBinary && !this.readBinaryHeader ()) return false;
if (this.readVertices () && this.readPolygons ()) return true;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (this.pmeshError == null) this.pmeshError = this.type + " ERROR: " + e;
} else {
throw e;
}
}
return false;
});
Clazz.defineMethod (c$, "readBinaryHeader", 
function () {
this.pmeshError = "could not read binary Pmesh file header";
try {
var ignored =  Clazz.newByteArray (64, 0);
this.binarydoc.readByteArray (ignored, 0, 8);
this.nVertices = this.binarydoc.readInt ();
this.nPolygons = this.binarydoc.readInt ();
this.binarydoc.readByteArray (ignored, 0, 64);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.pmeshError += " " + e.getMessage ();
this.binarydoc.close ();
return false;
} else {
throw e;
}
}
this.pmeshError = null;
return true;
});
Clazz.defineMethod (c$, "readVertices", 
function () {
this.pmeshError = this.type + " ERROR: vertex count must be positive";
if (!this.isBinary) this.nVertices = this.getInt ();
if (this.onePerLine) this.iToken = 2147483647;
if (this.nVertices <= 0) {
this.pmeshError += " (" + this.nVertices + ")";
return false;
}this.pmeshError = this.type + " ERROR: invalid vertex list";
var pt =  new org.jmol.util.Point3f ();
this.vertexMap =  Clazz.newIntArray (this.nVertices, 0);
for (var i = 0; i < this.nVertices; i++) {
pt.set (this.getFloat (), this.getFloat (), this.getFloat ());
if (this.isAnisotropic) this.setVertexAnisotropy (pt);
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug (i + ": " + pt);
this.vertexMap[i] = this.addVertexCopy (pt, 0, i);
if (this.onePerLine) this.iToken = 2147483647;
}
this.pmeshError = null;
return true;
});
Clazz.defineMethod (c$, "readPolygons", 
function () {
this.pmeshError = this.type + " ERROR: polygon count must be zero or positive";
if (!this.isBinary) this.nPolygons = this.getInt ();
if (this.nPolygons < 0) {
this.pmeshError += " (" + this.nPolygons + ")";
return false;
}if (this.onePerLine) this.iToken = 2147483647;
var vertices =  Clazz.newIntArray (5, 0);
for (var iPoly = 0; iPoly < this.nPolygons; iPoly++) {
var intCount = (this.fixedCount == 0 ? this.getInt () : this.fixedCount);
var vertexCount = intCount - (this.isClosedFace ? 1 : 0);
if (vertexCount < 1 || vertexCount > 4) {
this.pmeshError = this.type + " ERROR: bad polygon (must have 1-4 vertices) at #" + (iPoly + 1);
return false;
}var isOK = true;
for (var i = 0; i < intCount; ++i) {
if ((vertices[i] = this.getInt () - this.vertexBase) < 0 || vertices[i] >= this.nVertices) {
this.pmeshError = this.type + " ERROR: invalid vertex index: " + vertices[i];
return false;
}if ((vertices[i] = this.vertexMap[vertices[i]]) < 0) isOK = false;
}
if (this.onePerLine) this.iToken = 2147483647;
if (!isOK) continue;
if (vertexCount < 3) for (var i = vertexCount; i < 3; ++i) vertices[i] = vertices[i - 1];

if (vertexCount == 4) {
this.nTriangles += 2;
this.addTriangleCheck (vertices[0], vertices[1], vertices[3], 5, 0, false, 0);
this.addTriangleCheck (vertices[1], vertices[2], vertices[3], 3, 0, false, 0);
} else {
this.nTriangles++;
this.addTriangleCheck (vertices[0], vertices[1], vertices[2], 7, 0, false, 0);
}}
if (this.isBinary) this.nBytes = this.binarydoc.getPosition ();
return true;
});
Clazz.defineMethod (c$, "addTriangleCheck", 
function (iA, iB, iC, check, check2, isAbsolute, color) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("tri: " + iA + " " + iB + " " + iC);
return Clazz.superCall (this, org.jmol.jvxl.readers.PmeshReader, "addTriangleCheck", [iA, iB, iC, check, check2, isAbsolute, color]);
}, "~N,~N,~N,~N,~N,~B,~N");
Clazz.defineMethod (c$, "nextToken", 
($fz = function () {
while (this.iToken >= this.tokens.length) {
this.iToken = 0;
this.readLine ();
this.tokens = this.getTokens ();
}
return this.tokens[this.iToken++];
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getInt", 
($fz = function () {
return (this.isBinary ? this.binarydoc.readInt () : this.parseIntStr (this.nextToken ()));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getFloat", 
($fz = function () {
return (this.isBinary ? this.binarydoc.readFloat () : this.parseFloatStr (this.nextToken ()));
}, $fz.isPrivate = true, $fz));
c$.PMESH_BINARY_MAGIC_NUMBER = c$.prototype.PMESH_BINARY_MAGIC_NUMBER = "PM\u0001\u0000";
});
