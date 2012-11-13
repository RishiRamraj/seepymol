﻿Clazz.declarePackage ("org.jmol.constant");
Clazz.load (["java.lang.Enum"], "org.jmol.constant.EnumQuantumShell", ["org.jmol.util.StringXBuilder"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tag = null;
this.tag2 = null;
this.id = 0;
this.idSpherical = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.constant, "EnumQuantumShell", Enum);
Clazz.makeConstructor (c$, 
($fz = function (tag, tag2, id, idSpherical) {
this.tag = tag;
this.tag2 = tag2;
this.id = id;
this.idSpherical = idSpherical;
}, $fz.isPrivate = true, $fz), "~S,~S,~N,~N");
c$.getNewDfCoefMap = Clazz.defineMethod (c$, "getNewDfCoefMap", 
function () {
return [ Clazz.newIntArray (1, 0),  Clazz.newIntArray (3, 0),  Clazz.newIntArray (4, 0),  Clazz.newIntArray (5, 0),  Clazz.newIntArray (6, 0),  Clazz.newIntArray (7, 0),  Clazz.newIntArray (10, 0)];
});
c$.getQuantumShellTagID = Clazz.defineMethod (c$, "getQuantumShellTagID", 
function (tag) {
if (tag.equals ("L")) return org.jmol.constant.EnumQuantumShell.SP.id;
var item = org.jmol.constant.EnumQuantumShell.getQuantumShell (tag);
return (item == null ? -1 : item.id);
}, "~S");
c$.getQuantumShell = Clazz.defineMethod (c$, "getQuantumShell", 
($fz = function (tag) {
for (var item, $item = 0, $$item = org.jmol.constant.EnumQuantumShell.values (); $item < $$item.length && ((item = $$item[$item]) || true); $item++) if (item.tag.equals (tag) || item.tag2.equals (tag)) return item;

return null;
}, $fz.isPrivate = true, $fz), "~S");
c$.getQuantumShellTagIDSpherical = Clazz.defineMethod (c$, "getQuantumShellTagIDSpherical", 
function (tag) {
if (tag.equals ("L")) return org.jmol.constant.EnumQuantumShell.SP.idSpherical;
var item = org.jmol.constant.EnumQuantumShell.getQuantumShell (tag);
return (item == null ? -1 : item.idSpherical);
}, "~S");
c$.getItem = Clazz.defineMethod (c$, "getItem", 
function (id) {
switch (id) {
case 0:
return org.jmol.constant.EnumQuantumShell.S;
case 1:
return org.jmol.constant.EnumQuantumShell.P;
case 2:
return org.jmol.constant.EnumQuantumShell.SP;
case 3:
return org.jmol.constant.EnumQuantumShell.D_SPHERICAL;
case 4:
return org.jmol.constant.EnumQuantumShell.D_CARTESIAN;
case 5:
return org.jmol.constant.EnumQuantumShell.F_SPHERICAL;
case 6:
return org.jmol.constant.EnumQuantumShell.F_CARTESIAN;
case 7:
return org.jmol.constant.EnumQuantumShell.G_SPHERICAL;
case 8:
return org.jmol.constant.EnumQuantumShell.G_CARTESIAN;
case 9:
return org.jmol.constant.EnumQuantumShell.H_SPHERICAL;
case 10:
return org.jmol.constant.EnumQuantumShell.H_CARTESIAN;
}
return null;
}, "~N");
c$.getQuantumShellTag = Clazz.defineMethod (c$, "getQuantumShellTag", 
function (id) {
for (var item, $item = 0, $$item = org.jmol.constant.EnumQuantumShell.values (); $item < $$item.length && ((item = $$item[$item]) || true); $item++) if (item.id == id) return item.tag;

return "" + id;
}, "~N");
c$.getMOString = Clazz.defineMethod (c$, "getMOString", 
function (lc) {
var sb =  new org.jmol.util.StringXBuilder ();
if (lc.length == 2) return "" + Clazz.floatToInt (lc[0] < 0 ? -lc[1] : lc[1]);
sb.appendC ('[');
for (var i = 0; i < lc.length; i += 2) {
if (i > 0) sb.append (", ");
sb.appendF (lc[i]).append (" ").appendI (Clazz.floatToInt (lc[i + 1]));
}
sb.appendC (']');
return sb.toString ();
}, "~A");
c$.SUPPORTED_BASIS_FUNCTIONS = "SPLDF";
Clazz.defineEnumConstant (c$, "S", 0, ["S", "S", 0, 0]);
Clazz.defineEnumConstant (c$, "P", 1, ["P", "X", 1, 1]);
Clazz.defineEnumConstant (c$, "SP", 2, ["SP", "SP", 2, 2]);
Clazz.defineEnumConstant (c$, "D_SPHERICAL", 3, ["5D", "5D", 3, 3]);
Clazz.defineEnumConstant (c$, "D_CARTESIAN", 4, ["D", "XX", 4, 3]);
Clazz.defineEnumConstant (c$, "F_SPHERICAL", 5, ["7F", "7F", 5, 5]);
Clazz.defineEnumConstant (c$, "F_CARTESIAN", 6, ["F", "XXX", 6, 5]);
Clazz.defineEnumConstant (c$, "G_SPHERICAL", 7, ["9G", "9G", 7, 7]);
Clazz.defineEnumConstant (c$, "G_CARTESIAN", 8, ["G", "XXXX", 8, 7]);
Clazz.defineEnumConstant (c$, "H_SPHERICAL", 9, ["10H", "10H", 9, 9]);
Clazz.defineEnumConstant (c$, "H_CARTESIAN", 10, ["H", "XXXXX", 10, 9]);
});
