//this part packs assets into a js file which can then be inlined later on.
var a = new ActiveXObject("Scripting.FileSystemObject");
var b = new Enumerator(a.GetFolder(a.GetParentFolderName(WScript.ScriptFullName) + '\\..\\assets\\').files);
var c = [];
for (; !b.atEnd(); b.moveNext()) {
  var d = b.item();
  c.push([d.Path, d.Name]);
}
b = c;
for (c = 0; c < b.length; c++) {
  var d = new ActiveXObject("ADODB.Stream");
  d.Type = 1;
  d.Open();
  d.LoadFromFile(b[c][0]);
  b[c][0] = d;
  d = new ActiveXObject("Microsoft.XMLDOM").createElement("Base64Data");
  d.dataType = "bin.base64";
  d.nodeTypedValue = b[c][0].Read();
  b[c][0].Close();
  b[c][0] = d;
  b[c] = '    "' + b[c][1] + '": "' + b[c][0].text.replace(/\n/g, "") + '"';
}
b = 'var Assets = (function (a, b, c) { \n\
  var Assets = { \n\
' + b.join(', \n') + ' \n\
  }; \n\
  try { \n\
    function cleanup () { \n\
      a = new ActiveXObject("WScript.Shell"); \n\
      b = new ActiveXObject("Scripting.FileSystemObject"); \n\
      a.CurrentDirectory = b.GetSpecialFolder(2); \n\
      b.DeleteFolder(c.slice(0, -1)); \n\
    } \n\
    addEvent(window, "unload", cleanup); \n\
    a = new ActiveXObject("WScript.Shell"); \n\
    b = new ActiveXObject("Scripting.FileSystemObject"); \n\
    c = b.GetSpecialFolder(2) + "\\\\Strngncryptr-" + b.GetTempName() + "\\\\"; \n\
    b.CreateFolder(c); \n\
    a.CurrentDirectory = c; \n\
    for (var FileName in Assets) { \n\
      a = new ActiveXObject("Microsoft.XMLDOM").createElement("Base64Data"); \n\
      a.dataType = "bin.base64"; \n\
      a.text = Assets[FileName]; \n\
      b = new ActiveXObject("ADODB.Stream"); \n\
      b.Type = 1; \n\
      b.Open(); \n\
      b.Write(a.nodeTypedValue); \n\
      b.SaveToFile(FileName, 2); \n\
      b.Close(); \n\
      Assets[FileName] = c + FileName; \n\
    } \n\
  } catch (e) { \n\
    for (var FileName in Assets) { \n\
      e = FileName.split("."); \n\
      e = "." + e[e.length - 1]; \n\
      Assets[FileName] = "data:" + (MIME_Types[e] ? MIME_Types[e] : "application/octet-stream") + ";base64," + Assets[FileName]; \n\
    } \n\
  } \n\
  return Assets; \n\
})(); \n\
';
c = a.OpenTextFile('src\\Assets.js', 2, true);
c.Write(b);
c.Close();

// the next part reads the HTA and inlines any stylesheets and scripts from external files
a = new ActiveXObject("Scripting.FileSystemObject");
b = a.GetParentFolderName(WScript.ScriptFullName);
c = a.OpenTextFile('src\\Main.hta', 1);
var d = c.ReadAll();
c.Close();
c = undefined;

//Stylesheet Inlining - very basic, No media attribute to query conversion
c = /([\ \t]*)<link\s+rel=['|"]stylesheet['|"]\shref=['|"](.*)['|"]>/igm;
for (var f = c.exec(d); f != null; f = c.exec(d)) {
  var g = f[2];
  var h = a.OpenTextFile('src\\' + g);
  d = d.replace(f[0], (f[1] + '<style>\n  ' + h.ReadAll().replace(/\n/g, '\n  ') + '\n</style>').replace(/\n/g, '\n' + f[1]));
  h.Close();
  h = undefined;
}

//Script inlining - very basic
c = /([\ \t]*)<script\s+src=['|"](.*)['|"]\s*>\s*<\/script>/igm;
for (var f = c.exec(d); f != null; f = c.exec(d)) {
  var g = f[2];
  var h = a.OpenTextFile('src\\' + g);
  d = d.replace(f[0], (f[1] + '<script>\n  ' + h.ReadAll().replace(/\n/g, '\n  ') + '\n</script>').replace(/\n/g, '\n' + f[1]));
  h.Close();
  h = undefined;
}

//Markup inlining - custom syntax
c = /([\ \t]*){{(.*)}}/igm;
for (var f = c.exec(d); f != null; f = c.exec(d)) {
  var g = f[2];
  var h = a.OpenTextFile('src\\' + g);
  d = d.replace(f[0], (f[1] + '    ' + h.ReadAll().replace(/\n/g, '\n    ')).replace(/\n/g, '\n' + f[1]));
  h.Close();
  h = undefined;
}

//Saving to dist dir
c = a.OpenTextFile('dist\\Encrypter.hta', 2, true);
c.Write(d);
c.Close();
c = undefined;

WScript.Echo("============ \nDone. \n============");