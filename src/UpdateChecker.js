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
var latestVersion = (function (C) {
  try {
    C = new ActiveXObject('WinHttp.WinHttpRequest.5.1');
    C.Option(6) = false; //i have no idea how this works. i hope it's because it returns a reference to the enableRedirects option, instead of a copy.
    C.open("GET", 'https://github.com/GianSinghSarao/String-Encrypter/releases/latest/', false);
    C.send();
  } catch (D) {
    return 'v0.0.0';
  }
  return C.GetResponseHeader('Location').split('/').pop();
})();
addEvent(window, 'load', function (a, A, B, C) {
  A = 'v' + appTag.version;
  B = latestVersion; 
  C = '<span class="section"> Current Version: ' + A;
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
  C += ' <br>\n<a href="https://github.com/GianSinghSarao/String-Encrypter" title="https://github.com/GianSinghSarao/String-Encrypter">GitHub Repository</a>; </span>'
  container.innerHTML += C;
});