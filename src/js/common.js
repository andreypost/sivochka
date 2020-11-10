(function (window, document) {
  "use strict";

  const retrieveURL = function (filename) {
    let scripts = document.getElementsByTagName('script');
    if (scripts && scripts.length > 0) {
      for (let i in scripts) {
        if (scripts[i].src && scripts[i].src.match(new RegExp(filename + '\\.js$'))) {
          return scripts[i].src.replace(new RegExp('(.*)' + filename + '\\.js$'), '$1');
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
    // var files = ["/img/svg/symbol_sprite.html", "/img/svg/*"],
    var files = ["//andreypost.github.io/sivochka/img/svg/symbol_sprite.html", "/img/svg/*"],
      // var files = ["/img/symbol_sprite.html", "/wp-content/themes/ukrmeatbest/img/gradient.svg"],
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
    load("/img/svg/symbol_sprite.html", document.querySelector("body"));
  }

})(window, document);

document.addEventListener("DOMContentLoaded", () => {

  const body = document.querySelector('body')

  const burgerNav = (burger, canvas, modal) => {
    let touchLength = 0
    const toggle = () => {
      burger.classList.toggle('active')
      canvas.classList.toggle('block')
      modal.classList.toggle('active')
      body.classList.toggle('active')
    }
    burger.onclick = () => {
      toggle()
    }
    modal.ontouchstart = (e) => {
      touchLength = e.touches[0].clientX
    }
    modal.ontouchend = (e) => {
      if (touchLength > (e.changedTouches[0].clientX + 60)) {
        toggle()
      }
    }
    window.addEventListener('click', (e) => {
      if (e.target === canvas || e.target.tagName === 'A') toggle()
    })
  }
  burgerNav(document.querySelector('.header__burger'), document.querySelector('.canvas'), document.getElementById('menuModal'))

  const showModal = (modal) => {
    const hideModal = (modal) => {
      modal.style.display = 'none'
      body.style.overflowY = ''
      body.style.paddingRight = `${0}px`
    }
    let width = document.documentElement.clientWidth
    body.style.overflowY = 'hidden'
    body.style.paddingRight = `${document.documentElement.clientWidth - width}px`
    modal.style.display = 'block'
    modal.onclick = (e) => {
      if (e.target.classList.contains('close')) hideModal(modal)
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideModal(modal)
    })
    window.addEventListener('click', (e) => {
      if (e.target == modal) hideModal(modal)
    })
  }

  const modalForm = (buttons, modal) => {
    buttons.forEach((butt) => {
      butt.onclick = (e) => {
        showModal(modal)
      }
    })
  }
  modalForm(document.querySelectorAll('.callContact'), document.getElementById('contactModal'))

  $(".slider").slick({
    // normal options...
    slidesToShow: 5,
    infinite: false,
    arrows: true,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
      }
    }, {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
      }
    }, {
      breakpoint: 550,
      settings: {
        slidesToShow: 1,
      }
    }]
  });
});



