﻿Clazz.declarePackage ("org.jmol.util");
Clazz.load (null, "org.jmol.util.Eigen", ["java.lang.Float", "java.util.Arrays", "org.jmol.util.Escape", "$.Logger", "$.Matrix3f", "$.Quadric", "$.Vector3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.n = 0;
this.d = null;
this.e = null;
this.V = null;
Clazz.instantialize (this, arguments);
}, org.jmol.util, "Eigen");
Clazz.makeConstructor (c$, 
function (n) {
this.n = n;
this.V =  Clazz.newDoubleArray (n, n, 0);
this.d =  Clazz.newDoubleArray (n, 0);
this.e =  Clazz.newDoubleArray (n, 0);
}, "~N");
c$.newM = Clazz.defineMethod (c$, "newM", 
function (m) {
var e =  new org.jmol.util.Eigen (m.length);
e.calc (m);
return e;
}, "~A");
c$.getUnitVectors = Clazz.defineMethod (c$, "getUnitVectors", 
function (m, unitVectors, lengths) {
org.jmol.util.Eigen.newM (m).set (unitVectors, lengths);
org.jmol.util.Eigen.sort (unitVectors, lengths);
}, "~A,~A,~A");
Clazz.defineMethod (c$, "set", 
($fz = function (unitVectors, lengths) {
var eigenVectors = this.getEigenvectorsFloatTransposed ();
var eigenValues = this.getRealEigenvalues ();
for (var i = 0; i < this.n; i++) {
if (unitVectors[i] == null) unitVectors[i] =  new org.jmol.util.Vector3f ();
unitVectors[i].setA (eigenVectors[i]);
lengths[i] = Math.sqrt (Math.abs (eigenValues[i]));
}
}, $fz.isPrivate = true, $fz), "~A,~A");
Clazz.defineMethod (c$, "calc", 
function (A) {
for (var i = 0; i < this.n; i++) {
for (var j = 0; j < this.n; j++) {
this.V[i][j] = A[i][j];
}
}
this.tred2 ();
this.tql2 ();
}, "~A");
Clazz.defineMethod (c$, "getRealEigenvalues", 
function () {
return this.d;
});
Clazz.defineMethod (c$, "getImagEigenvalues", 
function () {
return this.e;
});
Clazz.defineMethod (c$, "getEigenvalues", 
function () {
return this.d;
});
Clazz.defineMethod (c$, "getEigenvectorsFloatTransposed", 
function () {
var f =  Clazz.newFloatArray (this.n, this.n, 0);
for (var i = this.n; --i >= 0; ) for (var j = this.n; --j >= 0; ) f[j][i] = this.V[i][j];


return f;
});
Clazz.defineMethod (c$, "getEigenVectors3", 
function () {
var v =  new Array (3);
for (var i = 0; i < 3; i++) {
v[i] = org.jmol.util.Vector3f.new3 (this.V[0][i], this.V[1][i], this.V[2][i]);
}
return v;
});
Clazz.defineMethod (c$, "tred2", 
($fz = function () {
for (var j = 0; j < this.n; j++) {
this.d[j] = this.V[this.n - 1][j];
}
for (var i = this.n - 1; i > 0; i--) {
var scale = 0.0;
var h = 0.0;
for (var k = 0; k < i; k++) {
scale = scale + Math.abs (this.d[k]);
}
if (scale == 0.0) {
this.e[i] = this.d[i - 1];
for (var j = 0; j < i; j++) {
this.d[j] = this.V[i - 1][j];
this.V[i][j] = 0.0;
this.V[j][i] = 0.0;
}
} else {
for (var k = 0; k < i; k++) {
this.d[k] /= scale;
h += this.d[k] * this.d[k];
}
var f = this.d[i - 1];
var g = Math.sqrt (h);
if (f > 0) {
g = -g;
}this.e[i] = scale * g;
h = h - f * g;
this.d[i - 1] = f - g;
for (var j = 0; j < i; j++) {
this.e[j] = 0.0;
}
for (var j = 0; j < i; j++) {
f = this.d[j];
this.V[j][i] = f;
g = this.e[j] + this.V[j][j] * f;
for (var k = j + 1; k <= i - 1; k++) {
g += this.V[k][j] * this.d[k];
this.e[k] += this.V[k][j] * f;
}
this.e[j] = g;
}
f = 0.0;
for (var j = 0; j < i; j++) {
this.e[j] /= h;
f += this.e[j] * this.d[j];
}
var hh = f / (h + h);
for (var j = 0; j < i; j++) {
this.e[j] -= hh * this.d[j];
}
for (var j = 0; j < i; j++) {
f = this.d[j];
g = this.e[j];
for (var k = j; k <= i - 1; k++) {
this.V[k][j] -= (f * this.e[k] + g * this.d[k]);
}
this.d[j] = this.V[i - 1][j];
this.V[i][j] = 0.0;
}
}this.d[i] = h;
}
for (var i = 0; i < this.n - 1; i++) {
this.V[this.n - 1][i] = this.V[i][i];
this.V[i][i] = 1.0;
var h = this.d[i + 1];
if (h != 0.0) {
for (var k = 0; k <= i; k++) {
this.d[k] = this.V[k][i + 1] / h;
}
for (var j = 0; j <= i; j++) {
var g = 0.0;
for (var k = 0; k <= i; k++) {
g += this.V[k][i + 1] * this.V[k][j];
}
for (var k = 0; k <= i; k++) {
this.V[k][j] -= g * this.d[k];
}
}
}for (var k = 0; k <= i; k++) {
this.V[k][i + 1] = 0.0;
}
}
for (var j = 0; j < this.n; j++) {
this.d[j] = this.V[this.n - 1][j];
this.V[this.n - 1][j] = 0.0;
}
this.V[this.n - 1][this.n - 1] = 1.0;
this.e[0] = 0.0;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "tql2", 
($fz = function () {
for (var i = 1; i < this.n; i++) {
this.e[i - 1] = this.e[i];
}
this.e[this.n - 1] = 0.0;
var f = 0.0;
var tst1 = 0.0;
var eps = Math.pow (2.0, -52.0);
for (var l = 0; l < this.n; l++) {
tst1 = Math.max (tst1, Math.abs (this.d[l]) + Math.abs (this.e[l]));
var m = l;
while (m < this.n) {
if (Math.abs (this.e[m]) <= eps * tst1) {
break;
}m++;
}
if (m > l) {
var iter = 0;
do {
iter = iter + 1;
var g = this.d[l];
var p = (this.d[l + 1] - g) / (2.0 * this.e[l]);
var r = org.jmol.util.Eigen.hypot (p, 1.0);
if (p < 0) {
r = -r;
}this.d[l] = this.e[l] / (p + r);
this.d[l + 1] = this.e[l] * (p + r);
var dl1 = this.d[l + 1];
var h = g - this.d[l];
for (var i = l + 2; i < this.n; i++) {
this.d[i] -= h;
}
f = f + h;
p = this.d[m];
var c = 1.0;
var c2 = c;
var c3 = c;
var el1 = this.e[l + 1];
var s = 0.0;
var s2 = 0.0;
for (var i = m - 1; i >= l; i--) {
c3 = c2;
c2 = c;
s2 = s;
g = c * this.e[i];
h = c * p;
r = org.jmol.util.Eigen.hypot (p, this.e[i]);
this.e[i + 1] = s * r;
s = this.e[i] / r;
c = p / r;
p = c * this.d[i] - s * g;
this.d[i + 1] = h + s * (c * g + s * this.d[i]);
for (var k = 0; k < this.n; k++) {
h = this.V[k][i + 1];
this.V[k][i + 1] = s * this.V[k][i] + c * h;
this.V[k][i] = c * this.V[k][i] - s * h;
}
}
p = -s * s2 * c3 * el1 * this.e[l] / dl1;
this.e[l] = s * p;
this.d[l] = c * p;
} while (Math.abs (this.e[l]) > eps * tst1);
}this.d[l] = this.d[l] + f;
this.e[l] = 0.0;
}
for (var i = 0; i < this.n - 1; i++) {
var k = i;
var p = this.d[i];
for (var j = i + 1; j < this.n; j++) {
if (this.d[j] < p) {
k = j;
p = this.d[j];
}}
if (k != i) {
this.d[k] = this.d[i];
this.d[i] = p;
for (var j = 0; j < this.n; j++) {
p = this.V[j][i];
this.V[j][i] = this.V[j][k];
this.V[j][k] = p;
}
}}
}, $fz.isPrivate = true, $fz));
c$.hypot = Clazz.defineMethod (c$, "hypot", 
($fz = function (a, b) {
var r;
if (Math.abs (a) > Math.abs (b)) {
r = b / a;
r = Math.abs (a) * Math.sqrt (1 + r * r);
} else if (b != 0) {
r = a / b;
r = Math.abs (b) * Math.sqrt (1 + r * r);
} else {
r = 0.0;
}return r;
}, $fz.isPrivate = true, $fz), "~N,~N");
c$.getEllipsoidDD = Clazz.defineMethod (c$, "getEllipsoidDD", 
function (a) {
var eigen =  new org.jmol.util.Eigen (3);
eigen.calc (a);
var m =  new org.jmol.util.Matrix3f ();
var mm =  Clazz.newFloatArray (9, 0);
for (var i = 0, p = 0; i < 3; i++) for (var j = 0; j < 3; j++) mm[p++] = a[i][j];


m.setA (mm);
var evec = eigen.getEigenVectors3 ();
var n =  new org.jmol.util.Vector3f ();
var cross =  new org.jmol.util.Vector3f ();
for (var i = 0; i < 3; i++) {
n.setT (evec[i]);
m.transform (n);
cross.cross (n, evec[i]);
org.jmol.util.Logger.info ("v[i], n, n x v[i]" + evec[i] + " " + n + " " + cross);
n.setT (evec[i]);
n.normalize ();
cross.cross (evec[i], evec[(i + 1) % 3]);
org.jmol.util.Logger.info ("draw id eigv" + i + " " + org.jmol.util.Escape.escapePt (evec[i]) + " color " + (i == 0 ? "red" : i == 1 ? "green" : "blue") + " # " + n + " " + cross);
}
org.jmol.util.Logger.info ("eigVl (" + eigen.d[0] + " + " + eigen.e[0] + "I) (" + eigen.d[1] + " + " + eigen.e[1] + "I) (" + eigen.d[2] + " + " + eigen.e[2] + "I)");
var unitVectors =  new Array (3);
var lengths =  Clazz.newFloatArray (3, 0);
eigen.set (unitVectors, lengths);
org.jmol.util.Eigen.sort (unitVectors, lengths);
return  new org.jmol.util.Quadric (unitVectors, lengths, false);
}, "~A");
c$.getEllipsoid = Clazz.defineMethod (c$, "getEllipsoid", 
function (vectors, lengths, isThermal) {
var unitVectors =  new Array (vectors.length);
for (var i = vectors.length; --i >= 0; ) unitVectors[i] = org.jmol.util.Vector3f.newV (vectors[i]);

org.jmol.util.Eigen.sort (unitVectors, lengths);
return  new org.jmol.util.Quadric (unitVectors, lengths, isThermal);
}, "~A,~A,~B");
c$.sort = Clazz.defineMethod (c$, "sort", 
($fz = function (vectors, lengths) {
var o = [[vectors[0], Float.$valueOf (Math.abs (lengths[0]))], [vectors[1], Float.$valueOf (Math.abs (lengths[1]))], [vectors[2], Float.$valueOf (Math.abs (lengths[2]))]];
java.util.Arrays.sort (o,  new org.jmol.util.Eigen.EigenSort ());
for (var i = 0; i < 3; i++) {
vectors[i] = org.jmol.util.Vector3f.newV (o[i][0]);
vectors[i].normalize ();
lengths[i] = (o[i][1]).floatValue ();
}
}, $fz.isPrivate = true, $fz), "~A,~A");
Clazz.pu$h ();
c$ = Clazz.declareType (org.jmol.util.Eigen, "EigenSort", null, java.util.Comparator);
Clazz.overrideMethod (c$, "compare", 
function (a, b) {
var c = (a[1]).floatValue ();
var d = (b[1]).floatValue ();
return (c < d ? -1 : c > d ? 1 : 0);
}, "~A,~A");
c$ = Clazz.p0p ();
});
