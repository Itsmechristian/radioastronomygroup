$(document).ready(function() {
  $(window).on("resize", function() {
    $(".b-mobile-sidebar").removeClass("clicked");
    $("#drop-item-container").removeClass("clicked");
    $(".overlay").removeClass("clicked");
  });
});

// Web/Tablet Navbar
$(".b-menu").click(function() {
  $("#drop-item-container").toggleClass("clicked");
  $(".user-down").removeClass("clicked");
});

$(".drop ul li").hover(function() {
  $(this).children('#sub-links').css('display','block')
}, function() {
  $(this).children('#sub-links').css('display','none')
})

$(".b-user-dropdown").click(function() {
  $(".user-down").toggleClass("clicked");
  $("#drop-item-container").removeClass("clicked");
});

(function() {
  var $sidebar = $('.b-mobile-sidebar')
  var $links = $('.mobile-categories') 
  var $overlay = $('.overlay')

  $('.b-mobile-hamburger').click(function() {
    $sidebar.removeClass('close').addClass('open')
    setTimeout(function() {
      $links.css('display', 'block')
    }, 200)
    $overlay.css('display', 'block').click(function() {
      $sidebar.removeClass('open').addClass('close')
      $overlay.css('display', 'none')
      })
    })

  var $heading = $('#heading')
  var $arrow = $('#arrow')
  var $items = $('.items')  
  $($heading).click(function() {
    $arrow.toggleClass('clicked')
    $items.toggleClass('clicked')
  })
})()