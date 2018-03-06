$(document).ready(function() {
  $(window).on("resize", function() {
    $(".b-mobile-sidebar").removeClass("clicked");
    $("#drop-item-container").removeClass("clicked");
    $(".overlay").removeClass("clicked");
  });
});

// Web/Tablet Navbar
$(".drop-left li").hover(function() {
  var liClass = $(this).attr("class");

  if (liClass.toString() === "radioastronomy") {
    var resources = `
          <li><a href="/pages/radioastronomy/getting-started">
          Getting Started</a></li>
          <li><a href="#">
          Radio Spectrum</a></li>
          <li><a href="#">
          VLF Solar</a></li>
          <li><a href="#">
          Simple Radio Astronomy</a></li>
          <li><a href="#">
          Radio Jove</a></li>
          <li><a href="#">
          Meteor Reflections</a></li>
          `;
    $(".drop-right").html(resources);
  } else if (liClass.toString() === "projects") {
    var radioastronomy = `
          <li><a href="#">Inroduction</a></li>
          <li><a href="#">Antenna Projects</a></li>
          <li><a href="#">Radio Jove</a></li>
          <li><a href="#">Meteor Projects</a></li>
          <li><a href="#">Solar Astronomy Projects</a></li>
          `;
    $(".drop-right").html(radioastronomy);
  } else if (liClass.toString() === "observations") {
    var radioastronomy = `<li><a href="#">Radio</a></li>`;
    $(".drop-right").html(radioastronomy);
  } else if (liClass.toString() === "resources") {
    var radioastronomy = `<li><a href="#">Radio</a></li>`;
    $(".drop-right").html(radioastronomy);
  } else if (liClass.toString() === "about") {
    var radioastronomy = `<li><a href="#">Radio</a></li>`;
    $(".drop-right").html(radioastronomy);
  }
});
$(".b-categories, body").hover(function() {
  $(".drop-right").html(`
      <li><a href="#">
      Getting Started</a></li>
      <li><a href="#">
      Radio Spectrum</a></li>
      <li><a href="#">
      VLF Solar</a></li>
      <li><a href="#">
      Simple Radio Astronomy</a></li>
      <li><a href="#">
      Radio Jove</a></li>
      <li><a href="#">
      Meteor Reflections</a></li>
      `);
});

// Mobile Navbar
$(".b-user-dropdown").click(function() {
  $(".user-down").toggleClass("clicked");
  $("#drop-item-container").removeClass("clicked");
});

$("#username, #password").focus(function() {
  $("#warning, #success").addClass("fade");
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
  }, 200);
  $(".overlay").removeClass("clicked");
});
$(".b-menu").click(function() {
  $("#drop-item-container").toggleClass("clicked");
  $(".user-down").removeClass("clicked");
});
