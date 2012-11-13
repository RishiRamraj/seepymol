Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.TimeoutThread", ["java.lang.Thread", "org.jmol.util.Logger", "$.StringXBuilder"], function () {
c$ = Clazz.decorateAsClass (function () {
this.script = null;
this.ms = 0;
this.targetTime = 0;
this.status = 0;
this.triggered = true;
this.viewer = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "TimeoutThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (viewer, name, ms, script) {
Clazz.superConstructor (this, org.jmol.thread.TimeoutThread, []);
this.viewer = viewer;
this.setMyName (name);
this.set (ms, script);
}, "org.jmol.viewer.Viewer,~S,~N,~S");
Clazz.defineMethod (c$, "set", 
function (ms, script) {
this.ms = ms;
this.targetTime = System.currentTimeMillis () + Math.abs (ms);
if (script != null) this.script = script;
}, "~N,~S");
Clazz.defineMethod (c$, "trigger", 
function () {
this.triggered = (this.ms < 0);
});
Clazz.overrideMethod (c$, "toString", 
function () {
return "timeout name=" + this.$name + " executions=" + this.status + " mSec=" + this.ms + " secRemaining=" + (this.targetTime - System.currentTimeMillis ()) / 1000 + " script=" + this.script + " thread=" + Thread.currentThread ().getName ();
});
Clazz.overrideMethod (c$, "run", 
function () {
if (this.script == null || this.script.length == 0 || this.ms == 0) return;
Thread.currentThread ().setPriority (1);
try {
var timeouts = this.viewer.getTimeouts ();
while (true) {
Thread.sleep (26);
if (this.targetTime > System.currentTimeMillis ()) continue;
this.status++;
var looping = (this.ms < 0);
this.targetTime += Math.abs (this.ms);
if (timeouts.get (this.$name) == null) break;
if (!looping) timeouts.remove (this.$name);
if (this.triggered) {
this.triggered = false;
this.viewer.evalStringQuiet ((looping ? this.script + ";\ntimeout ID \"" + this.$name + "\";" : this.script));
} else {
}if (!looping) break;
}
} catch (e$$) {
if (Clazz.exceptionOf (e$$, InterruptedException)) {
var ie = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, Exception)) {
var ie = e$$;
{
org.jmol.util.Logger.info ("Timeout " + this.$name + " Exception: " + ie);
}
} else {
throw e$$;
}
}
this.viewer.getTimeouts ().remove (this.$name);
});
c$.clear = Clazz.defineMethod (c$, "clear", 
function (timeouts) {
var e = timeouts.values ().iterator ();
while (e.hasNext ()) {
var t = e.next ();
if (!t.script.equals ("exitJmol")) t.interrupt ();
}
timeouts.clear ();
}, "java.util.Map");
c$.setTimeout = Clazz.defineMethod (c$, "setTimeout", 
function (viewer, timeouts, name, mSec, script) {
var t = timeouts.get (name);
if (mSec == 0) {
if (t != null) {
t.interrupt ();
timeouts.remove (name);
}return;
}if (t != null) {
t.set (mSec, script);
return;
}t =  new org.jmol.thread.TimeoutThread (viewer, name, mSec, script);
timeouts.put (name, t);
t.start ();
}, "org.jmol.viewer.Viewer,java.util.Map,~S,~N,~S");
c$.trigger = Clazz.defineMethod (c$, "trigger", 
function (timeouts, name) {
var t = timeouts.get (name);
if (t != null) t.trigger ();
}, "java.util.Map,~S");
c$.showTimeout = Clazz.defineMethod (c$, "showTimeout", 
function (timeouts, name) {
var sb =  new org.jmol.util.StringXBuilder ();
if (timeouts != null) {
var e = timeouts.values ().iterator ();
while (e.hasNext ()) {
var t = e.next ();
if (name == null || t.$name.equalsIgnoreCase (name)) sb.append (t.toString ()).append ("\n");
}
}return (sb.length () > 0 ? sb.toString () : "<no timeouts set>");
}, "java.util.Map,~S");
});
