Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.HoverWatcherThread", ["java.lang.Thread", "org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.actionManager = null;
this.current = null;
this.moved = null;
this.viewer = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "HoverWatcherThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (actionManager, current, moved, viewer) {
Clazz.superConstructor (this, org.jmol.thread.HoverWatcherThread, []);
this.actionManager = actionManager;
this.current = current;
this.moved = moved;
this.viewer = viewer;
this.setMyName ("HoverWatcher");
this.start ();
}, "org.jmol.viewer.ActionManager,org.jmol.viewer.MouseState,org.jmol.viewer.MouseState,org.jmol.viewer.Viewer");
Clazz.overrideMethod (c$, "run", 
function () {
Thread.currentThread ().setPriority (1);
var hoverDelay;
try {
while (!this.$interrupted && (hoverDelay = this.viewer.getHoverDelay ()) > 0) {
Thread.sleep (hoverDelay);
if (this.moved.is (this.current)) {
var currentTime = System.currentTimeMillis ();
var howLong = (currentTime - this.moved.time);
if (howLong > hoverDelay && !this.$interrupted) {
this.actionManager.checkHover ();
}}}
} catch (e$$) {
if (Clazz.exceptionOf (e$$, InterruptedException)) {
var ie = e$$;
{
org.jmol.util.Logger.debug ("Hover interrupted");
}
} else if (Clazz.exceptionOf (e$$, Exception)) {
var ie = e$$;
{
org.jmol.util.Logger.debug ("Hover Exception: " + ie);
}
} else {
throw e$$;
}
}
});
});
