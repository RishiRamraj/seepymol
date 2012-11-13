﻿Clazz.declarePackage ("org.jmol.shape");
Clazz.load (["org.jmol.shape.Object2d"], "org.jmol.shape.Text", ["org.jmol.shape.Shape", "org.jmol.util.Colix", "$.Escape", "$.JmolFont", "$.StringXBuilder", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.fontScale = 0;
this.text = null;
this.textUnformatted = null;
this.doFormatText = false;
this.lines = null;
this.font = null;
this.fid = 0;
this.ascent = 0;
this.descent = 0;
this.lineHeight = 0;
this.textWidth = 0;
this.textHeight = 0;
this.widths = null;
this.image = null;
this.imageScale = 1;
Clazz.instantialize (this, arguments);
}, org.jmol.shape, "Text", org.jmol.shape.Object2d);
Clazz.defineMethod (c$, "setScalePixelsPerMicron", 
function (scalePixelsPerMicron) {
this.fontScale = 0;
Clazz.superCall (this, org.jmol.shape.Text, "setScalePixelsPerMicron", [scalePixelsPerMicron]);
}, "~N");
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.shape.Text, []);
});
c$.newLabel = Clazz.defineMethod (c$, "newLabel", 
function (gdata, font, text, colix, bgcolix, x, y, z, zSlab, align, scalePixelsPerMicron) {
var t =  new org.jmol.shape.Text ();
t.set (gdata, font, colix, align, true, scalePixelsPerMicron);
t.setText (text);
t.bgcolix = bgcolix;
t.setXYZs (x, y, z, zSlab);
return t;
}, "org.jmol.util.GData,org.jmol.util.JmolFont,~S,~N,~N,~N,~N,~N,~N,~N,~N");
c$.newEcho = Clazz.defineMethod (c$, "newEcho", 
function (viewer, gdata, font, target, colix, valign, align, scalePixelsPerMicron) {
var t =  new org.jmol.shape.Text ();
t.set (gdata, font, colix, align, false, scalePixelsPerMicron);
t.viewer = viewer;
t.target = target;
if (target.equals ("error")) valign = 1;
t.valign = valign;
t.z = 2;
t.zSlab = -2147483648;
return t;
}, "org.jmol.viewer.Viewer,org.jmol.util.GData,org.jmol.util.JmolFont,~S,~N,~N,~N,~N");
Clazz.defineMethod (c$, "set", 
($fz = function (gdata, font, colix, align, isLabelOrHover, scalePixelsPerMicron) {
this.scalePixelsPerMicron = scalePixelsPerMicron;
this.gdata = gdata;
this.isLabelOrHover = isLabelOrHover;
this.colix = colix;
this.align = align;
this.setFont (font, isLabelOrHover);
}, $fz.isPrivate = true, $fz), "org.jmol.util.GData,org.jmol.util.JmolFont,~N,~N,~B,~N");
Clazz.defineMethod (c$, "getFontMetrics", 
($fz = function () {
this.descent = this.font.getDescent ();
this.ascent = this.font.getAscent ();
this.lineHeight = this.ascent + this.descent;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setFontFromFid", 
function (fid) {
if (this.fid == fid) return;
this.fontScale = 0;
this.setFont (org.jmol.util.JmolFont.getFont3D (fid), true);
}, "~N");
Clazz.defineMethod (c$, "setText", 
function (text) {
if (this.image != null) this.getFontMetrics ();
this.image = null;
text = this.fixText (text);
if (this.text != null && this.text.equals (text)) return;
this.text = text;
this.textUnformatted = text;
this.doFormatText = (this.viewer != null && text != null && (text.indexOf ("%{") >= 0 || text.indexOf ("@{") >= 0));
if (!this.doFormatText) this.recalc ();
}, "~S");
Clazz.defineMethod (c$, "setImage", 
function (image) {
this.image = image;
this.recalc ();
}, "~O");
Clazz.defineMethod (c$, "setScale", 
function (scale) {
this.imageScale = scale;
this.recalc ();
}, "~N");
Clazz.defineMethod (c$, "setFont", 
function (f3d, doAll) {
this.font = f3d;
if (this.font == null) return;
this.getFontMetrics ();
if (!doAll) return;
this.fid = this.font.fid;
this.recalc ();
}, "org.jmol.util.JmolFont,~B");
Clazz.defineMethod (c$, "setFontScale", 
function (scale) {
if (this.fontScale == scale) return;
this.fontScale = scale;
if (this.fontScale != 0) this.setFont (this.gdata.getFont3DScaled (this.font, scale), true);
}, "~N");
Clazz.defineMethod (c$, "fixText", 
function (text) {
if (text == null || text.length == 0) return null;
var pt;
while ((pt = text.indexOf ("\n")) >= 0) text = text.substring (0, pt) + "|" + text.substring (pt + 1);

return text;
}, "~S");
Clazz.overrideMethod (c$, "recalc", 
function () {
if (this.image != null) {
this.textWidth = this.textHeight = 0;
this.boxWidth = this.viewer.apiPlatform.getImageWidth (this.image) * this.fontScale * this.imageScale;
this.boxHeight = this.viewer.apiPlatform.getImageHeight (this.image) * this.fontScale * this.imageScale;
this.ascent = 0;
return;
}if (this.text == null) {
this.text = null;
this.lines = null;
this.widths = null;
return;
}if (this.font == null) return;
this.lines = org.jmol.util.TextFormat.split (this.text, '|');
this.textWidth = 0;
this.widths =  Clazz.newIntArray (this.lines.length, 0);
for (var i = this.lines.length; --i >= 0; ) this.textWidth = Math.max (this.textWidth, this.widths[i] = this.stringWidth (this.lines[i]));

this.textHeight = this.lines.length * this.lineHeight;
this.boxWidth = this.textWidth + (this.fontScale >= 2 ? 16 : 8);
this.boxHeight = this.textHeight + (this.fontScale >= 2 ? 16 : 8);
});
Clazz.defineMethod (c$, "formatText", 
function () {
this.text = (this.viewer == null ? this.textUnformatted : this.viewer.formatText (this.textUnformatted));
this.recalc ();
});
Clazz.defineMethod (c$, "setPosition", 
function (width, height, scalePixelsPerMicron, imageFontScaling, isExact, boxXY) {
if (boxXY == null) boxXY = this.boxXY;
 else this.boxXY = boxXY;
this.setWindow (width, height, scalePixelsPerMicron);
if (scalePixelsPerMicron != 0 && this.scalePixelsPerMicron != 0) this.setFontScale (scalePixelsPerMicron / this.scalePixelsPerMicron);
 else if (this.fontScale != imageFontScaling) this.setFontScale (imageFontScaling);
if (this.doFormatText) this.formatText ();
if (this.isLabelOrHover) {
boxXY[0] = this.movableX;
boxXY[1] = this.movableY;
org.jmol.shape.Text.setBoxXY (this.boxWidth, this.boxHeight, this.offsetX * imageFontScaling, this.offsetY * imageFontScaling, boxXY, isExact);
} else {
this.setPos (this.fontScale);
}this.boxX = boxXY[0];
this.boxY = boxXY[1];
if (this.adjustForWindow) this.setBoxOffsetsInWindow (0, this.isLabelOrHover ? 16 * this.fontScale + this.lineHeight : 0, this.boxY - this.textHeight);
}, "~N,~N,~N,~N,~B,~A");
Clazz.defineMethod (c$, "setPos", 
($fz = function (scale) {
var xLeft;
var xCenter;
var xRight;
var is3dEcho = (this.xyz != null);
if (this.valign == 0 || this.valign == 4) {
var x = (this.movableXPercent != 2147483647 ? Clazz.doubleToInt (this.movableXPercent * this.windowWidth / 100) : is3dEcho ? this.movableX : this.movableX * scale);
var offsetX = this.offsetX * scale;
xLeft = xRight = xCenter = x + offsetX;
} else {
xLeft = 5 * scale;
xCenter = Clazz.doubleToInt (this.windowWidth / 2);
xRight = this.windowWidth - xLeft;
}this.boxXY[0] = xLeft;
switch (this.align) {
case 2:
this.boxXY[0] = xCenter - this.boxWidth / 2;
break;
case 3:
this.boxXY[0] = xRight - this.boxWidth;
}
this.boxXY[1] = 0;
switch (this.valign) {
case 1:
break;
case 3:
this.boxXY[1] = Clazz.doubleToInt (this.windowHeight / 2);
break;
case 2:
this.boxXY[1] = this.windowHeight;
break;
default:
var y = (this.movableYPercent != 2147483647 ? Clazz.doubleToInt (this.movableYPercent * this.windowHeight / 100) : is3dEcho ? this.movableY : this.movableY * scale);
this.boxXY[1] = (is3dEcho ? y : (this.windowHeight - y)) + this.offsetY * scale;
}
if (this.align == 2) this.boxXY[1] -= (this.image != null ? this.boxHeight : this.xyz != null ? this.boxHeight : this.ascent - this.boxHeight) / 2;
 else if (this.image != null) this.boxXY[1] -= 0;
 else if (this.xyz != null) this.boxXY[1] -= Clazz.doubleToInt (this.ascent / 2);
}, $fz.isPrivate = true, $fz), "~N");
c$.setBoxXY = Clazz.defineMethod (c$, "setBoxXY", 
function (boxWidth, boxHeight, xOffset, yOffset, boxXY, isExact) {
var xBoxOffset;
var yBoxOffset;
if (xOffset > 0 || isExact) {
xBoxOffset = xOffset;
} else {
xBoxOffset = -boxWidth;
if (xOffset == 0) xBoxOffset /= 2;
 else xBoxOffset += xOffset;
}if (isExact) {
yBoxOffset = -boxHeight + yOffset;
} else if (yOffset < 0) {
yBoxOffset = -boxHeight + yOffset;
} else if (yOffset == 0) {
yBoxOffset = -boxHeight / 2;
} else {
yBoxOffset = yOffset;
}boxXY[0] += xBoxOffset;
boxXY[1] += yBoxOffset;
boxXY[2] = boxWidth;
boxXY[3] = boxHeight;
}, "~N,~N,~N,~N,~A,~B");
Clazz.defineMethod (c$, "getState", 
function () {
var s =  new org.jmol.util.StringXBuilder ();
if (this.text == null || this.isLabelOrHover || this.target.equals ("error")) return "";
var isImage = (this.image != null);
var strOff = null;
var echoCmd = "set echo ID " + org.jmol.util.Escape.escapeStr (this.target);
switch (this.valign) {
case 0:
if (this.movableXPercent == 2147483647 || this.movableYPercent == 2147483647) {
strOff = (this.movableXPercent == 2147483647 ? this.movableX + " " : this.movableXPercent + "% ") + (this.movableYPercent == 2147483647 ? this.movableY + "" : this.movableYPercent + "%");
} else {
strOff = "[" + this.movableXPercent + " " + this.movableYPercent + "%]";
}case 4:
if (strOff == null) strOff = org.jmol.util.Escape.escapePt (this.xyz);
s.append ("  ").append (echoCmd).append (" ").append (strOff);
if (this.align != 1) s.append (";  ").append (echoCmd).append (" ").append (org.jmol.shape.Object2d.hAlignNames[this.align]);
break;
default:
s.append ("  set echo ").append (org.jmol.shape.Object2d.vAlignNames[this.valign]).append (" ").append (org.jmol.shape.Object2d.hAlignNames[this.align]);
}
if (this.valign == 0 && this.movableZPercent != 2147483647) s.append (";  ").append (echoCmd).append (" depth ").appendI (this.movableZPercent);
if (isImage) s.append ("; ").append (echoCmd).append (" IMAGE /*file*/");
 else s.append ("; echo ");
s.append (org.jmol.util.Escape.escapeStr (this.text));
s.append (";\n");
if (isImage && this.imageScale != 1) s.append ("  ").append (echoCmd).append (" scale ").appendF (this.imageScale).append (";\n");
if (this.script != null) s.append ("  ").append (echoCmd).append (" script ").append (org.jmol.util.Escape.escapeStr (this.script)).append (";\n");
if (this.modelIndex >= 0) s.append ("  ").append (echoCmd).append (" model ").append (this.viewer.getModelNumberDotted (this.modelIndex)).append (";\n");
s.append ("  " + org.jmol.shape.Shape.getFontCommand ("echo", this.font));
if (this.scalePixelsPerMicron > 0) s.append (" " + (10000 / this.scalePixelsPerMicron));
s.append ("; color echo");
if (org.jmol.util.Colix.isColixTranslucent (this.colix)) s.append (" translucent " + org.jmol.util.Colix.getColixTranslucencyFractional (this.colix));
s.append (" ").append (org.jmol.util.Colix.getHexCode (this.colix));
if (this.bgcolix != 0) {
s.append ("; color echo background");
if (org.jmol.util.Colix.isColixTranslucent (this.bgcolix)) s.append (" translucent " + org.jmol.util.Colix.getColixTranslucencyFractional (this.bgcolix));
s.append (" ").append (org.jmol.util.Colix.getHexCode (this.bgcolix));
}s.append (";\n");
return s.toString ();
});
Clazz.defineMethod (c$, "stringWidth", 
($fz = function (str) {
var w = 0;
var f = 1;
var subscale = 1;
if (str == null) return 0;
if (str.indexOf ("<su") < 0) return this.font.stringWidth (str);
var len = str.length;
var s;
for (var i = 0; i < len; i++) {
if (str.charAt (i) == '<') {
if (i + 4 < len && ((s = str.substring (i, i + 5)).equals ("<sub>") || s.equals ("<sup>"))) {
i += 4;
f = subscale;
continue;
}if (i + 5 < len && ((s = str.substring (i, i + 6)).equals ("</sub>") || s.equals ("</sup>"))) {
i += 5;
f = 1;
continue;
}}w += this.font.stringWidth (str.substring (i, i + 1)) * f;
}
return w;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "setXYA", 
function (xy, i) {
if (i == 0) {
var adj = (this.fontScale >= 2 ? 8 : 4);
xy[2] = this.boxX;
switch (this.align) {
case 2:
xy[2] += this.boxWidth / 2;
break;
case 3:
xy[2] += this.boxWidth - adj;
break;
default:
xy[2] += adj;
}
xy[0] = xy[2];
xy[1] = this.boxY + this.ascent - this.lineHeight + adj;
}switch (this.align) {
case 2:
xy[0] = xy[2] - Clazz.doubleToInt (this.widths[i] / 2);
break;
case 3:
xy[0] = xy[2] - this.widths[i];
}
xy[1] += this.lineHeight;
}, "~A,~N");
});
