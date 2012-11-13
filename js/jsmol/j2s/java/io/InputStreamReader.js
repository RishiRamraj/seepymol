Clazz.load (["java.io.Reader"], "java.io.InputStreamReader", ["java.io.UTFDataFormatException", "java.lang.NullPointerException"], function () {
c$ = Clazz.decorateAsClass (function () {
this.$in = null;
this.isOpen = true;
this.bytearr = null;
this.pos = 0;
Clazz.instantialize (this, arguments);
}, java.io, "InputStreamReader", java.io.Reader);
Clazz.makeConstructor (c$, 
function ($in, charsetName) {
Clazz.superConstructor (this, java.io.InputStreamReader, [$in]);
this.$in = $in;
if (!"UTF-8".equals (charsetName)) throw  new NullPointerException ("charsetName");
}, "java.io.InputStream,~S");
Clazz.defineMethod (c$, "getEncoding", 
function () {
return "UTF-8";
});
Clazz.overrideMethod (c$, "read", 
function (cbuf, offset, length) {
if (this.bytearr == null || this.bytearr.length < length) this.bytearr =  Clazz.newByteArray (length, 0);
var c;
var char2;
var char3;
var count = 0;
var chararr_count = 0;
var len = this.$in.read (this.bytearr, this.pos, length - this.pos);
if (len < 0) return -1;
this.pos = 0;
while (count < len) {
c = this.bytearr[count] & 0xff;
if (c > 127) break;
count++;
cbuf[chararr_count++] = String.fromCharCode (c);
}
while (count < len) {
c = this.bytearr[count] & 0xff;
switch (c >> 4) {
case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
count++;
cbuf[chararr_count++] = String.fromCharCode (c);
break;
case 12:
case 13:
if (count > len - 2) break;
count += 2;
char2 = this.bytearr[count - 1];
if ((char2 & 0xC0) != 0x80) throw  new java.io.UTFDataFormatException ("malformed input around byte " + count);
cbuf[chararr_count++] = String.fromCharCode (((c & 0x1F) << 6) | (char2 & 0x3F));
break;
case 14:
if (count > len - 3) break;
count += 3;
char2 = this.bytearr[count - 2];
char3 = this.bytearr[count - 1];
if (((char2 & 0xC0) != 0x80) || ((char3 & 0xC0) != 0x80)) throw  new java.io.UTFDataFormatException ("malformed input around byte " + (count - 1));
cbuf[chararr_count++] = String.fromCharCode (((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
break;
default:
throw  new java.io.UTFDataFormatException ("malformed input around byte " + count);
}
}
this.pos = len - count;
for (var i = 0; i < this.pos; i++) {
this.bytearr[i] = this.bytearr[count++];
}
return len - this.pos;
}, "~A,~N,~N");
Clazz.overrideMethod (c$, "ready", 
function () {
return this.isOpen;
});
Clazz.overrideMethod (c$, "close", 
function () {
this.$in.close ();
this.isOpen = false;
});
});
