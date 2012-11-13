Clazz.declarePackage ("org.jmol.adapter.readers.xml");
Clazz.load (["org.jmol.adapter.smarter.AtomSetCollectionReader", "org.xml.sax.EntityResolver", "org.xml.sax.helpers.DefaultHandler"], "org.jmol.adapter.readers.xml.XmlReader", ["java.io.BufferedReader", "$.StringReader", "java.util.Hashtable", "javax.xml.parsers.SAXParserFactory", "org.jmol.adapter.smarter.AtomSetCollection", "$.Resolver", "org.jmol.util.Logger", "org.xml.sax.InputSource"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atom = null;
this.implementedAttributes = null;
this.parent = null;
this.keepChars = false;
this.chars = null;
if (!Clazz.isClassDefined ("org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler")) {
org.jmol.adapter.readers.xml.XmlReader.$XmlReader$JmolXmlHandler$ ();
}
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml, "XmlReader", org.jmol.adapter.smarter.AtomSetCollectionReader);
Clazz.prepareFields (c$, function () {
this.implementedAttributes = ["id"];
});
Clazz.overrideMethod (c$, "initializeReader", 
function () {
var xmlReader = this.getXMLReader ();
if (xmlReader == null) {
this.atomSetCollection =  new org.jmol.adapter.smarter.AtomSetCollection ("xml", this, null, null);
this.atomSetCollection.errorMessage = "No XML reader found";
return;
}this.processXml (xmlReader);
this.continuing = false;
});
Clazz.defineMethod (c$, "getXMLReader", 
($fz = function () {
var xmlr = null;
try {
var spf = javax.xml.parsers.SAXParserFactory.newInstance ();
spf.setNamespaceAware (true);
var saxParser = spf.newSAXParser ();
xmlr = saxParser.getXMLReader ();
org.jmol.util.Logger.debug ("Using JAXP/SAX XML parser.");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.debug ("Could not instantiate JAXP/SAX XML reader: " + e.getMessage ());
} else {
throw e;
}
}
return xmlr;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "processXml", 
($fz = function (xmlReader) {
this.atomSetCollection =  new org.jmol.adapter.smarter.AtomSetCollection (this.readerName, this, null, null);
var res = this.getXmlReader ();
if (Clazz.instanceOf (res, String)) return res;
var thisReader = res;
thisReader.processXml (this, this.atomSetCollection, this.reader, xmlReader, thisReader.getHandler (xmlReader));
return thisReader;
}, $fz.isPrivate = true, $fz), "org.xml.sax.XMLReader");
Clazz.defineMethod (c$, "getXmlReader", 
($fz = function () {
var className = null;
var atomSetCollectionReaderClass;
var err = null;
var thisReader = null;
try {
var pt = this.readerName.indexOf ("(");
var name = (pt < 0 ? this.readerName : this.readerName.substring (0, pt));
className = org.jmol.adapter.smarter.Resolver.getReaderClassBase (name);
atomSetCollectionReaderClass = Class.forName (className);
thisReader = atomSetCollectionReaderClass.newInstance ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
err = "File reader was not found:" + className;
org.jmol.util.Logger.error (err);
return err;
} else {
throw e;
}
}
return thisReader;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "processXml", 
function (parent, atomSetCollection, reader, xmlReader, handler) {
this.parent = parent;
this.atomSetCollection = atomSetCollection;
this.reader = reader;
if (Clazz.instanceOf (xmlReader, org.xml.sax.XMLReader)) {
this.parseReaderXML (xmlReader);
} else {
this.getImplementedAttributes ();
handler.walkDOMTree (xmlReader);
}}, "org.jmol.adapter.readers.xml.XmlReader,org.jmol.adapter.smarter.AtomSetCollection,java.io.BufferedReader,~O,org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler");
Clazz.defineMethod (c$, "parseReaderXML", 
function (xmlReader) {
xmlReader.setEntityResolver ( new org.jmol.adapter.readers.xml.XmlReader.DummyResolver ());
var is =  new org.xml.sax.InputSource (this.reader);
is.setSystemId ("foo");
try {
xmlReader.parse (is);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println (e.getMessage ());
this.atomSetCollection.errorMessage = "XML parsing error: " + e.getMessage ();
} else {
throw e;
}
}
}, "org.xml.sax.XMLReader");
Clazz.defineMethod (c$, "processXml", 
function (DOMNode) {
this.atomSetCollection =  new org.jmol.adapter.smarter.AtomSetCollection (this.readerName, this, null, null);
var className = null;
var atomSetCollectionReaderClass;
var thisReader = null;
var name = this.readerName.substring (0, this.readerName.indexOf ("("));
try {
className = org.jmol.adapter.smarter.Resolver.getReaderClassBase (name);
atomSetCollectionReaderClass = Class.forName (className);
thisReader = atomSetCollectionReaderClass.newInstance ();
thisReader.processXml (this, this.atomSetCollection, this.reader, DOMNode, thisReader.getHandler (null));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.atomSetCollection.errorMessage = "File reader was not found:" + className;
} else {
throw e;
}
}
}, "~O");
Clazz.defineMethod (c$, "getImplementedAttributes", 
function () {
return this.implementedAttributes;
});
Clazz.defineMethod (c$, "processStartElement", 
function (namespaceURI, localName, qName, atts) {
}, "~S,~S,~S,java.util.Map");
Clazz.defineMethod (c$, "setKeepChars", 
function (TF) {
this.keepChars = TF;
this.chars = null;
}, "~B");
Clazz.defineMethod (c$, "processEndElement", 
function (uri, localName, qName) {
}, "~S,~S,~S");
Clazz.defineMethod (c$, "applySymmetryAndSetTrajectory", 
function () {
try {
if (this.parent == null) Clazz.superCall (this, org.jmol.adapter.readers.xml.XmlReader, "applySymmetryAndSetTrajectory", []);
 else this.parent.applySymmetryAndSetTrajectory ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println (e.getMessage ());
org.jmol.util.Logger.error ("applySymmetry failed: " + e);
} else {
throw e;
}
}
});
Clazz.defineMethod (c$, "getHandler", 
function (xmlReader) {
return Clazz.innerTypeInstance (org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler, this, null, xmlReader);
}, "~O");
c$.$XmlReader$JmolXmlHandler$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.atts = null;
this.context = "";
Clazz.instantialize (this, arguments);
}, org.jmol.adapter.readers.xml.XmlReader, "JmolXmlHandler", org.xml.sax.helpers.DefaultHandler);
Clazz.makeConstructor (c$, 
function (a) {
Clazz.superConstructor (this, org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler, []);
if (Clazz.instanceOf (a, org.xml.sax.XMLReader)) this.setHandler (a, this);
}, "~O");
Clazz.defineMethod (c$, "setHandler", 
($fz = function (a, b) {
try {
a.setFeature ("http://xml.org/sax/features/validation", false);
a.setFeature ("http://xml.org/sax/features/namespaces", true);
a.setEntityResolver (b);
a.setContentHandler (b);
a.setErrorHandler (b);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
org.jmol.util.Logger.errorEx ("ERROR IN XmlReader.JmolXmlHandler.setHandler", e);
} else {
throw e;
}
}
}, $fz.isPrivate = true, $fz), "org.xml.sax.XMLReader,org.jmol.adapter.readers.xml.XmlReader.JmolXmlHandler");
Clazz.overrideMethod (c$, "startDocument", 
function () {
});
Clazz.overrideMethod (c$, "endDocument", 
function () {
});
Clazz.defineMethod (c$, "startElement", 
function (a, b, c, d) {
this.getAttributes (d);
if (org.jmol.util.Logger.debugging) {
this.context += " " + b;
org.jmol.util.Logger.debug (this.context);
}this.startElement (a, b, c);
}, "~S,~S,~S,org.xml.sax.Attributes");
Clazz.defineMethod (c$, "startElement", 
($fz = function (a, b, c) {
this.b$["org.jmol.adapter.readers.xml.XmlReader"].processStartElement (a, b, c, this.atts);
}, $fz.isPrivate = true, $fz), "~S,~S,~S");
Clazz.overrideMethod (c$, "endElement", 
function (a, b, c) {
if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.debug ("");
this.context = this.context.substring (0, this.context.lastIndexOf (" "));
}this.b$["org.jmol.adapter.readers.xml.XmlReader"].processEndElement (a, b, c);
}, "~S,~S,~S");
Clazz.overrideMethod (c$, "characters", 
function (a, b, c) {
if (this.b$["org.jmol.adapter.readers.xml.XmlReader"].keepChars) {
if (this.b$["org.jmol.adapter.readers.xml.XmlReader"].chars == null) {
this.b$["org.jmol.adapter.readers.xml.XmlReader"].chars =  String.instantialize (a, b, c);
} else {
this.b$["org.jmol.adapter.readers.xml.XmlReader"].chars +=  String.instantialize (a, b, c);
}}}, "~A,~N,~N");
Clazz.defineMethod (c$, "resolveEntity", 
function (a, b, c, d) {
if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.debug ("Not resolving this:\n      name: " + a + "\n  systemID: " + d + "\n  publicID: " + b + "\n   baseURI: " + c);
}return null;
}, "~S,~S,~S,~S");
Clazz.defineMethod (c$, "resolveEntity", 
function (a, b) {
if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.debug ("Not resolving this:\n  publicID: " + a + "\n  systemID: " + b);
}return null;
}, "~S,~S");
Clazz.overrideMethod (c$, "error", 
function (a) {
org.jmol.util.Logger.error ("SAX ERROR:" + a.getMessage ());
}, "org.xml.sax.SAXParseException");
Clazz.overrideMethod (c$, "fatalError", 
function (a) {
org.jmol.util.Logger.error ("SAX FATAL:" + a.getMessage ());
}, "org.xml.sax.SAXParseException");
Clazz.overrideMethod (c$, "warning", 
function (a) {
org.jmol.util.Logger.warn ("SAX WARNING:" + a.getMessage ());
}, "org.xml.sax.SAXParseException");
Clazz.defineMethod (c$, "walkDOMTree", 
function (a) {
var b = this.jsObjectGetMember (a, "localName");
if (b == null) return;
var c = this.jsObjectGetMember (a, "namespaceURI");
var d = this.jsObjectGetMember (a, "nodeName");
this.getAttributes (this.jsObjectGetMember (a, "attributes"));
this.startElement (c, b, d);
if ((this.jsObjectCall (a, "hasChildNodes", null)).booleanValue ()) {
for (var e = this.jsObjectGetMember (a, "firstChild"); e != null; e = this.jsObjectGetMember (e, "nextSibling")) this.walkDOMTree (e);

}this.endElement (c, b, d);
}, "~O");
Clazz.defineMethod (c$, "getAttributes", 
($fz = function (a) {
var b = a.getLength ();
this.atts =  new java.util.Hashtable (b);
for (var c = b; --c >= 0; ) this.atts.put (a.getLocalName (c), a.getValue (c));

}, $fz.isPrivate = true, $fz), "org.xml.sax.Attributes");
Clazz.defineMethod (c$, "getAttributes", 
($fz = function (a) {
if (a == null) {
this.atts =  new java.util.Hashtable (0);
return;
}var b = this.jsObjectGetMember (a, "length");
if (b == null) return;
var c = b.intValue ();
this.atts =  new java.util.Hashtable (c);
for (var d = this.b$["org.jmol.adapter.readers.xml.XmlReader"].implementedAttributes.length; --d >= 0; ) {
var e = [this.b$["org.jmol.adapter.readers.xml.XmlReader"].implementedAttributes[d]];
var f = this.jsObjectCall (a, "getNamedItem", e);
if (f != null) {
var g = this.jsObjectGetMember (f, "name");
var h = this.jsObjectGetMember (f, "value");
if (g != null && h != null) this.atts.put (g, h);
}}
}, $fz.isPrivate = true, $fz), "~O");
Clazz.defineMethod (c$, "jsObjectCall", 
($fz = function (a, b, c) {
return this.b$["org.jmol.adapter.readers.xml.XmlReader"].parent.viewer.getJsObjectInfo (a, b, c);
}, $fz.isPrivate = true, $fz), "~O,~S,~A");
Clazz.defineMethod (c$, "jsObjectGetMember", 
($fz = function (a, b) {
return this.b$["org.jmol.adapter.readers.xml.XmlReader"].parent.viewer.getJsObjectInfo (a, b, null);
}, $fz.isPrivate = true, $fz), "~O,~S");
c$ = Clazz.p0p ();
};
Clazz.pu$h ();
c$ = Clazz.declareType (org.jmol.adapter.readers.xml.XmlReader, "DummyResolver", null, org.xml.sax.EntityResolver);
Clazz.overrideMethod (c$, "resolveEntity", 
function (a, b) {
if (org.jmol.util.Logger.debugging) {
org.jmol.util.Logger.debug ("Jmol SAX EntityResolver not resolving:\n  publicID: " + a + "\n  systemID: " + b);
}return  new org.xml.sax.InputSource ( new java.io.BufferedReader ( new java.io.StringReader ("")));
}, "~S,~S");
c$ = Clazz.p0p ();
});
