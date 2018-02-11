$('#search-bar').focus(function() {
    $('#search-bar').addClass('focus')
})
$('#search-bar').focusout(function() {
    $('#search-bar').removeClass('focus')
})
$(document).ready(function() {
    $('.b-categories').on('click', function() {
        $('.b-dropnav').toggleClass('reveal')
    })
})
$('#username, #password ').focus(function() {
    $('#warning').addClass('fade')
})