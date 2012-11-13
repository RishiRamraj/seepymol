﻿/* http://j2s.sf.net/ */$_J("org.apache.harmony.luni.util");
$_L(["java.util.Locale","org.apache.harmony.luni.util.MsgHelp"],"org.apache.harmony.luni.util.Msg",null,function(){
c$=$_T(org.apache.harmony.luni.util,"Msg");
c$.getString=$_M(c$,"getString",
function(msg){
if(org.apache.harmony.luni.util.Msg.bundle==null)return msg;
try{
return org.apache.harmony.luni.util.Msg.bundle.getString(msg);
}catch(e){
if($_O(e,java.util.MissingResourceException)){
return msg;
}else{
throw e;
}
}
},"~S");
c$.getString=$_M(c$,"getString",
function(msg,arg){
return org.apache.harmony.luni.util.Msg.getString(msg,[arg]);
},"~S,~O");
c$.getString=$_M(c$,"getString",
function(msg,arg){
return org.apache.harmony.luni.util.Msg.getString(msg,[Integer.toString(arg)]);
},"~S,~N");
c$.getString=$_M(c$,"getString",
function(msg,arg){
return org.apache.harmony.luni.util.Msg.getString(msg,[String.valueOf(arg)]);
},"~S,~N");
c$.getString=$_M(c$,"getString",
function(msg,arg1,arg2){
return org.apache.harmony.luni.util.Msg.getString(msg,[arg1,arg2]);
},"~S,~O,~O");
c$.getString=$_M(c$,"getString",
function(msg,args){
var format=msg;
if(org.apache.harmony.luni.util.Msg.bundle!=null){
try{
format=org.apache.harmony.luni.util.Msg.bundle.getString(msg);
}catch(e){
if($_O(e,java.util.MissingResourceException)){
}else{
throw e;
}
}
}return org.apache.harmony.luni.util.MsgHelp.format(format,args);
},"~S,~A");
$_S(c$,
"bundle",null);
});
$_J("org.apache.harmony.luni.util");
$_L(["java.util.ResourceBundle"],"org.apache.harmony.luni.util.MsgHelp",["java.lang.StringBuilder"],function(){
c$=$_T(org.apache.harmony.luni.util,"MsgHelp");
c$.format=$_M(c$,"format",
function(format,args){
var answer=new StringBuilder(format.length+(args.length*20));
var argStrings=new Array(args.length);
for(var i=0;i<args.length;++i){
if(args[i]==null)argStrings[i]="<null>";
else argStrings[i]=args[i].toString();
}
var lastI=0;
for(var i=format.indexOf('{', 0); i >= 0; i = format.indexOf ('{',lastI)){
if(i!=0&&(format.charAt(i-1)).charCodeAt(0)==('\\').charCodeAt(0)){
if(i!=1)answer.append(format.substring(lastI,i-1));
answer.append('{');
lastI=i+1;
}else{
if(i>format.length-3){
answer.append(format.substring(lastI,format.length));
lastI=format.length;
}else{
var argnum=((format.charAt(i+1)).charCodeAt(0)-('0').charCodeAt(0));
if(argnum<0||(format.charAt(i+2)).charCodeAt(0)!=('}').charCodeAt(0)){
answer.append(format.substring(lastI,i+1));
lastI=i+1;
}else{
answer.append(format.substring(lastI,i));
if(argnum>=argStrings.length)answer.append("<missing argument>");
else answer.append(argStrings[argnum]);
lastI=i+3;
}}}}
if(lastI<format.length)answer.append(format.substring(lastI,format.length));
return answer.toString();
},"~S,~A");
c$.setLocale=$_M(c$,"setLocale",
function(locale,resource){
return java.util.ResourceBundle.getBundle(resource);
},"java.util.Locale,~S");
});
