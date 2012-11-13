﻿Clazz.declarePackage ("org.jmol.script");
Clazz.load (null, "org.jmol.script.ScriptEvaluator", ["java.lang.Boolean", "$.Float", "$.NullPointerException", "$.Short", "$.Thread", "java.util.ArrayList", "$.Hashtable", "org.jmol.atomdata.RadiusData", "org.jmol.constant.EnumAnimationMode", "$.EnumAxesMode", "$.EnumPalette", "$.EnumStereoMode", "$.EnumStructure", "$.EnumVdw", "org.jmol.i18n.GT", "org.jmol.io.JmolBinary", "org.jmol.modelset.Atom", "$.AtomCollection", "$.Bond", "$.Group", "$.LabelToken", "$.MeasurementData", "$.ModelCollection", "$.TickInfo", "org.jmol.script.ScriptCompiler", "$.ScriptContext", "$.ScriptException", "$.ScriptMathProcessor", "$.ScriptVariable", "$.ScriptVariableInt", "$.Token", "org.jmol.shape.Object2d", "org.jmol.util.ArrayUtil", "$.BitSet", "$.BitSetUtil", "$.BoxInfo", "$.Colix", "$.ColorEncoder", "$.ColorUtil", "$.Elements", "$.Escape", "$.GData", "$.JmolEdge", "$.Logger", "$.Matrix3f", "$.Matrix4f", "$.Measure", "$.MeshSurface", "$.Parser", "$.Point3f", "$.Point3fi", "$.Point4f", "$.Quaternion", "$.StringXBuilder", "$.TextFormat", "$.Vector3f", "org.jmol.viewer.ActionManager", "$.FileManager", "$.JmolConstants", "$.PropertyManager", "$.StateManager", "$.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tQuiet = false;
this.isSyntaxCheck = false;
this.isCmdLine_C_Option = false;
this.isCmdLine_c_or_C_Option = false;
this.historyDisabled = false;
this.logMessages = false;
this.debugScript = false;
this.interruptExecution = false;
this.executionPaused = false;
this.executionStepping = false;
this.isExecuting = false;
this.timeBeginExecution = 0;
this.timeEndExecution = 0;
this.shapeManager = null;
this.currentThread = null;
this.viewer = null;
this.compiler = null;
this.definedAtomSets = null;
this.outputBuffer = null;
this.contextPath = "";
this.scriptFileName = null;
this.functionName = null;
this.isStateScript = false;
this.scriptLevel = 0;
this.scriptReportingLevel = 0;
this.commandHistoryLevelMax = 0;
this.aatoken = null;
this.lineNumbers = null;
this.lineIndices = null;
this.contextVariables = null;
this.$script = null;
this.pc = 0;
this.thisCommand = null;
this.fullCommand = null;
this.statement = null;
this.statementLength = 0;
this.iToken = 0;
this.lineEnd = 0;
this.pcEnd = 0;
this.scriptExtensions = null;
this.forceNoAddHydrogens = false;
this.parallelProcessor = null;
this.thisContext = null;
this.$error = false;
this.errorMessage = null;
this.errorMessageUntranslated = null;
this.errorType = null;
this.iCommandError = 0;
this.ignoreError = false;
this.tempStatement = null;
this.isBondSet = false;
this.expressionResult = null;
this.theTok = 0;
this.theToken = null;
this.coordinatesAreFractional = false;
this.fractionalPoint = null;
this.vProcess = null;
this.$data = null;
Clazz.instantialize (this, arguments);
}, org.jmol.script, "ScriptEvaluator");
Clazz.makeConstructor (c$, 
function (viewer) {
this.viewer = viewer;
this.compiler = (this.compiler == null ? viewer.compiler : this.compiler);
this.definedAtomSets = viewer.definedAtomSets;
this.currentThread = Thread.currentThread ();
}, "org.jmol.viewer.Viewer");
Clazz.defineMethod (c$, "compileScriptString", 
function (script, tQuiet) {
this.clearState (tQuiet);
this.contextPath = "[script]";
return this.compileScript (null, script, this.debugScript);
}, "~S,~B");
Clazz.defineMethod (c$, "createFunction", 
($fz = function (fname, xyz, ret) {
var e =  new org.jmol.script.ScriptEvaluator (this.viewer);
try {
e.compileScript (null, "function " + fname + "(" + xyz + ") { return " + ret + "}", false);
var params =  new java.util.ArrayList ();
for (var i = 0; i < xyz.length; i += 2) params.add (org.jmol.script.ScriptVariable.newVariable (3, Float.$valueOf (0)).setName (xyz.substring (i, i + 1)));

return [e.aatoken[0][1].value, params];
} catch (ex) {
if (Clazz.exceptionOf (ex, Exception)) {
return null;
} else {
throw ex;
}
}
}, $fz.isPrivate = true, $fz), "~S,~S,~S");
Clazz.defineMethod (c$, "compileScriptFile", 
function (filename, tQuiet) {
this.clearState (tQuiet);
this.contextPath = filename;
return this.compileScriptFileInternal (filename, null, null, null);
}, "~S,~B");
Clazz.defineMethod (c$, "evaluateCompiledScript", 
function (isCmdLine_c_or_C_Option, isCmdLine_C_Option, historyDisabled, listCommands, outputBuffer) {
var tempOpen = this.isCmdLine_C_Option;
this.isCmdLine_C_Option = isCmdLine_C_Option;
this.viewer.pushHoldRepaintWhy ("runEval");
this.interruptExecution = this.executionPaused = false;
this.executionStepping = false;
this.isExecuting = true;
this.currentThread = Thread.currentThread ();
this.isSyntaxCheck = this.isCmdLine_c_or_C_Option = isCmdLine_c_or_C_Option;
this.timeBeginExecution = System.currentTimeMillis ();
this.historyDisabled = historyDisabled;
this.outputBuffer = outputBuffer;
this.setErrorMessage (null);
try {
try {
this.setScriptExtensions ();
this.instructionDispatchLoop (listCommands);
var script = this.viewer.getInterruptScript ();
if (script !== "") this.runScriptBuffer (script, null);
} catch (er) {
if (Clazz.exceptionOf (er, Error)) {
this.viewer.handleError (er, false);
this.setErrorMessage ("" + er + " " + this.viewer.getShapeErrorState ());
this.errorMessageUntranslated = "" + er;
this.scriptStatusOrBuffer (this.errorMessage);
} else {
throw er;
}
}
} catch (e) {
if (Clazz.exceptionOf (e, org.jmol.script.ScriptException)) {
this.setErrorMessage (e.toString ());
this.errorMessageUntranslated = e.getErrorMessageUntranslated ();
this.scriptStatusOrBuffer (this.errorMessage);
this.viewer.notifyError ((this.errorMessage != null && this.errorMessage.indexOf ("java.lang.OutOfMemoryError") >= 0 ? "Error" : "ScriptException"), this.errorMessage, this.errorMessageUntranslated);
} else {
throw e;
}
}
this.timeEndExecution = System.currentTimeMillis ();
this.isCmdLine_C_Option = tempOpen;
if (this.errorMessage == null && this.interruptExecution) this.setErrorMessage ("execution interrupted");
 else if (!this.tQuiet && !this.isSyntaxCheck) this.viewer.scriptStatus ("Script completed");
this.isExecuting = this.isSyntaxCheck = isCmdLine_c_or_C_Option = historyDisabled = false;
this.viewer.setTainted (true);
this.viewer.popHoldRepaintWhy ("runEval");
}, "~B,~B,~B,~B,org.jmol.util.StringXBuilder");
Clazz.defineMethod (c$, "runScriptBuffer", 
function (script, outputBuffer) {
this.pushContext (null);
this.contextPath += " >> script() ";
this.outputBuffer = outputBuffer;
if (this.compileScript (null, script + "\u0001## EDITOR_IGNORE ##", false)) this.instructionDispatchLoop (false);
this.popContext (false, false);
}, "~S,org.jmol.util.StringXBuilder");
Clazz.defineMethod (c$, "checkScriptSilent", 
function (script) {
var sc = this.compiler.compile (null, script, false, true, false, true);
if (sc.errorType != null) return sc;
this.restoreScriptContext (sc, false, false, false);
this.isSyntaxCheck = true;
this.isCmdLine_c_or_C_Option = this.isCmdLine_C_Option = false;
this.pc = 0;
try {
this.instructionDispatchLoop (false);
} catch (e) {
if (Clazz.exceptionOf (e, org.jmol.script.ScriptException)) {
this.setErrorMessage (e.toString ());
sc = this.getScriptContext ();
} else {
throw e;
}
}
this.isSyntaxCheck = false;
return sc;
}, "~S");
Clazz.defineMethod (c$, "setDebugging", 
function () {
this.debugScript = this.viewer.getDebugScript ();
this.logMessages = (this.debugScript && org.jmol.util.Logger.debugging);
});
Clazz.defineMethod (c$, "getExecutionWalltime", 
function () {
return (this.timeEndExecution - this.timeBeginExecution);
});
Clazz.defineMethod (c$, "haltExecution", 
function () {
this.resumePausedExecution ();
this.interruptExecution = true;
});
Clazz.defineMethod (c$, "pauseExecution", 
function (withDelay) {
if (this.isSyntaxCheck || this.viewer.isHeadless ()) return;
if (withDelay) this.delayMillis (-100);
this.viewer.popHoldRepaintWhy ("pauseExecution");
this.executionStepping = false;
this.executionPaused = true;
}, "~B");
Clazz.defineMethod (c$, "stepPausedExecution", 
function () {
this.executionStepping = true;
this.executionPaused = false;
});
Clazz.defineMethod (c$, "resumePausedExecution", 
function () {
this.executionPaused = false;
this.executionStepping = false;
});
Clazz.defineMethod (c$, "isScriptExecuting", 
function () {
return this.isExecuting && !this.interruptExecution;
});
Clazz.defineMethod (c$, "isExecutionPaused", 
function () {
return this.executionPaused;
});
Clazz.defineMethod (c$, "isExecutionStepping", 
function () {
return this.executionStepping;
});
Clazz.defineMethod (c$, "getNextStatement", 
function () {
return (this.pc < this.aatoken.length ? org.jmol.script.ScriptEvaluator.setErrorLineMessage (this.functionName, this.scriptFileName, this.getLinenumber (null), this.pc, org.jmol.script.ScriptEvaluator.statementAsString (this.aatoken[this.pc], -9999, this.logMessages)) : "");
});
Clazz.defineMethod (c$, "getCommand", 
($fz = function (pc, allThisLine, addSemi) {
if (pc >= this.lineIndices.length) return "";
if (allThisLine) {
var pt0 = -1;
var pt1 = this.$script.length;
for (var i = 0; i < this.lineNumbers.length; i++) if (this.lineNumbers[i] == this.lineNumbers[pc]) {
if (pt0 < 0) pt0 = this.lineIndices[i][0];
pt1 = this.lineIndices[i][1];
} else if (this.lineNumbers[i] == 0 || this.lineNumbers[i] > this.lineNumbers[pc]) {
break;
}
if (pt1 == this.$script.length - 1 && this.$script.endsWith ("}")) pt1++;
return (pt0 == this.$script.length || pt1 < pt0 ? "" : this.$script.substring (Math.max (pt0, 0), Math.min (this.$script.length, pt1)));
}var ichBegin = this.lineIndices[pc][0];
var ichEnd = this.lineIndices[pc][1];
var s = "";
if (ichBegin < 0 || ichEnd <= ichBegin || ichEnd > this.$script.length) return "";
try {
s = this.$script.substring (ichBegin, ichEnd);
if (s.indexOf ("\\\n") >= 0) s = org.jmol.util.TextFormat.simpleReplace (s, "\\\n", "  ");
if (s.indexOf ("\\\r") >= 0) s = org.jmol.util.TextFormat.simpleReplace (s, "\\\r", "  ");
if (s.length > 0 && !s.endsWith (";")) s += ";";
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.error ("darn problem in Eval getCommand: ichBegin=" + ichBegin + " ichEnd=" + ichEnd + " len = " + this.$script.length + "\n" + e);
} else {
throw e;
}
}
return s;
}, $fz.isPrivate = true, $fz), "~N,~B,~B");
Clazz.defineMethod (c$, "logDebugScript", 
($fz = function (ifLevel) {
if (this.logMessages) {
if (this.statement.length > 0) org.jmol.util.Logger.debug (this.statement[0].toString ());
for (var i = 1; i < this.statementLength; ++i) org.jmol.util.Logger.debug (this.statement[i].toString ());

}this.iToken = -9999;
if (this.logMessages) {
var strbufLog =  new org.jmol.util.StringXBuilder ();
var s = (ifLevel > 0 ? "                          ".substring (0, ifLevel * 2) : "");
strbufLog.append (s).append (org.jmol.script.ScriptEvaluator.statementAsString (this.statement, this.iToken, this.logMessages));
this.viewer.scriptStatus (strbufLog.toString ());
} else {
var cmd = this.getCommand (this.pc, false, false);
if (cmd !== "") this.viewer.scriptStatus (cmd);
}}, $fz.isPrivate = true, $fz), "~N");
c$.evaluateExpression = Clazz.defineMethod (c$, "evaluateExpression", 
function (viewer, expr, asVariable) {
var e =  new org.jmol.script.ScriptEvaluator (viewer);
return (e.evaluate (expr, asVariable));
}, "org.jmol.viewer.Viewer,~O,~B");
Clazz.defineMethod (c$, "evaluate", 
($fz = function (expr, asVariable) {
try {
if (Clazz.instanceOf (expr, String)) {
if (this.compileScript (null, "e_x_p_r_e_s_s_i_o_n" + " = " + expr, false)) {
this.contextVariables = this.viewer.getContextVariables ();
this.setStatement (0);
return (asVariable ? this.parameterExpressionList (2, -1, false).get (0) : this.parameterExpressionString (2, 0));
}} else if (Clazz.instanceOf (expr, Array)) {
this.contextVariables = this.viewer.getContextVariables ();
var bs = this.atomExpression (expr, 0, 0, true, false, true, false);
return (asVariable ? org.jmol.script.ScriptVariable.newScriptVariableBs (bs, -1) : bs);
}} catch (ex) {
if (Clazz.exceptionOf (ex, Exception)) {
org.jmol.util.Logger.error ("Error evaluating: " + expr + "\n" + ex);
} else {
throw ex;
}
}
return (asVariable ? org.jmol.script.ScriptVariable.getVariable ("ERROR") : "ERROR");
}, $fz.isPrivate = true, $fz), "~O,~B");
c$.evaluateContext = Clazz.defineMethod (c$, "evaluateContext", 
function (viewer, context, shapeManager) {
var e =  new org.jmol.script.ScriptEvaluator (viewer);
e.historyDisabled = true;
e.compiler =  new org.jmol.script.ScriptCompiler (e.compiler);
e.shapeManager = shapeManager;
try {
e.restoreScriptContext (context, true, false, false);
e.instructionDispatchLoop (false);
} catch (ex) {
if (Clazz.exceptionOf (ex, Exception)) {
viewer.setStringProperty ("_errormessage", "" + ex);
if (e.thisContext == null) {
org.jmol.util.Logger.error ("Error evaluating context");
ex.printStackTrace ();
}return false;
} else {
throw ex;
}
}
return true;
}, "org.jmol.viewer.Viewer,org.jmol.script.ScriptContext,org.jmol.viewer.ShapeManager");
c$.getAtomBitSet = Clazz.defineMethod (c$, "getAtomBitSet", 
function (e, atomExpression) {
if (Clazz.instanceOf (atomExpression, org.jmol.util.BitSet)) return atomExpression;
var bs =  new org.jmol.util.BitSet ();
try {
e.pushContext (null);
var scr = "select (" + atomExpression + ")";
scr = org.jmol.util.TextFormat.replaceAllCharacters (scr, "\n\r", "),(");
scr = org.jmol.util.TextFormat.simpleReplace (scr, "()", "(none)");
if (e.compileScript (null, scr, false)) {
e.statement = e.aatoken[0];
bs = e.atomExpression (e.statement, 1, 0, false, false, true, true);
}e.popContext (false, false);
} catch (ex) {
if (Clazz.exceptionOf (ex, Exception)) {
org.jmol.util.Logger.error ("getAtomBitSet " + atomExpression + "\n" + ex);
} else {
throw ex;
}
}
return bs;
}, "org.jmol.script.ScriptEvaluator,~O");
c$.getAtomBitSetVector = Clazz.defineMethod (c$, "getAtomBitSetVector", 
function (e, atomCount, atomExpression) {
var V =  new java.util.ArrayList ();
var bs = org.jmol.script.ScriptEvaluator.getAtomBitSet (e, atomExpression);
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
V.add (Integer.$valueOf (i));
}
return V;
}, "org.jmol.script.ScriptEvaluator,~N,~O");
Clazz.defineMethod (c$, "parameterExpressionList", 
($fz = function (pt, ptAtom, isArrayItem) {
return this.parameterExpression (pt, -1, null, true, true, ptAtom, isArrayItem, null, null);
}, $fz.isPrivate = true, $fz), "~N,~N,~B");
Clazz.defineMethod (c$, "parameterExpressionString", 
($fz = function (pt, ptMax) {
return this.parameterExpression (pt, ptMax, "", true, false, -1, false, null, null);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "parameterExpressionBoolean", 
($fz = function (pt, ptMax) {
return (this.parameterExpression (pt, ptMax, null, true, false, -1, false, null, null)).booleanValue ();
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "parameterExpressionToken", 
($fz = function (pt) {
var result = this.parameterExpressionList (pt, -1, false);
return (result.size () > 0 ? result.get (0) : org.jmol.script.ScriptVariable.newVariable (4, ""));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "parameterExpression", 
($fz = function (pt, ptMax, key, ignoreComma, asVector, ptAtom, isArrayItem, localVars, localVar) {
var v;
var res;
var isImplicitAtomProperty = (localVar != null);
var isOneExpressionOnly = (pt < 0);
var returnBoolean = (!asVector && key == null);
var returnString = (!asVector && key != null && key.length == 0);
var nSquare = 0;
if (isOneExpressionOnly) pt = -pt;
var nParen = 0;
var rpn =  new org.jmol.script.ScriptMathProcessor (this, isArrayItem, asVector, false);
if (pt == 0 && ptMax == 0) pt = 2;
if (ptMax < pt) ptMax = this.statementLength;
out : for (var i = pt; i < ptMax; i++) {
v = null;
var tok = this.getToken (i).tok;
if (isImplicitAtomProperty && this.tokAt (i + 1) != 1048584) {
var token = (localVars != null && localVars.containsKey (this.theToken.value) ? null : this.getBitsetPropertySelector (i, false));
if (token != null) {
rpn.addXVar (localVars.get (localVar));
if (!rpn.addOpAllowMath (token, (this.tokAt (i + 1) == 269484048))) this.error (22);
if ((token.intValue == 135368713 || token.intValue == 102436) && this.tokAt (this.iToken + 1) != 269484048) {
rpn.addOp (org.jmol.script.Token.tokenLeftParen);
rpn.addOp (org.jmol.script.Token.tokenRightParen);
}i = this.iToken;
continue;
}}switch (tok) {
case 1060866:
if (this.tokAt (++i) == 1048577) {
v = this.parameterExpressionToken (++i);
i = this.iToken;
} else if (this.tokAt (i) == 2) {
v = this.viewer.getAtomBits (1095763969, Integer.$valueOf (this.statement[i].intValue));
break;
} else {
v = this.getParameter (org.jmol.script.ScriptVariable.sValue (this.statement[i]), 1073742190);
}v = this.getParameter ((v).asString (), 1073742190);
break;
case 135369225:
if (this.getToken (++i).tok != 269484048) this.error (22);
if (localVars == null) localVars =  new java.util.Hashtable ();
res = this.parameterExpression (++i, -1, null, ignoreComma, false, -1, false, localVars, localVar);
var TF = (res).booleanValue ();
var iT = this.iToken;
if (this.getToken (iT++).tok != 1048591) this.error (22);
this.parameterExpressionBoolean (iT, -1);
var iF = this.iToken;
if (this.tokAt (iF++) != 1048591) this.error (22);
this.parameterExpression (-iF, -1, null, ignoreComma, false, 1, false, localVars, localVar);
var iEnd = this.iToken;
if (this.tokAt (iEnd) != 269484049) this.error (22);
v = this.parameterExpression (TF ? iT : iF, TF ? iF : iEnd, "XXX", ignoreComma, false, 1, false, localVars, localVar);
i = iEnd;
break;
case 135369224:
case 135280132:
var isFunctionOfX = (pt > 0);
var isFor = (isFunctionOfX && tok == 135369224);
var dummy;
if (isFunctionOfX) {
if (this.getToken (++i).tok != 269484048 || !org.jmol.script.Token.tokAttr (this.getToken (++i).tok, 1073741824)) this.error (22);
dummy = this.parameterAsString (i);
if (this.getToken (++i).tok != 1048591) this.error (22);
} else {
dummy = "_x";
}v = this.parameterExpressionToken (-(++i)).value;
if (!(Clazz.instanceOf (v, org.jmol.util.BitSet))) this.error (22);
var bsAtoms = v;
i = this.iToken;
if (isFunctionOfX && this.getToken (i++).tok != 1048591) this.error (22);
var bsSelect =  new org.jmol.util.BitSet ();
var bsX =  new org.jmol.util.BitSet ();
var sout = (isFor ?  new Array (org.jmol.util.BitSetUtil.cardinalityOf (bsAtoms)) : null);
if (localVars == null) localVars =  new java.util.Hashtable ();
bsX.set (0);
var t = org.jmol.script.ScriptVariable.newScriptVariableBs (bsX, 0);
localVars.put (dummy, t.setName (dummy));
var pt2 = -1;
if (isFunctionOfX) {
pt2 = i - 1;
var np = 0;
var tok2;
while (np >= 0 && ++pt2 < ptMax) {
if ((tok2 = this.tokAt (pt2)) == 269484049) np--;
 else if (tok2 == 269484048) np++;
}
}var p = 0;
var jlast = 0;
var j = bsAtoms.nextSetBit (0);
if (j < 0) {
this.iToken = pt2 - 1;
} else if (!this.isSyntaxCheck) {
for (; j >= 0; j = bsAtoms.nextSetBit (j + 1)) {
if (jlast >= 0) bsX.clear (jlast);
jlast = j;
bsX.set (j);
t.index = j;
res = this.parameterExpression (i, pt2, (isFor ? "XXX" : null), ignoreComma, isFor, j, false, localVars, isFunctionOfX ? null : dummy);
if (isFor) {
if (res == null || (res).size () == 0) this.error (22);
sout[p++] = ((res).get (0)).asString ();
} else if ((res).booleanValue ()) {
bsSelect.set (j);
}}
}if (isFor) {
v = sout;
} else if (isFunctionOfX) {
v = bsSelect;
} else {
return this.bitsetVariableVector (bsSelect);
}i = this.iToken + 1;
break;
case 1048591:
break out;
case 3:
rpn.addXNum (org.jmol.script.ScriptVariable.newVariable (3, this.theToken.value));
break;
case 1048614:
case 2:
rpn.addXNum ( new org.jmol.script.ScriptVariableInt (this.theToken.intValue));
break;
case 135266319:
if (this.tokAt (this.iToken + 1) == 269484048) {
if (!rpn.addOpAllowMath (this.theToken, true)) this.error (22);
break;
}rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (this.theToken));
break;
case 1087375362:
case 1087375361:
case 1048580:
case 1679429641:
case 1087373316:
case 1048582:
case 1087375365:
case 1087373318:
case 1095766028:
case 1095761934:
case 1087373320:
case 1095761938:
case 135267335:
case 135267336:
case 1238369286:
case 1641025539:
case 1048589:
case 1048588:
case 4:
case 8:
case 9:
case 11:
case 12:
case 10:
case 6:
rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (this.theToken));
break;
case 1048583:
this.ignoreError = true;
var ptc;
try {
ptc = this.centerParameter (i);
rpn.addXVar (org.jmol.script.ScriptVariable.newVariable (8, ptc));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
rpn.addXStr ("");
} else {
throw e;
}
}
this.ignoreError = false;
i = this.iToken;
break;
case 1048586:
if (this.tokAt (i + 1) == 4) v = this.getHash (i);
 else v = this.getPointOrPlane (i, false, true, true, false, 3, 4);
i = this.iToken;
break;
case 1048577:
if (this.tokAt (i + 1) == 1048578) {
v =  new java.util.Hashtable ();
i++;
break;
} else if (this.tokAt (i + 1) == 1048579 && this.tokAt (i + 2) == 1048578) {
tok = 1048579;
this.iToken += 2;
}case 1048579:
if (tok == 1048579) v = this.viewer.getModelUndeletedAtomsBitSet (-1);
 else v = this.atomExpression (this.statement, i, 0, true, true, true, true);
i = this.iToken;
if (nParen == 0 && isOneExpressionOnly) {
this.iToken++;
return this.bitsetVariableVector (v);
}break;
case 1073742195:
rpn.addOp (this.theToken);
continue;
case 1048578:
i++;
break out;
case 1048590:
if (!ignoreComma && nParen == 0 && nSquare == 0) break out;
this.error (22);
break;
case 269484080:
if (!ignoreComma && nParen == 0 && nSquare == 0) {
break out;
}if (!rpn.addOp (this.theToken)) this.error (22);
break;
case 1048584:
var token = this.getBitsetPropertySelector (i + 1, false);
if (token == null) this.error (22);
var isUserFunction = (token.intValue == 135368713);
var allowMathFunc = true;
var tok2 = this.tokAt (this.iToken + 2);
if (this.tokAt (this.iToken + 1) == 1048584) {
switch (tok2) {
case 1048579:
tok2 = 480;
if (this.tokAt (this.iToken + 3) == 1048584 && this.tokAt (this.iToken + 4) == 1276118529) tok2 = 224;
case 32:
case 64:
case 192:
case 128:
case 160:
case 96:
allowMathFunc = (isUserFunction || tok2 == 480 || tok2 == 224);
token.intValue |= tok2;
this.getToken (this.iToken + 2);
}
}allowMathFunc = new Boolean (allowMathFunc & (this.tokAt (this.iToken + 1) == 269484048 || isUserFunction)).valueOf ();
if (!rpn.addOpAllowMath (token, allowMathFunc)) this.error (22);
i = this.iToken;
if (token.intValue == 135368713 && this.tokAt (i + 1) != 269484048) {
rpn.addOp (org.jmol.script.Token.tokenLeftParen);
rpn.addOp (org.jmol.script.Token.tokenRightParen);
}break;
default:
if (org.jmol.script.Token.tokAttr (this.theTok, 269484032) || org.jmol.script.Token.tokAttr (this.theTok, 135266304) && this.tokAt (this.iToken + 1) == 269484048) {
if (!rpn.addOp (this.theToken)) {
if (ptAtom >= 0) {
break out;
}this.error (22);
}switch (this.theTok) {
case 269484048:
nParen++;
break;
case 269484049:
if (--nParen <= 0 && nSquare == 0 && isOneExpressionOnly) {
this.iToken++;
break out;
}break;
case 269484096:
nSquare++;
break;
case 269484097:
if (--nSquare == 0 && nParen == 0 && isOneExpressionOnly) {
this.iToken++;
break out;
}break;
}
} else {
var name = this.parameterAsString (i).toLowerCase ();
var haveParens = (this.tokAt (i + 1) == 269484048);
if (this.isSyntaxCheck) {
v = name;
} else if (!haveParens && (localVars == null || (v = localVars.get (name)) == null)) {
v = this.getContextVariableAsVariable (name);
}if (v == null) {
if (org.jmol.script.Token.tokAttr (this.theTok, 1073741824) && this.viewer.isFunction (name)) {
if (!rpn.addOp (org.jmol.script.ScriptVariable.newVariable (135368713, this.theToken.value))) this.error (22);
if (!haveParens) {
rpn.addOp (org.jmol.script.Token.tokenLeftParen);
rpn.addOp (org.jmol.script.Token.tokenRightParen);
}} else {
rpn.addXVar (this.viewer.getOrSetNewVariable (name, false));
}}}}
if (v != null) {
if (Clazz.instanceOf (v, org.jmol.util.BitSet)) rpn.addXBs (v);
 else rpn.addXObj (v);
}}
var result = rpn.getResult (false);
if (result == null) {
if (!this.isSyntaxCheck) rpn.dumpStacks ("null result");
this.error (13);
}if (result.tok == 135198) return result.value;
if (returnBoolean) return Boolean.$valueOf (result.asBoolean ());
if (returnString) {
if (result.tok == 4) result.intValue = 2147483647;
return result.asString ();
}switch (result.tok) {
case 1048589:
case 1048588:
return Boolean.$valueOf (result.intValue == 1);
case 2:
return Integer.$valueOf (result.intValue);
case 10:
case 3:
case 4:
case 8:
default:
return result.value;
}
}, $fz.isPrivate = true, $fz), "~N,~N,~S,~B,~B,~N,~B,java.util.Map,~S");
Clazz.defineMethod (c$, "getHash", 
($fz = function (i) {
var ht =  new java.util.Hashtable ();
for (i = i + 1; i < this.statementLength; i++) {
if (this.tokAt (i) == 1048590) break;
var key = this.stringParameter (i++);
if (this.tokAt (i++) != 269484066) this.error (22);
var v = this.parameterExpression (i, 0, null, false, true, -1, false, null, null);
ht.put (key, v.get (0));
i = this.iToken;
if (this.tokAt (i) != 269484080) break;
}
this.iToken = i;
if (this.tokAt (i) != 1048590) this.error (22);
return ht;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "bitsetVariableVector", 
function (v) {
var resx =  new java.util.ArrayList ();
if (Clazz.instanceOf (v, org.jmol.util.BitSet)) {
resx.add (org.jmol.script.ScriptVariable.newVariable (10, v));
}return resx;
}, "~O");
Clazz.defineMethod (c$, "getBitsetIdent", 
function (bs, label, tokenValue, useAtomMap, index, isExplicitlyAll) {
var isAtoms = !(Clazz.instanceOf (tokenValue, org.jmol.modelset.Bond.BondSet));
if (isAtoms) {
if (label == null) label = this.viewer.getStandardLabelFormat (0);
 else if (label.length == 0) label = "%[label]";
}var pt = (label == null ? -1 : label.indexOf ("%"));
var haveIndex = (index != 2147483647);
if (bs == null || this.isSyntaxCheck || isAtoms && pt < 0) {
if (label == null) label = "";
return isExplicitlyAll ? [label] : label;
}var modelSet = this.viewer.getModelSet ();
var n = 0;
var indices = (isAtoms || !useAtomMap ? null : (tokenValue).getAssociatedAtoms ());
if (indices == null && label != null && label.indexOf ("%D") > 0) indices = this.viewer.getAtomIndices (bs);
var asIdentity = (label == null || label.length == 0);
var htValues = (isAtoms || asIdentity ? null : org.jmol.modelset.LabelToken.getBondLabelValues ());
var tokens = (asIdentity ? null : isAtoms ? org.jmol.modelset.LabelToken.compile (this.viewer, label, '\0', null) : org.jmol.modelset.LabelToken.compile (this.viewer, label, '\1', htValues));
var nmax = (haveIndex ? 1 : org.jmol.util.BitSetUtil.cardinalityOf (bs));
var sout =  new Array (nmax);
for (var j = (haveIndex ? index : bs.nextSetBit (0)); j >= 0; j = bs.nextSetBit (j + 1)) {
var str;
if (isAtoms) {
if (asIdentity) str = modelSet.atoms[j].getInfo ();
 else str = org.jmol.modelset.LabelToken.formatLabelAtomArray (this.viewer, modelSet.atoms[j], tokens, '\0', indices);
} else {
var bond = modelSet.getBondAt (j);
if (asIdentity) str = bond.getIdentity ();
 else str = org.jmol.modelset.LabelToken.formatLabelBond (this.viewer, bond, tokens, htValues, indices);
}str = org.jmol.util.TextFormat.formatStringI (str, "#", (n + 1));
sout[n++] = str;
if (haveIndex) break;
}
return nmax == 1 && !isExplicitlyAll ? sout[0] : sout;
}, "org.jmol.util.BitSet,~S,~O,~B,~N,~B");
Clazz.defineMethod (c$, "getBitsetPropertySelector", 
($fz = function (i, mustBeSettable) {
var tok = this.getToken (i).tok;
switch (tok) {
case 32:
case 64:
case 96:
case 192:
case 128:
case 160:
case 1716520973:
break;
default:
if (org.jmol.script.Token.tokAttrOr (tok, 1078984704, 1141899264)) break;
if (tok != 806354977 && !org.jmol.script.Token.tokAttr (tok, 1073741824)) return null;
var name = this.parameterAsString (i);
if (!mustBeSettable && this.viewer.isFunction (name)) {
tok = 135368713;
break;
}if (!name.endsWith ("?")) return null;
tok = 1073741824;
}
if (mustBeSettable && !org.jmol.script.Token.tokAttr (tok, 2048)) return null;
return org.jmol.script.ScriptVariable.newScriptVariableIntValue (269484241, tok, this.parameterAsString (i).toLowerCase ());
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "getBitsetPropertyFloat", 
($fz = function (bs, tok, min, max) {
var data = this.getBitsetProperty (bs, tok, null, null, null, null, false, 2147483647, false);
if (!Float.isNaN (min)) for (var i = 0; i < data.length; i++) if (data[i] < min) data[i] = NaN;

if (!Float.isNaN (max)) for (var i = 0; i < data.length; i++) if (data[i] > max) data[i] = NaN;

return data;
}, $fz.isPrivate = true, $fz), "org.jmol.util.BitSet,~N,~N,~N");
Clazz.defineMethod (c$, "getBitsetProperty", 
function (bs, tok, ptRef, planeRef, tokenValue, opValue, useAtomMap, index, asVectorIfAll) {
var haveIndex = (index != 2147483647);
var isAtoms = haveIndex || !(Clazz.instanceOf (tokenValue, org.jmol.modelset.Bond.BondSet));
var minmaxtype = tok & 480;
var selectedFloat = (minmaxtype == 224);
var atomCount = this.viewer.getAtomCount ();
var fout = (minmaxtype == 256 ?  Clazz.newFloatArray (atomCount, 0) : null);
var isExplicitlyAll = (minmaxtype == 480 || selectedFloat);
tok &= -481;
if (tok == 0) tok = (isAtoms ? 1141899265 : 1678770178);
var isPt = false;
var isInt = false;
var isString = false;
switch (tok) {
case 1146095626:
case 1146095631:
case 1146095627:
case 1146095629:
case 1146093582:
case 1766856708:
case 1146095628:
isPt = true;
break;
case 135368713:
case 1276118018:
break;
default:
isInt = org.jmol.script.Token.tokAttr (tok, 1095761920) && !org.jmol.script.Token.tokAttr (tok, 1112539136);
isString = !isInt && org.jmol.script.Token.tokAttr (tok, 1087373312);
}
var zero = (minmaxtype == 256 ?  new org.jmol.util.Point3f () : null);
var pt = (isPt || !isAtoms ?  new org.jmol.util.Point3f () : null);
if (isExplicitlyAll || isString && !haveIndex && minmaxtype != 256 && minmaxtype != 32) minmaxtype = 1048579;
var vout = (minmaxtype == 1048579 ?  new java.util.ArrayList () : null);
var bsNew = null;
var userFunction = null;
var params = null;
var bsAtom = null;
var tokenAtom = null;
var ptT = null;
var data = null;
switch (tok) {
case 1141899265:
case 1678770178:
if (this.isSyntaxCheck) return bs;
bsNew = (tok == 1141899265 ? (isAtoms ? bs : this.viewer.getAtomBits (1678770178, bs)) : (isAtoms ?  new org.jmol.modelset.Bond.BondSet (this.viewer.getBondsForSelectedAtoms (bs)) : bs));
var i;
switch (minmaxtype) {
case 32:
i = bsNew.nextSetBit (0);
break;
case 64:
i = bsNew.length () - 1;
break;
case 192:
case 128:
case 160:
return Float.$valueOf (NaN);
default:
return bsNew;
}
bsNew.clearAll ();
if (i >= 0) bsNew.set (i);
return bsNew;
case 1087373321:
switch (minmaxtype) {
case 0:
case 1048579:
return this.getBitsetIdent (bs, null, tokenValue, useAtomMap, index, isExplicitlyAll);
}
return "";
case 135368713:
userFunction = (opValue)[0];
params = (opValue)[1];
bsAtom = org.jmol.util.BitSetUtil.newBitSet (atomCount);
tokenAtom = org.jmol.script.ScriptVariable.newVariable (10, bsAtom);
break;
case 1112539148:
case 1112539149:
this.viewer.autoCalculate (tok);
break;
case 1276118018:
if (ptRef == null && planeRef == null) return  new org.jmol.util.Point3f ();
break;
case 1766856708:
ptT =  new org.jmol.util.Point3f ();
break;
case 1716520973:
data = this.viewer.getDataFloat (opValue);
break;
}
var n = 0;
var ivvMinMax = 0;
var ivMinMax = 0;
var fvMinMax = 0;
var sum = 0;
var sum2 = 0;
switch (minmaxtype) {
case 32:
ivMinMax = 2147483647;
fvMinMax = 3.4028235E38;
break;
case 64:
ivMinMax = -2147483648;
fvMinMax = -3.4028235E38;
break;
}
var modelSet = this.viewer.getModelSet ();
var mode = (isPt ? 3 : isString ? 2 : isInt ? 1 : 0);
if (isAtoms) {
var haveBitSet = (bs != null);
var iModel = -1;
var i0;
var i1;
if (haveIndex) {
i0 = index;
i1 = index + 1;
} else if (haveBitSet) {
i0 = bs.nextSetBit (0);
i1 = Math.min (atomCount, bs.length ());
} else {
i0 = 0;
i1 = atomCount;
}if (this.isSyntaxCheck) i1 = 0;
for (var i = i0; i >= 0 && i < i1; i = (haveBitSet ? bs.nextSetBit (i + 1) : i + 1)) {
n++;
var atom = modelSet.atoms[i];
switch (mode) {
case 0:
var fv = 3.4028235E38;
switch (tok) {
case 135368713:
bsAtom.set (i);
fv = org.jmol.script.ScriptVariable.fValue (this.runFunctionRet (null, userFunction, params, tokenAtom, true, true));
bsAtom.clear (i);
break;
case 1716520973:
fv = (data == null ? 0 : data[i]);
break;
case 1276118018:
if (planeRef != null) fv = org.jmol.util.Measure.distanceToPlane (planeRef, atom);
 else fv = atom.distance (ptRef);
break;
default:
fv = org.jmol.modelset.Atom.atomPropertyFloat (this.viewer, atom, tok);
}
if (fv == 3.4028235E38 || Float.isNaN (fv) && minmaxtype != 1048579) {
n--;
continue;
}switch (minmaxtype) {
case 32:
if (fv < fvMinMax) fvMinMax = fv;
break;
case 64:
if (fv > fvMinMax) fvMinMax = fv;
break;
case 256:
fout[i] = fv;
break;
case 1048579:
vout.add (Float.$valueOf (fv));
break;
case 160:
case 192:
sum2 += (fv) * fv;
case 128:
default:
sum += fv;
}
break;
case 1:
var iv = 0;
switch (tok) {
case 1297090050:
if (atom.getModelIndex () != iModel) iModel = atom.getModelIndex ();
var bsSym = atom.getAtomSymmetry ();
if (bsSym == null) break;
var p = 0;
switch (minmaxtype) {
case 32:
ivvMinMax = 2147483647;
break;
case 64:
ivvMinMax = -2147483648;
break;
}
for (var k = bsSym.nextSetBit (0); k >= 0; k = bsSym.nextSetBit (k + 1)) {
iv += k + 1;
switch (minmaxtype) {
case 32:
ivvMinMax = Math.min (ivvMinMax, k + 1);
break;
case 64:
ivvMinMax = Math.max (ivvMinMax, k + 1);
break;
}
p++;
}
switch (minmaxtype) {
case 32:
case 64:
iv = ivvMinMax;
}
n += p - 1;
break;
case 1095766022:
case 1095761925:
this.errorStr (45, org.jmol.script.Token.nameOf (tok));
break;
default:
iv = org.jmol.modelset.Atom.atomPropertyInt (atom, tok);
}
switch (minmaxtype) {
case 32:
if (iv < ivMinMax) ivMinMax = iv;
break;
case 64:
if (iv > ivMinMax) ivMinMax = iv;
break;
case 256:
fout[i] = iv;
break;
case 1048579:
vout.add (Integer.$valueOf (iv));
break;
case 160:
case 192:
sum2 += (iv) * iv;
case 128:
default:
sum += iv;
}
break;
case 2:
var s = org.jmol.modelset.Atom.atomPropertyString (this.viewer, atom, tok);
switch (minmaxtype) {
case 256:
fout[i] = org.jmol.util.Parser.parseFloatStr (s);
break;
default:
if (vout == null) return s;
vout.add (s);
}
break;
case 3:
var t = org.jmol.modelset.Atom.atomPropertyTuple (atom, tok);
if (t == null) this.errorStr (45, org.jmol.script.Token.nameOf (tok));
switch (minmaxtype) {
case 256:
fout[i] = Math.sqrt (t.x * t.x + t.y * t.y + t.z * t.z);
break;
case 1048579:
vout.add (org.jmol.util.Point3f.newP (t));
break;
default:
pt.add (t);
}
break;
}
if (haveIndex) break;
}
} else {
var isAll = (bs == null);
var i0 = (isAll ? 0 : bs.nextSetBit (0));
var i1 = this.viewer.getBondCount ();
for (var i = i0; i >= 0 && i < i1; i = (isAll ? i + 1 : bs.nextSetBit (i + 1))) {
n++;
var bond = modelSet.getBondAt (i);
switch (tok) {
case 1141899267:
var fv = bond.getAtom1 ().distance (bond.getAtom2 ());
switch (minmaxtype) {
case 32:
if (fv < fvMinMax) fvMinMax = fv;
break;
case 64:
if (fv > fvMinMax) fvMinMax = fv;
break;
case 1048579:
vout.add (Float.$valueOf (fv));
break;
case 160:
case 192:
sum2 += fv * fv;
case 128:
default:
sum += fv;
}
break;
case 1146095626:
switch (minmaxtype) {
case 1048579:
pt.setT (bond.getAtom1 ());
pt.add (bond.getAtom2 ());
pt.scale (0.5);
vout.add (org.jmol.util.Point3f.newP (pt));
break;
default:
pt.add (bond.getAtom1 ());
pt.add (bond.getAtom2 ());
n++;
}
break;
case 1766856708:
org.jmol.util.ColorUtil.colorPointFromInt (this.viewer.getColorArgbOrGray (bond.getColix ()), ptT);
switch (minmaxtype) {
case 1048579:
vout.add (org.jmol.util.Point3f.newP (ptT));
break;
default:
pt.add (ptT);
}
break;
default:
this.errorStr (46, org.jmol.script.Token.nameOf (tok));
}
}
}if (minmaxtype == 256) return fout;
if (minmaxtype == 1048579) {
if (asVectorIfAll) return vout;
var len = vout.size ();
if (isString && !isExplicitlyAll && len == 1) return vout.get (0);
if (selectedFloat) {
fout =  Clazz.newFloatArray (len, 0);
for (var i = len; --i >= 0; ) {
var v = vout.get (i);
switch (mode) {
case 0:
fout[i] = (v).floatValue ();
break;
case 1:
fout[i] = (v).floatValue ();
break;
case 2:
fout[i] = org.jmol.util.Parser.parseFloatStr (v);
break;
case 3:
fout[i] = (v).distance (zero);
break;
}
}
return fout;
}if (tok == 1087373320) {
var sb =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < len; i++) sb.append (vout.get (i));

return sb.toString ();
}var sout =  new Array (len);
for (var i = len; --i >= 0; ) {
var v = vout.get (i);
if (Clazz.instanceOf (v, org.jmol.util.Point3f)) sout[i] = org.jmol.util.Escape.escapePt (v);
 else sout[i] = "" + vout.get (i);
}
return sout;
}if (isPt) return (n == 0 ? pt : org.jmol.util.Point3f.new3 (pt.x / n, pt.y / n, pt.z / n));
if (n == 0 || n == 1 && minmaxtype == 192) return Float.$valueOf (NaN);
if (isInt) {
switch (minmaxtype) {
case 32:
case 64:
return Integer.$valueOf (ivMinMax);
case 160:
case 192:
break;
case 128:
return Integer.$valueOf (Clazz.doubleToInt (sum));
default:
if (sum / n == Clazz.doubleToInt (sum / n)) return Integer.$valueOf (Clazz.doubleToInt (sum / n));
return Float.$valueOf ((sum / n));
}
}switch (minmaxtype) {
case 32:
case 64:
sum = fvMinMax;
break;
case 128:
break;
case 160:
sum = sum2;
break;
case 192:
sum = Math.sqrt ((sum2 - sum * sum / n) / (n - 1));
break;
default:
sum /= n;
break;
}
return Float.$valueOf (sum);
}, "org.jmol.util.BitSet,~N,org.jmol.util.Point3f,org.jmol.util.Point4f,~O,~O,~B,~N,~B");
Clazz.defineMethod (c$, "setBitsetProperty", 
($fz = function (bs, tok, iValue, fValue, tokenValue) {
if (this.isSyntaxCheck || org.jmol.util.BitSetUtil.cardinalityOf (bs) == 0) return;
var list = null;
var sValue = null;
var fvalues = null;
var pt;
var sv = null;
var nValues = 0;
var isStrProperty = org.jmol.script.Token.tokAttr (tok, 1087373312);
if (tokenValue.tok == 7) {
sv = (tokenValue).getList ();
if ((nValues = sv.size ()) == 0) return;
}switch (tok) {
case 1146095626:
case 1146095627:
case 1146095629:
case 1146095631:
switch (tokenValue.tok) {
case 8:
this.viewer.setAtomCoord (bs, tok, tokenValue.value);
break;
case 7:
this.theToken = tokenValue;
this.viewer.setAtomCoord (bs, tok, this.getPointArray (-1, nValues));
break;
}
return;
case 1766856708:
var value = null;
var prop = "color";
switch (tokenValue.tok) {
case 7:
var values =  Clazz.newIntArray (nValues, 0);
for (var i = nValues; --i >= 0; ) {
var svi = sv.get (i);
pt = org.jmol.script.ScriptVariable.ptValue (svi);
if (pt != null) {
values[i] = org.jmol.util.ColorUtil.colorPtToInt (pt);
} else if (svi.tok == 2) {
values[i] = svi.intValue;
} else {
values[i] = org.jmol.util.ColorUtil.getArgbFromString (svi.asString ());
if (values[i] == 0) values[i] = svi.asInt ();
}if (values[i] == 0) this.errorStr2 (50, "ARRAY", svi.asString ());
}
value = values;
prop = "colorValues";
break;
case 8:
value = Integer.$valueOf (org.jmol.util.ColorUtil.colorPtToInt (tokenValue.value));
break;
case 4:
value = tokenValue.value;
break;
default:
value = Integer.$valueOf (org.jmol.script.ScriptVariable.iValue (tokenValue));
break;
}
this.setShapePropertyBs (0, prop, value, bs);
return;
case 1826248715:
case 1288701960:
if (tokenValue.tok != 7) sValue = org.jmol.script.ScriptVariable.sValue (tokenValue);
break;
case 1087375365:
case 1095763976:
this.clearDefinedVariableAtomSets ();
isStrProperty = false;
break;
}
switch (tokenValue.tok) {
case 7:
if (isStrProperty) list = org.jmol.script.ScriptVariable.listValue (tokenValue);
 else fvalues = org.jmol.script.ScriptVariable.flistValue (tokenValue, nValues);
break;
case 4:
if (sValue == null) list = org.jmol.util.Parser.getTokens (org.jmol.script.ScriptVariable.sValue (tokenValue));
break;
}
if (list != null) {
nValues = list.length;
if (!isStrProperty) {
fvalues =  Clazz.newFloatArray (nValues, 0);
for (var i = nValues; --i >= 0; ) fvalues[i] = (tok == 1087375365 ? org.jmol.util.Elements.elementNumberFromSymbol (list[i], false) : org.jmol.util.Parser.parseFloatStr (list[i]));

}if (tokenValue.tok != 7 && nValues == 1) {
if (isStrProperty) sValue = list[0];
 else fValue = fvalues[0];
iValue = Clazz.floatToInt (fValue);
list = null;
fvalues = null;
}}this.viewer.setAtomProperty (bs, tok, iValue, fValue, sValue, fvalues, list);
}, $fz.isPrivate = true, $fz), "org.jmol.util.BitSet,~N,~N,~N,org.jmol.script.Token");
Clazz.defineMethod (c$, "getContextVariables", 
function () {
return this.contextVariables;
});
Clazz.defineMethod (c$, "getScript", 
function () {
return this.$script;
});
Clazz.defineMethod (c$, "compileScript", 
($fz = function (filename, strScript, debugCompiler) {
this.scriptFileName = filename;
strScript = this.fixScriptPath (strScript, filename);
this.restoreScriptContext (this.compiler.compile (filename, strScript, false, false, debugCompiler, false), false, false, false);
this.isStateScript = (this.$script.indexOf ("# Jmol state version ") >= 0);
this.forceNoAddHydrogens = (this.isStateScript && this.$script.indexOf ("pdbAddHydrogens") < 0);
var s = this.$script;
this.pc = this.setScriptExtensions ();
if (!this.isSyntaxCheck && this.viewer.isScriptEditorVisible () && strScript.indexOf ("\u0001## EDITOR_IGNORE ##") < 0) this.viewer.scriptStatus ("");
this.$script = s;
return !this.$error;
}, $fz.isPrivate = true, $fz), "~S,~S,~B");
Clazz.defineMethod (c$, "fixScriptPath", 
($fz = function (strScript, filename) {
if (filename != null && strScript.indexOf ("$SCRIPT_PATH$") >= 0) {
var path = filename;
var pt = Math.max (filename.lastIndexOf ("|"), filename.lastIndexOf ("/"));
path = path.substring (0, pt + 1);
strScript = org.jmol.util.TextFormat.simpleReplace (strScript, "$SCRIPT_PATH$/", path);
strScript = org.jmol.util.TextFormat.simpleReplace (strScript, "$SCRIPT_PATH$", path);
}return strScript;
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "setScriptExtensions", 
($fz = function () {
var extensions = this.scriptExtensions;
if (extensions == null) return 0;
var pt = extensions.indexOf ("##SCRIPT_STEP");
if (pt >= 0) {
this.executionStepping = true;
}pt = extensions.indexOf ("##SCRIPT_START=");
if (pt < 0) return 0;
pt = org.jmol.util.Parser.parseInt (extensions.substring (pt + 15));
if (pt == -2147483648) return 0;
for (this.pc = 0; this.pc < this.lineIndices.length; this.pc++) {
if (this.lineIndices[this.pc][0] > pt || this.lineIndices[this.pc][1] >= pt) break;
}
if (this.pc > 0 && this.pc < this.lineIndices.length && this.lineIndices[this.pc][0] > pt) --this.pc;
return this.pc;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "runScript", 
function (script) {
if (!this.viewer.isPreviewOnly ()) this.runScriptBuffer (script, this.outputBuffer);
}, "~S");
Clazz.defineMethod (c$, "compileScriptFileInternal", 
($fz = function (filename, localPath, remotePath, scriptPath) {
if (filename.toLowerCase ().indexOf ("javascript:") == 0) return this.compileScript (filename, this.viewer.jsEval (filename.substring (11)), this.debugScript);
var data =  new Array (2);
data[0] = filename;
if (!this.viewer.getFileAsStringBin (data, 2147483647, false)) {
this.setErrorMessage ("io error reading " + data[0] + ": " + data[1]);
return false;
}if (("\n" + data[1]).indexOf ("\nJmolManifest.txt\n") >= 0) {
var path;
if (filename.endsWith (".all.pngj") || filename.endsWith (".all.png")) {
path = "|state.spt";
filename += "|";
} else {
data[0] = filename += "|JmolManifest.txt";
if (!this.viewer.getFileAsStringBin (data, 2147483647, false)) {
this.setErrorMessage ("io error reading " + data[0] + ": " + data[1]);
return false;
}path = org.jmol.io.JmolBinary.getManifestScriptPath (data[1]);
}if (path != null && path.length > 0) {
data[0] = filename = filename.substring (0, filename.lastIndexOf ("|")) + path;
if (!this.viewer.getFileAsStringBin (data, 2147483647, false)) {
this.setErrorMessage ("io error reading " + data[0] + ": " + data[1]);
return false;
}}}this.scriptFileName = filename;
data[1] = org.jmol.io.JmolBinary.getEmbeddedScript (data[1]);
var script = this.fixScriptPath (data[1], data[0]);
if (scriptPath == null) {
scriptPath = this.viewer.getFilePath (filename, false);
scriptPath = scriptPath.substring (0, Math.max (scriptPath.lastIndexOf ("|"), scriptPath.lastIndexOf ("/")));
}script = org.jmol.viewer.FileManager.setScriptFileReferences (script, localPath, remotePath, scriptPath);
return this.compileScript (filename, script, this.debugScript);
}, $fz.isPrivate = true, $fz), "~S,~S,~S,~S");
Clazz.defineMethod (c$, "getParameter", 
($fz = function (key, tokType) {
var v = this.getContextVariableAsVariable (key);
if (v == null) v = this.viewer.getParameter (key);
switch (tokType) {
case 1073742190:
return org.jmol.script.ScriptVariable.getVariable (v);
case 4:
if (!(Clazz.instanceOf (v, java.util.List))) break;
var sv = v;
var sb =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < sv.size (); i++) sb.append (sv.get (i).asString ()).appendC ('\n');

return sb.toString ();
}
return (Clazz.instanceOf (v, org.jmol.script.ScriptVariable) ? org.jmol.script.ScriptVariable.oValue (v) : v);
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "getParameterEscaped", 
($fz = function ($var) {
var v = this.getContextVariableAsVariable ($var);
return (v == null ? "" + this.viewer.getParameterEscaped ($var) : v.escape ());
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getStringParameter", 
($fz = function ($var, orReturnName) {
var v = this.getContextVariableAsVariable ($var);
if (v != null) return v.asString ();
var val = "" + this.viewer.getParameter ($var);
return (val.length == 0 && orReturnName ? $var : val);
}, $fz.isPrivate = true, $fz), "~S,~B");
Clazz.defineMethod (c$, "getNumericParameter", 
($fz = function ($var) {
if ($var.equalsIgnoreCase ("_modelNumber")) {
var modelIndex = this.viewer.getCurrentModelIndex ();
return Integer.$valueOf (modelIndex < 0 ? 0 : this.viewer.getModelFileNumber (modelIndex));
}var v = this.getContextVariableAsVariable ($var);
if (v == null) {
var val = this.viewer.getParameter ($var);
if (!(Clazz.instanceOf (val, String))) return val;
v = org.jmol.script.ScriptVariable.newVariable (4, val);
}return org.jmol.script.ScriptVariable.nValue (v);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getContextVariableAsVariable", 
($fz = function ($var) {
if ($var.equals ("expressionBegin")) return null;
$var = $var.toLowerCase ();
if (this.contextVariables != null && this.contextVariables.containsKey ($var)) return this.contextVariables.get ($var);
var context = this.thisContext;
while (context != null) {
if (context.isFunction == true) return null;
if (context.contextVariables != null && context.contextVariables.containsKey ($var)) return context.contextVariables.get ($var);
context = context.parentContext;
}
return null;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getStringObjectAsVariable", 
($fz = function (s, key) {
if (s == null || s.length == 0) return s;
var v = org.jmol.script.ScriptVariable.unescapePointOrBitsetAsVariable (s);
if (Clazz.instanceOf (v, String) && key != null) v = this.viewer.setUserVariable (key, org.jmol.script.ScriptVariable.newVariable (4, v));
return v;
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "evalFunctionFloat", 
function (func, params, values) {
try {
var p = params;
for (var i = 0; i < values.length; i++) p.get (i).value =  new Float (values[i]);

var f = func;
return org.jmol.script.ScriptVariable.fValue (this.runFunctionRet (f, f.name, p, null, true, false));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return NaN;
} else {
throw e;
}
}
}, "~O,~O,~A");
Clazz.defineMethod (c$, "runFunctionRet", 
function ($function, name, params, tokenAtom, getReturn, setContextPath) {
if ($function == null) {
$function = this.viewer.getFunction (name);
if ($function == null) return null;
if (setContextPath) this.contextPath += " >> function " + name;
} else if (setContextPath) {
this.contextPath += " >> " + name;
}this.pushContext (null);
var isTry = ($function.tok == 364558);
this.thisContext.isTryCatch = isTry;
this.thisContext.isFunction = !isTry;
this.functionName = name;
if (Clazz.instanceOf ($function, org.jmol.thread.ScriptParallelProcessor)) {
{
this.parallelProcessor = $function;
this.vProcess = null;
this.runFunction ($function, params, tokenAtom);
var sc = this.getScriptContext ();
if (isTry) {
this.contextVariables.put ("_breakval",  new org.jmol.script.ScriptVariableInt (2147483647));
this.contextVariables.put ("_errorval", org.jmol.script.ScriptVariable.newVariable (4, ""));
this.viewer.resetError ();
this.parallelProcessor.addProcess ("try", sc);
}($function).runAllProcesses (this.viewer, !isTry);
if (isTry) {
var err = this.viewer.getParameter ("_errormessage");
if (err.length > 0) {
this.contextVariables.put ("_errorval", org.jmol.script.ScriptVariable.newVariable (4, err));
this.viewer.resetError ();
}this.contextVariables.put ("_tryret", this.contextVariables.get ("_retval"));
this.contextVariables.put ("_retval", org.jmol.script.ScriptVariable.newVariable (0, this.contextVariables));
}}} else {
this.runFunction ($function, params, tokenAtom);
}var v = (getReturn ? this.getContextVariableAsVariable ("_retval") : null);
this.popContext (false, false);
return v;
}, "org.jmol.script.ScriptFunction,~S,java.util.List,org.jmol.script.ScriptVariable,~B,~B");
Clazz.defineMethod (c$, "runFunction", 
($fz = function ($function, params, tokenAtom) {
this.aatoken = $function.aatoken;
this.lineNumbers = $function.lineNumbers;
this.lineIndices = $function.lineIndices;
this.$script = $function.script;
this.pc = 0;
if ($function.names != null) {
this.contextVariables =  new java.util.Hashtable ();
$function.setVariables (this.contextVariables, params);
}if (tokenAtom != null) this.contextVariables.put ("_x", tokenAtom);
if ($function.tok != 364558) this.instructionDispatchLoop (false);
}, $fz.isPrivate = true, $fz), "org.jmol.script.ScriptFunction,java.util.List,org.jmol.script.ScriptVariable");
Clazz.defineMethod (c$, "clearDefinedVariableAtomSets", 
($fz = function () {
this.definedAtomSets.remove ("# variable");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "defineSets", 
($fz = function () {
if (!this.definedAtomSets.containsKey ("# static")) {
for (var i = 0; i < org.jmol.viewer.JmolConstants.predefinedStatic.length; i++) this.defineAtomSet (org.jmol.viewer.JmolConstants.predefinedStatic[i]);

this.defineAtomSet ("# static");
}if (this.definedAtomSets.containsKey ("# variable")) return;
for (var i = 0; i < org.jmol.viewer.JmolConstants.predefinedVariable.length; i++) this.defineAtomSet (org.jmol.viewer.JmolConstants.predefinedVariable[i]);

for (var i = org.jmol.util.Elements.elementNumberMax; --i >= 0; ) {
var definition = " elemno=" + i;
this.defineAtomSet ("@" + org.jmol.util.Elements.elementNameFromNumber (i) + definition);
this.defineAtomSet ("@_" + org.jmol.util.Elements.elementSymbolFromNumber (i) + definition);
}
for (var i = 4; --i >= 0; ) {
var definition = "@" + org.jmol.util.Elements.altElementNameFromIndex (i) + " _e=" + org.jmol.util.Elements.altElementNumberFromIndex (i);
this.defineAtomSet (definition);
}
for (var i = org.jmol.util.Elements.altElementMax; --i >= 4; ) {
var ei = org.jmol.util.Elements.altElementNumberFromIndex (i);
var def = " _e=" + ei;
var definition = "@_" + org.jmol.util.Elements.altElementSymbolFromIndex (i);
this.defineAtomSet (definition + def);
definition = "@_" + org.jmol.util.Elements.altIsotopeSymbolFromIndex (i);
this.defineAtomSet (definition + def);
definition = "@_" + org.jmol.util.Elements.altIsotopeSymbolFromIndex2 (i);
this.defineAtomSet (definition + def);
definition = "@" + org.jmol.util.Elements.altElementNameFromIndex (i);
if (definition.length > 1) this.defineAtomSet (definition + def);
var e = org.jmol.util.Elements.getElementNumber (ei);
ei = org.jmol.util.Elements.getNaturalIsotope (e);
if (ei > 0) {
def = org.jmol.util.Elements.elementSymbolFromNumber (e);
this.defineAtomSet ("@_" + def + ei + " _e=" + e);
this.defineAtomSet ("@_" + ei + def + " _e=" + e);
}}
this.defineAtomSet ("# variable");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "defineAtomSet", 
($fz = function (script) {
if (script.indexOf ("#") == 0) {
this.definedAtomSets.put (script, Boolean.TRUE);
return;
}var sc = this.compiler.compile ("#predefine", script, true, false, false, false);
if (sc.errorType != null) {
this.viewer.scriptStatus ("JmolConstants.java ERROR: predefined set compile error:" + script + "\ncompile error:" + sc.errorMessageUntranslated);
return;
}if (sc.aatoken.length != 1) {
this.viewer.scriptStatus ("JmolConstants.java ERROR: predefinition does not have exactly 1 command:" + script);
return;
}var statement = sc.aatoken[0];
if (statement.length <= 2) {
this.viewer.scriptStatus ("JmolConstants.java ERROR: bad predefinition length:" + script);
return;
}var tok = statement[1].tok;
if (!org.jmol.script.Token.tokAttr (tok, 1073741824) && !org.jmol.script.Token.tokAttr (tok, 3145728)) {
this.viewer.scriptStatus ("JmolConstants.java ERROR: invalid variable name:" + script);
return;
}var name = (statement[1].value).toLowerCase ();
if (name.startsWith ("dynamic_")) name = "!" + name.substring (8);
this.definedAtomSets.put (name, statement);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "lookupIdentifierValue", 
($fz = function (identifier) {
var bs = this.lookupValue (identifier, false);
if (bs != null) return org.jmol.util.BitSetUtil.copy (bs);
bs = this.getAtomBits (1073741824, identifier);
return (bs == null ?  new org.jmol.util.BitSet () : bs);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "lookupValue", 
($fz = function (setName, plurals) {
if (this.isSyntaxCheck) {
return  new org.jmol.util.BitSet ();
}this.defineSets ();
setName = setName.toLowerCase ();
var value = this.definedAtomSets.get (setName);
var isDynamic = false;
if (value == null) {
value = this.definedAtomSets.get ("!" + setName);
isDynamic = (value != null);
}if (Clazz.instanceOf (value, org.jmol.util.BitSet)) return value;
if (Clazz.instanceOf (value, Array)) {
this.pushContext (null);
var bs = this.atomExpression (value, -2, 0, true, false, true, true);
this.popContext (false, false);
if (!isDynamic) this.definedAtomSets.put (setName, bs);
return bs;
}if (plurals) return null;
var len = setName.length;
if (len < 5) return null;
if (setName.charAt (len - 1) != 's') return null;
if (setName.endsWith ("ies")) setName = setName.substring (0, len - 3) + 'y';
 else setName = setName.substring (0, len - 1);
return this.lookupValue (setName, true);
}, $fz.isPrivate = true, $fz), "~S,~B");
Clazz.defineMethod (c$, "deleteAtomsInVariables", 
function (bsDeleted) {
for (var entry, $entry = this.definedAtomSets.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var value = entry.getValue ();
if (Clazz.instanceOf (value, org.jmol.util.BitSet)) {
org.jmol.util.BitSetUtil.deleteBits (value, bsDeleted);
if (!entry.getKey ().startsWith ("!")) this.viewer.setUserVariable ("@" + entry.getKey (), org.jmol.script.ScriptVariable.newVariable (10, value));
}}
}, "org.jmol.util.BitSet");
Clazz.defineMethod (c$, "setStatement", 
($fz = function (pc) {
this.statement = this.aatoken[pc];
this.statementLength = this.statement.length;
if (this.statementLength == 0) return true;
var fixed;
var i;
var tok;
for (i = 1; i < this.statementLength; i++) {
if (this.statement[i] == null) {
this.statementLength = i;
return true;
}if (this.statement[i].tok == 1060866) break;
}
if (i == this.statementLength) return i == this.statementLength;
switch (this.statement[0].tok) {
case 102436:
case 135368713:
case 1073741824:
if (this.tokAt (1) == 269484048) return true;
}
fixed =  new Array (this.statementLength);
fixed[0] = this.statement[0];
var isExpression = false;
var j = 1;
for (i = 1; i < this.statementLength; i++) {
if (this.statement[i] == null) continue;
switch (tok = this.getToken (i).tok) {
default:
fixed[j] = this.statement[i];
break;
case 1048577:
case 1048578:
isExpression = (tok == 1048577);
fixed[j] = this.statement[i];
break;
case 1060866:
if (++i == this.statementLength) this.error (22);
var v;
var forceString = (this.theToken.intValue == 4);
var s;
var $var = this.parameterAsString (i);
var isClauseDefine = (this.tokAt (i) == 1048577);
var isSetAt = (j == 1 && this.statement[0] === org.jmol.script.Token.tokenSetCmd);
if (isClauseDefine) {
var vt = this.parameterExpressionToken (++i);
i = this.iToken;
v = (vt.tok == 7 ? vt : org.jmol.script.ScriptVariable.oValue (vt));
} else {
if (this.tokAt (i) == 2) {
v = this.viewer.getAtomBits (1095763969, Integer.$valueOf (this.statement[i].intValue));
} else {
v = this.getParameter ($var, 0);
}if (!isExpression && !isSetAt) isClauseDefine = true;
}tok = this.tokAt (0);
forceString = new Boolean (forceString | (org.jmol.script.Token.tokAttr (tok, 20480) || tok == 135271429)).valueOf ();
if (Clazz.instanceOf (v, org.jmol.script.ScriptVariable)) {
fixed[j] = v;
if (isExpression && fixed[j].tok == 7) {
var bs = org.jmol.script.ScriptVariable.getBitSet (v, true);
fixed[j] = org.jmol.script.ScriptVariable.newVariable (10, bs == null ? org.jmol.script.ScriptEvaluator.getAtomBitSet (this, org.jmol.script.ScriptVariable.sValue (fixed[j])) : bs);
}} else if (Clazz.instanceOf (v, Boolean)) {
fixed[j] = ((v).booleanValue () ? org.jmol.script.Token.tokenOn : org.jmol.script.Token.tokenOff);
} else if (Clazz.instanceOf (v, Integer)) {
fixed[j] = org.jmol.script.Token.newTokenIntVal (2, (v).intValue (), v);
} else if (Clazz.instanceOf (v, Float)) {
fixed[j] = org.jmol.script.Token.newTokenIntVal (3, org.jmol.script.ScriptEvaluator.getFloatEncodedInt ("" + v), v);
} else if (Clazz.instanceOf (v, String)) {
if (!forceString) {
if ((tok != 1085443 || j > 1 && this.statement[1].tok != 537022465) && org.jmol.script.Token.tokAttr (tok, 36864)) {
v = this.getParameter (v, 1073742190);
}if (Clazz.instanceOf (v, String)) {
v = this.getStringObjectAsVariable (v, null);
}}if (Clazz.instanceOf (v, org.jmol.script.ScriptVariable)) {
fixed[j] = v;
} else {
s = v;
if (isExpression && !forceString) {
fixed[j] = org.jmol.script.Token.newTokenObj (10, org.jmol.script.ScriptEvaluator.getAtomBitSet (this, s));
} else {
if (!isExpression) {
}tok = (isSetAt ? org.jmol.script.Token.getTokFromName (s) : isClauseDefine || forceString || s.length == 0 || s.indexOf (".") >= 0 || s.indexOf (" ") >= 0 || s.indexOf ("=") >= 0 || s.indexOf (";") >= 0 || s.indexOf ("[") >= 0 || s.indexOf ("{") >= 0 ? 4 : 1073741824);
fixed[j] = org.jmol.script.Token.newTokenObj (tok, v);
}}} else if (Clazz.instanceOf (v, org.jmol.util.BitSet)) {
fixed[j] = org.jmol.script.ScriptVariable.newVariable (10, v);
} else if (Clazz.instanceOf (v, org.jmol.util.Point3f)) {
fixed[j] = org.jmol.script.ScriptVariable.newVariable (8, v);
} else if (Clazz.instanceOf (v, org.jmol.util.Point4f)) {
fixed[j] = org.jmol.script.ScriptVariable.newVariable (9, v);
} else if (Clazz.instanceOf (v, org.jmol.util.Matrix3f)) {
fixed[j] = org.jmol.script.ScriptVariable.newVariable (11, v);
} else if (Clazz.instanceOf (v, org.jmol.util.Matrix4f)) {
fixed[j] = org.jmol.script.ScriptVariable.newVariable (12, v);
} else if (Clazz.instanceOf (v, java.util.Map)) {
fixed[j] = org.jmol.script.ScriptVariable.newVariable (6, v);
} else if (Clazz.instanceOf (v, java.util.List)) {
var sv = v;
var bs = null;
for (var k = 0; k < sv.size (); k++) {
var svk = sv.get (k);
if (svk.tok != 10) {
bs = null;
break;
}if (bs == null) bs =  new org.jmol.util.BitSet ();
bs.or (svk.value);
}
fixed[j] = (bs == null ? org.jmol.script.ScriptVariable.getVariable (v) : org.jmol.script.Token.newTokenObj (10, bs));
} else {
var center = this.getObjectCenter ($var, -2147483648, -2147483648);
if (center == null) this.error (22);
fixed[j] = org.jmol.script.Token.newTokenObj (8, center);
}if (isSetAt && !org.jmol.script.Token.tokAttr (fixed[j].tok, 536870912)) this.error (22);
break;
}
j++;
}
this.statement = fixed;
for (i = j; i < this.statement.length; i++) this.statement[i] = null;

this.statementLength = j;
return true;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "clearState", 
($fz = function (tQuiet) {
this.thisContext = null;
this.scriptLevel = 0;
this.setErrorMessage (null);
this.contextPath = "";
this.tQuiet = tQuiet;
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "pushContext", 
function (token) {
if (this.scriptLevel == 100) this.error (44);
this.thisContext = this.getScriptContext ();
this.thisContext.token = token;
if (token == null) {
this.scriptLevel = ++this.thisContext.scriptLevel;
} else {
this.thisContext.scriptLevel = -1;
this.contextVariables =  new java.util.Hashtable ();
if (token.contextVariables != null) for (var key, $key = token.contextVariables.keySet ().iterator (); $key.hasNext () && ((key = $key.next ()) || true);) org.jmol.script.ScriptCompiler.addContextVariable (this.contextVariables, key);

}if (this.debugScript || this.isCmdLine_c_or_C_Option) org.jmol.util.Logger.info ("-->>-------------".substring (0, Math.max (17, this.scriptLevel + 5)) + this.scriptLevel + " " + this.scriptFileName + " " + token + " " + this.thisContext);
}, "org.jmol.script.ContextToken");
Clazz.defineMethod (c$, "getScriptContext", 
function () {
var context =  new org.jmol.script.ScriptContext ();
context.scriptLevel = this.scriptLevel;
context.parentContext = this.thisContext;
context.contextPath = this.contextPath;
context.scriptFileName = this.scriptFileName;
context.parallelProcessor = this.parallelProcessor;
context.functionName = this.functionName;
context.script = this.$script;
context.lineNumbers = this.lineNumbers;
context.lineIndices = this.lineIndices;
context.aatoken = this.aatoken;
context.statement = this.statement;
context.statementLength = this.statementLength;
context.pc = this.pc;
context.lineEnd = this.lineEnd;
context.pcEnd = this.pcEnd;
context.iToken = this.iToken;
context.outputBuffer = this.outputBuffer;
context.contextVariables = this.contextVariables;
context.isStateScript = this.isStateScript;
context.errorMessage = this.errorMessage;
context.errorType = this.errorType;
context.iCommandError = this.iCommandError;
context.isSyntaxCheck = this.isSyntaxCheck;
context.executionStepping = this.executionStepping;
context.executionPaused = this.executionPaused;
context.scriptExtensions = this.scriptExtensions;
return context;
});
Clazz.defineMethod (c$, "resume", 
function (sc) {
this.thisContext = sc;
if (this.thisContext.scriptLevel > 0) this.scriptLevel = this.thisContext.scriptLevel - 1;
this.restoreScriptContext (this.thisContext, true, false, false);
this.instructionDispatchLoop (false);
}, "org.jmol.script.ScriptContext");
Clazz.defineMethod (c$, "popContext", 
function (isFlowCommand, statementOnly) {
if (this.thisContext == null) return;
if (this.thisContext.scriptLevel > 0) this.scriptLevel = this.thisContext.scriptLevel - 1;
var scTemp = (isFlowCommand ? this.getScriptContext () : null);
this.restoreScriptContext (this.thisContext, true, isFlowCommand, statementOnly);
if (scTemp != null) this.restoreScriptContext (scTemp, true, false, true);
if (this.debugScript || this.isCmdLine_c_or_C_Option) org.jmol.util.Logger.info ("--<<-------------".substring (0, Math.max (17, this.scriptLevel + 5)) + this.scriptLevel + " " + this.scriptFileName + " " + (this.thisContext == null ? "" : "" + this.thisContext.token) + " " + this.thisContext);
}, "~B,~B");
Clazz.defineMethod (c$, "restoreScriptContext", 
($fz = function (context, isPopContext, isFlowCommand, statementOnly) {
if (context == null) return;
if (!isFlowCommand) {
this.statement = context.statement;
this.statementLength = context.statementLength;
this.pc = context.pc;
this.lineEnd = context.lineEnd;
this.pcEnd = context.pcEnd;
if (statementOnly) return;
}this.$script = context.script;
this.lineNumbers = context.lineNumbers;
this.lineIndices = context.lineIndices;
this.aatoken = context.aatoken;
this.contextVariables = context.contextVariables;
this.scriptExtensions = context.scriptExtensions;
if (isPopContext) {
this.contextPath = context.contextPath;
this.scriptFileName = context.scriptFileName;
this.parallelProcessor = context.parallelProcessor;
this.functionName = context.functionName;
this.iToken = context.iToken;
this.outputBuffer = context.outputBuffer;
this.isStateScript = context.isStateScript;
this.thisContext = context.parentContext;
} else {
this.$error = (context.errorType != null);
this.errorMessage = context.errorMessage;
this.errorMessageUntranslated = context.errorMessageUntranslated;
this.iCommandError = context.iCommandError;
this.errorType = context.errorType;
}}, $fz.isPrivate = true, $fz), "org.jmol.script.ScriptContext,~B,~B,~B");
Clazz.defineMethod (c$, "getContext", 
($fz = function (withVariables) {
var sb =  new org.jmol.util.StringXBuilder ();
var context = this.thisContext;
while (context != null) {
if (withVariables) {
if (context.contextVariables != null) {
sb.append (this.getScriptID (context));
sb.append (org.jmol.viewer.StateManager.getVariableList (context.contextVariables, 80, true, false));
}} else {
sb.append (org.jmol.script.ScriptEvaluator.setErrorLineMessage (context.functionName, context.scriptFileName, this.getLinenumber (context), context.pc, org.jmol.script.ScriptEvaluator.statementAsString (context.statement, -9999, this.logMessages)));
}context = context.parentContext;
}
if (withVariables) {
if (this.contextVariables != null) {
sb.append (this.getScriptID (null));
sb.append (org.jmol.viewer.StateManager.getVariableList (this.contextVariables, 80, true, false));
}} else {
sb.append (org.jmol.script.ScriptEvaluator.setErrorLineMessage (this.functionName, this.scriptFileName, this.getLinenumber (null), this.pc, org.jmol.script.ScriptEvaluator.statementAsString (this.statement, -9999, this.logMessages)));
}return sb.toString ();
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getLinenumber", 
($fz = function (c) {
return (c == null ? this.lineNumbers[this.pc] : c.lineNumbers[c.pc]);
}, $fz.isPrivate = true, $fz), "org.jmol.script.ScriptContext");
Clazz.defineMethod (c$, "getScriptID", 
($fz = function (context) {
var fuName = (context == null ? this.functionName : "function " + context.functionName);
var fiName = (context == null ? this.scriptFileName : context.scriptFileName);
return "\n# " + fuName + " (file " + fiName + ")\n";
}, $fz.isPrivate = true, $fz), "org.jmol.script.ScriptContext");
Clazz.defineMethod (c$, "getErrorMessage", 
function () {
return this.errorMessage;
});
Clazz.defineMethod (c$, "getErrorMessageUntranslated", 
function () {
return this.errorMessageUntranslated == null ? this.errorMessage : this.errorMessageUntranslated;
});
Clazz.defineMethod (c$, "setErrorMessage", 
($fz = function (err) {
this.errorMessageUntranslated = null;
if (err == null) {
this.$error = false;
this.errorType = null;
this.errorMessage = null;
this.iCommandError = -1;
return;
}this.$error = true;
if (this.errorMessage == null) this.errorMessage = org.jmol.i18n.GT._ ("script ERROR: ");
this.errorMessage += err;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "planeExpected", 
($fz = function () {
this.errorMore (38, "{a b c d}", "\"xy\" \"xz\" \"yz\" \"x=...\" \"y=...\" \"z=...\"", "$xxxxx");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "integerOutOfRange", 
($fz = function (min, max) {
this.errorStr2 (21, "" + min, "" + max);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "numberOutOfRange", 
($fz = function (min, max) {
this.errorStr2 (36, "" + min, "" + max);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "errorAt", 
function (iError, i) {
this.iToken = i;
this.error (iError, null, null, null, false);
}, "~N,~N");
Clazz.defineMethod (c$, "error", 
function (iError) {
this.error (iError, null, null, null, false);
}, "~N");
Clazz.defineMethod (c$, "errorStr", 
function (iError, value) {
this.error (iError, value, null, null, false);
}, "~N,~S");
Clazz.defineMethod (c$, "errorStr2", 
function (iError, value, more) {
this.error (iError, value, more, null, false);
}, "~N,~S,~S");
Clazz.defineMethod (c$, "errorMore", 
function (iError, value, more, more2) {
this.error (iError, value, more, more2, false);
}, "~N,~S,~S,~S");
Clazz.defineMethod (c$, "warning", 
($fz = function (iError, value, more) {
this.error (iError, value, more, null, true);
}, $fz.isPrivate = true, $fz), "~N,~S,~S");
Clazz.defineMethod (c$, "error", 
function (iError, value, more, more2, warningOnly) {
var strError = this.ignoreError ? null : org.jmol.script.ScriptEvaluator.errorString (iError, value, more, more2, true);
var strUntranslated = (!this.ignoreError && org.jmol.i18n.GT.getDoTranslate () ? org.jmol.script.ScriptEvaluator.errorString (iError, value, more, more2, false) : null);
if (!warningOnly) this.evalError (strError, strUntranslated);
this.showString (strError);
}, "~N,~S,~S,~S,~B");
Clazz.defineMethod (c$, "evalError", 
function (message, strUntranslated) {
if (this.ignoreError) throw  new NullPointerException ();
if (!this.isSyntaxCheck) {
this.setCursorWait (false);
this.viewer.setBooleanProperty ("refreshing", true);
this.viewer.setStringProperty ("_errormessage", strUntranslated);
}throw  new org.jmol.script.ScriptException (this, message, strUntranslated, true);
}, "~S,~S");
c$.errorString = Clazz.defineMethod (c$, "errorString", 
function (iError, value, more, more2, translated) {
var doTranslate = false;
if (!translated && (doTranslate = org.jmol.i18n.GT.getDoTranslate ()) == true) org.jmol.i18n.GT.setDoTranslate (false);
var msg;
switch (iError) {
default:
msg = "Unknown error message number: " + iError;
break;
case 0:
msg = org.jmol.i18n.GT._ ("x y z axis expected");
break;
case 1:
msg = org.jmol.i18n.GT._ ("{0} not allowed with background model displayed");
break;
case 2:
msg = org.jmol.i18n.GT._ ("bad argument count");
break;
case 3:
msg = org.jmol.i18n.GT._ ("Miller indices cannot all be zero.");
break;
case 4:
msg = org.jmol.i18n.GT._ ("bad [R,G,B] color");
break;
case 5:
msg = org.jmol.i18n.GT._ ("boolean expected");
break;
case 6:
msg = org.jmol.i18n.GT._ ("boolean or number expected");
break;
case 7:
msg = org.jmol.i18n.GT._ ("boolean, number, or {0} expected");
break;
case 56:
msg = org.jmol.i18n.GT._ ("cannot set value");
break;
case 8:
msg = org.jmol.i18n.GT._ ("color expected");
break;
case 9:
msg = org.jmol.i18n.GT._ ("a color or palette name (Jmol, Rasmol) is required");
break;
case 10:
msg = org.jmol.i18n.GT._ ("command expected");
break;
case 11:
msg = org.jmol.i18n.GT._ ("{x y z} or $name or (atom expression) required");
break;
case 12:
msg = org.jmol.i18n.GT._ ("draw object not defined");
break;
case 13:
msg = org.jmol.i18n.GT._ ("unexpected end of script command");
break;
case 14:
msg = org.jmol.i18n.GT._ ("valid (atom expression) expected");
break;
case 15:
msg = org.jmol.i18n.GT._ ("(atom expression) or integer expected");
break;
case 16:
msg = org.jmol.i18n.GT._ ("filename expected");
break;
case 17:
msg = org.jmol.i18n.GT._ ("file not found");
break;
case 18:
msg = org.jmol.i18n.GT._ ("incompatible arguments");
break;
case 19:
msg = org.jmol.i18n.GT._ ("insufficient arguments");
break;
case 20:
msg = org.jmol.i18n.GT._ ("integer expected");
break;
case 21:
msg = org.jmol.i18n.GT._ ("integer out of range ({0} - {1})");
break;
case 22:
msg = org.jmol.i18n.GT._ ("invalid argument");
break;
case 23:
msg = org.jmol.i18n.GT._ ("invalid parameter order");
break;
case 24:
msg = org.jmol.i18n.GT._ ("keyword expected");
break;
case 25:
msg = org.jmol.i18n.GT._ ("no MO coefficient data available");
break;
case 26:
msg = org.jmol.i18n.GT._ ("An MO index from 1 to {0} is required");
break;
case 27:
msg = org.jmol.i18n.GT._ ("no MO basis/coefficient data available for this frame");
break;
case 28:
msg = org.jmol.i18n.GT._ ("no MO occupancy data available");
break;
case 29:
msg = org.jmol.i18n.GT._ ("Only one molecular orbital is available in this file");
break;
case 30:
msg = org.jmol.i18n.GT._ ("{0} require that only one model be displayed");
break;
case 55:
msg = org.jmol.i18n.GT._ ("{0} requires that only one model be loaded");
break;
case 31:
msg = org.jmol.i18n.GT._ ("No data available");
break;
case 32:
msg = org.jmol.i18n.GT._ ("No partial charges were read from the file; Jmol needs these to render the MEP data.");
break;
case 33:
msg = org.jmol.i18n.GT._ ("No unit cell");
break;
case 34:
msg = org.jmol.i18n.GT._ ("number expected");
break;
case 35:
msg = org.jmol.i18n.GT._ ("number must be ({0} or {1})");
break;
case 36:
msg = org.jmol.i18n.GT._ ("decimal number out of range ({0} - {1})");
break;
case 37:
msg = org.jmol.i18n.GT._ ("object name expected after '$'");
break;
case 38:
msg = org.jmol.i18n.GT._ ("plane expected -- either three points or atom expressions or {0} or {1} or {2}");
break;
case 39:
msg = org.jmol.i18n.GT._ ("property name expected");
break;
case 40:
msg = org.jmol.i18n.GT._ ("space group {0} was not found.");
break;
case 41:
msg = org.jmol.i18n.GT._ ("quoted string expected");
break;
case 42:
msg = org.jmol.i18n.GT._ ("quoted string or identifier expected");
break;
case 43:
msg = org.jmol.i18n.GT._ ("too many rotation points were specified");
break;
case 44:
msg = org.jmol.i18n.GT._ ("too many script levels");
break;
case 45:
msg = org.jmol.i18n.GT._ ("unrecognized atom property");
break;
case 46:
msg = org.jmol.i18n.GT._ ("unrecognized bond property");
break;
case 47:
msg = org.jmol.i18n.GT._ ("unrecognized command");
break;
case 48:
msg = org.jmol.i18n.GT._ ("runtime unrecognized expression");
break;
case 49:
msg = org.jmol.i18n.GT._ ("unrecognized object");
break;
case 50:
msg = org.jmol.i18n.GT._ ("unrecognized {0} parameter");
break;
case 51:
msg = org.jmol.i18n.GT._ ("unrecognized {0} parameter in Jmol state script (set anyway)");
break;
case 52:
msg = org.jmol.i18n.GT._ ("unrecognized SHOW parameter --  use {0}");
break;
case 53:
msg = "{0}";
break;
case 54:
msg = org.jmol.i18n.GT._ ("write what? {0} or {1} \"filename\"");
break;
}
if (msg.indexOf ("{0}") < 0) {
if (value != null) msg += ": " + value;
} else {
msg = org.jmol.util.TextFormat.simpleReplace (msg, "{0}", value);
if (msg.indexOf ("{1}") >= 0) msg = org.jmol.util.TextFormat.simpleReplace (msg, "{1}", more);
 else if (more != null) msg += ": " + more;
if (msg.indexOf ("{2}") >= 0) msg = org.jmol.util.TextFormat.simpleReplace (msg, "{2}", more);
}if (doTranslate) org.jmol.i18n.GT.setDoTranslate (true);
return msg;
}, "~N,~S,~S,~S,~B");
c$.setErrorLineMessage = Clazz.defineMethod (c$, "setErrorLineMessage", 
function (functionName, filename, lineCurrent, pcCurrent, lineInfo) {
var err = "\n----";
if (filename != null || functionName != null) err += "line " + lineCurrent + " command " + (pcCurrent + 1) + " of " + (functionName == null ? filename : functionName.equals ("try") ? "try" : "function " + functionName) + ":";
err += "\n         " + lineInfo;
return err;
}, "~S,~S,~N,~N,~S");
Clazz.defineMethod (c$, "toString", 
function () {
var str =  new org.jmol.util.StringXBuilder ();
str.append ("Eval\n pc:");
str.appendI (this.pc);
str.append ("\n");
str.appendI (this.aatoken.length);
str.append (" statements\n");
for (var i = 0; i < this.aatoken.length; ++i) {
str.append ("----\n");
var atoken = this.aatoken[i];
for (var j = 0; j < atoken.length; ++j) {
str.appendO (atoken[j]);
str.appendC ('\n');
}
str.appendC ('\n');
}
str.append ("END\n");
return str.toString ();
});
c$.statementAsString = Clazz.defineMethod (c$, "statementAsString", 
function (statement, iTok, doLogMessages) {
if (statement.length == 0) return "";
var sb =  new org.jmol.util.StringXBuilder ();
var tok = statement[0].tok;
switch (tok) {
case 0:
return statement[0].value;
case 1150985:
if (statement.length == 2 && (statement[1].tok == 135368713 || statement[1].tok == 102436)) return ((statement[1].value)).toString ();
}
var useBraces = true;
var inBrace = false;
var inClauseDefine = false;
var setEquals = (statement.length > 1 && tok == 1085443 && statement[0].value.equals ("") && (statement[0].intValue == 61 || statement[0].intValue == 35) && statement[1].tok != 1048577);
var len = statement.length;
for (var i = 0; i < len; ++i) {
var token = statement[i];
if (token == null) {
len = i;
break;
}if (iTok == i - 1) sb.append (" <<");
if (i != 0) sb.appendC (' ');
if (i == 2 && setEquals) {
if ((setEquals = (token.tok != 269484436)) || statement[0].intValue == 35) {
sb.append (setEquals ? "= " : "== ");
if (!setEquals) continue;
}}if (iTok == i && token.tok != 1048578) sb.append (">> ");
switch (token.tok) {
case 1048577:
if (useBraces) sb.append ("{");
continue;
case 1048578:
if (inClauseDefine && i == statement.length - 1) useBraces = false;
if (useBraces) sb.append ("}");
continue;
case 269484096:
case 269484097:
break;
case 1048586:
case 1048590:
inBrace = (token.tok == 1048586);
break;
case 1060866:
if (i > 0 && (token.value).equals ("define")) {
sb.append ("@");
if (i + 1 < statement.length && statement[i + 1].tok == 1048577) {
if (!useBraces) inClauseDefine = true;
useBraces = true;
}continue;
}break;
case 1048589:
sb.append ("true");
continue;
case 1048588:
sb.append ("false");
continue;
case 135280132:
break;
case 2:
sb.appendI (token.intValue);
continue;
case 8:
case 9:
case 10:
sb.append (org.jmol.script.ScriptVariable.sValue (token));
continue;
case 7:
case 6:
sb.append ((token).escape ());
continue;
case 5:
sb.appendC ('^');
continue;
case 1048615:
if (token.intValue != 2147483647) sb.appendI (token.intValue);
 else sb.append (org.jmol.modelset.Group.getSeqcodeString (org.jmol.script.ScriptEvaluator.getSeqCode (token)));
token = statement[++i];
sb.appendC (' ');
sb.append (inBrace ? "-" : "- ");
case 1048614:
if (token.intValue != 2147483647) sb.appendI (token.intValue);
 else sb.append (org.jmol.modelset.Group.getSeqcodeString (org.jmol.script.ScriptEvaluator.getSeqCode (token)));
continue;
case 1048609:
sb.append ("*:");
sb.appendC (String.fromCharCode (token.intValue));
continue;
case 1048607:
sb.append ("*%");
if (token.value != null) sb.append (token.value.toString ());
continue;
case 1048610:
sb.append ("*/");
case 1048611:
case 3:
if (token.intValue < 2147483647) {
sb.append (org.jmol.util.Escape.escapeModelFileNumber (token.intValue));
} else {
sb.append ("" + token.value);
}continue;
case 1048613:
sb.appendC ('[');
sb.append (org.jmol.modelset.Group.getGroup3 (token.intValue));
sb.appendC (']');
continue;
case 1048612:
sb.appendC ('[');
sb.appendO (token.value);
sb.appendC (']');
continue;
case 1048608:
sb.append ("*.");
break;
case 1095761925:
if (Clazz.instanceOf (token.value, org.jmol.util.Point3f)) {
var pt = token.value;
sb.append ("cell=").append (org.jmol.util.Escape.escapePt (pt));
continue;
}break;
case 4:
sb.append ("\"").appendO (token.value).append ("\"");
continue;
case 269484436:
case 269484434:
case 269484433:
case 269484432:
case 269484435:
case 269484438:
if (token.intValue == 1716520973) {
sb.append (statement[++i].value).append (" ");
} else if (token.intValue != 2147483647) sb.append (org.jmol.script.Token.nameOf (token.intValue)).append (" ");
break;
case 364558:
continue;
case 1150985:
sb.append ("end");
continue;
default:
if (org.jmol.script.Token.tokAttr (token.tok, 1073741824) || !doLogMessages) break;
sb.appendC ('\n').append (token.toString ()).appendC ('\n');
continue;
}
if (token.value != null) sb.append (token.value.toString ());
}
if (iTok >= len - 1 && iTok != 9999) sb.append (" <<");
return sb.toString ();
}, "~A,~N,~B");
Clazz.defineMethod (c$, "getShapeProperty", 
($fz = function (shapeType, propertyName) {
return this.shapeManager.getShapePropertyIndex (shapeType, propertyName, -2147483648);
}, $fz.isPrivate = true, $fz), "~N,~S");
Clazz.defineMethod (c$, "getShapePropertyData", 
($fz = function (shapeType, propertyName, data) {
return this.shapeManager.getShapePropertyData (shapeType, propertyName, data);
}, $fz.isPrivate = true, $fz), "~N,~S,~A");
Clazz.defineMethod (c$, "getShapePropertyIndex", 
($fz = function (shapeType, propertyName, index) {
return this.shapeManager.getShapePropertyIndex (shapeType, propertyName, index);
}, $fz.isPrivate = true, $fz), "~N,~S,~N");
Clazz.defineMethod (c$, "addShapeProperty", 
($fz = function (propertyList, key, value) {
if (this.isSyntaxCheck) return;
propertyList.add ([key, value]);
}, $fz.isPrivate = true, $fz), "java.util.List,~S,~O");
Clazz.defineMethod (c$, "setObjectMad", 
($fz = function (iShape, name, mad) {
if (this.isSyntaxCheck) return;
this.viewer.setObjectMad (iShape, name, mad);
}, $fz.isPrivate = true, $fz), "~N,~S,~N");
Clazz.defineMethod (c$, "setObjectArgb", 
($fz = function (str, argb) {
if (this.isSyntaxCheck) return;
this.viewer.setObjectArgb (str, argb);
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "setShapeProperty", 
($fz = function (shapeType, propertyName, propertyValue) {
if (this.isSyntaxCheck) return;
this.shapeManager.setShapePropertyBs (shapeType, propertyName, propertyValue, null);
}, $fz.isPrivate = true, $fz), "~N,~S,~O");
Clazz.defineMethod (c$, "setShapePropertyBs", 
($fz = function (iShape, propertyName, propertyValue, bs) {
if (this.isSyntaxCheck) return;
this.shapeManager.setShapePropertyBs (iShape, propertyName, propertyValue, bs);
}, $fz.isPrivate = true, $fz), "~N,~S,~O,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "setShapeSizeBs", 
($fz = function (shapeType, size, bs) {
if (this.isSyntaxCheck) return;
this.shapeManager.setShapeSizeBs (shapeType, size, null, bs);
}, $fz.isPrivate = true, $fz), "~N,~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "setShapeSize", 
($fz = function (shapeType, rd) {
if (this.isSyntaxCheck) return;
this.shapeManager.setShapeSizeBs (shapeType, 0, rd, null);
}, $fz.isPrivate = true, $fz), "~N,org.jmol.atomdata.RadiusData");
Clazz.defineMethod (c$, "setBooleanProperty", 
($fz = function (key, value) {
if (!this.isSyntaxCheck) this.viewer.setBooleanProperty (key, value);
}, $fz.isPrivate = true, $fz), "~S,~B");
Clazz.defineMethod (c$, "setIntProperty", 
($fz = function (key, value) {
if (!this.isSyntaxCheck) this.viewer.setIntProperty (key, value);
return true;
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "setFloatProperty", 
($fz = function (key, value) {
if (!this.isSyntaxCheck) this.viewer.setFloatProperty (key, value);
return true;
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "setStringProperty", 
($fz = function (key, value) {
if (!this.isSyntaxCheck) this.viewer.setStringProperty (key, value);
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "showString", 
($fz = function (str) {
this.showStringPrint (str, false);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "showStringPrint", 
($fz = function (str, isPrint) {
if (this.isSyntaxCheck || str == null) return;
if (this.outputBuffer != null) this.outputBuffer.append (str).appendC ('\n');
 else this.viewer.showString (str, isPrint);
}, $fz.isPrivate = true, $fz), "~S,~B");
Clazz.defineMethod (c$, "scriptStatusOrBuffer", 
($fz = function (s) {
if (this.isSyntaxCheck) return;
if (this.outputBuffer != null) {
this.outputBuffer.append (s).appendC ('\n');
return;
}this.viewer.scriptStatus (s);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "atomExpressionAt", 
($fz = function (index) {
if (!this.checkToken (index)) this.errorAt (2, index);
return this.atomExpression (this.statement, index, 0, true, false, true, true);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "atomExpression", 
($fz = function (code, pcStart, pcStop, allowRefresh, allowUnderflow, mustBeBitSet, andNotDeleted) {
this.isBondSet = false;
if (code !== this.statement) {
this.tempStatement = this.statement;
this.statement = code;
}var rpn =  new org.jmol.script.ScriptMathProcessor (this, false, false, mustBeBitSet);
var val;
var comparisonValue = 2147483647;
var refreshed = false;
this.iToken = 1000;
var ignoreSubset = (pcStart < 0);
var isInMath = false;
var nExpress = 0;
var atomCount = this.viewer.getAtomCount ();
if (ignoreSubset) pcStart = -pcStart;
ignoreSubset = new Boolean (ignoreSubset | this.isSyntaxCheck).valueOf ();
if (pcStop == 0 && code.length > pcStart) pcStop = pcStart + 1;
expression_loop : for (var pc = pcStart; pc < pcStop; ++pc) {
this.iToken = pc;
var instruction = code[pc];
if (instruction == null) break;
var value = instruction.value;
switch (instruction.tok) {
case 1048577:
pcStart = pc;
pcStop = code.length;
nExpress++;
break;
case 1048578:
nExpress--;
if (nExpress > 0) continue;
break expression_loop;
case 1048586:
if (this.isPoint3f (pc)) {
var pt = this.getPoint3f (pc, true);
if (pt != null) {
rpn.addXPt (pt);
pc = this.iToken;
break;
}}break;
case 1048590:
if (pc > 0 && code[pc - 1].tok == 1048586) rpn.addXBs ( new org.jmol.util.BitSet ());
break;
case 269484096:
isInMath = true;
rpn.addOp (instruction);
break;
case 269484097:
isInMath = false;
rpn.addOp (instruction);
break;
case 1060866:
rpn.addXBs (org.jmol.script.ScriptEvaluator.getAtomBitSet (this, value));
break;
case 135267841:
rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (instruction));
rpn.addXVar (org.jmol.script.ScriptVariable.newVariable (9, this.hklParameter (pc + 2)));
pc = this.iToken;
break;
case 135266319:
rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (instruction));
rpn.addXVar (org.jmol.script.ScriptVariable.newVariable (9, this.planeParameter (pc + 2)));
pc = this.iToken;
break;
case 1048582:
rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (instruction));
rpn.addXPt (this.getPoint3f (pc + 2, true));
pc = this.iToken;
break;
case 4:
var s = value;
if (s.indexOf ("({") == 0) {
var bs = org.jmol.util.Escape.unescapeBitset (s);
if (bs != null) {
rpn.addXBs (bs);
break;
}}rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (instruction));
if (s.equals ("hkl")) {
rpn.addXVar (org.jmol.script.ScriptVariable.newVariable (9, this.hklParameter (pc + 2)));
pc = this.iToken;
}break;
case 135267336:
case 135267335:
case 1238369286:
case 135266324:
case 135402505:
case 135266310:
case 269484080:
rpn.addOp (instruction);
break;
case 1048579:
rpn.addXBs (this.viewer.getModelUndeletedAtomsBitSet (-1));
break;
case 1048587:
rpn.addXBs ( new org.jmol.util.BitSet ());
break;
case 1048589:
case 1048588:
rpn.addXVar (org.jmol.script.ScriptVariable.newScriptVariableToken (instruction));
break;
case 1114638350:
rpn.addXBs (org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSet (false)));
break;
case 3158024:
var bsSubset = this.viewer.getSelectionSubset ();
rpn.addXBs (bsSubset == null ? this.viewer.getModelUndeletedAtomsBitSet (-1) : org.jmol.util.BitSetUtil.copy (bsSubset));
break;
case 3145770:
rpn.addXBs (org.jmol.util.BitSetUtil.copy (this.viewer.getHiddenSet ()));
break;
case 1060869:
rpn.addXBs (org.jmol.util.BitSetUtil.copy (this.viewer.getMotionFixedAtoms ()));
break;
case 3145768:
rpn.addXBs (org.jmol.util.BitSetUtil.copyInvert (this.viewer.getHiddenSet (), atomCount));
break;
case 3145776:
rpn.addXBs (this.viewer.getBaseModelBitSet ());
break;
case 3145774:
if (!this.isSyntaxCheck && !refreshed) this.viewer.setModelVisibility ();
refreshed = true;
rpn.addXBs (this.viewer.getVisibleSet ());
break;
case 3145766:
if (!this.isSyntaxCheck && allowRefresh) this.refresh ();
rpn.addXBs (this.viewer.getClickableSet ());
break;
case 1048608:
if (this.viewer.allowSpecAtom ()) {
var atomID = instruction.intValue;
if (atomID > 0) rpn.addXBs (this.compareInt (1095761922, 269484436, atomID));
 else rpn.addXBs (this.getAtomBits (instruction.tok, value));
} else {
rpn.addXBs (this.lookupIdentifierValue ("_" + value));
}break;
case 3145764:
case 3145732:
case 1613758470:
case 1048585:
case 3145742:
case 3145744:
case 3145746:
case 3145748:
case 3145750:
case 1048612:
case 1048607:
case 3145772:
case 1089470478:
case 1614417948:
rpn.addXBs (this.getAtomBits (instruction.tok, value));
break;
case 1048610:
case 1048611:
var iModel = instruction.intValue;
if (iModel == 2147483647 && Clazz.instanceOf (value, Integer)) {
iModel = (value).intValue ();
if (!this.viewer.haveFileSet ()) {
rpn.addXBs (this.getAtomBits (1048610, Integer.$valueOf (iModel)));
break;
}if (iModel <= 2147) iModel = iModel * 1000000;
}rpn.addXBs (this.bitSetForModelFileNumber (iModel));
break;
case 1048613:
case 1048609:
rpn.addXBs (this.getAtomBits (instruction.tok,  new Integer (instruction.intValue)));
break;
case 1048614:
if (isInMath) rpn.addXNum ( new org.jmol.script.ScriptVariableInt (instruction.intValue));
 else rpn.addXBs (this.getAtomBits (1048614,  new Integer (org.jmol.script.ScriptEvaluator.getSeqCode (instruction))));
break;
case 1048615:
if (isInMath) {
rpn.addXNum ( new org.jmol.script.ScriptVariableInt (instruction.intValue));
rpn.addOp (org.jmol.script.Token.tokenMinus);
rpn.addXNum ( new org.jmol.script.ScriptVariableInt (code[++pc].intValue));
break;
}var chainID = (pc + 3 < code.length && code[pc + 2].tok == 269484160 && code[pc + 3].tok == 1048609 ? code[pc + 3].intValue : 9);
rpn.addXBs (this.getAtomBits (1048615, [org.jmol.script.ScriptEvaluator.getSeqCode (instruction), org.jmol.script.ScriptEvaluator.getSeqCode (code[++pc]), chainID]));
if (chainID != 9) pc += 2;
break;
case 1095761925:
var pt = value;
rpn.addXBs (this.getAtomBits (1095761925, [Clazz.doubleToInt (Math.floor (pt.x * 1000)), Clazz.doubleToInt (Math.floor (pt.y * 1000)), Clazz.doubleToInt (Math.floor (pt.z * 1000))]));
break;
case 3145758:
rpn.addXBs (this.viewer.getModelUndeletedAtomsBitSet (this.viewer.getCurrentModelIndex ()));
break;
case 1613758476:
case 3145730:
case 1115297793:
case 1613758488:
case 137363468:
case 3145735:
case 3145736:
case 3145738:
case 3145754:
case 3145756:
rpn.addXBs (this.lookupIdentifierValue (value));
break;
case 269484435:
case 269484434:
case 269484433:
case 269484432:
case 269484436:
case 269484438:
if (pc + 1 == code.length) this.error (22);
val = code[++pc].value;
var tokOperator = instruction.tok;
var tokWhat = instruction.intValue;
var property = (tokWhat == 1716520973 ? val : null);
if (property != null) {
if (pc + 1 == code.length) this.error (22);
val = code[++pc].value;
}if (tokWhat == 1095766022 && tokOperator != 269484436) this.error (22);
if (this.isSyntaxCheck) {
rpn.addXBs ( new org.jmol.util.BitSet ());
break;
}var isModel = (tokWhat == 1095766028);
var isIntProperty = org.jmol.script.Token.tokAttr (tokWhat, 1095761920);
var isFloatProperty = org.jmol.script.Token.tokAttr (tokWhat, 1112539136);
var isIntOrFloat = isIntProperty && isFloatProperty;
var isStringProperty = !isIntProperty && org.jmol.script.Token.tokAttr (tokWhat, 1087373312);
if (tokWhat == 1087375365) isIntProperty = !(isStringProperty = false);
var tokValue = code[pc].tok;
comparisonValue = code[pc].intValue;
var comparisonFloat = NaN;
if (Clazz.instanceOf (val, org.jmol.util.Point3f)) {
if (tokWhat == 1766856708) {
comparisonValue = org.jmol.util.ColorUtil.colorPtToInt (val);
tokValue = 2;
isIntProperty = true;
}} else if (Clazz.instanceOf (val, String)) {
if (tokWhat == 1766856708) {
comparisonValue = org.jmol.util.ColorUtil.getArgbFromString (val);
if (comparisonValue == 0 && org.jmol.script.Token.tokAttr (tokValue, 1073741824)) {
val = this.getStringParameter (val, true);
if ((val).startsWith ("{")) {
val = org.jmol.util.Escape.unescapePoint (val);
if (Clazz.instanceOf (val, org.jmol.util.Point3f)) comparisonValue = org.jmol.util.ColorUtil.colorPtToInt (val);
 else comparisonValue = 0;
} else {
comparisonValue = org.jmol.util.ColorUtil.getArgbFromString (val);
}}tokValue = 2;
isIntProperty = true;
} else if (isStringProperty) {
if (org.jmol.script.Token.tokAttr (tokValue, 1073741824)) val = this.getStringParameter (val, true);
} else {
if (org.jmol.script.Token.tokAttr (tokValue, 1073741824)) val = this.getNumericParameter (val);
if (Clazz.instanceOf (val, String)) {
if (tokWhat == 1641025539 || tokWhat == 1238369286 || tokWhat == 1087375365) isStringProperty = !(isIntProperty = (comparisonValue != 2147483647));
 else val = org.jmol.script.ScriptVariable.nValue (code[pc]);
}if (Clazz.instanceOf (val, Integer)) comparisonFloat = comparisonValue = (val).intValue ();
 else if (Clazz.instanceOf (val, Float) && isModel) comparisonValue = org.jmol.modelset.ModelCollection.modelFileNumberFromFloat ((val).floatValue ());
}}if (isStringProperty && !(Clazz.instanceOf (val, String))) {
val = "" + val;
}if (Clazz.instanceOf (val, Integer) || tokValue == 2) {
if (isModel) {
if (comparisonValue >= 1000000) tokWhat = -1095766028;
} else if (isIntOrFloat) {
isFloatProperty = false;
} else if (isFloatProperty) {
comparisonFloat = comparisonValue;
}} else if (Clazz.instanceOf (val, Float)) {
if (isModel) {
tokWhat = -1095766028;
} else {
comparisonFloat = (val).floatValue ();
if (isIntOrFloat) {
isIntProperty = false;
} else if (isIntProperty) {
comparisonValue = Clazz.floatToInt (comparisonFloat);
}}} else if (!isStringProperty) {
this.iToken++;
this.error (22);
}if (isModel && comparisonValue >= 1000000 && comparisonValue % 1000000 == 0) {
comparisonValue /= 1000000;
tokWhat = 1229984263;
isModel = false;
}if (tokWhat == -1095766028 && tokOperator == 269484436) {
rpn.addXBs (this.bitSetForModelFileNumber (comparisonValue));
break;
}if (value != null && (value).indexOf ("-") >= 0) {
if (isIntProperty) comparisonValue = -comparisonValue;
 else if (!Float.isNaN (comparisonFloat)) comparisonFloat = -comparisonFloat;
}var data = (tokWhat == 1716520973 ? this.viewer.getDataFloat (property) : null);
rpn.addXBs (isIntProperty ? this.compareInt (tokWhat, tokOperator, comparisonValue) : isStringProperty ? this.compareString (tokWhat, tokOperator, val) : this.compareFloat (tokWhat, data, tokOperator, comparisonFloat));
break;
case 3:
case 2:
rpn.addXNum (org.jmol.script.ScriptVariable.newScriptVariableToken (instruction));
break;
case 10:
var bs1 = org.jmol.util.BitSetUtil.copy (value);
rpn.addXBs (bs1);
break;
case 8:
rpn.addXPt (value);
break;
default:
if (org.jmol.script.Token.tokAttr (instruction.tok, 269484032)) {
if (!rpn.addOp (instruction)) this.error (22);
break;
}if (!(Clazz.instanceOf (value, String))) {
rpn.addXObj (value);
break;
}val = this.getParameter (value, 0);
if (isInMath) {
rpn.addXObj (val);
break;
}if (Clazz.instanceOf (val, String)) val = this.getStringObjectAsVariable (val, null);
if (Clazz.instanceOf (val, java.util.List)) {
var bs = org.jmol.script.ScriptVariable.unEscapeBitSetArray (val, true);
if (bs == null) val = value;
 else val = bs;
}if (Clazz.instanceOf (val, String)) val = this.lookupIdentifierValue (value);
rpn.addXObj (val);
break;
}
}
this.expressionResult = rpn.getResult (allowUnderflow);
if (this.expressionResult == null) {
if (allowUnderflow) return null;
if (!this.isSyntaxCheck) rpn.dumpStacks ("after getResult");
this.error (13);
}this.expressionResult = (this.expressionResult).value;
if (Clazz.instanceOf (this.expressionResult, String) && (mustBeBitSet || (this.expressionResult).startsWith ("({"))) {
this.expressionResult = (this.isSyntaxCheck ?  new org.jmol.util.BitSet () : org.jmol.script.ScriptEvaluator.getAtomBitSet (this, this.expressionResult));
}if (!mustBeBitSet && !(Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet))) return null;
var bs = (Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet) ? this.expressionResult :  new org.jmol.util.BitSet ());
this.isBondSet = (Clazz.instanceOf (this.expressionResult, org.jmol.modelset.Bond.BondSet));
if (!this.isBondSet) {
this.viewer.excludeAtoms (bs, ignoreSubset);
if (bs.length () > this.viewer.getAtomCount ()) bs.clearAll ();
}if (this.tempStatement != null) {
this.statement = this.tempStatement;
this.tempStatement = null;
}return bs;
}, $fz.isPrivate = true, $fz), "~A,~N,~N,~B,~B,~B,~B");
Clazz.defineMethod (c$, "compareFloat", 
($fz = function (tokWhat, data, tokOperator, comparisonFloat) {
var bs =  new org.jmol.util.BitSet ();
var atomCount = this.viewer.getAtomCount ();
var modelSet = this.viewer.getModelSet ();
var atoms = modelSet.atoms;
var propertyFloat = 0;
this.viewer.autoCalculate (tokWhat);
for (var i = atomCount; --i >= 0; ) {
var match = false;
var atom = atoms[i];
switch (tokWhat) {
default:
propertyFloat = org.jmol.modelset.Atom.atomPropertyFloat (this.viewer, atom, tokWhat);
break;
case 1716520973:
if (data == null || data.length <= i) continue;
propertyFloat = data[i];
}
match = org.jmol.script.ScriptEvaluator.compareFloat (tokOperator, propertyFloat, comparisonFloat);
if (match) bs.set (i);
}
return bs;
}, $fz.isPrivate = true, $fz), "~N,~A,~N,~N");
Clazz.defineMethod (c$, "compareString", 
($fz = function (tokWhat, tokOperator, comparisonString) {
var bs =  new org.jmol.util.BitSet ();
var atoms = this.viewer.getModelSet ().atoms;
var atomCount = this.viewer.getAtomCount ();
var isCaseSensitive = (tokWhat == 1087373316 && this.viewer.getChainCaseSensitive ());
if (!isCaseSensitive) comparisonString = comparisonString.toLowerCase ();
for (var i = atomCount; --i >= 0; ) {
var propertyString = org.jmol.modelset.Atom.atomPropertyString (this.viewer, atoms[i], tokWhat);
if (!isCaseSensitive) propertyString = propertyString.toLowerCase ();
if (this.compareStringValues (tokOperator, propertyString, comparisonString)) bs.set (i);
}
return bs;
}, $fz.isPrivate = true, $fz), "~N,~N,~S");
Clazz.defineMethod (c$, "compareInt", 
function (tokWhat, tokOperator, comparisonValue) {
var propertyValue = 2147483647;
var propertyBitSet = null;
var bitsetComparator = tokOperator;
var bitsetBaseValue = comparisonValue;
var atomCount = this.viewer.getAtomCount ();
var modelSet = this.viewer.getModelSet ();
var atoms = modelSet.atoms;
var imax = -1;
var imin = 0;
var iModel = -1;
var cellRange = null;
var nOps = 0;
var bs;
switch (tokWhat) {
case 1297090050:
switch (bitsetComparator) {
case 269484433:
case 269484432:
imax = 2147483647;
break;
}
break;
case 1095761923:
try {
switch (tokOperator) {
case 269484435:
return org.jmol.util.BitSetUtil.newBitSet2 (0, comparisonValue);
case 269484434:
return org.jmol.util.BitSetUtil.newBitSet2 (0, comparisonValue + 1);
case 269484433:
return org.jmol.util.BitSetUtil.newBitSet2 (comparisonValue, atomCount);
case 269484432:
return org.jmol.util.BitSetUtil.newBitSet2 (comparisonValue + 1, atomCount);
case 269484436:
return (comparisonValue < atomCount ? org.jmol.util.BitSetUtil.newBitSet2 (comparisonValue, comparisonValue + 1) :  new org.jmol.util.BitSet ());
case 269484438:
default:
bs = org.jmol.util.BitSetUtil.setAll (atomCount);
if (comparisonValue >= 0) bs.clear (comparisonValue);
return bs;
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return  new org.jmol.util.BitSet ();
} else {
throw e;
}
}
}
bs = org.jmol.util.BitSetUtil.newBitSet (atomCount);
for (var i = 0; i < atomCount; ++i) {
var match = false;
var atom = atoms[i];
switch (tokWhat) {
default:
propertyValue = org.jmol.modelset.Atom.atomPropertyInt (atom, tokWhat);
break;
case 1095766022:
return org.jmol.util.BitSetUtil.copy (this.viewer.getConformation (-1, comparisonValue - 1, false));
case 1297090050:
propertyBitSet = atom.getAtomSymmetry ();
if (propertyBitSet == null) continue;
if (atom.getModelIndex () != iModel) {
iModel = atom.getModelIndex ();
cellRange = modelSet.getModelCellRange (iModel);
nOps = modelSet.getModelSymmetryCount (iModel);
}if (bitsetBaseValue >= 200) {
if (cellRange == null) continue;
comparisonValue = bitsetBaseValue % 1000;
var symop = Clazz.doubleToInt (bitsetBaseValue / 1000) - 1;
if (symop < 0) {
match = true;
} else if (nOps == 0 || symop >= 0 && !(match = propertyBitSet.get (symop))) {
continue;
}bitsetComparator = 1048587;
if (symop < 0) propertyValue = atom.getCellTranslation (comparisonValue, cellRange, nOps);
 else propertyValue = atom.getSymmetryTranslation (symop, cellRange, nOps);
} else if (nOps > 0) {
if (comparisonValue > nOps) {
if (bitsetComparator != 269484435 && bitsetComparator != 269484434) continue;
}if (bitsetComparator == 269484438) {
if (comparisonValue > 0 && comparisonValue <= nOps && !propertyBitSet.get (comparisonValue)) {
bs.set (i);
}continue;
}}switch (bitsetComparator) {
case 269484435:
imax = comparisonValue - 1;
break;
case 269484434:
imax = comparisonValue;
break;
case 269484433:
imin = comparisonValue - 1;
break;
case 269484432:
imin = comparisonValue;
break;
case 269484436:
imax = comparisonValue;
imin = comparisonValue - 1;
break;
case 269484438:
match = !propertyBitSet.get (comparisonValue);
break;
}
if (imin < 0) imin = 0;
if (imin < imax) {
var pt = propertyBitSet.nextSetBit (imin);
if (pt >= 0 && pt < imax) match = true;
}if (!match || propertyValue == 2147483647) tokOperator = 1048587;
}
switch (tokOperator) {
case 1048587:
break;
case 269484435:
match = (propertyValue < comparisonValue);
break;
case 269484434:
match = (propertyValue <= comparisonValue);
break;
case 269484433:
match = (propertyValue >= comparisonValue);
break;
case 269484432:
match = (propertyValue > comparisonValue);
break;
case 269484436:
match = (propertyValue == comparisonValue);
break;
case 269484438:
match = (propertyValue != comparisonValue);
break;
}
if (match) bs.set (i);
}
return bs;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "compareStringValues", 
($fz = function (tokOperator, propertyValue, comparisonValue) {
switch (tokOperator) {
case 269484436:
case 269484438:
return (org.jmol.util.TextFormat.isMatch (propertyValue, comparisonValue, true, true) == (tokOperator == 269484436));
default:
this.error (22);
}
return false;
}, $fz.isPrivate = true, $fz), "~N,~S,~S");
c$.compareFloat = Clazz.defineMethod (c$, "compareFloat", 
($fz = function (tokOperator, propertyFloat, comparisonFloat) {
switch (tokOperator) {
case 269484435:
return propertyFloat < comparisonFloat;
case 269484434:
return propertyFloat <= comparisonFloat;
case 269484433:
return propertyFloat >= comparisonFloat;
case 269484432:
return propertyFloat > comparisonFloat;
case 269484436:
return propertyFloat == comparisonFloat;
case 269484438:
return propertyFloat != comparisonFloat;
}
return false;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.defineMethod (c$, "getAtomBits", 
($fz = function (tokType, specInfo) {
return (this.isSyntaxCheck ?  new org.jmol.util.BitSet () : this.viewer.getAtomBits (tokType, specInfo));
}, $fz.isPrivate = true, $fz), "~N,~O");
c$.getSeqCode = Clazz.defineMethod (c$, "getSeqCode", 
($fz = function (instruction) {
return (instruction.intValue != 2147483647 ? org.jmol.modelset.Group.getSeqcode (instruction.intValue, ' ') : (instruction.value).intValue ());
}, $fz.isPrivate = true, $fz), "org.jmol.script.Token");
Clazz.defineMethod (c$, "checkLast", 
($fz = function (i) {
return this.checkLength (i + 1) - 1;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "checkLength", 
($fz = function (length) {
if (length >= 0) return this.checkLengthErrorPt (length, 0);
if (this.statementLength > -length) {
this.iToken = -length;
this.error (2);
}return this.statementLength;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "checkLengthErrorPt", 
($fz = function (length, errorPt) {
if (this.statementLength != length) {
this.iToken = errorPt > 0 ? errorPt : this.statementLength;
this.error (errorPt > 0 ? 22 : 2);
}return this.statementLength;
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "checkLength23", 
($fz = function () {
this.iToken = this.statementLength;
if (this.statementLength != 2 && this.statementLength != 3) this.error (2);
return this.statementLength;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "checkLength34", 
($fz = function () {
this.iToken = this.statementLength;
if (this.statementLength != 3 && this.statementLength != 4) this.error (2);
return this.statementLength;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getToken", 
($fz = function (i) {
if (!this.checkToken (i)) this.error (13);
this.theToken = this.statement[i];
this.theTok = this.theToken.tok;
return this.theToken;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "tokAt", 
($fz = function (i) {
return (i < this.statementLength && this.statement[i] != null ? this.statement[i].tok : 0);
}, $fz.isPrivate = true, $fz), "~N");
c$.tokAtArray = Clazz.defineMethod (c$, "tokAtArray", 
($fz = function (i, args) {
return (i < args.length && args[i] != null ? args[i].tok : 0);
}, $fz.isPrivate = true, $fz), "~N,~A");
Clazz.defineMethod (c$, "tokenAt", 
($fz = function (i, args) {
return (i < args.length ? args[i] : null);
}, $fz.isPrivate = true, $fz), "~N,~A");
Clazz.defineMethod (c$, "checkToken", 
($fz = function (i) {
return (this.iToken = i) < this.statementLength;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "modelNumberParameter", 
($fz = function (index) {
var iFrame = 0;
var useModelNumber = false;
switch (this.tokAt (index)) {
case 2:
useModelNumber = true;
case 3:
iFrame = this.getToken (index).intValue;
break;
case 4:
iFrame = org.jmol.script.ScriptEvaluator.getFloatEncodedInt (this.stringParameter (index));
break;
default:
this.error (22);
}
return this.viewer.getModelNumberIndex (iFrame, useModelNumber, true);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "optParameterAsString", 
($fz = function (i) {
if (i >= this.statementLength) return "";
return this.parameterAsString (i);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "parameterAsString", 
($fz = function (i) {
this.getToken (i);
if (this.theToken == null) this.error (13);
return org.jmol.script.ScriptVariable.sValue (this.theToken);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "intParameter", 
($fz = function (index) {
if (this.checkToken (index)) if (this.getToken (index).tok == 2) return this.theToken.intValue;
this.error (20);
return 0;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "intParameterRange", 
($fz = function (i, min, max) {
var val = this.intParameter (i);
if (val < min || val > max) this.integerOutOfRange (min, max);
return val;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.defineMethod (c$, "isFloatParameter", 
($fz = function (index) {
switch (this.tokAt (index)) {
case 2:
case 3:
return true;
}
return false;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "floatParameterRange", 
($fz = function (i, min, max) {
var val = this.floatParameter (i);
if (val < min || val > max) this.numberOutOfRange (min, max);
return val;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.defineMethod (c$, "floatParameter", 
($fz = function (index) {
if (this.checkToken (index)) {
this.getToken (index);
switch (this.theTok) {
case 1048615:
return -this.theToken.intValue;
case 1048614:
case 2:
return this.theToken.intValue;
case 1048611:
case 3:
return (this.theToken.value).floatValue ();
}
}this.error (34);
return 0;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "floatParameterSet", 
($fz = function (i, nMin, nMax) {
var tok = this.tokAt (i);
if (tok == 1073742195) tok = this.tokAt (++i);
var haveBrace = (tok == 1048586);
var haveSquare = (tok == 269484096);
var fparams = null;
var v =  new java.util.ArrayList ();
var n = 0;
if (haveBrace || haveSquare) i++;
var pt;
var s = null;
switch (this.tokAt (i)) {
case 4:
s = org.jmol.script.ScriptVariable.sValue (this.statement[i]);
s = org.jmol.util.TextFormat.replaceAllCharacter (s, "{},[]\"'", ' ');
fparams = org.jmol.util.Parser.parseFloatArray (s);
n = fparams.length;
break;
case 7:
fparams = org.jmol.script.ScriptVariable.flistValue (this.statement[i++], 0);
n = fparams.length;
break;
default:
while (n < nMax) {
tok = this.tokAt (i);
if (haveBrace && tok == 1048590 || haveSquare && tok == 269484097) break;
switch (tok) {
case 269484080:
case 1048586:
case 1048590:
break;
case 4:
break;
case 8:
pt = this.getPoint3f (i, false);
v.add (Float.$valueOf (pt.x));
v.add (Float.$valueOf (pt.y));
v.add (Float.$valueOf (pt.z));
n += 3;
break;
case 9:
var pt4 = this.getPoint4f (i);
v.add (Float.$valueOf (pt4.x));
v.add (Float.$valueOf (pt4.y));
v.add (Float.$valueOf (pt4.z));
v.add (Float.$valueOf (pt4.w));
n += 4;
break;
default:
v.add (Float.$valueOf (this.floatParameter (i)));
n++;
if (n == nMax && haveSquare && this.tokAt (i + 1) == 1048590) i++;
}
i++;
}
}
if (haveBrace && this.tokAt (i++) != 1048590 || haveSquare && this.tokAt (i++) != 269484097) this.error (22);
this.iToken = i - 1;
if (n < nMin || n > nMax) this.error (22);
if (fparams == null) {
fparams =  Clazz.newFloatArray (n, 0);
for (var j = 0; j < n; j++) fparams[j] = v.get (j).floatValue ();

}return fparams;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.defineMethod (c$, "isArrayParameter", 
($fz = function (i) {
switch (this.tokAt (i)) {
case 7:
case 11:
case 12:
case 1073742195:
case 269484096:
return true;
}
return false;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getPointArray", 
($fz = function (i, nPoints) {
var points = (nPoints < 0 ? null :  new Array (nPoints));
var vp = (nPoints < 0 ?  new java.util.ArrayList () : null);
var tok = (i < 0 ? 7 : this.getToken (i++).tok);
switch (tok) {
case 7:
var v = (this.theToken).getList ();
if (nPoints >= 0 && v.size () != nPoints) this.error (22);
nPoints = v.size ();
if (points == null) points =  new Array (nPoints);
for (var j = 0; j < nPoints; j++) if ((points[j] = org.jmol.script.ScriptVariable.ptValue (v.get (j))) == null) this.error (22);

return points;
case 1073742195:
tok = this.tokAt (i++);
break;
}
if (tok != 269484096) this.error (22);
var n = 0;
while (tok != 269484097 && tok != 0) {
tok = this.getToken (i).tok;
switch (tok) {
case 0:
case 269484097:
break;
case 269484080:
i++;
break;
default:
if (nPoints >= 0 && n == nPoints) {
tok = 0;
break;
}var pt = this.getPoint3f (i, true);
if (points == null) vp.add (pt);
 else points[n] = pt;
n++;
i = this.iToken + 1;
}
}
if (tok != 269484097) this.error (22);
if (points == null) points = vp.toArray ( new Array (vp.size ()));
return points;
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "floatArraySet", 
($fz = function (i, nX, nY) {
var tok = this.tokAt (i++);
if (tok == 1073742195) tok = this.tokAt (i++);
if (tok != 269484096) this.error (22);
var fparams = org.jmol.util.ArrayUtil.newFloat2 (nX);
var n = 0;
while (tok != 269484097) {
tok = this.getToken (i).tok;
switch (tok) {
case 1073742195:
case 269484097:
continue;
case 269484080:
i++;
break;
case 269484096:
i++;
var f =  Clazz.newFloatArray (nY, 0);
fparams[n++] = f;
for (var j = 0; j < nY; j++) {
f[j] = this.floatParameter (i++);
if (this.tokAt (i) == 269484080) i++;
}
if (this.tokAt (i++) != 269484097) this.error (22);
tok = 0;
if (n == nX && this.tokAt (i) != 269484097) this.error (22);
break;
default:
this.error (22);
}
}
return fparams;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.defineMethod (c$, "floatArraySetXYZ", 
($fz = function (i, nX, nY, nZ) {
var tok = this.tokAt (i++);
if (tok == 1073742195) tok = this.tokAt (i++);
if (tok != 269484096 || nX <= 0) this.error (22);
var fparams = org.jmol.util.ArrayUtil.newFloat3 (nX, -1);
var n = 0;
while (tok != 269484097) {
tok = this.getToken (i).tok;
switch (tok) {
case 1073742195:
case 269484097:
continue;
case 269484080:
i++;
break;
case 269484096:
fparams[n++] = this.floatArraySet (i, nY, nZ);
i = ++this.iToken;
tok = 0;
if (n == nX && this.tokAt (i) != 269484097) this.error (22);
break;
default:
this.error (22);
}
}
return fparams;
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N");
Clazz.defineMethod (c$, "stringParameter", 
($fz = function (index) {
if (!this.checkToken (index) || this.getToken (index).tok != 4) this.error (41);
return this.theToken.value;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "stringParameterSet", 
($fz = function (i) {
switch (this.tokAt (i)) {
case 4:
var s = this.stringParameter (i);
if (s.startsWith ("[\"")) {
var o = this.viewer.evaluateExpression (s);
if (Clazz.instanceOf (o, String)) return org.jmol.util.TextFormat.split (o, '\n');
}return [s];
case 1073742195:
i += 2;
break;
case 269484096:
++i;
break;
case 7:
return org.jmol.script.ScriptVariable.listValue (this.getToken (i));
default:
this.error (22);
}
var tok;
var v =  new java.util.ArrayList ();
while ((tok = this.tokAt (i)) != 269484097) {
switch (tok) {
case 269484080:
break;
case 4:
v.add (this.stringParameter (i));
break;
default:
case 0:
this.error (22);
}
i++;
}
this.iToken = i;
var n = v.size ();
var sParams =  new Array (n);
for (var j = 0; j < n; j++) {
sParams[j] = v.get (j);
}
return sParams;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "objectNameParameter", 
($fz = function (index) {
if (!this.checkToken (index)) this.error (37);
return this.parameterAsString (index);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "booleanParameter", 
($fz = function (i) {
if (this.statementLength == i) return true;
switch (this.getToken (this.checkLast (i)).tok) {
case 1048589:
return true;
case 1048588:
return false;
default:
this.error (5);
}
return false;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "atomCenterOrCoordinateParameter", 
($fz = function (i) {
switch (this.getToken (i).tok) {
case 10:
case 1048577:
var bs = this.atomExpression (this.statement, i, 0, true, false, false, true);
if (bs != null) return this.viewer.getAtomSetCenter (bs);
if (Clazz.instanceOf (this.expressionResult, org.jmol.util.Point3f)) return this.expressionResult;
this.error (22);
break;
case 1048586:
case 8:
return this.getPoint3f (i, true);
}
this.error (22);
return null;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "isCenterParameter", 
($fz = function (i) {
var tok = this.tokAt (i);
return (tok == 1048583 || tok == 1048586 || tok == 1048577 || tok == 8 || tok == 10);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "centerParameter", 
($fz = function (i) {
return this.centerParameterForModel (i, -2147483648);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "centerParameterForModel", 
($fz = function (i, modelIndex) {
var center = null;
this.expressionResult = null;
if (this.checkToken (i)) {
switch (this.getToken (i).tok) {
case 1048583:
var id = this.objectNameParameter (++i);
var index = -2147483648;
if (this.tokAt (i + 1) == 269484096) {
index = this.parameterExpressionList (-i - 1, -1, true).get (0).asInt ();
if (this.getToken (--this.iToken).tok != 269484097) this.error (22);
}if (this.isSyntaxCheck) return  new org.jmol.util.Point3f ();
if (this.tokAt (i + 1) == 1048584 && (this.tokAt (i + 2) == 1141899267 || this.tokAt (i + 2) == 1141899270)) {
index = 2147483647;
this.iToken = i + 2;
}if ((center = this.getObjectCenter (id, index, modelIndex)) == null) this.errorStr (12, id);
break;
case 10:
case 1048577:
case 1048586:
case 8:
center = this.atomCenterOrCoordinateParameter (i);
break;
}
}if (center == null) this.error (11);
return center;
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "planeParameter", 
($fz = function (i) {
var vAB =  new org.jmol.util.Vector3f ();
var vAC =  new org.jmol.util.Vector3f ();
var plane = null;
var isNegated = (this.tokAt (i) == 269484192);
if (isNegated) i++;
if (i < this.statementLength) switch (this.getToken (i).tok) {
case 9:
plane = org.jmol.util.Point4f.newPt (this.theToken.value);
break;
case 1048583:
var id = this.objectNameParameter (++i);
if (this.isSyntaxCheck) return  new org.jmol.util.Point4f ();
var shapeType = this.shapeManager.getShapeIdFromObjectName (id);
switch (shapeType) {
case 22:
this.setShapeProperty (22, "thisID", id);
var points = this.getShapeProperty (22, "vertices");
if (points == null || points.length < 3 || points[0] == null || points[1] == null || points[2] == null) break;
org.jmol.util.Measure.getPlaneThroughPoints (points[0], points[1], points[2],  new org.jmol.util.Vector3f (), vAB, vAC, plane =  new org.jmol.util.Point4f ());
break;
case 23:
this.setShapeProperty (23, "thisID", id);
plane = this.getShapeProperty (23, "plane");
break;
}
break;
case 1112541205:
if (!this.checkToken (++i) || this.getToken (i++).tok != 269484436) this.evalError ("x=?", null);
plane = org.jmol.util.Point4f.new4 (1, 0, 0, -this.floatParameter (i));
break;
case 1112541206:
if (!this.checkToken (++i) || this.getToken (i++).tok != 269484436) this.evalError ("y=?", null);
plane = org.jmol.util.Point4f.new4 (0, 1, 0, -this.floatParameter (i));
break;
case 1112541207:
if (!this.checkToken (++i) || this.getToken (i++).tok != 269484436) this.evalError ("z=?", null);
plane = org.jmol.util.Point4f.new4 (0, 0, 1, -this.floatParameter (i));
break;
case 1073741824:
case 4:
var str = this.parameterAsString (i);
if (str.equalsIgnoreCase ("xy")) return org.jmol.util.Point4f.new4 (0, 0, 1, 0);
if (str.equalsIgnoreCase ("xz")) return org.jmol.util.Point4f.new4 (0, 1, 0, 0);
if (str.equalsIgnoreCase ("yz")) return org.jmol.util.Point4f.new4 (1, 0, 0, 0);
this.iToken += 2;
break;
case 1048586:
if (!this.isPoint3f (i)) {
plane = this.getPoint4f (i);
break;
}case 10:
case 1048577:
var pt1 = this.atomCenterOrCoordinateParameter (i);
if (this.getToken (++this.iToken).tok == 269484080) ++this.iToken;
var pt2 = this.atomCenterOrCoordinateParameter (this.iToken);
if (this.getToken (++this.iToken).tok == 269484080) ++this.iToken;
var pt3 = this.atomCenterOrCoordinateParameter (this.iToken);
i = this.iToken;
var norm =  new org.jmol.util.Vector3f ();
var w = org.jmol.util.Measure.getNormalThroughPoints (pt1, pt2, pt3, norm, vAB, vAC);
plane =  new org.jmol.util.Point4f ();
plane.set (norm.x, norm.y, norm.z, w);
if (!this.isSyntaxCheck && org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("points: " + pt1 + pt2 + pt3 + " defined plane: " + plane);
break;
}
if (plane == null) this.planeExpected ();
if (isNegated) {
plane.scale (-1);
}return plane;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "hklParameter", 
($fz = function (i) {
if (!this.isSyntaxCheck && this.viewer.getCurrentUnitCell () == null) this.error (33);
var pt = this.getPointOrPlane (i, false, true, false, true, 3, 3);
var p = this.getHklPlane (pt);
if (p == null) this.error (3);
if (!this.isSyntaxCheck && org.jmol.util.Logger.debugging) org.jmol.util.Logger.info ("defined plane: " + p);
return p;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getHklPlane", 
function (pt) {
var vAB =  new org.jmol.util.Vector3f ();
var vAC =  new org.jmol.util.Vector3f ();
var pt1 = org.jmol.util.Point3f.new3 (pt.x == 0 ? 1 : 1 / pt.x, 0, 0);
var pt2 = org.jmol.util.Point3f.new3 (0, pt.y == 0 ? 1 : 1 / pt.y, 0);
var pt3 = org.jmol.util.Point3f.new3 (0, 0, pt.z == 0 ? 1 : 1 / pt.z);
if (pt.x == 0 && pt.y == 0 && pt.z == 0) {
return null;
} else if (pt.x == 0 && pt.y == 0) {
pt1.set (1, 0, pt3.z);
pt2.set (0, 1, pt3.z);
} else if (pt.y == 0 && pt.z == 0) {
pt2.set (pt1.x, 0, 1);
pt3.set (pt1.x, 1, 0);
} else if (pt.z == 0 && pt.x == 0) {
pt3.set (0, pt2.y, 1);
pt1.set (1, pt2.y, 0);
} else if (pt.x == 0) {
pt1.set (1, pt2.y, 0);
} else if (pt.y == 0) {
pt2.set (0, 1, pt3.z);
} else if (pt.z == 0) {
pt3.set (pt1.x, 0, 1);
}this.viewer.toCartesian (pt1, false);
this.viewer.toCartesian (pt2, false);
this.viewer.toCartesian (pt3, false);
var plane =  new org.jmol.util.Vector3f ();
var w = org.jmol.util.Measure.getNormalThroughPoints (pt1, pt2, pt3, plane, vAB, vAC);
var pt4 =  new org.jmol.util.Point4f ();
pt4.set (plane.x, plane.y, plane.z, w);
return pt4;
}, "org.jmol.util.Point3f");
Clazz.defineMethod (c$, "getMadParameter", 
($fz = function () {
var mad = 1;
switch (this.getToken (1).tok) {
case 1073742072:
this.restrictSelected (false, false);
break;
case 1048589:
break;
case 1048588:
mad = 0;
break;
case 2:
var radiusRasMol = this.intParameterRange (1, 0, 750);
mad = radiusRasMol * 4 * 2;
break;
case 3:
mad = Clazz.doubleToInt (Math.floor (this.floatParameterRange (1, -3, 3) * 1000 * 2));
if (mad < 0) {
this.restrictSelected (false, false);
mad = -mad;
}break;
default:
this.error (6);
}
return mad;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getSetAxesTypeMad", 
($fz = function (index) {
if (index == this.statementLength) return 1;
switch (this.getToken (this.checkLast (index)).tok) {
case 1048589:
return 1;
case 1048588:
return 0;
case 1073741926:
return -1;
case 2:
return this.intParameterRange (index, -1, 19);
case 3:
var angstroms = this.floatParameterRange (index, 0, 2);
return Clazz.doubleToInt (Math.floor (angstroms * 1000 * 2));
}
this.errorStr (7, "\"DOTTED\"");
return 0;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "isColorParam", 
($fz = function (i) {
var tok = this.tokAt (i);
return (tok == 570425378 || tok == 1073742195 || tok == 269484096 || tok == 7 || tok == 8 || this.isPoint3f (i) || (tok == 4 || org.jmol.script.Token.tokAttr (tok, 1073741824)) && org.jmol.util.ColorUtil.getArgbFromString (this.statement[i].value) != 0);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getArgbParam", 
($fz = function (index) {
return this.getArgbParamOrNone (index, false);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getArgbParamLast", 
($fz = function (index, allowNone) {
var icolor = this.getArgbParamOrNone (index, allowNone);
this.checkLast (this.iToken);
return icolor;
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "getArgbParamOrNone", 
($fz = function (index, allowNone) {
var pt = null;
if (this.checkToken (index)) {
switch (this.getToken (index).tok) {
default:
if (!org.jmol.script.Token.tokAttr (this.theTok, 1073741824)) break;
case 570425378:
case 4:
return org.jmol.util.ColorUtil.getArgbFromString (this.parameterAsString (index));
case 1073742195:
return this.getColorTriad (index + 2);
case 269484096:
return this.getColorTriad (++index);
case 7:
var rgb = org.jmol.script.ScriptVariable.flistValue (this.theToken, 3);
if (rgb != null && rgb.length != 3) pt = org.jmol.util.Point3f.new3 (rgb[0], rgb[1], rgb[2]);
break;
case 8:
pt = this.theToken.value;
break;
case 1048586:
pt = this.getPoint3f (index, false);
break;
case 1048587:
if (allowNone) return 0;
}
}if (pt == null) this.error (8);
return org.jmol.util.ColorUtil.colorPtToInt (pt);
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "getColorTriad", 
($fz = function (i) {
var colors =  Clazz.newFloatArray (3, 0);
var n = 0;
var hex = "";
this.getToken (i);
var pt = null;
var val = 0;
out : switch (this.theTok) {
case 2:
case 1048614:
case 3:
for (; i < this.statementLength; i++) {
switch (this.getToken (i).tok) {
case 269484080:
continue;
case 1073741824:
if (n != 1 || colors[0] != 0) this.error (4);
hex = "0" + this.parameterAsString (i);
break out;
case 3:
if (n > 2) this.error (4);
val = this.floatParameter (i);
break;
case 2:
if (n > 2) this.error (4);
val = this.theToken.intValue;
break;
case 1048614:
if (n > 2) this.error (4);
val = (this.theToken.value).intValue () % 256;
break;
case 269484097:
if (n != 3) this.error (4);
--i;
pt = org.jmol.util.Point3f.new3 (colors[0], colors[1], colors[2]);
break out;
default:
this.error (4);
}
colors[n++] = val;
}
this.error (4);
break;
case 8:
pt = this.theToken.value;
break;
case 1073741824:
hex = this.parameterAsString (i);
break;
default:
this.error (4);
}
if (this.getToken (++i).tok != 269484097) this.error (4);
if (pt != null) return org.jmol.util.ColorUtil.colorPtToInt (pt);
if ((n = org.jmol.util.ColorUtil.getArgbFromString ("[" + hex + "]")) == 0) this.error (4);
return n;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "isPoint3f", 
($fz = function (i) {
var isOK;
if ((isOK = (this.tokAt (i) == 8)) || this.tokAt (i) == 9 || this.isFloatParameter (i + 1) && this.isFloatParameter (i + 2) && this.isFloatParameter (i + 3) && this.isFloatParameter (i + 4)) return isOK;
this.ignoreError = true;
var t = this.iToken;
isOK = true;
try {
this.getPoint3f (i, true);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
isOK = false;
} else {
throw e;
}
}
this.ignoreError = false;
this.iToken = t;
return isOK;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getPoint3f", 
($fz = function (i, allowFractional) {
return this.getPointOrPlane (i, false, allowFractional, true, false, 3, 3);
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "getPoint4f", 
($fz = function (i) {
return this.getPointOrPlane (i, false, false, false, false, 4, 4);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getPointOrPlane", 
($fz = function (index, integerOnly, allowFractional, doConvert, implicitFractional, minDim, maxDim) {
var coord =  Clazz.newFloatArray (6, 0);
var n = 0;
this.coordinatesAreFractional = implicitFractional;
if (this.tokAt (index) == 8) {
if (minDim <= 3 && maxDim >= 3) return this.getToken (index).value;
this.error (22);
}if (this.tokAt (index) == 9) {
if (minDim <= 4 && maxDim >= 4) return this.getToken (index).value;
this.error (22);
}var multiplier = 1;
out : for (var i = index; i < this.statement.length; i++) {
switch (this.getToken (i).tok) {
case 1048586:
case 269484080:
case 269484128:
case 269484160:
break;
case 1048590:
break out;
case 269484192:
multiplier = -1;
break;
case 1048615:
if (n == 6) this.error (22);
coord[n++] = this.theToken.intValue;
multiplier = -1;
break;
case 2:
case 1048614:
if (n == 6) this.error (22);
coord[n++] = this.theToken.intValue * multiplier;
multiplier = 1;
break;
case 269484208:
case 1048610:
if (!allowFractional) this.error (22);
if (this.theTok == 269484208) this.getToken (++i);
n--;
if (n < 0 || integerOnly) this.error (22);
if (Clazz.instanceOf (this.theToken.value, Integer) || this.theTok == 2) {
coord[n++] /= (this.theToken.intValue == 2147483647 ? (this.theToken.value).intValue () : this.theToken.intValue);
} else if (Clazz.instanceOf (this.theToken.value, Float)) {
coord[n++] /= (this.theToken.value).floatValue ();
}this.coordinatesAreFractional = true;
break;
case 3:
case 1048611:
if (integerOnly) this.error (22);
if (n == 6) this.error (22);
coord[n++] = (this.theToken.value).floatValue ();
break;
default:
this.error (22);
}
}
if (n < minDim || n > maxDim) this.error (22);
if (n == 3) {
var pt = org.jmol.util.Point3f.new3 (coord[0], coord[1], coord[2]);
if (this.coordinatesAreFractional && doConvert) {
this.fractionalPoint = org.jmol.util.Point3f.newP (pt);
if (!this.isSyntaxCheck) this.viewer.toCartesian (pt, !this.viewer.getFractionalRelative ());
}return pt;
}if (n == 4) {
if (this.coordinatesAreFractional) this.error (22);
var plane = org.jmol.util.Point4f.new4 (coord[0], coord[1], coord[2], coord[3]);
return plane;
}return coord;
}, $fz.isPrivate = true, $fz), "~N,~B,~B,~B,~B,~N,~N");
Clazz.defineMethod (c$, "xypParameter", 
($fz = function (index) {
var tok = this.tokAt (index);
if (tok == 1073742195) tok = this.tokAt (++index);
if (tok != 269484096 || !this.isFloatParameter (++index)) return null;
var pt =  new org.jmol.util.Point3f ();
pt.x = this.floatParameter (index);
if (this.tokAt (++index) == 269484080) index++;
if (!this.isFloatParameter (index)) return null;
pt.y = this.floatParameter (index);
var isPercent = (this.tokAt (++index) == 269484210);
if (isPercent) ++index;
if (this.tokAt (index) != 269484097) return null;
this.iToken = index;
pt.z = (isPercent ? -1 : 1) * 3.4028235E38;
return pt;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "isCommandDisplayable", 
($fz = function (i) {
if (i >= this.aatoken.length || i >= this.pcEnd || this.aatoken[i] == null) return false;
return (this.lineIndices[i][1] > this.lineIndices[i][0]);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "checkContinue", 
($fz = function () {
if (this.interruptExecution) return false;
if (this.executionStepping && this.isCommandDisplayable (this.pc)) {
this.viewer.setScriptStatus ("Next: " + this.getNextStatement (), "stepping -- type RESUME to continue", 0, null);
this.executionPaused = true;
} else if (!this.executionPaused) {
return true;
}if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.info ("script execution paused at command " + (this.pc + 1) + " level " + this.scriptLevel + ": " + this.thisCommand);
}try {
this.refresh ();
while (this.executionPaused) {
this.viewer.popHoldRepaintWhy ("pause");
Thread.sleep (100);
var script = this.viewer.getInterruptScript ();
if (script !== "") {
this.resumePausedExecution ();
this.setErrorMessage (null);
var scSave = this.getScriptContext ();
this.pc--;
try {
this.runScript (script);
} catch (e$$) {
if (Clazz.exceptionOf (e$$, Exception)) {
var e = e$$;
{
this.setErrorMessage ("" + e);
}
} else if (Clazz.exceptionOf (e$$, Error)) {
var er = e$$;
{
this.setErrorMessage ("" + er);
}
} else {
throw e$$;
}
}
if (this.$error) {
this.scriptStatusOrBuffer (this.errorMessage);
this.setErrorMessage (null);
}this.restoreScriptContext (scSave, true, false, false);
this.pauseExecution (false);
}this.viewer.pushHoldRepaintWhy ("pause");
}
if (!this.isSyntaxCheck && !this.interruptExecution && !this.executionStepping) {
this.viewer.scriptStatus ("script execution " + (this.$error || this.interruptExecution ? "interrupted" : "resumed"));
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.viewer.pushHoldRepaintWhy ("pause");
} else {
throw e;
}
}
org.jmol.util.Logger.debug ("script execution resumed");
return !this.$error && !this.interruptExecution;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "instructionDispatchLoop", 
($fz = function (doList) {
var timeBegin = 0;
this.vProcess = null;
var isForCheck = false;
if (this.shapeManager == null) this.shapeManager = this.viewer.getShapeManager ();
this.debugScript = this.logMessages = false;
if (!this.isSyntaxCheck) this.setDebugging ();
if (this.logMessages) {
timeBegin = System.currentTimeMillis ();
this.viewer.scriptStatus ("Eval.instructionDispatchLoop():" + timeBegin);
this.viewer.scriptStatus (this.$script);
}if (this.pcEnd == 0) this.pcEnd = 2147483647;
if (this.lineEnd == 0) this.lineEnd = 2147483647;
var lastCommand = "";
if (this.aatoken == null) return;
for (; this.pc < this.aatoken.length && this.pc < this.pcEnd; this.pc++) {
if (!this.isSyntaxCheck && !this.checkContinue ()) break;
if (this.lineNumbers[this.pc] > this.lineEnd) break;
this.theToken = (this.aatoken[this.pc].length == 0 ? null : this.aatoken[this.pc][0]);
if (!this.historyDisabled && !this.isSyntaxCheck && this.scriptLevel <= this.commandHistoryLevelMax && !this.tQuiet) {
var cmdLine = this.getCommand (this.pc, true, true);
if (this.theToken != null && cmdLine.length > 0 && !cmdLine.equals (lastCommand) && (this.theToken.tok == 135368713 || this.theToken.tok == 102436 || !org.jmol.script.Token.tokAttr (this.theToken.tok, 102400))) this.viewer.addCommand (lastCommand = cmdLine);
}if (!this.isSyntaxCheck) {
var script = this.viewer.getInterruptScript ();
if (script !== "") this.runScript (script);
}if (!this.setStatement (this.pc)) {
org.jmol.util.Logger.info (this.getCommand (this.pc, true, false) + " -- STATEMENT CONTAINING @{} SKIPPED");
continue;
}this.thisCommand = this.getCommand (this.pc, false, true);
this.fullCommand = this.thisCommand + this.getNextComment ();
this.getToken (0);
this.iToken = 0;
if (doList || !this.isSyntaxCheck) {
var milliSecDelay = this.viewer.getScriptDelay ();
if (doList || milliSecDelay > 0 && this.scriptLevel > 0) {
if (milliSecDelay > 0) this.delayMillis (-milliSecDelay);
this.viewer.scriptEcho ("$[" + this.scriptLevel + "." + this.lineNumbers[this.pc] + "." + (this.pc + 1) + "] " + this.thisCommand);
}}if (this.vProcess != null && (this.theTok != 1150985 || this.statementLength < 2 || this.statement[1].tok != 102439)) {
this.vProcess.add (this.statement);
continue;
}if (this.isSyntaxCheck) {
if (this.isCmdLine_c_or_C_Option) org.jmol.util.Logger.info (this.thisCommand);
if (this.statementLength == 1 && this.statement[0].tok != 135368713 && this.statement[0].tok != 102436) continue;
} else {
if (this.debugScript) this.logDebugScript (0);
if (this.scriptLevel == 0 && this.viewer.logCommands ()) this.viewer.log (this.thisCommand);
if (this.logMessages && this.theToken != null) org.jmol.util.Logger.debug (this.theToken.toString ());
}if (this.theToken == null) continue;
if (org.jmol.script.Token.tokAttr (this.theToken.tok, 135168)) this.processShapeCommand (this.theToken.tok);
 else switch (this.theToken.tok) {
case 0:
if (this.isSyntaxCheck || !this.viewer.getMessageStyleChime ()) break;
var s = this.theToken.value;
if (s == null) break;
if (this.outputBuffer == null) this.viewer.showMessage (s);
this.scriptStatusOrBuffer (s);
break;
case 266280:
this.pushContext (this.theToken);
break;
case 266278:
this.popContext (true, false);
break;
case 269484066:
break;
case 20500:
case 528410:
if (this.viewer.isHeadless ()) break;
case 102412:
case 102407:
case 102408:
case 364547:
case 102402:
case 1150985:
case 364548:
case 135369224:
case 135369225:
case 102410:
case 102411:
case 102413:
case 102439:
case 102406:
isForCheck = this.flowControl (this.theToken.tok, isForCheck);
break;
case 4097:
this.animation ();
break;
case 4098:
this.assign ();
break;
case 1610616835:
this.background (1);
break;
case 4100:
this.bind ();
break;
case 4101:
this.bondorder ();
break;
case 4102:
this.calculate ();
break;
case 135270422:
this.cache ();
break;
case 1069064:
this.cd ();
break;
case 12289:
this.center (1);
break;
case 4105:
this.centerAt ();
break;
case 1766856708:
this.color ();
break;
case 135270405:
this.compare ();
break;
case 1095766022:
this.configuration ();
break;
case 4106:
this.connect (1);
break;
case 528395:
this.console ();
break;
case 135270407:
this.data ();
break;
case 1060866:
this.define ();
break;
case 528397:
this.delay ();
break;
case 12291:
this.$delete ();
break;
case 554176526:
this.slab (true);
break;
case 1610625028:
this.display (true);
break;
case 266255:
case 266281:
if (this.isSyntaxCheck) break;
if (this.pc > 0 && this.theToken.tok == 266255) this.viewer.clearScriptQueue ();
this.interruptExecution = (this.pc > 0 || !this.viewer.usingScriptQueue ());
break;
case 266256:
if (this.isSyntaxCheck) return;
this.viewer.exitJmol ();
break;
case 1229984263:
this.file ();
break;
case 1060869:
this.fixed ();
break;
case 4114:
this.font (-1, 0);
break;
case 4115:
case 1095766028:
this.frame (1);
break;
case 102436:
case 135368713:
case 1073741824:
this.$function ();
break;
case 135270410:
this.getProperty ();
break;
case 20482:
this.help ();
break;
case 12294:
this.display (false);
break;
case 1612189718:
this.hbond ();
break;
case 1610616855:
this.history (1);
break;
case 544771:
this.hover ();
break;
case 266264:
if (!this.isSyntaxCheck) this.viewer.initialize (!this.isStateScript);
break;
case 4121:
this.invertSelected ();
break;
case 135287308:
this.script (135287308, null, false);
break;
case 135271426:
this.load ();
break;
case 36869:
this.log ();
break;
case 1052700:
this.mapProperty ();
break;
case 20485:
this.message ();
break;
case 4126:
this.minimize ();
break;
case 4128:
this.move ();
break;
case 4130:
this.moveto ();
break;
case 4131:
this.navigate ();
break;
case 20487:
this.pause ();
break;
case 4133:
case 135270417:
case 1052714:
this.plot (this.statement);
break;
case 36865:
this.print ();
break;
case 135304707:
this.prompt ();
break;
case 4139:
case 4165:
this.undoRedoMove ();
break;
case 266284:
this.refresh ();
break;
case 4141:
this.reset ();
break;
case 4142:
this.restore ();
break;
case 12295:
this.restrict ();
break;
case 266287:
if (!this.isSyntaxCheck) this.resumePausedExecution ();
break;
case 36866:
this.returnCmd (null);
break;
case 528432:
this.rotate (false, false);
break;
case 4145:
this.rotate (false, true);
break;
case 4146:
this.save ();
break;
case 1085443:
this.set ();
break;
case 135271429:
this.script (135271429, null, doList);
break;
case 135280132:
this.select (1);
break;
case 1611141171:
this.selectionHalo (1);
break;
case 4148:
this.show ();
break;
case 554176565:
this.slab (false);
break;
case 1611141175:
this.rotate (true, false);
break;
case 1611141176:
this.ssbond ();
break;
case 266298:
if (this.pause ()) this.stepPausedExecution ();
break;
case 528443:
this.stereo ();
break;
case 1641025539:
this.structure ();
break;
case 3158024:
this.subset ();
break;
case 4156:
this.sync ();
break;
case 536875070:
this.timeout (1);
break;
case 4160:
this.translate (false);
break;
case 4162:
this.translate (true);
break;
case 4164:
this.unbind ();
break;
case 4166:
this.vibration ();
break;
case 135270421:
this.write (null);
break;
case 1060873:
this.zap (true);
break;
case 4168:
this.zoom (false);
break;
case 4170:
this.zoom (true);
break;
default:
this.error (47);
}
this.setCursorWait (false);
if (this.executionStepping) {
this.executionPaused = (this.isCommandDisplayable (this.pc + 1));
}}
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "cache", 
($fz = function () {
this.checkLength (3);
var tok = this.tokAt (1);
var fileName = this.parameterAsString (2);
switch (tok) {
case 1276118017:
case 1073742119:
if (!this.isSyntaxCheck) {
if (tok == 1073742119 && this.tokAt (2) == 1048579) fileName = null;
var nBytes = this.viewer.cacheFileByName (fileName, tok == 1276118017);
this.showString (nBytes < 0 ? "cache cleared" : nBytes + " bytes " + (tok == 1276118017 ? " cached" : " removed"));
}break;
default:
this.error (22);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setCursorWait", 
($fz = function (TF) {
if (!this.isSyntaxCheck) this.viewer.setCursor (TF ? 4 : 0);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "processShapeCommand", 
($fz = function (tok) {
var iShape = 0;
switch (tok) {
case 1611272194:
iShape = 30;
break;
case 1115297793:
iShape = 9;
break;
case 1679429641:
iShape = 31;
break;
case 1113200642:
iShape = 11;
break;
case 135402505:
iShape = 24;
break;
case 135174:
iShape = 17;
break;
case 1113198595:
iShape = 16;
break;
case 135176:
iShape = 22;
break;
case 537022465:
iShape = 29;
break;
case 1113198596:
iShape = 20;
break;
case 1611272202:
iShape = 34;
break;
case 1113198597:
iShape = 19;
break;
case 1113200646:
iShape = 8;
break;
case 135180:
iShape = 23;
break;
case 1826248715:
iShape = 5;
break;
case 135182:
iShape = 25;
break;
case 537006096:
case 1746538509:
iShape = 6;
break;
case 1113200647:
iShape = 13;
break;
case 1183762:
iShape = 26;
break;
case 135190:
iShape = 28;
break;
case 135188:
iShape = 27;
break;
case 135192:
iShape = 21;
break;
case 1113200649:
iShape = 14;
break;
case 1113200650:
iShape = 15;
break;
case 1113200651:
iShape = 0;
break;
case 1113200652:
iShape = 7;
break;
case 1650071565:
iShape = 12;
break;
case 1708058:
iShape = 4;
break;
case 1113200654:
iShape = 10;
break;
case 1614417948:
iShape = 32;
break;
case 135198:
iShape = 18;
break;
case 659488:
iShape = 1;
break;
default:
this.error (47);
}
switch (tok) {
case 1115297793:
case 1113200642:
case 1113200647:
case 1113200649:
case 1113200650:
case 1650071565:
case 1113200654:
this.proteinShape (iShape);
return;
case 1113198595:
case 1113198597:
this.dots (iShape);
return;
case 1113198596:
this.ellipsoid ();
return;
case 1113200646:
case 1113200651:
case 1113200652:
this.setAtomShapeSize (iShape, (tok == 1113200646 ? -1.0 : 1));
return;
case 1826248715:
this.label (1);
return;
case 135182:
this.lcaoCartoon ();
return;
case 135192:
this.polyhedra ();
return;
case 1708058:
this.struts ();
return;
case 135198:
this.vector ();
return;
case 659488:
this.wireframe ();
return;
}
switch (tok) {
case 1611272194:
this.axes (1);
return;
case 1679429641:
this.boundbox (1);
return;
case 135402505:
this.contact ();
return;
case 135174:
this.dipole ();
return;
case 135176:
this.draw ();
return;
case 537022465:
this.echo (1, false);
return;
case 1611272202:
this.frank (1);
return;
case 135180:
case 135190:
case 135188:
this.isosurface (iShape);
return;
case 537006096:
case 1746538509:
this.measure ();
return;
case 1183762:
this.mo (false);
return;
case 1614417948:
this.unitcell (1);
return;
}
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "flowControl", 
($fz = function (tok, isForCheck) {
var ct;
switch (tok) {
case 20500:
this.gotoCmd (this.parameterAsString (this.checkLast (1)));
return isForCheck;
case 528410:
this.delay ();
if (!this.isSyntaxCheck) this.pc = -1;
return isForCheck;
}
var pt = this.statement[0].intValue;
var isDone = (pt < 0 && !this.isSyntaxCheck);
var isOK = true;
var ptNext = 0;
switch (tok) {
case 102412:
ct = this.theToken;
this.pushContext (ct);
if (!isDone && ct.name0 != null) this.contextVariables.put (ct.name0, ct.contextVariables.get (ct.name0));
isOK = !isDone;
break;
case 102439:
this.pushContext (this.theToken);
isDone = isOK = true;
this.addProcess (this.pc, pt, true);
break;
case 102410:
case 102413:
case 102411:
ptNext = Math.abs (this.aatoken[Math.abs (pt)][0].intValue);
switch (isDone ? 0 : this.switchCmd (this.theToken, tok)) {
case 0:
ptNext = -ptNext;
isOK = false;
break;
case -1:
isOK = false;
break;
case 1:
}
this.aatoken[this.pc][0].intValue = Math.abs (pt);
this.theToken = this.aatoken[Math.abs (pt)][0];
if (this.theToken.tok != 1150985) this.theToken.intValue = ptNext;
break;
case 135369225:
case 102402:
isOK = (!isDone && this.ifCmd ());
if (this.isSyntaxCheck) break;
ptNext = Math.abs (this.aatoken[Math.abs (pt)][0].intValue);
ptNext = (isDone || isOK ? -ptNext : ptNext);
this.aatoken[Math.abs (pt)][0].intValue = ptNext;
if (tok == 102412) this.aatoken[this.pc][0].intValue = -pt;
break;
case 364547:
this.checkLength (1);
if (pt < 0 && !this.isSyntaxCheck) this.pc = -pt - 1;
break;
case 364548:
this.checkLength (1);
break;
case 102406:
if (!isForCheck) this.pushContext (this.theToken);
isForCheck = false;
if (!this.ifCmd () && !this.isSyntaxCheck) {
this.pc = pt;
this.popContext (true, false);
}break;
case 102407:
if (!this.isSyntaxCheck) {
this.breakCmd (pt);
break;
}if (this.statementLength == 1) break;
var n = this.intParameter (this.checkLast (1));
if (this.isSyntaxCheck) break;
for (var i = 0; i < n; i++) this.popContext (true, false);

break;
case 102408:
isForCheck = true;
if (!this.isSyntaxCheck) this.pc = pt - 1;
if (this.statementLength > 1) this.intParameter (this.checkLast (1));
break;
case 135369224:
var token = this.theToken;
var pts =  Clazz.newIntArray (2, 0);
var j = 0;
var bsOrList = null;
for (var i = 1, nSkip = 0; i < this.statementLength && j < 2; i++) {
switch (this.tokAt (i)) {
case 1048591:
if (nSkip > 0) nSkip--;
 else pts[j++] = i;
break;
case 1073741980:
nSkip -= 2;
if (this.tokAt (++i) == 1048577 || this.tokAt (i) == 10) {
bsOrList = this.atomExpressionAt (i);
if (this.isBondSet) bsOrList =  new org.jmol.modelset.Bond.BondSet (bsOrList);
} else {
var what = this.parameterExpressionList (-i, 1, false);
if (what == null || what.size () < 1) this.error (22);
var vl = what.get (0);
switch (vl.tok) {
case 10:
bsOrList = org.jmol.script.ScriptVariable.getBitSet (vl, false);
break;
case 7:
bsOrList = vl.getList ();
break;
default:
this.error (22);
}
}i = this.iToken;
break;
case 135280132:
nSkip += 2;
break;
}
}
if (isForCheck) {
j = (bsOrList == null ? pts[1] + 1 : 2);
} else {
this.pushContext (token);
j = 2;
}if (this.tokAt (j) == 36868) j++;
var key = this.parameterAsString (j);
var isMinusMinus = key.equals ("--") || key.equals ("++");
if (isMinusMinus) {
key = this.parameterAsString (++j);
}var v = null;
if (org.jmol.script.Token.tokAttr (this.tokAt (j), 1073741824) || (v = this.getContextVariableAsVariable (key)) != null) {
if (bsOrList == null && !isMinusMinus && this.getToken (++j).tok != 269484436) this.error (22);
if (bsOrList == null) {
if (isMinusMinus) j -= 2;
this.setVariable (++j, this.statementLength - 1, key, 0);
} else {
isOK = true;
var key_incr = (key + "_incr");
if (v == null) v = this.getContextVariableAsVariable (key_incr);
if (v == null) {
if (key.startsWith ("_")) this.error (22);
v = this.viewer.getOrSetNewVariable (key_incr, true);
}if (!isForCheck || v.tok != 10 && v.tok != 7 || v.intValue == 2147483647) {
if (isForCheck) {
isOK = false;
} else {
v.set (org.jmol.script.ScriptVariable.getVariable (bsOrList), false);
v.intValue = 1;
}} else {
v.intValue++;
}isOK = isOK && (Clazz.instanceOf (bsOrList, org.jmol.util.BitSet) ? org.jmol.script.ScriptVariable.bsSelectVar (v).cardinality () == 1 : v.intValue <= v.getList ().size ());
if (isOK) {
v = org.jmol.script.ScriptVariable.selectItemVar (v);
var t = this.getContextVariableAsVariable (key);
if (t == null) t = this.viewer.getOrSetNewVariable (key, true);
t.set (v, false);
}}}if (bsOrList == null) isOK = this.parameterExpressionBoolean (pts[0] + 1, pts[1]);
pt++;
if (!isOK) this.popContext (true, false);
isForCheck = false;
break;
case 1150985:
switch (this.getToken (this.checkLast (1)).tok) {
case 364558:
var trycmd = this.getToken (1).value;
if (this.isSyntaxCheck) return false;
var cv = this.runFunctionRet (trycmd, "try", null, null, true, true).value;
var ret = cv.get ("_tryret");
if (ret.value != null || ret.intValue != 2147483647) {
this.returnCmd (ret);
return false;
}var errMsg = (cv.get ("_errorval")).value;
if (errMsg.length == 0) {
var iBreak = (cv.get ("_breakval")).intValue;
if (iBreak != 2147483647) {
this.breakCmd (this.pc - iBreak);
return false;
}}if (this.pc + 1 < this.aatoken.length && this.aatoken[this.pc + 1][0].tok == 102412) {
ct = this.aatoken[this.pc + 1][0];
if (ct.contextVariables != null && ct.name0 != null) ct.contextVariables.put (ct.name0, org.jmol.script.ScriptVariable.newVariable (4, errMsg));
ct.intValue = (errMsg.length > 0 ? 1 : -1) * Math.abs (ct.intValue);
}return false;
case 102412:
this.popContext (true, false);
break;
case 135368713:
case 102436:
this.viewer.addFunction (this.theToken.value);
return isForCheck;
case 102439:
this.addProcess (pt, this.pc, false);
this.popContext (true, false);
break;
case 102410:
if (pt > 0 && this.switchCmd (this.aatoken[pt][0], 0) == -1) {
for (; pt < this.pc; pt++) if ((tok = this.aatoken[pt][0].tok) != 102413 && tok != 102411) break;

isOK = (this.pc == pt);
}break;
}
if (isOK) isOK = (this.theTok == 102412 || this.theTok == 102439 || this.theTok == 135369225 || this.theTok == 102410);
isForCheck = (this.theTok == 135369224 || this.theTok == 102406);
break;
}
if (!isOK && !this.isSyntaxCheck) this.pc = Math.abs (pt) - 1;
return isForCheck;
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "gotoCmd", 
($fz = function (strTo) {
var pcTo = (strTo == null ? this.aatoken.length - 1 : -1);
var s = null;
for (var i = pcTo + 1; i < this.aatoken.length; i++) {
var tokens = this.aatoken[i];
var tok = tokens[0].tok;
switch (tok) {
case 20485:
case 0:
s = tokens[tokens.length - 1].value;
if (tok == 0) s = s.substring (s.startsWith ("#") ? 1 : 2);
break;
default:
continue;
}
if (s.equalsIgnoreCase (strTo)) {
pcTo = i;
break;
}}
if (pcTo < 0) this.error (22);
if (strTo == null) pcTo = 0;
var di = (pcTo < this.pc ? 1 : -1);
var nPush = 0;
for (var i = pcTo; i != this.pc; i += di) {
switch (this.aatoken[i][0].tok) {
case 266280:
case 102439:
case 135369224:
case 102412:
case 102406:
nPush++;
break;
case 266278:
nPush--;
break;
case 1150985:
switch (this.aatoken[i][1].tok) {
case 102439:
case 135369224:
case 102412:
case 102406:
nPush--;
}
break;
}
}
if (strTo == null) {
pcTo = 2147483647;
for (; nPush > 0; --nPush) this.popContext (false, false);

}if (nPush != 0) this.error (22);
if (!this.isSyntaxCheck) this.pc = pcTo - 1;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "breakCmd", 
($fz = function (pt) {
if (pt < 0) {
this.getContextVariableAsVariable ("_breakval").intValue = -pt;
this.pcEnd = this.pc;
return;
}this.pc = Math.abs (this.aatoken[pt][0].intValue);
var tok = this.aatoken[pt][0].tok;
if (tok == 102411 || tok == 102413) {
this.theToken = this.aatoken[this.pc--][0];
var ptNext = Math.abs (this.theToken.intValue);
if (this.theToken.tok != 1150985) this.theToken.intValue = -ptNext;
} else {
while (this.thisContext != null && !org.jmol.script.ScriptCompiler.isBreakableContext (this.thisContext.token.tok)) this.popContext (true, false);

this.popContext (true, false);
}}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "addProcess", 
($fz = function (pc, pt, isStart) {
if (this.parallelProcessor == null) return;
if (isStart) {
this.vProcess =  new java.util.ArrayList ();
} else {
var statements =  new Array (pt);
for (var i = 0; i < this.vProcess.size (); i++) statements[i + 1 - pc] = this.vProcess.get (i);

var context = this.getScriptContext ();
context.aatoken = statements;
context.pc = 1 - pc;
context.pcEnd = pt;
this.parallelProcessor.addProcess ("p" + (($t$ = ++ org.jmol.script.ScriptEvaluator.iProcess, org.jmol.script.ScriptEvaluator.prototype.iProcess = org.jmol.script.ScriptEvaluator.iProcess, $t$)), context);
this.vProcess = null;
}}, $fz.isPrivate = true, $fz), "~N,~N,~B");
Clazz.defineMethod (c$, "switchCmd", 
($fz = function (c, tok) {
if (tok == 102410) c.addName ("_var");
var $var = c.contextVariables.get ("_var");
if ($var == null) return 1;
if (tok == 0) {
c.contextVariables.remove ("_var");
return -1;
}if (tok == 102413) return -1;
var v = this.parameterExpressionToken (1);
if (tok == 102411) {
var isOK = org.jmol.script.ScriptVariable.areEqual ($var, v);
if (isOK) c.contextVariables.remove ("_var");
return isOK ? 1 : -1;
}c.contextVariables.put ("_var", v);
return 1;
}, $fz.isPrivate = true, $fz), "org.jmol.script.ContextToken,~N");
Clazz.defineMethod (c$, "ifCmd", 
($fz = function () {
return this.parameterExpressionBoolean (1, 0);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "returnCmd", 
($fz = function (tv) {
var t = this.getContextVariableAsVariable ("_retval");
if (t == null) {
if (!this.isSyntaxCheck) this.gotoCmd (null);
return;
}var v = (tv != null || this.statementLength == 1 ? null : this.parameterExpressionToken (1));
if (this.isSyntaxCheck) return;
if (tv == null) tv = (v == null ?  new org.jmol.script.ScriptVariableInt (0) : v);
t.value = tv.value;
t.intValue = tv.intValue;
t.tok = tv.tok;
this.gotoCmd (null);
}, $fz.isPrivate = true, $fz), "org.jmol.script.ScriptVariable");
Clazz.defineMethod (c$, "help", 
($fz = function () {
if (this.isSyntaxCheck) return;
var what = this.optParameterAsString (1).toLowerCase ();
var pt = 0;
if (what.startsWith ("mouse") && (pt = what.indexOf (" ")) >= 0 && pt == what.lastIndexOf (" ")) {
this.showString (this.viewer.getBindingInfo (what.substring (pt + 1)));
return;
}if (org.jmol.script.Token.tokAttr (org.jmol.script.Token.getTokFromName (what), 4096)) what = "?command=" + what;
this.viewer.getHelp (what);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "move", 
($fz = function () {
if (this.statementLength > 11) this.error (2);
var dRot = org.jmol.util.Vector3f.new3 (this.floatParameter (1), this.floatParameter (2), this.floatParameter (3));
var dZoom = this.floatParameter (4);
var dTrans = org.jmol.util.Vector3f.new3 (this.intParameter (5), this.intParameter (6), this.intParameter (7));
var dSlab = this.floatParameter (8);
var floatSecondsTotal = this.floatParameter (9);
var fps = (this.statementLength == 11 ? this.intParameter (10) : 30);
if (this.isSyntaxCheck) return;
this.refresh ();
this.viewer.move (dRot, dZoom, dTrans, dSlab, floatSecondsTotal, fps);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "moveto", 
($fz = function () {
if (this.statementLength == 2 && this.tokAt (1) == 1073742162) {
if (!this.isSyntaxCheck) this.viewer.stopMotion ();
return;
}if (this.statementLength == 2 && this.isFloatParameter (1)) {
var f = this.floatParameter (1);
if (this.isSyntaxCheck) return;
if (f > 0) this.refresh ();
this.viewer.moveTo (f, null, org.jmol.viewer.JmolConstants.axisZ, 0, null, 100, 0, 0, 0, null, NaN, NaN, NaN);
return;
}var axis = org.jmol.util.Vector3f.new3 (NaN, 0, 0);
var center = null;
var i = 1;
var floatSecondsTotal = (this.isFloatParameter (i) ? this.floatParameter (i++) : 2.0);
var degrees = 90;
var bsCenter = null;
switch (this.getToken (i).tok) {
case 135270417:
var q;
var isMolecular = false;
if (this.tokAt (++i) == 1073742030) {
isMolecular = true;
i++;
}if (this.tokAt (i) == 10 || this.tokAt (i) == 1048577) {
isMolecular = true;
center = this.centerParameter (i);
if (!(Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet))) this.error (22);
bsCenter = this.expressionResult;
q = (this.isSyntaxCheck ?  new org.jmol.util.Quaternion () : this.viewer.getAtomQuaternion (bsCenter.nextSetBit (0)));
} else {
q = this.getQuaternionParameter (i);
}i = this.iToken + 1;
if (q == null) this.error (22);
var aa = q.toAxisAngle4f ();
axis.set (aa.x, aa.y, aa.z);
degrees = (isMolecular ? -1 : 1) * (aa.angle * 180.0 / 3.141592653589793);
break;
case 9:
case 8:
case 1048586:
if (this.isPoint3f (i)) {
axis.setT (this.getPoint3f (i, true));
i = this.iToken + 1;
degrees = this.floatParameter (i++);
} else {
var pt4 = this.getPoint4f (i);
i = this.iToken + 1;
axis.set (pt4.x, pt4.y, pt4.z);
degrees = (pt4.x == 0 && pt4.y == 0 && pt4.z == 0 ? NaN : pt4.w);
}break;
case 1073741954:
axis.set (1, 0, 0);
degrees = 0;
this.checkLength (++i);
break;
case 1073741860:
axis.set (0, 1, 0);
degrees = 180;
this.checkLength (++i);
break;
case 1073741996:
axis.set (0, 1, 0);
this.checkLength (++i);
break;
case 1073742128:
axis.set (0, -1, 0);
this.checkLength (++i);
break;
case 1074790748:
axis.set (1, 0, 0);
this.checkLength (++i);
break;
case 1073741871:
axis.set (-1, 0, 0);
this.checkLength (++i);
break;
default:
axis = org.jmol.util.Vector3f.new3 (this.floatParameter (i++), this.floatParameter (i++), this.floatParameter (i++));
degrees = this.floatParameter (i++);
}
if (Float.isNaN (axis.x) || Float.isNaN (axis.y) || Float.isNaN (axis.z)) axis.set (0, 0, 0);
 else if (axis.length () == 0 && degrees == 0) degrees = NaN;
var isChange = !this.viewer.isInPosition (axis, degrees);
var zoom = (this.isFloatParameter (i) ? this.floatParameter (i++) : NaN);
var xTrans = 0;
var yTrans = 0;
if (this.isFloatParameter (i) && !this.isCenterParameter (i)) {
xTrans = this.floatParameter (i++);
yTrans = this.floatParameter (i++);
if (!isChange && Math.abs (xTrans - this.viewer.getTranslationXPercent ()) >= 1) isChange = true;
if (!isChange && Math.abs (yTrans - this.viewer.getTranslationYPercent ()) >= 1) isChange = true;
}if (bsCenter == null && i != this.statementLength) {
center = this.centerParameter (i);
if (Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet)) bsCenter = this.expressionResult;
i = this.iToken + 1;
}var rotationRadius = NaN;
var zoom0 = this.viewer.getZoomSetting ();
if (center != null) {
if (!isChange && center.distance (this.viewer.getRotationCenter ()) >= 0.1) isChange = true;
if (this.isFloatParameter (i)) rotationRadius = this.floatParameter (i++);
if (!this.isCenterParameter (i)) {
if ((rotationRadius == 0 || Float.isNaN (rotationRadius)) && (zoom == 0 || Float.isNaN (zoom))) {
var newZoom = Math.abs (this.getZoom (0, i, bsCenter, (zoom == 0 ? 0 : zoom0)));
i = this.iToken + 1;
zoom = newZoom;
} else {
if (!isChange && Math.abs (rotationRadius - this.viewer.getRotationRadius ()) >= 0.1) isChange = true;
}}}if (zoom == 0 || Float.isNaN (zoom)) zoom = 100;
if (Float.isNaN (rotationRadius)) rotationRadius = 0;
if (!isChange && Math.abs (zoom - zoom0) >= 1) isChange = true;
var navCenter = null;
var xNav = NaN;
var yNav = NaN;
var navDepth = NaN;
if (i != this.statementLength) {
navCenter = this.centerParameter (i);
i = this.iToken + 1;
if (i != this.statementLength) {
xNav = this.floatParameter (i++);
yNav = this.floatParameter (i++);
}if (i != this.statementLength) navDepth = this.floatParameter (i++);
}if (i != this.statementLength) this.error (2);
if (this.isSyntaxCheck) return;
if (!isChange) floatSecondsTotal = 0;
if (floatSecondsTotal > 0) this.refresh ();
this.viewer.moveTo (floatSecondsTotal, center, axis, degrees, null, zoom, xTrans, yTrans, rotationRadius, navCenter, xNav, yNav, navDepth);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "navigate", 
($fz = function () {
if (this.statementLength == 1) {
this.setBooleanProperty ("navigationMode", true);
return;
}var rotAxis = org.jmol.util.Vector3f.new3 (0, 1, 0);
var pt;
if (this.statementLength == 2) {
switch (this.getToken (1).tok) {
case 1048589:
case 1048588:
if (this.isSyntaxCheck) return;
this.setObjectMad (30, "axes", 1);
this.setShapeProperty (30, "position", org.jmol.util.Point3f.new3 (50, 50, 3.4028235E38));
this.setBooleanProperty ("navigationMode", true);
this.viewer.setNavOn (this.theTok == 1048589);
return;
case 1073742162:
if (!this.isSyntaxCheck) this.viewer.setNavXYZ (0, 0, 0);
return;
case 8:
break;
default:
this.error (22);
}
}if (!this.viewer.getNavigationMode ()) this.setBooleanProperty ("navigationMode", true);
for (var i = 1; i < this.statementLength; i++) {
var timeSec = (this.isFloatParameter (i) ? this.floatParameter (i++) : 2);
if (timeSec < 0) this.error (22);
if (!this.isSyntaxCheck && timeSec > 0) this.refresh ();
switch (this.getToken (i).tok) {
case 8:
case 1048586:
pt = this.getPoint3f (i, true);
this.iToken++;
if (this.iToken != this.statementLength) this.error (22);
if (this.isSyntaxCheck) return;
this.viewer.setNavXYZ (pt.x, pt.y, pt.z);
return;
case 554176526:
var depth = this.floatParameter (++i);
if (!this.isSyntaxCheck) this.viewer.setNavigationDepthPercent (timeSec, depth);
continue;
case 12289:
pt = this.centerParameter (++i);
i = this.iToken;
if (!this.isSyntaxCheck) this.viewer.navigatePt (timeSec, pt);
continue;
case 528432:
switch (this.getToken (++i).tok) {
case 1112541205:
rotAxis.set (1, 0, 0);
i++;
break;
case 1112541206:
rotAxis.set (0, 1, 0);
i++;
break;
case 1112541207:
rotAxis.set (0, 0, 1);
i++;
break;
case 8:
case 1048586:
rotAxis.setT (this.getPoint3f (i, true));
i = this.iToken + 1;
break;
case 1073741824:
this.error (22);
break;
}
var degrees = this.floatParameter (i);
if (!this.isSyntaxCheck) this.viewer.navigateAxis (timeSec, rotAxis, degrees);
continue;
case 4160:
var x = NaN;
var y = NaN;
if (this.isFloatParameter (++i)) {
x = this.floatParameter (i);
y = this.floatParameter (++i);
} else {
switch (this.tokAt (i)) {
case 1112541205:
x = this.floatParameter (++i);
break;
case 1112541206:
y = this.floatParameter (++i);
break;
default:
pt = this.centerParameter (i);
i = this.iToken;
if (!this.isSyntaxCheck) this.viewer.navTranslate (timeSec, pt);
continue;
}
}if (!this.isSyntaxCheck) this.viewer.navTranslatePercent (timeSec, x, y);
continue;
case 269484208:
continue;
case 1113200654:
var pathGuide;
var vp =  new java.util.ArrayList ();
var bs = this.atomExpressionAt (++i);
i = this.iToken;
if (this.isSyntaxCheck) return;
this.viewer.getPolymerPointsAndVectors (bs, vp);
var n;
if ((n = vp.size ()) > 0) {
pathGuide =  new Array (n);
for (var j = 0; j < n; j++) {
pathGuide[j] = vp.get (j);
}
this.viewer.navigateGuide (timeSec, pathGuide);
continue;
}break;
case 3145756:
if (i != 1) this.error (22);
if (this.isSyntaxCheck) return;
this.viewer.navigateSurface (timeSec, this.optParameterAsString (2));
continue;
case 1073742084:
var path;
var theta = null;
if (this.getToken (i + 1).tok == 1048583) {
i++;
var pathID = this.objectNameParameter (++i);
if (this.isSyntaxCheck) return;
this.setShapeProperty (22, "thisID", pathID);
path = this.getShapeProperty (22, "vertices");
this.refresh ();
if (path == null) this.error (22);
var indexStart = Clazz.floatToInt (this.isFloatParameter (i + 1) ? this.floatParameter (++i) : 0);
var indexEnd = Clazz.floatToInt (this.isFloatParameter (i + 1) ? this.floatParameter (++i) : 2147483647);
if (!this.isSyntaxCheck) this.viewer.navigatePath (timeSec, path, theta, indexStart, indexEnd);
continue;
}var v =  new java.util.ArrayList ();
while (this.isCenterParameter (i + 1)) {
v.add (this.centerParameter (++i));
i = this.iToken;
}
if (v.size () > 0) {
path = v.toArray ( new Array (v.size ()));
if (!this.isSyntaxCheck) this.viewer.navigatePath (timeSec, path, theta, 0, 2147483647);
continue;
}default:
this.error (22);
}
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "bondorder", 
($fz = function () {
this.checkLength (-3);
var order = 0;
switch (this.getToken (1).tok) {
case 2:
case 3:
if ((order = org.jmol.util.JmolEdge.getBondOrderFromFloat (this.floatParameter (1))) == 131071) this.error (22);
break;
default:
if ((order = org.jmol.script.ScriptEvaluator.getBondOrderFromString (this.parameterAsString (1))) == 131071) this.error (22);
if (order == 33 && this.tokAt (2) == 3) {
order = org.jmol.script.ScriptEvaluator.getPartialBondOrderFromFloatEncodedInt (this.statement[2].intValue);
}}
this.setShapeProperty (1, "bondOrder", Integer.$valueOf (order));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "console", 
($fz = function () {
switch (this.getToken (1).tok) {
case 1048588:
if (!this.isSyntaxCheck) this.viewer.showConsole (false);
break;
case 1048589:
if (this.isSyntaxCheck) break;
this.viewer.showConsole (true);
break;
default:
this.error (22);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "centerAt", 
($fz = function () {
var relativeTo = null;
switch (this.getToken (1).tok) {
case 1073741826:
relativeTo = "absolute";
break;
case 96:
relativeTo = "average";
break;
case 1679429641:
relativeTo = "boundbox";
break;
default:
this.error (22);
}
var pt = org.jmol.util.Point3f.new3 (0, 0, 0);
if (this.statementLength == 5) {
pt.x = this.floatParameter (2);
pt.y = this.floatParameter (3);
pt.z = this.floatParameter (4);
} else if (this.isCenterParameter (2)) {
pt = this.centerParameter (2);
this.checkLast (this.iToken);
} else {
this.checkLength (2);
}if (!this.isSyntaxCheck) this.viewer.setCenterAt (relativeTo, pt);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "stereo", 
($fz = function () {
var stereoMode = org.jmol.constant.EnumStereoMode.DOUBLE;
var degrees = -5;
var degreesSeen = false;
var colors = null;
var colorpt = 0;
for (var i = 1; i < this.statementLength; ++i) {
if (this.isColorParam (i)) {
if (colorpt > 1) this.error (2);
if (colorpt == 0) colors =  Clazz.newIntArray (2, 0);
if (!degreesSeen) degrees = 3;
colors[colorpt] = this.getArgbParam (i);
if (colorpt++ == 0) colors[1] = ~colors[0];
i = this.iToken;
continue;
}switch (this.getToken (i).tok) {
case 1048589:
this.checkLast (this.iToken = 1);
this.iToken = 1;
break;
case 1048588:
this.checkLast (this.iToken = 1);
stereoMode = org.jmol.constant.EnumStereoMode.NONE;
break;
case 2:
case 3:
degrees = this.floatParameter (i);
degreesSeen = true;
break;
case 1073741824:
if (!degreesSeen) degrees = 3;
stereoMode = org.jmol.constant.EnumStereoMode.getStereoMode (this.parameterAsString (i));
if (stereoMode != null) break;
default:
this.error (22);
}
}
if (this.isSyntaxCheck) return;
this.viewer.setStereoMode (colors, stereoMode, degrees);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "compare", 
($fz = function () {
var isQuaternion = false;
var doRotate = false;
var doTranslate = false;
var doAnimate = false;
var nSeconds = NaN;
var data1 = null;
var data2 = null;
var bsAtoms1 = null;
var bsAtoms2 = null;
var vAtomSets = null;
var vQuatSets = null;
var bsFrom = (this.tokAt (1) == 3158024 ? null : this.atomExpressionAt (1));
var bsTo = (this.tokAt (++this.iToken) == 3158024 ? null : this.atomExpressionAt (this.iToken));
if (bsFrom == null || bsTo == null) this.error (22);
var bsSubset = null;
var isSmiles = false;
var strSmiles = null;
var bs = org.jmol.util.BitSetUtil.copy (bsFrom);
bs.or (bsTo);
var isToSubsetOfFrom = bs.equals (bsFrom);
var isFrames = isToSubsetOfFrom;
for (var i = this.iToken + 1; i < this.statementLength; ++i) {
switch (this.getToken (i).tok) {
case 4115:
isFrames = true;
break;
case 135267336:
isSmiles = true;
case 135267335:
strSmiles = this.stringParameter (++i);
break;
case 3:
case 2:
nSeconds = Math.abs (this.floatParameter (i));
if (nSeconds > 0) doAnimate = true;
break;
case 269484080:
break;
case 3158024:
bsSubset = this.atomExpressionAt (++i);
i = this.iToken;
break;
case 10:
case 1048577:
if (vQuatSets != null) this.error (22);
bsAtoms1 = this.atomExpressionAt (this.iToken);
var tok = (isToSubsetOfFrom ? 0 : this.tokAt (this.iToken + 1));
bsAtoms2 = (tok == 10 || tok == 1048577 ? this.atomExpressionAt (++this.iToken) : org.jmol.util.BitSetUtil.copy (bsAtoms1));
if (bsSubset != null) {
bsAtoms1.and (bsSubset);
bsAtoms2.and (bsSubset);
}bsAtoms2.and (bsTo);
if (vAtomSets == null) vAtomSets =  new java.util.ArrayList ();
vAtomSets.add ([bsAtoms1, bsAtoms2]);
i = this.iToken;
break;
case 7:
if (vAtomSets != null) this.error (22);
isQuaternion = true;
data1 = org.jmol.script.ScriptMathProcessor.getQuaternionArray ((this.theToken).getList (), 1073742001);
this.getToken (++i);
data2 = org.jmol.script.ScriptMathProcessor.getQuaternionArray ((this.theToken).getList (), 1073742001);
if (vQuatSets == null) vQuatSets =  new java.util.ArrayList ();
vQuatSets.add ([data1, data2]);
break;
case 1073742077:
isQuaternion = true;
break;
case 135266320:
case 1141899265:
isQuaternion = false;
break;
case 528432:
doRotate = true;
break;
case 4160:
doTranslate = true;
break;
default:
this.error (22);
}
}
if (this.isSyntaxCheck) return;
if (isFrames) nSeconds = 0;
if (Float.isNaN (nSeconds) || nSeconds < 0) nSeconds = 1;
 else if (!doRotate && !doTranslate) doRotate = doTranslate = true;
doAnimate = (nSeconds != 0);
var isAtoms = (!isQuaternion && strSmiles == null);
if (vAtomSets == null && vQuatSets == null) {
if (bsSubset == null) {
bsAtoms1 = (isAtoms ? this.viewer.getAtomBitSet ("spine") :  new org.jmol.util.BitSet ());
if (bsAtoms1.nextSetBit (0) < 0) {
bsAtoms1 = bsFrom;
bsAtoms2 = bsTo;
} else {
bsAtoms2 = org.jmol.util.BitSetUtil.copy (bsAtoms1);
bsAtoms1.and (bsFrom);
bsAtoms2.and (bsTo);
}} else {
bsAtoms1 = org.jmol.util.BitSetUtil.copy (bsFrom);
bsAtoms2 = org.jmol.util.BitSetUtil.copy (bsTo);
bsAtoms1.and (bsSubset);
bsAtoms2.and (bsSubset);
bsAtoms1.and (bsFrom);
bsAtoms2.and (bsTo);
}vAtomSets =  new java.util.ArrayList ();
vAtomSets.add ([bsAtoms1, bsAtoms2]);
}var bsFrames;
if (isFrames) {
var bsModels = this.viewer.getModelBitSet (bsFrom, false);
bsFrames =  new Array (bsModels.cardinality ());
for (var i = 0, iModel = bsModels.nextSetBit (0); iModel >= 0; iModel = bsModels.nextSetBit (iModel + 1), i++) bsFrames[i] = this.viewer.getModelUndeletedAtomsBitSet (iModel);

} else {
bsFrames = [bsFrom];
}for (var iFrame = 0; iFrame < bsFrames.length; iFrame++) {
bsFrom = bsFrames[iFrame];
var retStddev =  Clazz.newFloatArray (2, 0);
var q = null;
var vQ =  new java.util.ArrayList ();
var centerAndPoints = null;
var vAtomSets2 = (isFrames ?  new java.util.ArrayList () : vAtomSets);
for (var i = 0; i < vAtomSets.size (); ++i) {
var bss = vAtomSets.get (i);
if (isFrames) vAtomSets2.add (bss = [org.jmol.util.BitSetUtil.copy (bss[0]), bss[1]]);
bss[0].and (bsFrom);
}
if (isAtoms) {
centerAndPoints = this.viewer.getCenterAndPoints (vAtomSets2, true);
q = org.jmol.util.Measure.calculateQuaternionRotation (centerAndPoints, retStddev, true);
var r0 = (Float.isNaN (retStddev[1]) ? NaN : Math.round (retStddev[0] * 100) / 100);
var r1 = (Float.isNaN (retStddev[1]) ? NaN : Math.round (retStddev[1] * 100) / 100);
this.showString ("RMSD " + r0 + " --> " + r1 + " Angstroms");
} else if (isQuaternion) {
if (vQuatSets == null) {
for (var i = 0; i < vAtomSets2.size (); i++) {
var bss = vAtomSets2.get (i);
data1 = this.viewer.getAtomGroupQuaternions (bss[0], 2147483647);
data2 = this.viewer.getAtomGroupQuaternions (bss[1], 2147483647);
for (var j = 0; j < data1.length && j < data2.length; j++) {
vQ.add (data2[j].div (data1[j]));
}
}
} else {
for (var j = 0; j < data1.length && j < data2.length; j++) {
vQ.add (data2[j].div (data1[j]));
}
}retStddev[0] = 0;
data1 = vQ.toArray ( new Array (vQ.size ()));
q = org.jmol.util.Quaternion.sphereMean (data1, retStddev, 0.0001);
this.showString ("RMSD = " + retStddev[0] + " degrees");
} else {
var m4 =  new org.jmol.util.Matrix4f ();
var stddev = this.getSmilesCorrelation (bsFrom, bsTo, strSmiles, null, null, m4, null, !isSmiles, false);
if (Float.isNaN (stddev)) this.error (22);
var translation =  new org.jmol.util.Vector3f ();
m4.get (translation);
var m3 =  new org.jmol.util.Matrix3f ();
m4.getRotationScale (m3);
q = org.jmol.util.Quaternion.newM (m3);
}if (centerAndPoints == null) centerAndPoints = this.viewer.getCenterAndPoints (vAtomSets2, true);
var pt1 =  new org.jmol.util.Point3f ();
var endDegrees = NaN;
var translation = null;
if (doTranslate) {
translation = org.jmol.util.Vector3f.newV (centerAndPoints[1][0]);
translation.sub (centerAndPoints[0][0]);
endDegrees = 0;
}if (doRotate) {
if (q == null) this.evalError ("option not implemented", null);
pt1.setT (centerAndPoints[0][0]);
pt1.add (q.getNormal ());
endDegrees = q.getTheta ();
}if (Float.isNaN (endDegrees) || Float.isNaN (pt1.x)) continue;
var ptsB = null;
if (doRotate && doTranslate && nSeconds != 0) {
var ptsA = this.viewer.getAtomPointVector (bsFrom);
var m4 = org.jmol.script.ScriptMathProcessor.getMatrix4f (q.getMatrix (), translation);
ptsB = org.jmol.util.Measure.transformPoints (ptsA, m4, centerAndPoints[0][0]);
}this.viewer.rotateAboutPointsInternal (centerAndPoints[0][0], pt1, endDegrees / nSeconds, endDegrees, doAnimate, bsFrom, translation, ptsB);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getSmilesCorrelation", 
function (bsA, bsB, smiles, ptsA, ptsB, m, vReturn, isSmarts, asMap) {
var tolerance = 0.1;
try {
if (ptsA == null) {
ptsA =  new java.util.ArrayList ();
ptsB =  new java.util.ArrayList ();
}if (m == null) m =  new org.jmol.util.Matrix4f ();
var atoms = this.viewer.getModelSet ().atoms;
var atomCount = this.viewer.getAtomCount ();
var maps = this.viewer.getSmilesMatcher ().getCorrelationMaps (smiles, atoms, atomCount, bsA, isSmarts, true);
if (maps == null) this.evalError (this.viewer.getSmilesMatcher ().getLastException (), null);
if (maps.length == 0) return NaN;
for (var i = 0; i < maps[0].length; i++) ptsA.add (atoms[maps[0][i]]);

maps = this.viewer.getSmilesMatcher ().getCorrelationMaps (smiles, atoms, atomCount, bsB, isSmarts, false);
if (maps == null) this.evalError (this.viewer.getSmilesMatcher ().getLastException (), null);
if (maps.length == 0) return NaN;
if (asMap) {
for (var i = 0; i < maps.length; i++) for (var j = 0; j < maps[i].length; j++) ptsB.add (atoms[maps[i][j]]);


return 0;
}var lowestStdDev = 3.4028235E38;
var mapB = null;
for (var i = 0; i < maps.length; i++) {
ptsB.clear ();
for (var j = 0; j < maps[i].length; j++) ptsB.add (atoms[maps[i][j]]);

var stddev = org.jmol.util.Measure.getTransformMatrix4 (ptsA, ptsB, m, null);
org.jmol.util.Logger.info ("getSmilesCorrelation stddev=" + stddev);
if (vReturn != null) {
if (stddev < tolerance) {
var bs =  new org.jmol.util.BitSet ();
for (var j = 0; j < maps[i].length; j++) bs.set (maps[i][j]);

vReturn.add (bs);
}}if (stddev < lowestStdDev) {
mapB = maps[i];
lowestStdDev = stddev;
}}
for (var i = 0; i < mapB.length; i++) ptsB.add (atoms[mapB[i]]);

return lowestStdDev;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.evalError (e.getMessage (), null);
return 0;
} else {
throw e;
}
}
}, "org.jmol.util.BitSet,org.jmol.util.BitSet,~S,java.util.List,java.util.List,org.jmol.util.Matrix4f,java.util.List,~B,~B");
Clazz.defineMethod (c$, "getSmilesMatches", 
function (pattern, smiles, bsSelected, bsMatch3D, isSmarts, asOneBitset) {
if (this.isSyntaxCheck) {
if (asOneBitset) return  new org.jmol.util.BitSet ();
return ["({})"];
}if (pattern.length == 0) {
var isBioSmiles = (!asOneBitset);
var ret = this.viewer.getSmiles (0, 0, bsSelected, isBioSmiles, false, true, true);
if (ret == null) this.evalError (this.viewer.getSmilesMatcher ().getLastException (), null);
return ret;
}var asAtoms = true;
var b;
if (bsMatch3D == null) {
asAtoms = (smiles == null);
if (asAtoms) b = this.viewer.getSmilesMatcher ().getSubstructureSetArray (pattern, this.viewer.getModelSet ().atoms, this.viewer.getAtomCount (), bsSelected, null, isSmarts, false);
 else b = this.viewer.getSmilesMatcher ().find (pattern, smiles, isSmarts, false);
if (b == null) {
this.showStringPrint (this.viewer.getSmilesMatcher ().getLastException (), false);
if (!asAtoms && !isSmarts) return Integer.$valueOf (-1);
return "?";
}} else {
var vReturn =  new java.util.ArrayList ();
var stddev = this.getSmilesCorrelation (bsMatch3D, bsSelected, pattern, null, null, null, vReturn, isSmarts, false);
if (Float.isNaN (stddev)) {
if (asOneBitset) return  new org.jmol.util.BitSet ();
return [];
}this.showString ("RMSD " + stddev + " Angstroms");
b = vReturn.toArray ( new Array (vReturn.size ()));
}if (asOneBitset) {
var bs =  new org.jmol.util.BitSet ();
for (var j = 0; j < b.length; j++) bs.or (b[j]);

if (asAtoms) return bs;
if (!isSmarts) return Integer.$valueOf (bs.cardinality ());
var iarray =  Clazz.newIntArray (bs.cardinality (), 0);
var pt = 0;
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) iarray[pt++] = i + 1;

return iarray;
}var matches =  new Array (b.length);
for (var j = 0; j < b.length; j++) matches[j] = org.jmol.util.Escape.escapeBs (b[j], asAtoms);

return matches;
}, "~S,~S,org.jmol.util.BitSet,org.jmol.util.BitSet,~B,~B");
Clazz.defineMethod (c$, "connect", 
($fz = function (index) {
var distances =  Clazz.newFloatArray (2, 0);
var atomSets =  new Array (2);
atomSets[0] = atomSets[1] = this.viewer.getSelectionSet (false);
var radius = NaN;
var color = -2147483648;
var distanceCount = 0;
var bondOrder = 131071;
var bo;
var operation = 1073742026;
var isDelete = false;
var haveType = false;
var haveOperation = false;
var translucency = null;
var translucentLevel = 3.4028235E38;
var isColorOrRadius = false;
var nAtomSets = 0;
var nDistances = 0;
var bsBonds =  new org.jmol.util.BitSet ();
var isBonds = false;
var expression2 = 0;
var ptColor = 0;
var energy = 0;
var addGroup = false;
if (this.statementLength == 1) {
if (!this.isSyntaxCheck) this.viewer.rebondState (this.isStateScript);
return;
}for (var i = index; i < this.statementLength; ++i) {
switch (this.getToken (i).tok) {
case 1048589:
case 1048588:
this.checkLength (2);
if (!this.isSyntaxCheck) this.viewer.rebondState (this.isStateScript);
return;
case 2:
case 3:
if (nAtomSets > 0) {
if (haveType || isColorOrRadius) this.error (23);
bo = org.jmol.util.JmolEdge.getBondOrderFromFloat (this.floatParameter (i));
if (bo == 131071) this.error (22);
bondOrder = bo;
haveType = true;
break;
}if (++nDistances > 2) this.error (2);
var dist = this.floatParameter (i);
if (this.tokAt (i + 1) == 269484210) {
dist = -dist / 100;
i++;
}distances[distanceCount++] = dist;
break;
case 10:
case 1048577:
if (nAtomSets > 2 || isBonds && nAtomSets > 0) this.error (2);
if (haveType || isColorOrRadius) this.error (23);
atomSets[nAtomSets++] = this.atomExpressionAt (i);
isBonds = this.isBondSet;
if (nAtomSets == 2) {
var pt = this.iToken;
for (var j = i; j < pt; j++) if (this.tokAt (j) == 1073741824 && this.parameterAsString (j).equals ("_1")) {
expression2 = i;
break;
}
this.iToken = pt;
}i = this.iToken;
break;
case 1087373318:
addGroup = true;
break;
case 1766856708:
var tok = this.tokAt (i + 1);
if (tok != 1073742180 && tok != 1073742074) ptColor = i + 1;
continue;
case 1073742180:
case 1073742074:
if (translucency != null) this.error (22);
isColorOrRadius = true;
translucency = this.parameterAsString (i);
if (this.theTok == 1073742180 && this.isFloatParameter (i + 1)) translucentLevel = this.getTranslucentLevel (++i);
ptColor = i + 1;
break;
case 1074790662:
var isAuto = (this.tokAt (2) == 1073741852);
this.checkLength (isAuto ? 3 : 2);
if (!this.isSyntaxCheck) this.viewer.setPdbConectBonding (isAuto, this.isStateScript);
return;
case 1073741830:
case 1073741852:
case 1073741904:
case 1073742025:
case 1073742026:
haveOperation = true;
if (++i != this.statementLength) this.error (23);
operation = this.theTok;
if (this.theTok == 1073741852 && !(bondOrder == 131071 || bondOrder == 2048 || bondOrder == 515)) this.error (22);
break;
case 1708058:
if (!isColorOrRadius) {
color = 0xFFFFFF;
translucency = "translucent";
translucentLevel = 0.5;
radius = this.viewer.getStrutDefaultRadius ();
isColorOrRadius = true;
}if (!haveOperation) operation = 1073742026;
haveOperation = true;
case 1073741824:
case 1076887572:
case 1612189718:
if (i > 0) {
if (ptColor == i) break;
if (this.isColorParam (i)) {
ptColor = -i;
break;
}}var cmd = this.parameterAsString (i);
if ((bo = org.jmol.script.ScriptEvaluator.getBondOrderFromString (cmd)) == 131071) {
this.error (22);
}if (haveType) this.error (18);
haveType = true;
switch (bo) {
case 33:
switch (this.tokAt (i + 1)) {
case 3:
bo = org.jmol.script.ScriptEvaluator.getPartialBondOrderFromFloatEncodedInt (this.statement[++i].intValue);
break;
case 2:
bo = this.intParameter (++i);
break;
}
break;
case 2048:
if (this.tokAt (i + 1) == 2) {
bo = (this.intParameter (++i) << 11);
energy = this.floatParameter (++i);
}break;
}
bondOrder = bo;
break;
case 1666189314:
radius = this.floatParameter (++i);
isColorOrRadius = true;
break;
case 1048587:
case 12291:
if (++i != this.statementLength) this.error (23);
operation = 12291;
isDelete = true;
isColorOrRadius = false;
break;
default:
ptColor = i;
break;
}
if (i > 0) {
if (ptColor == -i || ptColor == i && this.isColorParam (i)) {
color = this.getArgbParam (i);
i = this.iToken;
isColorOrRadius = true;
} else if (ptColor == i) {
this.error (22);
}}}
if (this.isSyntaxCheck) return;
if (distanceCount < 2) {
if (distanceCount == 0) distances[0] = 1.0E8;
distances[1] = distances[0];
distances[0] = 0.1;
}if (translucency != null || !Float.isNaN (radius) || color != -2147483648) {
if (!haveType) bondOrder = 65535;
if (!haveOperation) operation = 1073742025;
}var nNew = 0;
var nModified = 0;
var result;
if (expression2 > 0) {
var bs =  new org.jmol.util.BitSet ();
this.definedAtomSets.put ("_1", bs);
var bs0 = atomSets[0];
for (var atom1 = bs0.nextSetBit (0); atom1 >= 0; atom1 = bs0.nextSetBit (atom1 + 1)) {
bs.set (atom1);
result = this.viewer.makeConnections (distances[0], distances[1], bondOrder, operation, bs, this.atomExpressionAt (expression2), bsBonds, isBonds, false, 0);
nNew += Math.abs (result[0]);
nModified += result[1];
bs.clear (atom1);
}
} else {
result = this.viewer.makeConnections (distances[0], distances[1], bondOrder, operation, atomSets[0], atomSets[1], bsBonds, isBonds, addGroup, energy);
nNew += Math.abs (result[0]);
nModified += result[1];
}if (isDelete) {
if (!(this.tQuiet || this.scriptLevel > this.scriptReportingLevel)) this.scriptStatusOrBuffer (org.jmol.i18n.GT._ ("{0} connections deleted", nModified));
return;
}if (isColorOrRadius) {
this.viewer.selectBonds (bsBonds);
if (!Float.isNaN (radius)) this.setShapeSizeBs (1, Math.round (radius * 2000), null);
if (color != -2147483648) this.setShapePropertyBs (1, "color", Integer.$valueOf (color), bsBonds);
if (translucency != null) {
if (translucentLevel == 3.4028235E38) translucentLevel = this.viewer.getDefaultTranslucent ();
this.setShapeProperty (1, "translucentLevel", Float.$valueOf (translucentLevel));
this.setShapePropertyBs (1, "translucency", translucency, bsBonds);
}this.viewer.selectBonds (null);
}if (!(this.tQuiet || this.scriptLevel > this.scriptReportingLevel)) this.scriptStatusOrBuffer (org.jmol.i18n.GT._ ("{0} new bonds; {1} modified", [Integer.$valueOf (nNew), Integer.$valueOf (nModified)]));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getTranslucentLevel", 
($fz = function (i) {
var f = this.floatParameter (i);
return (this.theTok == 2 && f > 0 && f < 9 ? f + 1 : f);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getProperty", 
($fz = function () {
if (this.isSyntaxCheck) return;
var retValue = "";
var property = this.optParameterAsString (1);
var name = property;
if (name.indexOf (".") >= 0) name = name.substring (0, name.indexOf ("."));
if (name.indexOf ("[") >= 0) name = name.substring (0, name.indexOf ("["));
var propertyID = org.jmol.viewer.PropertyManager.getPropertyNumber (name);
var param = this.optParameterAsString (2);
var tok = this.tokAt (2);
var bs = (tok == 1048577 || tok == 10 ? this.atomExpressionAt (2) : null);
if (property.length > 0 && propertyID < 0) {
property = "";
param = "";
} else if (propertyID >= 0 && this.statementLength < 3) {
param = org.jmol.viewer.PropertyManager.getDefaultParam (propertyID);
if (param.equals ("(visible)")) {
this.viewer.setModelVisibility ();
bs = this.viewer.getVisibleSet ();
}} else if (propertyID == 3) {
for (var i = 3; i < this.statementLength; i++) param += this.parameterAsString (i);

}retValue = this.viewer.getProperty ("readable", property, (bs == null ? param : bs));
this.showString (retValue);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "background", 
($fz = function (i) {
this.getToken (i);
var argb;
if (this.theTok == 1073741979) {
var file = this.parameterAsString (this.checkLast (++i));
if (this.isSyntaxCheck) return;
var retFileName =  new Array (1);
var image = null;
if (!file.equalsIgnoreCase ("none") && file.length > 0) {
image = this.viewer.getFileAsImage (file, retFileName);
if (image == null) this.evalError (retFileName[0], null);
}this.viewer.setBackgroundImage (retFileName[0], image);
return;
}if (this.isColorParam (i) || this.theTok == 1048587) {
argb = this.getArgbParamLast (i, true);
if (this.isSyntaxCheck) return;
this.setObjectArgb ("background", argb);
this.viewer.setBackgroundImage (null, null);
return;
}var iShape = this.getShapeType (this.theTok);
this.colorShape (iShape, i + 1, true);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "center", 
($fz = function (i) {
if (this.statementLength == 1) {
this.viewer.setNewRotationCenter (null);
return;
}var center = this.centerParameter (i);
if (center == null) this.error (22);
if (!this.isSyntaxCheck) this.viewer.setNewRotationCenter (center);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "setObjectProperty", 
($fz = function () {
var s = "";
var id = this.getShapeNameParameter (2);
var data = [id, null];
if (this.isSyntaxCheck) return "";
var iTok = this.iToken;
var tokCommand = this.tokAt (0);
var isWild = org.jmol.util.TextFormat.isWild (id);
for (var iShape = 17; ; ) {
if (iShape != 26 && this.getShapePropertyData (iShape, "checkID", data)) {
this.setShapeProperty (iShape, "thisID", id);
switch (tokCommand) {
case 12291:
this.setShapeProperty (iShape, "delete", null);
break;
case 12294:
case 1610625028:
this.setShapeProperty (iShape, "hidden", tokCommand == 1610625028 ? Boolean.FALSE : Boolean.TRUE);
break;
case 4148:
s += this.getShapeProperty (iShape, "command") + "\n";
break;
case 1766856708:
this.colorShape (iShape, iTok + 1, false);
break;
}
if (!isWild) break;
}if (iShape == 17) iShape = 30;
if (--iShape < 22) break;
}
return s;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "color", 
($fz = function () {
var i = 1;
if (this.isColorParam (1)) {
this.theTok = 1141899265;
} else {
var argb = 0;
i = 2;
var tok = this.getToken (1).tok;
switch (tok) {
case 1048583:
this.setObjectProperty ();
return;
case 1087373315:
case 3145730:
case 1087373316:
case 1073741946:
case 1632634889:
case 1087373318:
case 1114638346:
case 1087373322:
case 1073741992:
case 1095761934:
case 1073742032:
case 1048587:
case 1073742074:
case 1112541196:
case 1095761935:
case 1716520973:
case 1073742116:
case 1113200651:
case 1073742144:
case 1112539148:
case 1641025539:
case 1112539149:
case 1112541199:
case 1073742180:
case 1073742186:
case 1649412112:
this.theTok = 1141899265;
i = 1;
break;
case 4:
i = 1;
var strColor = this.stringParameter (i++);
if (this.isArrayParameter (i)) {
strColor = strColor += "=" + org.jmol.script.ScriptVariable.sValue (org.jmol.script.ScriptVariable.getVariableAS (this.stringParameterSet (i))).$replace ('\n', ' ');
i = this.iToken + 1;
}var isTranslucent = (this.tokAt (i) == 1073742180);
if (!this.isSyntaxCheck) this.viewer.setPropertyColorScheme (strColor, isTranslucent, true);
if (isTranslucent) ++i;
if (this.tokAt (i) == 1073742114 || this.tokAt (i) == 1073741826) {
var min = this.floatParameter (++i);
var max = this.floatParameter (++i);
if (!this.isSyntaxCheck) this.viewer.setCurrentColorRange (min, max);
}return;
case 1073742114:
case 1073741826:
var min = this.floatParameter (2);
var max = this.floatParameter (this.checkLast (3));
if (!this.isSyntaxCheck) this.viewer.setCurrentColorRange (min, max);
return;
case 1610616835:
argb = this.getArgbParamLast (2, true);
if (!this.isSyntaxCheck) this.setObjectArgb ("background", argb);
return;
case 10:
case 1048577:
i = -1;
this.theTok = 1141899265;
break;
case 1073742134:
argb = this.getArgbParamLast (2, false);
if (!this.isSyntaxCheck) this.viewer.setRubberbandArgb (argb);
return;
case 536870920:
case 1611141171:
i = 2;
if (this.tokAt (2) == 1073742074) i++;
argb = this.getArgbParamLast (i, true);
if (this.isSyntaxCheck) return;
this.shapeManager.loadShape (8);
this.setShapeProperty (8, (tok == 1611141171 ? "argbSelection" : "argbHighlight"), Integer.$valueOf (argb));
return;
case 1611272194:
case 1679429641:
case 1614417948:
case 1073741824:
case 1613758476:
var str = this.parameterAsString (1);
if (this.checkToken (2)) {
switch (this.getToken (2).tok) {
case 1073742116:
argb = 1073742116;
break;
case 1048587:
case 1073741992:
argb = 1073741992;
break;
default:
argb = this.getArgbParam (2);
}
}if (argb == 0) this.error (9);
this.checkLast (this.iToken);
if (str.equalsIgnoreCase ("axes") || org.jmol.viewer.StateManager.getObjectIdFromName (str) >= 0) {
this.setObjectArgb (str, argb);
return;
}if (this.changeElementColor (str, argb)) return;
this.error (22);
break;
case 135180:
case 135402505:
this.setShapeProperty (org.jmol.viewer.JmolConstants.shapeTokenIndex (tok), "thisID", "+PREVIOUS_MESH+");
break;
}
}this.colorShape (this.getShapeType (this.theTok), i, false);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "changeElementColor", 
($fz = function (str, argb) {
for (var i = org.jmol.util.Elements.elementNumberMax; --i >= 0; ) {
if (str.equalsIgnoreCase (org.jmol.util.Elements.elementNameFromNumber (i))) {
if (!this.isSyntaxCheck) this.viewer.setElementArgb (i, argb);
return true;
}}
for (var i = org.jmol.util.Elements.altElementMax; --i >= 0; ) {
if (str.equalsIgnoreCase (org.jmol.util.Elements.altElementNameFromIndex (i))) {
if (!this.isSyntaxCheck) this.viewer.setElementArgb (org.jmol.util.Elements.altElementNumberFromIndex (i), argb);
return true;
}}
if (str.charAt (0) != '_') return false;
for (var i = org.jmol.util.Elements.elementNumberMax; --i >= 0; ) {
if (str.equalsIgnoreCase ("_" + org.jmol.util.Elements.elementSymbolFromNumber (i))) {
if (!this.isSyntaxCheck) this.viewer.setElementArgb (i, argb);
return true;
}}
for (var i = org.jmol.util.Elements.altElementMax; --i >= 4; ) {
if (str.equalsIgnoreCase ("_" + org.jmol.util.Elements.altElementSymbolFromIndex (i))) {
if (!this.isSyntaxCheck) this.viewer.setElementArgb (org.jmol.util.Elements.altElementNumberFromIndex (i), argb);
return true;
}if (str.equalsIgnoreCase ("_" + org.jmol.util.Elements.altIsotopeSymbolFromIndex (i))) {
if (!this.isSyntaxCheck) this.viewer.setElementArgb (org.jmol.util.Elements.altElementNumberFromIndex (i), argb);
return true;
}}
return false;
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "colorShape", 
($fz = function (shapeType, index, isBackground) {
var translucency = null;
var colorvalue = null;
var colorvalue1 = null;
var bs = null;
var prefix = "";
var isColor = false;
var isIsosurface = (shapeType == 23 || shapeType == 24);
var typeMask = 0;
var doClearBondSet = false;
var translucentLevel = 3.4028235E38;
if (index < 0) {
bs = this.atomExpressionAt (-index);
index = this.iToken + 1;
if (this.isBondSet) {
doClearBondSet = true;
shapeType = 1;
}}if (isBackground) this.getToken (index);
 else if ((isBackground = (this.getToken (index).tok == 1610616835)) == true) this.getToken (++index);
if (isBackground) prefix = "bg";
 else if (isIsosurface) {
switch (this.theTok) {
case 1073742018:
this.getToken (++index);
prefix = "mesh";
break;
case 1073742094:
var argb = this.getArgbParamOrNone (++index, false);
colorvalue1 = (argb == 0 ? null : Integer.$valueOf (argb));
this.getToken (index = this.iToken + 1);
break;
case 10:
case 1048577:
if (Clazz.instanceOf (this.theToken.value, org.jmol.modelset.Bond.BondSet)) {
bs = this.theToken.value;
prefix = "vertex";
} else {
bs = this.atomExpressionAt (index);
prefix = "atom";
}translucentLevel = 1.4E-45;
this.getToken (index = this.iToken + 1);
break;
}
}if (!this.isSyntaxCheck && shapeType == 26 && !this.mo (true)) return;
var isTranslucent = (this.theTok == 1073742180);
if (isTranslucent || this.theTok == 1073742074) {
if (translucentLevel == 1.4E-45) this.error (22);
translucency = this.parameterAsString (index++);
if (isTranslucent && this.isFloatParameter (index)) translucentLevel = this.getTranslucentLevel (index++);
}var tok = 0;
if (index < this.statementLength && this.tokAt (index) != 1048589 && this.tokAt (index) != 1048588) {
isColor = true;
tok = this.getToken (index).tok;
if ((!isIsosurface || this.tokAt (index + 1) != 1074790746) && this.isColorParam (index)) {
var argb = this.getArgbParamOrNone (index, false);
colorvalue = (argb == 0 ? null : Integer.$valueOf (argb));
if (translucency == null && this.tokAt (index = this.iToken + 1) != 0) {
this.getToken (index);
isTranslucent = (this.theTok == 1073742180);
if (isTranslucent || this.theTok == 1073742074) {
translucency = this.parameterAsString (index);
if (isTranslucent && this.isFloatParameter (index + 1)) translucentLevel = this.getTranslucentLevel (++index);
}}} else if (shapeType == 25) {
this.iToken--;
} else {
var name = this.parameterAsString (index).toLowerCase ();
var isByElement = (name.indexOf ("byelement") == 0);
var isColorIndex = (isByElement || name.indexOf ("byresidue") == 0);
var pal = (isColorIndex || isIsosurface ? org.jmol.constant.EnumPalette.PROPERTY : tok == 1113200651 ? org.jmol.constant.EnumPalette.CPK : org.jmol.constant.EnumPalette.getPalette (name));
if (pal === org.jmol.constant.EnumPalette.UNKNOWN || (pal === org.jmol.constant.EnumPalette.TYPE || pal === org.jmol.constant.EnumPalette.ENERGY) && shapeType != 2) this.error (22);
var data = null;
var bsSelected = (pal !== org.jmol.constant.EnumPalette.PROPERTY && pal !== org.jmol.constant.EnumPalette.VARIABLE || !this.viewer.isRangeSelected () ? null : this.viewer.getSelectionSet (false));
if (pal === org.jmol.constant.EnumPalette.PROPERTY) {
if (isColorIndex) {
if (!this.isSyntaxCheck) {
data = this.getBitsetPropertyFloat (bsSelected, (isByElement ? 1095763976 : 1095761930) | 256, NaN, NaN);
}} else {
if (!isColorIndex && !isIsosurface) index++;
if (name.equals ("property") && org.jmol.script.Token.tokAttr ((tok = this.getToken (index).tok), 1078984704) && !org.jmol.script.Token.tokAttr (tok, 1087373312)) {
if (!this.isSyntaxCheck) {
data = this.getBitsetPropertyFloat (bsSelected, this.getToken (index++).tok | 256, NaN, NaN);
}}}} else if (pal === org.jmol.constant.EnumPalette.VARIABLE) {
index++;
name = this.parameterAsString (index++);
data =  Clazz.newFloatArray (this.viewer.getAtomCount (), 0);
org.jmol.util.Parser.parseStringInfestedFloatArray ("" + this.getParameter (name, 4), null, data);
pal = org.jmol.constant.EnumPalette.PROPERTY;
}if (pal === org.jmol.constant.EnumPalette.PROPERTY) {
var scheme = null;
if (this.tokAt (index) == 4) {
scheme = this.parameterAsString (index++).toLowerCase ();
if (this.isArrayParameter (index)) {
scheme += "=" + org.jmol.script.ScriptVariable.sValue (org.jmol.script.ScriptVariable.getVariableAS (this.stringParameterSet (index))).$replace ('\n', ' ');
index = this.iToken + 1;
}} else if (isIsosurface && this.isColorParam (index)) {
scheme = this.getColorRange (index);
index = this.iToken + 1;
}if (scheme != null && !isIsosurface) {
this.setStringProperty ("propertyColorScheme", (isTranslucent && translucentLevel == 3.4028235E38 ? "translucent " : "") + scheme);
isColorIndex = (scheme.indexOf ("byelement") == 0 || scheme.indexOf ("byresidue") == 0);
}var min = 0;
var max = 3.4028235E38;
if (!isColorIndex && (this.tokAt (index) == 1073741826 || this.tokAt (index) == 1073742114)) {
min = this.floatParameter (index + 1);
max = this.floatParameter (index + 2);
index += 3;
if (min == max && isIsosurface) {
var range = this.getShapeProperty (shapeType, "dataRange");
if (range != null) {
min = range[0];
max = range[1];
}} else if (min == max) {
max = 3.4028235E38;
}}if (!this.isSyntaxCheck) {
if (isIsosurface) {
} else if (data == null) {
this.viewer.setCurrentColorRange (name);
} else {
this.viewer.setCurrentColorRangeData (data, bsSelected);
}if (isIsosurface) {
this.checkLength (index);
isColor = false;
var ce = this.viewer.getColorEncoder (scheme);
if (ce == null) return;
ce.isTranslucent = (isTranslucent && translucentLevel == 3.4028235E38);
ce.setRange (min, max, min > max);
if (max == 3.4028235E38) ce.hi = max;
this.setShapeProperty (shapeType, "remapColor", ce);
this.showString (this.getIsosurfaceDataRange (shapeType, ""));
if (translucentLevel == 3.4028235E38) return;
} else if (max != 3.4028235E38) {
this.viewer.setCurrentColorRange (min, max);
}}} else {
index++;
}this.checkLength (index);
colorvalue = pal;
}}if (this.isSyntaxCheck || shapeType < 0) return;
switch (shapeType) {
case 4:
typeMask = 32768;
break;
case 2:
typeMask = 30720;
break;
case 3:
typeMask = 256;
break;
case 1:
typeMask = 1023;
break;
default:
typeMask = 0;
}
if (typeMask == 0) {
this.shapeManager.loadShape (shapeType);
if (shapeType == 5) this.setShapeProperty (5, "setDefaults", this.viewer.getNoneSelected ());
} else {
if (bs != null) {
this.viewer.selectBonds (bs);
bs = null;
}shapeType = 1;
this.setShapeProperty (shapeType, "type", Integer.$valueOf (typeMask));
}if (isColor) {
switch (tok) {
case 1112539149:
case 1112539148:
this.viewer.autoCalculate (tok);
break;
case 1112541199:
if (this.viewer.isRangeSelected ()) this.viewer.clearBfactorRange ();
break;
case 1087373318:
this.viewer.calcSelectedGroupsCount ();
break;
case 1095761935:
case 1073742032:
this.viewer.calcSelectedMonomersCount ();
break;
case 1095761934:
this.viewer.calcSelectedMoleculesCount ();
break;
}
if (isIsosurface && colorvalue1 != null) this.setShapeProperty (shapeType, "colorPhase", [colorvalue1, colorvalue]);
 else if (bs == null) this.setShapeProperty (shapeType, prefix + "color", colorvalue);
 else this.setShapePropertyBs (shapeType, prefix + "color", colorvalue, bs);
}if (translucency != null) this.setShapeTranslucency (shapeType, prefix, translucency, translucentLevel, bs);
if (typeMask != 0) this.setShapeProperty (1, "type", Integer.$valueOf (1023));
if (doClearBondSet) this.viewer.selectBonds (null);
}, $fz.isPrivate = true, $fz), "~N,~N,~B");
Clazz.defineMethod (c$, "colorShapeBs", 
($fz = function (shapeType, typeMask, argb, translucency, translucentLevel, bs) {
if (typeMask != 0) {
this.setShapeProperty (shapeType = 1, "type", Integer.$valueOf (typeMask));
}this.setShapePropertyBs (shapeType, "color", Integer.$valueOf (argb), bs);
if (translucency != null) this.setShapeTranslucency (shapeType, "", translucency, translucentLevel, bs);
if (typeMask != 0) this.setShapeProperty (1, "type", Integer.$valueOf (1023));
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~S,~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "setShapeTranslucency", 
($fz = function (shapeType, prefix, translucency, translucentLevel, bs) {
if (translucentLevel == 3.4028235E38) translucentLevel = this.viewer.getDefaultTranslucent ();
this.setShapeProperty (shapeType, "translucentLevel", Float.$valueOf (translucentLevel));
if (prefix == null) return;
if (bs == null) this.setShapeProperty (shapeType, prefix + "translucency", translucency);
 else if (!this.isSyntaxCheck) this.setShapePropertyBs (shapeType, prefix + "translucency", translucency, bs);
}, $fz.isPrivate = true, $fz), "~N,~S,~S,~N,org.jmol.util.BitSet");
Clazz.defineMethod (c$, "cd", 
($fz = function () {
if (this.isSyntaxCheck) return;
var dir = (this.statementLength == 1 ? null : this.parameterAsString (1));
this.showString (this.viewer.cd (dir));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "mapProperty", 
($fz = function () {
var bsFrom;
var bsTo;
var property1;
var property2;
var mapKey;
var tokProp1 = 0;
var tokProp2 = 0;
var tokKey = 0;
while (true) {
if (this.tokAt (1) == 1114638350) {
bsFrom = this.viewer.getSelectionSet (false);
bsTo = this.atomExpressionAt (2);
property1 = property2 = "selected";
} else {
bsFrom = this.atomExpressionAt (1);
if (this.tokAt (++this.iToken) != 1048584 || !org.jmol.script.Token.tokAttr (tokProp1 = this.tokAt (++this.iToken), 1078984704)) break;
property1 = this.parameterAsString (this.iToken);
bsTo = this.atomExpressionAt (++this.iToken);
if (this.tokAt (++this.iToken) != 1048584 || !org.jmol.script.Token.tokAttr (tokProp2 = this.tokAt (++this.iToken), 2048)) break;
property2 = this.parameterAsString (this.iToken);
}if (org.jmol.script.Token.tokAttr (tokKey = this.tokAt (this.iToken + 1), 1078984704)) mapKey = this.parameterAsString (++this.iToken);
 else mapKey = org.jmol.script.Token.nameOf (tokKey = 1095763969);
this.checkLast (this.iToken);
if (this.isSyntaxCheck) return;
var bsOut = null;
this.showString ("mapping " + property1.toUpperCase () + " for " + bsFrom.cardinality () + " atoms to " + property2.toUpperCase () + " for " + bsTo.cardinality () + " atoms using " + mapKey.toUpperCase ());
if (org.jmol.script.Token.tokAttrOr (tokProp1, 1095761920, 1112539136) && org.jmol.script.Token.tokAttrOr (tokProp2, 1095761920, 1112539136) && org.jmol.script.Token.tokAttrOr (tokKey, 1095761920, 1112539136)) {
var data1 = this.getBitsetPropertyFloat (bsFrom, tokProp1 | 224, NaN, NaN);
var data2 = this.getBitsetPropertyFloat (bsFrom, tokKey | 224, NaN, NaN);
var data3 = this.getBitsetPropertyFloat (bsTo, tokKey | 224, NaN, NaN);
var isProperty = (tokProp2 == 1716520973);
var dataOut =  Clazz.newFloatArray (isProperty ? this.viewer.getAtomCount () : data3.length, 0);
bsOut =  new org.jmol.util.BitSet ();
if (data1.length == data2.length) {
var ht =  new java.util.Hashtable ();
for (var i = 0; i < data1.length; i++) {
ht.put (Float.$valueOf (data2[i]), Float.$valueOf (data1[i]));
}
var pt = -1;
var nOut = 0;
for (var i = 0; i < data3.length; i++) {
pt = bsTo.nextSetBit (pt + 1);
var F = ht.get (Float.$valueOf (data3[i]));
if (F == null) continue;
bsOut.set (pt);
dataOut[(isProperty ? pt : nOut)] = F.floatValue ();
nOut++;
}
if (isProperty) this.viewer.setData (property2, [property2, dataOut, bsOut,  new Integer (0)], this.viewer.getAtomCount (), 0, 0, 2147483647, 0);
 else this.viewer.setAtomProperty (bsOut, tokProp2, 0, 0, null, dataOut, null);
}}if (bsOut == null) {
var format = "{" + mapKey + "=%[" + mapKey + "]}." + property2 + " = %[" + property1 + "]";
var data = this.getBitsetIdent (bsFrom, format, null, false, 2147483647, false);
var sb =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < data.length; i++) if (data[i].indexOf ("null") < 0) sb.append (data[i]).appendC ('\n');

if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.info (sb.toString ());
var bsSubset = org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSubset ());
this.viewer.setSelectionSubset (bsTo);
try {
this.runScript (sb.toString ());
} catch (e$$) {
if (Clazz.exceptionOf (e$$, Exception)) {
var e = e$$;
{
this.viewer.setSelectionSubset (bsSubset);
this.errorStr (-1, "Error: " + e.getMessage ());
}
} else if (Clazz.exceptionOf (e$$, Error)) {
var er = e$$;
{
this.viewer.setSelectionSubset (bsSubset);
this.errorStr (-1, "Error: " + er.getMessage ());
}
} else {
throw e$$;
}
}
this.viewer.setSelectionSubset (bsSubset);
}this.showString ("DONE");
return;
}
this.error (22);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "data", 
($fz = function () {
var dataString = null;
var dataLabel = null;
var isOneValue = false;
var i;
switch (this.iToken = this.statementLength) {
case 5:
dataString = this.parameterAsString (2);
case 4:
case 2:
dataLabel = this.parameterAsString (1);
if (dataLabel.equalsIgnoreCase ("clear")) {
if (!this.isSyntaxCheck) this.viewer.setData (null, null, 0, 0, 0, 0, 0);
return;
}if ((i = dataLabel.indexOf ("@")) >= 0) {
dataString = "" + this.getParameter (dataLabel.substring (i + 1), 4);
dataLabel = dataLabel.substring (0, i).trim ();
} else if (dataString == null && (i = dataLabel.indexOf (" ")) >= 0) {
dataString = dataLabel.substring (i + 1).trim ();
dataLabel = dataLabel.substring (0, i).trim ();
isOneValue = true;
}break;
default:
this.error (2);
}
var dataType = dataLabel + " ";
dataType = dataType.substring (0, dataType.indexOf (" ")).toLowerCase ();
if (dataType.equals ("model") || dataType.equals ("append")) {
this.load ();
return;
}if (this.isSyntaxCheck) return;
var isDefault = (dataLabel.toLowerCase ().indexOf ("(default)") >= 0);
this.$data =  new Array (4);
if (dataType.equals ("element_vdw")) {
this.$data[0] = dataType;
this.$data[1] = dataString.$replace (';', '\n');
var n = org.jmol.util.Elements.elementNumberMax;
var eArray =  Clazz.newIntArray (n + 1, 0);
for (var ie = 1; ie <= n; ie++) eArray[ie] = ie;

this.$data[2] = eArray;
this.$data[3] =  new Integer (0);
this.viewer.setData ("element_vdw", this.$data, n, 0, 0, 0, 0);
return;
}if (dataType.equals ("connect_atoms")) {
this.viewer.connect (org.jmol.util.Parser.parseFloatArray2d (dataString));
return;
}if (dataType.indexOf ("ligand_") == 0) {
this.viewer.setLigandModel (dataLabel.substring (7), dataString.trim ());
return;
}if (dataType.indexOf ("data2d_") == 0) {
this.$data[0] = dataLabel;
this.$data[1] = org.jmol.util.Parser.parseFloatArray2d (dataString);
this.$data[3] =  new Integer (2);
this.viewer.setData (dataLabel, this.$data, 0, 0, 0, 0, 0);
return;
}if (dataType.indexOf ("data3d_") == 0) {
this.$data[0] = dataLabel;
this.$data[1] = org.jmol.util.Parser.parseFloatArray3d (dataString);
this.$data[3] =  new Integer (3);
this.viewer.setData (dataLabel, this.$data, 0, 0, 0, 0, 0);
return;
}var tokens = org.jmol.util.Parser.getTokens (dataLabel);
if (dataType.indexOf ("property_") == 0 && !(tokens.length == 2 && tokens[1].equals ("set"))) {
var bs = this.viewer.getSelectionSet (false);
this.$data[0] = dataType;
var atomNumberField = (isOneValue ? 0 : (this.viewer.getParameter ("propertyAtomNumberField")).intValue ());
var atomNumberFieldColumnCount = (isOneValue ? 0 : (this.viewer.getParameter ("propertyAtomNumberColumnCount")).intValue ());
var propertyField = (isOneValue ? -2147483648 : (this.viewer.getParameter ("propertyDataField")).intValue ());
var propertyFieldColumnCount = (isOneValue ? 0 : (this.viewer.getParameter ("propertyDataColumnCount")).intValue ());
if (!isOneValue && dataLabel.indexOf (" ") >= 0) {
if (tokens.length == 3) {
dataLabel = tokens[0];
atomNumberField = org.jmol.util.Parser.parseInt (tokens[1]);
propertyField = org.jmol.util.Parser.parseInt (tokens[2]);
}if (tokens.length == 5) {
dataLabel = tokens[0];
atomNumberField = org.jmol.util.Parser.parseInt (tokens[1]);
atomNumberFieldColumnCount = org.jmol.util.Parser.parseInt (tokens[2]);
propertyField = org.jmol.util.Parser.parseInt (tokens[3]);
propertyFieldColumnCount = org.jmol.util.Parser.parseInt (tokens[4]);
}}if (atomNumberField < 0) atomNumberField = 0;
if (propertyField < 0) propertyField = 0;
var atomCount = this.viewer.getAtomCount ();
var atomMap = null;
var bsTemp = org.jmol.util.BitSetUtil.newBitSet (atomCount);
if (atomNumberField > 0) {
atomMap =  Clazz.newIntArray (atomCount + 2, 0);
for (var j = 0; j <= atomCount; j++) atomMap[j] = -1;

for (var j = bs.nextSetBit (0); j >= 0; j = bs.nextSetBit (j + 1)) {
var atomNo = this.viewer.getAtomNumber (j);
if (atomNo > atomCount + 1 || atomNo < 0 || bsTemp.get (atomNo)) continue;
bsTemp.set (atomNo);
atomMap[atomNo] = j;
}
this.$data[2] = atomMap;
} else {
this.$data[2] = org.jmol.util.BitSetUtil.copy (bs);
}this.$data[1] = dataString;
this.$data[3] =  new Integer (0);
this.viewer.setData (dataType, this.$data, atomCount, atomNumberField, atomNumberFieldColumnCount, propertyField, propertyFieldColumnCount);
return;
}var userType = org.jmol.modelset.AtomCollection.getUserSettableType (dataType);
if (userType >= 0) {
this.viewer.setAtomData (userType, dataType, dataString, isDefault);
return;
}this.$data[0] = dataLabel;
this.$data[1] = dataString;
this.$data[3] =  new Integer (0);
this.viewer.setData (dataType, this.$data, 0, 0, 0, 0, 0);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "define", 
($fz = function () {
if (this.statementLength < 3 || !(Clazz.instanceOf (this.getToken (1).value, String))) this.error (22);
var setName = (this.getToken (1).value).toLowerCase ();
if (org.jmol.util.Parser.parseInt (setName) != -2147483648) this.error (22);
if (this.isSyntaxCheck) return;
var isSite = setName.startsWith ("site_");
var isDynamic = (setName.indexOf ("dynamic_") == 0);
if (isDynamic || isSite) {
var code =  new Array (this.statementLength);
for (var i = this.statementLength; --i >= 0; ) code[i] = this.statement[i];

this.definedAtomSets.put ("!" + (isSite ? setName : setName.substring (8)), code);
} else {
var bs = this.atomExpressionAt (2);
this.definedAtomSets.put (setName, bs);
if (!this.isSyntaxCheck) this.viewer.setUserVariable ("@" + setName, org.jmol.script.ScriptVariable.newVariable (10, bs));
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "echo", 
($fz = function (index, isImage) {
if (this.isSyntaxCheck) return;
var text = this.optParameterAsString (index);
if (this.viewer.getEchoStateActive ()) {
if (isImage) {
var retFileName =  new Array (1);
var image = this.viewer.getFileAsImage (text, retFileName);
if (image == null) {
text = retFileName[0];
} else {
this.setShapeProperty (29, "text", retFileName[0]);
this.setShapeProperty (29, "image", image);
text = null;
}} else if (text.startsWith ("\1")) {
text = text.substring (1);
isImage = true;
}if (text != null) this.setShapeProperty (29, "text", text);
}if (!isImage && this.viewer.getRefreshing ()) this.showString (this.viewer.formatText (text));
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "message", 
($fz = function () {
var text = this.parameterAsString (this.checkLast (1));
if (this.isSyntaxCheck) return;
var s = this.viewer.formatText (text);
if (this.outputBuffer == null) this.viewer.showMessage (s);
if (!s.startsWith ("_")) this.scriptStatusOrBuffer (s);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "log", 
($fz = function () {
if (this.statementLength == 1) this.error (2);
if (this.isSyntaxCheck) return;
var s = this.parameterExpressionString (1, 0);
if (this.tokAt (1) == 1048588) this.setStringProperty ("logFile", "");
 else this.viewer.log (s);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "label", 
($fz = function (index) {
if (this.isSyntaxCheck) return;
this.shapeManager.loadShape (5);
var strLabel = null;
switch (this.getToken (index).tok) {
case 1048589:
strLabel = this.viewer.getStandardLabelFormat (0);
break;
case 1048588:
break;
case 12294:
case 1610625028:
this.setShapeProperty (5, "display", this.theTok == 1610625028 ? Boolean.TRUE : Boolean.FALSE);
return;
default:
strLabel = this.parameterAsString (index);
}
this.shapeManager.setLabel (strLabel, this.viewer.getSelectionSet (false));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "hover", 
($fz = function () {
if (this.isSyntaxCheck) return;
var strLabel = this.parameterAsString (1);
if (strLabel.equalsIgnoreCase ("on")) strLabel = "%U";
 else if (strLabel.equalsIgnoreCase ("off")) strLabel = null;
this.viewer.setHoverLabel (strLabel);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "load", 
($fz = function () {
var doLoadFiles = (!this.isSyntaxCheck || this.isCmdLine_C_Option);
var isAppend = false;
var isInline = false;
var isSmiles = false;
var isData = false;
var bsModels;
var i = (this.tokAt (0) == 135270407 ? 0 : 1);
var appendNew = this.viewer.getAppendNew ();
var filter = null;
var firstLastSteps = null;
var modelCount0 = this.viewer.getModelCount () - (this.viewer.getFileName ().equals ("zapped") ? 1 : 0);
var atomCount0 = this.viewer.getAtomCount ();
var loadScript =  new org.jmol.util.StringXBuilder ().append ("load");
var nFiles = 1;
var htParams =  new java.util.Hashtable ();
if (this.isStateScript && this.forceNoAddHydrogens) htParams.put ("doNotAddHydrogens", Boolean.TRUE);
var modelName = null;
var filenames = null;
var tempFileInfo = null;
var errMsg = null;
var sOptions = "";
var tokType = 0;
var tok;
if (this.statementLength == 1) {
i = 0;
} else {
modelName = this.parameterAsString (i);
if (this.statementLength == 2 && !this.isSyntaxCheck) {
if (modelName.endsWith (".spt") || modelName.endsWith (".png") || modelName.endsWith (".pngj")) {
this.script (0, modelName, false);
return;
}}switch (tok = this.tokAt (i)) {
case 1073742015:
var m = this.parameterAsString (this.checkLast (2));
if (!this.isSyntaxCheck) this.viewer.setMenu (m, true);
return;
case 135270407:
isData = true;
loadScript.append (" /*data*/ data");
var key = this.stringParameter (++i).toLowerCase ();
loadScript.append (" ").append (org.jmol.util.Escape.escapeStr (key));
isAppend = key.startsWith ("append");
var strModel = (key.indexOf ("@") >= 0 ? "" + this.getParameter (key.substring (key.indexOf ("@") + 1), 4) : this.parameterAsString (++i));
strModel = this.viewer.fixInlineString (strModel, this.viewer.getInlineChar ());
htParams.put ("fileData", strModel);
htParams.put ("isData", Boolean.TRUE);
loadScript.appendC ('\n');
loadScript.append (strModel);
if (key.indexOf ("@") < 0) {
loadScript.append (" end ").append (org.jmol.util.Escape.escapeStr (key));
i += 2;
}break;
case 1073741839:
isAppend = true;
loadScript.append (" append");
modelName = this.optParameterAsString (++i);
tok = org.jmol.script.Token.getTokFromName (modelName);
break;
case 1073741824:
i++;
loadScript.append (" " + modelName);
tokType = (tok == 1073741824 && org.jmol.util.Parser.isOneOf (modelName.toLowerCase (), "xyz;vxyz;vibration;temperature;occupancy;partialcharge") ? org.jmol.script.Token.getTokFromName (modelName) : 0);
if (tokType != 0) {
htParams.put ("atomDataOnly", Boolean.TRUE);
htParams.put ("modelNumber", Integer.$valueOf (1));
if (tokType == 4166) tokType = 1146095631;
tempFileInfo = this.viewer.getFileInfo ();
isAppend = true;
}}
switch (tok) {
case 1229984263:
case 1073741983:
isInline = (tok == 1073741983);
i++;
loadScript.append (" " + modelName);
break;
case 135267336:
isSmiles = true;
i++;
break;
case 536870926:
case 1095766028:
i++;
loadScript.append (" " + modelName);
if (tok == 536870926) htParams.put ("isTrajectory", Boolean.TRUE);
if (this.isPoint3f (i)) {
var pt = this.getPoint3f (i, false);
i = this.iToken + 1;
htParams.put ("firstLastStep", [Clazz.floatToInt (pt.x), Clazz.floatToInt (pt.y), Clazz.floatToInt (pt.z)]);
loadScript.append (" " + org.jmol.util.Escape.escapePt (pt));
} else if (this.tokAt (i) == 10) {
bsModels = this.getToken (i++).value;
htParams.put ("bsModels", bsModels);
loadScript.append (" " + org.jmol.util.Escape.escape (bsModels));
} else {
htParams.put ("firstLastStep", [0, -1, 1]);
}break;
case 1073741824:
break;
default:
modelName = "fileset";
}
if (this.getToken (i).tok != 4) this.error (16);
}var filePt = i;
var localName = null;
if (this.tokAt (filePt + 1) == 1073741848) {
localName = this.stringParameter (i = i + 2);
if (this.viewer.getPathForAllFiles () !== "") {
localName = null;
filePt = i;
}}var filename = null;
var appendedData = null;
var appendedKey = null;
if (this.statementLength == i + 1) {
if (i == 0 || (filename = this.parameterAsString (filePt)).length == 0) filename = this.viewer.getFullPathName ();
if (filename == null) {
this.zap (false);
return;
}if (isSmiles) {
filename = "$" + filename;
} else if (!isInline) {
if (filename.indexOf ("[]") >= 0) return;
if (filename.indexOf ("[") == 0) {
filenames = org.jmol.util.Escape.unescapeStringArray (filename);
if (filenames != null) {
if (i == 1) loadScript.append (" files");
if (loadScript.indexOf (" files") < 0) this.error (22);
for (var j = 0; j < filenames.length; j++) loadScript.append (" /*file*/").append (org.jmol.util.Escape.escapeStr (filenames[j]));

}}}} else if (this.getToken (i + 1).tok == 1073742010 || this.theTok == 2 || this.theTok == 7 || this.theTok == 269484096 || this.theTok == 1073742195 || this.theTok == 1048586 || this.theTok == 8 || this.theTok == 1073742080 || this.theTok == 1073741877 || this.theTok == 1073742163 || this.theTok == 1073742114 || this.theTok == 1073742152 || this.theTok == 1614417948 || this.theTok == 1073742066 || this.theTok == 1073741940 && this.tokAt (i + 3) != 1048582 || this.theTok == 1073741839 || this.theTok == 1073741824 && this.tokAt (i + 3) != 1048582) {
if ((filename = this.parameterAsString (filePt)).length == 0 && (filename = this.viewer.getFullPathName ()) == null) {
this.zap (false);
return;
}if (filePt == i) i++;
if (filename.indexOf ("[]") >= 0) return;
if ((tok = this.tokAt (i)) == 1073742010) {
var manifest = this.stringParameter (++i);
htParams.put ("manifest", manifest);
sOptions += " MANIFEST " + org.jmol.util.Escape.escapeStr (manifest);
tok = this.tokAt (++i);
}switch (tok) {
case 2:
var n = this.intParameter (i);
sOptions += " " + n;
if (n < 0) htParams.put ("vibrationNumber", Integer.$valueOf (-n));
 else htParams.put ("modelNumber", Integer.$valueOf (n));
tok = this.tokAt (++i);
break;
case 7:
case 269484096:
case 1073742195:
var data = this.floatParameterSet (i, 1, 2147483647);
i = this.iToken;
var bs =  new org.jmol.util.BitSet ();
for (var j = 0; j < data.length; j++) if (data[j] >= 1 && data[j] == Clazz.floatToInt (data[j])) bs.set (Clazz.floatToInt (data[j]) - 1);

htParams.put ("bsModels", bs);
var iArray =  Clazz.newIntArray (bs.cardinality (), 0);
for (var pt = 0, j = bs.nextSetBit (0); j >= 0; j = bs.nextSetBit (j + 1)) iArray[pt++] = j + 1;

sOptions += " " + org.jmol.util.Escape.escapeAI (iArray);
tok = this.tokAt (i);
break;
}
var lattice = null;
if (tok == 1048586 || tok == 8) {
lattice = this.getPoint3f (i, false);
i = this.iToken + 1;
tok = this.tokAt (i);
}switch (tok) {
case 1073742080:
case 1073741877:
case 1073742163:
case 1073742114:
case 1073742152:
case 1614417948:
if (lattice == null) lattice = org.jmol.util.Point3f.new3 (555, 555, -1);
this.iToken = i - 1;
}
var offset = null;
if (lattice != null) {
htParams.put ("lattice", lattice);
i = this.iToken + 1;
sOptions += " {" + Clazz.floatToInt (lattice.x) + " " + Clazz.floatToInt (lattice.y) + " " + Clazz.floatToInt (lattice.z) + "}";
if (this.tokAt (i) == 1073742080) {
htParams.put ("packed", Boolean.TRUE);
sOptions += " PACKED";
i++;
}if (this.tokAt (i) == 1073741877) {
htParams.put ("centroid", Boolean.TRUE);
sOptions += " CENTROID";
i++;
if (this.tokAt (i) == 1073742080 && !htParams.containsKey ("packed")) {
htParams.put ("packed", Boolean.TRUE);
sOptions += " PACKED";
i++;
}}if (this.tokAt (i) == 1073742163) {
var supercell;
if (this.isPoint3f (++i)) {
var pt = this.getPoint3f (i, false);
if (pt.x != Clazz.floatToInt (pt.x) || pt.y != Clazz.floatToInt (pt.y) || pt.z != Clazz.floatToInt (pt.z) || pt.x < 1 || pt.y < 1 || pt.z < 1) {
this.iToken = i;
this.error (22);
}supercell = pt;
i = this.iToken + 1;
} else {
supercell = this.stringParameter (i++);
}htParams.put ("supercell", supercell);
}var distance = 0;
if (this.tokAt (i) == 1073742114) {
i++;
distance = this.floatParameter (i++);
sOptions += " range " + distance;
}htParams.put ("symmetryRange", Float.$valueOf (distance));
var spacegroup = null;
var sg;
var iGroup = -2147483648;
if (this.tokAt (i) == 1073742152) {
++i;
spacegroup = org.jmol.util.TextFormat.simpleReplace (this.parameterAsString (i++), "''", "\"");
sOptions += " spacegroup " + org.jmol.util.Escape.escapeStr (spacegroup);
if (spacegroup.equalsIgnoreCase ("ignoreOperators")) {
iGroup = -999;
} else {
if (spacegroup.length == 0) {
sg = this.viewer.getCurrentUnitCell ();
if (sg != null) spacegroup = sg.getSpaceGroupName ();
} else {
if (spacegroup.indexOf (",") >= 0) if ((lattice.x < 9 && lattice.y < 9 && lattice.z == 0)) spacegroup += "#doNormalize=0";
}htParams.put ("spaceGroupName", spacegroup);
iGroup = -2;
}}var fparams = null;
if (this.tokAt (i) == 1614417948) {
++i;
if (this.optParameterAsString (i).length == 0) {
sg = this.viewer.getCurrentUnitCell ();
if (sg != null) {
fparams = sg.getUnitCellAsArray (true);
offset = sg.getCartesianOffset ();
}} else {
fparams = this.floatParameterSet (i, 6, 9);
}if (fparams == null || fparams.length != 6 && fparams.length != 9) this.error (22);
sOptions += " unitcell {";
for (var j = 0; j < fparams.length; j++) sOptions += (j == 0 ? "" : " ") + fparams[j];

sOptions += "}";
htParams.put ("unitcell", fparams);
if (iGroup == -2147483648) iGroup = -1;
}i = this.iToken + 1;
if (iGroup != -2147483648) htParams.put ("spaceGroupIndex", Integer.$valueOf (iGroup));
}if (offset != null) this.coordinatesAreFractional = false;
 else if (this.tokAt (i) == 1073742066) offset = this.getPoint3f (++i, true);
if (offset != null) {
if (this.coordinatesAreFractional) {
offset.setT (this.fractionalPoint);
htParams.put ("unitCellOffsetFractional", (this.coordinatesAreFractional ? Boolean.TRUE : Boolean.FALSE));
sOptions += " offset {" + offset.x + " " + offset.y + " " + offset.z + "/1}";
} else {
sOptions += " offset " + org.jmol.util.Escape.escapePt (offset);
}htParams.put ("unitCellOffset", offset);
i = this.iToken + 1;
}if (this.tokAt (i) == 1073741839) {
if (this.tokAt (++i) == 135270407) {
i += 2;
appendedData = this.getToken (i++).value;
appendedKey = this.stringParameter (++i);
++i;
} else {
appendedKey = this.stringParameter (i++);
appendedData = this.stringParameter (i++);
}htParams.put (appendedKey, appendedData);
}if (this.tokAt (i) == 1073741940) filter = this.stringParameter (++i);
} else {
if (i == 1) {
i++;
loadScript.append (" " + modelName);
}var pt = null;
var bs = null;
var fNames =  new java.util.ArrayList ();
while (i < this.statementLength) {
switch (this.tokAt (i)) {
case 1073741940:
filter = this.stringParameter (++i);
++i;
continue;
case 1048582:
htParams.remove ("isTrajectory");
if (firstLastSteps == null) {
firstLastSteps =  new java.util.ArrayList ();
pt = org.jmol.util.Point3f.new3 (0, -1, 1);
}if (this.isPoint3f (++i)) {
pt = this.getPoint3f (i, false);
i = this.iToken + 1;
} else if (this.tokAt (i) == 10) {
bs = this.getToken (i).value;
pt = null;
i = this.iToken + 1;
}break;
case 1073741824:
this.error (22);
}
fNames.add (filename = this.parameterAsString (i++));
if (pt != null) {
firstLastSteps.add ([Clazz.floatToInt (pt.x), Clazz.floatToInt (pt.y), Clazz.floatToInt (pt.z)]);
loadScript.append (" COORD " + org.jmol.util.Escape.escapePt (pt));
} else if (bs != null) {
firstLastSteps.add (bs);
loadScript.append (" COORD " + org.jmol.util.Escape.escape (bs));
}loadScript.append (" /*file*/$FILENAME" + fNames.size () + "$");
}
if (firstLastSteps != null) {
htParams.put ("firstLastSteps", firstLastSteps);
}nFiles = fNames.size ();
filenames =  new Array (nFiles);
for (var j = 0; j < nFiles; j++) filenames[j] = fNames.get (j);

filename = "fileSet";
}if (!doLoadFiles) return;
if (appendedData != null) {
sOptions += " APPEND data \"" + appendedKey + "\"\n" + appendedData + (appendedData.endsWith ("\n") ? "" : "\n") + "end \"" + appendedKey + "\"";
}if (filter == null) filter = this.viewer.getDefaultLoadFilter ();
if (filter.length > 0) {
htParams.put ("filter", filter);
if (filter.equalsIgnoreCase ("2d")) filter = "2D-noMin";
sOptions += " FILTER " + org.jmol.util.Escape.escapeStr (filter);
}var isVariable = false;
if (filenames == null) {
if (isInline) {
htParams.put ("fileData", filename);
} else if (filename.startsWith ("@") && filename.length > 1) {
isVariable = true;
var s = this.getStringParameter (filename.substring (1), false);
htParams.put ("fileData", s);
loadScript =  new org.jmol.util.StringXBuilder ().append ("{\n    var ").append (filename.substring (1)).append (" = ").append (org.jmol.util.Escape.escapeStr (s)).append (";\n    ").appendSB (loadScript);
}}var os = null;
if (localName != null) {
if (localName.equals (".")) localName = this.viewer.getFilePath (filename, true);
if (localName.length == 0 || this.viewer.getFilePath (localName, false).equalsIgnoreCase (this.viewer.getFilePath (filename, false))) this.error (22);
var fullPath = [localName];
os = this.viewer.getOutputStream (localName, fullPath);
if (os == null) org.jmol.util.Logger.error ("Could not create output stream for " + fullPath[0]);
 else htParams.put ("OutputStream", os);
}if (filenames == null && tokType == 0) {
loadScript.append (" ");
if (isVariable || isInline) {
loadScript.append (org.jmol.util.Escape.escapeStr (filename));
} else if (!isData) {
if (!filename.equals ("string") && !filename.equals ("string[]")) loadScript.append ("/*file*/");
if (localName != null) localName = this.viewer.getFilePath (localName, false);
loadScript.append ((localName != null ? org.jmol.util.Escape.escapeStr (localName) : "$FILENAME$"));
}if (sOptions.length > 0) loadScript.append (" /*options*/ ").append (sOptions);
if (isVariable) loadScript.append ("\n  }");
htParams.put ("loadScript", loadScript);
}this.setCursorWait (true);
errMsg = this.viewer.loadModelFromFile (null, filename, filenames, null, isAppend, htParams, loadScript, tokType);
if (os != null) try {
this.viewer.setFileInfo ([localName, localName, localName]);
org.jmol.util.Logger.info (org.jmol.i18n.GT._ ("file {0} created", localName));
this.showString (this.viewer.getFilePath (localName, false) + " created");
os.close ();
} catch (e) {
if (Clazz.exceptionOf (e, java.io.IOException)) {
org.jmol.util.Logger.error ("error closing file " + e.getMessage ());
} else {
throw e;
}
}
if (tokType > 0) {
this.viewer.setFileInfo (tempFileInfo);
if (errMsg != null && !this.isCmdLine_c_or_C_Option) this.evalError (errMsg, null);
return;
}if (errMsg != null && !this.isCmdLine_c_or_C_Option) {
if (errMsg.indexOf ("NOTE: file recognized as a script file: ") == 0) {
filename = errMsg.substring ("NOTE: file recognized as a script file: ".length).trim ();
this.script (0, filename, false);
return;
}this.evalError (errMsg, null);
}if (isAppend && (appendNew || nFiles > 1)) {
this.viewer.setAnimationRange (-1, -1);
this.viewer.setCurrentModelIndex (modelCount0);
}if (this.scriptLevel == 0 && !isAppend && nFiles < 2) this.showString (this.viewer.getModelSetAuxiliaryInfoValue ("modelLoadNote"));
if (this.logMessages) this.scriptStatusOrBuffer ("Successfully loaded:" + (filenames == null ? htParams.get ("fullPathName") : modelName));
var info = this.viewer.getModelSetAuxiliaryInfo ();
if (info != null && info.containsKey ("centroidMinMax") && this.viewer.getAtomCount () > 0) this.viewer.setCentroid (isAppend ? atomCount0 : 0, this.viewer.getAtomCount () - 1, info.get ("centroidMinMax"));
var script = this.viewer.getDefaultLoadScript ();
var msg = "";
if (script.length > 0) msg += "\nUsing defaultLoadScript: " + script;
if (info != null && this.viewer.getAllowEmbeddedScripts ()) {
var embeddedScript = info.remove ("jmolscript");
if (embeddedScript != null && embeddedScript.length > 0) {
msg += "\nAdding embedded #jmolscript: " + embeddedScript;
script += ";" + embeddedScript;
this.setStringProperty ("_loadScript", script);
script = "allowEmbeddedScripts = false;try{" + script + "} allowEmbeddedScripts = true;";
}}this.logLoadInfo (msg);
var siteScript = (info == null ? null : info.remove ("sitescript"));
if (siteScript != null) script = siteScript + ";" + script;
if (script.length > 0 && !this.isCmdLine_c_or_C_Option) this.runScript (script);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "logLoadInfo", 
($fz = function (msg) {
if (msg.length > 0) org.jmol.util.Logger.info (msg);
var sb =  new org.jmol.util.StringXBuilder ();
var modelCount = this.viewer.getModelCount ();
if (modelCount > 1) sb.appendI (modelCount).append (" models\n");
for (var i = 0; i < modelCount; i++) {
var moData = this.viewer.getModelAuxiliaryInfoValue (i, "moData");
if (moData == null) continue;
sb.appendI ((moData.get ("mos")).size ()).append (" molecular orbitals in model ").append (this.viewer.getModelNumberDotted (i)).append ("\n");
}
if (sb.length () > 0) this.showString (sb.toString ());
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getFullPathName", 
($fz = function () {
var filename = (!this.isSyntaxCheck || this.isCmdLine_C_Option ? this.viewer.getFullPathName () : "test.xyz");
if (filename == null) this.error (22);
return filename;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "measure", 
($fz = function () {
if (this.tokAt (1) == 135267335) {
var smarts = this.stringParameter (this.statementLength == 3 ? 2 : 4);
if (this.isSyntaxCheck) return;
var atoms = this.viewer.getModelSet ().atoms;
var atomCount = this.viewer.getAtomCount ();
var maps = this.viewer.getSmilesMatcher ().getCorrelationMaps (smarts, atoms, atomCount, this.viewer.getSelectionSet (false), true, false);
if (maps == null) return;
this.setShapeProperty (6, "maps", maps);
return;
}switch (this.statementLength) {
case 1:
case 2:
switch (this.getToken (1).tok) {
case 0:
case 1048589:
this.setShapeProperty (6, "hideAll", Boolean.FALSE);
return;
case 1048588:
this.setShapeProperty (6, "hideAll", Boolean.TRUE);
return;
case 1073742001:
if (!this.isSyntaxCheck) this.showStringPrint (this.viewer.getMeasurementInfoAsString (), false);
return;
case 12291:
if (!this.isSyntaxCheck) this.viewer.clearAllMeasurements ();
return;
case 4:
this.setShapeProperty (6, "setFormats", this.stringParameter (1));
return;
}
this.errorStr (24, "ON, OFF, DELETE");
break;
case 3:
switch (this.getToken (1).tok) {
case 12291:
if (this.getToken (2).tok == 1048579) {
if (!this.isSyntaxCheck) this.viewer.clearAllMeasurements ();
} else {
var i = this.intParameter (2) - 1;
if (!this.isSyntaxCheck) this.viewer.deleteMeasurement (i);
}return;
}
}
var nAtoms = 0;
var expressionCount = 0;
var modelIndex = -1;
var atomIndex = -1;
var ptFloat = -1;
var countPlusIndexes =  Clazz.newIntArray (5, 0);
var rangeMinMax = [3.4028235E38, 3.4028235E38];
var isAll = false;
var isAllConnected = false;
var isNotConnected = false;
var isRange = true;
var rd = null;
var intramolecular = null;
var tokAction = 269484114;
var strFormat = null;
var points =  new java.util.ArrayList ();
var bs =  new org.jmol.util.BitSet ();
var value = null;
var tickInfo = null;
var nBitSets = 0;
for (var i = 1; i < this.statementLength; ++i) {
switch (this.getToken (i).tok) {
case 1073741824:
this.errorStr (24, "ALL, ALLCONNECTED, DELETE");
break;
default:
this.error (15);
break;
case 269484144:
if (this.tokAt (i + 1) != 135266310) this.error (22);
i++;
isNotConnected = true;
break;
case 135266310:
case 1073741834:
case 1048579:
isAllConnected = (this.theTok == 1073741834);
atomIndex = -1;
isAll = true;
if (isAllConnected && isNotConnected) this.error (22);
break;
case 3:
if (rd != null) this.error (22);
isAll = true;
isRange = true;
ptFloat = (ptFloat + 1) % 2;
rangeMinMax[ptFloat] = this.floatParameter (i);
break;
case 12291:
if (tokAction != 269484114) this.error (22);
tokAction = 12291;
break;
case 2:
var iParam = this.intParameter (i);
if (isAll) {
isRange = true;
ptFloat = (ptFloat + 1) % 2;
rangeMinMax[ptFloat] = iParam;
} else {
atomIndex = this.viewer.getAtomIndexFromAtomNumber (iParam);
if (!this.isSyntaxCheck && atomIndex < 0) return;
if (value != null) this.error (22);
if ((countPlusIndexes[0] = ++nAtoms) > 4) this.error (2);
countPlusIndexes[nAtoms] = atomIndex;
}break;
case 1095761933:
modelIndex = this.intParameter (++i);
break;
case 1048588:
if (tokAction != 269484114) this.error (22);
tokAction = 1048588;
break;
case 1048589:
if (tokAction != 269484114) this.error (22);
tokAction = 1048589;
break;
case 1073742114:
isAll = true;
isRange = true;
atomIndex = -1;
break;
case 1073741989:
case 1073741990:
intramolecular = Boolean.$valueOf (this.theTok == 1073741989);
isAll = true;
isNotConnected = (this.theTok == 1073741990);
break;
case 1649412112:
if (ptFloat >= 0) this.error (22);
rd = this.encodeRadiusParameter (i, false, true);
rd.values = rangeMinMax;
i = this.iToken;
isNotConnected = true;
isAll = true;
intramolecular = Boolean.$valueOf (false);
if (nBitSets == 1) {
nBitSets++;
nAtoms++;
var bs2 = org.jmol.util.BitSetUtil.copy (bs);
org.jmol.util.BitSetUtil.invertInPlace (bs2, this.viewer.getAtomCount ());
bs2.and (this.viewer.getAtomsWithinRadius (5, bs, false, null));
points.add (bs2);
}break;
case 10:
case 1048577:
case 1048586:
case 8:
case 1048583:
if (this.theTok == 10 || this.theTok == 1048577) nBitSets++;
if (atomIndex >= 0) this.error (22);
this.expressionResult = Boolean.FALSE;
value = this.centerParameter (i);
if (Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet)) {
value = bs = this.expressionResult;
if (!this.isSyntaxCheck && bs.length () == 0) return;
}if (Clazz.instanceOf (value, org.jmol.util.Point3f)) {
var v =  new org.jmol.util.Point3fi ();
v.setT (value);
v.modelIndex = modelIndex;
value = v;
}if ((nAtoms = ++expressionCount) > 4) this.error (2);
i = this.iToken;
points.add (value);
break;
case 4:
strFormat = this.stringParameter (i);
break;
case 1073742164:
tickInfo = this.checkTicks (i, false, true, true);
i = this.iToken;
tokAction = 1060866;
break;
}
}
if (rd != null && (ptFloat >= 0 || nAtoms != 2) || nAtoms < 2 && (tickInfo == null || nAtoms == 1)) this.error (2);
if (strFormat != null && strFormat.indexOf (nAtoms + ":") != 0) strFormat = nAtoms + ":" + strFormat;
if (isRange) {
if (rangeMinMax[1] < rangeMinMax[0]) {
rangeMinMax[1] = rangeMinMax[0];
rangeMinMax[0] = (rangeMinMax[1] == 3.4028235E38 ? 3.4028235E38 : -200);
}}if (this.isSyntaxCheck) return;
if (value != null || tickInfo != null) {
if (rd == null) rd =  new org.jmol.atomdata.RadiusData (rangeMinMax, 0, null, null);
if (value == null) tickInfo.id = "default";
if (value != null && strFormat != null && tokAction == 269484114) tokAction = 1060866;
this.setShapeProperty (6, "measure",  new org.jmol.modelset.MeasurementData (this.viewer, points, tokAction, rd, strFormat, null, tickInfo, isAllConnected, isNotConnected, intramolecular, isAll));
return;
}switch (tokAction) {
case 12291:
this.setShapeProperty (6, "delete", countPlusIndexes);
break;
case 1048589:
this.setShapeProperty (6, "show", countPlusIndexes);
break;
case 1048588:
this.setShapeProperty (6, "hide", countPlusIndexes);
break;
default:
this.setShapeProperty (6, (strFormat == null ? "toggle" : "toggleOn"), countPlusIndexes);
if (strFormat != null) this.setShapeProperty (6, "setFormats", strFormat);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "plot", 
($fz = function (args) {
var modelIndex = this.viewer.getCurrentModelIndex ();
if (modelIndex < 0) this.errorStr (30, "plot");
modelIndex = this.viewer.getJmolDataSourceFrame (modelIndex);
var pt = args.length - 1;
var isReturnOnly = (args !== this.statement);
var statementSave = this.statement;
if (isReturnOnly) this.statement = args;
var tokCmd = (isReturnOnly ? 4148 : args[0].tok);
var pt0 = (isReturnOnly || tokCmd == 135270417 || tokCmd == 1052714 ? 0 : 1);
var filename = null;
var makeNewFrame = true;
var isDraw = false;
switch (tokCmd) {
case 4133:
case 135270417:
case 1052714:
break;
case 135176:
makeNewFrame = false;
isDraw = true;
break;
case 4148:
makeNewFrame = false;
break;
case 135270421:
makeNewFrame = false;
if (org.jmol.script.ScriptEvaluator.tokAtArray (pt, args) == 4) {
filename = this.stringParameter (pt--);
} else if (org.jmol.script.ScriptEvaluator.tokAtArray (pt - 1, args) == 1048584) {
filename = this.parameterAsString (pt - 2) + "." + this.parameterAsString (pt);
pt -= 3;
} else {
this.statement = statementSave;
this.iToken = this.statement.length;
this.error (13);
}break;
}
var qFrame = "";
var parameters = null;
var stateScript = "";
var isQuaternion = false;
var isDerivative = false;
var isSecondDerivative = false;
var isRamachandranRelative = false;
var propertyX = 0;
var propertyY = 0;
var propertyZ = 0;
var bs = org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSet (false));
var preSelected = "; select " + org.jmol.util.Escape.escape (bs) + ";\n ";
var type = this.optParameterAsString (pt).toLowerCase ();
var minXYZ = null;
var maxXYZ = null;
var tok = org.jmol.script.ScriptEvaluator.tokAtArray (pt0, args);
if (tok == 4) tok = org.jmol.script.Token.getTokFromName (args[pt0].value);
switch (tok) {
default:
this.iToken = 1;
this.error (22);
break;
case 135270407:
this.iToken = 1;
type = "data";
preSelected = "";
break;
case 1716520973:
this.iToken = pt0 + 1;
if (!org.jmol.script.Token.tokAttr (propertyX = this.tokAt (this.iToken++), 1078984704) || !org.jmol.script.Token.tokAttr (propertyY = this.tokAt (this.iToken++), 1078984704)) this.error (22);
if (org.jmol.script.Token.tokAttr (propertyZ = this.tokAt (this.iToken), 1078984704)) this.iToken++;
 else propertyZ = 0;
if (this.tokAt (this.iToken) == 32) {
minXYZ = this.getPoint3f (++this.iToken, false);
this.iToken++;
}if (this.tokAt (this.iToken) == 64) {
maxXYZ = this.getPoint3f (++this.iToken, false);
this.iToken++;
}type = "property " + org.jmol.script.Token.nameOf (propertyX) + " " + org.jmol.script.Token.nameOf (propertyY) + (propertyZ == 0 ? "" : " " + org.jmol.script.Token.nameOf (propertyZ));
if (bs.nextSetBit (0) < 0) bs = this.viewer.getModelUndeletedAtomsBitSet (modelIndex);
stateScript = "select " + org.jmol.util.Escape.escape (bs) + ";\n ";
break;
case 1052714:
if (type.equalsIgnoreCase ("draw")) {
isDraw = true;
type = this.optParameterAsString (--pt).toLowerCase ();
}isRamachandranRelative = (pt > pt0 && type.startsWith ("r"));
type = "ramachandran" + (isRamachandranRelative ? " r" : "") + (tokCmd == 135176 ? " draw" : "");
break;
case 135270417:
case 137363468:
qFrame = " \"" + this.viewer.getQuaternionFrame () + "\"";
stateScript = "set quaternionFrame" + qFrame + ";\n  ";
isQuaternion = true;
if (type.equalsIgnoreCase ("draw")) {
isDraw = true;
type = this.optParameterAsString (--pt).toLowerCase ();
}isDerivative = (type.startsWith ("deriv") || type.startsWith ("diff"));
isSecondDerivative = (isDerivative && type.indexOf ("2") > 0);
if (isDerivative) pt--;
if (type.equalsIgnoreCase ("helix") || type.equalsIgnoreCase ("axis")) {
isDraw = true;
isDerivative = true;
pt = -1;
}type = ((pt <= pt0 ? "" : this.optParameterAsString (pt)) + "w").substring (0, 1);
if (type.equals ("a") || type.equals ("r")) isDerivative = true;
if (!org.jmol.util.Parser.isOneOf (type, "w;x;y;z;r;a")) this.evalError ("QUATERNION [w,x,y,z,a,r] [difference][2]", null);
type = "quaternion " + type + (isDerivative ? " difference" : "") + (isSecondDerivative ? "2" : "") + (isDraw ? " draw" : "");
break;
}
this.statement = statementSave;
if (this.isSyntaxCheck) return "";
if (makeNewFrame) {
stateScript += "plot " + type;
var ptDataFrame = this.viewer.getJmolDataFrameIndex (modelIndex, stateScript);
if (ptDataFrame > 0 && tokCmd != 135270421 && tokCmd != 4148) {
this.viewer.setCurrentModelIndexClear (ptDataFrame, true);
return "";
}}var dataX = null;
var dataY = null;
var dataZ = null;
var factors = org.jmol.util.Point3f.new3 (1, 1, 1);
if (tok == 1716520973) {
dataX = this.getBitsetPropertyFloat (bs, propertyX | 224, (minXYZ == null ? NaN : minXYZ.x), (maxXYZ == null ? NaN : maxXYZ.x));
dataY = this.getBitsetPropertyFloat (bs, propertyY | 224, (minXYZ == null ? NaN : minXYZ.y), (maxXYZ == null ? NaN : maxXYZ.y));
if (propertyZ != 0) dataZ = this.getBitsetPropertyFloat (bs, propertyZ | 224, (minXYZ == null ? NaN : minXYZ.z), (maxXYZ == null ? NaN : maxXYZ.z));
if (minXYZ == null) minXYZ = org.jmol.util.Point3f.new3 (org.jmol.script.ScriptEvaluator.getMinMax (dataX, false, propertyX), org.jmol.script.ScriptEvaluator.getMinMax (dataY, false, propertyY), org.jmol.script.ScriptEvaluator.getMinMax (dataZ, false, propertyZ));
if (maxXYZ == null) maxXYZ = org.jmol.util.Point3f.new3 (org.jmol.script.ScriptEvaluator.getMinMax (dataX, true, propertyX), org.jmol.script.ScriptEvaluator.getMinMax (dataY, true, propertyY), org.jmol.script.ScriptEvaluator.getMinMax (dataZ, true, propertyZ));
org.jmol.util.Logger.info ("plot min/max: " + minXYZ + " " + maxXYZ);
var center = org.jmol.util.Point3f.newP (maxXYZ);
center.add (minXYZ);
center.scale (0.5);
factors.setT (maxXYZ);
factors.sub (minXYZ);
factors.set (factors.x / 200, factors.y / 200, factors.z / 200);
if (org.jmol.script.Token.tokAttr (propertyX, 1095761920)) {
factors.x = 1;
center.x = 0;
} else if (factors.x > 0.1 && factors.x <= 10) {
factors.x = 1;
}if (org.jmol.script.Token.tokAttr (propertyY, 1095761920)) {
factors.y = 1;
center.y = 0;
} else if (factors.y > 0.1 && factors.y <= 10) {
factors.y = 1;
}if (org.jmol.script.Token.tokAttr (propertyZ, 1095761920)) {
factors.z = 1;
center.z = 0;
} else if (factors.z > 0.1 && factors.z <= 10) {
factors.z = 1;
}if (propertyZ == 0) center.z = minXYZ.z = maxXYZ.z = factors.z = 0;
for (var i = 0; i < dataX.length; i++) dataX[i] = (dataX[i] - center.x) / factors.x;

for (var i = 0; i < dataY.length; i++) dataY[i] = (dataY[i] - center.y) / factors.y;

if (propertyZ != 0) for (var i = 0; i < dataZ.length; i++) dataZ[i] = (dataZ[i] - center.z) / factors.z;

parameters = [bs, dataX, dataY, dataZ, minXYZ, maxXYZ, factors, center];
}if (tokCmd == 135270421) return this.viewer.streamFileData (filename, "PLOT", type, modelIndex, parameters);
var data = (type.equals ("data") ? "1 0 H 0 0 0 # Jmol PDB-encoded data" : this.viewer.getPdbData (modelIndex, type, parameters));
if (tokCmd == 4148) return data;
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.info (data);
if (tokCmd == 135176) {
this.runScript (data);
return "";
}var savedFileInfo = this.viewer.getFileInfo ();
var oldAppendNew = this.viewer.getAppendNew ();
this.viewer.setAppendNew (true);
var isOK = (data != null && this.viewer.loadInline (data, true) == null);
this.viewer.setAppendNew (oldAppendNew);
this.viewer.setFileInfo (savedFileInfo);
if (!isOK) return "";
var modelCount = this.viewer.getModelCount ();
this.viewer.setJmolDataFrame (stateScript, modelIndex, modelCount - 1);
if (tok != 1716520973) stateScript += ";\n" + preSelected;
var ss = this.viewer.addStateScript (stateScript, true, false);
var radius = 150;
var script;
switch (tok) {
default:
script = "frame 0.0; frame last; reset;select visible;wireframe only;";
radius = 10;
break;
case 1716520973:
this.viewer.setFrameTitle (modelCount - 1, type + " plot for model " + this.viewer.getModelNumberDotted (modelIndex));
var f = 3;
script = "frame 0.0; frame last; reset;select visible; spacefill " + f + "; wireframe 0;" + "draw plotAxisX" + modelCount + " {100 -100 -100} {-100 -100 -100} \"" + org.jmol.script.Token.nameOf (propertyX) + "\";" + "draw plotAxisY" + modelCount + " {-100 100 -100} {-100 -100 -100} \"" + org.jmol.script.Token.nameOf (propertyY) + "\";";
if (propertyZ != 0) script += "draw plotAxisZ" + modelCount + " {-100 -100 100} {-100 -100 -100} \"" + org.jmol.script.Token.nameOf (propertyZ) + "\";";
break;
case 1052714:
this.viewer.setFrameTitle (modelCount - 1, "ramachandran plot for model " + this.viewer.getModelNumberDotted (modelIndex));
script = "frame 0.0; frame last; reset;select visible; color structure; spacefill 3.0; wireframe 0;draw ramaAxisX" + modelCount + " {100 0 0} {-100 0 0} \"phi\";" + "draw ramaAxisY" + modelCount + " {0 100 0} {0 -100 0} \"psi\";";
break;
case 135270417:
case 137363468:
this.viewer.setFrameTitle (modelCount - 1, type.$replace ('w', ' ') + qFrame + " for model " + this.viewer.getModelNumberDotted (modelIndex));
var color = (org.jmol.util.Colix.getHexCode (this.viewer.getColixBackgroundContrast ()));
script = "frame 0.0; frame last; reset;select visible; wireframe 0; spacefill 3.0; isosurface quatSphere" + modelCount + " color " + color + " sphere 100.0 mesh nofill frontonly translucent 0.8;" + "draw quatAxis" + modelCount + "X {100 0 0} {-100 0 0} color red \"x\";" + "draw quatAxis" + modelCount + "Y {0 100 0} {0 -100 0} color green \"y\";" + "draw quatAxis" + modelCount + "Z {0 0 100} {0 0 -100} color blue \"z\";" + "color structure;" + "draw quatCenter" + modelCount + "{0 0 0} scale 0.02;";
break;
}
this.runScript (script + preSelected);
ss.setModelIndex (this.viewer.getCurrentModelIndex ());
this.viewer.setRotationRadius (radius, true);
this.shapeManager.loadShape (29);
this.showString ("frame " + this.viewer.getModelNumberDotted (modelCount - 1) + (type.length > 0 ? " created: " + type + (isQuaternion ? qFrame : "") : ""));
return "";
}, $fz.isPrivate = true, $fz), "~A");
c$.getMinMax = Clazz.defineMethod (c$, "getMinMax", 
($fz = function (data, isMax, tok) {
if (data == null) return 0;
switch (tok) {
case 1112539142:
case 1112539143:
case 1112539144:
return (isMax ? 180 : -180);
case 1112539140:
case 1112539150:
return (isMax ? 360 : 0);
case 1112539148:
return (isMax ? 1 : -1);
}
var fmax = (isMax ? -1.0E10 : 1E10);
for (var i = data.length; --i >= 0; ) {
var f = data[i];
if (Float.isNaN (f)) continue;
if (isMax == (f > fmax)) fmax = f;
}
return fmax;
}, $fz.isPrivate = true, $fz), "~A,~B,~N");
Clazz.defineMethod (c$, "pause", 
($fz = function () {
if (this.isSyntaxCheck) return false;
var msg = this.optParameterAsString (1);
if (!this.viewer.getBooleanProperty ("_useCommandThread")) {
}if (this.viewer.autoExit || !this.viewer.haveDisplay && !this.viewer.isJS3D) return false;
if (this.scriptLevel == 0 && this.pc == this.aatoken.length - 1) {
this.viewer.scriptStatus ("nothing to pause: " + msg);
return false;
}msg = (msg.length == 0 ? ": RESUME to continue." : ": " + this.viewer.formatText (msg));
this.pauseExecution (true);
this.viewer.scriptStatusMsg ("script execution paused" + msg, "script paused for RESUME");
return true;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "print", 
($fz = function () {
if (this.statementLength == 1) this.error (2);
this.showStringPrint (this.parameterExpressionString (1, 0), true);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "prompt", 
($fz = function () {
var msg = null;
if (this.statementLength == 1) {
if (!this.isSyntaxCheck) msg = this.getScriptContext ().getContextTrace (null, true).toString ();
} else {
msg = this.parameterExpressionString (1, 0);
}if (!this.isSyntaxCheck) this.viewer.prompt (msg, "OK", null, true);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "refresh", 
($fz = function () {
if (this.isSyntaxCheck) return;
this.viewer.setTainted (true);
this.viewer.requestRepaintAndWait ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "reset", 
($fz = function () {
if (this.statementLength == 3 && this.tokAt (1) == 135368713) {
if (!this.isSyntaxCheck) this.viewer.removeFunction (this.stringParameter (2));
return;
}this.checkLength (-2);
if (this.isSyntaxCheck) return;
if (this.statementLength == 1) {
this.viewer.reset (false);
return;
}switch (this.tokAt (1)) {
case 135270422:
this.viewer.cacheClear ();
return;
case 1073741936:
this.viewer.resetError ();
return;
case 1087373323:
this.viewer.resetShapes (true);
return;
case 135368713:
this.viewer.clearFunctions ();
return;
case 1641025539:
var bsAllAtoms =  new org.jmol.util.BitSet ();
this.runScript (this.viewer.getDefaultStructure (null, bsAllAtoms));
this.viewer.resetBioshapes (bsAllAtoms);
return;
case 1649412112:
this.viewer.setData ("element_vdw", [null, ""], 0, 0, 0, 0, 0);
return;
case 1076887572:
this.viewer.resetAromatic ();
return;
case 1611141175:
this.viewer.reset (true);
return;
}
var $var = this.parameterAsString (1);
if ($var.charAt (0) == '_') this.error (22);
this.viewer.unsetProperty ($var);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "restrict", 
($fz = function () {
var isBond = (this.tokAt (1) == 1678770178);
this.select (isBond ? 2 : 1);
this.restrictSelected (isBond, true);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "restrictSelected", 
($fz = function (isBond, doInvert) {
if (this.isSyntaxCheck) return;
var bsSelected = org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSet (true));
if (doInvert) {
this.viewer.invertSelection ();
var bsSubset = this.viewer.getSelectionSubset ();
if (bsSubset != null) {
bsSelected = org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSet (true));
bsSelected.and (bsSubset);
this.viewer.select (bsSelected, false, null, true);
org.jmol.util.BitSetUtil.invertInPlace (bsSelected, this.viewer.getAtomCount ());
bsSelected.and (bsSubset);
}}org.jmol.util.BitSetUtil.andNot (bsSelected, this.viewer.getDeletedAtoms ());
var bondmode = this.viewer.getBondSelectionModeOr ();
if (!isBond) this.setBooleanProperty ("bondModeOr", true);
this.setShapeSizeBs (1, 0, null);
this.setShapeProperty (1, "type", Integer.$valueOf (32768));
this.setShapeSizeBs (1, 0, null);
this.setShapeProperty (1, "type", Integer.$valueOf (1023));
for (var shapeType = 21; --shapeType >= 0; ) if (shapeType != 6) this.setShapeSizeBs (shapeType, 0, null);

this.setShapeProperty (21, "delete", null);
this.shapeManager.setLabel (null, this.viewer.getSelectionSet (true));
if (!isBond) this.setBooleanProperty ("bondModeOr", bondmode);
this.viewer.select (bsSelected, false, null, true);
}, $fz.isPrivate = true, $fz), "~B,~B");
Clazz.defineMethod (c$, "rotate", 
($fz = function (isSpin, isSelected) {
if (this.statementLength == 2) switch (this.getToken (1).tok) {
case 1048589:
if (!this.isSyntaxCheck) this.viewer.setSpinOn (true);
return;
case 1048588:
if (!this.isSyntaxCheck) this.viewer.setSpinOn (false);
return;
}
var bsAtoms = null;
var degreesPerSecond = 1.4E-45;
var nPoints = 0;
var endDegrees = 3.4028235E38;
var isMolecular = false;
var haveRotation = false;
var ptsA = null;
var points =  new Array (2);
var rotAxis = org.jmol.util.Vector3f.new3 (0, 1, 0);
var translation = null;
var m4 = null;
var m3 = null;
var direction = 1;
var tok;
var q = null;
var helicalPath = false;
var ptsB = null;
var bsCompare = null;
var invPoint = null;
var invPlane = null;
var axesOrientationRasmol = this.viewer.getAxesOrientationRasmol ();
for (var i = 1; i < this.statementLength; ++i) {
switch (tok = this.getToken (i).tok) {
case 10:
case 1048577:
case 1048586:
case 8:
case 1048583:
if (tok == 10 || tok == 1048577) {
if (translation != null || q != null || nPoints == 2) {
bsAtoms = this.atomExpressionAt (i);
ptsB = null;
isSelected = true;
break;
}}haveRotation = true;
if (nPoints == 2) nPoints = 0;
var pt1 = this.centerParameterForModel (i, this.viewer.getCurrentModelIndex ());
if (!this.isSyntaxCheck && tok == 1048583 && this.tokAt (i + 2) != 269484096) {
isMolecular = true;
rotAxis = this.getDrawObjectAxis (this.objectNameParameter (++i), this.viewer.getCurrentModelIndex ());
}points[nPoints++] = pt1;
break;
case 1611141175:
isSpin = true;
continue;
case 1073741988:
case 1073742030:
isMolecular = true;
continue;
case 1114638350:
isSelected = true;
break;
case 269484080:
continue;
case 2:
case 3:
if (isSpin) {
if (degreesPerSecond == 1.4E-45) {
degreesPerSecond = this.floatParameter (i);
continue;
} else if (endDegrees == 3.4028235E38) {
endDegrees = degreesPerSecond;
degreesPerSecond = this.floatParameter (i);
continue;
}} else {
if (endDegrees == 3.4028235E38) {
endDegrees = this.floatParameter (i);
continue;
} else if (degreesPerSecond == 1.4E-45) {
degreesPerSecond = this.floatParameter (i);
isSpin = true;
continue;
}}this.error (22);
break;
case 269484192:
direction = -1;
continue;
case 1112541205:
haveRotation = true;
rotAxis.set (direction, 0, 0);
continue;
case 1112541206:
haveRotation = true;
rotAxis.set (0, direction, 0);
continue;
case 1112541207:
haveRotation = true;
rotAxis.set (0, 0, (axesOrientationRasmol && !isMolecular ? -direction : direction));
continue;
case 9:
case 135270417:
if (tok == 135270417) i++;
haveRotation = true;
q = this.getQuaternionParameter (i);
rotAxis.setT (q.getNormal ());
endDegrees = q.getTheta ();
break;
case 135266307:
haveRotation = true;
if (this.isPoint3f (++i)) {
rotAxis.setT (this.centerParameter (i));
break;
}var p4 = this.getPoint4f (i);
rotAxis.set (p4.x, p4.y, p4.z);
endDegrees = p4.w;
q = org.jmol.util.Quaternion.newVA (rotAxis, endDegrees);
break;
case 1048580:
haveRotation = true;
var iAtom1 = this.atomExpressionAt (++i).nextSetBit (0);
var iAtom2 = this.atomExpressionAt (++this.iToken).nextSetBit (0);
if (iAtom1 < 0 || iAtom2 < 0) return;
bsAtoms = this.viewer.getBranchBitSet (iAtom2, iAtom1);
isSelected = true;
isMolecular = true;
points[0] = this.viewer.getAtomPoint3f (iAtom1);
points[1] = this.viewer.getAtomPoint3f (iAtom2);
nPoints = 2;
break;
case 4160:
translation = org.jmol.util.Vector3f.newV (this.centerParameter (++i));
isMolecular = isSelected = true;
break;
case 137363468:
helicalPath = true;
continue;
case 1297090050:
var symop = this.intParameter (++i);
if (this.isSyntaxCheck) continue;
var info = this.viewer.getSpaceGroupInfo (null);
var op = (info == null ? null : info.get ("operations"));
if (symop == 0 || op == null || op.length < Math.abs (symop)) this.error (22);
op = op[Math.abs (symop) - 1];
translation = op[5];
invPoint = op[6];
points[0] = op[7];
if (op[8] != null) rotAxis = op[8];
endDegrees = (op[9]).intValue ();
if (symop < 0) {
endDegrees = -endDegrees;
if (translation != null) translation.scale (-1);
}if (endDegrees == 0 && points[0] != null) {
rotAxis.normalize ();
org.jmol.util.Measure.getPlaneThroughPoint (points[0], rotAxis, invPlane =  new org.jmol.util.Point4f ());
}q = org.jmol.util.Quaternion.newVA (rotAxis, endDegrees);
nPoints = (points[0] == null ? 0 : 1);
isMolecular = true;
haveRotation = true;
isSelected = true;
continue;
case 135270405:
case 12:
case 11:
haveRotation = true;
if (tok == 135270405) {
bsCompare = this.atomExpressionAt (++i);
ptsA = this.viewer.getAtomPointVector (bsCompare);
if (ptsA == null) this.errorAt (22, i);
i = this.iToken;
ptsB = this.getPointVector (this.getToken (++i), i);
if (ptsB == null || ptsA.size () != ptsB.size ()) this.errorAt (22, i);
m4 =  new org.jmol.util.Matrix4f ();
points[0] =  new org.jmol.util.Point3f ();
nPoints = 1;
var stddev = (this.isSyntaxCheck ? 0 : org.jmol.util.Measure.getTransformMatrix4 (ptsA, ptsB, m4, points[0]));
if (stddev > 0.001) ptsB = null;
} else if (tok == 12) {
m4 = this.theToken.value;
}m3 =  new org.jmol.util.Matrix3f ();
if (m4 != null) {
translation =  new org.jmol.util.Vector3f ();
m4.get (translation);
m4.getRotationScale (m3);
} else {
m3 = this.theToken.value;
}q = (this.isSyntaxCheck ?  new org.jmol.util.Quaternion () : org.jmol.util.Quaternion.newM (m3));
rotAxis.setT (q.getNormal ());
endDegrees = q.getTheta ();
isMolecular = true;
break;
default:
this.error (22);
}
i = this.iToken;
}
if (this.isSyntaxCheck) return;
if (isSelected && bsAtoms == null) bsAtoms = this.viewer.getSelectionSet (false);
if (bsCompare != null) {
isSelected = true;
if (bsAtoms == null) bsAtoms = bsCompare;
}var rate = (degreesPerSecond == 1.4E-45 ? 10 : endDegrees == 3.4028235E38 ? degreesPerSecond : (degreesPerSecond < 0) == (endDegrees > 0) ? -endDegrees / degreesPerSecond : degreesPerSecond);
if (q != null) {
if (nPoints == 0 && translation != null) points[0] = this.viewer.getAtomSetCenter (bsAtoms != null ? bsAtoms : isSelected ? this.viewer.getSelectionSet (false) : this.viewer.getModelUndeletedAtomsBitSet (-1));
if (helicalPath && translation != null) {
points[1] = org.jmol.util.Point3f.newP (points[0]);
points[1].add (translation);
var ret = org.jmol.util.Measure.computeHelicalAxis (null, 135266306, points[0], points[1], q);
points[0] = ret[0];
var theta = (ret[3]).x;
if (theta != 0) {
translation = ret[1];
rotAxis = org.jmol.util.Vector3f.newV (translation);
if (theta < 0) rotAxis.scale (-1);
}m4 = null;
}if (isSpin && m4 == null) m4 = org.jmol.script.ScriptMathProcessor.getMatrix4f (q.getMatrix (), translation);
if (points[0] != null) nPoints = 1;
}if (invPoint != null) {
this.viewer.invertAtomCoordPt (invPoint, bsAtoms);
if (rotAxis == null) return;
}if (invPlane != null) {
this.viewer.invertAtomCoordPlane (invPlane, bsAtoms);
if (rotAxis == null) return;
}if (nPoints < 2) {
if (!isMolecular) {
this.viewer.rotateAxisAngleAtCenter (points[0], rotAxis, rate, endDegrees, isSpin, bsAtoms);
return;
}if (nPoints == 0) points[0] =  new org.jmol.util.Point3f ();
points[1] = org.jmol.util.Point3f.newP (points[0]);
points[1].add (rotAxis);
nPoints = 2;
}if (nPoints == 0) points[0] =  new org.jmol.util.Point3f ();
if (nPoints < 2 || points[0].distance (points[1]) == 0) {
points[1] = org.jmol.util.Point3f.newP (points[0]);
points[1].y += 1.0;
}if (endDegrees == 3.4028235E38) endDegrees = 0;
if (endDegrees != 0 && translation != null && !haveRotation) translation.scale (endDegrees / translation.length ());
if (isSpin && translation != null && (endDegrees == 0 || degreesPerSecond == 0)) {
endDegrees = 0.01;
rate = (degreesPerSecond == 1.4E-45 ? 0.01 : degreesPerSecond < 0 ? -endDegrees / degreesPerSecond : degreesPerSecond * 0.01 / translation.length ());
degreesPerSecond = 0.01;
}if (bsAtoms != null && isSpin && ptsB == null && m4 != null) {
ptsA = this.viewer.getAtomPointVector (bsAtoms);
ptsB = org.jmol.util.Measure.transformPoints (ptsA, m4, points[0]);
}if (bsAtoms != null && !isSpin && ptsB != null) this.viewer.setAtomCoord (bsAtoms, 1146095626, ptsB);
 else this.viewer.rotateAboutPointsInternal (points[0], points[1], rate, endDegrees, isSpin, bsAtoms, translation, ptsB);
}, $fz.isPrivate = true, $fz), "~B,~B");
Clazz.defineMethod (c$, "getQuaternionParameter", 
($fz = function (i) {
if (this.tokAt (i) == 7) {
var sv = (this.getToken (i)).getList ();
var p4 = null;
if (sv.size () == 0 || (p4 = org.jmol.script.ScriptVariable.pt4Value (sv.get (0))) == null) this.error (22);
return org.jmol.util.Quaternion.newP4 (p4);
}return org.jmol.util.Quaternion.newP4 (this.getPoint4f (i));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getPointVector", 
function (t, i) {
switch (t.tok) {
case 10:
return this.viewer.getAtomPointVector (t.value);
case 7:
var data =  new java.util.ArrayList ();
var pt;
var pts = (t).getList ();
for (var j = 0; j < pts.size (); j++) if ((pt = org.jmol.script.ScriptVariable.ptValue (pts.get (j))) != null) data.add (pt);
 else return null;

return data;
}
if (i > 0) return this.viewer.getAtomPointVector (this.atomExpressionAt (i));
return null;
}, "org.jmol.script.Token,~N");
Clazz.defineMethod (c$, "getObjectCenter", 
($fz = function (axisID, index, modelIndex) {
var data = [axisID, Integer.$valueOf (index), Integer.$valueOf (modelIndex)];
return (this.getShapePropertyData (22, "getCenter", data) || this.getShapePropertyData (23, "getCenter", data) || this.getShapePropertyData (27, "getCenter", data) || this.getShapePropertyData (24, "getCenter", data) || this.getShapePropertyData (26, "getCenter", data) ? data[2] : null);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
Clazz.defineMethod (c$, "getObjectBoundingBox", 
($fz = function (id) {
var data = [id, null, null];
return (this.getShapePropertyData (23, "getBoundingBox", data) || this.getShapePropertyData (27, "getBoundingBox", data) || this.getShapePropertyData (24, "getBoundingBox", data) || this.getShapePropertyData (26, "getBoundingBox", data) ? data[2] : null);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "getDrawObjectAxis", 
($fz = function (axisID, index) {
var data = [axisID, Integer.$valueOf (index), null];
return (this.getShapePropertyData (22, "getSpinAxis", data) ? data[2] : null);
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "script", 
($fz = function (tok, filename, listCommands) {
var loadCheck = true;
var isCheck = false;
var doStep = false;
var lineNumber = 0;
var pc = 0;
var lineEnd = 0;
var pcEnd = 0;
var i = 2;
var theScript = null;
var localPath = null;
var remotePath = null;
var scriptPath = null;
var params = null;
if (tok == 135287308) {
this.checkLength (2);
if (!this.isSyntaxCheck) this.viewer.jsEval (this.parameterAsString (1));
return;
}if (filename == null) {
tok = this.tokAt (1);
if (tok != 4) this.error (16);
filename = this.parameterAsString (1);
if (filename.equalsIgnoreCase ("applet")) {
var appID = this.parameterAsString (2);
theScript = this.parameterExpressionString (3, 0);
this.checkLast (this.iToken);
if (this.isSyntaxCheck) return;
if (appID.length == 0 || appID.equals ("all")) appID = "*";
if (!appID.equals (".")) {
this.viewer.jsEval (appID + "\1" + theScript);
if (!appID.equals ("*")) return;
}} else {
tok = this.tokAt (this.statementLength - 1);
doStep = (tok == 266298);
if (filename.equalsIgnoreCase ("inline")) {
theScript = this.parameterExpressionString (2, (doStep ? this.statementLength - 1 : 0));
i = this.iToken + 1;
}while (filename.equalsIgnoreCase ("localPath") || filename.equalsIgnoreCase ("remotePath") || filename.equalsIgnoreCase ("scriptPath")) {
if (filename.equalsIgnoreCase ("localPath")) localPath = this.parameterAsString (i++);
 else if (filename.equalsIgnoreCase ("scriptPath")) scriptPath = this.parameterAsString (i++);
 else remotePath = this.parameterAsString (i++);
filename = this.parameterAsString (i++);
}
if ((tok = this.tokAt (i)) == 1073741878) {
isCheck = true;
tok = this.tokAt (++i);
}if (tok == 1073742050) {
loadCheck = false;
tok = this.tokAt (++i);
}if (tok == 1073741998 || tok == 1141899268) {
i++;
lineEnd = lineNumber = Math.max (this.intParameter (i++), 0);
if (this.checkToken (i)) {
if (this.getToken (i).tok == 269484192) lineEnd = (this.checkToken (++i) ? this.intParameter (i++) : 0);
 else lineEnd = -this.intParameter (i++);
if (lineEnd <= 0) this.error (22);
}} else if (tok == 1073741890 || tok == 1073741892) {
i++;
pc = Math.max (this.intParameter (i++) - 1, 0);
pcEnd = pc + 1;
if (this.checkToken (i)) {
if (this.getToken (i).tok == 269484192) pcEnd = (this.checkToken (++i) ? this.intParameter (i++) : 0);
 else pcEnd = -this.intParameter (i++);
if (pcEnd <= 0) this.error (22);
}}if (this.tokAt (i) == 269484048) {
params = this.parameterExpressionList (i, -1, false);
i = this.iToken + 1;
}this.checkLength (doStep ? i + 1 : i);
}}if (this.isSyntaxCheck && !this.isCmdLine_c_or_C_Option) return;
if (this.isCmdLine_c_or_C_Option) isCheck = true;
var wasSyntaxCheck = this.isSyntaxCheck;
var wasScriptCheck = this.isCmdLine_c_or_C_Option;
if (isCheck) this.isSyntaxCheck = this.isCmdLine_c_or_C_Option = true;
this.pushContext (null);
this.contextPath += " >> " + filename;
if (theScript == null ? this.compileScriptFileInternal (filename, localPath, remotePath, scriptPath) : this.compileScript (null, theScript, false)) {
this.pcEnd = pcEnd;
this.lineEnd = lineEnd;
while (pc < this.lineNumbers.length && this.lineNumbers[pc] < lineNumber) pc++;

this.pc = pc;
var saveLoadCheck = this.isCmdLine_C_Option;
this.isCmdLine_C_Option = new Boolean (this.isCmdLine_C_Option & loadCheck).valueOf ();
this.executionStepping = new Boolean (this.executionStepping | doStep).valueOf ();
this.contextVariables =  new java.util.Hashtable ();
this.contextVariables.put ("_arguments", (params == null ? org.jmol.script.ScriptVariable.getVariableAI ([]) : org.jmol.script.ScriptVariable.getVariableList (params)));
this.instructionDispatchLoop (isCheck || listCommands);
if (this.debugScript && this.viewer.getMessageStyleChime ()) this.viewer.scriptStatus ("script <exiting>");
this.isCmdLine_C_Option = saveLoadCheck;
this.popContext (false, false);
} else {
org.jmol.util.Logger.error (org.jmol.i18n.GT._ ("script ERROR: ") + this.errorMessage);
this.popContext (false, false);
if (wasScriptCheck) {
this.setErrorMessage (null);
} else {
this.evalError (null, null);
}}this.isSyntaxCheck = wasSyntaxCheck;
this.isCmdLine_c_or_C_Option = wasScriptCheck;
}, $fz.isPrivate = true, $fz), "~N,~S,~B");
Clazz.defineMethod (c$, "$function", 
($fz = function () {
if (this.isSyntaxCheck && !this.isCmdLine_c_or_C_Option) return;
var name = this.getToken (0).value;
if (!this.viewer.isFunction (name)) this.error (10);
var params = (this.statementLength == 1 || this.statementLength == 3 && this.tokAt (1) == 269484048 && this.tokAt (2) == 269484049 ? null : this.parameterExpressionList (1, -1, false));
if (this.isSyntaxCheck) return;
this.runFunctionRet (null, name, params, null, false, true);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "sync", 
($fz = function () {
this.checkLength (-3);
var text = "";
var applet = "";
switch (this.statementLength) {
case 1:
applet = "*";
text = "ON";
break;
case 2:
applet = this.parameterAsString (1);
if (applet.indexOf ("jmolApplet") == 0 || org.jmol.util.Parser.isOneOf (applet, "*;.;^")) {
text = "ON";
if (!this.isSyntaxCheck) this.viewer.syncScript (text, applet, 0);
applet = ".";
break;
}if (this.tokAt (1) == 2) {
if (!this.isSyntaxCheck) this.viewer.syncScript (null, null, this.intParameter (1));
return;
}text = applet;
applet = "*";
break;
case 3:
if (this.isSyntaxCheck) return;
applet = this.parameterAsString (1);
text = (this.tokAt (2) == 528443 ? "GET_GRAPHICS" : this.parameterAsString (2));
if (this.tokAt (1) == 2) {
this.viewer.syncScript (text, null, this.intParameter (1));
return;
}break;
}
if (this.isSyntaxCheck) return;
this.viewer.syncScript (text, applet, 0);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "history", 
($fz = function (pt) {
if (this.statementLength == 1) {
this.showString (this.viewer.getSetHistory (2147483647));
return;
}if (pt == 2) {
var n = this.intParameter (this.checkLast (2));
if (n < 0) this.error (22);
if (!this.isSyntaxCheck) this.viewer.getSetHistory (n == 0 ? 0 : -2 - n);
return;
}switch (this.getToken (this.checkLast (1)).tok) {
case 1048589:
case 1073741882:
if (!this.isSyntaxCheck) this.viewer.getSetHistory (-2147483648);
return;
case 1048588:
if (!this.isSyntaxCheck) this.viewer.getSetHistory (0);
break;
default:
this.errorStr (24, "ON, OFF, CLEAR");
}
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "display", 
($fz = function (isDisplay) {
var bs = null;
var addRemove = null;
var i = 1;
var tok;
switch (tok = this.tokAt (1)) {
case 1276118017:
case 1073742119:
addRemove = Boolean.$valueOf (tok == 1276118017);
tok = this.tokAt (++i);
break;
}
var isGroup = (tok == 1087373318);
if (isGroup) tok = this.tokAt (++i);
switch (tok) {
case 1048583:
this.setObjectProperty ();
return;
case 0:
break;
default:
if (this.statementLength == 4 && this.tokAt (2) == 1678770178) bs =  new org.jmol.modelset.Bond.BondSet (org.jmol.util.BitSetUtil.newBitSet2 (0, this.viewer.getModelSet ().getBondCount ()));
 else bs = this.atomExpressionAt (i);
}
if (this.isSyntaxCheck) return;
if (Clazz.instanceOf (bs, org.jmol.modelset.Bond.BondSet)) {
this.viewer.displayBonds (bs, isDisplay);
return;
}this.viewer.displayAtoms (bs, isDisplay, isGroup, addRemove, this.tQuiet);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "$delete", 
($fz = function () {
if (this.statementLength == 1) {
this.zap (true);
return;
}if (this.tokAt (1) == 1048583) {
this.setObjectProperty ();
return;
}var bs = this.atomExpression (this.statement, 1, 0, true, false, true, false);
if (this.isSyntaxCheck) return;
var nDeleted = this.viewer.deleteAtoms (bs, false);
if (!(this.tQuiet || this.scriptLevel > this.scriptReportingLevel)) this.scriptStatusOrBuffer (org.jmol.i18n.GT._ ("{0} atoms deleted", nDeleted));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "minimize", 
($fz = function () {
var bsSelected = null;
var steps = 2147483647;
var crit = 0;
var addHydrogen = false;
var isSilent = false;
var bsFixed = null;
var minimizer = this.viewer.getMinimizer (false);
for (var i = 1; i < this.statementLength; i++) switch (this.getToken (i).tok) {
case 1073741828:
addHydrogen = true;
continue;
case 1073741874:
case 1073742162:
this.checkLength (2);
if (this.isSyntaxCheck || minimizer == null) return;
minimizer.setProperty (this.parameterAsString (i), null);
return;
case 1073741882:
this.checkLength (2);
if (this.isSyntaxCheck || minimizer == null) return;
minimizer.setProperty ("clear", null);
return;
case 1073741894:
if (i != 1) this.error (22);
var n = 0;
var targetValue = 0;
var aList =  Clazz.newIntArray (5, 0);
if (this.tokAt (++i) == 1073741882) {
this.checkLength (3);
} else {
while (n < 4 && !this.isFloatParameter (i)) {
aList[++n] = this.atomExpressionAt (i).nextSetBit (0);
i = this.iToken + 1;
}
aList[0] = n;
if (n == 1) this.error (22);
targetValue = this.floatParameter (this.checkLast (i));
}if (!this.isSyntaxCheck) this.viewer.getMinimizer (true).setProperty ("constraint", [aList,  Clazz.newIntArray (n, 0), Float.$valueOf (targetValue)]);
return;
case 1073741905:
crit = this.floatParameter (++i);
continue;
case 1073741935:
steps = 0;
continue;
case 1060869:
if (i != 1) this.error (22);
bsFixed = this.atomExpressionAt (++i);
if (bsFixed.nextSetBit (0) < 0) bsFixed = null;
i = this.iToken;
if (!this.isSyntaxCheck) this.viewer.getMinimizer (true).setProperty ("fixed", bsFixed);
if (i + 1 == this.statementLength) return;
continue;
case 135280132:
bsSelected = this.atomExpressionAt (++i);
i = this.iToken;
continue;
case 1073742148:
isSilent = true;
break;
case 266298:
steps = this.intParameter (++i);
continue;
default:
this.error (22);
break;
}

if (!this.isSyntaxCheck) this.viewer.minimize (steps, crit, bsSelected, bsFixed, 0, addHydrogen, isSilent, false);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "select", 
($fz = function (i) {
if (this.statementLength == 1) {
this.viewer.select (null, false, null, this.tQuiet || this.scriptLevel > this.scriptReportingLevel);
return;
}if (this.statementLength == 2 && this.tokAt (1) == 1073742072) return;
this.viewer.setNoneSelected (this.statementLength == 4 && this.tokAt (2) == 1048587);
if (this.tokAt (2) == 10 && Clazz.instanceOf (this.getToken (2).value, org.jmol.modelset.Bond.BondSet) || this.getToken (2).tok == 1678770178 && this.getToken (3).tok == 10) {
if (this.statementLength == this.iToken + 2) {
if (!this.isSyntaxCheck) this.viewer.selectBonds (this.theToken.value);
return;
}this.error (22);
}if (this.getToken (2).tok == 1746538509) {
if (this.statementLength == 5 && this.getToken (3).tok == 10) {
if (!this.isSyntaxCheck) this.setShapeProperty (6, "select", this.theToken.value);
return;
}this.error (22);
}var bs = null;
var addRemove = null;
var isGroup = false;
if (this.getToken (1).intValue == 0) {
var v = this.parameterExpressionToken (0).value;
if (!(Clazz.instanceOf (v, org.jmol.util.BitSet))) this.error (22);
this.checkLast (this.iToken);
bs = v;
} else {
var tok = this.tokAt (i);
switch (tok) {
case 1276118017:
case 1073742119:
addRemove = Boolean.$valueOf (tok == 1276118017);
tok = this.tokAt (++i);
}
isGroup = (tok == 1087373318);
if (isGroup) tok = this.tokAt (++i);
bs = this.atomExpressionAt (i);
}if (this.isSyntaxCheck) return;
if (this.isBondSet) {
this.viewer.selectBonds (bs);
} else {
if (bs.length () > this.viewer.getAtomCount ()) {
var bs1 = this.viewer.getModelUndeletedAtomsBitSet (-1);
bs1.and (bs);
bs = bs1;
}this.viewer.select (bs, isGroup, addRemove, this.tQuiet || this.scriptLevel > this.scriptReportingLevel);
}}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "subset", 
($fz = function () {
var bs = null;
if (!this.isSyntaxCheck) this.viewer.setSelectionSubset (null);
if (this.statementLength != 1 && (this.statementLength != 4 || !this.getToken (2).value.equals ("off"))) bs = this.atomExpressionAt (1);
if (!this.isSyntaxCheck) this.viewer.setSelectionSubset (bs);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "invertSelected", 
($fz = function () {
var pt = null;
var plane = null;
var bs = null;
var iAtom = -2147483648;
switch (this.tokAt (1)) {
case 0:
if (this.isSyntaxCheck) return;
bs = this.viewer.getSelectionSet (false);
pt = this.viewer.getAtomSetCenter (bs);
this.viewer.invertAtomCoordPt (pt, bs);
return;
case 528443:
iAtom = this.atomExpressionAt (2).nextSetBit (0);
bs = this.atomExpressionAt (this.iToken + 1);
break;
case 135266320:
pt = this.centerParameter (2);
break;
case 135266319:
plane = this.planeParameter (2);
break;
case 135267841:
plane = this.hklParameter (2);
break;
}
this.checkLengthErrorPt (this.iToken + 1, 1);
if (plane == null && pt == null && iAtom == -2147483648) this.error (22);
if (this.isSyntaxCheck) return;
if (iAtom == -1) return;
this.viewer.invertSelected (pt, plane, iAtom, bs);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "translate", 
($fz = function (isSelected) {
var bs = null;
var i = 1;
var i0 = 0;
if (this.tokAt (1) == 1114638350) {
isSelected = true;
i0 = 1;
i = 2;
}if (this.isPoint3f (i)) {
var pt = this.getPoint3f (i, true);
bs = (!isSelected && this.iToken + 1 < this.statementLength ? this.atomExpressionAt (++this.iToken) : null);
this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.viewer.setAtomCoordRelative (pt, bs);
return;
}var xyz = this.parameterAsString (i).toLowerCase ().charAt (0);
if ("xyz".indexOf (xyz) < 0) this.error (0);
var amount = this.floatParameter (++i);
var type;
switch (this.tokAt (++i)) {
case 0:
case 10:
case 1048577:
type = '\0';
break;
default:
type = (this.optParameterAsString (i).toLowerCase () + '\0').charAt (0);
}
if (amount == 0 && type != '\0') return;
this.iToken = i0 + (type == '\0' ? 2 : 3);
bs = (isSelected ? this.viewer.getSelectionSet (false) : this.iToken + 1 < this.statementLength ? this.atomExpressionAt (++this.iToken) : null);
this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.viewer.translate (xyz, amount, type, bs);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "zap", 
($fz = function (isZapCommand) {
if (this.statementLength == 1 || !isZapCommand) {
this.viewer.zap (true, isZapCommand && !this.isStateScript, true);
this.refresh ();
return;
}var bs = this.atomExpressionAt (1);
if (this.isSyntaxCheck) return;
var nDeleted = this.viewer.deleteAtoms (bs, true);
var isQuiet = (this.tQuiet || this.scriptLevel > this.scriptReportingLevel);
if (!isQuiet) this.scriptStatusOrBuffer (org.jmol.i18n.GT._ ("{0} atoms deleted", nDeleted));
this.viewer.select (null, false, null, isQuiet);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "zoom", 
($fz = function (isZoomTo) {
if (!isZoomTo) {
var tok = (this.statementLength > 1 ? this.getToken (1).tok : 1048589);
switch (tok) {
case 1073741980:
case 1073742079:
break;
case 1048589:
case 1048588:
if (this.statementLength > 2) this.error (2);
if (!this.isSyntaxCheck) this.setBooleanProperty ("zoomEnabled", tok == 1048589);
return;
}
}var center = null;
var i = 1;
var time = (isZoomTo ? (this.isFloatParameter (i) ? this.floatParameter (i++) : 2) : 0);
if (time < 0) {
i--;
time = 0;
}var ptCenter = 0;
var bsCenter = null;
if (this.isCenterParameter (i)) {
ptCenter = i;
center = this.centerParameter (i);
if (Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet)) bsCenter = this.expressionResult;
i = this.iToken + 1;
} else if (this.tokAt (i) == 2 && this.getToken (i).intValue == 0) {
bsCenter = this.viewer.getAtomBitSet ("visible");
center = this.viewer.getAtomSetCenter (bsCenter);
}var isSameAtom = false;
var zoom = this.viewer.getZoomSetting ();
var newZoom = this.getZoom (ptCenter, i, bsCenter, zoom);
i = this.iToken + 1;
var xTrans = NaN;
var yTrans = NaN;
if (i != this.statementLength) {
xTrans = this.floatParameter (i++);
yTrans = this.floatParameter (i++);
}if (i != this.statementLength) this.error (22);
if (newZoom < 0) {
newZoom = -newZoom;
if (isZoomTo) {
if (this.statementLength == 1 || isSameAtom) newZoom *= 2;
 else if (center == null) newZoom /= 2;
}}var max = this.viewer.getMaxZoomPercent ();
if (newZoom < 5 || newZoom > max) this.numberOutOfRange (5, max);
if (!this.viewer.isWindowCentered ()) {
if (center != null) {
var bs = this.atomExpressionAt (ptCenter);
if (!this.isSyntaxCheck) this.viewer.setCenterBitSet (bs, false);
}center = this.viewer.getRotationCenter ();
if (Float.isNaN (xTrans)) xTrans = this.viewer.getTranslationXPercent ();
if (Float.isNaN (yTrans)) yTrans = this.viewer.getTranslationYPercent ();
}if (this.isSyntaxCheck) return;
if (Float.isNaN (xTrans)) xTrans = 0;
if (Float.isNaN (yTrans)) yTrans = 0;
if (isSameAtom && Math.abs (zoom - newZoom) < 1) time = 0;
this.viewer.moveTo (time, center, org.jmol.viewer.JmolConstants.center, NaN, null, newZoom, xTrans, yTrans, NaN, null, NaN, NaN, NaN);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getZoom", 
($fz = function (ptCenter, i, bs, currentZoom) {
var zoom = (this.isFloatParameter (i) ? this.floatParameter (i++) : NaN);
if (zoom == 0 || currentZoom == 0) {
var r = NaN;
if (bs == null) {
if (this.tokAt (ptCenter) == 1048583) {
var bbox = this.getObjectBoundingBox (this.objectNameParameter (ptCenter + 1));
if (bbox == null || (r = bbox[0].distance (bbox[1]) / 2) == 0) this.error (22);
}} else {
r = this.viewer.calcRotationRadiusBs (bs);
}if (Float.isNaN (r)) this.error (22);
currentZoom = this.viewer.getRotationRadius () / r * 100;
zoom = NaN;
}if (zoom < 0) {
zoom += currentZoom;
} else if (Float.isNaN (zoom)) {
var tok = this.tokAt (i);
switch (tok) {
case 1073742079:
case 1073741980:
zoom = currentZoom * (tok == 1073742079 ? 0.5 : 2);
i++;
break;
case 269484208:
case 269484209:
case 269484193:
var value = this.floatParameter (++i);
i++;
switch (tok) {
case 269484208:
zoom = currentZoom / value;
break;
case 269484209:
zoom = currentZoom * value;
break;
case 269484193:
zoom = currentZoom + value;
break;
}
break;
default:
zoom = (bs == null ? -currentZoom : currentZoom);
}
}this.iToken = i - 1;
return zoom;
}, $fz.isPrivate = true, $fz), "~N,~N,org.jmol.util.BitSet,~N");
Clazz.defineMethod (c$, "delay", 
($fz = function () {
var millis = 0;
switch (this.getToken (1).tok) {
case 1048589:
millis = 1;
break;
case 2:
millis = this.intParameter (1) * 1000;
break;
case 3:
millis = Clazz.floatToLong (this.floatParameter (1) * 1000);
break;
default:
this.error (34);
}
if (!this.isSyntaxCheck) this.delayMillis (millis);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "delayMillis", 
($fz = function (millis) {
if (this.viewer.isHeadless () || this.viewer.isSingleThreaded ()) return;
var timeBegin = System.currentTimeMillis ();
this.refresh ();
var delayMax;
if (millis < 0) millis = -millis;
 else if ((delayMax = this.viewer.getDelayMaximum ()) > 0 && millis > delayMax) millis = delayMax;
millis -= System.currentTimeMillis () - timeBegin;
var seconds = Clazz.doubleToInt (millis / 1000);
millis -= seconds * 1000;
if (millis <= 0) millis = 1;
while (seconds >= 0 && millis > 0 && !this.interruptExecution && this.currentThread === Thread.currentThread ()) {
this.viewer.popHoldRepaintWhy ("delay");
try {
Thread.sleep ((seconds--) > 0 ? 1000 : millis);
} catch (e) {
if (Clazz.exceptionOf (e, InterruptedException)) {
} else {
throw e;
}
}
this.viewer.pushHoldRepaintWhy ("delay");
}
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "slab", 
($fz = function (isDepth) {
var TF = false;
var plane = null;
var str;
if (this.isCenterParameter (1) || this.tokAt (1) == 9) plane = this.planeParameter (1);
 else switch (this.getToken (1).tok) {
case 2:
var percent = this.intParameter (this.checkLast (1));
if (!this.isSyntaxCheck) if (isDepth) this.viewer.depthToPercent (percent);
 else this.viewer.slabToPercent (percent);
return;
case 1048589:
this.checkLength (2);
TF = true;
case 1048588:
this.checkLength (2);
this.setBooleanProperty ("slabEnabled", TF);
return;
case 4141:
this.checkLength (2);
if (this.isSyntaxCheck) return;
this.viewer.slabReset ();
this.setBooleanProperty ("slabEnabled", true);
return;
case 1085443:
this.checkLength (2);
if (this.isSyntaxCheck) return;
this.viewer.setSlabDepthInternal (isDepth);
this.setBooleanProperty ("slabEnabled", true);
return;
case 269484192:
str = this.parameterAsString (2);
if (str.equalsIgnoreCase ("hkl")) plane = this.hklParameter (3);
 else if (str.equalsIgnoreCase ("plane")) plane = this.planeParameter (3);
if (plane == null) this.error (22);
plane.scale (-1);
break;
case 135266319:
switch (this.getToken (2).tok) {
case 1048587:
break;
default:
plane = this.planeParameter (2);
}
break;
case 135267841:
plane = (this.getToken (2).tok == 1048587 ? null : this.hklParameter (2));
break;
case 1073742118:
return;
default:
this.error (22);
}
if (!this.isSyntaxCheck) this.viewer.slabInternal (plane, isDepth);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "ellipsoid", 
($fz = function () {
var mad = 0;
var i = 1;
switch (this.getToken (1).tok) {
case 1048589:
mad = 50;
break;
case 1048588:
break;
case 2:
mad = this.intParameter (1);
break;
case 1085443:
this.checkLength (3);
this.shapeManager.loadShape (20);
this.setShapeProperty (20, "select", Integer.$valueOf (this.intParameterRange (2, 1, 3)));
return;
case 1074790550:
case 269484209:
case 1073741824:
this.shapeManager.loadShape (20);
if (this.theTok == 1074790550) i++;
this.setShapeId (20, i, false);
i = this.iToken;
while (++i < this.statementLength) {
var key = this.parameterAsString (i);
var value = null;
switch (this.tokAt (i)) {
case 1611272194:
var axes =  new Array (3);
for (var j = 0; j < 3; j++) {
axes[j] =  new org.jmol.util.Vector3f ();
axes[j].setT (this.centerParameter (++i));
i = this.iToken;
}
value = axes;
break;
case 12289:
value = this.centerParameter (++i);
i = this.iToken;
break;
case 1766856708:
var translucentLevel = NaN;
if (this.tokAt (i) == 1766856708) i++;
if ((this.theTok = this.tokAt (i)) == 1073742180) {
value = "translucent";
if (this.isFloatParameter (++i)) translucentLevel = this.getTranslucentLevel (i++);
 else translucentLevel = this.viewer.getDefaultTranslucent ();
} else if (this.theTok == 1073742074) {
value = "opaque";
i++;
}if (this.isColorParam (i)) {
this.setShapeProperty (20, "color", Integer.$valueOf (this.getArgbParam (i)));
i = this.iToken;
}if (value == null) continue;
if (!Float.isNaN (translucentLevel)) this.setShapeProperty (20, "translucentLevel", Float.$valueOf (translucentLevel));
key = "translucency";
break;
case 12291:
value = Boolean.TRUE;
this.checkLength (3);
break;
case 1095761933:
value = Integer.$valueOf (this.intParameter (++i));
break;
case 1048589:
value = Boolean.TRUE;
break;
case 1048588:
key = "on";
value = Boolean.FALSE;
break;
case 1073742138:
value = Float.$valueOf (this.floatParameter (++i));
break;
}
if (value == null) this.error (22);
this.setShapeProperty (20, key.toLowerCase (), value);
}
this.setShapeProperty (20, "thisID", null);
return;
default:
this.error (22);
}
this.setShapeSizeBs (20, mad, null);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getShapeNameParameter", 
($fz = function (i) {
var id = this.parameterAsString (i);
var isWild = id.equals ("*");
if (id.length == 0) this.error (22);
if (isWild) {
switch (this.tokAt (i + 1)) {
case 0:
case 1048589:
case 1048588:
case 3145768:
case 3145770:
case 1766856708:
case 12291:
break;
default:
if (this.setMeshDisplayProperty (-1, 0, this.tokAt (i + 1))) break;
id += this.optParameterAsString (++i);
}
}if (this.tokAt (i + 1) == 269484209) id += this.parameterAsString (++i);
this.iToken = i;
return id;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "setShapeId", 
($fz = function (iShape, i, idSeen) {
if (idSeen) this.error (22);
var name = this.getShapeNameParameter (i).toLowerCase ();
this.setShapeProperty (iShape, "thisID", name);
return name;
}, $fz.isPrivate = true, $fz), "~N,~N,~B");
Clazz.defineMethod (c$, "setAtomShapeSize", 
($fz = function (shape, scale) {
var rd = null;
var tok = this.tokAt (1);
var isOnly = false;
switch (tok) {
case 1073742072:
this.restrictSelected (false, false);
break;
case 1048589:
break;
case 1048588:
scale = 0;
break;
case 3:
isOnly = (this.floatParameter (1) < 0);
case 2:
default:
rd = this.encodeRadiusParameter (1, isOnly, true);
if (Float.isNaN (rd.value)) this.error (22);
}
if (rd == null) rd =  new org.jmol.atomdata.RadiusData (null, scale, org.jmol.atomdata.RadiusData.EnumType.FACTOR, org.jmol.constant.EnumVdw.AUTO);
if (isOnly) this.restrictSelected (false, false);
this.setShapeSize (shape, rd);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "encodeRadiusParameter", 
($fz = function (index, isOnly, allowAbsolute) {
var value = NaN;
var factorType = org.jmol.atomdata.RadiusData.EnumType.ABSOLUTE;
var vdwType = null;
var tok = (index == -1 ? 1649412112 : this.getToken (index).tok);
switch (tok) {
case 1112539137:
case 1112539138:
case 1112541195:
case 1114638346:
case 1112541199:
case 1649412112:
value = 1;
factorType = org.jmol.atomdata.RadiusData.EnumType.FACTOR;
vdwType = (tok == 1649412112 ? null : org.jmol.constant.EnumVdw.getVdwType2 (org.jmol.script.Token.nameOf (tok)));
tok = this.tokAt (++index);
break;
}
switch (tok) {
case 4141:
return this.viewer.getDefaultRadiusData ();
case 1073741852:
case 1073742116:
case 1073741856:
case 1073741858:
case 1073741992:
value = 1;
factorType = org.jmol.atomdata.RadiusData.EnumType.FACTOR;
this.iToken = index - 1;
break;
case 269484193:
case 2:
case 3:
if (tok == 269484193) {
index++;
} else if (this.tokAt (index + 1) == 269484210) {
value = Math.round (this.floatParameter (index));
this.iToken = ++index;
factorType = org.jmol.atomdata.RadiusData.EnumType.FACTOR;
if (value < 0 || value > 200) this.integerOutOfRange (0, 200);
value /= 100;
break;
} else if (tok == 2) {
value = this.intParameter (index);
if (value > 749 || value < -200) this.integerOutOfRange (-200, 749);
if (value > 0) {
value /= 250;
factorType = org.jmol.atomdata.RadiusData.EnumType.ABSOLUTE;
} else {
value /= -100;
factorType = org.jmol.atomdata.RadiusData.EnumType.FACTOR;
}break;
}value = this.floatParameterRange (index, (isOnly || !allowAbsolute ? -16 : 0), 16);
if (tok == 269484193 || !allowAbsolute) {
factorType = org.jmol.atomdata.RadiusData.EnumType.OFFSET;
} else {
factorType = org.jmol.atomdata.RadiusData.EnumType.ABSOLUTE;
vdwType = org.jmol.constant.EnumVdw.NADA;
}if (isOnly) value = -value;
break;
default:
if (value == 1) index--;
}
if (vdwType == null) {
vdwType = org.jmol.constant.EnumVdw.getVdwType (this.optParameterAsString (++this.iToken));
if (vdwType == null) {
this.iToken = index;
vdwType = org.jmol.constant.EnumVdw.AUTO;
}}return  new org.jmol.atomdata.RadiusData (null, value, factorType, vdwType);
}, $fz.isPrivate = true, $fz), "~N,~B,~B");
Clazz.defineMethod (c$, "structure", 
($fz = function () {
var type = org.jmol.constant.EnumStructure.getProteinStructureType (this.parameterAsString (1));
if (type === org.jmol.constant.EnumStructure.NOT) this.error (22);
var bs = null;
switch (this.tokAt (2)) {
case 10:
case 1048577:
bs = this.atomExpressionAt (2);
this.checkLast (this.iToken);
break;
default:
this.checkLength (2);
}
if (this.isSyntaxCheck) return;
this.clearDefinedVariableAtomSets ();
this.viewer.setProteinType (type, bs);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "wireframe", 
($fz = function () {
var mad = -2147483648;
if (this.tokAt (1) == 4141) this.checkLast (1);
 else mad = this.getMadParameter ();
if (this.isSyntaxCheck) return;
this.setShapeProperty (1, "type", Integer.$valueOf (1023));
this.setShapeSizeBs (1, mad == -2147483648 ? 300 : mad, null);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "ssbond", 
($fz = function () {
var mad = this.getMadParameter ();
this.setShapeProperty (1, "type", Integer.$valueOf (256));
this.setShapeSizeBs (1, mad, null);
this.setShapeProperty (1, "type", Integer.$valueOf (1023));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "struts", 
($fz = function () {
var defOn = (this.tokAt (1) == 1073742072 || this.tokAt (1) == 1048589 || this.statementLength == 1);
var mad = this.getMadParameter ();
if (defOn) mad = Math.round (this.viewer.getStrutDefaultRadius () * 2000);
this.setShapeProperty (1, "type", Integer.$valueOf (32768));
this.setShapeSizeBs (1, mad, null);
this.setShapeProperty (1, "type", Integer.$valueOf (1023));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "hbond", 
($fz = function () {
if (this.statementLength == 2 && this.getToken (1).tok == 4102) {
if (this.isSyntaxCheck) return;
var n = this.viewer.autoHbond (null, null, false);
this.scriptStatusOrBuffer (org.jmol.i18n.GT._ ("{0} hydrogen bonds", Math.abs (n)));
return;
}if (this.statementLength == 2 && this.getToken (1).tok == 12291) {
if (this.isSyntaxCheck) return;
this.connect (0);
return;
}var mad = this.getMadParameter ();
this.setShapeProperty (1, "type", Integer.$valueOf (30720));
this.setShapeSizeBs (1, mad, null);
this.setShapeProperty (1, "type", Integer.$valueOf (1023));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "configuration", 
($fz = function () {
var bsAtoms;
if (this.statementLength == 1) {
bsAtoms = this.viewer.setConformation ();
this.viewer.addStateScriptRet ("select", null, this.viewer.getSelectionSet (false), null, "configuration", true, false);
} else {
var n = this.intParameter (this.checkLast (1));
if (this.isSyntaxCheck) return;
bsAtoms = this.viewer.getConformation (this.viewer.getCurrentModelIndex (), n - 1, true);
this.viewer.addStateScript ("configuration " + n + ";", true, false);
}if (this.isSyntaxCheck) return;
this.setShapeProperty (1, "type", Integer.$valueOf (30720));
this.setShapeSizeBs (1, 0, bsAtoms);
this.viewer.autoHbond (bsAtoms, bsAtoms, true);
this.viewer.select (bsAtoms, false, null, this.tQuiet);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "vector", 
($fz = function () {
var type = org.jmol.atomdata.RadiusData.EnumType.SCREEN;
var value = 1;
this.checkLength (-3);
switch (this.iToken = this.statementLength) {
case 1:
break;
case 2:
switch (this.getToken (1).tok) {
case 1048589:
break;
case 1048588:
value = 0;
break;
case 2:
value = this.intParameterRange (1, 0, 19);
break;
case 3:
type = org.jmol.atomdata.RadiusData.EnumType.ABSOLUTE;
value = this.floatParameterRange (1, 0, 3);
break;
default:
this.error (6);
}
break;
case 3:
if (this.tokAt (1) == 1073742138) {
this.setFloatProperty ("vectorScale", this.floatParameterRange (2, -100, 100));
return;
}}
this.setShapeSize (18,  new org.jmol.atomdata.RadiusData (null, value, type, null));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "dipole", 
($fz = function () {
var propertyName = null;
var propertyValue = null;
var iHaveAtoms = false;
var iHaveCoord = false;
var idSeen = false;
this.shapeManager.loadShape (17);
if (this.tokAt (1) == 1073742001 && this.listIsosurface (17)) return;
this.setShapeProperty (17, "init", null);
if (this.statementLength == 1) {
this.setShapeProperty (17, "thisID", null);
return;
}for (var i = 1; i < this.statementLength; ++i) {
propertyName = null;
propertyValue = null;
switch (this.getToken (i).tok) {
case 1048589:
propertyName = "on";
break;
case 1048588:
propertyName = "off";
break;
case 12291:
propertyName = "delete";
break;
case 2:
case 3:
propertyName = "value";
propertyValue = Float.$valueOf (this.floatParameter (i));
break;
case 10:
propertyName = "atomBitset";
case 1048577:
if (propertyName == null) propertyName = (iHaveAtoms || iHaveCoord ? "endSet" : "startSet");
propertyValue = this.atomExpressionAt (i);
i = this.iToken;
iHaveAtoms = true;
break;
case 1048586:
case 8:
var pt = this.getPoint3f (i, true);
i = this.iToken;
propertyName = (iHaveAtoms || iHaveCoord ? "endCoord" : "startCoord");
propertyValue = pt;
iHaveCoord = true;
break;
case 1678770178:
propertyName = "bonds";
break;
case 4102:
propertyName = "calculate";
break;
case 1074790550:
this.setShapeId (17, ++i, idSeen);
i = this.iToken;
break;
case 135267329:
propertyName = "cross";
propertyValue = Boolean.TRUE;
break;
case 1073742040:
propertyName = "cross";
propertyValue = Boolean.FALSE;
break;
case 1073742066:
var v = this.floatParameter (++i);
if (this.theTok == 2) {
propertyName = "offsetPercent";
propertyValue = Integer.$valueOf (Clazz.floatToInt (v));
} else {
propertyName = "offset";
propertyValue = Float.$valueOf (v);
}break;
case 1073742068:
propertyName = "offsetSide";
propertyValue = Float.$valueOf (this.floatParameter (++i));
break;
case 1073742188:
propertyName = "value";
propertyValue = Float.$valueOf (this.floatParameter (++i));
break;
case 1073742196:
propertyName = "width";
propertyValue = Float.$valueOf (this.floatParameter (++i));
break;
default:
if (this.theTok == 269484209 || org.jmol.script.Token.tokAttr (this.theTok, 1073741824)) {
this.setShapeId (17, i, idSeen);
i = this.iToken;
break;
}this.error (22);
}
idSeen = (this.theTok != 12291 && this.theTok != 4102);
if (propertyName != null) this.setShapeProperty (17, propertyName, propertyValue);
}
if (iHaveCoord || iHaveAtoms) this.setShapeProperty (17, "set", null);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "animationMode", 
($fz = function () {
var startDelay = 1;
var endDelay = 1;
if (this.statementLength > 5) this.error (2);
var animationMode = null;
switch (this.getToken (2).tok) {
case 1073742070:
animationMode = org.jmol.constant.EnumAnimationMode.ONCE;
startDelay = endDelay = 0;
break;
case 528410:
animationMode = org.jmol.constant.EnumAnimationMode.LOOP;
break;
case 1073742082:
animationMode = org.jmol.constant.EnumAnimationMode.PALINDROME;
break;
default:
this.error (22);
}
if (this.statementLength >= 4) {
startDelay = endDelay = this.floatParameter (3);
if (this.statementLength == 5) endDelay = this.floatParameter (4);
}if (!this.isSyntaxCheck) this.viewer.setAnimationReplayMode (animationMode, startDelay, endDelay);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "vibration", 
($fz = function () {
this.checkLength (-3);
var period = 0;
switch (this.getToken (1).tok) {
case 1048589:
this.checkLength (2);
period = this.viewer.getVibrationPeriod ();
break;
case 1048588:
this.checkLength (2);
period = 0;
break;
case 2:
case 3:
this.checkLength (2);
period = this.floatParameter (1);
break;
case 1073742138:
this.setFloatProperty ("vibrationScale", this.floatParameterRange (2, -10, 10));
return;
case 1073742090:
this.setFloatProperty ("vibrationPeriod", this.floatParameter (2));
return;
case 1073741824:
this.error (22);
break;
default:
period = -1;
}
if (period < 0) this.error (22);
if (this.isSyntaxCheck) return;
if (period == 0) {
this.viewer.setVibrationOff ();
return;
}this.viewer.setVibrationPeriod (-period);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "animationDirection", 
($fz = function () {
var i = 2;
var direction = 0;
switch (this.tokAt (i)) {
case 269484192:
direction = -this.intParameter (++i);
break;
case 269484193:
direction = this.intParameter (++i);
break;
case 2:
direction = this.intParameter (i);
if (direction > 0) direction = 0;
break;
default:
this.error (22);
}
this.checkLength (++i);
if (direction != 1 && direction != -1) this.errorStr2 (35, "-1", "1");
if (!this.isSyntaxCheck) this.viewer.setAnimationDirection (direction);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "calculate", 
($fz = function () {
var isSurface = false;
var asDSSP = false;
var bs;
var bs2 = null;
var n = -2147483648;
if ((this.iToken = this.statementLength) >= 2) {
this.clearDefinedVariableAtomSets ();
switch (this.getToken (1).tok) {
case 1073741824:
this.checkLength (2);
break;
case 1076887572:
this.checkLength (2);
if (!this.isSyntaxCheck) this.viewer.assignAromaticBonds ();
return;
case 1612189718:
if (this.statementLength == 2) {
if (!this.isSyntaxCheck) {
n = this.viewer.autoHbond (null, null, false);
break;
}return;
}var bs1 = null;
asDSSP = (this.tokAt (++this.iToken) == 1641025539);
if (asDSSP) bs1 = this.viewer.getSelectionSet (false);
 else bs1 = this.atomExpressionAt (this.iToken);
if (!asDSSP && !(asDSSP = (this.tokAt (++this.iToken) == 1641025539))) bs2 = this.atomExpressionAt (this.iToken);
if (!this.isSyntaxCheck) {
n = this.viewer.autoHbond (bs1, bs2, false);
break;
}return;
case 1613758476:
bs = (this.statementLength == 2 ? null : this.atomExpressionAt (2));
this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.viewer.addHydrogens (bs, false, false);
return;
case 1112541196:
this.iToken = 1;
bs = (this.statementLength == 2 ? null : this.atomExpressionAt (2));
this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.viewer.calculatePartialCharges (bs);
return;
case 1073742102:
this.pointGroup ();
return;
case 1112539148:
this.checkLength (2);
if (!this.isSyntaxCheck) {
this.viewer.calculateStraightness ();
this.viewer.addStateScript ("set quaternionFrame '" + this.viewer.getQuaternionFrame () + "'; calculate straightness", false, true);
}return;
case 1641025539:
bs = (this.statementLength < 4 ? null : this.atomExpressionAt (2));
switch (this.tokAt (++this.iToken)) {
case 1052714:
break;
case 1073741915:
asDSSP = true;
break;
case 0:
asDSSP = this.viewer.getDefaultStructureDSSP ();
break;
default:
this.error (22);
}
if (!this.isSyntaxCheck) this.showString (this.viewer.calculateStructures (bs, asDSSP, true));
return;
case 1708058:
bs = (this.iToken + 1 < this.statementLength ? this.atomExpressionAt (++this.iToken) : null);
bs2 = (this.iToken + 1 < this.statementLength ? this.atomExpressionAt (++this.iToken) : null);
this.checkLength (++this.iToken);
if (!this.isSyntaxCheck) {
n = this.viewer.calculateStruts (bs, bs2);
if (n > 0) this.colorShapeBs (4, 32768, 0x0FFFFFF, "translucent", 0.5, null);
this.showString (org.jmol.i18n.GT._ ("{0} struts added", n));
}return;
case 3145756:
isSurface = true;
case 1112539149:
var isFrom = false;
switch (this.tokAt (2)) {
case 135266324:
this.iToken++;
break;
case 0:
isFrom = !isSurface;
break;
case 1073741952:
isFrom = true;
this.iToken++;
break;
default:
isFrom = true;
}
bs = (this.iToken + 1 < this.statementLength ? this.atomExpressionAt (++this.iToken) : this.viewer.getSelectionSet (false));
this.checkLength (++this.iToken);
if (!this.isSyntaxCheck) this.viewer.calculateSurface (bs, (isFrom ? 3.4028235E38 : -1));
return;
}
if (n != -2147483648) {
this.scriptStatusOrBuffer (org.jmol.i18n.GT._ ("{0} hydrogen bonds", Math.abs (n)));
return;
}}this.errorStr2 (53, "CALCULATE", "aromatic? hbonds? hydrogen? partialCharge? pointgroup? straightness? structure? struts? surfaceDistance FROM? surfaceDistance WITHIN?");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "pointGroup", 
($fz = function () {
switch (this.tokAt (0)) {
case 4102:
if (!this.isSyntaxCheck) this.showString (this.viewer.calculatePointGroup ());
return;
case 4148:
if (!this.isSyntaxCheck) this.showString (this.viewer.getPointGroupAsString (false, null, 0, 0));
return;
}
var pt = 2;
var type = (this.tokAt (pt) == 1073742138 ? "" : this.optParameterAsString (pt));
var scale = 1;
var index = 0;
if (type.length > 0) {
if (this.isFloatParameter (++pt)) index = this.intParameter (pt++);
}if (this.tokAt (pt) == 1073742138) scale = this.floatParameter (++pt);
if (!this.isSyntaxCheck) this.runScript (this.viewer.getPointGroupAsString (true, type, index, scale));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "dots", 
($fz = function (iShape) {
if (!this.isSyntaxCheck) this.shapeManager.loadShape (iShape);
this.setShapeProperty (iShape, "init", null);
var value = NaN;
var type = org.jmol.atomdata.RadiusData.EnumType.ABSOLUTE;
var ipt = 1;
switch (this.getToken (ipt).tok) {
case 1073742072:
this.restrictSelected (false, false);
value = 1;
type = org.jmol.atomdata.RadiusData.EnumType.FACTOR;
break;
case 1048589:
value = 1;
type = org.jmol.atomdata.RadiusData.EnumType.FACTOR;
break;
case 1048588:
value = 0;
break;
case 2:
var dotsParam = this.intParameter (ipt);
if (this.tokAt (ipt + 1) == 1666189314) {
ipt++;
this.setShapeProperty (iShape, "atom", Integer.$valueOf (dotsParam));
this.setShapeProperty (iShape, "radius", Float.$valueOf (this.floatParameter (++ipt)));
if (this.tokAt (++ipt) == 1766856708) {
this.setShapeProperty (iShape, "colorRGB", Integer.$valueOf (this.getArgbParam (++ipt)));
ipt++;
}if (this.getToken (ipt).tok != 10) this.error (22);
this.setShapeProperty (iShape, "dots", this.statement[ipt].value);
return;
}break;
}
var rd = (Float.isNaN (value) ? this.encodeRadiusParameter (ipt, false, true) :  new org.jmol.atomdata.RadiusData (null, value, type, org.jmol.constant.EnumVdw.AUTO));
if (Float.isNaN (rd.value)) this.error (22);
this.setShapeSize (iShape, rd);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "proteinShape", 
($fz = function (shapeType) {
var mad = 0;
switch (this.getToken (1).tok) {
case 1073742072:
if (this.isSyntaxCheck) return;
this.restrictSelected (false, false);
mad = -1;
break;
case 1048589:
mad = -1;
break;
case 1048588:
break;
case 1641025539:
mad = -2;
break;
case 1112541199:
case 1073741922:
mad = -4;
break;
case 2:
mad = (this.intParameterRange (1, 0, 1000) * 8);
break;
case 3:
mad = Math.round (this.floatParameterRange (1, -4.0, 4.0) * 2000);
if (mad < 0) {
this.restrictSelected (false, false);
mad = -mad;
}break;
case 10:
if (!this.isSyntaxCheck) this.shapeManager.loadShape (shapeType);
this.setShapeProperty (shapeType, "bitset", this.theToken.value);
return;
default:
this.error (6);
}
this.setShapeSizeBs (shapeType, mad, null);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "animation", 
($fz = function () {
var animate = false;
switch (this.getToken (1).tok) {
case 1048589:
animate = true;
case 1048588:
if (!this.isSyntaxCheck) this.viewer.setAnimationOn (animate);
break;
case 4115:
this.frame (2);
break;
case 1073742024:
this.animationMode ();
break;
case 1073741918:
this.animationDirection ();
break;
case 1074790526:
this.setIntProperty ("animationFps", this.intParameter (this.checkLast (2)));
break;
default:
this.frameControl (1);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "assign", 
($fz = function () {
var atomsOrBonds = this.tokAt (1);
var index = this.atomExpressionAt (2).nextSetBit (0);
var index2 = -1;
var type = null;
if (index < 0) this.error (22);
if (atomsOrBonds == 4106) {
index2 = this.atomExpressionAt (++this.iToken).nextSetBit (0);
} else {
type = this.parameterAsString (++this.iToken);
}var pt = (++this.iToken < this.statementLength ? this.centerParameter (this.iToken) : null);
if (this.isSyntaxCheck) return;
switch (atomsOrBonds) {
case 1141899265:
this.viewer.assignAtom (index, pt, type);
break;
case 1678770178:
this.viewer.assignBond (index, (type + "p").charAt (0));
break;
case 4106:
this.viewer.assignConnect (index, index2);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "file", 
($fz = function () {
var file = this.intParameter (this.checkLast (1));
if (this.isSyntaxCheck) return;
var modelIndex = this.viewer.getModelNumberIndex (file * 1000000 + 1, false, false);
var modelIndex2 = -1;
if (modelIndex >= 0) {
modelIndex2 = this.viewer.getModelNumberIndex ((file + 1) * 1000000 + 1, false, false);
if (modelIndex2 < 0) modelIndex2 = this.viewer.getModelCount ();
modelIndex2--;
}this.viewer.setAnimationOn (false);
this.viewer.setAnimationDirection (1);
this.viewer.setAnimationRange (modelIndex, modelIndex2);
this.viewer.setCurrentModelIndex (-1);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "fixed", 
($fz = function () {
var bs = (this.statementLength == 1 ? null : this.atomExpressionAt (1));
if (this.isSyntaxCheck) return;
this.viewer.setMotionFixedAtoms (bs);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "frame", 
($fz = function (offset) {
var useModelNumber = true;
if (this.statementLength == 1 && offset == 1) {
var modelIndex = this.viewer.getCurrentModelIndex ();
var m;
if (!this.isSyntaxCheck && modelIndex >= 0 && (m = this.viewer.getJmolDataSourceFrame (modelIndex)) >= 0) this.viewer.setCurrentModelIndex (m == modelIndex ? -2147483648 : m);
return;
}switch (this.tokAt (1)) {
case 1048577:
case 10:
var i = this.atomExpressionAt (1).nextSetBit (0);
this.checkLength (this.iToken + 1);
if (this.isSyntaxCheck || i < 0) return;
var bsa =  new org.jmol.util.BitSet ();
bsa.set (i);
this.viewer.setCurrentModelIndex (this.viewer.getModelBitSet (bsa, false).nextSetBit (0));
return;
case 1074790550:
this.checkLength (3);
var id = this.stringParameter (2);
if (!this.isSyntaxCheck) this.viewer.setCurrentModelID (id);
return;
case 528397:
var millis = 0;
this.checkLength (3);
switch (this.getToken (2).tok) {
case 2:
case 3:
millis = Clazz.floatToLong (this.floatParameter (2) * 1000);
break;
default:
this.error (20);
}
if (!this.isSyntaxCheck) this.viewer.setFrameDelayMs (millis);
return;
case 1073742166:
if (this.checkLength23 () > 0) if (!this.isSyntaxCheck) this.viewer.setFrameTitleObj (this.statementLength == 2 ? "@{_modelName}" : (this.tokAt (2) == 7 ? org.jmol.script.ScriptVariable.listValue (this.statement[2]) : this.parameterAsString (2)));
return;
case 1073741832:
var bs = (this.statementLength == 2 || this.tokAt (2) == 1048587 ? null : this.atomExpressionAt (2));
if (!this.isSyntaxCheck) this.viewer.setFrameOffsets (bs);
return;
}
if (this.getToken (offset).tok == 269484192) {
++offset;
if (this.getToken (this.checkLast (offset)).tok != 2 || this.intParameter (offset) != 1) this.error (22);
if (!this.isSyntaxCheck) this.viewer.setAnimation (1073742108);
return;
}var isPlay = false;
var isRange = false;
var isAll = false;
var isHyphen = false;
var frameList = [-1, -1];
var nFrames = 0;
var fFrame = 0;
var haveFileSet = this.viewer.haveFileSet ();
for (var i = offset; i < this.statementLength; i++) {
switch (this.getToken (i).tok) {
case 1048579:
case 269484209:
this.checkLength (offset + (isRange ? 2 : 1));
isAll = true;
break;
case 269484192:
if (nFrames != 1) this.error (22);
isHyphen = true;
break;
case 1048587:
this.checkLength (offset + 1);
break;
case 3:
useModelNumber = false;
if ((fFrame = this.floatParameter (i)) < 0) this.error (22);
case 2:
case 4:
if (nFrames == 2) this.error (22);
var iFrame = (this.theTok == 4 ? org.jmol.script.ScriptEvaluator.getFloatEncodedInt (this.theToken.value) : this.theToken.intValue);
if (iFrame < 0 && nFrames == 1) {
isHyphen = true;
iFrame = -iFrame;
if (haveFileSet && iFrame < 1000000) iFrame *= 1000000;
}if (this.theTok == 3 && haveFileSet && fFrame == Clazz.floatToInt (fFrame)) iFrame = Clazz.floatToInt (fFrame) * 1000000;
if (iFrame == 2147483647) {
if (i == 1) {
var id = this.theToken.value.toString ();
var modelIndex = (this.isSyntaxCheck ? -1 : this.viewer.getModelIndexFromId (id));
if (modelIndex >= 0) {
this.checkLength (2);
this.viewer.setCurrentModelIndex (modelIndex);
return;
}}iFrame = 0;
}if (iFrame == -1) {
this.checkLength (offset + 1);
if (!this.isSyntaxCheck) this.viewer.setAnimation (1073742108);
return;
}if (iFrame >= 1000 && iFrame < 1000000 && haveFileSet) iFrame = (Clazz.doubleToInt (iFrame / 1000)) * 1000000 + (iFrame % 1000);
if (!useModelNumber && iFrame == 0 && nFrames == 0) isAll = true;
if (iFrame >= 1000000) useModelNumber = false;
frameList[nFrames++] = iFrame;
break;
case 1073742096:
isPlay = true;
break;
case 1073742114:
isRange = true;
break;
default:
this.frameControl (offset);
return;
}
}
if (isRange && nFrames == 0) isAll = true;
if (this.isSyntaxCheck) return;
if (isAll) {
this.viewer.setAnimationOn (false);
this.viewer.setAnimationRange (-1, -1);
if (!isRange) this.viewer.setCurrentModelIndex (-1);
return;
}if (nFrames == 2 && !isRange) isHyphen = true;
if (haveFileSet) useModelNumber = false;
 else if (useModelNumber) for (var i = 0; i < nFrames; i++) if (frameList[i] >= 0) frameList[i] %= 1000000;

var modelIndex = this.viewer.getModelNumberIndex (frameList[0], useModelNumber, false);
var modelIndex2 = -1;
if (haveFileSet && modelIndex < 0 && frameList[0] != 0) {
if (frameList[0] < 1000000) frameList[0] *= 1000000;
if (nFrames == 2 && frameList[1] < 1000000) frameList[1] *= 1000000;
if (frameList[0] % 1000000 == 0) {
frameList[0]++;
modelIndex = this.viewer.getModelNumberIndex (frameList[0], false, false);
if (modelIndex >= 0) {
var i2 = (nFrames == 1 ? frameList[0] + 1000000 : frameList[1] == 0 ? -1 : frameList[1] % 1000000 == 0 ? frameList[1] + 1000001 : frameList[1] + 1);
modelIndex2 = this.viewer.getModelNumberIndex (i2, false, false);
if (modelIndex2 < 0) modelIndex2 = this.viewer.getModelCount ();
modelIndex2--;
if (isRange) nFrames = 2;
 else if (!isHyphen && modelIndex2 != modelIndex) isHyphen = true;
isRange = isRange || modelIndex == modelIndex2;
}} else {
return;
}}if (!isPlay && !isRange || modelIndex >= 0) this.viewer.setCurrentModelIndexClear (modelIndex, false);
if (isPlay && nFrames == 2 || isRange || isHyphen) {
if (modelIndex2 < 0) modelIndex2 = this.viewer.getModelNumberIndex (frameList[1], useModelNumber, false);
this.viewer.setAnimationOn (false);
this.viewer.setAnimationDirection (1);
this.viewer.setAnimationRange (modelIndex, modelIndex2);
this.viewer.setCurrentModelIndexClear (isHyphen && !isRange ? -1 : modelIndex >= 0 ? modelIndex : 0, false);
}if (isPlay) this.viewer.setAnimation (266287);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "bitSetForModelFileNumber", 
function (m) {
var bs = org.jmol.util.BitSetUtil.newBitSet (this.viewer.getAtomCount ());
if (this.isSyntaxCheck) return bs;
var modelCount = this.viewer.getModelCount ();
var haveFileSet = this.viewer.haveFileSet ();
if (m < 1000000 && haveFileSet) m *= 1000000;
var pt = m % 1000000;
if (pt == 0) {
var model1 = this.viewer.getModelNumberIndex (m + 1, false, false);
if (model1 < 0) return bs;
var model2 = (m == 0 ? modelCount : this.viewer.getModelNumberIndex (m + 1000001, false, false));
if (model1 < 0) model1 = 0;
if (model2 < 0) model2 = modelCount;
if (this.viewer.isTrajectory (model1)) model2 = model1 + 1;
for (var j = model1; j < model2; j++) bs.or (this.viewer.getModelUndeletedAtomsBitSet (j));

} else {
var modelIndex = this.viewer.getModelNumberIndex (m, false, true);
if (modelIndex >= 0) bs.or (this.viewer.getModelUndeletedAtomsBitSet (modelIndex));
}return bs;
}, "~N");
Clazz.defineMethod (c$, "frameControl", 
($fz = function (i) {
switch (this.getToken (this.checkLast (i)).tok) {
case 1073742098:
case 1073742096:
case 266287:
case 20487:
case 1073742037:
case 1073742108:
case 1073742126:
case 1073741942:
case 1073741993:
if (!this.isSyntaxCheck) this.viewer.setAnimation (this.theTok);
return;
}
this.error (22);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getShapeType", 
($fz = function (tok) {
var iShape = org.jmol.viewer.JmolConstants.shapeTokenIndex (tok);
if (iShape < 0) this.error (49);
return iShape;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "font", 
($fz = function (shapeType, fontsize) {
var fontface = "SansSerif";
var fontstyle = "Plain";
var sizeAdjust = 0;
var scaleAngstromsPerPixel = -1;
switch (this.iToken = this.statementLength) {
case 6:
scaleAngstromsPerPixel = this.floatParameter (5);
if (scaleAngstromsPerPixel >= 5) scaleAngstromsPerPixel = this.viewer.getZoomSetting () / scaleAngstromsPerPixel / this.viewer.getScalePixelsPerAngstrom (false);
case 5:
if (this.getToken (4).tok != 1073741824) this.error (22);
fontstyle = this.parameterAsString (4);
case 4:
if (this.getToken (3).tok != 1073741824) this.error (22);
fontface = this.parameterAsString (3);
if (!this.isFloatParameter (2)) this.error (34);
fontsize = this.floatParameter (2);
shapeType = this.getShapeType (this.getToken (1).tok);
break;
case 3:
if (!this.isFloatParameter (2)) this.error (34);
if (shapeType == -1) {
shapeType = this.getShapeType (this.getToken (1).tok);
fontsize = this.floatParameter (2);
} else {
if (fontsize >= 1) fontsize += (sizeAdjust = 5);
}break;
case 2:
default:
if (shapeType == 5) {
fontsize = 13;
break;
}this.error (2);
}
if (shapeType == 5) {
if (fontsize < 0 || fontsize >= 1 && (fontsize < 6 || fontsize > 63)) this.integerOutOfRange (6 - sizeAdjust, 63 - sizeAdjust);
this.setShapeProperty (5, "setDefaults", this.viewer.getNoneSelected ());
}if (this.isSyntaxCheck) return;
if (org.jmol.util.GData.getFontStyleID (fontface) >= 0) {
fontstyle = fontface;
fontface = "SansSerif";
}var font3d = this.viewer.getFont3D (fontface, fontstyle, fontsize);
this.shapeManager.loadShape (shapeType);
this.setShapeProperty (shapeType, "font", font3d);
if (scaleAngstromsPerPixel >= 0) this.setShapeProperty (shapeType, "scalereference", Float.$valueOf (scaleAngstromsPerPixel));
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "set", 
($fz = function () {
if (this.statementLength == 1) {
this.showString (this.viewer.getAllSettings (null));
return;
}var isJmolSet = (this.parameterAsString (0).equals ("set"));
var key = this.optParameterAsString (1);
if (isJmolSet && this.statementLength == 2 && key.indexOf ("?") >= 0) {
this.showString (this.viewer.getAllSettings (key.substring (0, key.indexOf ("?"))));
return;
}var tok = this.getToken (1).tok;
var newTok = 0;
var sval;
var ival = 2147483647;
var showing = (!this.isSyntaxCheck && !this.tQuiet && this.scriptLevel <= this.scriptReportingLevel && !(this.statement[0].value).equals ("var"));
switch (tok) {
case 1611272194:
this.axes (2);
return;
case 1610616835:
this.background (2);
return;
case 1679429641:
this.boundbox (2);
return;
case 1611272202:
this.frank (2);
return;
case 1610616855:
this.history (2);
return;
case 1826248715:
this.label (2);
return;
case 1614417948:
this.unitcell (2);
return;
case 536870920:
this.shapeManager.loadShape (8);
this.setShapeProperty (8, "highlight", (this.tokAt (2) == 1048588 ? null : this.atomExpressionAt (2)));
return;
case 1610625028:
case 1611141171:
this.selectionHalo (2);
return;
case 536875070:
this.timeout (2);
return;
}
switch (tok) {
case 1641025539:
var type = org.jmol.constant.EnumStructure.getProteinStructureType (this.parameterAsString (2));
if (type === org.jmol.constant.EnumStructure.NOT) this.error (22);
var data = this.floatParameterSet (3, 0, 2147483647);
if (data.length % 4 != 0) this.error (22);
this.viewer.setStructureList (data, type);
this.checkLast (this.iToken);
return;
case 545259526:
ival = this.getArgbParam (2);
if (!this.isSyntaxCheck) this.setObjectArgb ("axes", ival);
return;
case 1610612737:
this.setBondmode ();
return;
case 536870916:
if (this.isSyntaxCheck) return;
var iLevel = (this.tokAt (2) == 1048588 || this.tokAt (2) == 2 && this.intParameter (2) == 0 ? 4 : 5);
org.jmol.util.Logger.setLogLevel (iLevel);
this.setIntProperty ("logLevel", iLevel);
if (iLevel == 4) {
this.viewer.setDebugScript (false);
if (showing) this.viewer.showParameter ("debugScript", true, 80);
}this.setDebugging ();
if (showing) this.viewer.showParameter ("logLevel", true, 80);
return;
case 537022465:
this.setEcho ();
return;
case 1610612738:
this.font (5, this.checkLength23 () == 2 ? 0 : this.floatParameter (2));
return;
case 1612189718:
this.setHbond ();
return;
case 1746538509:
case 537006096:
this.setMonitor ();
return;
case 1611141176:
this.setSsbond ();
return;
case 1610612741:
this.setLabel ("toggle");
return;
case 536870930:
this.setUserColors ();
return;
case 553648188:
this.setZslab ();
return;
}
var justShow = true;
switch (tok) {
case 536870914:
if (this.statementLength > 2) {
var modelDotted = this.stringSetting (2, false);
var modelNumber;
var useModelNumber = false;
if (modelDotted.indexOf (".") < 0) {
modelNumber = org.jmol.util.Parser.parseInt (modelDotted);
useModelNumber = true;
} else {
modelNumber = org.jmol.script.ScriptEvaluator.getFloatEncodedInt (modelDotted);
}if (this.isSyntaxCheck) return;
var modelIndex = this.viewer.getModelNumberIndex (modelNumber, useModelNumber, true);
this.viewer.setBackgroundModelIndex (modelIndex);
return;
}break;
case 1649412112:
if (this.isSyntaxCheck) return;
this.viewer.setAtomProperty (this.viewer.getModelUndeletedAtomsBitSet (-1), 1649412112, -1, NaN, null, null, null);
switch (this.tokAt (2)) {
case 1073742109:
this.runScript ("#VDW radii for PROBE;{_H}.vdw = 1.0;{_H and connected(_C) and not connected(within(smiles,\'[a]\'))}.vdw = 1.17;{_C}.vdw = 1.75;{_C and connected(3) and connected(_O)}.vdw = 1.65;{_N}.vdw = 1.55;{_O}.vdw = 1.4;{_P}.vdw = 1.8;{_S}.vdw = 1.8;message VDW radii for H, C, N, O, P, and S set according to Word, et al., J. Mol. Biol. (1999) 285, 1711-1733");
return;
}
newTok = 545259555;
case 545259555:
if (this.statementLength > 2) {
sval = (this.statementLength == 3 && org.jmol.constant.EnumVdw.getVdwType (this.parameterAsString (2)) == null ? this.stringSetting (2, false) : this.parameterAsString (2));
if (org.jmol.constant.EnumVdw.getVdwType (sval) == null) this.error (22);
this.setStringProperty (key, sval);
}break;
case 536870918:
if (this.statementLength > 2) {
var pt;
var $var = this.parameterExpressionToken (2);
if ($var.tok == 8) pt = $var.value;
 else {
var ijk = $var.asInt ();
if (ijk < 555) pt =  new org.jmol.util.Point3f ();
 else pt = this.viewer.getSymmetry ().ijkToPoint3f (ijk + 111);
}if (!this.isSyntaxCheck) this.viewer.setDefaultLattice (pt);
}break;
case 545259552:
case 545259545:
if (this.statementLength > 2) {
if ((this.theTok = this.tokAt (2)) == 1073741992 || this.theTok == 1073742116) {
sval = this.parameterAsString (this.checkLast (2));
} else {
sval = this.stringSetting (2, false);
}this.setStringProperty (key, sval);
}break;
case 1632634889:
ival = this.intSetting (2);
if (ival == -2147483648) this.error (22);
if (!this.isSyntaxCheck) this.viewer.setFormalCharges (ival);
return;
case 553648148:
ival = this.intSetting (2);
if (!this.isSyntaxCheck) {
if (ival != -2147483648) this.commandHistoryLevelMax = ival;
this.setIntProperty (key, ival);
}break;
case 545259564:
if (this.statementLength > 2) this.setStringProperty (key, this.stringSetting (2, isJmolSet));
break;
case 545259568:
case 545259558:
if (this.statementLength > 2) this.setUnits (this.stringSetting (2, isJmolSet), tok);
break;
case 545259572:
if (!this.isSyntaxCheck) this.viewer.setPicked (-1);
if (this.statementLength > 2) {
this.setPicking ();
return;
}break;
case 545259574:
if (this.statementLength > 2) {
this.setPickingStyle ();
return;
}break;
case 1716520973:
break;
case 553648168:
ival = this.intSetting (2);
if (!this.isSyntaxCheck && ival != -2147483648) this.setIntProperty (key, this.scriptReportingLevel = ival);
break;
case 536870924:
ival = this.intSetting (2);
if (ival == -2147483648 || ival == 0 || ival == 1) {
justShow = false;
break;
}tok = 553648174;
key = "specularPercent";
this.setIntProperty (key, ival);
break;
case 1650071565:
tok = 553648178;
key = "strandCount";
this.setIntProperty (key, this.intSetting (2));
break;
default:
justShow = false;
}
if (justShow && !showing) return;
var isContextVariable = (!justShow && !isJmolSet && this.getContextVariableAsVariable (key) != null);
if (!justShow && !isContextVariable) {
switch (tok) {
case 1678770178:
newTok = 603979928;
break;
case 1613758470:
newTok = 603979908;
break;
case 1613758476:
newTok = 603979910;
break;
case 1610612739:
newTok = 603979878;
break;
case 1666189314:
newTok = 570425394;
this.setFloatProperty ("solventProbeRadius", this.floatSetting (2));
justShow = true;
break;
case 1610612740:
newTok = 570425390;
break;
case 1613758488:
newTok = 603979948;
break;
case 1766856708:
newTok = 545259545;
break;
case 1611141175:
sval = this.parameterAsString (2).toLowerCase ();
switch ("x;y;z;fps".indexOf (sval + ";")) {
case 0:
newTok = 570425398;
break;
case 2:
newTok = 570425400;
break;
case 4:
newTok = 570425402;
break;
case 6:
newTok = 570425396;
break;
default:
this.errorStr2 (50, "set SPIN ", sval);
}
if (!this.isSyntaxCheck) this.viewer.setSpin (sval, Clazz.floatToInt (this.floatParameter (this.checkLast (3))));
justShow = true;
break;
}
}if (newTok != 0) {
key = org.jmol.script.Token.nameOf (tok = newTok);
} else if (!justShow && !isContextVariable) {
if (key.length == 0 || key.charAt (0) == '_') this.error (56);
var lckey = key.toLowerCase ();
if (lckey.indexOf ("label") == 0 && org.jmol.util.Parser.isOneOf (key.substring (5).toLowerCase (), "front;group;atom;offset;offsetexact;pointer;alignment;toggle;scalereference")) {
if (this.setLabel (key.substring (5))) return;
}if (lckey.endsWith ("callback")) tok = 536870912;
}if (isJmolSet && !org.jmol.script.Token.tokAttr (tok, 536870912)) {
this.iToken = 1;
if (!this.isStateScript) this.errorStr2 (50, "SET", key);
this.warning (51, "SET", key);
}if (!justShow && isJmolSet) {
switch (this.statementLength) {
case 2:
this.setBooleanProperty (key, true);
justShow = true;
break;
case 3:
if (ival != 2147483647) {
this.setIntProperty (key, ival);
justShow = true;
}break;
}
}if (!justShow && !isJmolSet && this.tokAt (2) == 1048587) {
if (!this.isSyntaxCheck) this.viewer.removeUserVariable (key.toLowerCase ());
justShow = true;
}if (!justShow) {
var tok2 = (this.tokAt (1) == 1048577 ? 0 : this.tokAt (2));
var setType = this.statement[0].intValue;
var pt = (tok2 == 269484436 ? 3 : setType == 61 && !key.equals ("return") && tok2 != 269484436 ? 0 : 2);
this.setVariable (pt, 0, key, setType);
if (!isJmolSet) return;
}if (showing) this.viewer.showParameter (key, true, 80);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setZslab", 
($fz = function () {
var pt = null;
if (this.isFloatParameter (2)) {
this.checkLength (3);
this.setIntProperty ("zSlab", Clazz.floatToInt (this.floatParameter (2)));
} else {
if (!this.isCenterParameter (2)) this.error (22);
pt = this.centerParameter (2);
this.checkLength (this.iToken + 1);
}if (!this.isSyntaxCheck) this.viewer.setZslabPoint (pt);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setBondmode", 
($fz = function () {
var bondmodeOr = false;
switch (this.getToken (this.checkLast (2)).tok) {
case 269484128:
break;
case 269484112:
bondmodeOr = true;
break;
default:
this.error (22);
}
this.setBooleanProperty ("bondModeOr", bondmodeOr);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setEcho", 
($fz = function () {
var propertyName = null;
var propertyValue = null;
var id = null;
var echoShapeActive = true;
var pt = 2;
switch (this.getToken (2).tok) {
case 1048588:
id = propertyName = "allOff";
this.checkLength (++pt);
break;
case 1048587:
echoShapeActive = false;
case 1048579:
id = this.parameterAsString (2);
this.checkLength (++pt);
break;
case 1073741996:
case 12289:
case 1073742128:
case 1074790748:
case 1073742019:
case 1073741871:
case 1073741824:
case 4:
case 1074790550:
if (this.theTok == 1074790550) pt++;
id = this.parameterAsString (pt++);
break;
}
if (!this.isSyntaxCheck) {
this.viewer.setEchoStateActive (echoShapeActive);
this.shapeManager.loadShape (29);
if (id != null) this.setShapeProperty (29, propertyName == null ? "target" : propertyName, id);
}if (pt < this.statementLength) {
switch (this.getToken (pt++).tok) {
case 1073741832:
propertyName = "align";
switch (this.getToken (pt).tok) {
case 1073741996:
case 1073742128:
case 12289:
propertyValue = this.parameterAsString (pt++);
break;
default:
this.error (22);
}
break;
case 12289:
case 1073741996:
case 1073742128:
propertyName = "align";
propertyValue = this.parameterAsString (pt - 1);
break;
case 554176526:
propertyName = "%zpos";
propertyValue = Integer.$valueOf (Clazz.floatToInt (this.floatParameter (pt++)));
break;
case 1610625028:
case 3145768:
case 1048589:
propertyName = "hidden";
propertyValue = Boolean.FALSE;
break;
case 12294:
case 3145770:
propertyName = "hidden";
propertyValue = Boolean.TRUE;
break;
case 1095766028:
var modelIndex = (this.isSyntaxCheck ? 0 : this.modelNumberParameter (pt++));
if (modelIndex >= this.viewer.getModelCount ()) this.error (22);
propertyName = "model";
propertyValue = Integer.$valueOf (modelIndex);
break;
case 269484096:
case 1073742195:
propertyName = "xypos";
propertyValue = this.xypParameter (--pt);
if (propertyValue == null) pt--;
 else pt = this.iToken + 1;
break;
case 2:
pt--;
var posx = this.intParameter (pt++);
var namex = "xpos";
if (this.tokAt (pt) == 269484210) {
namex = "%xpos";
pt++;
}propertyName = "ypos";
propertyValue = Integer.$valueOf (this.intParameter (pt++));
if (this.tokAt (pt) == 269484210) {
propertyName = "%ypos";
pt++;
}this.checkLength (pt);
this.setShapeProperty (29, namex, Integer.$valueOf (posx));
break;
case 1048588:
propertyName = "off";
break;
case 1073742138:
propertyName = "scale";
propertyValue = Float.$valueOf (this.floatParameter (pt++));
break;
case 135271429:
propertyName = "script";
propertyValue = this.parameterAsString (pt++);
break;
case 4:
case 1073741979:
if (this.theTok == 1073741979) pt++;
this.checkLength (pt);
this.echo (pt - 1, this.theTok == 1073741979);
return;
default:
if (this.isCenterParameter (pt - 1)) {
propertyName = "xyz";
propertyValue = this.centerParameter (pt - 1);
pt = this.iToken + 1;
break;
}this.error (22);
}
}this.checkLength (pt);
if (!this.isSyntaxCheck && propertyName != null) this.setShapeProperty (29, propertyName, propertyValue);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "intSetting", 
($fz = function (pt) {
if (pt == this.statementLength) return -2147483648;
return this.parameterExpressionToken (pt).asInt ();
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "floatSetting", 
($fz = function (pt) {
if (pt == this.statementLength) return NaN;
return org.jmol.script.ScriptVariable.fValue (this.parameterExpressionToken (pt));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "stringSetting", 
($fz = function (pt, isJmolSet) {
if (isJmolSet && this.statementLength == pt + 1) return this.parameterAsString (pt);
return this.parameterExpressionToken (pt).asString ();
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "setLabel", 
($fz = function (str) {
this.shapeManager.loadShape (5);
var propertyValue = null;
this.setShapeProperty (5, "setDefaults", this.viewer.getNoneSelected ());
while (true) {
if (str.equals ("scalereference")) {
var scaleAngstromsPerPixel = this.floatParameter (2);
if (scaleAngstromsPerPixel >= 5) scaleAngstromsPerPixel = this.viewer.getZoomSetting () / scaleAngstromsPerPixel / this.viewer.getScalePixelsPerAngstrom (false);
propertyValue = Float.$valueOf (scaleAngstromsPerPixel);
break;
}if (str.equals ("offset") || str.equals ("offsetexact")) {
var xOffset = this.intParameterRange (2, -127, 127);
var yOffset = this.intParameterRange (3, -127, 127);
propertyValue = Integer.$valueOf (org.jmol.shape.Object2d.getOffset (xOffset, yOffset));
break;
}if (str.equals ("alignment")) {
switch (this.getToken (2).tok) {
case 1073741996:
case 1073742128:
case 12289:
str = "align";
propertyValue = this.theToken.value;
break;
default:
this.error (22);
}
break;
}if (str.equals ("pointer")) {
var flags = 0;
switch (this.getToken (2).tok) {
case 1048588:
case 1048587:
break;
case 1610616835:
flags |= 2;
case 1048589:
flags |= 1;
break;
default:
this.error (22);
}
propertyValue = Integer.$valueOf (flags);
break;
}if (str.equals ("toggle")) {
this.iToken = 1;
var bs = (this.statementLength == 2 ? null : this.atomExpressionAt (2));
this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.viewer.togglePickingLabel (bs);
return true;
}this.iToken = 1;
var TF = (this.statementLength == 2 || this.getToken (2).tok == 1048589);
if (str.equals ("front") || str.equals ("group")) {
if (!TF && this.tokAt (2) != 1048588) this.error (22);
if (!TF) str = "front";
propertyValue = (TF ? Boolean.TRUE : Boolean.FALSE);
break;
}if (str.equals ("atom")) {
if (!TF && this.tokAt (2) != 1048588) this.error (22);
str = "front";
propertyValue = (TF ? Boolean.FALSE : Boolean.TRUE);
break;
}return false;
}
var bs = (this.iToken + 1 < this.statementLength ? this.atomExpressionAt (++this.iToken) : null);
this.checkLast (this.iToken);
if (this.isSyntaxCheck) return true;
if (bs == null) this.setShapeProperty (5, str, propertyValue);
 else this.setShapePropertyBs (5, str, propertyValue, bs);
return true;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "setMonitor", 
($fz = function () {
var tok = this.tokAt (this.checkLast (2));
switch (tok) {
case 1048589:
case 1048588:
this.setBooleanProperty ("measurementlabels", tok == 1048589);
return;
case 1073741926:
case 2:
case 3:
this.setShapeSizeBs (6, this.getSetAxesTypeMad (2), null);
return;
}
this.setUnits (this.parameterAsString (2), 545259568);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setUnits", 
($fz = function (units, tok) {
if (tok == 545259568 && org.jmol.util.Parser.isOneOf (units.toLowerCase (), "angstroms;au;bohr;nanometers;nm;picometers;pm;vanderwaals;vdw")) {
if (!this.isSyntaxCheck) this.viewer.setUnits (units, true);
} else if (tok == 545259558 && org.jmol.util.Parser.isOneOf (units.toLowerCase (), "kcal;kj")) {
if (!this.isSyntaxCheck) this.viewer.setUnits (units, false);
} else {
this.errorStr2 (50, "set " + org.jmol.script.Token.nameOf (tok), units);
}return true;
}, $fz.isPrivate = true, $fz), "~S,~N");
Clazz.defineMethod (c$, "setSsbond", 
($fz = function () {
var ssbondsBackbone = false;
switch (this.tokAt (this.checkLast (2))) {
case 1115297793:
ssbondsBackbone = true;
break;
case 3145754:
break;
default:
this.error (22);
}
this.setBooleanProperty ("ssbondsBackbone", ssbondsBackbone);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setHbond", 
($fz = function () {
var bool = false;
switch (this.tokAt (this.checkLast (2))) {
case 1115297793:
bool = true;
case 3145754:
this.setBooleanProperty ("hbondsBackbone", bool);
break;
case 1073742150:
bool = true;
case 1073741926:
this.setBooleanProperty ("hbondsSolid", bool);
break;
default:
this.error (22);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setPicking", 
($fz = function () {
if (this.statementLength == 2) {
this.setStringProperty ("picking", "identify");
return;
}if (this.statementLength > 4 || this.tokAt (2) == 4) {
this.setStringProperty ("picking", this.stringSetting (2, false));
return;
}var i = 2;
var type = "SELECT";
switch (this.getToken (2).tok) {
case 135280132:
case 1746538509:
case 1611141175:
if (this.checkLength34 () == 4) {
type = this.parameterAsString (2).toUpperCase ();
if (type.equals ("SPIN")) this.setIntProperty ("pickingSpinRate", this.intParameter (3));
 else i = 3;
}break;
case 12291:
break;
default:
this.checkLength (3);
}
var str = this.parameterAsString (i);
switch (this.getToken (i).tok) {
case 1048589:
case 1073742056:
str = "identify";
break;
case 1048588:
case 1048587:
str = "off";
break;
case 135280132:
str = "atom";
break;
case 1826248715:
str = "label";
break;
case 1678770178:
str = "bond";
break;
case 12291:
this.checkLength (4);
if (this.tokAt (3) != 1678770178) this.error (22);
str = "deleteBond";
break;
}
var mode = ((mode = str.indexOf ("_")) >= 0 ? mode : str.length);
mode = org.jmol.viewer.ActionManager.getPickingMode (str.substring (0, mode));
if (mode < 0) this.errorStr2 (50, "SET PICKING " + type, str);
this.setStringProperty ("picking", str);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setPickingStyle", 
($fz = function () {
if (this.statementLength > 4 || this.tokAt (2) == 4) {
this.setStringProperty ("pickingStyle", this.stringSetting (2, false));
return;
}var i = 2;
var isMeasure = false;
var type = "SELECT";
switch (this.getToken (2).tok) {
case 1746538509:
isMeasure = true;
type = "MEASURE";
case 135280132:
if (this.checkLength34 () == 4) i = 3;
break;
default:
this.checkLength (3);
}
var str = this.parameterAsString (i);
switch (this.getToken (i).tok) {
case 1048587:
case 1048588:
str = (isMeasure ? "measureoff" : "toggle");
break;
case 1048589:
if (isMeasure) str = "measure";
break;
}
if (org.jmol.viewer.ActionManager.getPickingStyle (str) < 0) this.errorStr2 (50, "SET PICKINGSTYLE " + type, str);
this.setStringProperty ("pickingStyle", str);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "timeout", 
($fz = function (index) {
var name = null;
var script = null;
var mSec = 0;
if (this.statementLength == index) {
this.showString (this.viewer.showTimeout (null));
return;
}for (var i = index; i < this.statementLength; i++) switch (this.getToken (i).tok) {
case 1074790550:
name = this.parameterAsString (++i);
if (this.statementLength == 3) {
if (!this.isSyntaxCheck) this.viewer.triggerTimeout (name);
return;
}break;
case 1048588:
break;
case 2:
mSec = this.intParameter (i);
break;
case 3:
mSec = Math.round (this.floatParameter (i) * 1000);
break;
default:
if (name == null) name = this.parameterAsString (i);
 else if (script == null) script = this.parameterAsString (i);
 else this.error (22);
break;
}

if (!this.isSyntaxCheck && !this.viewer.isHeadless ()) this.viewer.setTimeout (name, mSec, script);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "setUserColors", 
($fz = function () {
var v =  new java.util.ArrayList ();
for (var i = 2; i < this.statementLength; i++) {
var argb = this.getArgbParam (i);
v.add (Integer.$valueOf (argb));
i = this.iToken;
}
if (this.isSyntaxCheck) return;
var n = v.size ();
var scale =  Clazz.newIntArray (n, 0);
for (var i = n; --i >= 0; ) scale[i] = v.get (i).intValue ();

this.viewer.setUserScale (scale);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setVariable", 
($fz = function (pt, ptMax, key, setType) {
var bs = null;
var propertyName = "";
var tokProperty = 0;
var isArrayItem = (setType == 91);
var settingProperty = false;
var isExpression = false;
var settingData = (key.startsWith ("property_"));
var t = (settingData ? null : this.getContextVariableAsVariable (key));
var isUserVariable = (t != null);
if (pt > 0 && this.tokAt (pt - 1) == 1048577) {
bs = this.atomExpressionAt (pt - 1);
pt = this.iToken + 1;
isExpression = true;
}if (this.tokAt (pt) == 1048584) {
settingProperty = true;
var token = this.getBitsetPropertySelector (++pt, true);
if (token == null) this.error (22);
if (this.tokAt (++pt) != 269484436) this.error (22);
pt++;
tokProperty = token.intValue;
propertyName = token.value;
}if (isExpression && !settingProperty) this.error (22);
var v = this.parameterExpression (pt, ptMax, key, true, true, -1, isArrayItem, null, null);
var nv = v.size ();
if (nv == 0 || !isArrayItem && nv > 1 || isArrayItem && (nv < 3 || nv % 2 != 1)) this.error (22);
if (this.isSyntaxCheck) return;
var tv = v.get (isArrayItem ? v.size () - 1 : 0);
var needVariable = (!isUserVariable && !isExpression && !settingData && (isArrayItem || settingProperty || !(Clazz.instanceOf (tv.value, String) || tv.tok == 2 || Clazz.instanceOf (tv.value, Integer) || Clazz.instanceOf (tv.value, Float) || Clazz.instanceOf (tv.value, Boolean))));
if (needVariable) {
if (key.startsWith ("_")) this.errorStr (22, key);
t = this.viewer.getOrSetNewVariable (key, true);
isUserVariable = true;
}if (isArrayItem) {
var tnew = (org.jmol.script.ScriptVariable.newVariable (4, "")).set (tv, false);
var nParam = Clazz.doubleToInt (v.size () / 2);
for (var i = 0; i < nParam; i++) {
var isLast = (i + 1 == nParam);
var vv = v.get (i * 2);
if (t.tok == 10) {
t.tok = 6;
t.value =  new java.util.Hashtable ();
}if (t.tok == 6) {
var hkey = vv.asString ();
var tmap = t.value;
if (isLast) {
tmap.put (hkey, tnew);
break;
}t = tmap.get (hkey);
} else {
var ipt = vv.asInt ();
if (t.tok == 7) t = org.jmol.script.ScriptVariable.selectItemVar (t);
switch (t.tok) {
case 7:
var list = t.getList ();
if (ipt > list.size () || isLast) break;
if (ipt <= 0) ipt = list.size () + ipt;
if (--ipt < 0) ipt = 0;
t = list.get (ipt);
continue;
case 11:
case 12:
var dim = (t.tok == 11 ? 3 : 4);
if (nParam == 1 && Math.abs (ipt) >= 1 && Math.abs (ipt) <= dim && tnew.tok == 7 && tnew.getList ().size () == dim) break;
if (nParam == 2) {
var ipt2 = v.get (2).asInt ();
if (ipt2 >= 1 && ipt2 <= dim && (tnew.tok == 2 || tnew.tok == 3)) {
i++;
ipt = ipt * 10 + ipt2;
break;
}}t.toArray ();
--i;
continue;
}
t.setSelectedValue (ipt, tnew);
break;
}}
return;
}if (settingProperty) {
if (!isExpression) {
bs = org.jmol.script.ScriptVariable.getBitSet (t, true);
if (bs == null) this.error (22);
}if (propertyName.startsWith ("property_")) {
this.viewer.setData (propertyName, [propertyName, (tv.tok == 7 ? org.jmol.script.ScriptVariable.flistValue (tv, (tv.value).size () == bs.cardinality () ? bs.cardinality () : this.viewer.getAtomCount ()) : tv.asString ()), org.jmol.util.BitSetUtil.copy (bs),  new Integer (tv.tok == 7 ? 1 : 0)], this.viewer.getAtomCount (), 0, 0, tv.tok == 7 ? 2147483647 : -2147483648, 0);
return;
}this.setBitsetProperty (bs, tokProperty, tv.asInt (), tv.asFloat (), tv);
return;
}if (isUserVariable) {
t.set (tv, false);
return;
}var vv = org.jmol.script.ScriptVariable.oValue (tv);
if (key.startsWith ("property_")) {
if (tv.tok == 7) vv = tv.asString ();
this.viewer.setData (key, [key, "" + vv, org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSet (false)),  new Integer (0)], this.viewer.getAtomCount (), 0, 0, -2147483648, 0);
return;
}if (Clazz.instanceOf (vv, Boolean)) {
this.setBooleanProperty (key, (vv).booleanValue ());
} else if (Clazz.instanceOf (vv, Integer)) {
this.setIntProperty (key, (vv).intValue ());
} else if (Clazz.instanceOf (vv, Float)) {
this.setFloatProperty (key, (vv).floatValue ());
} else if (Clazz.instanceOf (vv, String)) {
this.setStringProperty (key, vv);
} else if (Clazz.instanceOf (vv, org.jmol.modelset.Bond.BondSet)) {
this.setStringProperty (key, org.jmol.util.Escape.escapeBs (vv, false));
} else if (Clazz.instanceOf (vv, org.jmol.util.BitSet) || Clazz.instanceOf (vv, org.jmol.util.Point3f) || Clazz.instanceOf (vv, org.jmol.util.Point4f)) {
this.setStringProperty (key, org.jmol.util.Escape.escape (vv));
} else {
org.jmol.util.Logger.error ("ERROR -- return from propertyExpression was " + vv);
}}, $fz.isPrivate = true, $fz), "~N,~N,~S,~N");
Clazz.defineMethod (c$, "axes", 
($fz = function (index) {
var tickInfo = this.checkTicks (index, true, true, false);
index = this.iToken + 1;
var tok = this.tokAt (index);
var type = this.optParameterAsString (index).toLowerCase ();
if (this.statementLength == index + 1 && org.jmol.util.Parser.isOneOf (type, "window;unitcell;molecular")) {
this.setBooleanProperty ("axes" + type, true);
return;
}switch (tok) {
case 12289:
var center = this.centerParameter (index + 1);
this.setShapeProperty (30, "origin", center);
this.checkLast (this.iToken);
return;
case 1073742138:
this.setFloatProperty ("axesScale", this.floatParameter (this.checkLast (++index)));
return;
case 1826248715:
switch (tok = this.tokAt (index + 1)) {
case 1048588:
case 1048589:
this.checkLength (index + 2);
this.setShapeProperty (30, "labels" + (tok == 1048589 ? "On" : "Off"), null);
return;
}
if (this.statementLength == index + 7) {
this.setShapeProperty (30, "labels", [this.parameterAsString (++index), this.parameterAsString (++index), this.parameterAsString (++index), this.parameterAsString (++index), this.parameterAsString (++index), this.parameterAsString (++index)]);
} else {
this.checkLength (index + 4);
this.setShapeProperty (30, "labels", [this.parameterAsString (++index), this.parameterAsString (++index), this.parameterAsString (++index)]);
}return;
}
if (type.equals ("position")) {
var xyp;
if (this.tokAt (++index) == 1048588) {
xyp =  new org.jmol.util.Point3f ();
} else {
xyp = this.xypParameter (index);
if (xyp == null) this.error (22);
index = this.iToken;
}this.setShapeProperty (30, "position", xyp);
return;
}var mad = this.getSetAxesTypeMad (index);
if (this.isSyntaxCheck) return;
this.setObjectMad (30, "axes", mad);
if (tickInfo != null) this.setShapeProperty (30, "tickInfo", tickInfo);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "boundbox", 
($fz = function (index) {
var tickInfo = this.checkTicks (index, false, true, false);
index = this.iToken + 1;
var scale = 1;
if (this.tokAt (index) == 1073742138) {
scale = this.floatParameter (++index);
if (!this.isSyntaxCheck && scale == 0) this.error (22);
index++;
if (index == this.statementLength) {
if (!this.isSyntaxCheck) this.viewer.setBoundBox (null, null, true, scale);
return;
}}var byCorner = (this.tokAt (index) == 1073741902);
if (byCorner) index++;
if (this.isCenterParameter (index)) {
this.expressionResult = null;
var index0 = index;
var pt1 = this.centerParameter (index);
index = this.iToken + 1;
if (byCorner || this.isCenterParameter (index)) {
var pt2 = (byCorner ? this.centerParameter (index) : this.getPoint3f (index, true));
index = this.iToken + 1;
if (!this.isSyntaxCheck) this.viewer.setBoundBox (pt1, pt2, byCorner, scale);
} else if (this.expressionResult != null && Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet)) {
if (!this.isSyntaxCheck) this.viewer.calcBoundBoxDimensions (this.expressionResult, scale);
} else if (this.expressionResult == null && this.tokAt (index0) == 1048583) {
if (this.isSyntaxCheck) return;
var bbox = this.getObjectBoundingBox (this.objectNameParameter (++index0));
if (bbox == null) this.error (22);
this.viewer.setBoundBox (bbox[0], bbox[1], true, scale);
index = this.iToken + 1;
} else {
this.error (22);
}if (index == this.statementLength) return;
}var mad = this.getSetAxesTypeMad (index);
if (this.isSyntaxCheck) return;
if (tickInfo != null) this.setShapeProperty (31, "tickInfo", tickInfo);
this.setObjectMad (31, "boundbox", mad);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "checkTicks", 
($fz = function (index, allowUnitCell, allowScale, allowFirst) {
this.iToken = index - 1;
if (this.tokAt (index) != 1073742164) return null;
var tickInfo;
var str = " ";
switch (this.tokAt (index + 1)) {
case 1112541205:
case 1112541206:
case 1112541207:
str = this.parameterAsString (++index).toLowerCase ();
break;
case 1073741824:
this.error (22);
}
if (this.tokAt (++index) == 1048587) {
tickInfo =  new org.jmol.modelset.TickInfo (null);
tickInfo.type = str;
this.iToken = index;
return tickInfo;
}tickInfo =  new org.jmol.modelset.TickInfo (this.getPointOrPlane (index, false, true, false, false, 3, 3));
if (this.coordinatesAreFractional || this.tokAt (this.iToken + 1) == 1614417948) {
tickInfo.scale = org.jmol.util.Point3f.new3 (NaN, NaN, NaN);
allowScale = false;
}if (this.tokAt (this.iToken + 1) == 1614417948) this.iToken++;
tickInfo.type = str;
if (this.tokAt (this.iToken + 1) == 1288701960) tickInfo.tickLabelFormats = this.stringParameterSet (this.iToken + 2);
if (!allowScale) return tickInfo;
if (this.tokAt (this.iToken + 1) == 1073742138) {
if (this.isFloatParameter (this.iToken + 2)) {
var f = this.floatParameter (this.iToken + 2);
tickInfo.scale = org.jmol.util.Point3f.new3 (f, f, f);
} else {
tickInfo.scale = this.getPoint3f (this.iToken + 2, true);
}}if (allowFirst) if (this.tokAt (this.iToken + 1) == 1073741942) tickInfo.first = this.floatParameter (this.iToken + 2);
return tickInfo;
}, $fz.isPrivate = true, $fz), "~N,~B,~B,~B");
Clazz.defineMethod (c$, "unitcell", 
($fz = function (index) {
var icell = 2147483647;
var mad = 2147483647;
var pt = null;
var tickInfo = this.checkTicks (index, true, false, false);
index = this.iToken;
var id = null;
var points = null;
switch (this.tokAt (index + 1)) {
case 4:
id = this.objectNameParameter (++index);
break;
case 1048583:
index++;
id = this.objectNameParameter (++index);
break;
default:
if (this.isArrayParameter (index + 1)) {
points = this.getPointArray (++index, 4);
index = this.iToken;
} else if (this.statementLength == index + 2) {
if (this.getToken (index + 1).tok == 2 && this.intParameter (index + 1) >= 111) icell = this.intParameter (++index);
} else if (this.statementLength > index + 1) {
pt = this.getPointOrPlane (++index, false, true, false, true, 3, 3);
index = this.iToken;
}}
mad = this.getSetAxesTypeMad (++index);
this.checkLast (this.iToken);
if (this.isSyntaxCheck) return;
if (icell != 2147483647) this.viewer.setCurrentUnitCellOffset (icell);
 else if (id != null) this.viewer.setCurrentUnitCell (id);
 else if (points != null) this.viewer.setCurrentUnitCellPts (points);
this.setObjectMad (32, "unitCell", mad);
if (pt != null) this.viewer.setCurrentUnitCellOffsetPt (pt);
if (tickInfo != null) this.setShapeProperty (32, "tickInfo", tickInfo);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "frank", 
($fz = function (index) {
this.setBooleanProperty ("frank", this.booleanParameter (index));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "selectionHalo", 
($fz = function (pt) {
var showHalo = false;
switch (pt == this.statementLength ? 1048589 : this.getToken (pt).tok) {
case 1048589:
case 1114638350:
showHalo = true;
case 1048588:
case 1048587:
case 1073742056:
this.setBooleanProperty ("selectionHalos", showHalo);
break;
default:
this.error (22);
}
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "save", 
($fz = function () {
if (this.statementLength > 1) {
var saveName = this.optParameterAsString (2);
switch (this.tokAt (1)) {
case 1073742132:
if (!this.isSyntaxCheck) this.viewer.saveOrientation (saveName);
return;
case 1073742077:
if (!this.isSyntaxCheck) this.viewer.saveOrientation (saveName);
return;
case 1678770178:
if (!this.isSyntaxCheck) this.viewer.saveBonds (saveName);
return;
case 1073742158:
if (!this.isSyntaxCheck) this.viewer.saveState (saveName);
return;
case 1641025539:
if (!this.isSyntaxCheck) this.viewer.saveStructure (saveName);
return;
case 1048582:
if (!this.isSyntaxCheck) this.viewer.saveCoordinates (saveName, this.viewer.getSelectionSet (false));
return;
case 1073742140:
if (!this.isSyntaxCheck) this.viewer.saveSelection (saveName);
return;
}
}this.errorStr2 (53, "SAVE", "bonds? coordinates? orientation? selection? state? structure?");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "restore", 
($fz = function () {
if (this.statementLength > 1) {
var saveName = this.optParameterAsString (2);
if (this.getToken (1).tok != 1073742077) this.checkLength23 ();
var timeSeconds;
switch (this.getToken (1).tok) {
case 1073742132:
timeSeconds = (this.statementLength > 3 ? this.floatParameter (3) : 0);
if (timeSeconds < 0) this.error (22);
if (!this.isSyntaxCheck) this.viewer.restoreRotation (saveName, timeSeconds);
return;
case 1073742077:
timeSeconds = (this.statementLength > 3 ? this.floatParameter (3) : 0);
if (timeSeconds < 0) this.error (22);
if (!this.isSyntaxCheck) this.viewer.restoreOrientation (saveName, timeSeconds);
return;
case 1678770178:
if (!this.isSyntaxCheck) this.viewer.restoreBonds (saveName);
return;
case 1048582:
if (this.isSyntaxCheck) return;
var script = this.viewer.getSavedCoordinates (saveName);
if (script == null) this.error (22);
this.runScript (script);
this.viewer.checkCoordinatesChanged ();
return;
case 1073742158:
if (this.isSyntaxCheck) return;
var state = this.viewer.getSavedState (saveName);
if (state == null) this.error (22);
this.runScript (state);
return;
case 1641025539:
if (this.isSyntaxCheck) return;
var shape = this.viewer.getSavedStructure (saveName);
if (shape == null) this.error (22);
this.runScript (shape);
return;
case 1073742140:
if (!this.isSyntaxCheck) this.viewer.restoreSelection (saveName);
return;
}
}this.errorStr2 (53, "RESTORE", "bonds? coords? orientation? selection? state? structure?");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "write", 
function (args) {
var pt = 0;
var pt0 = 0;
var isCommand;
var isShow;
if (args == null) {
args = this.statement;
pt = pt0 = 1;
isCommand = true;
isShow = (this.viewer.isApplet () && !this.viewer.isSignedApplet () || !this.viewer.isRestricted (org.jmol.viewer.Viewer.ACCESS.ALL) || this.viewer.getPathForAllFiles ().length > 0);
} else {
isCommand = false;
isShow = true;
}var argCount = (isCommand ? this.statementLength : args.length);
var len = 0;
var nVibes = 0;
var width = -1;
var height = -1;
var quality = -2147483648;
var driverList = this.viewer.getExportDriverList ();
var sceneType = "PNGJ";
var data = null;
var type2 = "";
var fileName = null;
var localPath = null;
var remotePath = null;
var val = null;
var msg = null;
var fullPath =  new Array (1);
var isCoord = false;
var isExport = false;
var isImage = false;
var bsFrames = null;
var scripts = null;
var type = "SPT";
var tok = (isCommand && args.length == 1 ? 1073741884 : org.jmol.script.ScriptEvaluator.tokAtArray (pt, args));
switch (tok) {
case 0:
break;
case 135271429:
if (this.isArrayParameter (pt + 1)) {
scripts = this.stringParameterSet (++pt);
localPath = ".";
remotePath = ".";
pt0 = pt = this.iToken + 1;
tok = this.tokAt (pt);
}break;
default:
type = org.jmol.script.ScriptVariable.sValue (this.tokenAt (pt, args)).toUpperCase ();
}
switch (tok) {
case 0:
break;
case 135270417:
case 1052714:
case 1716520973:
msg = this.plot (args);
if (!isCommand) return msg;
break;
case 1073741983:
type = "INLINE";
data = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args));
pt++;
break;
case 1073742102:
type = "PGRP";
pt++;
type2 = org.jmol.script.ScriptVariable.sValue (this.tokenAt (pt, args)).toLowerCase ();
if (type2.equals ("draw")) pt++;
break;
case 1048582:
pt++;
isCoord = true;
break;
case 1073742158:
case 135271429:
val = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args)).toLowerCase ();
while (val.equals ("localpath") || val.equals ("remotepath")) {
if (val.equals ("localpath")) localPath = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args));
 else remotePath = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args));
val = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args)).toLowerCase ();
}
type = "SPT";
break;
case 1229984263:
case 135368713:
case 1610616855:
case 135180:
case 1073742015:
case 1073742018:
case 1183762:
case 135188:
pt++;
break;
case 1073741992:
type = "ZIPALL";
pt++;
break;
case 36868:
type = "VAR";
pt += 2;
break;
case 4115:
case 1073741824:
case 1073741979:
case 1073742139:
case 4:
case 4166:
switch (tok) {
case 1073741979:
pt++;
break;
case 4166:
nVibes = this.intParameterRange (++pt, 1, 10);
if (!this.isSyntaxCheck) {
this.viewer.setVibrationOff ();
this.delayMillis (100);
}pt++;
break;
case 4115:
var bsAtoms;
if (pt + 1 < argCount && args[++pt].tok == 1048577 || args[pt].tok == 10) {
bsAtoms = this.atomExpression (args, pt, 0, true, false, true, true);
pt = this.iToken + 1;
} else {
bsAtoms = this.viewer.getModelUndeletedAtomsBitSet (-1);
}if (!this.isSyntaxCheck) bsFrames = this.viewer.getModelBitSet (bsAtoms, true);
break;
case 1073742139:
val = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args)).toUpperCase ();
if (org.jmol.util.Parser.isOneOf (val, "PNG;PNGJ")) {
sceneType = val;
pt++;
}break;
default:
case 4:
var t = org.jmol.script.Token.getTokenFromName (org.jmol.script.ScriptVariable.sValue (args[pt]).toLowerCase ());
if (t != null) {
tok = t.tok;
type = org.jmol.script.ScriptVariable.sValue (t).toUpperCase ();
}if (org.jmol.util.Parser.isOneOf (type, driverList.toUpperCase ())) {
pt++;
type = type.substring (0, 1).toUpperCase () + type.substring (1).toLowerCase ();
isExport = true;
if (isCommand) fileName = "Jmol." + type;
} else if (type.equals ("ZIP")) {
pt++;
} else if (type.equals ("ZIPALL")) {
pt++;
} else {
type = "(image)";
}break;
}
if (org.jmol.script.ScriptEvaluator.tokAtArray (pt, args) == 2) {
width = org.jmol.script.ScriptVariable.iValue (this.tokenAt (pt++, args));
height = org.jmol.script.ScriptVariable.iValue (this.tokenAt (pt++, args));
}break;
}
if (msg == null) {
val = org.jmol.script.ScriptVariable.sValue (this.tokenAt (pt, args));
if (val.equalsIgnoreCase ("clipboard")) {
if (this.isSyntaxCheck) return "";
} else if (org.jmol.util.Parser.isOneOf (val.toLowerCase (), "png;pngj;pngt;jpg;jpeg;jpg64;jpeg64") && org.jmol.script.ScriptEvaluator.tokAtArray (pt + 1, args) == 2) {
quality = org.jmol.script.ScriptVariable.iValue (this.tokenAt (++pt, args));
} else if (org.jmol.util.Parser.isOneOf (val.toLowerCase (), "xyz;xyzrn;xyzvib;mol;sdf;v2000;v3000;cd;pdb;pqr;cml")) {
type = val.toUpperCase ();
if (pt + 1 == argCount) pt++;
}if (type.equals ("(image)") && org.jmol.util.Parser.isOneOf (val.toUpperCase (), "GIF;JPG;JPG64;JPEG;JPEG64;PNG;PNGJ;PNGT;PPM")) {
type = val.toUpperCase ();
pt++;
}if (pt + 2 == argCount) {
data = org.jmol.script.ScriptVariable.sValue (this.tokenAt (++pt, args));
if (data.length > 0 && data.charAt (0) != '.') type = val.toUpperCase ();
}switch (org.jmol.script.ScriptEvaluator.tokAtArray (pt, args)) {
case 0:
isShow = true;
break;
case 1073741884:
break;
case 1073741824:
case 4:
fileName = org.jmol.script.ScriptVariable.sValue (this.tokenAt (pt, args));
if (pt == argCount - 3 && org.jmol.script.ScriptEvaluator.tokAtArray (pt + 1, args) == 1048584) {
fileName += "." + org.jmol.script.ScriptVariable.sValue (this.tokenAt (pt + 2, args));
}if (type !== "VAR" && pt == pt0) type = "IMAGE";
 else if (fileName.length > 0 && fileName.charAt (0) == '.' && (pt == pt0 + 1 || pt == pt0 + 2)) {
fileName = org.jmol.script.ScriptVariable.sValue (this.tokenAt (pt - 1, args)) + fileName;
if (type !== "VAR" && pt == pt0 + 1) type = "IMAGE";
}if (fileName.equalsIgnoreCase ("clipboard") || !this.viewer.isRestricted (org.jmol.viewer.Viewer.ACCESS.ALL)) fileName = null;
break;
default:
this.error (22);
}
if (type.equals ("IMAGE") || type.equals ("FRAME") || type.equals ("VIBRATION")) {
type = (fileName != null && fileName.indexOf (".") >= 0 ? fileName.substring (fileName.lastIndexOf (".") + 1).toUpperCase () : "JPG");
}if (type.equals ("MNU")) {
type = "MENU";
} else if (type.equals ("WRL") || type.equals ("VRML")) {
type = "Vrml";
isExport = true;
} else if (type.equals ("X3D")) {
type = "X3d";
isExport = true;
} else if (type.equals ("IDTF")) {
type = "Idtf";
isExport = true;
} else if (type.equals ("MA")) {
type = "Maya";
isExport = true;
} else if (type.equals ("JS")) {
type = "Js";
isExport = true;
} else if (type.equals ("OBJ")) {
type = "Obj";
isExport = true;
} else if (type.equals ("JVXL")) {
type = "ISOSURFACE";
} else if (type.equals ("XJVXL")) {
type = "ISOSURFACE";
} else if (type.equals ("JMOL")) {
type = "ZIPALL";
} else if (type.equals ("HIS")) {
type = "HISTORY";
}if (type.equals ("COORD")) type = (fileName != null && fileName.indexOf (".") >= 0 ? fileName.substring (fileName.lastIndexOf (".") + 1).toUpperCase () : "XYZ");
isImage = org.jmol.util.Parser.isOneOf (type, "GIF;JPEG64;JPEG;JPG64;JPG;PPM;PNG;PNGJ;PNGT;SCENE");
if (scripts != null) {
if (type.equals ("PNG")) type = "PNGJ";
if (!type.equals ("PNGJ") && !type.equals ("ZIPALL")) this.error (22);
}if (isImage && isShow) type = "JPG64";
 else if (!isImage && !isExport && !org.jmol.util.Parser.isOneOf (type, "SCENE;JMOL;ZIP;ZIPALL;SPT;HISTORY;MO;ISOSURFACE;MESH;PMESH;VAR;FILE;FUNCTION;CD;CML;XYZ;XYZRN;XYZVIB;MENU;MOL;PDB;PGRP;PQR;QUAT;RAMA;SDF;V2000;V3000;INLINE")) this.errorStr2 (54, "COORDS|FILE|FUNCTIONS|HISTORY|IMAGE|INLINE|ISOSURFACE|JMOL|MENU|MO|POINTGROUP|QUATERNION [w,x,y,z] [derivative]|RAMACHANDRAN|SPT|STATE|VAR x|ZIP|ZIPALL  CLIPBOARD", "CML|GIF|JPG|JPG64|JMOL|JVXL|MESH|MOL|PDB|PMESH|PNG|PNGJ|PNGT|PPM|PQR|SDF|V2000|V3000|SPT|XJVXL|XYZ|XYZRN|XYZVIB|ZIP" + driverList.toUpperCase ().$replace (';', '|'));
if (this.isSyntaxCheck) return "";
var bytes = null;
var doDefer = false;
if (data == null || isExport) {
data = type.intern ();
if (isExport) {
fullPath[0] = fileName;
data = this.viewer.generateOutput (data, isCommand || fileName != null ? fullPath : null, width, height);
if (data == null || data.length == 0) return "";
if (!isCommand) return data;
if ((type.equals ("Povray") || type.equals ("Idtf")) && fullPath[0] != null) {
var ext = (type.equals ("Idtf") ? ".tex" : ".ini");
fileName = fullPath[0] + ext;
msg = this.viewer.createImageSet (fileName, ext, data, null, -2147483648, 0, 0, null, 0, fullPath);
if (type.equals ("Idtf")) data = data.substring (0, data.indexOf ("\\begin{comment}"));
data = "Created " + fullPath[0] + ":\n\n" + data;
} else {
msg = data;
}if (msg != null) {
if (!msg.startsWith ("OK")) this.evalError (msg, null);
this.scriptStatusOrBuffer (data);
}return "";
} else if (data === "MENU") {
data = this.viewer.getMenu ("");
} else if (data === "PGRP") {
data = this.viewer.getPointGroupAsString (type2.equals ("draw"), null, 0, 1.0);
} else if (data === "PDB" || data === "PQR") {
if (isShow) {
data = this.viewer.getPdbData (null, null);
} else {
doDefer = true;
}} else if (data === "FILE") {
if (isShow) data = this.viewer.getCurrentFileAsString ();
 else doDefer = true;
if ("?".equals (fileName)) fileName = "?Jmol." + this.viewer.getParameter ("_fileType");
} else if ((data === "SDF" || data === "MOL" || data === "V2000" || data === "V3000" || data === "CD") && isCoord) {
data = this.viewer.getModelExtract ("selected", true, data);
if (data.startsWith ("ERROR:")) bytes = data;
} else if (data === "XYZ" || data === "XYZRN" || data === "XYZVIB" || data === "MOL" || data === "SDF" || data === "V2000" || data === "V3000" || data === "CML" || data === "CD") {
data = this.viewer.getData ("selected", data);
if (data.startsWith ("ERROR:")) bytes = data;
} else if (data === "FUNCTION") {
data = this.viewer.getFunctionCalls (null);
type = "TXT";
} else if (data === "VAR") {
data = (this.getParameter (org.jmol.script.ScriptVariable.sValue (this.tokenAt (isCommand ? 2 : 1, args)), 1073742190)).asString ();
type = "TXT";
} else if (data === "SPT") {
if (isCoord) {
var tainted = this.viewer.getTaintedAtoms (2);
this.viewer.setAtomCoordRelative (org.jmol.util.Point3f.new3 (0, 0, 0), null);
data = this.viewer.getProperty ("string", "stateInfo", null);
this.viewer.setTaintedAtoms (tainted, 2);
} else {
data = this.viewer.getProperty ("string", "stateInfo", null);
if (localPath != null || remotePath != null) data = org.jmol.viewer.FileManager.setScriptFileReferences (data, localPath, remotePath, null);
}} else if (data === "ZIP" || data === "ZIPALL") {
data = this.viewer.getProperty ("string", "stateInfo", null);
bytes = this.viewer.createZip (fileName, type, data, scripts);
} else if (data === "HISTORY") {
data = this.viewer.getSetHistory (2147483647);
type = "SPT";
} else if (data === "MO") {
data = this.getMoJvxl (2147483647);
type = "XJVXL";
} else if (data === "PMESH") {
if ((data = this.getIsosurfaceJvxl (true, 27)) == null) this.error (31);
type = "XJVXL";
} else if (data === "ISOSURFACE" || data === "MESH") {
if ((data = this.getIsosurfaceJvxl (data === "MESH", 23)) == null) this.error (31);
type = (data.indexOf ("<?xml") >= 0 ? "XJVXL" : "JVXL");
if (!isShow) this.showString (this.getShapeProperty (23, "jvxlFileInfo"));
} else {
len = -1;
if (quality < 0) quality = -1;
}if (data == null && !doDefer) data = "";
if (len == 0 && !doDefer) len = (bytes == null ? data.length : Clazz.instanceOf (bytes, String) ? (bytes).length : (bytes).length);
if (isImage) {
this.refresh ();
if (width < 0) width = this.viewer.getScreenWidth ();
if (height < 0) height = this.viewer.getScreenHeight ();
}}if (!isCommand) return data;
if (isShow) {
this.showStringPrint (data, true);
return "";
}if (bytes != null && Clazz.instanceOf (bytes, String)) {
this.scriptStatusOrBuffer (bytes);
return bytes;
}if (type.equals ("SCENE")) bytes = sceneType;
 else if (bytes == null && (!isImage || fileName != null)) bytes = data;
if (doDefer) msg = this.viewer.streamFileData (fileName, type, type2, 0, null);
 else msg = this.viewer.createImageSet (fileName, type, bytes, scripts, quality, width, height, bsFrames, nVibes, fullPath);
}if (!this.isSyntaxCheck && msg != null) {
if (!msg.startsWith ("OK")) this.evalError (msg, null);
this.scriptStatusOrBuffer (msg + (isImage ? "; width=" + width + "; height=" + height : ""));
return msg;
}return "";
}, "~A");
Clazz.defineMethod (c$, "show", 
($fz = function () {
var value = null;
var str = this.parameterAsString (1);
var msg = null;
var name = null;
var len = 2;
var token = this.getToken (1);
var tok = (Clazz.instanceOf (token, org.jmol.script.ScriptVariable) ? 0 : token.tok);
if (tok == 4) {
token = org.jmol.script.Token.getTokenFromName (str.toLowerCase ());
if (token != null) tok = token.tok;
}if (tok != 1297090050 && tok != 1073742158) this.checkLength (-3);
if (this.statementLength == 2 && str.indexOf ("?") >= 0) {
this.showString (this.viewer.getAllSettings (str.substring (0, str.indexOf ("?"))));
return;
}switch (tok) {
case 0:
msg = (this.theToken).escape ();
break;
case 135270422:
msg = org.jmol.util.Escape.escape (this.viewer.cacheList ());
break;
case 1073741915:
this.checkLength (2);
if (!this.isSyntaxCheck) msg = this.viewer.calculateStructures (null, true, false);
break;
case 545259570:
this.checkLength (2);
if (!this.isSyntaxCheck) msg = this.viewer.getPathForAllFiles ();
break;
case 1073742038:
case 135267336:
case 1073741929:
case 1073741879:
this.checkLength (tok == 1073741879 ? 3 : 2);
if (this.isSyntaxCheck) return;
msg = this.viewer.getSmiles (0, 0, this.viewer.getSelectionSet (false), false, true, false, false);
switch (tok) {
case 1073741929:
if (msg.length > 0) {
this.viewer.show2D (msg);
return;
}msg = "Could not show drawing -- Either insufficient atoms are selected or the model is a PDB file.";
break;
case 1073742038:
if (msg.length > 0) {
this.viewer.showNMR (msg);
return;
}msg = "Could not show nmr -- Either insufficient atoms are selected or the model is a PDB file.";
break;
case 1073741879:
len = 3;
var info = null;
if (msg.length > 0) {
var type = '/';
switch (this.getToken (2).tok) {
case 1073741977:
type = 'I';
break;
case 1073741978:
type = 'K';
break;
case 1073742035:
type = 'N';
break;
default:
info = this.parameterAsString (2);
}
msg = this.viewer.getChemicalInfo (msg, type, info);
if (msg.indexOf ("FileNotFound") >= 0) msg = "?";
} else {
msg = "Could not show name -- Either insufficient atoms are selected or the model is a PDB file.";
}}
break;
case 1297090050:
if (this.statementLength > 3) {
var pt1 = this.centerParameter (2);
var pt2 = this.centerParameter (++this.iToken);
if (!this.isSyntaxCheck) msg = this.viewer.getSymmetryOperation (null, 0, pt1, pt2, false);
len = ++this.iToken;
} else {
var iop = (this.checkLength23 () == 2 ? 0 : this.intParameter (2));
if (!this.isSyntaxCheck) msg = this.viewer.getSymmetryOperation (null, iop, null, null, false);
len = -3;
}break;
case 1649412112:
var vdwType = null;
if (this.statementLength > 2) {
vdwType = org.jmol.constant.EnumVdw.getVdwType (this.parameterAsString (2));
if (vdwType == null) this.error (22);
}if (!this.isSyntaxCheck) this.showString (this.viewer.getDefaultVdwTypeNameOrData (0, vdwType));
return;
case 135368713:
this.checkLength23 ();
if (!this.isSyntaxCheck) this.showString (this.viewer.getFunctionCalls (this.optParameterAsString (2)));
return;
case 1085443:
this.checkLength (2);
if (!this.isSyntaxCheck) this.showString (this.viewer.getAllSettings (null));
return;
case 1074790760:
if ((len = this.statementLength) == 2) {
if (!this.isSyntaxCheck) this.viewer.showUrl (this.getFullPathName ());
return;
}name = this.parameterAsString (2);
if (!this.isSyntaxCheck) this.viewer.showUrl (name);
return;
case 1766856708:
str = "defaultColorScheme";
break;
case 1610612740:
str = "scaleAngstromsPerInch";
break;
case 135270417:
case 1052714:
if (this.isSyntaxCheck) return;
var modelIndex = this.viewer.getCurrentModelIndex ();
if (modelIndex < 0) this.errorStr (30, "show " + this.theToken.value);
msg = this.plot (this.statement);
len = this.statementLength;
break;
case 1113200654:
if (!this.isSyntaxCheck) msg = this.getContext (false);
break;
case 1073741888:
name = this.optParameterAsString (2);
if (name.length > 0) len = 3;
if (!this.isSyntaxCheck) value = this.viewer.getColorSchemeList (name);
break;
case 1073742192:
if (!this.isSyntaxCheck) msg = this.viewer.getVariableList () + this.getContext (true);
break;
case 536870926:
if (!this.isSyntaxCheck) msg = this.viewer.getTrajectoryInfo ();
break;
case 553648148:
value = "" + this.commandHistoryLevelMax;
break;
case 553648150:
value = "" + org.jmol.util.Logger.getLogLevel ();
break;
case 603979824:
value = "" + this.viewer.getDebugScript ();
break;
case 553648178:
msg = "set strandCountForStrands " + this.viewer.getStrandCount (12) + "; set strandCountForMeshRibbon " + this.viewer.getStrandCount (13);
break;
case 536875070:
msg = this.viewer.showTimeout ((len = this.statementLength) == 2 ? null : this.parameterAsString (2));
break;
case 536870918:
value = org.jmol.util.Escape.escapePt (this.viewer.getDefaultLattice ());
break;
case 4126:
if (!this.isSyntaxCheck) msg = this.viewer.getMinimizationInfo ();
break;
case 1611272194:
switch (this.viewer.getAxesMode ()) {
case org.jmol.constant.EnumAxesMode.UNITCELL:
msg = "set axesUnitcell";
break;
case org.jmol.constant.EnumAxesMode.BOUNDBOX:
msg = "set axesWindow";
break;
default:
msg = "set axesMolecular";
}
break;
case 1610612737:
msg = "set bondMode " + (this.viewer.getBondSelectionModeOr () ? "OR" : "AND");
break;
case 1650071565:
if (!this.isSyntaxCheck) msg = "set strandCountForStrands " + this.viewer.getStrandCount (12) + "; set strandCountForMeshRibbon " + this.viewer.getStrandCount (13);
break;
case 1612189718:
msg = "set hbondsBackbone " + this.viewer.getHbondsBackbone () + ";set hbondsSolid " + this.viewer.getHbondsSolid ();
break;
case 1611141175:
if (!this.isSyntaxCheck) msg = this.viewer.getSpinState ();
break;
case 1611141176:
msg = "set ssbondsBackbone " + this.viewer.getSsbondsBackbone ();
break;
case 1610625028:
case 1611141171:
msg = "selectionHalos " + (this.viewer.getSelectionHaloEnabled (false) ? "ON" : "OFF");
break;
case 1613758470:
msg = "set selectHetero " + this.viewer.getRasmolSetting (tok);
break;
case 1073741828:
msg = org.jmol.util.Escape.escapeAP (this.viewer.getAdditionalHydrogens (null, true, true, null));
break;
case 1613758476:
msg = "set selectHydrogens " + this.viewer.getRasmolSetting (tok);
break;
case 553648130:
case 553648142:
case 536870924:
case 553648176:
case 553648172:
case 1073741995:
if (!this.isSyntaxCheck) msg = this.viewer.getSpecularState ();
break;
case 4146:
if (!this.isSyntaxCheck) msg = this.viewer.listSavedStates ();
break;
case 1614417948:
if (!this.isSyntaxCheck) msg = this.viewer.getUnitCellInfoText ();
break;
case 1048582:
if ((len = this.statementLength) == 2) {
if (!this.isSyntaxCheck) msg = this.viewer.getCoordinateState (this.viewer.getSelectionSet (false));
break;
}var nameC = this.parameterAsString (2);
if (!this.isSyntaxCheck) msg = this.viewer.getSavedCoordinates (nameC);
break;
case 1073742158:
if ((len = this.statementLength) == 2) {
if (!this.isSyntaxCheck) msg = this.viewer.getStateInfo ();
break;
}name = this.parameterAsString (2);
if (name.equals ("/") && (len = this.statementLength) == 4) {
name = this.parameterAsString (3).toLowerCase ();
if (!this.isSyntaxCheck) {
var info = org.jmol.util.TextFormat.split (this.viewer.getStateInfo (), '\n');
var sb =  new org.jmol.util.StringXBuilder ();
for (var i = 0; i < info.length; i++) if (info[i].toLowerCase ().indexOf (name) >= 0) sb.append (info[i]).appendC ('\n');

msg = sb.toString ();
}break;
} else if (this.tokAt (2) == 1229984263 && (len = this.statementLength) == 4) {
if (!this.isSyntaxCheck) msg = this.viewer.getEmbeddedFileState (this.parameterAsString (3));
break;
}len = 3;
if (!this.isSyntaxCheck) msg = this.viewer.getSavedState (name);
break;
case 1641025539:
if ((len = this.statementLength) == 2) {
if (!this.isSyntaxCheck) msg = this.viewer.getProteinStructureState ();
break;
}var shape = this.parameterAsString (2);
if (!this.isSyntaxCheck) msg = this.viewer.getSavedStructure (shape);
break;
case 135270407:
var type = ((len = this.statementLength) == 3 ? this.parameterAsString (2) : null);
if (!this.isSyntaxCheck) {
var data = (type == null ? this.$data : this.viewer.getData (type));
msg = (data == null ? "no data" : org.jmol.util.Escape.encapsulateData (data[0], data[1], (data[3]).intValue ()));
}break;
case 1073742152:
var info = null;
if ((len = this.statementLength) == 2) {
if (!this.isSyntaxCheck) {
info = this.viewer.getSpaceGroupInfo (null);
}} else {
var sg = this.parameterAsString (2);
if (!this.isSyntaxCheck) info = this.viewer.getSpaceGroupInfo (org.jmol.util.TextFormat.simpleReplace (sg, "''", "\""));
}if (info != null) msg = "" + info.get ("spaceGroupInfo") + info.get ("symmetryInfo");
break;
case 1048583:
len = 3;
msg = this.setObjectProperty ();
break;
case 1679429641:
if (!this.isSyntaxCheck) {
msg = this.viewer.getBoundBoxCommand (true);
}break;
case 12289:
if (!this.isSyntaxCheck) msg = "center " + org.jmol.util.Escape.escapePt (this.viewer.getRotationCenter ());
break;
case 135176:
if (!this.isSyntaxCheck) msg = this.getShapeProperty (22, "command");
break;
case 1229984263:
if (this.statementLength == 2) {
if (!this.isSyntaxCheck) msg = this.viewer.getCurrentFileAsString ();
if (msg == null) msg = "<unavailable>";
break;
}len = 3;
value = this.parameterAsString (2);
if (!this.isSyntaxCheck) msg = this.viewer.getFileAsString (value);
break;
case 4115:
if (this.tokAt (2) == 1048579 && (len = 3) > 0) msg = this.viewer.getModelFileInfoAll ();
 else msg = this.viewer.getModelFileInfo ();
break;
case 1610616855:
var n = ((len = this.statementLength) == 2 ? 2147483647 : this.intParameter (2));
if (n < 1) this.error (22);
if (!this.isSyntaxCheck) {
this.viewer.removeCommand ();
msg = this.viewer.getSetHistory (n);
}break;
case 135180:
if (!this.isSyntaxCheck) msg = this.getShapeProperty (23, "jvxlDataXml");
break;
case 1183762:
if (this.optParameterAsString (2).equalsIgnoreCase ("list")) {
msg = this.viewer.getMoInfo (-1);
len = 3;
} else {
var ptMO = ((len = this.statementLength) == 2 ? -2147483648 : this.intParameter (2));
if (!this.isSyntaxCheck) msg = this.getMoJvxl (ptMO);
}break;
case 1095766028:
if (!this.isSyntaxCheck) msg = this.viewer.getModelInfoAsString ();
break;
case 537006096:
if (!this.isSyntaxCheck) msg = this.viewer.getMeasurementInfoAsString ();
break;
case 1073742178:
case 1073742132:
case 4130:
if (!this.isSyntaxCheck) msg = this.viewer.getOrientationText (tok, null);
break;
case 1073742077:
len = 2;
if (this.statementLength > 3) break;
switch (tok = this.tokAt (2)) {
case 1073742178:
case 1073742132:
case 4130:
case 0:
if (!this.isSyntaxCheck) msg = this.viewer.getOrientationText (tok, null);
break;
default:
name = this.optParameterAsString (2);
msg = this.viewer.getOrientationText (0, name);
}
len = this.statementLength;
break;
case 1073742088:
if (!this.isSyntaxCheck) msg = this.viewer.getPDBHeader ();
break;
case 1073742102:
this.pointGroup ();
return;
case 1089470478:
if (!this.isSyntaxCheck) msg = this.viewer.getSymmetryInfoAsString ();
break;
case 1073742176:
if (!this.isSyntaxCheck) msg = "transform:\n" + this.viewer.getTransformText ();
break;
case 4168:
msg = "zoom " + (this.viewer.getZoomEnabled () ? ("" + this.viewer.getZoomSetting ()) : "off");
break;
case 1611272202:
msg = (this.viewer.getShowFrank () ? "frank ON" : "frank OFF");
break;
case 1666189314:
str = "solventProbeRadius";
break;
case 1073741864:
case 1087373316:
case 1087373320:
case 1073742120:
case 1114638350:
case 1087373318:
case 1141899265:
case 1073741982:
case 1678770178:
msg = this.viewer.getChimeInfo (tok);
break;
case 537022465:
case 1610612738:
case 1716520973:
case 20482:
case 1613758488:
value = "?";
break;
case 1073741824:
if (str.equalsIgnoreCase ("fileHeader")) {
if (!this.isSyntaxCheck) msg = this.viewer.getPDBHeader ();
} else if (str.equalsIgnoreCase ("menu")) {
if (!this.isSyntaxCheck) value = this.viewer.getMenu ("");
} else if (str.equalsIgnoreCase ("mouse")) {
var qualifiers = ((len = this.statementLength) == 2 ? null : this.parameterAsString (2));
if (!this.isSyntaxCheck) msg = this.viewer.getBindingInfo (qualifiers);
}break;
}
this.checkLength (len);
if (this.isSyntaxCheck) return;
if (msg != null) this.showString (msg);
 else if (value != null) this.showString (str + " = " + value);
 else if (str != null) {
if (str.indexOf (" ") >= 0) this.showString (str);
 else this.showString (str + " = " + this.getParameterEscaped (str));
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getIsosurfaceJvxl", 
($fz = function (asMesh, iShape) {
if (this.isSyntaxCheck) return "";
return this.getShapeProperty (iShape, asMesh ? "jvxlMeshX" : "jvxlDataXml");
}, $fz.isPrivate = true, $fz), "~B,~N");
Clazz.defineMethod (c$, "getMoJvxl", 
($fz = function (ptMO) {
this.shapeManager.loadShape (26);
var modelIndex = this.viewer.getCurrentModelIndex ();
if (modelIndex < 0) this.errorStr (30, "MO isosurfaces");
var moData = this.viewer.getModelAuxiliaryInfoValue (modelIndex, "moData");
if (moData == null) this.error (27);
var n = this.getShapeProperty (26, "moNumber");
if (n == null || n.intValue () == 0) {
this.setShapeProperty (26, "init", Integer.$valueOf (modelIndex));
} else if (ptMO == 2147483647) {
}this.setShapeProperty (26, "moData", moData);
return this.getShapePropertyIndex (26, "showMO", ptMO);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "draw", 
($fz = function () {
this.shapeManager.loadShape (22);
switch (this.tokAt (1)) {
case 1073742001:
if (this.listIsosurface (22)) return;
break;
case 1073742102:
this.pointGroup ();
return;
case 137363468:
case 135270417:
case 1052714:
this.plot (this.statement);
return;
}
var havePoints = false;
var isInitialized = false;
var isSavedState = false;
var isTranslucent = false;
var isIntersect = false;
var isFrame = false;
var plane;
var tokIntersect = 0;
var translucentLevel = 3.4028235E38;
var colorArgb = -2147483648;
var intScale = 0;
var swidth = "";
var iptDisplayProperty = 0;
var center = null;
var thisId = this.initIsosurface (22);
var idSeen = (thisId != null);
var isWild = (idSeen && this.getShapeProperty (22, "ID") == null);
var connections = null;
var iConnect = 0;
for (var i = this.iToken; i < this.statementLength; ++i) {
var propertyName = null;
var propertyValue = null;
switch (this.getToken (i).tok) {
case 1614417948:
case 1679429641:
if (this.isSyntaxCheck) break;
var vp = this.viewer.getPlaneIntersection (this.theTok, null, intScale / 100, 0);
intScale = 0;
propertyName = "polygon";
propertyValue = vp;
havePoints = true;
break;
case 4106:
connections =  Clazz.newIntArray (4, 0);
iConnect = 4;
var farray = this.floatParameterSet (++i, 4, 4);
i = this.iToken;
for (var j = 0; j < 4; j++) connections[j] = Clazz.floatToInt (farray[j]);

havePoints = true;
break;
case 1678770178:
case 1141899265:
if (connections == null || iConnect > (this.theTok == 1095761924 ? 2 : 3)) {
iConnect = 0;
connections = [-1, -1, -1, -1];
}connections[iConnect++] = this.atomExpressionAt (++i).nextSetBit (0);
i = this.iToken;
connections[iConnect++] = (this.theTok == 1678770178 ? this.atomExpressionAt (++i).nextSetBit (0) : -1);
i = this.iToken;
havePoints = true;
break;
case 554176565:
switch (this.getToken (++i).tok) {
case 1048583:
propertyName = "slab";
propertyValue = this.objectNameParameter (++i);
i = this.iToken;
havePoints = true;
break;
default:
this.error (22);
}
break;
case 135267842:
switch (this.getToken (++i).tok) {
case 1614417948:
case 1679429641:
tokIntersect = this.theTok;
isIntersect = true;
continue;
case 1048583:
propertyName = "intersect";
propertyValue = this.objectNameParameter (++i);
i = this.iToken;
isIntersect = true;
havePoints = true;
break;
default:
this.error (22);
}
break;
case 1073742106:
propertyName = "polygon";
havePoints = true;
var v =  new java.util.ArrayList ();
var nVertices = 0;
var nTriangles = 0;
var points = null;
var vpolygons = null;
if (this.isArrayParameter (++i)) {
points = this.getPointArray (i, -1);
nVertices = points.length;
} else {
nVertices = Math.max (0, this.intParameter (i));
points =  new Array (nVertices);
for (var j = 0; j < nVertices; j++) points[j] = this.centerParameter (++this.iToken);

}switch (this.getToken (++this.iToken).tok) {
case 11:
case 12:
var sv = org.jmol.script.ScriptVariable.newScriptVariableToken (this.theToken);
sv.toArray ();
vpolygons = sv.getList ();
nTriangles = vpolygons.size ();
break;
case 7:
vpolygons = (this.theToken).getList ();
nTriangles = vpolygons.size ();
break;
default:
nTriangles = Math.max (0, this.intParameter (this.iToken));
}
var polygons = org.jmol.util.ArrayUtil.newInt2 (nTriangles);
for (var j = 0; j < nTriangles; j++) {
var f = (vpolygons == null ? this.floatParameterSet (++this.iToken, 3, 4) : org.jmol.script.ScriptVariable.flistValue (vpolygons.get (j), 0));
if (f.length < 3 || f.length > 4) this.error (22);
polygons[j] = [Clazz.floatToInt (f[0]), Clazz.floatToInt (f[1]), Clazz.floatToInt (f[2]), (f.length == 3 ? 7 : Clazz.floatToInt (f[3]))];
}
if (nVertices > 0) {
v.add (points);
v.add (polygons);
} else {
v = null;
}propertyValue = v;
i = this.iToken;
break;
case 1297090050:
var xyz = null;
var iSym = 0;
plane = null;
var target = null;
switch (this.tokAt (++i)) {
case 4:
xyz = this.stringParameter (i);
break;
case 12:
xyz = org.jmol.script.ScriptVariable.sValue (this.getToken (i));
break;
case 2:
default:
if (!this.isCenterParameter (i)) iSym = this.intParameter (i++);
if (this.isCenterParameter (i)) center = this.centerParameter (i);
if (this.isCenterParameter (this.iToken + 1)) target = this.centerParameter (++this.iToken);
if (this.isSyntaxCheck) return;
i = this.iToken;
}
var bsAtoms = null;
if (center == null && i + 1 < this.statementLength) {
center = this.centerParameter (++i);
bsAtoms = (this.tokAt (i) == 10 || this.tokAt (i) == 1048577 ? this.atomExpressionAt (i) : null);
i = this.iToken + 1;
}this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.runScript (this.viewer.getSymmetryInfo (bsAtoms, xyz, iSym, center, target, thisId, 135176));
return;
case 4115:
isFrame = true;
continue;
case 1048586:
case 9:
case 8:
if (this.theTok == 9 || !this.isPoint3f (i)) {
propertyValue = this.getPoint4f (i);
if (isFrame) {
this.checkLast (this.iToken);
if (!this.isSyntaxCheck) this.runScript ((org.jmol.util.Quaternion.newP4 (propertyValue)).draw ((thisId == null ? "frame" : thisId), " " + swidth, (center == null ?  new org.jmol.util.Point3f () : center), intScale / 100));
return;
}propertyName = "planedef";
} else {
propertyValue = center = this.getPoint3f (i, true);
propertyName = "coord";
}i = this.iToken;
havePoints = true;
break;
case 135267841:
case 135266319:
if (!havePoints && !isIntersect && tokIntersect == 0 && this.theTok != 135267841) {
propertyName = "plane";
break;
}if (this.theTok == 135266319) {
plane = this.planeParameter (++i);
} else {
plane = this.hklParameter (++i);
}i = this.iToken;
if (tokIntersect != 0) {
if (this.isSyntaxCheck) break;
var vpc = this.viewer.getPlaneIntersection (tokIntersect, plane, intScale / 100, 0);
intScale = 0;
propertyName = "polygon";
propertyValue = vpc;
} else {
propertyValue = plane;
propertyName = "planedef";
}havePoints = true;
break;
case 1073742000:
propertyName = "lineData";
propertyValue = this.floatParameterSet (++i, 0, 2147483647);
i = this.iToken;
havePoints = true;
break;
case 10:
case 1048577:
propertyName = "atomSet";
propertyValue = this.atomExpressionAt (i);
if (isFrame) center = this.centerParameter (i);
i = this.iToken;
havePoints = true;
break;
case 7:
propertyName = "modelBasedPoints";
propertyValue = org.jmol.script.ScriptVariable.listValue (this.theToken);
havePoints = true;
break;
case 1073742195:
case 269484080:
break;
case 269484096:
propertyValue = this.xypParameter (i);
if (propertyValue != null) {
i = this.iToken;
propertyName = "coord";
havePoints = true;
break;
}if (isSavedState) this.error (22);
isSavedState = true;
break;
case 269484097:
if (!isSavedState) this.error (22);
isSavedState = false;
break;
case 1141899269:
propertyName = "reverse";
break;
case 4:
propertyValue = this.stringParameter (i);
propertyName = "title";
break;
case 135198:
propertyName = "vector";
break;
case 1141899267:
propertyValue = Float.$valueOf (this.floatParameter (++i));
propertyName = "length";
break;
case 3:
propertyValue = Float.$valueOf (this.floatParameter (i));
propertyName = "length";
break;
case 1095761933:
propertyName = "modelIndex";
propertyValue = Integer.$valueOf (this.intParameter (++i));
break;
case 2:
if (isSavedState) {
propertyName = "modelIndex";
propertyValue = Integer.$valueOf (this.intParameter (i));
} else {
intScale = this.intParameter (i);
}break;
case 1073742138:
if (++i >= this.statementLength) this.error (34);
switch (this.getToken (i).tok) {
case 2:
intScale = this.intParameter (i);
continue;
case 3:
intScale = Math.round (this.floatParameter (i) * 100);
continue;
}
this.error (34);
break;
case 1074790550:
thisId = this.setShapeId (22, ++i, idSeen);
isWild = (this.getShapeProperty (22, "ID") == null);
i = this.iToken;
break;
case 1073742028:
propertyName = "fixed";
propertyValue = Boolean.FALSE;
break;
case 1060869:
propertyName = "fixed";
propertyValue = Boolean.TRUE;
break;
case 1073742066:
var pt = this.getPoint3f (++i, true);
i = this.iToken;
propertyName = "offset";
propertyValue = pt;
break;
case 1073741906:
propertyName = "crossed";
break;
case 1073742196:
propertyValue = Float.$valueOf (this.floatParameter (++i));
propertyName = "width";
swidth = propertyName + " " + propertyValue;
break;
case 1073741998:
propertyName = "line";
propertyValue = Boolean.TRUE;
break;
case 1073741908:
propertyName = "curve";
break;
case 1074790416:
propertyName = "arc";
break;
case 1073741846:
propertyName = "arrow";
break;
case 1073741880:
propertyName = "circle";
break;
case 1073741912:
propertyName = "cylinder";
break;
case 1073742194:
propertyName = "vertices";
break;
case 1073742048:
propertyName = "nohead";
break;
case 1073741861:
propertyName = "isbarb";
break;
case 1073742130:
propertyName = "rotate45";
break;
case 1073742092:
propertyName = "perp";
break;
case 1666189314:
case 1073741916:
var isRadius = (this.theTok == 1666189314);
var f = this.floatParameter (++i);
if (isRadius) f *= 2;
propertyValue = Float.$valueOf (f);
propertyName = (isRadius || this.tokAt (i) == 3 ? "width" : "diameter");
swidth = propertyName + (this.tokAt (i) == 3 ? " " + f : " " + (Clazz.floatToInt (f)));
break;
case 1048583:
if ((this.tokAt (i + 2) == 269484096 || isFrame)) {
var pto = center = this.centerParameter (i);
i = this.iToken;
propertyName = "coord";
propertyValue = pto;
havePoints = true;
break;
}propertyValue = this.objectNameParameter (++i);
propertyName = "identifier";
havePoints = true;
break;
case 1766856708:
case 1073742180:
case 1073742074:
if (this.theTok != 1766856708) --i;
if (this.tokAt (i + 1) == 1073742180) {
i++;
isTranslucent = true;
if (this.isFloatParameter (i + 1)) translucentLevel = this.getTranslucentLevel (++i);
} else if (this.tokAt (i + 1) == 1073742074) {
i++;
isTranslucent = true;
translucentLevel = 0;
}if (this.isColorParam (i + 1)) {
colorArgb = this.getArgbParam (++i);
i = this.iToken;
} else if (!isTranslucent) {
this.error (22);
}idSeen = true;
continue;
default:
if (!this.setMeshDisplayProperty (22, 0, this.theTok)) {
if (this.theTok == 269484209 || org.jmol.script.Token.tokAttr (this.theTok, 1073741824)) {
thisId = this.setShapeId (22, i, idSeen);
i = this.iToken;
break;
}this.error (22);
}if (iptDisplayProperty == 0) iptDisplayProperty = i;
i = this.iToken;
continue;
}
idSeen = (this.theTok != 12291);
if (havePoints && !isInitialized && !isFrame) {
this.setShapeProperty (22, "points", Integer.$valueOf (intScale));
isInitialized = true;
intScale = 0;
}if (havePoints && isWild) this.error (22);
if (propertyName != null) this.setShapeProperty (22, propertyName, propertyValue);
}
if (havePoints) {
this.setShapeProperty (22, "set", connections);
}if (colorArgb != -2147483648) this.setShapeProperty (22, "color", Integer.$valueOf (colorArgb));
if (isTranslucent) this.setShapeTranslucency (22, "", "translucent", translucentLevel, null);
if (intScale != 0) {
this.setShapeProperty (22, "scale", Integer.$valueOf (intScale));
}if (iptDisplayProperty > 0) {
if (!this.setMeshDisplayProperty (22, iptDisplayProperty, 0)) this.error (22);
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "polyhedra", 
($fz = function () {
var needsGenerating = false;
var onOffDelete = false;
var typeSeen = false;
var edgeParameterSeen = false;
var isDesignParameter = false;
var lighting = 0;
var nAtomSets = 0;
this.shapeManager.loadShape (21);
this.setShapeProperty (21, "init", null);
var setPropertyName = "centers";
var decimalPropertyName = "radius_";
var isTranslucent = false;
var translucentLevel = 3.4028235E38;
var color = -2147483648;
for (var i = 1; i < this.statementLength; ++i) {
var propertyName = null;
var propertyValue = null;
switch (this.getToken (i).tok) {
case 12291:
case 1048589:
case 1048588:
if (i + 1 != this.statementLength || needsGenerating || nAtomSets > 1 || nAtomSets == 0 && "to".equals (setPropertyName)) this.error (18);
propertyName = (this.theTok == 1048588 ? "off" : this.theTok == 1048589 ? "on" : "delete");
onOffDelete = true;
break;
case 269484436:
case 269484080:
continue;
case 1678770178:
if (nAtomSets > 0) this.error (23);
needsGenerating = true;
propertyName = "bonds";
break;
case 1666189314:
decimalPropertyName = "radius";
continue;
case 2:
case 3:
if (nAtomSets > 0 && !isDesignParameter) this.error (23);
if (this.theTok == 2) {
if (decimalPropertyName === "radius_") {
propertyName = "nVertices";
propertyValue = Integer.$valueOf (this.intParameter (i));
needsGenerating = true;
break;
}}propertyName = (decimalPropertyName === "radius_" ? "radius" : decimalPropertyName);
propertyValue = Float.$valueOf (this.floatParameter (i));
decimalPropertyName = "radius_";
isDesignParameter = false;
needsGenerating = true;
break;
case 10:
case 1048577:
if (typeSeen) this.error (23);
if (++nAtomSets > 2) this.error (2);
if ("to".equals (setPropertyName)) needsGenerating = true;
propertyName = setPropertyName;
setPropertyName = "to";
propertyValue = this.atomExpressionAt (i);
i = this.iToken;
break;
case 1074790746:
if (nAtomSets > 1) this.error (23);
if (this.tokAt (i + 1) == 10 || this.tokAt (i + 1) == 1048577 && !needsGenerating) {
propertyName = "toBitSet";
propertyValue = this.atomExpressionAt (++i);
i = this.iToken;
needsGenerating = true;
break;
} else if (!needsGenerating) {
this.error (19);
}setPropertyName = "to";
continue;
case 1073741937:
if (!needsGenerating) this.error (19);
decimalPropertyName = "faceCenterOffset";
isDesignParameter = true;
continue;
case 1073741924:
if (!needsGenerating) this.error (19);
decimalPropertyName = "distanceFactor";
isDesignParameter = true;
continue;
case 1766856708:
case 1073742180:
case 1073742074:
isTranslucent = false;
if (this.theTok != 1766856708) --i;
if (this.tokAt (i + 1) == 1073742180) {
i++;
isTranslucent = true;
if (this.isFloatParameter (i + 1)) translucentLevel = this.getTranslucentLevel (++i);
} else if (this.tokAt (i + 1) == 1073742074) {
i++;
isTranslucent = true;
translucentLevel = 0;
}if (this.isColorParam (i + 1)) {
color = this.getArgbParam (i);
i = this.iToken;
} else if (!isTranslucent) this.error (22);
continue;
case 1073741886:
case 1073741948:
propertyName = "collapsed";
propertyValue = (this.theTok == 1073741886 ? Boolean.TRUE : Boolean.FALSE);
if (typeSeen) this.error (18);
typeSeen = true;
break;
case 1073742044:
case 1073741934:
case 1073741956:
if (edgeParameterSeen) this.error (18);
propertyName = this.parameterAsString (i);
edgeParameterSeen = true;
break;
case 1073741964:
lighting = this.theTok;
continue;
default:
if (this.isColorParam (i)) {
color = this.getArgbParam (i);
i = this.iToken;
continue;
}this.error (22);
}
this.setShapeProperty (21, propertyName, propertyValue);
if (onOffDelete) return;
}
if (!needsGenerating && !typeSeen && !edgeParameterSeen && lighting == 0) this.error (19);
if (needsGenerating) this.setShapeProperty (21, "generate", null);
if (color != -2147483648) this.setShapeProperty (21, "colorThis", Integer.$valueOf (color));
if (isTranslucent) this.setShapeTranslucency (21, "", "translucentThis", translucentLevel, null);
if (lighting != 0) this.setShapeProperty (21, "token", Integer.$valueOf (lighting));
this.setShapeProperty (21, "init", null);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "contact", 
($fz = function () {
this.shapeManager.loadShape (24);
if (this.tokAt (1) == 1073742001 && this.listIsosurface (24)) return;
var iptDisplayProperty = 0;
this.iToken = 1;
var thisId = this.initIsosurface (24);
var idSeen = (thisId != null);
var isWild = (idSeen && this.getShapeProperty (24, "ID") == null);
var bsA = null;
var bsB = null;
var bs = null;
var rd = null;
var params = null;
var colorDensity = false;
var sbCommand =  new org.jmol.util.StringXBuilder ();
var minSet = 2147483647;
var displayType = 135266319;
var contactType = 0;
var distance = NaN;
var saProbeRadius = NaN;
var localOnly = true;
var intramolecular = null;
var userSlabObject = null;
var colorpt = 0;
var colorByType = false;
var tok;
var okNoAtoms = (this.iToken > 1);
for (var i = this.iToken; i < this.statementLength; ++i) {
switch (tok = this.getToken (i).tok) {
default:
okNoAtoms = true;
if (!this.setMeshDisplayProperty (24, 0, this.theTok)) {
if (this.theTok != 269484209 && !org.jmol.script.Token.tokAttr (this.theTok, 1073741824)) this.error (22);
thisId = this.setShapeId (24, i, idSeen);
i = this.iToken;
break;
}if (iptDisplayProperty == 0) iptDisplayProperty = i;
i = this.iToken;
continue;
case 1074790550:
okNoAtoms = true;
this.setShapeId (24, ++i, idSeen);
isWild = (this.getShapeProperty (24, "ID") == null);
i = this.iToken;
break;
case 1766856708:
switch (this.tokAt (i + 1)) {
case 1073741914:
tok = 0;
colorDensity = true;
sbCommand.append (" color density");
i++;
break;
case 1141899272:
tok = 0;
colorByType = true;
sbCommand.append (" color type");
i++;
break;
}
if (tok == 0) break;
case 1073742180:
case 1073742074:
okNoAtoms = true;
if (colorpt == 0) colorpt = i;
this.setMeshDisplayProperty (24, i, this.theTok);
i = this.iToken;
break;
case 554176565:
okNoAtoms = true;
userSlabObject = this.getCapSlabObject (i, false);
this.setShapeProperty (24, "slab", userSlabObject);
i = this.iToken;
break;
case 1073741914:
colorDensity = true;
sbCommand.append (" density");
if (this.isFloatParameter (i + 1)) {
if (params == null) params =  Clazz.newFloatArray (1, 0);
params[0] = -Math.abs (this.floatParameter (++i));
sbCommand.append (" " + -params[0]);
}break;
case 1073742122:
var resolution = this.floatParameter (++i);
if (resolution > 0) {
sbCommand.append (" resolution ").appendF (resolution);
this.setShapeProperty (24, "resolution", Float.$valueOf (resolution));
}break;
case 135266324:
case 1276118018:
distance = this.floatParameter (++i);
sbCommand.append (" within ").appendF (distance);
break;
case 269484193:
case 2:
case 3:
rd = this.encodeRadiusParameter (i, false, false);
sbCommand.append (" ").appendO (rd);
i = this.iToken;
break;
case 1073741990:
case 1073741989:
intramolecular = (tok == 1073741989 ? Boolean.TRUE : Boolean.FALSE);
sbCommand.append (" ").appendO (this.theToken.value);
break;
case 1073742020:
minSet = this.intParameter (++i);
break;
case 1612189718:
case 1073741881:
case 1649412112:
contactType = tok;
sbCommand.append (" ").appendO (this.theToken.value);
break;
case 1073742136:
if (this.isFloatParameter (i + 1)) saProbeRadius = this.floatParameter (++i);
case 1074790451:
case 1073742036:
case 3145756:
localOnly = false;
case 1276117510:
case 1073741961:
case 135266319:
case 4106:
displayType = tok;
sbCommand.append (" ").appendO (this.theToken.value);
if (tok == 1073742136) sbCommand.append (" ").appendF (saProbeRadius);
break;
case 1073742083:
params = this.floatParameterSet (++i, 1, 10);
i = this.iToken;
break;
case 10:
case 1048577:
if (isWild || bsB != null) this.error (22);
bs = org.jmol.util.BitSetUtil.copy (this.atomExpressionAt (i));
i = this.iToken;
if (bsA == null) bsA = bs;
 else bsB = bs;
sbCommand.append (" ").append (org.jmol.util.Escape.escape (bs));
break;
}
idSeen = (this.theTok != 12291);
}
if (!okNoAtoms && bsA == null) this.error (13);
if (this.isSyntaxCheck) return;
if (bsA != null) {
var rd1 = (rd == null ?  new org.jmol.atomdata.RadiusData (null, 0.26, org.jmol.atomdata.RadiusData.EnumType.OFFSET, org.jmol.constant.EnumVdw.AUTO) : rd);
if (displayType == 1073742036 && bsB == null && intramolecular != null && intramolecular.booleanValue ()) bsB = bsA;
 else bsB = this.setContactBitSets (bsA, bsB, localOnly, distance, rd1, true);
switch (displayType) {
case 1074790451:
case 1073742136:
var bsSolvent = this.lookupIdentifierValue ("solvent");
bsA.andNot (bsSolvent);
bsB.andNot (bsSolvent);
bsB.andNot (bsA);
break;
case 3145756:
bsB.andNot (bsA);
break;
case 1073742036:
if (minSet == 2147483647) minSet = 100;
this.setShapeProperty (24, "minset", Integer.$valueOf (minSet));
sbCommand.append (" minSet ").appendI (minSet);
if (params == null) params = [0.5, 2];
}
if (intramolecular != null) {
params = (params == null ?  Clazz.newFloatArray (2, 0) : org.jmol.util.ArrayUtil.ensureLengthA (params, 2));
params[1] = (intramolecular.booleanValue () ? 1 : 2);
}if (params != null) sbCommand.append (" parameters ").append (org.jmol.util.Escape.escape (params));
this.setShapeProperty (24, "set", [Integer.$valueOf (contactType), Integer.$valueOf (displayType), Boolean.$valueOf (colorDensity), Boolean.$valueOf (colorByType), bsA, bsB, rd, Float.$valueOf (saProbeRadius), params, sbCommand.toString ()]);
if (colorpt > 0) this.setMeshDisplayProperty (24, colorpt, 0);
}if (iptDisplayProperty > 0) {
if (!this.setMeshDisplayProperty (24, iptDisplayProperty, 0)) this.error (22);
}if (userSlabObject != null && bsA != null) this.setShapeProperty (24, "slab", userSlabObject);
if (bsA != null && (displayType == 1073742036 || localOnly)) {
var volume = this.getShapeProperty (24, "volume");
if (org.jmol.util.Escape.isAD (volume)) {
var vs = volume;
var v = 0;
for (var i = 0; i < vs.length; i++) v += Math.abs (vs[i]);

volume = Float.$valueOf (v);
}var nsets = (this.getShapeProperty (24, "nSets")).intValue ();
if (colorDensity || displayType != 1276117510) {
this.showString ((nsets == 0 ? "" : nsets + " contacts with ") + "net volume " + volume + " A^3");
}}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setContactBitSets", 
function (bsA, bsB, localOnly, distance, rd, warnMultiModel) {
var withinAllModels;
var bs;
if (bsB == null) {
bsB = org.jmol.util.BitSetUtil.setAll (this.viewer.getAtomCount ());
org.jmol.util.BitSetUtil.andNot (bsB, this.viewer.getDeletedAtoms ());
bsB.andNot (bsA);
withinAllModels = false;
} else {
bs = org.jmol.util.BitSetUtil.copy (bsA);
bs.or (bsB);
var nModels = this.viewer.getModelBitSet (bs, false).cardinality ();
withinAllModels = (nModels > 1);
if (warnMultiModel && nModels > 1 && !this.tQuiet) this.showString (org.jmol.i18n.GT._ ("Note: More than one model is involved in this contact!"));
}if (!bsA.equals (bsB)) {
var setBfirst = (!localOnly || bsA.cardinality () < bsB.cardinality ());
if (setBfirst) {
bs = this.viewer.getAtomsWithinRadius (distance, bsA, withinAllModels, (Float.isNaN (distance) ? rd : null));
bsB.and (bs);
}if (localOnly) {
bs = this.viewer.getAtomsWithinRadius (distance, bsB, withinAllModels, (Float.isNaN (distance) ? rd : null));
bsA.and (bs);
if (!setBfirst) {
bs = this.viewer.getAtomsWithinRadius (distance, bsA, withinAllModels, (Float.isNaN (distance) ? rd : null));
bsB.and (bs);
}bs = org.jmol.util.BitSetUtil.copy (bsB);
bs.and (bsA);
if (bs.equals (bsA)) bsB.andNot (bsA);
 else if (bs.equals (bsB)) bsA.andNot (bsB);
}}return bsB;
}, "org.jmol.util.BitSet,org.jmol.util.BitSet,~B,~N,org.jmol.atomdata.RadiusData,~B");
Clazz.defineMethod (c$, "lcaoCartoon", 
($fz = function () {
this.shapeManager.loadShape (25);
if (this.tokAt (1) == 1073742001 && this.listIsosurface (25)) return;
this.setShapeProperty (25, "init", this.fullCommand);
if (this.statementLength == 1) {
this.setShapeProperty (25, "lcaoID", null);
return;
}var idSeen = false;
var translucency = null;
for (var i = 1; i < this.statementLength; i++) {
var propertyName = null;
var propertyValue = null;
switch (this.getToken (i).tok) {
case 1074790451:
case 554176565:
propertyName = this.theToken.value;
if (this.tokAt (i + 1) == 1048588) this.iToken = i + 1;
propertyValue = this.getCapSlabObject (i, true);
i = this.iToken;
break;
case 12289:
this.isosurface (25);
return;
case 528432:
var degx = 0;
var degy = 0;
var degz = 0;
switch (this.getToken (++i).tok) {
case 1112541205:
degx = this.floatParameter (++i) * 0.017453292;
break;
case 1112541206:
degy = this.floatParameter (++i) * 0.017453292;
break;
case 1112541207:
degz = this.floatParameter (++i) * 0.017453292;
break;
default:
this.error (22);
}
propertyName = "rotationAxis";
propertyValue = org.jmol.util.Vector3f.new3 (degx, degy, degz);
break;
case 1048589:
case 1610625028:
case 3145768:
propertyName = "on";
break;
case 1048588:
case 12294:
case 3145770:
propertyName = "off";
break;
case 12291:
propertyName = "delete";
break;
case 10:
case 1048577:
propertyName = "select";
propertyValue = this.atomExpressionAt (i);
i = this.iToken;
break;
case 1766856708:
translucency = this.setColorOptions (null, i + 1, 25, -2);
if (translucency != null) this.setShapeProperty (25, "settranslucency", translucency);
i = this.iToken;
idSeen = true;
continue;
case 1073742180:
case 1073742074:
this.setMeshDisplayProperty (25, i, this.theTok);
i = this.iToken;
idSeen = true;
continue;
case 1113200651:
case 4:
propertyValue = this.parameterAsString (i).toLowerCase ();
if (propertyValue.equals ("spacefill")) propertyValue = "cpk";
propertyName = "create";
if (this.optParameterAsString (i + 1).equalsIgnoreCase ("molecular")) {
i++;
propertyName = "molecular";
}break;
case 135280132:
if (this.tokAt (i + 1) == 10 || this.tokAt (i + 1) == 1048577) {
propertyName = "select";
propertyValue = this.atomExpressionAt (i + 1);
i = this.iToken;
} else {
propertyName = "selectType";
propertyValue = this.parameterAsString (++i);
if (propertyValue.equals ("spacefill")) propertyValue = "cpk";
}break;
case 1073742138:
propertyName = "scale";
propertyValue = Float.$valueOf (this.floatParameter (++i));
break;
case 1073742004:
case 1073742006:
propertyName = "lonePair";
break;
case 1073742112:
case 1073742110:
propertyName = "radical";
break;
case 1073742030:
propertyName = "molecular";
break;
case 1073741904:
propertyValue = this.parameterAsString (++i);
propertyName = "create";
if (this.optParameterAsString (i + 1).equalsIgnoreCase ("molecular")) {
i++;
propertyName = "molecular";
}break;
case 1074790550:
propertyValue = this.getShapeNameParameter (++i);
i = this.iToken;
if (idSeen) this.error (22);
propertyName = "lcaoID";
break;
default:
if (this.theTok == 269484209 || org.jmol.script.Token.tokAttr (this.theTok, 1073741824)) {
if (this.theTok != 269484209) propertyValue = this.parameterAsString (i);
if (idSeen) this.error (22);
propertyName = "lcaoID";
break;
}break;
}
if (this.theTok != 12291) idSeen = true;
if (propertyName == null) this.error (22);
this.setShapeProperty (25, propertyName, propertyValue);
}
this.setShapeProperty (25, "clear", null);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getCapSlabObject", 
($fz = function (i, isLcaoCartoon) {
if (i < 0) {
return org.jmol.util.MeshSurface.getSlabWithinRange (i, 0);
}var data = null;
var tok0 = this.tokAt (i);
var isSlab = (tok0 == 554176565);
var tok = this.tokAt (i + 1);
var plane = null;
var pts = null;
var d;
var d2;
var bs = null;
var slabColix = null;
var slabMeshType = null;
if (tok == 1073742180) {
var slabTranslucency = (this.isFloatParameter (++i + 1) ? this.floatParameter (++i) : 0.5);
if (this.isColorParam (i + 1)) {
slabColix = Short.$valueOf (org.jmol.util.Colix.getColixTranslucent3 (org.jmol.util.Colix.getColix (this.getArgbParam (i + 1)), slabTranslucency != 0, slabTranslucency));
i = this.iToken;
} else {
slabColix = Short.$valueOf (org.jmol.util.Colix.getColixTranslucent3 (1, slabTranslucency != 0, slabTranslucency));
}switch (tok = this.tokAt (i + 1)) {
case 1073742018:
case 1073741938:
slabMeshType = Integer.$valueOf (tok);
tok = this.tokAt (++i + 1);
break;
default:
slabMeshType = Integer.$valueOf (1073741938);
break;
}
}switch (tok) {
case 10:
case 1048577:
data = this.atomExpressionAt (i + 1);
tok = 3;
this.iToken++;
break;
case 1048588:
this.iToken = i + 1;
return  new Integer (-2147483648);
case 1048587:
this.iToken = i + 1;
break;
case 1048583:
i++;
data = [Float.$valueOf (1), this.parameterAsString (++i)];
tok = 1073742018;
break;
case 135266324:
i++;
if (this.tokAt (++i) == 1073742114) {
d = this.floatParameter (++i);
d2 = this.floatParameter (++i);
data = [Float.$valueOf (d), Float.$valueOf (d2)];
tok = 1073742114;
} else if (this.isFloatParameter (i)) {
d = this.floatParameter (i);
if (this.isCenterParameter (++i)) {
var pt = this.centerParameter (i);
if (this.isSyntaxCheck || !(Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet))) {
pts = [pt];
} else {
var atoms = this.viewer.getModelSet ().atoms;
bs = this.expressionResult;
pts =  new Array (bs.cardinality ());
for (var k = 0, j = bs.nextSetBit (0); j >= 0; j = bs.nextSetBit (j + 1), k++) pts[k] = atoms[j];

}} else {
pts = this.getPointArray (i, -1);
}if (pts.length == 0) {
this.iToken = i;
this.error (22);
}data = [Float.$valueOf (d), pts, bs];
} else {
data = this.getPointArray (i, 4);
tok = 1679429641;
}break;
case 1679429641:
this.iToken = i + 1;
data = org.jmol.util.BoxInfo.getCriticalPoints (this.viewer.getBoundBoxVertices (), null);
break;
case 1073741872:
case 1614417948:
this.iToken = i + 1;
var unitCell = this.viewer.getCurrentUnitCell ();
if (unitCell == null) {
if (tok == 1614417948) this.error (22);
} else {
pts = org.jmol.util.BoxInfo.getCriticalPoints (unitCell.getUnitCellVertices (), unitCell.getCartesianOffset ());
var iType = Clazz.floatToInt (unitCell.getUnitCellInfoType (6));
var v1 = null;
var v2 = null;
switch (iType) {
case 3:
break;
case 1:
v2 = org.jmol.util.Vector3f.newV (pts[2]);
v2.sub (pts[0]);
v2.scale (1000);
case 2:
v1 = org.jmol.util.Vector3f.newV (pts[1]);
v1.sub (pts[0]);
v1.scale (1000);
pts[0].sub (v1);
pts[1].scale (2000);
if (iType == 1) {
pts[0].sub (v2);
pts[2].scale (2000);
}break;
}
data = pts;
}break;
default:
if (!isLcaoCartoon && isSlab && this.isFloatParameter (i + 1)) {
d = this.floatParameter (++i);
if (!this.isFloatParameter (i + 1)) return  new Integer (Clazz.floatToInt (d));
d2 = this.floatParameter (++i);
data = [Float.$valueOf (d), Float.$valueOf (d2)];
tok = 1073742114;
break;
}plane = this.planeParameter (++i);
var off = (this.isFloatParameter (this.iToken + 1) ? this.floatParameter (++this.iToken) : NaN);
if (!Float.isNaN (off)) plane.w -= off;
data = plane;
tok = 135266319;
}
var colorData = (slabMeshType == null ? null : [slabMeshType, slabColix]);
return org.jmol.util.MeshSurface.getSlabObject (tok, data, !isSlab, colorData);
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "mo", 
($fz = function (isInitOnly) {
var offset = 2147483647;
var isNegOffset = false;
var bsModels = this.viewer.getVisibleFramesBitSet ();
var propertyList =  new java.util.ArrayList ();
var i0 = 1;
if (this.tokAt (1) == 1095766028 || this.tokAt (1) == 4115) {
i0 = this.modelNumberParameter (2);
if (i0 < 0) this.error (22);
bsModels.clearAll ();
bsModels.set (i0);
i0 = 3;
}for (var iModel = bsModels.nextSetBit (0); iModel >= 0; iModel = bsModels.nextSetBit (iModel + 1)) {
this.shapeManager.loadShape (26);
var i = i0;
if (this.tokAt (i) == 1073742001 && this.listIsosurface (26)) return true;
this.setShapeProperty (26, "init", Integer.$valueOf (iModel));
var title = null;
var moNumber = (this.getShapeProperty (26, "moNumber")).intValue ();
var linearCombination = this.getShapeProperty (26, "moLinearCombination");
if (isInitOnly) return true;
if (moNumber == 0) moNumber = 2147483647;
var propertyName = null;
var propertyValue = null;
switch (this.getToken (i).tok) {
case 1074790451:
case 554176565:
propertyName = this.theToken.value;
propertyValue = this.getCapSlabObject (i, false);
i = this.iToken;
break;
case 2:
moNumber = this.intParameter (i);
linearCombination = (moNumber >= 0 ? null : [-100, -moNumber]);
break;
case 269484192:
switch (this.tokAt (++i)) {
case 1073741973:
case 1073742008:
break;
default:
this.error (22);
}
isNegOffset = true;
case 1073741973:
case 1073742008:
linearCombination = null;
if ((offset = this.moOffset (i)) == 2147483647) this.error (22);
moNumber = 0;
break;
case 1073742037:
linearCombination = null;
moNumber = 1073742037;
break;
case 1073742108:
linearCombination = null;
moNumber = 1073742108;
break;
case 1766856708:
this.setColorOptions (null, i + 1, 26, 2);
break;
case 135266319:
propertyName = "plane";
propertyValue = this.planeParameter (i + 1);
break;
case 135266320:
this.addShapeProperty (propertyList, "randomSeed", this.tokAt (i + 2) == 2 ? Integer.$valueOf (this.intParameter (i + 2)) : null);
propertyName = "monteCarloCount";
propertyValue = Integer.$valueOf (this.intParameter (i + 1));
break;
case 1073742138:
propertyName = "scale";
propertyValue = Float.$valueOf (this.floatParameter (i + 1));
break;
case 1073741910:
if (this.tokAt (i + 1) == 269484193) {
propertyName = "cutoffPositive";
propertyValue = Float.$valueOf (this.floatParameter (i + 2));
} else {
propertyName = "cutoff";
propertyValue = Float.$valueOf (this.floatParameter (i + 1));
}break;
case 536870916:
propertyName = "debug";
break;
case 1073742054:
propertyName = "plane";
break;
case 1073742104:
case 1073742122:
propertyName = "resolution";
propertyValue = Float.$valueOf (this.floatParameter (i + 1));
break;
case 1073742156:
propertyName = "squareData";
propertyValue = Boolean.TRUE;
break;
case 1073742168:
if (i + 1 < this.statementLength && this.tokAt (i + 1) == 4) {
propertyName = "titleFormat";
propertyValue = this.parameterAsString (i + 1);
}break;
case 1073741824:
this.error (22);
break;
default:
if (this.isArrayParameter (i)) {
linearCombination = this.floatParameterSet (i, 2, 2147483647);
break;
}var ipt = this.iToken;
if (!this.setMeshDisplayProperty (26, 0, this.theTok)) this.error (22);
this.setShapeProperty (26, "setProperties", propertyList);
this.setMeshDisplayProperty (26, ipt, this.tokAt (ipt));
return true;
}
if (propertyName != null) this.addShapeProperty (propertyList, propertyName, propertyValue);
if (moNumber != 2147483647 || linearCombination != null) {
if (this.tokAt (i + 1) == 4) title = this.parameterAsString (i + 1);
this.setCursorWait (true);
this.setMoData (propertyList, moNumber, linearCombination, offset, isNegOffset, iModel, title);
this.addShapeProperty (propertyList, "finalize", null);
}if (propertyList.size () > 0) this.setShapeProperty (26, "setProperties", propertyList);
propertyList.clear ();
}
return true;
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "setColorOptions", 
($fz = function (sb, index, iShape, nAllowed) {
this.getToken (index);
var translucency = "opaque";
if (this.theTok == 1073742180) {
translucency = "translucent";
if (nAllowed < 0) {
var value = (this.isFloatParameter (index + 1) ? this.floatParameter (++index) : 3.4028235E38);
this.setShapeTranslucency (iShape, null, "translucent", value, null);
if (sb != null) {
sb.append (" translucent");
if (value != 3.4028235E38) sb.append (" ").appendF (value);
}} else {
this.setMeshDisplayProperty (iShape, index, this.theTok);
}} else if (this.theTok == 1073742074) {
if (nAllowed >= 0) this.setMeshDisplayProperty (iShape, index, this.theTok);
} else {
this.iToken--;
}nAllowed = Math.abs (nAllowed);
for (var i = 0; i < nAllowed; i++) {
if (this.isColorParam (this.iToken + 1)) {
var color = this.getArgbParam (++this.iToken);
this.setShapeProperty (iShape, "colorRGB", Integer.$valueOf (color));
if (sb != null) sb.append (" ").append (org.jmol.util.Escape.escapeColor (color));
} else if (this.iToken < index) {
this.error (22);
} else {
break;
}}
return translucency;
}, $fz.isPrivate = true, $fz), "org.jmol.util.StringXBuilder,~N,~N,~N");
Clazz.defineMethod (c$, "moOffset", 
($fz = function (index) {
var isHomo = (this.getToken (index).tok == 1073741973);
var offset = (isHomo ? 0 : 1);
var tok = this.tokAt (++index);
if (tok == 2 && this.intParameter (index) < 0) offset += this.intParameter (index);
 else if (tok == 269484193) offset += this.intParameter (++index);
 else if (tok == 269484192) offset -= this.intParameter (++index);
return offset;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "setMoData", 
($fz = function (propertyList, moNumber, linearCombination, offset, isNegOffset, modelIndex, title) {
if (this.isSyntaxCheck) return;
if (modelIndex < 0) {
modelIndex = this.viewer.getCurrentModelIndex ();
if (modelIndex < 0) this.errorStr (30, "MO isosurfaces");
}var firstMoNumber = moNumber;
var moData = this.viewer.getModelAuxiliaryInfoValue (modelIndex, "moData");
if (linearCombination == null) {
if (moData == null) this.error (27);
var lastMoNumber = (moData.containsKey ("lastMoNumber") ? (moData.get ("lastMoNumber")).intValue () : 0);
if (moNumber == 1073742108) moNumber = lastMoNumber - 1;
 else if (moNumber == 1073742037) moNumber = lastMoNumber + 1;
var mos = (moData.get ("mos"));
var nOrb = (mos == null ? 0 : mos.size ());
if (nOrb == 0) this.error (25);
if (nOrb == 1 && moNumber > 1) this.error (29);
if (offset != 2147483647) {
if (moData.containsKey ("HOMO")) {
moNumber = (moData.get ("HOMO")).intValue () + offset;
} else {
moNumber = -1;
var f;
for (var i = 0; i < nOrb; i++) {
var mo = mos.get (i);
if ((f = mo.get ("occupancy")) != null) {
if (f.floatValue () < 0.5) {
moNumber = i;
break;
}continue;
} else if ((f = mo.get ("energy")) != null) {
if (f.floatValue () > 0) {
moNumber = i;
break;
}continue;
}break;
}
if (moNumber < 0) this.error (28);
moNumber += offset;
}org.jmol.util.Logger.info ("MO " + moNumber);
}if (moNumber < 1 || moNumber > nOrb) this.errorStr (26, "" + nOrb);
}moData.put ("lastMoNumber", Integer.$valueOf (moNumber));
if (isNegOffset) linearCombination = [-100, moNumber];
this.addShapeProperty (propertyList, "moData", moData);
if (title != null) this.addShapeProperty (propertyList, "title", title);
if (firstMoNumber < 0) this.addShapeProperty (propertyList, "charges", this.viewer.getAtomicCharges ());
this.addShapeProperty (propertyList, "molecularOrbital", linearCombination != null ? linearCombination : Integer.$valueOf (firstMoNumber < 0 ? -moNumber : moNumber));
this.addShapeProperty (propertyList, "clear", null);
}, $fz.isPrivate = true, $fz), "java.util.List,~N,~A,~N,~B,~N,~S");
Clazz.defineMethod (c$, "initIsosurface", 
($fz = function (iShape) {
this.setShapeProperty (iShape, "init", this.fullCommand);
this.iToken = 0;
var tok1 = this.tokAt (1);
var tok2 = this.tokAt (2);
if (tok1 == 12291 || tok2 == 12291 && this.tokAt (++this.iToken) == 1048579) {
this.setShapeProperty (iShape, "delete", null);
this.iToken += 2;
if (this.statementLength > this.iToken) {
this.setShapeProperty (iShape, "init", this.fullCommand);
this.setShapeProperty (iShape, "thisID", "+PREVIOUS_MESH+");
}return null;
}this.iToken = 1;
if (!this.setMeshDisplayProperty (iShape, 0, tok1)) {
this.setShapeProperty (iShape, "thisID", "+PREVIOUS_MESH+");
if (iShape != 22) this.setShapeProperty (iShape, "title", [this.thisCommand]);
if (tok1 != 1074790550 && (tok2 == 269484209 || tok1 == 269484209 && this.setMeshDisplayProperty (iShape, 0, tok2))) {
var id = this.setShapeId (iShape, 1, false);
this.iToken++;
return id;
}}return null;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getNextComment", 
($fz = function () {
var nextCommand = this.getCommand (this.pc + 1, false, true);
return (nextCommand.startsWith ("#") ? nextCommand : "");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "listIsosurface", 
($fz = function (iShape) {
this.checkLength23 ();
if (!this.isSyntaxCheck) this.showString (this.getShapeProperty (iShape, "list" + (this.tokAt (2) == 0 ? "" : " " + this.getToken (2).value)));
return true;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "isosurface", 
($fz = function (iShape) {
this.shapeManager.loadShape (iShape);
if (this.tokAt (1) == 1073742001 && this.listIsosurface (iShape)) return;
var iptDisplayProperty = 0;
var isIsosurface = (iShape == 23);
var isPmesh = (iShape == 27);
var isPlot3d = (iShape == 28);
var isLcaoCartoon = (iShape == 25);
var surfaceObjectSeen = false;
var planeSeen = false;
var isMapped = false;
var isBicolor = false;
var isPhased = false;
var doCalcArea = false;
var doCalcVolume = false;
var isCavity = false;
var haveRadius = false;
var toCache = false;
var isFxy = false;
var haveSlab = false;
var haveIntersection = false;
var data = null;
var cmd = null;
var thisSetNumber = -1;
var nFiles = 0;
var nX;
var nY;
var nZ;
var ptX;
var ptY;
var sigma = NaN;
var cutoff = NaN;
var ptWithin = 0;
var smoothing = null;
var smoothingPower = 2147483647;
var bs = null;
var bsSelect = null;
var bsIgnore = null;
var sbCommand =  new org.jmol.util.StringXBuilder ();
var pt;
var plane = null;
var lattice = null;
var pts;
var str = null;
var modelIndex = (this.isSyntaxCheck ? 0 : -2147483648);
this.setCursorWait (true);
var idSeen = (this.initIsosurface (iShape) != null);
var isWild = (idSeen && this.getShapeProperty (iShape, "ID") == null);
var isColorSchemeTranslucent = false;
var isInline;
var onlyOneModel = null;
var translucency = null;
var colorScheme = null;
var mepOrMlp = null;
var discreteColixes = null;
var propertyList =  new java.util.ArrayList ();
var defaultMesh = false;
if (isPmesh || isPlot3d) this.addShapeProperty (propertyList, "fileType", "Pmesh");
for (var i = this.iToken; i < this.statementLength; ++i) {
var propertyName = null;
var propertyValue = null;
this.getToken (i);
if (this.theTok == 1073741824) str = this.parameterAsString (i);
switch (this.theTok) {
case 603979871:
smoothing = (this.getToken (++i).tok == 1048589 ? Boolean.TRUE : this.theTok == 1048588 ? Boolean.FALSE : null);
if (smoothing == null) this.error (22);
continue;
case 553648149:
smoothingPower = this.intParameter (++i);
continue;
case 4128:
propertyName = "moveIsosurface";
if (this.tokAt (++i) != 12) this.error (22);
propertyValue = this.getToken (i++).value;
break;
case 1073742066:
propertyName = "offset";
propertyValue = this.centerParameter (++i);
i = this.iToken;
break;
case 528432:
propertyName = "rotate";
propertyValue = (this.tokAt (this.iToken = ++i) == 1048587 ? null : this.getPoint4f (i));
i = this.iToken;
break;
case 1610612740:
propertyName = "scale3d";
propertyValue = Float.$valueOf (this.floatParameter (++i));
break;
case 1073742090:
sbCommand.append (" periodic");
propertyName = "periodic";
break;
case 1073742078:
case 266298:
case 135266320:
propertyName = this.theToken.value.toString ();
sbCommand.append (" ").appendO (this.theToken.value);
propertyValue = this.centerParameter (++i);
sbCommand.append (" ").append (org.jmol.util.Escape.escape (propertyValue));
i = this.iToken;
break;
case 1679429641:
if (this.fullCommand.indexOf ("# BBOX=") >= 0) {
var bbox = org.jmol.util.TextFormat.split (org.jmol.util.Parser.getQuotedAttribute (this.fullCommand, "# BBOX"), ',');
pts = [org.jmol.util.Escape.unescapePoint (bbox[0]), org.jmol.util.Escape.unescapePoint (bbox[1])];
} else if (this.isCenterParameter (i + 1)) {
pts = [this.getPoint3f (i + 1, true), this.getPoint3f (this.iToken + 1, true)];
i = this.iToken;
} else {
pts = this.viewer.getBoundBoxVertices ();
}sbCommand.append (" boundBox " + org.jmol.util.Escape.escapePt (pts[0]) + " " + org.jmol.util.Escape.escapePt (pts[pts.length - 1]));
propertyName = "boundingBox";
propertyValue = pts;
break;
case 135188:
isPmesh = true;
sbCommand.append (" pmesh");
propertyName = "fileType";
propertyValue = "Pmesh";
break;
case 135267842:
bsSelect = this.atomExpressionAt (++i);
if (this.isSyntaxCheck) {
bs =  new org.jmol.util.BitSet ();
} else if (this.tokAt (this.iToken + 1) == 1048577 || this.tokAt (this.iToken + 1) == 10) {
bs = this.atomExpressionAt (++this.iToken);
bs.and (this.viewer.getAtomsWithinRadius (5.0, bsSelect, false, null));
} else {
bs = this.viewer.getAtomsWithinRadius (5.0, bsSelect, true, null);
bs.andNot (this.viewer.getAtomBits (1095761934, bsSelect));
}bs.andNot (bsSelect);
sbCommand.append (" intersection ").append (org.jmol.util.Escape.escape (bsSelect)).append (" ").append (org.jmol.util.Escape.escape (bs));
i = this.iToken;
if (this.tokAt (i + 1) == 135368713) {
i++;
var f = this.getToken (++i).value;
sbCommand.append (" function ").append (org.jmol.util.Escape.escapeStr (f));
if (!this.isSyntaxCheck) this.addShapeProperty (propertyList, "func", (f.equals ("a+b") || f.equals ("a-b") ? f : this.createFunction ("__iso__", "a,b", f)));
} else {
haveIntersection = true;
}propertyName = "intersection";
propertyValue = [bsSelect, bs];
break;
case 1610625028:
case 135266324:
var isDisplay = (this.theTok == 1610625028);
if (isDisplay) {
sbCommand.append (" display");
iptDisplayProperty = i;
var tok = this.tokAt (i + 1);
if (tok == 0) continue;
i++;
this.addShapeProperty (propertyList, "token", Integer.$valueOf (1048589));
if (tok == 10 || tok == 1048579) {
propertyName = "bsDisplay";
if (tok == 1048579) {
sbCommand.append (" all");
} else {
propertyValue = this.statement[i].value;
sbCommand.append (" ").append (org.jmol.util.Escape.escape (propertyValue));
}this.checkLast (i);
break;
} else if (tok != 135266324) {
this.iToken = i;
this.error (22);
}} else {
ptWithin = i;
}var distance;
var ptc = null;
bs = null;
var havePt = false;
if (this.tokAt (i + 1) == 1048577) {
distance = this.floatParameter (i + 3);
if (this.isPoint3f (i + 4)) {
ptc = this.centerParameter (i + 4);
havePt = true;
this.iToken = this.iToken + 2;
} else if (this.isPoint3f (i + 5)) {
ptc = this.centerParameter (i + 5);
havePt = true;
this.iToken = this.iToken + 2;
} else {
bs = this.atomExpression (this.statement, i + 5, this.statementLength, true, false, false, true);
if (bs == null) this.error (22);
}} else {
distance = this.floatParameter (++i);
ptc = this.centerParameter (++i);
}if (isDisplay) this.checkLast (this.iToken);
i = this.iToken;
if (this.fullCommand.indexOf ("# WITHIN=") >= 0) bs = org.jmol.util.Escape.unescapeBitset (org.jmol.util.Parser.getQuotedAttribute (this.fullCommand, "# WITHIN"));
 else if (!havePt) bs = (Clazz.instanceOf (this.expressionResult, org.jmol.util.BitSet) ? this.expressionResult : null);
if (!this.isSyntaxCheck) {
if (bs != null && modelIndex >= 0) {
bs.and (this.viewer.getModelUndeletedAtomsBitSet (modelIndex));
}if (ptc == null) ptc = this.viewer.getAtomSetCenter (bs);
this.getWithinDistanceVector (propertyList, distance, ptc, bs, isDisplay);
sbCommand.append (" within ").appendF (distance).append (" ").append (bs == null ? org.jmol.util.Escape.escapePt (ptc) : org.jmol.util.Escape.escape (bs));
}continue;
case 1073742083:
propertyName = "parameters";
var fparams = this.floatParameterSet (++i, 1, 10);
i = this.iToken;
propertyValue = fparams;
sbCommand.append (" parameters ").append (org.jmol.util.Escape.escape (fparams));
break;
case 1716520973:
case 1073742190:
onlyOneModel = this.theToken.value;
var isVariable = (this.theTok == 1073742190);
if (mepOrMlp == null) {
if (!surfaceObjectSeen && !isMapped && !planeSeen) {
this.addShapeProperty (propertyList, "sasurface", Float.$valueOf (0));
sbCommand.append (" vdw");
surfaceObjectSeen = true;
}propertyName = "property";
if (smoothing == null) smoothing = this.viewer.getIsosurfacePropertySmoothing (false) == 1 ? Boolean.TRUE : Boolean.FALSE;
this.addShapeProperty (propertyList, "propertySmoothing", smoothing);
sbCommand.append (" isosurfacePropertySmoothing " + smoothing);
if (smoothingPower == 2147483647) smoothingPower = this.viewer.getIsosurfacePropertySmoothing (true);
this.addShapeProperty (propertyList, "propertySmoothingPower", Integer.$valueOf (smoothingPower));
if (smoothing === Boolean.TRUE) sbCommand.append (" isosurfacePropertySmoothingPower " + smoothingPower);
if (this.viewer.isRangeSelected ()) this.addShapeProperty (propertyList, "rangeSelected", Boolean.TRUE);
} else {
propertyName = mepOrMlp;
}str = this.parameterAsString (i);
sbCommand.append (" ").append (str);
if (str.toLowerCase ().indexOf ("property_") == 0) {
data =  Clazz.newFloatArray (this.viewer.getAtomCount (), 0);
if (this.isSyntaxCheck) continue;
data = this.viewer.getDataFloat (str);
if (data == null) this.error (22);
this.addShapeProperty (propertyList, propertyName, data);
continue;
}var atomCount = this.viewer.getAtomCount ();
data =  Clazz.newFloatArray (atomCount, 0);
if (isVariable) {
var vname = this.parameterAsString (++i);
if (vname.length == 0) {
data = this.floatParameterSet (i, atomCount, atomCount);
} else {
data =  Clazz.newFloatArray (atomCount, 0);
if (!this.isSyntaxCheck) org.jmol.util.Parser.parseStringInfestedFloatArray ("" + this.getParameter (vname, 4), null, data);
}if (!this.isSyntaxCheck) sbCommand.append (" \"\" ").append (org.jmol.util.Escape.escape (data));
} else {
var tokProperty = this.getToken (++i).tok;
if (!this.isSyntaxCheck) {
sbCommand.append (" " + this.theToken.value);
var atoms = this.viewer.getModelSet ().atoms;
this.viewer.autoCalculate (tokProperty);
for (var iAtom = atomCount; --iAtom >= 0; ) data[iAtom] = org.jmol.modelset.Atom.atomPropertyFloat (this.viewer, atoms[iAtom], tokProperty);

}if (tokProperty == 1766856708) colorScheme = "colorRGB";
if (this.tokAt (i + 1) == 135266324) {
var d = this.floatParameter (i = i + 2);
sbCommand.append (" within " + d);
this.addShapeProperty (propertyList, "propertyDistanceMax", Float.$valueOf (d));
}}propertyValue = data;
break;
case 1095766028:
if (surfaceObjectSeen) this.error (22);
modelIndex = this.modelNumberParameter (++i);
sbCommand.append (" model " + modelIndex);
if (modelIndex < 0) {
propertyName = "fixed";
propertyValue = Boolean.TRUE;
break;
}propertyName = "modelIndex";
propertyValue = Integer.$valueOf (modelIndex);
break;
case 135280132:
propertyName = "select";
var bs1 = this.atomExpressionAt (++i);
propertyValue = bs1;
i = this.iToken;
var isOnly = (this.tokAt (i + 1) == 1073742072);
if (isOnly) {
i++;
var bs2 = org.jmol.util.BitSetUtil.copy (bs1);
org.jmol.util.BitSetUtil.invertInPlace (bs2, this.viewer.getAtomCount ());
this.addShapeProperty (propertyList, "ignore", bs2);
sbCommand.append (" ignore ").append (org.jmol.util.Escape.escape (bs2));
}if (surfaceObjectSeen || isMapped) {
sbCommand.append (" select " + org.jmol.util.Escape.escape (propertyValue));
} else {
bsSelect = propertyValue;
if (modelIndex < 0 && bsSelect.nextSetBit (0) >= 0) modelIndex = this.viewer.getAtomModelIndex (bsSelect.nextSetBit (0));
}break;
case 1085443:
thisSetNumber = this.intParameter (++i);
break;
case 12289:
propertyName = "center";
propertyValue = this.centerParameter (++i);
sbCommand.append (" center " + org.jmol.util.Escape.escape (propertyValue));
i = this.iToken;
break;
case 1073742147:
case 1766856708:
var color;
idSeen = true;
var isSign = (this.theTok == 1073742147);
if (isSign) {
sbCommand.append (" sign");
this.addShapeProperty (propertyList, "sign", Boolean.TRUE);
} else {
if (this.tokAt (i + 1) == 1073741914) {
i++;
propertyName = "colorDensity";
sbCommand.append (" color density");
break;
}if (this.getToken (i + 1).tok == 4) {
colorScheme = this.parameterAsString (++i);
if (colorScheme.indexOf (" ") > 0) {
discreteColixes = org.jmol.util.Colix.getColixArray (colorScheme);
if (discreteColixes == null) this.error (4);
}} else if (this.theTok == 1073742018) {
i++;
sbCommand.append (" color mesh");
color = this.getArgbParam (++i);
this.addShapeProperty (propertyList, "meshcolor", Integer.$valueOf (color));
sbCommand.append (" ").append (org.jmol.util.Escape.escapeColor (color));
i = this.iToken;
continue;
}if ((this.theTok = this.tokAt (i + 1)) == 1073742180 || this.theTok == 1073742074) {
sbCommand.append (" color");
translucency = this.setColorOptions (sbCommand, i + 1, 23, -2);
i = this.iToken;
continue;
}switch (this.tokAt (i + 1)) {
case 1073741826:
case 1073742114:
this.getToken (++i);
sbCommand.append (" color range");
this.addShapeProperty (propertyList, "rangeAll", null);
if (this.tokAt (i + 1) == 1048579) {
i++;
sbCommand.append (" all");
continue;
}var min = this.floatParameter (++i);
var max = this.floatParameter (++i);
this.addShapeProperty (propertyList, "red", Float.$valueOf (min));
this.addShapeProperty (propertyList, "blue", Float.$valueOf (max));
sbCommand.append (" ").appendF (min).append (" ").appendF (max);
continue;
}
if (this.isColorParam (i + 1)) {
color = this.getArgbParam (i + 1);
if (this.tokAt (i + 2) == 1074790746) {
colorScheme = this.getColorRange (i + 1);
i = this.iToken;
break;
}}sbCommand.append (" color");
}if (this.isColorParam (i + 1)) {
color = this.getArgbParam (++i);
sbCommand.append (" ").append (org.jmol.util.Escape.escapeColor (color));
i = this.iToken;
this.addShapeProperty (propertyList, "colorRGB", Integer.$valueOf (color));
idSeen = true;
if (this.isColorParam (i + 1)) {
color = this.getArgbParam (++i);
i = this.iToken;
this.addShapeProperty (propertyList, "colorRGB", Integer.$valueOf (color));
sbCommand.append (" ").append (org.jmol.util.Escape.escapeColor (color));
isBicolor = true;
} else if (isSign) {
this.error (23);
}} else if (!isSign && discreteColixes == null) {
this.error (23);
}continue;
case 135270422:
if (!isIsosurface) this.error (22);
toCache = !this.isSyntaxCheck;
continue;
case 1229984263:
if (this.tokAt (i + 1) != 4) this.error (23);
continue;
case 1112541195:
case 1649412112:
sbCommand.append (" ").appendO (this.theToken.value);
var rd = this.encodeRadiusParameter (i, false, true);
sbCommand.append (" ").appendO (rd);
if (Float.isNaN (rd.value)) rd.value = 100;
propertyValue = rd;
propertyName = "radius";
haveRadius = true;
if (isMapped) surfaceObjectSeen = false;
i = this.iToken;
break;
case 135266319:
planeSeen = true;
propertyName = "plane";
propertyValue = this.planeParameter (++i);
i = this.iToken;
sbCommand.append (" plane ").append (org.jmol.util.Escape.escape (propertyValue));
break;
case 1073742138:
propertyName = "scale";
propertyValue = Float.$valueOf (this.floatParameter (++i));
sbCommand.append (" scale ").appendO (propertyValue);
break;
case 1048579:
if (idSeen) this.error (22);
propertyName = "thisID";
break;
case 1113198596:
surfaceObjectSeen = true;
++i;
try {
propertyValue = this.getPoint4f (i);
propertyName = "ellipsoid";
i = this.iToken;
sbCommand.append (" ellipsoid ").append (org.jmol.util.Escape.escape (propertyValue));
break;
} catch (e) {
if (Clazz.exceptionOf (e, org.jmol.script.ScriptException)) {
} else {
throw e;
}
}
try {
propertyName = "ellipsoid";
propertyValue = this.floatParameterSet (i, 6, 6);
i = this.iToken;
sbCommand.append (" ellipsoid ").append (org.jmol.util.Escape.escape (propertyValue));
break;
} catch (e) {
if (Clazz.exceptionOf (e, org.jmol.script.ScriptException)) {
} else {
throw e;
}
}
bs = this.atomExpressionAt (i);
sbCommand.append (" ellipsoid ").append (org.jmol.util.Escape.escape (bs));
var iAtom = bs.nextSetBit (0);
var atoms = this.viewer.getModelSet ().atoms;
if (iAtom >= 0) propertyValue = atoms[iAtom].getEllipsoid ();
if (propertyValue == null) return;
i = this.iToken;
propertyName = "ellipsoid";
if (!this.isSyntaxCheck) this.addShapeProperty (propertyList, "center", this.viewer.getAtomPoint3f (iAtom));
break;
case 135267841:
planeSeen = true;
propertyName = "plane";
propertyValue = this.hklParameter (++i);
i = this.iToken;
sbCommand.append (" plane ").append (org.jmol.util.Escape.escape (propertyValue));
break;
case 135182:
surfaceObjectSeen = true;
var lcaoType = this.parameterAsString (++i);
this.addShapeProperty (propertyList, "lcaoType", lcaoType);
sbCommand.append (" lcaocartoon ").append (org.jmol.util.Escape.escapeStr (lcaoType));
switch (this.getToken (++i).tok) {
case 10:
case 1048577:
propertyName = "lcaoCartoon";
bs = this.atomExpressionAt (i);
i = this.iToken;
if (this.isSyntaxCheck) continue;
var atomIndex = bs.nextSetBit (0);
if (atomIndex < 0) this.error (14);
sbCommand.append (" ({").appendI (atomIndex).append ("})");
modelIndex = this.viewer.getAtomModelIndex (atomIndex);
this.addShapeProperty (propertyList, "modelIndex", Integer.$valueOf (modelIndex));
var axes = [ new org.jmol.util.Vector3f (),  new org.jmol.util.Vector3f (), org.jmol.util.Vector3f.newV (this.viewer.getAtomPoint3f (atomIndex)),  new org.jmol.util.Vector3f ()];
if (!lcaoType.equalsIgnoreCase ("s") && this.viewer.getHybridizationAndAxes (atomIndex, axes[0], axes[1], lcaoType) == null) return;
propertyValue = axes;
break;
default:
this.error (14);
}
break;
case 1183762:
var moNumber = 2147483647;
var offset = 2147483647;
var isNegOffset = (this.tokAt (i + 1) == 269484192);
if (isNegOffset) i++;
var linearCombination = null;
switch (this.tokAt (++i)) {
case 0:
this.error (2);
break;
case 1073741973:
case 1073742008:
offset = this.moOffset (i);
moNumber = 0;
i = this.iToken;
sbCommand.append (" mo " + (isNegOffset ? "-" : "") + "HOMO ");
if (offset > 0) sbCommand.append ("+");
if (offset != 0) sbCommand.appendI (offset);
break;
case 2:
moNumber = this.intParameter (i);
sbCommand.append (" mo ").appendI (moNumber);
break;
default:
if (this.isArrayParameter (i)) {
linearCombination = this.floatParameterSet (i, 2, 2147483647);
i = this.iToken;
}}
if (this.tokAt (i + 1) == 135266320) {
++i;
var monteCarloCount = this.intParameter (++i);
var seed = (this.tokAt (i + 1) == 2 ? this.intParameter (++i) : (-System.currentTimeMillis ()) % 10000);
this.addShapeProperty (propertyList, "monteCarloCount", Integer.$valueOf (monteCarloCount));
this.addShapeProperty (propertyList, "randomSeed", Integer.$valueOf (seed));
sbCommand.append (" points ").appendI (monteCarloCount).appendC (' ').appendI (seed);
}this.setMoData (propertyList, moNumber, linearCombination, offset, isNegOffset, modelIndex, null);
surfaceObjectSeen = true;
continue;
case 1073742036:
propertyName = "nci";
sbCommand.append (" " + propertyName);
var tok = this.tokAt (i + 1);
var isPromolecular = (tok != 1229984263 && tok != 4 && tok != 1073742033);
propertyValue = Boolean.$valueOf (isPromolecular);
if (isPromolecular) surfaceObjectSeen = true;
break;
case 1073742016:
case 1073742022:
var isMep = (this.theTok == 1073742016);
propertyName = (isMep ? "mep" : "mlp");
sbCommand.append (" " + propertyName);
var fname = null;
var calcType = -1;
surfaceObjectSeen = true;
if (this.tokAt (i + 1) == 2) {
calcType = this.intParameter (++i);
sbCommand.append (" " + calcType);
this.addShapeProperty (propertyList, "mepCalcType", Integer.$valueOf (calcType));
}if (this.tokAt (i + 1) == 4) {
fname = this.stringParameter (++i);
sbCommand.append (" /*file*/" + org.jmol.util.Escape.escapeStr (fname));
} else if (this.tokAt (i + 1) == 1716520973) {
mepOrMlp = propertyName;
continue;
}if (!this.isSyntaxCheck) try {
data = (fname == null && isMep ? this.viewer.getPartialCharges () : this.viewer.getAtomicPotentials (isMep, bsSelect, bsIgnore, fname));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
if (!this.isSyntaxCheck && data == null) this.error (32);
propertyValue = data;
break;
case 1313866247:
doCalcVolume = !this.isSyntaxCheck;
sbCommand.append (" volume");
break;
case 1074790550:
this.setShapeId (iShape, ++i, idSeen);
isWild = (this.getShapeProperty (iShape, "ID") == null);
i = this.iToken;
break;
case 1073741888:
if (this.tokAt (i + 1) == 1073742180) {
isColorSchemeTranslucent = true;
i++;
}colorScheme = this.parameterAsString (++i).toLowerCase ();
if (colorScheme.equals ("sets")) {
sbCommand.append (" colorScheme \"sets\"");
} else if (this.isColorParam (i)) {
colorScheme = this.getColorRange (i);
i = this.iToken;
}break;
case 1073741828:
propertyName = "addHydrogens";
propertyValue = Boolean.TRUE;
sbCommand.append (" addHydrogens");
break;
case 1073741836:
propertyName = "angstroms";
sbCommand.append (" angstroms");
break;
case 1073741838:
propertyName = "anisotropy";
propertyValue = this.getPoint3f (++i, false);
sbCommand.append (" anisotropy").append (org.jmol.util.Escape.escapePt (propertyValue));
i = this.iToken;
break;
case 1073741842:
doCalcArea = !this.isSyntaxCheck;
sbCommand.append (" area");
break;
case 1073741850:
case 1073742076:
surfaceObjectSeen = true;
if (isBicolor && !isPhased) {
sbCommand.append (" phase \"_orb\"");
this.addShapeProperty (propertyList, "phase", "_orb");
}var nlmZprs =  Clazz.newFloatArray (7, 0);
nlmZprs[0] = this.intParameter (++i);
nlmZprs[1] = this.intParameter (++i);
nlmZprs[2] = this.intParameter (++i);
nlmZprs[3] = (this.isFloatParameter (i + 1) ? this.floatParameter (++i) : 6);
sbCommand.append (" atomicOrbital ").appendI (Clazz.floatToInt (nlmZprs[0])).append (" ").appendI (Clazz.floatToInt (nlmZprs[1])).append (" ").appendI (Clazz.floatToInt (nlmZprs[2])).append (" ").appendF (nlmZprs[3]);
if (this.tokAt (i + 1) == 135266320) {
i += 2;
nlmZprs[4] = this.intParameter (i);
nlmZprs[5] = (this.tokAt (i + 1) == 3 ? this.floatParameter (++i) : 0);
nlmZprs[6] = (this.tokAt (i + 1) == 2 ? this.intParameter (++i) : (-System.currentTimeMillis ()) % 10000);
sbCommand.append (" points ").appendI (Clazz.floatToInt (nlmZprs[4])).appendC (' ').appendF (nlmZprs[5]).appendC (' ').appendI (Clazz.floatToInt (nlmZprs[6]));
}propertyName = "hydrogenOrbital";
propertyValue = nlmZprs;
break;
case 1073741866:
sbCommand.append (" binary");
continue;
case 1073741868:
sbCommand.append (" blockData");
propertyName = "blockData";
propertyValue = Boolean.TRUE;
break;
case 1074790451:
case 554176565:
haveSlab = true;
propertyName = this.theToken.value;
propertyValue = this.getCapSlabObject (i, false);
i = this.iToken;
break;
case 1073741876:
if (!isIsosurface) this.error (22);
isCavity = true;
if (this.isSyntaxCheck) continue;
var cavityRadius = (this.isFloatParameter (i + 1) ? this.floatParameter (++i) : 1.2);
var envelopeRadius = (this.isFloatParameter (i + 1) ? this.floatParameter (++i) : 10);
if (envelopeRadius > 10) this.integerOutOfRange (0, 10);
sbCommand.append (" cavity ").appendF (cavityRadius).append (" ").appendF (envelopeRadius);
this.addShapeProperty (propertyList, "envelopeRadius", Float.$valueOf (envelopeRadius));
this.addShapeProperty (propertyList, "cavityRadius", Float.$valueOf (cavityRadius));
propertyName = "cavity";
break;
case 1073741896:
case 1073741900:
propertyName = "contour";
sbCommand.append (" contour");
switch (this.tokAt (i + 1)) {
case 1073741920:
propertyValue = this.floatParameterSet (i + 2, 1, 2147483647);
sbCommand.append (" discrete ").append (org.jmol.util.Escape.escape (propertyValue));
i = this.iToken;
break;
case 1073741981:
pt = this.getPoint3f (i + 2, false);
if (pt.z <= 0 || pt.y < pt.x) this.error (22);
if (pt.z == Clazz.floatToInt (pt.z) && pt.z > (pt.y - pt.x)) pt.z = (pt.y - pt.x) / pt.z;
propertyValue = pt;
i = this.iToken;
sbCommand.append (" increment ").append (org.jmol.util.Escape.escapePt (pt));
break;
default:
propertyValue = Integer.$valueOf (this.tokAt (i + 1) == 2 ? this.intParameter (++i) : 0);
sbCommand.append (" ").appendO (propertyValue);
}
break;
case 3:
case 2:
case 269484193:
case 1073741910:
sbCommand.append (" cutoff ");
if (this.theTok == 1073741910) i++;
if (this.tokAt (i) == 269484193) {
propertyName = "cutoffPositive";
propertyValue = Float.$valueOf (cutoff = this.floatParameter (++i));
sbCommand.append ("+").appendO (propertyValue);
} else if (this.isFloatParameter (i)) {
propertyName = "cutoff";
propertyValue = Float.$valueOf (cutoff = this.floatParameter (i));
sbCommand.appendO (propertyValue);
} else {
propertyName = "cutoffRange";
propertyValue = this.floatParameterSet (i, 2, 2);
this.addShapeProperty (propertyList, "cutoff", Float.$valueOf (0));
sbCommand.append (org.jmol.util.Escape.escape (propertyValue));
i = this.iToken;
}break;
case 1073741928:
propertyName = "downsample";
propertyValue = Integer.$valueOf (this.intParameter (++i));
sbCommand.append (" downsample ").appendO (propertyValue);
break;
case 1073741930:
propertyName = "eccentricity";
propertyValue = this.getPoint4f (++i);
sbCommand.append (" eccentricity ").append (org.jmol.util.Escape.escape (propertyValue));
i = this.iToken;
break;
case 1074790508:
sbCommand.append (" ed");
this.setMoData (propertyList, -1, null, 0, false, modelIndex, null);
surfaceObjectSeen = true;
continue;
case 536870916:
case 1073742041:
sbCommand.append (" ").appendO (this.theToken.value);
propertyName = "debug";
propertyValue = (this.theTok == 536870916 ? Boolean.TRUE : Boolean.FALSE);
break;
case 1060869:
sbCommand.append (" fixed");
propertyName = "fixed";
propertyValue = Boolean.TRUE;
break;
case 1073741962:
sbCommand.append (" fullPlane");
propertyName = "fullPlane";
propertyValue = Boolean.TRUE;
break;
case 1073741966:
case 1073741968:
var isFxyz = (this.theTok == 1073741968);
propertyName = "" + this.theToken.value;
var vxy =  new java.util.ArrayList ();
propertyValue = vxy;
isFxy = surfaceObjectSeen = true;
sbCommand.append (" ").append (propertyName);
var name = this.parameterAsString (++i);
if (name.equals ("=")) {
sbCommand.append (" =");
name = this.parameterAsString (++i);
sbCommand.append (" ").append (org.jmol.util.Escape.escapeStr (name));
vxy.add (name);
if (!this.isSyntaxCheck) this.addShapeProperty (propertyList, "func", this.createFunction ("__iso__", "x,y,z", name));
break;
}var dName = org.jmol.util.Parser.getQuotedAttribute (this.fullCommand, "# DATA" + (isFxy ? "2" : ""));
if (dName == null) dName = "inline";
 else name = dName;
var isXYZ = (name.indexOf ("data2d_") == 0);
var isXYZV = (name.indexOf ("data3d_") == 0);
isInline = name.equals ("inline");
sbCommand.append (" inline");
vxy.add (name);
var pt3 = this.getPoint3f (++i, false);
sbCommand.append (" ").append (org.jmol.util.Escape.escapePt (pt3));
vxy.add (pt3);
var pt4;
ptX = ++this.iToken;
vxy.add (pt4 = this.getPoint4f (ptX));
sbCommand.append (" ").append (org.jmol.util.Escape.escape (pt4));
nX = Clazz.floatToInt (pt4.x);
ptY = ++this.iToken;
vxy.add (pt4 = this.getPoint4f (ptY));
sbCommand.append (" ").append (org.jmol.util.Escape.escape (pt4));
nY = Clazz.floatToInt (pt4.x);
vxy.add (pt4 = this.getPoint4f (++this.iToken));
sbCommand.append (" ").append (org.jmol.util.Escape.escape (pt4));
nZ = Clazz.floatToInt (pt4.x);
if (nX == 0 || nY == 0 || nZ == 0) this.error (22);
if (!this.isSyntaxCheck) {
var fdata = null;
var xyzdata = null;
if (isFxyz) {
if (isInline) {
nX = Math.abs (nX);
nY = Math.abs (nY);
nZ = Math.abs (nZ);
xyzdata = this.floatArraySetXYZ (++this.iToken, nX, nY, nZ);
} else if (isXYZV) {
xyzdata = this.viewer.getDataFloat3D (name);
} else {
xyzdata = this.viewer.functionXYZ (name, nX, nY, nZ);
}nX = Math.abs (nX);
nY = Math.abs (nY);
nZ = Math.abs (nZ);
if (xyzdata == null) {
this.iToken = ptX;
this.errorStr (53, "xyzdata is null.");
}if (xyzdata.length != nX || xyzdata[0].length != nY || xyzdata[0][0].length != nZ) {
this.iToken = ptX;
this.errorStr (53, "xyzdata[" + xyzdata.length + "][" + xyzdata[0].length + "][" + xyzdata[0][0].length + "] is not of size [" + nX + "][" + nY + "][" + nZ + "]");
}vxy.add (xyzdata);
sbCommand.append (" ").append (org.jmol.util.Escape.escape (xyzdata));
} else {
if (isInline) {
nX = Math.abs (nX);
nY = Math.abs (nY);
fdata = this.floatArraySet (++this.iToken, nX, nY);
} else if (isXYZ) {
fdata = this.viewer.getDataFloat2D (name);
nX = (fdata == null ? 0 : fdata.length);
nY = 3;
} else {
fdata = this.viewer.functionXY (name, nX, nY);
nX = Math.abs (nX);
nY = Math.abs (nY);
}if (fdata == null) {
this.iToken = ptX;
this.errorStr (53, "fdata is null.");
}if (fdata.length != nX && !isXYZ) {
this.iToken = ptX;
this.errorStr (53, "fdata length is not correct: " + fdata.length + " " + nX + ".");
}for (var j = 0; j < nX; j++) {
if (fdata[j] == null) {
this.iToken = ptY;
this.errorStr (53, "fdata[" + j + "] is null.");
}if (fdata[j].length != nY) {
this.iToken = ptY;
this.errorStr (53, "fdata[" + j + "] is not the right length: " + fdata[j].length + " " + nY + ".");
}}
vxy.add (fdata);
sbCommand.append (" ").append (org.jmol.util.Escape.escape (fdata));
}}i = this.iToken;
break;
case 1073741970:
propertyName = "gridPoints";
sbCommand.append (" gridPoints");
break;
case 1073741976:
propertyName = "ignore";
propertyValue = bsIgnore = this.atomExpressionAt (++i);
sbCommand.append (" ignore ").append (org.jmol.util.Escape.escape (propertyValue));
i = this.iToken;
break;
case 1073741984:
propertyName = "insideOut";
sbCommand.append (" insideout");
break;
case 1073741988:
case 1073741986:
case 1073742100:
sbCommand.append (" ").appendO (this.theToken.value);
propertyName = "pocket";
propertyValue = (this.theTok == 1073742100 ? Boolean.TRUE : Boolean.FALSE);
break;
case 1073742002:
propertyName = "lobe";
propertyValue = this.getPoint4f (++i);
i = this.iToken;
sbCommand.append (" lobe ").append (org.jmol.util.Escape.escape (propertyValue));
surfaceObjectSeen = true;
break;
case 1073742004:
case 1073742006:
propertyName = "lp";
propertyValue = this.getPoint4f (++i);
i = this.iToken;
sbCommand.append (" lp ").append (org.jmol.util.Escape.escape (propertyValue));
surfaceObjectSeen = true;
break;
case 1052700:
if (isMapped || this.statementLength == i + 1) this.error (22);
isMapped = true;
if ((isCavity || haveRadius || haveIntersection) && !surfaceObjectSeen) {
surfaceObjectSeen = true;
this.addShapeProperty (propertyList, "bsSolvent", (haveRadius || haveIntersection ?  new org.jmol.util.BitSet () : this.lookupIdentifierValue ("solvent")));
this.addShapeProperty (propertyList, "sasurface", Float.$valueOf (0));
}if (sbCommand.length () == 0) {
plane = this.getShapeProperty (23, "plane");
if (plane == null) {
if (this.getShapeProperty (23, "contours") != null) {
this.addShapeProperty (propertyList, "nocontour", null);
}} else {
this.addShapeProperty (propertyList, "plane", plane);
sbCommand.append ("plane ").append (org.jmol.util.Escape.escape (plane));
planeSeen = true;
plane = null;
}} else if (!surfaceObjectSeen && !planeSeen) {
this.error (22);
}sbCommand.append ("; isosurface map");
this.addShapeProperty (propertyList, "map", (surfaceObjectSeen ? Boolean.TRUE : Boolean.FALSE));
break;
case 1073742014:
propertyName = "maxset";
propertyValue = Integer.$valueOf (this.intParameter (++i));
sbCommand.append (" maxSet ").appendO (propertyValue);
break;
case 1073742020:
propertyName = "minset";
propertyValue = Integer.$valueOf (this.intParameter (++i));
sbCommand.append (" minSet ").appendO (propertyValue);
break;
case 1073742112:
surfaceObjectSeen = true;
propertyName = "rad";
propertyValue = this.getPoint4f (++i);
i = this.iToken;
sbCommand.append (" radical ").append (org.jmol.util.Escape.escape (propertyValue));
break;
case 1073742028:
propertyName = "fixed";
propertyValue = Boolean.FALSE;
sbCommand.append (" modelBased");
break;
case 1073742030:
case 1073742136:
case 1613758488:
onlyOneModel = this.theToken.value;
var radius;
if (this.theTok == 1073742030) {
propertyName = "molecular";
sbCommand.append (" molecular");
radius = 1.4;
} else {
this.addShapeProperty (propertyList, "bsSolvent", this.lookupIdentifierValue ("solvent"));
propertyName = (this.theTok == 1073742136 ? "sasurface" : "solvent");
sbCommand.append (" ").appendO (this.theToken.value);
radius = (this.isFloatParameter (i + 1) ? this.floatParameter (++i) : this.viewer.getSolventProbeRadius ());
sbCommand.append (" ").appendF (radius);
}propertyValue = Float.$valueOf (radius);
if (this.tokAt (i + 1) == 1073741961) {
this.addShapeProperty (propertyList, "doFullMolecular", null);
sbCommand.append (" full");
i++;
}surfaceObjectSeen = true;
break;
case 1073742033:
this.addShapeProperty (propertyList, "fileType", "MRC");
sbCommand.append (" mrc");
continue;
case 1073742064:
case 1073742062:
this.addShapeProperty (propertyList, "fileType", "Obj");
sbCommand.append (" obj");
continue;
case 1073742034:
this.addShapeProperty (propertyList, "fileType", "Msms");
sbCommand.append (" msms");
continue;
case 1073742094:
if (surfaceObjectSeen) this.error (22);
propertyName = "phase";
isPhased = true;
propertyValue = (this.tokAt (i + 1) == 4 ? this.stringParameter (++i) : "_orb");
sbCommand.append (" phase ").append (org.jmol.util.Escape.escape (propertyValue));
break;
case 1073742104:
case 1073742122:
propertyName = "resolution";
propertyValue = Float.$valueOf (this.floatParameter (++i));
sbCommand.append (" resolution ").appendO (propertyValue);
break;
case 1073742124:
propertyName = "reverseColor";
propertyValue = Boolean.TRUE;
sbCommand.append (" reversecolor");
break;
case 1073742146:
propertyName = "sigma";
propertyValue = Float.$valueOf (sigma = this.floatParameter (++i));
sbCommand.append (" sigma ").appendO (propertyValue);
break;
case 1073742154:
propertyName = "sphere";
propertyValue = Float.$valueOf (this.floatParameter (++i));
sbCommand.append (" sphere ").appendO (propertyValue);
surfaceObjectSeen = true;
break;
case 1073742156:
propertyName = "squareData";
propertyValue = Boolean.TRUE;
sbCommand.append (" squared");
break;
case 1073741983:
case 4:
var filename = this.parameterAsString (i);
var sType = null;
isInline = filename.equalsIgnoreCase ("inline");
if (this.tokAt (i + 1) == 4) {
sType = this.stringParameter (++i);
if (!isInline) this.addShapeProperty (propertyList, "calculationType", sType);
}var firstPass = (!surfaceObjectSeen && !planeSeen);
propertyName = (firstPass ? "readFile" : "mapColor");
if (isInline) {
if (sType == null) this.error (22);
if (isPmesh) sType = org.jmol.util.TextFormat.replaceAllCharacter (sType, "{,}|", ' ');
if (this.logMessages) org.jmol.util.Logger.debug ("pmesh inline data:\n" + sType);
propertyValue = (this.isSyntaxCheck ? null : sType);
this.addShapeProperty (propertyList, "fileName", "");
sbCommand.append (" INLINE");
surfaceObjectSeen = true;
} else {
if (filename.startsWith ("=") && filename.length > 1) {
var info = this.viewer.setLoadFormat (filename, '_', false);
filename = info[0];
var strCutoff = (!firstPass || !Float.isNaN (cutoff) ? null : info[1]);
if (strCutoff != null && !this.isSyntaxCheck) {
cutoff = org.jmol.script.ScriptVariable.fValue (org.jmol.script.ScriptVariable.getVariable (this.viewer.evaluateExpression (strCutoff)));
if (cutoff > 0) {
if (!Float.isNaN (sigma)) {
cutoff *= sigma;
sigma = NaN;
this.addShapeProperty (propertyList, "sigma", Float.$valueOf (sigma));
}this.addShapeProperty (propertyList, "cutoff", Float.$valueOf (cutoff));
sbCommand.append (" cutoff ").appendF (cutoff);
}}if (ptWithin == 0) {
onlyOneModel = "=xxxx";
if (modelIndex < 0) modelIndex = this.viewer.getCurrentModelIndex ();
bs = this.viewer.getModelUndeletedAtomsBitSet (modelIndex);
this.getWithinDistanceVector (propertyList, 2.0, null, bs, false);
sbCommand.append (" within 2.0 ").append (org.jmol.util.Escape.escape (bs));
}if (firstPass) defaultMesh = true;
}if (firstPass && this.viewer.getParameter ("_fileType").equals ("Pdb") && Float.isNaN (sigma) && Float.isNaN (cutoff)) {
this.addShapeProperty (propertyList, "sigma", Float.$valueOf (-1));
sbCommand.append (" sigma -1.0");
}if (filename.equals ("TESTDATA") && org.jmol.script.ScriptEvaluator.testData != null) {
propertyValue = org.jmol.script.ScriptEvaluator.testData;
break;
}if (filename.equals ("TESTDATA2") && org.jmol.script.ScriptEvaluator.testData2 != null) {
propertyValue = org.jmol.script.ScriptEvaluator.testData2;
break;
}if (filename.length == 0) {
if (modelIndex < 0) modelIndex = this.viewer.getCurrentModelIndex ();
if (surfaceObjectSeen || planeSeen) propertyValue = this.viewer.getModelAuxiliaryInfoValue (modelIndex, "jmolMappedDataInfo");
if (propertyValue == null) propertyValue = this.viewer.getModelAuxiliaryInfoValue (modelIndex, "jmolSurfaceInfo");
if (propertyValue != null) {
surfaceObjectSeen = true;
break;
}filename = this.getFullPathName ();
}var fileIndex = -1;
if (this.tokAt (i + 1) == 2) this.addShapeProperty (propertyList, "fileIndex", Integer.$valueOf (fileIndex = this.intParameter (++i)));
if (!this.isSyntaxCheck) {
var fullPathNameOrError;
var localName = null;
if (this.fullCommand.indexOf ("# FILE" + nFiles + "=") >= 0) {
filename = org.jmol.util.Parser.getQuotedAttribute (this.fullCommand, "# FILE" + nFiles);
if (this.tokAt (i + 1) == 1073741848) i += 2;
} else if (this.tokAt (i + 1) == 1073741848) {
localName = this.viewer.getFilePath (this.stringParameter (this.iToken = (i = i + 2)), false);
fullPathNameOrError = this.viewer.getFullPathNameOrError (localName);
localName = fullPathNameOrError[0];
if (this.viewer.getPathForAllFiles () !== "") {
filename = localName;
localName = null;
} else {
this.addShapeProperty (propertyList, "localName", localName);
this.viewer.setPrivateKeyForShape (iShape);
}}if (!filename.startsWith ("cache://")) {
fullPathNameOrError = this.viewer.getFullPathNameOrError (filename);
filename = fullPathNameOrError[0];
if (fullPathNameOrError[1] != null) this.errorStr (17, filename + ":" + fullPathNameOrError[1]);
}org.jmol.util.Logger.info ("reading isosurface data from " + filename);
this.addShapeProperty (propertyList, "fileName", filename);
if (localName != null) filename = localName;
sbCommand.append (" /*file*/").append (org.jmol.util.Escape.escapeStr (filename));
}if (fileIndex >= 0) sbCommand.append (" ").appendI (fileIndex);
}if (sType != null) sbCommand.append (" ").append (org.jmol.util.Escape.escapeStr (sType));
surfaceObjectSeen = true;
break;
case 4106:
propertyName = "connections";
switch (this.tokAt (++i)) {
case 10:
case 1048577:
propertyValue = [this.atomExpressionAt (i).nextSetBit (0)];
break;
default:
propertyValue = [Clazz.floatToInt (this.floatParameterSet (i, 1, 1)[0])];
break;
}
i = this.iToken;
break;
case 1073741999:
propertyName = "link";
sbCommand.append (" link");
break;
case 1073741994:
if (iShape != 23) this.error (22);
pt = this.getPoint3f (this.iToken + 1, false);
i = this.iToken;
if (pt.x <= 0 || pt.y <= 0 || pt.z <= 0) break;
pt.x = Clazz.floatToInt (pt.x);
pt.y = Clazz.floatToInt (pt.y);
pt.z = Clazz.floatToInt (pt.z);
sbCommand.append (" lattice ").append (org.jmol.util.Escape.escapePt (pt));
if (isMapped) {
propertyName = "mapLattice";
propertyValue = pt;
} else {
lattice = pt;
}break;
default:
if (this.theTok == 1073741824) {
propertyName = "thisID";
propertyValue = str;
}if (!this.setMeshDisplayProperty (iShape, 0, this.theTok)) {
if (org.jmol.script.Token.tokAttr (this.theTok, 1073741824) && !idSeen) {
this.setShapeId (iShape, i, idSeen);
i = this.iToken;
break;
}this.error (22);
}if (iptDisplayProperty == 0) iptDisplayProperty = i;
i = this.statementLength - 1;
break;
}
idSeen = (this.theTok != 12291);
if (isWild && surfaceObjectSeen) this.error (22);
if (propertyName != null) this.addShapeProperty (propertyList, propertyName, propertyValue);
}
if (!this.isSyntaxCheck) {
if ((isCavity || haveRadius) && !surfaceObjectSeen) {
surfaceObjectSeen = true;
this.addShapeProperty (propertyList, "bsSolvent", (haveRadius ?  new org.jmol.util.BitSet () : this.lookupIdentifierValue ("solvent")));
this.addShapeProperty (propertyList, "sasurface", Float.$valueOf (0));
}if (planeSeen && !surfaceObjectSeen && !isMapped) {
this.addShapeProperty (propertyList, "nomap", Float.$valueOf (0));
surfaceObjectSeen = true;
}if (thisSetNumber >= 0) this.addShapeProperty (propertyList, "getSurfaceSets", Integer.$valueOf (thisSetNumber - 1));
if (discreteColixes != null) {
this.addShapeProperty (propertyList, "colorDiscrete", discreteColixes);
} else if ("sets".equals (colorScheme)) {
this.addShapeProperty (propertyList, "setColorScheme", null);
} else if (colorScheme != null) {
var ce = this.viewer.getColorEncoder (colorScheme);
if (ce != null) {
ce.isTranslucent = isColorSchemeTranslucent;
ce.hi = 3.4028235E38;
this.addShapeProperty (propertyList, "remapColor", ce);
}}if (surfaceObjectSeen && !isLcaoCartoon && sbCommand.indexOf (";") != 0) {
propertyList.add (0, ["newObject", null]);
var needSelect = (bsSelect == null);
if (needSelect) bsSelect = org.jmol.util.BitSetUtil.copy (this.viewer.getSelectionSet (false));
if (modelIndex < 0) modelIndex = this.viewer.getCurrentModelIndex ();
bsSelect.and (this.viewer.getModelUndeletedAtomsBitSet (modelIndex));
if (onlyOneModel != null) {
var bsModels = this.viewer.getModelBitSet (bsSelect, false);
if (bsModels.cardinality () != 1) this.errorStr (30, "ISOSURFACE " + onlyOneModel);
if (needSelect) {
propertyList.add (0, ["select", bsSelect]);
if (sbCommand.indexOf ("; isosurface map") == 0) {
sbCommand =  new org.jmol.util.StringXBuilder ().append ("; isosurface map select ").append (org.jmol.util.Escape.escape (bsSelect)).append (sbCommand.substring (16));
}}}}if (haveIntersection && !haveSlab) {
if (!surfaceObjectSeen) this.addShapeProperty (propertyList, "sasurface", Float.$valueOf (0));
if (!isMapped) {
this.addShapeProperty (propertyList, "map", Boolean.TRUE);
this.addShapeProperty (propertyList, "select", bs);
this.addShapeProperty (propertyList, "sasurface", Float.$valueOf (0));
}this.addShapeProperty (propertyList, "slab", this.getCapSlabObject (-100, false));
}this.setShapeProperty (iShape, "setProperties", propertyList);
if (defaultMesh) {
this.setShapeProperty (iShape, "token", Integer.$valueOf (1073742018));
this.setShapeProperty (iShape, "token", Integer.$valueOf (1073742046));
this.setShapeProperty (iShape, "token", Integer.$valueOf (1073741960));
sbCommand.append (" mesh nofill frontOnly");
}}if (lattice != null) this.setShapeProperty (23, "lattice", lattice);
if (iptDisplayProperty > 0) {
if (!this.setMeshDisplayProperty (iShape, iptDisplayProperty, 0)) this.error (22);
}if (this.isSyntaxCheck) return;
var area = null;
var volume = null;
if (doCalcArea) {
area = this.getShapeProperty (iShape, "area");
if (Clazz.instanceOf (area, Float)) this.viewer.setFloatProperty ("isosurfaceArea", (area).floatValue ());
 else this.viewer.setUserVariable ("isosurfaceArea", org.jmol.script.ScriptVariable.getVariableAD (area));
}if (doCalcVolume) {
volume = (doCalcVolume ? this.getShapeProperty (iShape, "volume") : null);
if (Clazz.instanceOf (volume, Float)) this.viewer.setFloatProperty ("isosurfaceVolume", (volume).floatValue ());
 else this.viewer.setUserVariable ("isosurfaceVolume", org.jmol.script.ScriptVariable.getVariableAD (volume));
}if (!isLcaoCartoon) {
var s = null;
if (isMapped && !surfaceObjectSeen) {
this.setShapeProperty (iShape, "finalize", sbCommand.toString ());
} else if (surfaceObjectSeen) {
cmd = sbCommand.toString ();
this.setShapeProperty (iShape, "finalize", (cmd.indexOf ("; isosurface map") == 0 ? "" : " select " + org.jmol.util.Escape.escape (bsSelect) + " ") + cmd);
s = this.getShapeProperty (iShape, "ID");
if (s != null && !this.tQuiet) {
cutoff = (this.getShapeProperty (iShape, "cutoff")).floatValue ();
if (Float.isNaN (cutoff) && !Float.isNaN (sigma)) {
org.jmol.util.Logger.error ("sigma not supported");
}s += " created";
if (isIsosurface) s += " with cutoff=" + cutoff;
var minMax = this.getShapeProperty (iShape, "minMaxInfo");
if (minMax[0] != 3.4028235E38) s += " min=" + minMax[0] + " max=" + minMax[1];
s += "; " + org.jmol.viewer.JmolConstants.shapeClassBases[iShape].toLowerCase () + " count: " + this.getShapeProperty (iShape, "count");
s += this.getIsosurfaceDataRange (iShape, "\n");
}}var sarea;
var svol;
if (doCalcArea || doCalcVolume) {
sarea = (doCalcArea ? "isosurfaceArea = " + (Clazz.instanceOf (area, Float) ? area : org.jmol.util.Escape.escapeAF (area)) : null);
svol = (doCalcVolume ? "isosurfaceVolume = " + (Clazz.instanceOf (volume, Float) ? volume : org.jmol.util.Escape.escapeAF (volume)) : null);
if (s == null) {
if (doCalcArea) this.showString (sarea);
if (doCalcVolume) this.showString (svol);
} else {
if (doCalcArea) s += "\n" + sarea;
if (doCalcVolume) s += "\n" + svol;
}}if (s != null) this.showString (s);
}if (translucency != null) this.setShapeProperty (iShape, "translucency", translucency);
this.setShapeProperty (iShape, "clear", null);
if (toCache) {
var id = this.getShapeProperty (iShape, "ID");
this.viewer.cachePut ("cache://isosurface_" + id, this.getShapeProperty (iShape, "jvxlDataXml"));
this.runScript ("isosurface ID \"" + id + "\" delete;isosurface ID \"" + id + "\"" + (modelIndex >= 0 ? " model " + modelIndex : "") + " \"cache://isosurface_" + this.getShapeProperty (iShape, "ID") + "\"");
}}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getColorRange", 
($fz = function (i) {
var color1 = this.getArgbParam (i);
if (this.tokAt (++this.iToken) != 1074790746) this.error (22);
var color2 = this.getArgbParam (++this.iToken);
var nColors = (this.tokAt (this.iToken + 1) == 2 ? this.intParameter (++this.iToken) : 0);
return org.jmol.util.ColorEncoder.getColorSchemeList (org.jmol.util.ColorEncoder.getPaletteAtoB (color1, color2, nColors));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getIsosurfaceDataRange", 
($fz = function (iShape, sep) {
var dataRange = this.getShapeProperty (iShape, "dataRange");
return (dataRange != null && dataRange[0] != 3.4028235E38 && dataRange[0] != dataRange[1] ? sep + "isosurface" + " full data range " + dataRange[0] + " to " + dataRange[1] + " with color scheme spanning " + dataRange[2] + " to " + dataRange[3] : "");
}, $fz.isPrivate = true, $fz), "~N,~S");
Clazz.defineMethod (c$, "getWithinDistanceVector", 
($fz = function (propertyList, distance, ptc, bs, isShow) {
var v =  new java.util.ArrayList ();
var pts =  new Array (2);
if (bs == null) {
var pt1 = org.jmol.util.Point3f.new3 (distance, distance, distance);
var pt0 = org.jmol.util.Point3f.newP (ptc);
pt0.sub (pt1);
pt1.add (ptc);
pts[0] = pt0;
pts[1] = pt1;
v.add (ptc);
} else {
var bbox = this.viewer.getBoxInfo (bs, -Math.abs (distance));
pts[0] = bbox.getBboxVertices ()[0];
pts[1] = bbox.getBboxVertices ()[7];
if (bs.cardinality () == 1) v.add (this.viewer.getAtomPoint3f (bs.nextSetBit (0)));
}if (v.size () == 1 && !isShow) {
this.addShapeProperty (propertyList, "withinDistance", Float.$valueOf (distance));
this.addShapeProperty (propertyList, "withinPoint", v.get (0));
}this.addShapeProperty (propertyList, (isShow ? "displayWithin" : "withinPoints"), [Float.$valueOf (distance), pts, bs, v]);
}, $fz.isPrivate = true, $fz), "java.util.List,~N,org.jmol.util.Point3f,org.jmol.util.BitSet,~B");
Clazz.defineMethod (c$, "setMeshDisplayProperty", 
($fz = function (shape, i, tok) {
var propertyName = null;
var propertyValue = null;
var allowCOLOR = (shape == 24);
var checkOnly = (i == 0);
if (!checkOnly) tok = this.getToken (i).tok;
switch (tok) {
case 1766856708:
if (allowCOLOR) this.iToken++;
 else break;
case 1073742074:
case 1073742180:
if (!checkOnly) this.colorShape (shape, this.iToken, false);
return true;
case 0:
case 12291:
case 1048589:
case 1048588:
case 12294:
case 3145770:
case 1610625028:
case 3145768:
if (this.iToken == 1 && shape >= 0 && this.tokAt (2) == 0) this.setShapeProperty (shape, "thisID", null);
if (tok == 0) return (this.iToken == 1);
if (checkOnly) return true;
switch (tok) {
case 12291:
this.setShapeProperty (shape, "delete", null);
return true;
case 3145770:
case 12294:
tok = 1048588;
break;
case 3145768:
tok = 1048589;
break;
case 1610625028:
if (i + 1 == this.statementLength) tok = 1048589;
break;
}
case 1073741958:
case 1073741862:
case 1073741964:
case 1073741898:
case 1073742039:
case 1113198595:
case 1073742042:
case 1073742018:
case 1073742052:
case 1073741938:
case 1073742046:
case 1073742182:
case 1073742060:
case 1073741960:
case 1073742058:
propertyName = "token";
propertyValue = Integer.$valueOf (tok);
break;
}
if (propertyName == null) return false;
if (checkOnly) return true;
this.setShapeProperty (shape, propertyName, propertyValue);
if ((this.tokAt (this.iToken + 1)) != 0) {
if (!this.setMeshDisplayProperty (shape, ++this.iToken, 0)) --this.iToken;
}return true;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.defineMethod (c$, "bind", 
($fz = function () {
var mouseAction = this.stringParameter (1);
var name = this.parameterAsString (2);
var range1 = null;
var range2 = null;
this.checkLength (3);
if (!this.isSyntaxCheck) this.viewer.bindAction (mouseAction, name, range1, range2);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "unbind", 
($fz = function () {
if (this.statementLength != 1) this.checkLength23 ();
var mouseAction = this.optParameterAsString (1);
var name = this.optParameterAsString (2);
if (mouseAction.length == 0 || this.tokAt (1) == 1048579) mouseAction = null;
if (name.length == 0 || this.tokAt (2) == 1048579) name = null;
if (name == null && mouseAction != null && org.jmol.viewer.ActionManager.getActionFromName (mouseAction) >= 0) {
name = mouseAction;
mouseAction = null;
}if (!this.isSyntaxCheck) this.viewer.unBindAction (mouseAction, name);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "undoRedoMove", 
($fz = function () {
var n = 1;
var len = 2;
switch (this.tokAt (1)) {
case 0:
len = 1;
break;
case 1048579:
n = 0;
break;
case 2:
n = this.intParameter (1);
break;
default:
this.error (22);
}
this.checkLength (len);
if (!this.isSyntaxCheck) this.viewer.undoMoveAction (this.tokAt (0), n);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getAtomsNearSurface", 
function (distance, surfaceId) {
var data = [surfaceId, null, null];
if (this.isSyntaxCheck) return  new org.jmol.util.BitSet ();
if (this.getShapePropertyData (23, "getVertices", data)) return this.viewer.getAtomsNearPts (distance, data[1], data[2]);
data[1] = Integer.$valueOf (0);
data[2] = Integer.$valueOf (-1);
if (this.getShapePropertyData (22, "getCenter", data)) return this.viewer.getAtomsNearPt (distance, data[2]);
return  new org.jmol.util.BitSet ();
}, "~N,~S");
c$.getFloatEncodedInt = Clazz.defineMethod (c$, "getFloatEncodedInt", 
function (strDecimal) {
var pt = strDecimal.indexOf (".");
if (pt < 1 || strDecimal.charAt (0) == '-' || strDecimal.endsWith (".") || strDecimal.contains (".0")) return 2147483647;
var i = 0;
var j = 0;
if (pt > 0) {
try {
i = Integer.parseInt (strDecimal.substring (0, pt));
if (i < 0) i = -i;
} catch (e) {
if (Clazz.exceptionOf (e, NumberFormatException)) {
i = -1;
} else {
throw e;
}
}
}if (pt < strDecimal.length - 1) try {
j = Integer.parseInt (strDecimal.substring (pt + 1));
} catch (e) {
if (Clazz.exceptionOf (e, NumberFormatException)) {
} else {
throw e;
}
}
i = i * 1000000 + j;
return (i < 0 ? 2147483647 : i);
}, "~S");
c$.getPartialBondOrderFromFloatEncodedInt = Clazz.defineMethod (c$, "getPartialBondOrderFromFloatEncodedInt", 
function (bondOrderInteger) {
return (((Clazz.doubleToInt (bondOrderInteger / 1000000)) % 6) << 5) + ((bondOrderInteger % 1000000) & 0x1F);
}, "~N");
c$.getBondOrderFromString = Clazz.defineMethod (c$, "getBondOrderFromString", 
function (s) {
return (s.indexOf (' ') < 0 ? org.jmol.util.JmolEdge.getBondOrderFromString (s) : s.toLowerCase ().indexOf ("partial ") == 0 ? org.jmol.script.ScriptEvaluator.getPartialBondOrderFromString (s.substring (8).trim ()) : 131071);
}, "~S");
c$.getPartialBondOrderFromString = Clazz.defineMethod (c$, "getPartialBondOrderFromString", 
($fz = function (s) {
return org.jmol.script.ScriptEvaluator.getPartialBondOrderFromFloatEncodedInt (org.jmol.script.ScriptEvaluator.getFloatEncodedInt (s));
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineStatics (c$,
"SCRIPT_COMPLETED", "Script completed",
"EXPRESSION_KEY", "e_x_p_r_e_s_s_i_o_n",
"scriptLevelMax", 100,
"ERROR_axisExpected", 0,
"ERROR_backgroundModelError", 1,
"ERROR_badArgumentCount", 2,
"ERROR_badMillerIndices", 3,
"ERROR_badRGBColor", 4,
"ERROR_booleanExpected", 5,
"ERROR_booleanOrNumberExpected", 6,
"ERROR_booleanOrWhateverExpected", 7,
"ERROR_colorExpected", 8,
"ERROR_colorOrPaletteRequired", 9,
"ERROR_commandExpected", 10,
"ERROR_coordinateOrNameOrExpressionRequired", 11,
"ERROR_drawObjectNotDefined", 12,
"ERROR_endOfStatementUnexpected", 13,
"ERROR_expressionExpected", 14,
"ERROR_expressionOrIntegerExpected", 15,
"ERROR_filenameExpected", 16,
"ERROR_fileNotFoundException", 17,
"ERROR_incompatibleArguments", 18,
"ERROR_insufficientArguments", 19,
"ERROR_integerExpected", 20,
"ERROR_integerOutOfRange", 21,
"ERROR_invalidArgument", 22,
"ERROR_invalidParameterOrder", 23,
"ERROR_keywordExpected", 24,
"ERROR_moCoefficients", 25,
"ERROR_moIndex", 26,
"ERROR_moModelError", 27,
"ERROR_moOccupancy", 28,
"ERROR_moOnlyOne", 29,
"ERROR_multipleModelsDisplayedNotOK", 30,
"ERROR_noData", 31,
"ERROR_noPartialCharges", 32,
"ERROR_noUnitCell", 33,
"ERROR_numberExpected", 34,
"ERROR_numberMustBe", 35,
"ERROR_numberOutOfRange", 36,
"ERROR_objectNameExpected", 37,
"ERROR_planeExpected", 38,
"ERROR_propertyNameExpected", 39,
"ERROR_spaceGroupNotFound", 40,
"ERROR_stringExpected", 41,
"ERROR_stringOrIdentifierExpected", 42,
"ERROR_tooManyPoints", 43,
"ERROR_tooManyScriptLevels", 44,
"ERROR_unrecognizedAtomProperty", 45,
"ERROR_unrecognizedBondProperty", 46,
"ERROR_unrecognizedCommand", 47,
"ERROR_unrecognizedExpression", 48,
"ERROR_unrecognizedObject", 49,
"ERROR_unrecognizedParameter", 50,
"ERROR_unrecognizedParameterWarning", 51,
"ERROR_unrecognizedShowParameter", 52,
"ERROR_what", 53,
"ERROR_writeWhat", 54,
"ERROR_multipleModelsNotOK", 55,
"ERROR_cannotSet", 56,
"iProcess", 0,
"testData", null,
"testData2", null);
});
