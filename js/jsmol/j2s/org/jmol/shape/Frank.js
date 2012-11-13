﻿Clazz.declarePackage ("org.jmol.shape");
Clazz.load (["org.jmol.shape.FontShape"], "org.jmol.shape.Frank", ["org.jmol.i18n.GT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.frankString = "Jmol";
this.currentMetricsFont3d = null;
this.baseFont3d = null;
this.frankWidth = 0;
this.frankAscent = 0;
this.frankDescent = 0;
this.x = 0;
this.y = 0;
this.dx = 0;
this.dy = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.shape, "Frank", org.jmol.shape.FontShape);
Clazz.defineMethod (c$, "initShape", 
function () {
Clazz.superCall (this, org.jmol.shape.Frank, "initShape", []);
this.myType = "frank";
this.baseFont3d = this.font3d = this.gdata.getFont3DFSS ("SansSerif", "Plain", 16);
this.calcMetrics ();
});
Clazz.overrideMethod (c$, "wasClicked", 
function (x, y) {
var width = this.viewer.getScreenWidth ();
var height = this.viewer.getScreenHeight ();
return (width > 0 && height > 0 && x > width - this.frankWidth - 4 && y > height - this.frankAscent - 4);
}, "~N,~N");
Clazz.overrideMethod (c$, "checkObjectHovered", 
function (x, y, bsVisible) {
if (!this.viewer.getShowFrank () || !this.wasClicked (x, y) || !this.viewer.menuEnabled ()) return false;
if (this.gdata.isDisplayAntialiased ()) {
x <<= 1;
y <<= 1;
}this.viewer.hoverOnPt (x, y, org.jmol.i18n.GT._ ("Click for menu..."), null, null);
return true;
}, "~N,~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "calcMetrics", 
function () {
if (this.viewer.isJS2D || this.viewer.isJS3D) this.frankString = "JSmol";
 else if (this.viewer.isSignedApplet ()) this.frankString = "Jmol_S";
if (this.font3d === this.currentMetricsFont3d) return;
this.currentMetricsFont3d = this.font3d;
this.frankWidth = this.font3d.stringWidth (this.frankString);
this.frankDescent = this.font3d.getDescent ();
this.frankAscent = this.font3d.getAscent ();
});
Clazz.defineMethod (c$, "getFont", 
function (imageFontScaling) {
this.font3d = this.gdata.getFont3DScaled (this.baseFont3d, imageFontScaling);
this.calcMetrics ();
}, "~N");
Clazz.defineStatics (c$,
"defaultFontName", "SansSerif",
"defaultFontStyle", "Plain",
"defaultFontSize", 16,
"frankMargin", 4);
});
