Clazz.declarePackage ("org.jmol.script");
Clazz.load (["org.jmol.script.ScriptException"], "org.jmol.script.ScriptInterruption", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.delayMs = 0;
this.targetTime = 0;
this.sc = null;
Clazz.instantialize (this, arguments);
}, org.jmol.script, "ScriptInterruption", org.jmol.script.ScriptException);
Clazz.makeConstructor (c$, 
function (eval, delayMs) {
Clazz.superConstructor (this, org.jmol.script.ScriptInterruption, [eval, (eval.viewer.autoExit ? "Interruption Error" : null), null, eval.viewer.autoExit]);
if (eval.viewer.autoExit) return;
this.delayMs = delayMs;
this.targetTime = System.currentTimeMillis () + delayMs;
try {
eval.scriptLevel--;
eval.pushContext (null);
this.sc = eval.thisContext;
} catch (e) {
if (Clazz.exceptionOf (e, org.jmol.script.ScriptException)) {
} else {
throw e;
}
}
}, "org.jmol.script.ScriptEvaluator,~N");
Clazz.defineMethod (c$, "resumeExecution", 
function () {
this.eval.resume (this.sc);
});
});
