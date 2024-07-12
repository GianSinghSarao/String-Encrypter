; (function () {
  var TitleBarColor = (function (A) {
    A = UserlandThemingPreferences.AccentColor();
    A = Color.toHex(A).substring(0, 7);
    return A;
  })();

  var FontColor = Color.toHex(
    Color.getContrastingOf(Color.fromHex(TitleBarColor))
  ).substring(0, 7);

  var posX = 0, posY = 0,
    move = false,
    w = 0, h = 0,
    x = 0, y = 0,
    max = false,
    MIN_WIDTH = 144,
    MIN_HEIGHT = 48;

  if (!window.screenLeft) {
    window.screenLeft = window.screenX;
    window.screenTop = window.screenY;
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  function customResize() {
    var widthOK = document.body.clientWidth >= MIN_WIDTH;
    var heightOK = document.body.clientHeight >= MIN_HEIGHT;
    if (widthOK && heightOK) {
    } else if (widthOK) {
      window.resizeTo(document.body.clientWidth + 14, MIN_HEIGHT + 14);
    } else if (heightOK) {
      window.resizeTo(MIN_WIDTH + 14, document.body.clientHeight + 14);
    } else {
      window.resizeTo(MIN_WIDTH + 14, MIN_HEIGHT + 14);
    }
  }

  function overlayColor(BackgroundColor, OverlayColor, OverlayOpacity) {
    var TempColor = Color.fromHex(OverlayColor)
    TempColor.A = OverlayOpacity * 255;
    var flattenedColor = Color.flatten(Color.fromHex(BackgroundColor), TempColor);
    return Color.toHex(flattenedColor).substring(0, 7);
  }

  function setPos(event) {
    if (event !== undefined) {
      posX = event.screenX;
      posY = event.screenY;
      move = true;
    }
  }

  function moving(event) {
    if (move === true) {
      var moveX = event.screenX - posX - 7;
      var moveY = event.screenY - posY - 7;
      try {
        if (max) {
          MaximiseWindow();
        };
        window.moveTo((window.screenLeft + moveX), (window.screenTop + moveY));
      } catch (e) {
        // window.moveTo seems to error out in real IE6 during mousemove events
        // compatibility mode works fine i.e. IE9 and meta x-ua-compatible=IE6
      }
      setPos(event);
    }
  }

  function stopMoving() {
    move = false;
  }

  function MaximiseWindow() {
    if (!max) {
      x = window.screenLeft;
      y = window.screenTop;
      w = document.body.clientWidth + 14; // Windows 10
      h = document.body.clientHeight + 14; // Windows 10
      w = document.body.clientWidth + 6; // Windows XP
      h = document.body.clientHeight + 6; // Windows XP
      MaxButton.innerHTML = "2";
      MaxButton.title = "Restore";
      MaxButton.setAttribute("aria-label", "Restore");
      window.moveTo(-7, -7); // Windows 10
      window.moveTo(-3, -3); // Windows XP
      window.resizeTo(screen.availWidth + 14, screen.availHeight + 14); // Windows 10
      window.resizeTo(screen.availWidth + 6, screen.availHeight + 6); // Windows XP 
    } else {
      MaxButton.innerHTML = "1";
      MaxButton.title = "Maximise";
      MaxButton.setAttribute("aria-label", "Maximise");
      window.moveTo(x, y);
      window.resizeTo(w, h)
    }
    max = !max;
  }

  function CloseWindow() {
    window.close();
  }

  function MinimiseWindow() {
    try {
      document.getElementById("HHCtrlMinimizeWindowObject").Click();
    } catch (e) {
      window.blur();
    }
  }

  addEvent(window, 'load', function () {
    var Titlebar = (function () {
      var outerHTML = '';
      outerHTML += '<div role="banner" id="PageTitleBar" aria-label="String Encrypter"><div class="icon"></div><h1 aria-hidden="true" role="presentation" class="text">String Encrypter</h1>';
      if (Environment.IsHTA()) {
        outerHTML += '<div id="CustomWindowButtons"><button id="MinButton" title="Minimise" aria-label="Minimise">0</button><button id="MaxButton" title="Maximise" aria-label="Maximise">1</button><button id="ExitButton" title="Quit" aria-label="Quit">r</button></div><object id="HHCtrlMinimizeWindowObject" classid="clsid:adb880a6-d8ff-11cf-9377-00aa003b7a11"><param name="command" value="minimize" /></object>';
      }
      outerHTML += '</div>';
      return outerHTML;
    })();
    document.body.innerHTML = Titlebar + document.body.innerHTML;
    //IE9 and IE10 are very glitchy about the hta tag when using innerHTML, like above
    //attempting to access the commandline property will sometimes result in it being undefined
    //this is because the dom is completely replaced/rebuilt when using innerhtml, 
    //which causes the js object to become detached from the dom node, 
    //and a timeout is the easiest solution to it
    setTimeout(function () {
      if (Environment.IsHTA()) {
        document.documentElement.className += " HTA";
      }
    }, 0);
    if (Environment.IsHTA() && Environment.IsOldIE) {
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
    var ComputedStyleSheet = document.createElement('style');
    var styles = '\n\
        /* This StyleSheet contains values which need to be determined at runtime depending on theming or are being "polyfilled" in because IEs css support is shoddy */ \n\
        body.use-system-colors #PageTitleBar { \n\
          background-color: ' + TitleBarColor + '; \n\
          color: ' + FontColor + '; \n\
        } \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button, \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button.hover-ed, \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button:hover, \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button.click-ed, \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button:active { \n\
          background-color: ' + TitleBarColor + '; \n\
          color: ' + FontColor + '; \n\
        } \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button.hover-ed, \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button:hover { \n\
          background-color: ' + overlayColor(TitleBarColor, FontColor, 0.1) + '; \n\
        } \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button.click-ed, \n\
        body.use-system-colors #PageTitleBar #CustomWindowButtons button:active { \n\
          background-color: ' + overlayColor(TitleBarColor, FontColor, 0.2) + '; \n\
        } \n\
      ';
    ComputedStyleSheet.type = 'text/css';
    if (!!ComputedStyleSheet.styleSheet) {
      ComputedStyleSheet.styleSheet.cssText = styles;
    } else {
      ComputedStyleSheet.innerHTML = styles;
    }
    document.getElementsByTagName('head')[0].appendChild(ComputedStyleSheet);
    setTimeout(function () {
      // without this timeout the events below don't attach properly in ie9+
      // for some reason, it fails silently. i thought maybe the events polyfill
      // was causing the issue, but after messing with it for a bit to no avail
      // this was the simplest solution that actually worked
      if (Environment.IsHTA()) {
        addEvent(MinButton, 'click', MinimiseWindow);
        addEvent(MaxButton, 'click', MaximiseWindow);
        addEvent(ExitButton, 'click', CloseWindow);
        addEvent(PageTitleBar, 'mousedown', setPos);
        addEvent(PageTitleBar, 'mousemove', moving);
        addEvent(PageTitleBar, 'mouseup', stopMoving);
        addEvent(PageTitleBar, 'mouseout', stopMoving);
        addEvent(PageTitleBar, 'dblclick', MaximiseWindow);
      }
      if (Environment.hasActiveXObject) {
        addEvent(document, 'focusout', function () {
          document.body.className += " unfocused";
        });
        addEvent(document, 'focusin', function () {
          document.body.className = document.body.className.replace(/\s*unfocused/g, "");
        });
        addEvent(window, 'resize', debounce(customResize, 200));
      }
    }, 0);
  });

})();