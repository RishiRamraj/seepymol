var path = ClazzLoader.getClasspathFor ("org.jmol.util.package");
path = path.substring (0, path.lastIndexOf ("package.js"));
ClazzLoader.jarClasspath (path + "JpegEncoder.js", [
"org.jmol.util.JpegEncoder",
"$.JpegInfo",
"$.Huffman",
"$.DCT"]);
