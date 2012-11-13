﻿Clazz.declarePackage ("org.jmol.awtjs2d");
c$ = Clazz.declareType (org.jmol.awtjs2d, "Display");
c$.getFullScreenDimensions = Clazz.defineMethod (c$, "getFullScreenDimensions", 
function (canvas, widthHeight) {
{
widthHeight[0] = canvas.width;
widthHeight[1] = canvas.height;
}}, "~O,~A");
c$.hasFocus = Clazz.defineMethod (c$, "hasFocus", 
function (canvas) {
{
}return true;
}, "~O");
c$.requestFocusInWindow = Clazz.defineMethod (c$, "requestFocusInWindow", 
function (canvas) {
{
}}, "~O");
c$.repaint = Clazz.defineMethod (c$, "repaint", 
function (canvas) {
}, "~O");
c$.renderScreenImage = Clazz.defineMethod (c$, "renderScreenImage", 
function (viewer, g, size) {
{
}}, "org.jmol.api.JmolViewer,~O,~O");
c$.setTransparentCursor = Clazz.defineMethod (c$, "setTransparentCursor", 
function (canvas) {
{
}}, "~O");
c$.setCursor = Clazz.defineMethod (c$, "setCursor", 
function (c, canvas) {
{
}}, "~N,~O");
c$.prompt = Clazz.defineMethod (c$, "prompt", 
function (label, data, list, asButtons) {
return "null";
}, "~S,~S,~A,~B");
c$.convertPointFromScreen = Clazz.defineMethod (c$, "convertPointFromScreen", 
function (canvas, ptTemp) {
{
}}, "~O,org.jmol.util.Point3f");
