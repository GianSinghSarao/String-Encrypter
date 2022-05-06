;(function () {
  var TitleBarColor = (function (A) {
    A = UserlandThemingPreferences.ColorPrevalence() ? 
      UserlandThemingPreferences.AccentColor() :
      UserlandThemingPreferences.AppsUseLightTheme() ? 
        {R:255, G:255, B:255, A:255} : 
        {R:0, G:0, B:0, A:255}; 
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
    max = false;

  if (!window.screenLeft) {
    window.screenLeft = window.screenX;
    window.screenTop = window.screenY;
  }

  function customResize() {
    var buttonsWidth = 144;
    var buttonsHeight = 48;
    var widthOK = document.body.clientWidth >= buttonsWidth;
    var heightOK = document.body.clientHeight >= buttonsHeight;
    if (widthOK && heightOK) {
    } else if (widthOK) {
      window.resizeTo(document.body.clientWidth + 14, buttonsHeight + 14);
    } else if (heightOK) {
      window.resizeTo(buttonsWidth + 14, document.body.clientHeight + 14);
    } else {
      window.resizeTo(buttonsWidth + 14, buttonsHeight + 14);
    }
  }

  function overlayColor(BackgroundColor, OverlayColor, OverlayOpacity) {
    var TempColor = Color.fromHex(OverlayColor)
    TempColor.A = OverlayOpacity * 255;
    var flattenedColor = Color.flatten(Color.fromHex(BackgroundColor), TempColor);
    return Color.toHex(flattenedColor).substring(0, 7);
  }

  function setPos() {
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
      MaxButton.setAttribute("aria-label", "Restore");
      window.moveTo(-7, -7);
      window.resizeTo(screen.availWidth + 14, screen.availHeight + 14);
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
    window.blur();
  }

  if (Environment.hasDocument) {
    addEvent(window, 'load', function () {
      var Titlebar = (function () {
        var outerHTML = '';
        outerHTML += '<div role="banner" id="PageTitleBar"><div class="icon"></div><h1 class="text">String Encrypter</h1>';
        if (Environment.IsHTA()) {
          outerHTML += '<div id="CustomWindowButtons"><button id="MinButton" title="Minimise" aria-label="Minimise">0</button><button id="MaxButton" title="Maximise" aria-label="Maximise">1</button><button id="ExitButton" title="Quit" aria-label="Quit">r</button></div>';
        }
        outerHTML += '</div>';
        return outerHTML;
      })();
      document.body.innerHTML = Titlebar + document.body.innerHTML;
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
        #PageTitleBar { \n\
          background-color: ' + TitleBarColor + '; \n\
          color: ' + FontColor + '; \n\
        } \n\
        #PageTitleBar #CustomWindowButtons button, \n\
        #PageTitleBar #CustomWindowButtons button.hover-ed, \n\
        #PageTitleBar #CustomWindowButtons button:hover, \n\
        #PageTitleBar #CustomWindowButtons button.click-ed, \n\
        #PageTitleBar #CustomWindowButtons button:active { \n\
          background-color: ' + TitleBarColor + '; \n\
          color: ' + FontColor + '; \n\
        } \n\
        #PageTitleBar #CustomWindowButtons button.hover-ed, \n\
        #PageTitleBar #CustomWindowButtons button:hover { \n\
          background-color: ' + overlayColor(TitleBarColor, FontColor, 0.1) + '; \n\
        } \n\
        #PageTitleBar #CustomWindowButtons button.click-ed, \n\
        #PageTitleBar #CustomWindowButtons button:active { \n\
          background-color: ' + overlayColor(TitleBarColor, FontColor, 0.2) + '; \n\
        } \n\
        .unfocused #PageTitleBar { \n\
          background: #ffffff; \n\
          color: #000000; \n\
        } \n\
        .unfocused #PageTitleBar #CustomWindowButtons button, \n\
        .unfocused #PageTitleBar #CustomWindowButtons button.hover-ed, \n\
        .unfocused #PageTitleBar #CustomWindowButtons button:hover, \n\
        .unfocused #PageTitleBar #CustomWindowButtons button.click-ed, \n\
        .unfocused #PageTitleBar #CustomWindowButtons button:active { \n\
          background: #ffffff; \n\
          color: #000000; \n\
        } \n\
        .unfocused #PageTitleBar #CustomWindowButtons button.hover-ed, \n\
        .unfocused #PageTitleBar #CustomWindowButtons button:hover { \n\
          background-color: ' + overlayColor('#ffffff', '#000000', 0.1) + '; \n\
        } \n\
        .unfocused #PageTitleBar #CustomWindowButtons button.click-ed, \n\
        .unfocused #PageTitleBar #CustomWindowButtons button:active { \n\
          background-color: ' + overlayColor('#ffffff', '#000000', 0.2) + '; \n\
        } \n\
      ';
      ComputedStyleSheet.type = 'text/css';
      if(!!ComputedStyleSheet.styleSheet) {
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
        }
        if (Environment.hasActiveXObject) {
          addEvent(document, 'focusout', function () {
            document.body.className += " unfocused";
          });
          addEvent(document, 'focusin', function () {
            document.body.className = document.body.className.replace(/\s*unfocused/g, "");
          });  
          addEvent(window, 'resize', customResize);
        }
      }, 0);
    });
  }
})();