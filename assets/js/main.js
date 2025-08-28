(function (window, $) {
  'use strict';

  // Helperis
  $.exists = function (selector) { return $(selector).length > 0; };

  // Back/forward cache fix
  window.onpageshow = function (event) {
    if (event.persisted) {
      PageTransition();
      $('.hamburger').removeClass('is-active');
      $('.ms-nav').removeClass('is-visible');
      $('.ms-header').not('.navbar-white').each(function () {
        $('.logo-light').removeClass('active');
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    PageTransition();
    Menu();
    ms_home_slider();
    Sort();        // jei yra .filtr-container
    InitGallery(); // jei yra #gallery
    ValidForm();
  });

  /* Page Transition */
  function PageTransition() {
    if ($.exists('.ms-preloader')) {
      anime({
        targets: '.ms-preloader',
        opacity: [1, 0],
        duration: 800,
        easing: 'easeInOutCubic',
        complete: function () {
          $('.ms-preloader').css('visibility', 'hidden');
        }
      });
    }
    $('.ms-main-container').addClass('loaded');

    anime({
      targets: '.loaded',
      opacity: [0, 1],
      easing: 'easeInOutCubic',
      duration: 800,
      delay: 200,
      complete: function () {
        $('.ug-thumb-image, .ms-section__block img').css('opacity', '1');
        $('.ug-thumb-wrapper, .post-item').css('pointer-events', 'auto');
      }
    });

    $(document).on('click', '[data-type="page-transition"]', function (e) {
      const url = $(this).attr('href');
      if (url && url !== '#') {
        e.preventDefault();
        $('.ms-preloader').css('visibility', 'visible');
        anime({
          targets: '.ms-preloader',
          opacity: [0, 1],
          duration: 300,
          easing: 'easeInOutQuad',
          complete: function () {
            window.location.href = url;
          }
        });
      }
    });
  }

  /* Menu */
  function Menu() {
    if ($.exists('.hamburger')) {
      $('.hamburger').on('click', function () {
        $(this).toggleClass('is-active');
        $('.ms-nav').toggleClass('is-visible');
        $('.ms-header').not('.navbar-white').each(function () {
          $('.logo-light').toggleClass('active');
        });
      });

      $('.height-full-viewport').on('wheel', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    }
  }

  /* Swiper slider */
  function ms_home_slider() {
    if ($.exists('.swiper-container')) {
      const swiper = new Swiper('.swiper-container', {
        loop: false,
        speed: 1000,
        grabCursor: false,
        mousewheel: true,
        keyboard: { enabled: true },
        simulateTouch: false,
        parallax: true,
        effect: 'slide',
        pagination: { el: '.swiper-pagination', type: 'progressbar' },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
      });

      if ($.exists('.expanded-timeline__counter')) {
        $('.expanded-timeline__counter span:first-child').text('1');
        $('.expanded-timeline__counter span:last-child').text(swiper.slides.length);
        swiper.on('slideChange', function () {
          $('.expanded-timeline__counter span:first-child').text(swiper.activeIndex + 1);
        });
      }
    }
  }

  /* Filterizr v2 */
  function Sort() {
    if ($.exists('.filtr-container') && window.Filterizr) {
      const filterizr = new Filterizr('.filtr-container', { animationDuration: 0.3 });
      $('.filtr-btn li').on('click', function () {
        $('.filtr-btn li').removeClass('active');
        $(this).addClass('active');
        const value = $(this).data('filter');
        if (value === 'all') filterizr.filter('all');
        else filterizr.filter(value);
      });
    }
  }

  /* lightGallery */
  function InitGallery() {
    if ($.exists('#gallery') && window.lightGallery) {
      const el = document.getElementById('gallery');
      window.lightGallery(el, {
        selector: 'a', // #gallery viduje: <a href="big.jpg"><img src="thumb.jpg"></a>
        thumbnail: true,
        zoom: true,
        download: false
      });
    }
  }

  /* Form validation */
  function ValidForm() {
    if ($.exists('#validForm') && $.isFunction($.fn.validate)) {
      $('.form-control').on('focus', function () {
        $(this).prev('.control-label').addClass('active');
      });
      $('.form-control').on('focusout', function () {
        $(this).prev('.control-label').removeClass('active');
      });

      $("#validForm").validate({
        ignore: ":hidden",
        rules: {
          name: { required: true, minlength: 2, maxlength: 16 },
          email: { required: true, email: true },
          subject: { required: true, minlength: 4, maxlength: 32 },
          message: { required: true, minlength: 16 }
        },
        messages: {
          name: {
            required: "<span>Please enter your name</span>",
            minlength: "<span>Your name must consist of at least 2 characters</span>",
            maxlength: "<span>The maximum number of characters - 16</span>"
          },
          email: {
            required: "<span>Please enter your email</span>",
            email: "<span>Please enter a valid email address.</span>"
          },
          subject: {
            required: "<span>Please enter your subject</span>",
            minlength: "<span>Your subject must consist of at least 4 characters</span>",
            maxlength: "<span>The maximum number of characters - 32</span>"
          },
          message: {
            required: "<span>Please write your message</span>",
            minlength: "<span>Your message must consist of at least 16 characters</span>"
          }
        },
        submitHandler: function (form) {
          $.ajax({
            type: "POST",
            url: "contact.php",
            data: $(form).serialize(),
            success: function (data) {
              if (data === "Email sent!") {
                $('input, textarea').val('');
                $('.form-group').blur();
              }
            }
          });
          return false;
        }
      });
    }
  }

})(window, jQuery);
