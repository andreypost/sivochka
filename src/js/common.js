(function (window, document) {
    "use strict";
  
    const retrieveURL = function(filename) {
      let scripts = document.getElementsByTagName('script');
      if (scripts && scripts.length > 0) {
          for (let i in scripts) {
              if (scripts[i].src && scripts[i].src.match(new RegExp(filename+'\\.js$'))) {
                  return scripts[i].src.replace(new RegExp('(.*)'+filename+'\\.js$'), '$1');
              }
          }
      }
    };
  
  
    function load(url, element) {
      let req = new XMLHttpRequest();
  
      req.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
          element.insertAdjacentHTML('afterbegin', req.responseText);
        }
      };
  
      req.open("GET", url, true);
      req.send(null);
    }
  
    if (
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1" &&
      location.host !== ""
    ) {
      var files = ["/wp-content/themes/ukrmeatbest/img/symbol_sprite.html", "/wp-content/themes/ukrmeatbest/img/gradient.svg"],
        revision = 9;
  
      if (
        !document.createElementNS ||
        !document.createElementNS("http://www.w3.org/2000/svg", "svg")
          .createSVGRect
      )
        return true;
  
      var isLocalStorage =
        "localStorage" in window && window["localStorage"] !== null,
        request,
        data,
        insertIT = function () {
          document.body.insertAdjacentHTML("afterbegin", data);
        },
        insert = function () {
          if (document.body) insertIT();
          else document.addEventListener("DOMContentLoaded", insertIT);
        };
        files.forEach(file => {
        try {
          let request = new XMLHttpRequest();
          request.open("GET", file, true);
          request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
              data = request.responseText;
              insert();
              if (isLocalStorage) {
                localStorage.setItem("inlineSVGdata", data);
                localStorage.setItem("inlineSVGrev", revision);
              }
            }
          };
          request.send();
        } catch (e) { }
      })
    } else {
      load("/img/symbol_sprite.html", document.querySelector("body"));
      load("/img/gradient.svg", document.querySelector("body"));
    }
  })(window, document);