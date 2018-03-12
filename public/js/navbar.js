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

// Mobile Navbar
$(".b-user-dropdown").click(function() {
  $(".user-down").toggleClass("clicked");
  $("#drop-item-container").removeClass("clicked");
});


$(".b-mobile-hamburger").click(function() {
  $(".b-mobile-sidebar").addClass("clicked");
  $(".overlay").addClass("clicked");
  $("body").addClass("scrolldisable");
  setTimeout(function() {
    $(".mobile-categories").css("display", "block");
  }, 300);
});
$(".overlay").click(function() {
  $(".b-mobile-sidebar").addClass("hid");
  $(".mobile-categories").css("display", "none");
  setTimeout(function() {
    $("body").removeClass("scrolldisable");
    $(".b-mobile-sidebar").removeClass("hid");
    $(".b-mobile-sidebar").removeClass("clicked");
    $(".mobile-categories").css("display", "none");
  }, 300);
  $(".overlay").removeClass("clicked");
});

