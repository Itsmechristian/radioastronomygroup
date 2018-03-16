if(document.location.pathname === "/home/login") {
  $username = $('#username');
  $usernamelabel = $('#usernamelabel');
  $password = $('#password');
  $passwordlabel = $('#passwordlabel');
  var success = "#2a5bb8";
  var danger = "#e33545";

  function formValidationAnimation(element) {
    $getId = $(this).attr('id')

    element.on('focus', focusInput)

    function focusInput() {
      element.css("border", `1px solid ${success}`)
      element.on('keyup', function() {
        if(!element.val()){
          $(`#${$(this).attr('id')}label`).removeClass('show').addClass('none')
        }
        else{
          $(`#${$(this).attr('id')}label`).removeClass('none').addClass('show')
        }
      })
    }
  
    element.on('blur', blurInput)
  
    function blurInput() {
      if(!element.val()) {
        element.css('border', `1px solid #b3b3b3`)
      }
      else{
        element.css('border', `1px solid ${success}`)
      }
    }
  }
  formValidationAnimation($username)
  formValidationAnimation($password)

  $("#username, #password").focus(function() {
    $("#warning, #success").fadeOut();
  });
  

}