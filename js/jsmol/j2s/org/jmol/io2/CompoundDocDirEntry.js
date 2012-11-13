﻿Clazz.declarePackage ("org.jmol.io2");
Clazz.load (null, "org.jmol.io2.CompoundDocDirEntry", ["org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.cd = null;
this.unicodeName64 = null;
this.nBytesUnicodeName = 0;
this.entryType = 0;
this.uniqueID16 = null;
this.userflags4 = null;
this.SIDfirstSector = 0;
this.lenStream = 0;
this.unused4 = null;
this.entryName = null;
this.isStandard = false;
this.isEmpty = false;
Clazz.instantialize (this, arguments);
}, org.jmol.io2, "CompoundDocDirEntry");
Clazz.prepareFields (c$, function () {
this.unicodeName64 =  Clazz.newByteArray (64, 0);
this.uniqueID16 =  Clazz.newByteArray (16, 0);
this.userflags4 =  Clazz.newByteArray (4, 0);
this.unused4 =  Clazz.newByteArray (4, 0);
});
Clazz.makeConstructor (c$, 
function (compoundDocument) {
this.cd = compoundDocument;
}, "org.jmol.io2.CompoundDocument");
Clazz.defineMethod (c$, "readData", 
function () {
try {
this.cd.readByteArray (this.unicodeName64, 0, 64);
this.nBytesUnicodeName = this.cd.readShort ();
this.entryType = this.cd.readByte ();
this.cd.readByte ();
this.cd.readInt ();
this.cd.readInt ();
this.cd.readInt ();
this.cd.readByteArray (this.uniqueID16, 0, 16);
this.cd.readByteArray (this.userflags4, 0, 4);
this.cd.readLong ();
this.cd.readLong ();
this.SIDfirstSector = this.cd.readInt ();
this.lenStream = this.cd.readInt ();
this.cd.readByteArray (this.unused4, 0, 4);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
return false;
} else {
throw e;
}
}
this.entryName = "";
for (var i = 0; i < this.nBytesUnicodeName - 2; i += 2) this.entryName += String.fromCharCode (this.unicodeName64[i]);

this.isStandard = (this.entryType == 5 || this.lenStream >= this.cd.header.minBytesStandardStream);
this.isEmpty = (this.entryType == 0 || this.lenStream <= 0);
return true;
});
});
