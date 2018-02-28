$(document).ready(function() {
  $('.post-drop-show').on('click', function() {
    $('.drop-hide').toggleClass('showHide')
    $('.fa-angle-down').toggleClass('rotate')
  })
})
$('#file').on('change', (function() {
  $('#form').submit()
}))