// this part is just a pre-execution check to figure out if the jscript file was
// double-clicked or if it's been ran from vscode or started some other way
var a = new ActiveXObject("WScript.Shell");
var b = a.CurrentDirectory;
var c = new ActiveXObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName);
if (b == "C:\\Windows\\system32") {
  // Dragged a file onto the JScript or similar
  WScript.Echo("Can't handle drag and drop! Exiting without compiling.");
  WScript.Quit();
} else if (b == c) {
  // Double clicked it
  a.CurrentDirectory = "..\\";
}

// this part packs images (or other binaries) into a js file for inlining later
a = new ActiveXObject("Scripting.FileSystemObject");
b = new Enumerator(a.GetFolder(a.GetAbsolutePathName(".") + '\\assets').files);
c = [];
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
b = 'var Assets = (function (a, b, c) { \r\n\
  var Assets = { \r\n\
' + b.join(', \n') + ' \r\n\
  }; \r\n\
  try { \r\n\
    if (Environment.hasActiveXObject) { \r\n\
      function cleanup () { \r\n\
        a = new ActiveXObject("WScript.Shell"); \r\n\
        b = new ActiveXObject("Scripting.FileSystemObject"); \r\n\
        a.CurrentDirectory = b.GetSpecialFolder(2); \r\n\
        b.DeleteFolder(c.slice(0, -1)); \r\n\
      } \r\n\
      addEvent(window, "unload", cleanup); \r\n\
      a = new ActiveXObject("WScript.Shell"); \r\n\
      b = new ActiveXObject("Scripting.FileSystemObject"); \r\n\
      c = b.GetSpecialFolder(2) + "\\\\Strngncryptr-" + b.GetTempName() + "\\\\"; \r\n\
      b.CreateFolder(c); \r\n\
      a.CurrentDirectory = c; \r\n\
      for (var FileName in Assets) { \r\n\
        a = new ActiveXObject("Microsoft.XMLDOM").createElement("Base64Data"); \r\n\
        a.dataType = "bin.base64"; \r\n\
        a.text = Assets[FileName]; \r\n\
        b = new ActiveXObject("ADODB.Stream"); \r\n\
        b.Type = 1; \r\n\
        b.Open(); \r\n\
        b.Write(a.nodeTypedValue); \r\n\
        b.SaveToFile(FileName, 2); \r\n\
        b.Close(); \r\n\
        Assets[FileName] = c + FileName; \r\n\
      } \r\n\
    } else { \r\n\
      throw "Not IE"; \r\n\
    } \r\n\
  } catch (e) { \r\n\
    // Not IE Or new ActiveXObject("ADODB.Stream") failed \r\n\
    for (var FileName in Assets) { \r\n\
      e = FileName.split("."); \r\n\
      e = "." + e[e.length - 1]; \r\n\
      Assets[FileName] = "data:" + ( \r\n\
        MIME_Types[e] ? \r\n\
          MIME_Types[e] : \r\n\
          "application/octet-stream" \r\n\
        ) + ";base64," + Assets[FileName]; \r\n\
    } \r\n\
  } \r\n\
  return Assets; \r\n\
})(); \r\n\
';
c = a.OpenTextFile('src\\Assets.js', 2, true);
c.Write(b);
c.Close();

// the next part reads the HTA and inlines any stylesheets and scripts
c = a.OpenTextFile('src\\Main.hta', 1);
b = c.ReadAll();
c.Close();

//Stylesheet Inlining - very basic, No media attribute to query conversion
c = /([\ \t]*)<link\s+rel=['|"]stylesheet['|"]\shref=['|"](.*)['|"]>/igm;
for (var d = c.exec(b); d != null; d = c.exec(b)) {
  var e = a.OpenTextFile('src\\' + d[2]);
  b = b.replace(d[0], (d[1] + '<style>\n  ' + e.ReadAll().replace(/\n/g, '\n  ') + '\n</style>').replace(/\n/g, '\n' + d[1]));
  e.Close();
  e = undefined;
}

//Script inlining - very basic
c = /([\ \t]*)<script\s+src=['|"](.*)['|"]\s*>\s*<\/script>/igm;
for (var d = c.exec(b); d != null; d = c.exec(b)) {
  var e = a.OpenTextFile('src\\' + d[2]);
  b = b.replace(d[0], (d[1] + '<script>\n  ' + e.ReadAll().replace(/\n/g, '\n  ') + '\n</script>').replace(/\n/g, '\n' + d[1]));
  e.Close();
  e = undefined;
}

//Markup inlining - custom syntax
c = /([\ \t]*){{(.*)}}/igm;
for (var d = c.exec(b); d != null; d = c.exec(b)) {
  var e = a.OpenTextFile('src\\' + d[2]);
  b = b.replace(d[0], (d[1] + '    ' + e.ReadAll().replace(/\n/g, '\n    ')).replace(/\n/g, '\n' + d[1]));
  e.Close();
  e = undefined;
}

//Saving to dist dir
c = a.OpenTextFile('dist\\Encrypter.hta', 2, true);
c.Write(b);
c.Close();
c = undefined;

WScript.Echo("============ \nDone. \n============");