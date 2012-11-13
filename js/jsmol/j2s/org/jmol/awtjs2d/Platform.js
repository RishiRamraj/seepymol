﻿Clazz.declarePackage ("org.jmol.awtjs2d");
Clazz.load (["org.jmol.api.ApiPlatform"], "org.jmol.awtjs2d.Platform", ["java.net.URL", "org.jmol.awtjs2d.AjaxURLStreamHandlerFactory", "$.Display", "$.Font", "$.Image", "$.JmolFile", "$.JmolFileAdapter", "$.Mouse"], function () {
c$ = Clazz.decorateAsClass (function () {
this.canvas = null;
this.viewer = null;
this.context = null;
this.fileAdapter = null;
Clazz.instantialize (this, arguments);
}, org.jmol.awtjs2d, "Platform", null, org.jmol.api.ApiPlatform);
Clazz.overrideMethod (c$, "setViewer", 
function (viewer, canvas) {
{
this.viewer = viewer;
this.canvas = canvas;
this.context = canvas.getContext("2d");
canvas.imgdata = this.context.getImageData(0, 0, canvas.width, canvas.height);
canvas.buf8 = canvas.imgdata.data;
}try {
java.net.URL.setURLStreamHandlerFactory ( new org.jmol.awtjs2d.AjaxURLStreamHandlerFactory ());
} catch (e) {
}
}, "org.jmol.api.JmolViewer,~O");
Clazz.overrideMethod (c$, "isSingleThreaded", 
function () {
return true;
});
Clazz.overrideMethod (c$, "convertPointFromScreen", 
function (canvas, ptTemp) {
org.jmol.awtjs2d.Display.convertPointFromScreen (canvas, ptTemp);
}, "~O,org.jmol.util.Point3f");
Clazz.overrideMethod (c$, "getFullScreenDimensions", 
function (canvas, widthHeight) {
org.jmol.awtjs2d.Display.getFullScreenDimensions (canvas, widthHeight);
}, "~O,~A");
Clazz.overrideMethod (c$, "getMenuPopup", 
function (viewer, menuStructure, type) {
return null;
}, "org.jmol.viewer.Viewer,~S,~S");
Clazz.overrideMethod (c$, "hasFocus", 
function (canvas) {
return org.jmol.awtjs2d.Display.hasFocus (canvas);
}, "~O");
Clazz.overrideMethod (c$, "prompt", 
function (label, data, list, asButtons) {
return org.jmol.awtjs2d.Display.prompt (label, data, list, asButtons);
}, "~S,~S,~A,~B");
Clazz.overrideMethod (c$, "renderScreenImage", 
function (viewer, context, size) {
org.jmol.awtjs2d.Display.renderScreenImage (viewer, context, size);
}, "org.jmol.api.JmolViewer,~O,~O");
Clazz.overrideMethod (c$, "drawImage", 
function (context, canvas, x, y, width, height) {
org.jmol.awtjs2d.Image.drawImage (context, canvas, x, y, width, height);
}, "~O,~O,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "requestFocusInWindow", 
function (canvas) {
org.jmol.awtjs2d.Display.requestFocusInWindow (canvas);
}, "~O");
Clazz.overrideMethod (c$, "repaint", 
function (canvas) {
org.jmol.awtjs2d.Display.repaint (canvas);
}, "~O");
Clazz.overrideMethod (c$, "setTransparentCursor", 
function (canvas) {
org.jmol.awtjs2d.Display.setTransparentCursor (canvas);
}, "~O");
Clazz.overrideMethod (c$, "setCursor", 
function (c, canvas) {
org.jmol.awtjs2d.Display.setCursor (c, canvas);
}, "~N,~O");
Clazz.overrideMethod (c$, "getMouseManager", 
function (viewer, actionManager) {
return  new org.jmol.awtjs2d.Mouse (viewer, actionManager);
}, "org.jmol.viewer.Viewer,org.jmol.viewer.ActionManager");
Clazz.overrideMethod (c$, "allocateRgbImage", 
function (windowWidth, windowHeight, pBuffer, windowSize, backgroundTransparent) {
return org.jmol.awtjs2d.Image.allocateRgbImage (windowWidth, windowHeight, pBuffer, windowSize, backgroundTransparent, this.canvas);
}, "~N,~N,~A,~N,~B");
Clazz.overrideMethod (c$, "notifyEndOfRendering", 
function () {
});
Clazz.overrideMethod (c$, "createImage", 
function (data) {
return org.jmol.awtjs2d.Image.createImage (data);
}, "~O");
Clazz.overrideMethod (c$, "disposeGraphics", 
function (gOffscreen) {
org.jmol.awtjs2d.Image.disposeGraphics (gOffscreen);
}, "~O");
Clazz.overrideMethod (c$, "grabPixels", 
function (imageobj, width, height) {
return org.jmol.awtjs2d.Image.grabPixels (imageobj, width, height);
}, "~O,~N,~N");
Clazz.overrideMethod (c$, "drawImageToBuffer", 
function (gOffscreen, imageOffscreen, imageobj, width, height, bgcolor) {
return org.jmol.awtjs2d.Image.drawImageToBuffer (gOffscreen, imageOffscreen, imageobj, width, height, bgcolor);
}, "~O,~O,~O,~N,~N,~N");
Clazz.overrideMethod (c$, "getTextPixels", 
function (text, font3d, context, image, width, height, ascent) {
return org.jmol.awtjs2d.Image.getTextPixels (text, font3d, context, width, height, ascent);
}, "~S,org.jmol.util.JmolFont,~O,~O,~N,~N,~N");
Clazz.overrideMethod (c$, "flushImage", 
function (imagePixelBuffer) {
org.jmol.awtjs2d.Image.flush (imagePixelBuffer);
}, "~O");
Clazz.overrideMethod (c$, "getGraphics", 
function (image) {
return org.jmol.awtjs2d.Image.getGraphics (image);
}, "~O");
Clazz.overrideMethod (c$, "getImageHeight", 
function (image) {
return org.jmol.awtjs2d.Image.getHeight (image);
}, "~O");
Clazz.overrideMethod (c$, "getImageWidth", 
function (image) {
return org.jmol.awtjs2d.Image.getWidth (image);
}, "~O");
Clazz.overrideMethod (c$, "getJpgImage", 
function (viewer, quality, comment) {
return org.jmol.awtjs2d.Image.getJpgImage (this, viewer, quality, comment);
}, "org.jmol.viewer.Viewer,~N,~S");
Clazz.overrideMethod (c$, "getStaticGraphics", 
function (image, backgroundTransparent) {
return org.jmol.awtjs2d.Image.getStaticGraphics (image, backgroundTransparent);
}, "~O,~B");
Clazz.overrideMethod (c$, "newBufferedImage", 
function (image, w, h) {
{
if (typeof Jmol != "undefined" && Jmol._getHiddenCanvas)
return Jmol._getHiddenCanvas(this.viewer.applet, "stereoImage", w, h);
}return null;
}, "~O,~N,~N");
Clazz.overrideMethod (c$, "newOffScreenImage", 
function (w, h) {
{
if (typeof Jmol != "undefined" && Jmol._getHiddenCanvas)
return Jmol._getHiddenCanvas(this.viewer.applet, "textImage", w, h);
}return null;
}, "~N,~N");
Clazz.overrideMethod (c$, "waitForDisplay", 
function (canvas, image) {
org.jmol.awtjs2d.Image.waitForDisplay (canvas, image);
return true;
}, "~O,~O");
Clazz.overrideMethod (c$, "fontStringWidth", 
function (font, context, text) {
return org.jmol.awtjs2d.Font.stringWidth (font, context, text);
}, "org.jmol.util.JmolFont,~O,~S");
Clazz.overrideMethod (c$, "getFontAscent", 
function (context) {
return org.jmol.awtjs2d.Font.getAscent (context);
}, "~O");
Clazz.overrideMethod (c$, "getFontDescent", 
function (context) {
return org.jmol.awtjs2d.Font.getDescent (context);
}, "~O");
Clazz.overrideMethod (c$, "getFontMetrics", 
function (font, context) {
return org.jmol.awtjs2d.Font.getFontMetrics (font, context);
}, "org.jmol.util.JmolFont,~O");
Clazz.overrideMethod (c$, "newFont", 
function (fontFace, isBold, isItalic, fontSize) {
return org.jmol.awtjs2d.Font.newFont (fontFace, isBold, isItalic, fontSize, "px");
}, "~S,~B,~B,~N");
Clazz.overrideMethod (c$, "getJsObjectInfo", 
function (jsObject, method, args) {
return null;
}, "~O,~S,~A");
Clazz.overrideMethod (c$, "isHeadless", 
function () {
return false;
});
Clazz.overrideMethod (c$, "getFileAdapter", 
function () {
return (this.fileAdapter == null ? this.fileAdapter =  new org.jmol.awtjs2d.JmolFileAdapter () : this.fileAdapter);
});
Clazz.overrideMethod (c$, "newFile", 
function (name) {
return  new org.jmol.awtjs2d.JmolFile (name);
}, "~S");
});
