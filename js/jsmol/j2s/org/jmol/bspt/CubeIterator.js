﻿Clazz.declarePackage ("org.jmol.bspt");
c$ = Clazz.decorateAsClass (function () {
this.bspt = null;
this.stack = null;
this.sp = 0;
this.leafIndex = 0;
this.leaf = null;
this.radius = 0;
this.centerValues = null;
this.cx = 0;
this.cy = 0;
this.cz = 0;
this.dx = 0;
this.dy = 0;
this.dz = 0;
this.tHemisphere = false;
Clazz.instantialize (this, arguments);
}, org.jmol.bspt, "CubeIterator");
Clazz.makeConstructor (c$, 
function (bspt) {
this.centerValues =  Clazz.newFloatArray (bspt.dimMax, 0);
this.set (bspt);
}, "org.jmol.bspt.Bspt");
Clazz.defineMethod (c$, "set", 
function (bspt) {
this.bspt = bspt;
this.stack =  new Array (bspt.treeDepth);
}, "org.jmol.bspt.Bspt");
Clazz.defineMethod (c$, "initialize", 
function (center, radius, hemisphereOnly) {
this.radius = radius;
this.tHemisphere = false;
this.cx = this.centerValues[0] = center.x;
this.cy = this.centerValues[1] = center.y;
this.cz = this.centerValues[2] = center.z;
this.leaf = null;
this.stack[0] = this.bspt.eleRoot;
this.sp = 1;
this.findLeftLeaf ();
this.tHemisphere = hemisphereOnly;
}, "org.jmol.util.Point3f,~N,~B");
Clazz.defineMethod (c$, "release", 
function () {
this.set (this.bspt);
});
Clazz.defineMethod (c$, "hasMoreElements", 
function () {
while (this.leaf != null) {
for (; this.leafIndex < this.leaf.count; ++this.leafIndex) if (this.isWithinRadius (this.leaf.tuples[this.leafIndex])) return true;

this.findLeftLeaf ();
}
return false;
});
Clazz.defineMethod (c$, "nextElement", 
function () {
return this.leaf.tuples[this.leafIndex++];
});
Clazz.defineMethod (c$, "foundDistance2", 
function () {
return this.dx * this.dx + this.dy * this.dy + this.dz * this.dz;
});
Clazz.defineMethod (c$, "findLeftLeaf", 
($fz = function () {
this.leaf = null;
if (this.sp == 0) return;
var ele = this.stack[--this.sp];
while (Clazz.instanceOf (ele, org.jmol.bspt.Node)) {
var node = ele;
var centerValue = this.centerValues[node.dim];
var maxValue = centerValue + this.radius;
var minValue = centerValue;
if (!this.tHemisphere || node.dim != 0) minValue -= this.radius;
if (minValue <= node.maxLeft && maxValue >= node.minLeft) {
if (maxValue >= node.minRight && minValue <= node.maxRight) this.stack[this.sp++] = node.eleRight;
ele = node.eleLeft;
} else if (maxValue >= node.minRight && minValue <= node.maxRight) {
ele = node.eleRight;
} else {
if (this.sp == 0) return;
ele = this.stack[--this.sp];
}}
this.leaf = ele;
this.leafIndex = 0;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "isWithinRadius", 
($fz = function (t) {
this.dx = t.x - this.cx;
return (!this.tHemisphere || this.dx >= 0) && (this.dx = Math.abs (this.dx)) <= this.radius && (this.dy = Math.abs (t.y - this.cy)) <= this.radius && (this.dz = Math.abs (t.z - this.cz)) <= this.radius;
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f");
