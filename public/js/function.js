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
    $('.b-post-container').css('height', bPost + 100);
  }

  // Make image responsive
  $images = $('.b-post img');
  $images.each(function() {
    if($(this).width() > 1440) {
      $(this).css('width', '100%')
    }
  })
} 

$('.options > small').click(function() {
  $('.items').toggleClass('clicked')
})

$(document).ready(function() {
  $('#delete-article').on('click', function() {
    const id = $(this).data('id')
    if(confirm('Do you want to delete this article?')) {
      $.ajax({
        type: 'DELETE',
        url: '/user/article/delete/'+id,
        success: function(response) {
          switch(window.location.pathname)  {
            case '/user/article/'+id:
              window.location.href = '/user'
              break;
            case '/admin/requests':
              window.location.href = '/admin/requests'
              break;
            case '/admin/requests/article/'+id:
              window.location.href = '/admin/requests'
              break;
            default:
              break;     
          }
        }
      })
    }
  })
    $('.event').each(function() {
      const isodate = $(this).data('iso')
      if(new Date(isodate).toISOString() > new Date().toISOString())
      {
      $(this).find('#delete-event').text('Cancel Event').css('color', '#e33545').on('click', function() {
        const id = $(this).data('id')
        if(confirm('Are you sure you want to cancel this event?')) {
          $.ajax({
            type: 'DELETE',
            url: '/user/delete/event/'+id,
            success: function(response) {
              window.location.href = '/user/create/events'
            }
          })
        }
      })
      }
      else{
      $(this).find('#delete-event').text('Event Finished').css('color', 'limegreen').on('click', function() {
        const id = $(this).data('id')
        if(confirm('Is event finish?'))  {
          $.ajax({
            type: 'DELETE',
            url: '/user/finish/event/'+id,
            success: function(response) {
              window.location.href = '/user/create/events'
            }
          })
        }
      })
      }
    })
})

$('#description').on('keydown paste keyup delete', function() {
  const $textareaLength = $(this).val().length
  $(this).attr('maxlength', '50')
  $('#number').text($textareaLength)
})

setInterval(function() {
  $('#warning').fadeOut('slow')
  $('#success').fadeOut('slow')
}, 5000)