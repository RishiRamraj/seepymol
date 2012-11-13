﻿Clazz.declarePackage ("org.jmol.g3d");
Clazz.load (["java.util.Hashtable"], "org.jmol.g3d.TextRenderer", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.height = 0;
this.ascent = 0;
this.width = 0;
this.mapWidth = 0;
this.size = 0;
this.tmap = null;
this.isInvalid = false;
Clazz.instantialize (this, arguments);
}, org.jmol.g3d, "TextRenderer");
c$.clearFontCache = Clazz.defineMethod (c$, "clearFontCache", 
function () {
if (org.jmol.g3d.TextRenderer.working) return;
org.jmol.g3d.TextRenderer.htFont3d.clear ();
org.jmol.g3d.TextRenderer.htFont3dAntialias.clear ();
});
c$.plot = Clazz.defineMethod (c$, "plot", 
function (x, y, z, argb, text, font3d, g3d, jmolRenderer, antialias) {
if (text.length == 0) return 0;
if (text.indexOf ("<su") >= 0) return org.jmol.g3d.TextRenderer.plotByCharacter (x, y, z, argb, text, font3d, g3d, jmolRenderer, antialias);
var offset = font3d.getAscent ();
y -= offset;
var text3d = org.jmol.g3d.TextRenderer.getPlotText3D (x, y, g3d, text, font3d, antialias);
if (text3d.isInvalid) return text3d.width;
if (antialias && (argb & 0xC0C0C0) == 0) {
argb = argb | 0x040404;
}if (jmolRenderer != null || (x < 0 || x + text3d.width > g3d.width || y < 0 || y + text3d.height > g3d.height)) org.jmol.g3d.TextRenderer.plotClipped (x, y, z, argb, g3d, jmolRenderer, text3d.mapWidth, text3d.height, text3d.tmap);
 else org.jmol.g3d.TextRenderer.plotUnclipped (x, y, z, argb, g3d, text3d.mapWidth, text3d.height, text3d.tmap);
return text3d.width;
}, "~N,~N,~N,~N,~S,org.jmol.util.JmolFont,org.jmol.g3d.Graphics3D,org.jmol.api.JmolRendererInterface,~B");
c$.plotByCharacter = Clazz.defineMethod (c$, "plotByCharacter", 
($fz = function (x, y, z, argb, text, font3d, g3d, jmolRenderer, antialias) {
var w = 0;
var len = text.length;
var suboffset = Math.round (font3d.getHeight () * 0.25);
var supoffset = -Math.round (font3d.getHeight () * 0.3);
for (var i = 0; i < len; i++) {
if (text.charAt (i) == '<') {
if (i + 4 < len && text.substring (i, i + 5).equals ("<sub>")) {
i += 4;
y += suboffset;
continue;
}if (i + 4 < len && text.substring (i, i + 5).equals ("<sup>")) {
i += 4;
y += supoffset;
continue;
}if (i + 5 < len && text.substring (i, i + 6).equals ("</sub>")) {
i += 5;
y -= suboffset;
continue;
}if (i + 5 < len && text.substring (i, i + 6).equals ("</sup>")) {
i += 5;
y -= supoffset;
continue;
}}var width = org.jmol.g3d.TextRenderer.plot (x + w, y, z, argb, text.substring (i, i + 1), font3d, g3d, jmolRenderer, antialias);
w += width;
}
return w;
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,~S,org.jmol.util.JmolFont,org.jmol.g3d.Graphics3D,org.jmol.api.JmolRendererInterface,~B");
c$.plotUnclipped = Clazz.defineMethod (c$, "plotUnclipped", 
($fz = function (x, y, z, argb, g3d, textWidth, textHeight, tmap) {
var offset = 0;
var zbuf = g3d.zbuf;
var renderWidth = g3d.width;
var pbufOffset = y * renderWidth + x;
for (var i = 0; i < textHeight; i++) {
for (var j = 0; j < textWidth; j++) {
var shade = tmap[offset++];
if (shade != 0 && z < zbuf[pbufOffset]) g3d.shadeTextPixel (pbufOffset, z, argb, shade);
pbufOffset++;
}
pbufOffset += (renderWidth - textWidth);
}
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,org.jmol.g3d.Graphics3D,~N,~N,~A");
c$.plotClipped = Clazz.defineMethod (c$, "plotClipped", 
($fz = function (x, y, z, argb, g3d, jmolRenderer, textWidth, textHeight, tmap) {
if (jmolRenderer == null) jmolRenderer = g3d;
var offset = 0;
for (var i = 0; i < textHeight; i++) {
for (var j = 0; j < textWidth; j++) {
var shade = tmap[offset++];
if (shade != 0) jmolRenderer.plotImagePixel (argb, x + j, y + i, z, shade);
}
}
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,org.jmol.g3d.Graphics3D,org.jmol.api.JmolRendererInterface,~N,~N,~A");
Clazz.makeConstructor (c$, 
($fz = function (text, font3d) {
this.ascent = font3d.getAscent ();
this.height = font3d.getHeight ();
this.width = font3d.stringWidth (text);
if (this.width == 0) return;
this.mapWidth = this.width;
this.size = this.mapWidth * this.height;
}, $fz.isPrivate = true, $fz), "~S,org.jmol.util.JmolFont");
c$.getPlotText3D = Clazz.defineMethod (c$, "getPlotText3D", 
($fz = function (x, y, g3d, text, font3d, antialias) {
($t$ = org.jmol.g3d.TextRenderer.working = true, org.jmol.g3d.TextRenderer.prototype.working = org.jmol.g3d.TextRenderer.working, $t$);
var ht = (antialias ? org.jmol.g3d.TextRenderer.htFont3dAntialias : org.jmol.g3d.TextRenderer.htFont3d);
var htForThisFont = ht.get (font3d);
var text3d = null;
var newFont = false;
var newText = false;
if (htForThisFont != null) {
text3d = htForThisFont.get (text);
} else {
htForThisFont =  new java.util.Hashtable ();
newFont = true;
}if (text3d == null) {
text3d =  new org.jmol.g3d.TextRenderer (text, font3d);
newText = true;
}text3d.isInvalid = (text3d.width == 0 || x + text3d.width <= 0 || x >= g3d.width || y + text3d.height <= 0 || y >= g3d.height);
if (text3d.isInvalid) return text3d;
if (newFont) ht.put (font3d, htForThisFont);
if (newText) {
text3d.setTranslucency (text, font3d, g3d);
htForThisFont.put (text, text3d);
}($t$ = org.jmol.g3d.TextRenderer.working = false, org.jmol.g3d.TextRenderer.prototype.working = org.jmol.g3d.TextRenderer.working, $t$);
return text3d;
}, $fz.isPrivate = true, $fz), "~N,~N,org.jmol.g3d.Graphics3D,~S,org.jmol.util.JmolFont,~B");
Clazz.defineMethod (c$, "setTranslucency", 
($fz = function (text, font3d, g3d) {
var pixels = g3d.apiPlatform.getTextPixels (text, font3d, g3d.platform.getGraphicsForTextOrImage (this.mapWidth, this.height), g3d.platform.offscreenImage, this.mapWidth, this.height, this.ascent);
if (pixels == null) return;
this.tmap =  Clazz.newByteArray (this.size, 0);
for (var i = pixels.length; --i >= 0; ) {
var p = pixels[i] & 0xFF;
if (p != 0) {
this.tmap[i] = org.jmol.g3d.TextRenderer.translucency[p >> 5];
}}
}, $fz.isPrivate = true, $fz), "~S,org.jmol.util.JmolFont,org.jmol.g3d.Graphics3D");
Clazz.defineStatics (c$,
"translucency", [7, 6, 5, 4, 3, 2, 1, 8],
"working", false);
c$.htFont3d = c$.prototype.htFont3d =  new java.util.Hashtable ();
c$.htFont3dAntialias = c$.prototype.htFont3dAntialias =  new java.util.Hashtable ();
});
