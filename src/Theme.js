var UserlandThemingPreferences = {};
UserlandThemingPreferences.AppsUseLightTheme = function () {
  var integerValue;
  try {
    integerValue = Environment.IsOldIE ? 
      new ActiveXObject('WScript.Shell').RegRead('HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize\\AppsUseLightTheme') : 
      window.matchMedia('(prefers-color-scheme: light)').matches;
  } catch (e) {
    integerValue = 1;
  } finally {
    return Boolean(integerValue);
  }
};
UserlandThemingPreferences.ColorPrevalence = function () {
  var integerValue;
  try {
    integerValue = new ActiveXObject('WScript.Shell').RegRead('HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\DWM\\ColorPrevalence');
  } catch (e) {
    integerValue = 0;
  } finally {
    return Boolean(integerValue);
  }
};
UserlandThemingPreferences.AccentColor = function () {
  var integerValue;
  try {
    integerValue = new ActiveXObject('WScript.Shell').RegRead('HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\DWM\\AccentColor');
  } catch (e) {
    integerValue = 4278190080;
  } finally {
    if (integerValue < 0) { integerValue = 0xFFFFFFFF + integerValue + 1; }
    return Color.fromABGRHexInt(integerValue);
  }
};
if (Environment.hasDocument) {
  addEvent(window, 'load', function () {
    if (UserlandThemingPreferences.AppsUseLightTheme()) {
      document.body.className += " light";  
    } else {
      document.body.className += " dark";
    }
  });
}
function ToggleTheme () {
  if (document.body.className.indexOf(" light") != -1) {
    document.body.className = document.body.className.replace("light", "dark");
  } else if (document.body.className.indexOf(" dark") != -1) {
    document.body.className = document.body.className.replace("dark", "light");
  }
}