addEvent(window, "load", function (event) {
  var main = document.getElementById("PageContent");
  main.innerHTML += '\
      <div><span id="ZeroSize" aria-hidden="true" role="presentation">0</span></div>\
      <form id="form">\
        <div class="text">\
          <label id="StringInputLabel" for="StringInput">\
            Text To Encrypt Or Decrypt:\
          </label>\
          <textarea id="StringInput" cols="80" rows="3" required></textarea>\
        </div>\
        <div>\
          <label id="PasswordInputLabel" for="PasswordInput">\
            Password:\
          </label>\
          <input type="password" id="PasswordInput" required/>\
        </div>\
        <div id="Buttons">\
          <input type="submit" id="EncryptButton" class="button" name="Action" value="Encrypt"/>\
          <input type="submit" id="DecryptButton" class="button" name="Action" value="Decrypt"/>\
        </div>\
        <input type="hidden" id="temp">\
      </form>\
    ';

  setTimeout(addCSSHacks, 1);
  setTimeout(resizeWindow, 2);
  setTimeout(addFormHandler, 3);
});

addEvent(window, 'beforeprint', function () {
  var width = form.style.width;
  var height = StringInput.style.height;
  addEvent(window, 'afterprint', function PrintCleanup() {
    form.style.width = width;
    StringInput.style.height = height;
    removeEvent(window, 'afterprint', PrintCleanup);
  });
  form.style.width = '';
  StringInput.style.height = (StringInput.scrollHeight + 10) + 'px';
});

function HoverOn(event) {
  var button = event.target || event.srcElement;
  button.className += " hover-ed";
}

function HoverOff(event) {
  var button = event.target || event.srcElement;
  button.className = button.className.replace(/\s*hover\-ed/g, "");
}

function resizeWindow() {
  if (Environment.IsHTA()) {
    var width = (80 * window.chSize) + (4 * window.emSize),
      height = PageTitleBar.offsetHeight +
        form.offsetHeight +
        PageStatusBar.offsetHeight;

    window.resizeTo(width, height);

    var windowHeight = window.innerHeight ?
      window.innerHeight :
      document.documentElement.offsetHeight;

    if (height != windowHeight) {
      var offset = (height - windowHeight);
      height = height + offset;
      window.resizeTo(width, height);
    }
  }
}

function addCSSHacks() {
  var chSize = ZeroSize.offsetWidth;
  var emSize = ZeroSize.offsetHeight;
  window.chSize = chSize;
  window.emSize = emSize;
  ZeroSize.className = "hidden";
  function ResponsiveCSSViaJS() {
    var formSize = (80 * chSize) + (4 * emSize);
    var minFormSize = (14 * chSize) + (4 * emSize);
    if (Environment.hasActiveXObject) {
      form.style.width = document.body.clientWidth >= (formSize + (2 * emSize)) 
        ? ( formSize + "px" )
        : "100%";
    }
    if (document.body.clientWidth >= minFormSize + (2 * emSize)) {
      if (document.body.clientWidth >= formSize + (2 * emSize)) {
        form.className = "normal wide";
      } else {
        form.className = "normal";
      }
    } else {
      form.className = "";
    }
  }
  ResponsiveCSSViaJS();
  addEvent(window, 'resize', ResponsiveCSSViaJS);
  if (document.getElementsByTagName('html')[0].className.indexOf('lt-ie7') != -1) {
    var DecryptButton = document.getElementById("DecryptButton");
    var EncryptButton = document.getElementById("EncryptButton");
    var StringInput = document.getElementById("StringInput");
    addEvent(DecryptButton, "mouseover", HoverOn);
    addEvent(DecryptButton, "mouseout", HoverOff);
    addEvent(EncryptButton, "mouseover", HoverOn);
    addEvent(EncryptButton, "mouseout", HoverOff);
    StringInput.setAttribute('rows', "5");
  }
}

function addFormHandler() {
  addEvent(form, "submit", function (event) {
    try {
      event.preventDefault();
      event.stopPropogation();
    } catch (e) {
      event.returnValue = false;
      event.cancelBubble = true;
    }

    PasswordInput = document.getElementById("PasswordInput");
    StringInput = document.getElementById("StringInput");
    var Submitter = event.submitter || document.activeElement;
    var Action = Submitter['value'];

    var ErrorMessages = [
      "Please enter the plaintext you want to encrypt!",
      "Please enter a password!",
      "Please enter the ciphertext you want to decrypt!",
      "Cannot decrypt malformed ciphertext!",
      "Please enter the password!",
      "Please use either the encrypt or decrypt button!"
    ];

    var ErrorCases = [
      Action == "Encrypt" && StringInput.value == "",
      Action == "Encrypt" && PasswordInput.value == "",
      Action == "Decrypt" && StringInput.value == "",
      Action == "Decrypt" && (
        StringInput.value.length % 2 ||
        StringInput.value.toUpperCase() != StringInput.value
      ),
      Action == "Decrypt" && PasswordInput.value == "",
      Action != "Decrypt" && Action != "Encrypt"
    ];

    for (var i = 0; i < ErrorCases.length; i++) {
      if (ErrorCases[i]) {
        alert(ErrorMessages[i]);
        return;
      }
    }

    if (Action == "Encrypt") {
      KEYS(Encrypt);
    } else if (Action == "Decrypt") {
      KEYS(Decrypt);
    }
  });
}

function KEYS(METHOD) {
  var text = PasswordInput.value;
  var code = 0;
  while (text !== "") {
    code += text.charCodeAt(0);
    text = text.slice(1);
  }
  code = code % 255;
  temp = document.getElementById("temp");
  temp.value = code;
  METHOD();
}

function Encrypt() {
  var Alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var text = StringInput.value;
  var code = "";
  var key = Number(temp.value);
  while (text !== "") {
    var cnum = text.charCodeAt(0);
    cnum = (cnum + key) % 255;
    num = cnum % 26;
    var count = 0;
    var tst = num;
    while (tst !== cnum) {
      tst += 26;
      count += 1
    }
    code = code + Alpha[num] + count;
    text = text.slice(1);
  }
  StringInput.value = code;
}

function Decrypt() {
  var Alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var text = StringInput.value;
  var code = "";
  var key = Number(temp.value);
  while (text !== "") {
    var lttr = text.slice(0, 2);
    var num = lttr.charCodeAt(0) - 65
    var chk = lttr.slice(1, 2);
    var count = 0;
    while (count !== Number(chk)) {
      num += 26;
      count += 1;
    }
    num -= key;
    while (num <= 0) {
      num += 255;
    }
    code = code + String.fromCharCode(num);
    text = text.slice(2);
  }
  StringInput.value = code;
}