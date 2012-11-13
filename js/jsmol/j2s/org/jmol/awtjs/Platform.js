Clazz.declarePackage ("org.jmol.awtjs");
Clazz.load (["org.jmol.api.ApiPlatform"], "org.jmol.awtjs.Platform", ["java.net.URL", "org.jmol.api.Interface", "org.jmol.awtjs.AjaxURLStreamHandlerFactory", "$.Display", "$.Font", "$.Image", "$.JmolFile", "$.JmolFileAdapter", "$.Mouse"], function () {
c$ = Clazz.decorateAsClass (function () {
this.fileAdapter = null;
Clazz.instantialize (this, arguments);
}, org.jmol.awtjs, "Platform", null, org.jmol.api.ApiPlatform);
Clazz.overrideMethod (c$, "setViewer", 
function (viewer, display) {
try {
java.net.URL.setURLStreamHandlerFactory ( new org.jmol.awtjs.AjaxURLStreamHandlerFactory ());
} catch (e) {
}
}, "org.jmol.api.JmolViewer,~O");
Clazz.overrideMethod (c$, "isSingleThreaded", 
function () {
return true;
});
Clazz.overrideMethod (c$, "convertPointFromScreen", 
function (display, ptTemp) {
org.jmol.awtjs.Display.convertPointFromScreen (display, ptTemp);
}, "~O,org.jmol.util.Point3f");
Clazz.overrideMethod (c$, "getFullScreenDimensions", 
function (display, widthHeight) {
org.jmol.awtjs.Display.getFullScreenDimensions (display, widthHeight);
}, "~O,~A");
Clazz.overrideMethod (c$, "getMenuPopup", 
function (viewer, menuStructure, type) {
var jmolpopup = org.jmol.api.Interface.getOptionInterface (type == 'j' ? "popup.JmolPopup" : "modelkit.ModelKitPopup");
if (jmolpopup != null) jmolpopup.initialize (viewer, menuStructure);
return jmolpopup;
}, "org.jmol.viewer.Viewer,~S,~S");
Clazz.overrideMethod (c$, "hasFocus", 
function (display) {
return org.jmol.awtjs.Display.hasFocus (display);
}, "~O");
Clazz.overrideMethod (c$, "prompt", 
function (label, data, list, asButtons) {
return org.jmol.awtjs.Display.prompt (label, data, list, asButtons);
}, "~S,~S,~A,~B");
Clazz.overrideMethod (c$, "renderScreenImage", 
function (viewer, g, size) {
org.jmol.awtjs.Display.renderScreenImage (viewer, g, size);
}, "org.jmol.api.JmolViewer,~O,~O");
Clazz.overrideMethod (c$, "requestFocusInWindow", 
function (display) {
org.jmol.awtjs.Display.requestFocusInWindow (display);
}, "~O");
Clazz.overrideMethod (c$, "repaint", 
function (display) {
org.jmol.awtjs.Display.repaint (display);
}, "~O");
Clazz.overrideMethod (c$, "setTransparentCursor", 
function (display) {
org.jmol.awtjs.Display.setTransparentCursor (display);
}, "~O");
Clazz.overrideMethod (c$, "setCursor", 
function (c, display) {
org.jmol.awtjs.Display.setCursor (c, display);
}, "~N,~O");
Clazz.overrideMethod (c$, "getMouseManager", 
function (viewer, actionManager) {
return  new org.jmol.awtjs.Mouse (viewer, actionManager);
}, "org.jmol.viewer.Viewer,org.jmol.viewer.ActionManager");
Clazz.overrideMethod (c$, "allocateRgbImage", 
function (windowWidth, windowHeight, pBuffer, windowSize, backgroundTransparent) {
return org.jmol.awtjs.Image.allocateRgbImage (windowWidth, windowHeight, pBuffer, windowSize, backgroundTransparent);
}, "~N,~N,~A,~N,~B");
Clazz.overrideMethod (c$, "createImage", 
function (data) {
return org.jmol.awtjs.Image.createImage (data);
}, "~O");
Clazz.overrideMethod (c$, "disposeGraphics", 
function (gOffscreen) {
org.jmol.awtjs.Image.disposeGraphics (gOffscreen);
}, "~O");
Clazz.overrideMethod (c$, "drawImage", 
function (g, img, x, y, width, height) {
org.jmol.awtjs.Image.drawImage (g, img, x, y, width, height);
}, "~O,~O,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "grabPixels", 
function (imageobj, width, height) {
return org.jmol.awtjs.Image.grabPixels (imageobj, width, height);
}, "~O,~N,~N");
Clazz.overrideMethod (c$, "drawImageToBuffer", 
function (gOffscreen, imageOffscreen, imageobj, width, height, bgcolor) {
return org.jmol.awtjs.Image.drawImageToBuffer (gOffscreen, imageOffscreen, imageobj, width, height, bgcolor);
}, "~O,~O,~O,~N,~N,~N");
Clazz.overrideMethod (c$, "getTextPixels", 
function (text, font3d, gObj, image, width, height, ascent) {
return org.jmol.awtjs.Image.getTextPixels (text, font3d, gObj, image, width, height, ascent);
}, "~S,org.jmol.util.JmolFont,~O,~O,~N,~N,~N");
Clazz.overrideMethod (c$, "flushImage", 
function (imagePixelBuffer) {
org.jmol.awtjs.Image.flush (imagePixelBuffer);
}, "~O");
Clazz.overrideMethod (c$, "getGraphics", 
function (image) {
return org.jmol.awtjs.Image.getGraphics (image);
}, "~O");
Clazz.overrideMethod (c$, "getImageHeight", 
function (image) {
return org.jmol.awtjs.Image.getHeight (image);
}, "~O");
Clazz.overrideMethod (c$, "getImageWidth", 
function (image) {
return org.jmol.awtjs.Image.getWidth (image);
}, "~O");
Clazz.overrideMethod (c$, "getJpgImage", 
function (viewer, quality, comment) {
return org.jmol.awtjs.Image.getJpgImage (this, viewer, quality, comment);
}, "org.jmol.viewer.Viewer,~N,~S");
Clazz.overrideMethod (c$, "getStaticGraphics", 
function (image, backgroundTransparent) {
return org.jmol.awtjs.Image.getStaticGraphics (image, backgroundTransparent);
}, "~O,~B");
Clazz.overrideMethod (c$, "newBufferedImage", 
function (image, w, h) {
return org.jmol.awtjs.Image.newBufferedImage (image, w, h);
}, "~O,~N,~N");
Clazz.overrideMethod (c$, "newOffScreenImage", 
function (w, h) {
return org.jmol.awtjs.Image.newBufferedImage (w, h);
}, "~N,~N");
Clazz.overrideMethod (c$, "waitForDisplay", 
function (display, image) {
org.jmol.awtjs.Image.waitForDisplay (display, image);
return true;
}, "~O,~O");
Clazz.overrideMethod (c$, "fontStringWidth", 
function (font, fontMetrics, text) {
return org.jmol.awtjs.Font.stringWidth (font, fontMetrics, text);
}, "org.jmol.util.JmolFont,~O,~S");
Clazz.overrideMethod (c$, "getFontAscent", 
function (fontMetrics) {
return org.jmol.awtjs.Font.getAscent (fontMetrics);
}, "~O");
Clazz.overrideMethod (c$, "getFontDescent", 
function (fontMetrics) {
return org.jmol.awtjs.Font.getDescent (fontMetrics);
}, "~O");
Clazz.overrideMethod (c$, "getFontMetrics", 
function (font, graphics) {
return org.jmol.awtjs.Font.getFontMetrics (graphics, font);
}, "org.jmol.util.JmolFont,~O");
Clazz.overrideMethod (c$, "newFont", 
function (fontFace, isBold, isItalic, fontSize) {
return org.jmol.awtjs.Font.newFont (fontFace, isBold, isItalic, fontSize);
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
return (this.fileAdapter == null ? this.fileAdapter =  new org.jmol.awtjs.JmolFileAdapter () : this.fileAdapter);
});
Clazz.overrideMethod (c$, "newFile", 
function (name) {
return  new org.jmol.awtjs.JmolFile (name);
}, "~S");
Clazz.overrideMethod (c$, "notifyEndOfRendering", 
function () {
});
});
