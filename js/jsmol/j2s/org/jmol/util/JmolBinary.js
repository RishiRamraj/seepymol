Clazz.declarePackage ("org.jmol.util");
Clazz.load (null, "org.jmol.util.JmolBinary", ["java.io.BufferedInputStream", "$.BufferedReader", "$.ByteArrayInputStream", "$.InputStreamReader", "org.jmol.util.ArrayUtil", "$.LimitedLineReader", "$.Parser"], function () {
c$ = Clazz.declareType (org.jmol.util, "JmolBinary");
c$.determineSurfaceTypeIs = Clazz.defineMethod (c$, "determineSurfaceTypeIs", 
function (is) {
var br;
try {
br =  new java.io.BufferedReader ( new java.io.InputStreamReader ( new java.io.BufferedInputStream (is, 8192), "ISO-8859-1"));
} catch (e) {
if (Clazz.exceptionOf (e, java.io.UnsupportedEncodingException)) {
return null;
} else {
throw e;
}
}
return org.jmol.util.JmolBinary.determineSurfaceFileType (br);
}, "java.io.InputStream");
c$.determineSurfaceFileType = Clazz.defineMethod (c$, "determineSurfaceFileType", 
function (bufferedReader) {
var line = null;
var br = null;
try {
br =  new org.jmol.util.LimitedLineReader (bufferedReader, 16000);
line = br.getHeader (0);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
if (br == null || line == null || line.length == 0) return null;
switch (line.charAt (0)) {
case '@':
if (line.indexOf ("@text") == 0) return "Kinemage";
break;
case '#':
if (line.indexOf (".obj") >= 0) return "Obj";
if (line.indexOf ("MSMS") >= 0) return "Msms";
break;
case '&':
if (line.indexOf ("&plot") == 0) return "Jaguar";
break;
case '\r':
case '\n':
if (line.indexOf ("ZYX") >= 0) return "Xplor";
break;
}
if (line.indexOf ("Here is your gzipped map") >= 0) return "UPPSALA" + line;
if (line.indexOf ("! nspins") >= 0) return "CastepDensity";
if (line.indexOf ("<jvxl") >= 0 && line.indexOf ("<?xml") >= 0) return "JvxlXML";
if (line.indexOf ("#JVXL+") >= 0) return "Jvxl+";
if (line.indexOf ("#JVXL") >= 0) return "Jvxl";
if (line.indexOf ("<efvet ") >= 0) return "Efvet";
if (line.indexOf ("usemtl") >= 0) return "Obj";
if (line.indexOf ("# object with") == 0) return "Nff";
if (line.indexOf ("BEGIN_DATAGRID_3D") >= 0 || line.indexOf ("BEGIN_BANDGRID_3D") >= 0) return "Xsf";
var pt0 = line.indexOf ('\0');
if (pt0 >= 0) {
if (line.indexOf ("PM\u0001\u0000") == 0) return "Pmesh";
if (line.indexOf ("MAP ") == 208) return "MRC";
if (line.length > 37 && (line.charCodeAt (36) == 0 && line.charCodeAt (37) == 100 || line.charCodeAt (36) == 0 && line.charCodeAt (37) == 100)) {
return "DSN6";
}}line = br.readLineWithNewline ();
if (line.indexOf ("object 1 class gridpositions counts") == 0) return "Apbs";
var tokens = org.jmol.util.Parser.getTokens (line);
var line2 = br.readLineWithNewline ();
if (tokens.length == 2 && org.jmol.util.Parser.parseInt (tokens[0]) == 3 && org.jmol.util.Parser.parseInt (tokens[1]) != -2147483648) {
tokens = org.jmol.util.Parser.getTokens (line2);
if (tokens.length == 3 && org.jmol.util.Parser.parseInt (tokens[0]) != -2147483648 && org.jmol.util.Parser.parseInt (tokens[1]) != -2147483648 && org.jmol.util.Parser.parseInt (tokens[2]) != -2147483648) return "PltFormatted";
}var line3 = br.readLineWithNewline ();
if (line.startsWith ("v ") && line2.startsWith ("v ") && line3.startsWith ("v ")) return "Obj";
var nAtoms = org.jmol.util.Parser.parseInt (line3);
if (nAtoms == -2147483648) return (line3.indexOf ("+") == 0 ? "Jvxl+" : null);
if (nAtoms >= 0) return "Cube";
nAtoms = -nAtoms;
for (var i = 4 + nAtoms; --i >= 0; ) if ((line = br.readLineWithNewline ()) == null) return null;

var nSurfaces = org.jmol.util.Parser.parseInt (line);
if (nSurfaces == -2147483648) return null;
return (nSurfaces < 0 ? "Jvxl" : "Cube");
}, "java.io.BufferedReader");
c$.isCompoundDocumentStream = Clazz.defineMethod (c$, "isCompoundDocumentStream", 
function (is) {
var abMagic =  Clazz.newByteArray (8, 0);
is.mark (9);
var countRead = is.read (abMagic, 0, 8);
is.reset ();
return (countRead == 8 && abMagic[0] == 0xD0 && abMagic[1] == 0xCF && abMagic[2] == 0x11 && abMagic[3] == 0xE0 && abMagic[4] == 0xA1 && abMagic[5] == 0xB1 && abMagic[6] == 0x1A && abMagic[7] == 0xE1);
}, "java.io.InputStream");
c$.isCompoundDocumentArray = Clazz.defineMethod (c$, "isCompoundDocumentArray", 
function (bytes) {
return (bytes.length >= 8 && bytes[0] == 0xD0 && bytes[1] == 0xCF && bytes[2] == 0x11 && bytes[3] == 0xE0 && bytes[4] == 0xA1 && bytes[5] == 0xB1 && bytes[6] == 0x1A && bytes[7] == 0xE1);
}, "~A");
c$.isGzipB = Clazz.defineMethod (c$, "isGzipB", 
function (bytes) {
return (bytes != null && bytes.length > 2 && bytes[0] == 0x1F && bytes[1] == 0x8B);
}, "~A");
c$.isGzipS = Clazz.defineMethod (c$, "isGzipS", 
function (is) {
var abMagic =  Clazz.newByteArray (4, 0);
try {
is.mark (5);
is.read (abMagic, 0, 4);
is.reset ();
} catch (e) {
if (Clazz.exceptionOf (e, java.io.IOException)) {
} else {
throw e;
}
}
return org.jmol.util.JmolBinary.isGzipB (abMagic);
}, "java.io.InputStream");
c$.isZipStream = Clazz.defineMethod (c$, "isZipStream", 
function (is) {
var abMagic =  Clazz.newByteArray (4, 0);
try {
is.mark (5);
is.read (abMagic, 0, 4);
is.reset ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return org.jmol.util.JmolBinary.isZipFile (abMagic);
}, "java.io.InputStream");
c$.isPngZipStream = Clazz.defineMethod (c$, "isPngZipStream", 
function (is) {
if (org.jmol.util.JmolBinary.isZipStream (is)) return false;
try {
is.mark (56);
var abMagic = org.jmol.util.JmolBinary.getStreamBytes (is, 55);
is.reset ();
return (abMagic[51] == 80 && abMagic[52] == 78 && abMagic[53] == 71 && abMagic[54] == 74);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return false;
}, "java.io.InputStream");
c$.checkPngZipStream = Clazz.defineMethod (c$, "checkPngZipStream", 
function (bis) {
if (!org.jmol.util.JmolBinary.isPngZipStream (bis)) return bis;
var data = null;
bis.mark (75);
try {
data = org.jmol.util.JmolBinary.getStreamBytes (bis, 74);
bis.reset ();
var pt = 0;
for (var i = 64, f = 1; --i > 54; f *= 10) pt += (data[i] - 48) * f;

var n = 0;
for (var i = 74, f = 1; --i > 64; f *= 10) n += (data[i] - 48) * f;

while (pt > 0) pt -= bis.skip (pt);

data = org.jmol.util.JmolBinary.getStreamBytes (bis, n);
bis.close ();
} catch (e) {
data =  Clazz.newByteArray (0, 0);
}
return  new java.io.BufferedInputStream ( new java.io.ByteArrayInputStream (data));
}, "java.io.BufferedInputStream");
c$.isZipFile = Clazz.defineMethod (c$, "isZipFile", 
function (bytes) {
return (bytes.length >= 4 && bytes[0] == 80 && bytes[1] == 75 && bytes[2] == 3 && bytes[3] == 4);
}, "~A");
c$.getStreamBytes = Clazz.defineMethod (c$, "getStreamBytes", 
function (is, n) {
var buf =  Clazz.newByteArray (n >= 0 && n < 1024 ? n : 1024, 0);
var bytes =  Clazz.newByteArray (n < 0 ? 4096 : n, 0);
var len = 0;
var totalLen = 0;
while ((n < 0 || totalLen < n) && (len = is.read (buf)) > 0) {
totalLen += len;
if (totalLen > bytes.length) bytes = org.jmol.util.ArrayUtil.ensureLengthByte (bytes, totalLen * 2);
System.arraycopy (buf, 0, bytes, totalLen - len, len);
}
if (totalLen == bytes.length) return bytes;
buf =  Clazz.newByteArray (totalLen, 0);
System.arraycopy (bytes, 0, buf, 0, totalLen);
return buf;
}, "java.io.InputStream,~N");
Clazz.defineStatics (c$,
"PMESH_BINARY_MAGIC_NUMBER", "PM\u0001\u0000");
});
