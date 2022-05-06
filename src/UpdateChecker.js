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
var latestVersion = (function () {
  var CachedVersion = '', XHR;
  function GetLatestVersion () {
    if (Environment.IsOldIE) {
      XHR = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      XHR = new XMLHttpRequest();
    }
    XHR.onreadystatechange = function () {
      if (XHR.readyState == 4) {
        if (XHR.status >= 200 && XHR.status < 400) {
          CachedVersion = XHR.responseText.replace(/\n/gm, "").replace(/.*"(v[^"]*)".*/gm, "$1");
        } else {
          CachedVersion = 'v0.0.0';
        }
      }
    };
    XHR.open('GET', 'https://api.github.com/repos/GianSinghSarao/String-Encrypter/releases/latest', true);
    XHR.send();
  }
  GetLatestVersion();
  return function (refresh) {
    if (refresh) {
      GetLatestVersion();
    } else {
      return CachedVersion;
    }
  };
})();
addEvent(window, 'load', function (a, A, B, C) {
  try {
    A = 'v' + document.getElementById('appTag').getAttribute('version');
  } catch (e) {
    A = 'unknown';
  }
  B = latestVersion(); 
  C = '<span> Current Version: ' + A;
  if (B == 'v0.0.0') {
    C += '(Failed to check for updates);';  
  } else {
    if (ifSuitable(convertSemverVersionToArray(A), convertSemverVersionToArray(B))) {
      if (A != B) {
        C += '(Alpha);';
      } else {
        C += '(Stable);';
      }
    } else {
      C += '(<a href="https://github.com/GianSinghSarao/String-Encrypter/releases/latest/" title="https://github.com/GianSinghSarao/String-Encrypter/releases/latest/">Get Latest Version</a>);';
    }
  }
  C += '</span> \n<a href="https://github.com/GianSinghSarao/String-Encrypter" title="https://github.com/GianSinghSarao/String-Encrypter">GitHub Repository</a>;'
  C = '<div role="contentinfo" id="PageStatusBar">'+ C + '</div>';
  document.body.innerHTML += C;
});