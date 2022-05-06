var FSo = new ActiveXObject("Scripting.FileSystemObject");
var WS_Shell = WScript.CreateObject("WScript.Shell");
var ExtCmd = WS_Shell.Run('cscript .\\tasks\\Compile.js', 0, true);

function create_HTA_targeting_IE(versionOfIE, saveLocation) {
  var genericHTA = FSo.OpenTextFile(".\\dist\\Encrypter.hta");
  var genericHTA_HTML = genericHTA.ReadAll();
  genericHTA.Close();
  genericHTA = undefined;
  var targetedHTA_HTML = genericHTA_HTML.replace(/(\s*)<meta http-equiv="X-UA-Compatible" content=".*">(\s*)/g, '$1<meta http-equiv="X-UA-Compatible" content="IE=' + versionOfIE + '">$2');
  var targetedHTA = FSo.OpenTextFile(saveLocation, 2, true);
  targetedHTA.Write(targetedHTA_HTML);
  targetedHTA.Close();
  targetedHTA = undefined;
}

var CurrentFolder = FSo.GetFolder(WS_Shell.CurrentDirectory);
var FoldersInCurrentFolder = [];
for (var e = new Enumerator(CurrentFolder.SubFolders); !e.atEnd(); e.moveNext()) {
  FoldersInCurrentFolder.push(e.item());
}

WScript.Echo("============")
var deleted = [];
if (FoldersInCurrentFolder.join(" \n").indexOf("temp") > -1) {
  // Tests Folder Already Exists. Assume Tests Folder Is Stale And Delete it.
  // In future maybe remove this step, and reimplement the other steps, 
  // But only if the cost of recreating all the files becomes too high.
  WScript.Echo("Deleting Old Folders \n------------ ");
  for (var e = new Enumerator(CurrentFolder.SubFolders); !e.atEnd(); e.moveNext()) {
    var FolderName = e.item().Name;
    var willDelete = false;
    if (FolderName === "temp") willDelete = true;
    if (willDelete == true) {
      deleted.push(FolderName);
      e.item().Delete(true);
      // true enables force deletion of read-only files and folders
    }
  }
  WScript.Echo("Deleted Following Folders. \n--------")
  for (var i = 0; i !== deleted.length; i++) {
    WScript.Echo("[" + (i + 1).toString() + "] '.\\" + deleted[i] + "\\'");
  }
}

WScript.Echo("============ \nMaking Tests Folder. ");
CurrentFolder.SubFolders.Add("temp");
WScript.Echo("------------ \nMade Tests Folder. ");

WScript.Echo("============ \nGenerating HTAs For Testing Changes On Different Versions Of IE \n--------");
var CompatibilityModesList = [5, 6, 7, 8, 9, 10, 11, "Edge"];
for (var i = 0; i !== CompatibilityModesList.length; i++) {
  WScript.Echo("[" + (i + 1).toString() + "] Generating HTA For Testing Changes With IE=" + CompatibilityModesList[i]);
  create_HTA_targeting_IE(CompatibilityModesList[i], ".\\temp\\IE_" + CompatibilityModesList[i] + ".hta");
}
WScript.Echo("------------ \nGenerated Following HTAs For Testing Changes On Different Versions Of IE \n--------");
for (var i = 0; i !== CompatibilityModesList.length; i++) {
  WScript.Echo("[" + (i + 1).toString() + "] '.\\temp\\IE_" + CompatibilityModesList[i] + ".hta'");
}

WScript.Echo("============ \nGenerating HTM For Testing Changes On Different Browsers ");
create_HTA_targeting_IE("Edge", ".\\temp\\Encrypter.htm");
WScript.Echo("------------ \nGenerated Following HTM For Testing Changes On Different Browsers \n--------");
WScript.Echo("[1] '.\\temp\\Encrypter.htm'");

WS_Shell.Exec('explorer .\\temp\\');

WScript.Echo("============ \nDone. \n============");