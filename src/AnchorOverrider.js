//small script to make links open in the default browser instead of IE.
addEvent(window, 'load', function () {
  if (Environment.hasActiveXObject) {
    setTimeout(function () { 
      //this settimeout exists because IE5 calls load event handlers in reverse order of registration.
      //meaning any anchors added dynamically that are normally caught, are missed in IE5 without this.
      var AnchorElements = document.getElementsByTagName('A');
      for (var A = 0; A < AnchorElements.length; A++) {
        // onclick used here (instead of addEvent) to replace the handler that launches IE.
        AnchorElements[A].onclick = function () {
          var b = new ActiveXObject("WScript.Shell");
          b.run(this.href);
          return false;
        };
      }  
    }, 10); 
  }  
});