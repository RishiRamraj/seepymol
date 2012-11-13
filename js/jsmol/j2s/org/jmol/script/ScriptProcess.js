Clazz.declarePackage ("org.jmol.script");
c$ = Clazz.decorateAsClass (function () {
this.processName = null;
this.context = null;
Clazz.instantialize (this, arguments);
}, org.jmol.script, "ScriptProcess");
Clazz.makeConstructor (c$, 
function (name, context) {
this.processName = name;
this.context = context;
}, "~S,org.jmol.script.ScriptContext");
