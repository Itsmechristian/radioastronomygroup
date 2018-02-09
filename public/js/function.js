// $(document).ready(function() {
//     $('.b-categories').click(function() {
//         alert('1')
//     })
// })
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
