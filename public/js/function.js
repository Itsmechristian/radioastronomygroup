var boxLength = $(".box").length;
$(document).ready(function() {
  if (boxLength > 6) {
    $(".home-row").css("height", "auto");
  } else {
    $(".home-row").css("height", "950px");
  }
});

// Make sidebar and Page same height

window.onload = function() {
  // Subpages Sidebar Height
  const pageHeight = $('.page').height()
  if(pageHeight > 500) {
  $('.sidebar').css('height', pageHeight);
  }
  else{
  $('.sidebar').css('height', 'auto');
  }
  // Article Container Height
  const bPost = $('.b-post').height()
  if(bPost > 700){
    $('.b-post-container').css('height', bPost);
  }
}

$('.options > small').click(function() {
  $('.items').toggleClass('clicked')
})

$(document).ready(function() {
  $('.delete-article').on('click', function() {
    const id = $(this).data('id')
    $.ajax({
      type: 'DELETE',
      url: '/user/article/delete/'+id,
      success: function(response) {
        alert('Deleting Article');
        window.location.href = '/user'
      }
    })
  })
})
