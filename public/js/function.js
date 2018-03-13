// var boxLength = $(".box").length;
// $(document).ready(function() {
//   if (boxLength > 6) {
//     $(".home-row").css("height", "auto");
//   } else {
//     $(".home-row").css("height", "950px");
//   }
// });



// Make sidebar and Page same height

window.onload = function() {
  const pageHeight = $('.page').height()
  if(pageHeight > 500) {
  $('.sidebar').css('height', pageHeight);
  }
  else{
  $('.sidebar').css('height', 'auto');
  }
}

