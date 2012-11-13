Clazz.declarePackage ("org.jmol.io2");
c$ = Clazz.decorateAsClass (function () {
this.fm = null;
this.viewer = null;
this.aDOMNode = null;
this.atomSetCollection = null;
this.htParams = null;
Clazz.instantialize (this, arguments);
}, org.jmol.io2, "DOMReader");
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "set", 
function (fileManager, viewer, DOMNode, htParams) {
this.fm = fileManager;
this.viewer = viewer;
this.aDOMNode = DOMNode;
this.htParams = htParams;
}, "org.jmol.viewer.FileManager,org.jmol.viewer.Viewer,~O,java.util.Map");
Clazz.defineMethod (c$, "run", 
function () {
this.htParams.put ("nameSpaceInfo", this.viewer.apiPlatform.getJsObjectInfo (this.aDOMNode, null, null));
this.atomSetCollection = this.viewer.getModelAdapter ().getAtomSetCollectionFromDOM (this.aDOMNode, this.htParams);
if (Clazz.instanceOf (this.atomSetCollection, String)) return;
this.viewer.zap (false, true, false);
this.fm.fullPathName = this.fm.fileName = this.fm.nameAsGiven = "JSNode";
});
