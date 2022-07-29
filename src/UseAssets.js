addEvent(window, "load", function () {
  setTimeout(function () {
    //IE5 calls load event handlers in reverse order of registration.
    //meaning the titlebar might not have been created yet, because it is dynamially created during a load event handler.
    //a settimeout is the simplest (and perhaps only) way to handle this (in IE5)
    document.getElementById("PageTitleBar").children[0].innerHTML = '<span></span><img width="24" height="24" alt="" role="presentation" src="' + Assets['icon.png'] + '">';
    try {
      document.head.innerHTML += '<link rel="shortcut icon" href="' + Assets['icon.ico'] + '">';
    } catch (e) {
      //throws in old IE/HTA and maybe some other browsers too, so just suppress the error
    }
  }, 10);
});