/*

document.addEventListener("DOMContentLoaded", function () {

  const STICKY_HEIGHT = 43;
  const body = document.querySelector("body");
  (/iP(hone|od|ad)/.test(navigator.platform)) && document.querySelector('html').classList.add('ios');
  let preHeaderHeight = document.querySelector('.pre-header').clientHeight;
  window.addEventListener("resize", function () {
    preHeaderHeight = document.querySelector('.pre-header').clientHeight;
  });
  body.classList.add('siteloaded');
  set url to href
  const supWebp = Boolean(document.querySelector('html.webp'));
  const galleryLinks = document.querySelectorAll('.gallery__wrapper a');
  galleryLinks.forEach(link => {
    link.href = supWebp ? link.querySelector('picture source[type="image/webp"]').getAttribute('data-srcset') : link.querySelector('picture source[type="image/jpg"]').getAttribute('data-srcset');
  })

  function parallax() {
    const parallaxBg = document.querySelector(".parallax");
    const parallaxBgTop = parallaxBg.getBoundingClientRect().top;
    const parallaxBgBottom = parallaxBg.getBoundingClientRect().bottom;
    if(parallaxBgBottom > 0) {
      const yPos = (-parallaxBgTop + 71) / parallaxBg.dataset.speed;
      const coords = '0% ' + yPos + 'px';
      parallaxBg.style.backgroundPosition = coords;
    } else if(parallaxBgTop > 0 && parallaxBg.style.backgroundPosition !== '0% 0px') {
      parallaxBg.style.backgroundPosition = '0% 0px'
    }
  }


  function onScroll(){
    var sections = document.querySelectorAll('a[data-element="anchor"]:not(.btn)');
    var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach(section => {
      var currLink = section;
      var val = currLink.getAttribute('href');
      var refElement = document.querySelector(val);
        if (refElement.offsetTop - STICKY_HEIGHT <= scrollPos && ( refElement.offsetTop + refElement.offsetHeight - STICKY_HEIGHT > scrollPos)){
          currLink.classList.add('active');
        } else {
           currLink.classList.remove('active');
        }
    });
  };

  function scrollIt(destination, duration = 200, easing, callback) {
    const easings = {
      easeInQuad(t) {
        return t * t;
      },
    };
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }

    function scroll() {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

      if (window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }

      requestAnimationFrame(scroll);
    }
    scroll();
  }

  const linksToScroll = document.querySelectorAll('a[data-element="anchor"]');
  linksToScroll.forEach(linkToScroll => {
    const sectionToScroll = document.querySelector(linkToScroll.getAttribute('href'));
      linkToScroll.addEventListener('click', () => {
        event.preventDefault();
        scrollIt(
          sectionToScroll.offsetTop - STICKY_HEIGHT,
          300,
          'easeInQuad',
        );
      });
  })


  const h = document.querySelector("header");
  let stuck = false;
  let stuckSmall = false;
  const headerHeight = h.clientHeight;

  function stickyHeader() {
    const offset = window.pageYOffset;
    const distance = preHeaderHeight - offset;
    const distanceWithHeader = headerHeight + preHeaderHeight - offset;
    if (distance <= 0 && !stuck) {
      h.classList.add("sticky");
      h.style.top = "0px";
      stuck = true;
    } else if (stuck && offset <= preHeaderHeight) {
      h.classList.remove("sticky");
      stuck = false;
    }

    if (distanceWithHeader <= 0  && !stuckSmall ) {
      h.classList.add("sticky-small");
      stuckSmall = true;
    } else if (stuckSmall && offset <= headerHeight + preHeaderHeight) {
      h.classList.remove("sticky-small");
      stuckSmall = false;
    }
  }

  window.addEventListener("scroll", function () {
    onScroll();
    parallax();
    stickyHeader();
  });

  lightGallery(document.querySelector(".documents .gallery__wrapper"), {
    thumbnail: true
  });

  lightGallery(document.querySelector(".gallery .gallery__wrapper"), {
    thumbnail: true,
    zoom: false,
    download: false
  });

  // mobile menu
  const toggle = document.querySelector(".mobile-menu__toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  const mobileMenuOverlay = document.querySelector(".mobile-overlay");
  const mobileMenuItem = document.querySelectorAll(".mobile-menu__item");

  const handleToggleMobileMenu = () => {
    body.classList.toggle("mobile-menu__open");
    toggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  };

  toggle.addEventListener("click", handleToggleMobileMenu);
  mobileMenuOverlay.addEventListener("click", handleToggleMobileMenu);

  mobileMenuItem.forEach(item => {
    item.addEventListener("click", handleToggleMobileMenu);
  });

  //send form
  document.addEventListener('submit', e => {
    const form = e.target;
    const statusFailure = form.querySelector('.status-failure');

    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
      })
      .then(() => {
        const result = document.createElement('div');
        result.classList.add('status-success');
        //TODO добавить константу с ответами для 2 языков.
        result.innerHTML = 'Дякуємо за ваш запит.';

        statusFailure.hidden = true;
        Array.from(form.elements).forEach(field => field.disabled = true);

        form.parentNode.append(result);
      })
      .catch(err => {
        Array.from(form.elements).forEach(field => field.disabled = false);
        statusFailure.hidden = false;
      });
    e.preventDefault();
  });
  onScroll();
  parallax();
  stickyHeader();
});
*/