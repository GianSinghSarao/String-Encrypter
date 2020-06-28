//small script to make links open in the default browser instead of IE.
addEvent(window, 'load', function (a, A) {
  setTimeout(function () { 
    //this settimeout exists because IE5 calls load event handlers in reverse order of registration.
    //meaning any anchors added dynamically that are normally caught, are missed in IE5 without this.
    var AnchorElements = document.getElementsByTagName('A');
    for (var A = 0; A < AnchorElements.length; A++) {
      // onclick used here (instead of addEvent) to replace the handler that launches IE.
      AnchorElements[A].onclick = function (a, A) {
        A = new ActiveXObject("WScript.Shell");
        A.run(this.href);
        return false;
      };
    }  
  }, 10);
});