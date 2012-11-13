Clazz.declarePackage ("org.jmol.util");
Clazz.load (null, "org.jmol.util.SurfaceFileTyper", ["java.io.BufferedInputStream", "$.BufferedReader", "$.InputStreamReader", "org.jmol.util.LimitedLineReader", "$.Parser"], function () {
c$ = Clazz.declareType (org.jmol.util, "SurfaceFileTyper");
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
return org.jmol.util.SurfaceFileTyper.determineSurfaceFileType (br);
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
Clazz.defineStatics (c$,
"PMESH_BINARY_MAGIC_NUMBER", "PM\u0001\u0000");
});
