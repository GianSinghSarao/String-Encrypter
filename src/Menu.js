addEvent(window, "load", function (e) {
  document.body.innerHTML += '<div id="CustomContextMenu"><button onclick="ToggleTheme()"><span class="label">Toggle Theme</span></button><button onclick="setTimeout(window.print, 0)"><span class="label">Print</span></button></div>';
  var menu;
  var addedHoverPolyfillEvents = false;

  var setButtonClassName = function (className) {
    return function (event) {
      var targeted = event.target || event.srcElement;
      var targetedName = targeted.nodeName || targeted.tagName;
      if (targetedName == "BUTTON") targeted.className = className; 
      targeted = targeted.parentNode;
      targetedName = targeted.nodeName || targeted.tagName;
      if (targetedName == "BUTTON") targeted.className = className;
    } 
  };

  addEvent(document.body, "contextmenu", function (event) {
    menu = document.getElementById("CustomContextMenu");

    if (Environment.IsOldIE && !addedHoverPolyfillEvents) {
      addEvent(menu, 'mouseover', setButtonClassName("hover-ed"));
      addEvent(menu, 'mouseout', setButtonClassName(""));

      addedHoverPolyfillEvents = true;
    }

    var targeted = event.target || event.srcElement;
    var targetedName = targeted.nodeName || targeted.tagName;
    var NoCustomMenu = targetedName == "TEXTAREA" || 
      (targetedName == "INPUT" &&
       targeted.getAttribute("type").toUpperCase() == "PASSWORD");

    if (NoCustomMenu) {
      menu.className = "";
      return true;
    }

    menu.className = "active";

    var RightEdge = document.body.clientWidth - event.clientX;
    var BottomEdge = document.body.clientHeight - event.clientY;

    var LeftOffset = RightEdge < menu.offsetWidth ? 
      (document.body.scrollLeft + event.clientX - menu.offsetWidth) :
      (document.body.scrollLeft + event.clientX);
    LeftOffset = LeftOffset > 0 ? LeftOffset : 0;

    var TopOffset = BottomEdge < menu.offsetHeight ? 
      (document.body.scrollTop + event.clientY - menu.offsetHeight) :
      (document.body.scrollTop + event.clientY);
    TopOffset = TopOffset > 0 ? TopOffset : 0;

    menu.style.left = LeftOffset + "px"; 
    menu.style.top = TopOffset + "px";

    try {
      event.preventDefault();
    } catch (e) {
      //bury this error which only seems to occur on IE, and other outdated/bad browsers
    }
    return false;
  });

  addEvent(document.body, "click", function (event) {
    menu = document.getElementById("CustomContextMenu");
    menu.className = "";
  });
});