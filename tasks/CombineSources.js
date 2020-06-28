// Reads the HTA and inlines any stylesheets and scripts from external files
var a = new ActiveXObject("Scripting.FileSystemObject");
var b = a.GetParentFolderName(WScript.ScriptFullName);
var c = a.OpenTextFile(b + '\\..\\src\\Main.hta', 1);
var d = c.ReadAll();
c.Close();
c = undefined;

//Stylesheet Inlining - very basic, No media attribute to query conversion
c = /([\ \t]*)<link\s+rel=['|"]stylesheet['|"]\shref=['|"](.*)['|"]>/igm;
for (var f = c.exec(d); f != null; f = c.exec(d)) {
  var g = f[2];
  var h = a.OpenTextFile(b + '\\..\\src\\' + g);
  d = d.replace(f[0], (f[1] + '<style>\n  ' + h.ReadAll().replace(/\n/g, '\n  ') + '\n</style>').replace(/\n/g, '\n' + f[1]));
  h.Close();
  h = undefined;
}

//Script inlining - very basic
c = /([\ \t]*)<script\s+src=['|"](.*)['|"]\s*>\s*<\/script>/igm;
for (var f = c.exec(d); f != null; f = c.exec(d)) {
  var g = f[2];
  var h = a.OpenTextFile(b + '\\..\\src\\' + g);
  d = d.replace(f[0], (f[1] + '<script>\n  ' + h.ReadAll().replace(/\n/g, '\n  ') + '\n</script>').replace(/\n/g, '\n' + f[1]));
  h.Close();
  h = undefined;
}

//Markup inlining - custom syntax
c = /([\ \t]*){{(.*)}}/igm;
for (var f = c.exec(d); f != null; f = c.exec(d)) {
  var g = f[2];
  var h = a.OpenTextFile(b + '\\..\\src\\' + g);
  d = d.replace(f[0], (f[1] + '    ' + h.ReadAll().replace(/\n/g, '\n    ')).replace(/\n/g, '\n' + f[1]));
  h.Close();
  h = undefined;
}

c = a.OpenTextFile(b + '\\..\\src\\Encrypter.hta', 2, true);
c.Write(d);
c.Close();
c = undefined;