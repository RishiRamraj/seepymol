﻿Clazz.declarePackage ("org.jmol.symmetry");
Clazz.load (["org.jmol.util.Matrix4f"], "org.jmol.symmetry.HallRotation", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.rotCode = null;
this.seitzMatrix = null;
this.seitzMatrixInv = null;
Clazz.instantialize (this, arguments);
}, org.jmol.symmetry, "HallRotation");
Clazz.prepareFields (c$, function () {
this.seitzMatrix =  new org.jmol.util.Matrix4f ();
this.seitzMatrixInv =  new org.jmol.util.Matrix4f ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.makeConstructor (c$, 
($fz = function (code, matrixData) {
this.rotCode = code;
var data =  Clazz.newFloatArray (16, 0);
var dataInv =  Clazz.newFloatArray (16, 0);
data[15] = dataInv[15] = 1;
for (var i = 0, ipt = 0; ipt < 11; i++) {
var value = 0;
switch (matrixData.charAt (i)) {
case ' ':
ipt++;
continue;
case '+':
case '1':
value = 1;
break;
case '-':
value = -1;
break;
}
data[ipt] = value;
dataInv[ipt] = -value;
ipt++;
}
this.seitzMatrix.setA (data);
this.seitzMatrixInv.setA (dataInv);
}, $fz.isPrivate = true, $fz), "~S,~S");
c$.lookup = Clazz.defineMethod (c$, "lookup", 
function (code) {
for (var i = org.jmol.symmetry.HallRotation.hallRotationTerms.length; --i >= 0; ) if (org.jmol.symmetry.HallRotation.hallRotationTerms[i].rotCode.equals (code)) return org.jmol.symmetry.HallRotation.hallRotationTerms[i];

return null;
}, "~S");
c$.hallRotationTerms = c$.prototype.hallRotationTerms = [ new org.jmol.symmetry.HallRotation ("1_", "+00 0+0 00+"),  new org.jmol.symmetry.HallRotation ("2x", "+00 0-0 00-"),  new org.jmol.symmetry.HallRotation ("2y", "-00 0+0 00-"),  new org.jmol.symmetry.HallRotation ("2z", "-00 0-0 00+"),  new org.jmol.symmetry.HallRotation ("2\'", "0-0 -00 00-"),  new org.jmol.symmetry.HallRotation ("2\"", "0+0 +00 00-"),  new org.jmol.symmetry.HallRotation ("2x\'", "-00 00- 0-0"),  new org.jmol.symmetry.HallRotation ("2x\"", "-00 00+ 0+0"),  new org.jmol.symmetry.HallRotation ("2y\'", "00- 0-0 -00"),  new org.jmol.symmetry.HallRotation ("2y\"", "00+ 0-0 +00"),  new org.jmol.symmetry.HallRotation ("2z\'", "0-0 -00 00-"),  new org.jmol.symmetry.HallRotation ("2z\"", "0+0 +00 00-"),  new org.jmol.symmetry.HallRotation ("3x", "+00 00- 0+-"),  new org.jmol.symmetry.HallRotation ("3y", "-0+ 0+0 -00"),  new org.jmol.symmetry.HallRotation ("3z", "0-0 +-0 00+"),  new org.jmol.symmetry.HallRotation ("3*", "00+ +00 0+0"),  new org.jmol.symmetry.HallRotation ("4x", "+00 00- 0+0"),  new org.jmol.symmetry.HallRotation ("4y", "00+ 0+0 -00"),  new org.jmol.symmetry.HallRotation ("4z", "0-0 +00 00+"),  new org.jmol.symmetry.HallRotation ("6x", "+00 0+- 0+0"),  new org.jmol.symmetry.HallRotation ("6y", "00+ 0+0 -0+"),  new org.jmol.symmetry.HallRotation ("6z", "+-0 +00 00+")];
});
