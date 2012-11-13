Clazz.declarePackage ("org.jmol.g3d");
Clazz.load (["org.jmol.util.Point3i"], "org.jmol.g3d.TextString", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.text = null;
this.font = null;
this.argb = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.g3d, "TextString", org.jmol.util.Point3i);
Clazz.defineMethod (c$, "setText", 
function (text, font, argb, x, y, z) {
this.text = text;
this.font = font;
this.argb = argb;
this.x = x;
this.y = y;
this.z = z;
}, "~S,org.jmol.util.JmolFont,~N,~N,~N,~N");
Clazz.defineMethod (c$, "toString", 
function () {
return Clazz.superCall (this, org.jmol.g3d.TextString, "toString", []) + " " + this.text;
});
});
