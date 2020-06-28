var Titlebar = '<div id="TitleBar"><div class="icon"></div><div class="text" unselectable="on">String Encrypter</div><div class="buttons"><button style="left: 0px;" id="MinButton" title="Minimise">0</button><button style="left: 48px;" id="MaxButton" title="Maximise">1</button><button style="left: 96px;" id="ExitButton" title="Quit">r</button></div></div>';
var AccentColor = (function () {
  try {
    var unProcessedInt = new ActiveXObject('WScript.Shell').RegRead('HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\DWM\\AccentColor');
  } catch (e) {
    return '#000000';
  }
  if (unProcessedInt < 0) { unProcessedInt = 0xFFFFFFFF + unProcessedInt + 1; }
  var HexString = unProcessedInt.toString(16);
  var Alpha = HexString.substring(0, 2);
  var Blue = HexString.substring(2, 4);
  var Green = HexString.substring(4, 6);
  var Red = HexString.substring(6, 8);
  var NormalHexColorString = '#' + Red + Green + Blue;
  return NormalHexColorString;
})();
var posX = 0;
var posY = 0;
var move = false;
var w = 0;
var h = 0;
var x = 0;
var y = 0;
var max = false;
if (!window.screenLeft) {
  window.screenLeft = window.screenX;
  window.screenTop = window.screenY;
}
function overlayColor (BackgroundColour, OverlayColour, OverlayOpacity) {
  //I feel like this could be implemented less verbosely (with loops?) but idrc *that* much.
  var BGColour = [
    parseInt('0x' + BackgroundColour.substring(1,3)), 
    parseInt('0x' + BackgroundColour.substring(3,5)), 
    parseInt('0x' + BackgroundColour.substring(5,7))
  ], OColour = [
    parseInt('0x' + OverlayColour.substring(1,3)),
    parseInt('0x' + OverlayColour.substring(3,5)),
    parseInt('0x' + OverlayColour.substring(5,7))
  ];
  var FinalColour = [
    Math.round(BGColour[0] + (OColour[0] - BGColour[0]) * OverlayOpacity),
    Math.round(BGColour[1] + (OColour[1] - BGColour[1]) * OverlayOpacity),
    Math.round(BGColour[2] + (OColour[2] - BGColour[2]) * OverlayOpacity)
  ];
  return '#' + FinalColour[0].toString(16) + FinalColour[1].toString(16) + FinalColour[2].toString(16);
}
function setPos(event) {
  if (window.event !== undefined) {
    posX = window.event.screenX;
    posY = window.event.screenY;
    move = true;
  }
}
function moving(event) {
  if (move === true) {
    var moveX = event.screenX - posX - 7;
    var moveY = event.screenY - posY - 7;
    if (max) {
      MaximiseWindow();
    };
    window.moveTo((window.screenLeft + moveX), (window.screenTop + moveY));
    setPos();
  }
}
function stopMoving() {
  move = false;
}
function MaximiseWindow() {
  if (!max) {
    x = window.screenLeft;
    y = window.screenTop;
    w = document.body.clientWidth + 14;
    h = document.body.clientHeight + 14;
    MaxButton.innerHTML = "2";
    MaxButton.title = "Restore";
    window.moveTo(-7, -7);
    window.resizeTo(screen.availWidth + 14, screen.availHeight + 14);
  } else {
    MaxButton.innerHTML = "1";
    MaxButton.title = "Maximise";
    window.moveTo(x, y);
    window.resizeTo(w, h)
  }
  max = !max;
}
function CloseWindow() {
  window.close();
}
function MinimiseWindow() {
  window.blur();
}
addEvent(window, 'load', function () {
  document.body.innerHTML = Titlebar + document.body.innerHTML;
  TitleBar.style.background = AccentColor;
  if (document.documentElement.className.indexOf('lt-ie8') > -1) {
    addEvent(MinButton, 'mousedown', function () { MinButton.className = 'click-ed'; });
    addEvent(MinButton, 'mouseover', function () { MinButton.className = 'hover-ed'; });
    addEvent(MinButton, 'mouseup', function () { MinButton.className = 'hover-ed'; });
    addEvent(MinButton, 'mouseout', function () { MinButton.className = ''; });

    addEvent(MaxButton, 'mousedown', function () { MaxButton.className = 'click-ed'; });
    addEvent(MaxButton, 'mouseover', function () { MaxButton.className = 'hover-ed'; });
    addEvent(MaxButton, 'mouseup', function () { MaxButton.className = 'hover-ed'; });
    addEvent(MaxButton, 'mouseout', function () { MaxButton.className = ''; });

    addEvent(ExitButton, 'mousedown', function () { ExitButton.className = 'click-ed'; });
    addEvent(ExitButton, 'mouseover', function () { ExitButton.className = 'hover-ed'; });
    addEvent(ExitButton, 'mouseup', function () { ExitButton.className = 'hover-ed'; });
    addEvent(ExitButton, 'mouseout', function () { ExitButton.className = ''; });
  }
  if (document.documentElement.className.indexOf('lt-ie9') > -1) {
    //'polyfill' rgba colours used on button hover by creating a supplementary stylesheet with rgb colours
    var PolyfillStyleSheet = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(PolyfillStyleSheet);
    PolyfillStyleSheet.type = 'text/css';
    PolyfillStyleSheet.styleSheet.cssText = '\
      #TitleBar .buttons button.hover-ed, \
      #TitleBar .buttons button:hover { \
        background: ' + overlayColor(AccentColor, '#ffffff', 0.1) + '; \
        color: #f0f0f0; \
      } \
      #TitleBar .buttons button.click-ed, \
      #TitleBar .buttons button:active { \
        background: ' + overlayColor(AccentColor, '#ffffff', 0.2) + '; \
        color: #fff; \
      } \
      #TitleBar .buttons button#ExitButton.click-ed, \
      #TitleBar .buttons button#ExitButton:active { \
        background: #f00; \
        color: #fff; \
      } ' ; 
      //stylesheet above needs updating to calculate rgba colour value for close button on click
  }
  addEvent(MinButton, 'click', MinimiseWindow);
  addEvent(MaxButton, 'click', MaximiseWindow);
  addEvent(ExitButton, 'click', CloseWindow);

  addEvent(TitleBar, 'mousedown', setPos);
  addEvent(TitleBar, 'mousemove', moving);
  addEvent(TitleBar, 'mouseup', stopMoving);
  addEvent(TitleBar, 'mouseout', stopMoving);
});