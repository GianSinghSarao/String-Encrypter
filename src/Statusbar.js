function convertSemverVersionToArray (a, A, B, C) {
  A = a.replace('v', '').split('.');
  B = [];
  for (C = 0; C != A.length; C++) {
    B[C] = Number(A[C]);
  }
  return B;
};
function ifSuitable (a, b) {
  if (a[0] > b[0]) return true;
  if (a[0] < b[0]) return false;
  if (a[1] > b[1]) return true;
  if (a[1] < b[1]) return false;
  if (a[2] < b[2]) return false;
  return true;
};
var RepositoryURL = "https://github.com/GianSinghSarao/String-Encrypter/";
var LatestReleaseURL = RepositoryURL + "releases/latest";
var LatestReleaseAPI_URL = LatestReleaseURL.
  replace("github.com/", "api.github.com/repos/");
var LatestVersion = (function () {
  var CachedVersion = "", XHR;
  function GetLatestVersion () {
    if (Environment.IsOldIE) {
      XHR = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      XHR = new XMLHttpRequest();
    }
    XHR.onreadystatechange = function () {
      if (XHR.readyState == 4) {
        if (XHR.status >= 200 && XHR.status < 400) {
          CachedVersion = XHR.responseText.
            replace(/\n/gm, "").
            replace(/.*"(v[^"]*)".*/gm, "$1");
        } else {
          CachedVersion = "v0.0.0";
        }
      }
      hydrateStatusbar(false);
    };
    try {
      XHR.open("GET", LatestReleaseAPI_URL, true);
      XHR.send();
    } catch (e) {
      CachedVersion = "v0.0.0";
      alert("Failed To Check For Updates:\n  This occurs when the program is run without unblocking it.\n  You can unblock this program by unselecting the checkbox in the security warning\n  \"Always ask before opening this file\"\n\n  Alternatively, You can ignore this and continue using the program as normal. ")
    }
  }
  return function (refresh) {
    if (refresh) {
      GetLatestVersion();
    } 
    return CachedVersion;
  };
})();

var CurrentVersion = (function () {
  var CachedVersion = "unknown", d = document;
  function GetCurrentVersion () {
    try {
      var All_HTA_Tags = d.getElementsByTagName("HTA:APPLICATION").length !== 0 ?
        d.getElementsByTagName("HTA:APPLICATION") : 
        d.getElementsByTagName("APPLICATION");
      if (All_HTA_Tags.length >= 1 && All_HTA_Tags[0]) {
        return "v" + All_HTA_Tags[0].getAttribute('version');
      }
    } catch(e) {
      return "unknown";
    }
  }
  return function (refresh) {
    if (refresh) {
      CachedVersion = GetCurrentVersion();
    }
    return CachedVersion;
  }
})();

function version_status (refresh, versions, HTML_String) {
  versions = {
    CV: CurrentVersion(refresh),
    LV: LatestVersion(refresh)
  }
  HTML_String = "<span> Current Version: " + versions.CV;
  if (versions.LV == "v0.0.0") {
    HTML_String += "(Failed to check for updates);";
    return HTML_String + "</span>";
  }
  if (ifSuitable(
    convertSemverVersionToArray(versions.CV),
    convertSemverVersionToArray(versions.LV)
  )) {
    if (versions.CV != versions.LV) {
      HTML_String += "(Unreleased);";
    } else {
      HTML_String += "(Latest);";
    }
  } else {
    HTML_String += '(<a href="' +
      LatestReleaseURL +
      '" title="' +
      LatestReleaseURL + 
      '">Update Available</a>);';
  }
  HTML_String += "</span>";
  return HTML_String;
}

function hydrateStatusbar (refresh) {
  document.getElementById("PageStatusBar").innerHTML = version_status(refresh) + ' <a href="https://github.com/GianSinghSarao/String-Encrypter" title="https://github.com/GianSinghSarao/String-Encrypter">GitHub&nbsp;Repository</a>';
}

addEvent(window, "load", function (event, versions, B, C) {
  document.body.innerHTML += '<div role="contentinfo" id="PageStatusBar"></div>';
  hydrateStatusbar(true);
});