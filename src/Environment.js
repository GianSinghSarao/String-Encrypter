;var __global__ = this; var Environment = (function (a) {
  var a = {
    hasLocalStorage: !(typeof window === "undefined") && !(typeof window.localStorage === "undefined"), 
    hasDocument: !(typeof window === "undefined") && !(typeof window.document === "undefined"), 
    hasActiveXObject: !(typeof window === "undefined") && ("ActiveXObject" in window), 
    hasConsole: !(typeof console === "undefined"), 
    hasGlobal: !(typeof global === "undefined"), 
    hasWindow: !(typeof window === "undefined"), 
    hasAlert: !(typeof alert === "undefined"), 
    hasDeno: !(typeof Deno === "undefined")
  };
  a.IsOldIE = (a.hasWindow && !a.hasConsole && a.hasAlert && a.hasActiveXObject);
  a.IsHTA = function () {
    if (a.IsBrowser) {
      var htaApp = document.getElementsByTagName("HTA:APPLICATION").length !== 0 ? document.getElementsByTagName("HTA:APPLICATION") : document.getElementsByTagName("APPLICATION");
      if (htaApp.length == 1 && htaApp[0]) {
        return (typeof htaApp[0].commandLine !== "undefined");
      }
    }
    return false;
  }; // is a function because it depends on dom to verify
  a.IsModernBrowser = (a.hasWindow && a.hasConsole && a.hasAlert && a.hasDocument);
  a.IsBrowser = (a.hasWindow && a.hasAlert && a.hasDocument);
  a.IsWScript = (!a.hasWindow && !a.hasConsole && !a.hasAlert);
  a.IsNode = (a.hasGlobal);
  a.IsDeno = (a.hasDeno);
  try {
    __global__.Environment = a;
  } finally {
    return a;
  }
})();