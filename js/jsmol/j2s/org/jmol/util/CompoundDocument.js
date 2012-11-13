﻿Clazz.declarePackage ("org.jmol.util");
Clazz.load (["org.jmol.util.BinaryDocument", "java.util.ArrayList"], "org.jmol.util.CompoundDocument", ["java.io.DataInputStream", "org.jmol.util.Logger", "$.StringXBuilder", "$.ZipData"], function () {
c$ = Clazz.decorateAsClass (function () {
this.header = null;
this.directory = null;
this.rootEntry = null;
this.SAT = null;
this.SSAT = null;
this.sectorSize = 0;
this.shortSectorSize = 0;
this.nShortSectorsPerStandardSector = 0;
this.nIntPerSector = 0;
this.nDirEntriesperSector = 0;
this.data = null;
if (!Clazz.isClassDefined ("org.jmol.util.CompoundDocument.CmpDocHeader")) {
org.jmol.util.CompoundDocument.$CompoundDocument$CmpDocHeader$ ();
}
if (!Clazz.isClassDefined ("org.jmol.util.CompoundDocument.CmpDocDirectoryEntry")) {
org.jmol.util.CompoundDocument.$CompoundDocument$CmpDocDirectoryEntry$ ();
}
Clazz.instantialize (this, arguments);
}, org.jmol.util, "CompoundDocument", org.jmol.util.BinaryDocument);
Clazz.prepareFields (c$, function () {
this.header = Clazz.innerTypeInstance (org.jmol.util.CompoundDocument.CmpDocHeader, this, null);
this.directory =  new java.util.ArrayList ();
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, org.jmol.util.CompoundDocument);
this.isBigEndian = true;
});
Clazz.overrideMethod (c$, "setStream", 
function (bis, isBigEndian) {
if (!this.isRandom) {
this.stream =  new java.io.DataInputStream (bis);
}this.stream.mark (2147483647);
if (!this.readHeader ()) return;
this.getSectorAllocationTable ();
this.getShortSectorAllocationTable ();
this.getDirectoryTable ();
}, "java.io.BufferedInputStream,~B");
Clazz.defineMethod (c$, "getDirectory", 
function () {
return this.directory;
});
Clazz.defineMethod (c$, "getDirectoryListing", 
function (separator) {
var str = "";
for (var i = 0; i < this.directory.size (); i++) {
var thisEntry = this.directory.get (i);
if (!thisEntry.isEmpty) str += separator + thisEntry.entryName + "\tlen=" + thisEntry.lenStream + "\tSID=" + thisEntry.SIDfirstSector + (thisEntry.isStandard ? "\tfileOffset=" + this.getOffset (thisEntry.SIDfirstSector) : "");
}
return str;
}, "~S");
Clazz.defineMethod (c$, "getAllData", 
function () {
return this.getAllDataFiles (null, null);
});
Clazz.overrideMethod (c$, "getAllDataMapped", 
function (prefix, binaryFileList, fileData) {
fileData.put ("#Directory_Listing", this.getDirectoryListing ("|"));
binaryFileList = "|" + binaryFileList + "|";
for (var i = 0; i < this.directory.size (); i++) {
var thisEntry = this.directory.get (i);
var name = thisEntry.entryName;
org.jmol.util.Logger.info ("reading " + name);
if (!thisEntry.isEmpty && thisEntry.entryType != 5) {
var isBinary = (binaryFileList.indexOf ("|" + thisEntry.entryName + "|") >= 0);
if (isBinary) name += ":asBinaryString";
var data =  new org.jmol.util.StringXBuilder ();
data.append ("BEGIN Directory Entry ").append (name).append ("\n");
data.appendSB (this.getEntryAsString (thisEntry, isBinary));
data.append ("\nEND Directory Entry ").append (name).append ("\n");
fileData.put (prefix + "/" + name, data.toString ());
}}
this.close ();
}, "~S,~S,java.util.Map");
Clazz.overrideMethod (c$, "getAllDataFiles", 
function (binaryFileList, firstFile) {
if (firstFile != null) {
for (var i = 0; i < this.directory.size (); i++) {
var thisEntry = this.directory.get (i);
if (thisEntry.entryName.equals (firstFile)) {
this.directory.remove (i);
this.directory.add (1, thisEntry);
break;
}}
}this.data =  new org.jmol.util.StringXBuilder ();
this.data.append ("Compound Document File Directory: ");
this.data.append (this.getDirectoryListing ("|"));
this.data.append ("\n");
binaryFileList = "|" + binaryFileList + "|";
for (var i = 0; i < this.directory.size (); i++) {
var thisEntry = this.directory.get (i);
org.jmol.util.Logger.info ("reading " + thisEntry.entryName);
if (!thisEntry.isEmpty && thisEntry.entryType != 5) {
var name = thisEntry.entryName;
if (name.endsWith (".gz")) name = name.substring (0, name.length - 3);
this.data.append ("BEGIN Directory Entry ").append (name).append ("\n");
this.data.appendSB (this.getEntryAsString (thisEntry, binaryFileList.indexOf ("|" + thisEntry.entryName + "|") >= 0));
this.data.append ("\n");
this.data.append ("END Directory Entry ").append (thisEntry.entryName).append ("\n");
}}
this.close ();
return this.data;
}, "~S,~S");
Clazz.defineMethod (c$, "getFileAsString", 
function (entryName) {
for (var i = 0; i < this.directory.size (); i++) {
var thisEntry = this.directory.get (i);
if (thisEntry.entryName.equals (entryName)) return this.getEntryAsString (thisEntry, false);
}
return  new org.jmol.util.StringXBuilder ();
}, "~S");
Clazz.defineMethod (c$, "getOffset", 
($fz = function (SID) {
return (SID + 1) * this.sectorSize;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "gotoSector", 
($fz = function (SID) {
this.seek (this.getOffset (SID));
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "readHeader", 
($fz = function () {
if (!this.header.readData ()) return false;
this.sectorSize = 1 << this.header.sectorPower;
this.shortSectorSize = 1 << this.header.shortSectorPower;
this.nShortSectorsPerStandardSector = Clazz.doubleToInt (this.sectorSize / this.shortSectorSize);
this.nIntPerSector = Clazz.doubleToInt (this.sectorSize / 4);
this.nDirEntriesperSector = Clazz.doubleToInt (this.sectorSize / 128);
if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.debug ("compound document: revNum=" + this.header.revNumber + " verNum=" + this.header.verNumber + " isBigEndian=" + this.isBigEndian + " bytes per standard/short sector=" + this.sectorSize + "/" + this.shortSectorSize);
}return true;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getSectorAllocationTable", 
($fz = function () {
var nSID = 0;
var thisSID;
this.SAT =  Clazz.newIntArray (this.header.nSATsectors * this.nIntPerSector + 109, 0);
try {
for (var i = 0; i < 109; i++) {
thisSID = this.header.MSAT0[i];
if (thisSID < 0) break;
this.gotoSector (thisSID);
for (var j = 0; j < this.nIntPerSector; j++) {
this.SAT[nSID++] = this.readInt ();
}
}
var nMaster = this.header.nAdditionalMATsectors;
thisSID = this.header.SID_MSAT_next;
var MSAT =  Clazz.newIntArray (this.nIntPerSector, 0);
out : while (nMaster-- > 0 && thisSID >= 0) {
this.gotoSector (thisSID);
for (var i = 0; i < this.nIntPerSector; i++) MSAT[i] = this.readInt ();

for (var i = 0; i < this.nIntPerSector - 1; i++) {
thisSID = MSAT[i];
if (thisSID < 0) break out;
this.gotoSector (thisSID);
for (var j = this.nIntPerSector; --j >= 0; ) this.SAT[nSID++] = this.readInt ();

}
thisSID = MSAT[this.nIntPerSector - 1];
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
} else {
throw e;
}
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getShortSectorAllocationTable", 
($fz = function () {
var nSSID = 0;
var thisSID = this.header.SID_SSAT_start;
var nMax = this.header.nSSATsectors * this.nIntPerSector;
this.SSAT =  Clazz.newIntArray (nMax, 0);
try {
while (thisSID > 0 && nSSID < nMax) {
this.gotoSector (thisSID);
for (var j = 0; j < this.nIntPerSector; j++) {
this.SSAT[nSSID++] = this.readInt ();
}
thisSID = this.SAT[thisSID];
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
} else {
throw e;
}
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getDirectoryTable", 
($fz = function () {
var thisSID = this.header.SID_DIR_start;
var thisEntry;
this.rootEntry = null;
try {
while (thisSID > 0) {
this.gotoSector (thisSID);
for (var j = this.nDirEntriesperSector; --j >= 0; ) {
thisEntry = Clazz.innerTypeInstance (org.jmol.util.CompoundDocument.CmpDocDirectoryEntry, this, null);
thisEntry.readData ();
if (thisEntry.lenStream > 0) {
this.directory.add (thisEntry);
}if (thisEntry.entryType == 5) this.rootEntry = thisEntry;
}
thisSID = this.SAT[thisSID];
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
} else {
throw e;
}
}
if (org.jmol.util.Logger.debugging) org.jmol.util.Logger.debug ("CompoundDocument directory entry: \n" + this.getDirectoryListing ("\n"));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getEntryAsString", 
($fz = function (thisEntry, asBinaryString) {
if (thisEntry.isEmpty) return  new org.jmol.util.StringXBuilder ();
return (thisEntry.isStandard ? this.getStandardStringData (thisEntry.SIDfirstSector, thisEntry.lenStream, asBinaryString) : this.getShortStringData (thisEntry.SIDfirstSector, thisEntry.lenStream, asBinaryString));
}, $fz.isPrivate = true, $fz), "org.jmol.util.CompoundDocument.CmpDocDirectoryEntry,~B");
Clazz.defineMethod (c$, "getStandardStringData", 
($fz = function (thisSID, nBytes, asBinaryString) {
var data =  new org.jmol.util.StringXBuilder ();
var byteBuf =  Clazz.newByteArray (this.sectorSize, 0);
var gzipData =  new org.jmol.util.ZipData (nBytes);
try {
while (thisSID > 0 && nBytes > 0) {
this.gotoSector (thisSID);
nBytes = this.getSectorData (data, byteBuf, this.sectorSize, nBytes, asBinaryString, gzipData);
thisSID = this.SAT[thisSID];
}
if (nBytes == -9999) return  new org.jmol.util.StringXBuilder ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
} else {
throw e;
}
}
if (gzipData.isEnabled) gzipData.addTo (data);
return data;
}, $fz.isPrivate = true, $fz), "~N,~N,~B");
Clazz.defineMethod (c$, "getSectorData", 
($fz = function (data, byteBuf, nSectorBytes, nBytes, asBinaryString, gzipData) {
this.readByteArray (byteBuf);
var n = gzipData.addBytes (byteBuf, nSectorBytes, nBytes);
if (n >= 0) return n;
if (asBinaryString) {
for (var i = 0; i < nSectorBytes; i++) {
data.append (Integer.toHexString (byteBuf[i] & 0xFF)).appendC (' ');
if (--nBytes < 1) break;
}
} else {
for (var i = 0; i < nSectorBytes; i++) {
if (byteBuf[i] == 0) return -9999;
data.appendC (String.fromCharCode (byteBuf[i]));
if (--nBytes < 1) break;
}
}return nBytes;
}, $fz.isPrivate = true, $fz), "org.jmol.util.StringXBuilder,~A,~N,~N,~B,org.jmol.util.ZipData");
Clazz.defineMethod (c$, "getShortStringData", 
($fz = function (shortSID, nBytes, asBinaryString) {
var data =  new org.jmol.util.StringXBuilder ();
if (this.rootEntry == null) return data;
var thisSID = this.rootEntry.SIDfirstSector;
var ptShort = 0;
var byteBuf =  Clazz.newByteArray (this.shortSectorSize, 0);
var gzipData =  new org.jmol.util.ZipData (nBytes);
try {
while (thisSID >= 0 && shortSID >= 0 && nBytes > 0) {
while (shortSID - ptShort >= this.nShortSectorsPerStandardSector) {
ptShort += this.nShortSectorsPerStandardSector;
thisSID = this.SAT[thisSID];
}
this.seek (this.getOffset (thisSID) + (shortSID - ptShort) * this.shortSectorSize);
nBytes = this.getSectorData (data, byteBuf, this.shortSectorSize, nBytes, asBinaryString, gzipData);
shortSID = this.SSAT[shortSID];
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.error (data.toString ());
org.jmol.util.Logger.errorEx (null, e);
} else {
throw e;
}
}
if (gzipData.isEnabled) gzipData.addTo (data);
return data;
}, $fz.isPrivate = true, $fz), "~N,~N,~B");
c$.$CompoundDocument$CmpDocHeader$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.magicNumbers = null;
this.uniqueID = null;
this.revNumber = 0;
this.verNumber = 0;
this.sectorPower = 0;
this.shortSectorPower = 0;
this.unused = null;
this.nSATsectors = 0;
this.SID_DIR_start = 0;
this.unused2 = null;
this.minBytesStandardStream = 0;
this.SID_SSAT_start = 0;
this.nSSATsectors = 0;
this.SID_MSAT_next = 0;
this.nAdditionalMATsectors = 0;
this.MSAT0 = null;
Clazz.instantialize (this, arguments);
}, org.jmol.util.CompoundDocument, "CmpDocHeader");
Clazz.prepareFields (c$, function () {
this.magicNumbers =  Clazz.newByteArray (8, 0);
this.uniqueID =  Clazz.newByteArray (16, 0);
this.unused =  Clazz.newByteArray (10, 0);
this.unused2 =  Clazz.newByteArray (4, 0);
this.MSAT0 =  Clazz.newIntArray (109, 0);
});
Clazz.defineMethod (c$, "readData", 
function () {
try {
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.magicNumbers, 0, 8);
if (this.magicNumbers[0] != 0xD0 || this.magicNumbers[1] != 0xCF || this.magicNumbers[2] != 0x11 || this.magicNumbers[3] != 0xE0 || this.magicNumbers[4] != 0xA1 || this.magicNumbers[5] != 0xB1 || this.magicNumbers[6] != 0x1A || this.magicNumbers[7] != 0xE1) return false;
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.uniqueID);
this.revNumber = this.b$["org.jmol.util.CompoundDocument"].readByte ();
this.b$["org.jmol.util.CompoundDocument"].readByte ();
this.verNumber = this.b$["org.jmol.util.CompoundDocument"].readByte ();
this.b$["org.jmol.util.CompoundDocument"].readByte ();
var a = this.b$["org.jmol.util.CompoundDocument"].readByte ();
var b = this.b$["org.jmol.util.CompoundDocument"].readByte ();
this.b$["org.jmol.util.CompoundDocument"].isBigEndian = (a == -1 && b == -2);
this.sectorPower = this.b$["org.jmol.util.CompoundDocument"].readShort ();
this.shortSectorPower = this.b$["org.jmol.util.CompoundDocument"].readShort ();
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.unused);
this.nSATsectors = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.SID_DIR_start = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.unused2);
this.minBytesStandardStream = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.SID_SSAT_start = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.nSSATsectors = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.SID_MSAT_next = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.nAdditionalMATsectors = this.b$["org.jmol.util.CompoundDocument"].readInt ();
for (var c = 0; c < 109; c++) this.MSAT0[c] = this.b$["org.jmol.util.CompoundDocument"].readInt ();

} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
return false;
} else {
throw e;
}
}
return true;
});
c$ = Clazz.p0p ();
};
c$.$CompoundDocument$CmpDocDirectoryEntry$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.unicodeName = null;
this.nBytesUnicodeName = 0;
this.entryType = 0;
this.uniqueID = null;
this.userflags = null;
this.SIDfirstSector = 0;
this.lenStream = 0;
this.unused = null;
this.entryName = null;
this.isStandard = false;
this.isEmpty = false;
Clazz.instantialize (this, arguments);
}, org.jmol.util.CompoundDocument, "CmpDocDirectoryEntry");
Clazz.prepareFields (c$, function () {
this.unicodeName =  Clazz.newByteArray (64, 0);
this.uniqueID =  Clazz.newByteArray (16, 0);
this.userflags =  Clazz.newByteArray (4, 0);
this.unused =  Clazz.newByteArray (4, 0);
});
Clazz.defineMethod (c$, "readData", 
function () {
try {
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.unicodeName);
this.nBytesUnicodeName = this.b$["org.jmol.util.CompoundDocument"].readShort ();
this.entryType = this.b$["org.jmol.util.CompoundDocument"].readByte ();
this.b$["org.jmol.util.CompoundDocument"].readByte ();
this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.uniqueID);
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.userflags);
this.b$["org.jmol.util.CompoundDocument"].readLong ();
this.b$["org.jmol.util.CompoundDocument"].readLong ();
this.SIDfirstSector = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.lenStream = this.b$["org.jmol.util.CompoundDocument"].readInt ();
this.b$["org.jmol.util.CompoundDocument"].readByteArray (this.unused);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx (null, e);
return false;
} else {
throw e;
}
}
this.entryName = "";
for (var a = 0; a < this.nBytesUnicodeName - 2; a += 2) this.entryName += String.fromCharCode (this.unicodeName[a]);

this.isStandard = (this.entryType == 5 || this.lenStream >= this.b$["org.jmol.util.CompoundDocument"].header.minBytesStandardStream);
this.isEmpty = (this.entryType == 0 || this.lenStream <= 0);
return true;
});
c$ = Clazz.p0p ();
};
});
