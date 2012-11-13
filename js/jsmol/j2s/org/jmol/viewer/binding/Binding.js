﻿Clazz.declarePackage ("org.jmol.viewer.binding");
Clazz.load (["java.util.Hashtable"], "org.jmol.viewer.binding.Binding", ["java.lang.Boolean", "java.util.ArrayList", "$.Arrays", "org.jmol.util.Escape", "$.Logger", "$.StringXBuilder"], function () {
c$ = Clazz.decorateAsClass (function () {
this.name = null;
this.bindings = null;
Clazz.instantialize (this, arguments);
}, org.jmol.viewer.binding, "Binding");
Clazz.prepareFields (c$, function () {
this.bindings =  new java.util.Hashtable ();
});
Clazz.defineMethod (c$, "getBindings", 
function () {
return this.bindings;
});
Clazz.makeConstructor (c$, 
function (name) {
this.name = name;
}, "~S");
Clazz.defineMethod (c$, "getName", 
function () {
return this.name;
});
Clazz.defineMethod (c$, "bind", 
function (mouseAction, jmolAction) {
this.addBinding (mouseAction + "\t" + jmolAction, [mouseAction, jmolAction]);
}, "~N,~N");
Clazz.defineMethod (c$, "bind", 
function (mouseAction, name) {
this.addBinding (mouseAction + "\t", Boolean.TRUE);
this.addBinding (mouseAction + "\t" + name, [org.jmol.viewer.binding.Binding.getMouseActionName (mouseAction, false), name]);
}, "~N,~S");
Clazz.defineMethod (c$, "unbind", 
function (mouseAction, jmolAction) {
if (mouseAction == 0) this.unbindJmolAction (jmolAction);
 else this.removeBinding (null, mouseAction + "\t" + jmolAction);
}, "~N,~N");
Clazz.defineMethod (c$, "unbind", 
function (mouseAction, name) {
if (name == null) this.unbindMouseAction (mouseAction);
 else this.removeBinding (null, mouseAction + "\t" + name);
}, "~N,~S");
Clazz.defineMethod (c$, "unbindJmolAction", 
function (jmolAction) {
var e = this.bindings.keySet ().iterator ();
var skey = "\t" + jmolAction;
while (e.hasNext ()) {
var key = e.next ();
if (key.endsWith (skey)) this.removeBinding (e, key);
}
}, "~N");
Clazz.defineMethod (c$, "addBinding", 
($fz = function (key, value) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("adding binding " + key + "\t==\t" + org.jmol.util.Escape.escape (value));
this.bindings.put (key, value);
}, $fz.isPrivate = true, $fz), "~S,~O");
Clazz.defineMethod (c$, "removeBinding", 
($fz = function (e, key) {
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("removing binding " + key);
if (e == null) this.bindings.remove (key);
 else e.remove ();
}, $fz.isPrivate = true, $fz), "java.util.Iterator,~S");
Clazz.defineMethod (c$, "unbindUserAction", 
function (script) {
var e = this.bindings.keySet ().iterator ();
var skey = "\t" + script;
while (e.hasNext ()) {
var key = e.next ();
if (key.endsWith (skey)) this.removeBinding (e, key);
}
}, "~S");
Clazz.defineMethod (c$, "unbindMouseAction", 
function (mouseAction) {
var e = this.bindings.keySet ().iterator ();
var skey = mouseAction + "\t";
while (e.hasNext ()) {
var key = e.next ();
if (key.startsWith (skey)) this.removeBinding (e, key);
}
}, "~N");
Clazz.defineMethod (c$, "isBound", 
function (mouseAction, action) {
return this.bindings.containsKey (mouseAction + "\t" + action);
}, "~N,~N");
Clazz.defineMethod (c$, "isUserAction", 
function (mouseAction) {
return this.bindings.containsKey (mouseAction + "\t");
}, "~N");
c$.getMouseAction = Clazz.defineMethod (c$, "getMouseAction", 
function (clickCount, modifiers) {
if (clickCount > 2) clickCount = 2;
return (modifiers & 63) | (clickCount == -2147483648 ? 1024 : (clickCount << 8));
}, "~N,~N");
c$.getMouseAction = Clazz.defineMethod (c$, "getMouseAction", 
function (desc) {
if (desc == null) return 0;
var action = 0;
desc = desc.toUpperCase ();
if (desc.indexOf ("MIDDLE") >= 0) action |= 8;
 else if (desc.indexOf ("RIGHT") >= 0) action |= 4;
 else if (desc.indexOf ("WHEEL") >= 0) action |= 32;
 else if (desc.indexOf ("LEFT") >= 0) action |= 16;
var isDefaultButton = (action == 0);
if (desc.indexOf ("DOUBLE") >= 0) action |= 512;
 else if (action > 0 && (action & 32) == 0 || desc.indexOf ("SINGLE") >= 0) action |= 256;
 else if (desc.indexOf ("DOWN") >= 0) action |= 1024;
if (desc.indexOf ("CTRL") >= 0) action |= 2;
if (desc.indexOf ("ALT") >= 0) action |= 8;
if (desc.indexOf ("SHIFT") >= 0) action |= 1;
if (isDefaultButton && action != 0) action |= 16;
return action;
}, "~S");
c$.getModifiers = Clazz.defineMethod (c$, "getModifiers", 
function (mouseAction) {
return mouseAction & 63;
}, "~N");
c$.getClickCount = Clazz.defineMethod (c$, "getClickCount", 
function (mouseAction) {
return mouseAction >> 8;
}, "~N");
Clazz.defineMethod (c$, "getBindingInfo", 
function (actionNames, qualifiers) {
var sb =  new org.jmol.util.StringXBuilder ();
var qlow = (qualifiers == null || qualifiers.equalsIgnoreCase ("all") ? null : qualifiers.toLowerCase ());
var names =  new Array (actionNames.length);
for (var i = 0; i < actionNames.length; i++) names[i] = (qlow == null || actionNames[i].toLowerCase ().indexOf (qlow) >= 0 ?  new java.util.ArrayList () : null);

var e = this.bindings.keySet ().iterator ();
while (e.hasNext ()) {
var obj = this.bindings.get (e.next ());
if (!org.jmol.util.Escape.isAI (obj)) continue;
var info = obj;
var i = info[1];
if (names[i] == null) continue;
names[i].add (org.jmol.viewer.binding.Binding.getMouseActionName (info[0], true));
}
for (var i = 0; i < actionNames.length; i++) {
var n;
if (names[i] == null || (n = names[i].size ()) == 0) continue;
var list = names[i].toArray ();
java.util.Arrays.sort (list);
sb.append (actionNames[i]).append ("\t");
var sep = "";
for (var j = 0; j < n; j++) {
sb.append (sep);
sb.append ((list[j]).substring (7));
sep = ", ";
}
sb.appendC ('\n');
}
return sb.toString ();
}, "~A,~S");
c$.includes = Clazz.defineMethod (c$, "includes", 
($fz = function (mouseAction, mod) {
return ((mouseAction & mod) == mod);
}, $fz.isPrivate = true, $fz), "~N,~N");
c$.getMouseActionName = Clazz.defineMethod (c$, "getMouseActionName", 
function (mouseAction, addSortCode) {
var sb =  new org.jmol.util.StringXBuilder ();
if (mouseAction == 0) return "";
var isMiddle = (org.jmol.viewer.binding.Binding.includes (mouseAction, 8) && !org.jmol.viewer.binding.Binding.includes (mouseAction, 16) && !org.jmol.viewer.binding.Binding.includes (mouseAction, 4));
var code = "      ".toCharArray ();
if (org.jmol.viewer.binding.Binding.includes (mouseAction, 2)) {
sb.append ("CTRL+");
code[4] = 'C';
}if (!isMiddle && org.jmol.viewer.binding.Binding.includes (mouseAction, 8)) {
sb.append ("ALT+");
code[3] = 'A';
}if (org.jmol.viewer.binding.Binding.includes (mouseAction, 1)) {
sb.append ("SHIFT+");
code[2] = 'S';
}if (org.jmol.viewer.binding.Binding.includes (mouseAction, 16)) {
code[1] = 'L';
sb.append ("LEFT");
} else if (org.jmol.viewer.binding.Binding.includes (mouseAction, 4)) {
code[1] = 'R';
sb.append ("RIGHT");
} else if (isMiddle) {
code[1] = 'W';
sb.append ("MIDDLE");
} else if (org.jmol.viewer.binding.Binding.includes (mouseAction, 32)) {
code[1] = 'W';
sb.append ("WHEEL");
}if (org.jmol.viewer.binding.Binding.includes (mouseAction, 512)) {
sb.append ("+double-click");
code[0] = '2';
} else if (org.jmol.viewer.binding.Binding.includes (mouseAction, 1024)) {
sb.append ("+down");
code[0] = '4';
}return (addSortCode ?  String.instantialize (code) + ":" + sb.toString () : sb.toString ());
}, "~N,~B");
Clazz.defineStatics (c$,
"WHEEL", 32,
"LEFT", 16,
"MIDDLE", 8,
"RIGHT", 4,
"ALT", 8,
"CTRL", 2,
"SHIFT", 1,
"CTRL_ALT", 10,
"CTRL_SHIFT", 3,
"LEFT_MIDDLE_RIGHT", 28,
"MAC_COMMAND", 20,
"DOUBLE_CLICK", 512,
"SINGLE_CLICK", 256,
"DOWN", 1024,
"MOVED", 0,
"DRAGGED", 1,
"CLICKED", 2,
"WHEELED", 3,
"PRESSED", 4,
"RELEASED", 5,
"BUTTON_MODIFIER_MASK", 63);
});
