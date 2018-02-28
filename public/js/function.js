// Navigation
$('.b-menu').click(function() {
    $('#drop-item-container').toggleClass('clicked')
    $('.user-down').removeClass('clicked')
})
$('.drop-left li').click(function() {
    var liClass = $(this).attr('class')

    if(liClass.toString() === 'radioastronomy') {
        var resources =  `
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
        `
        $('.drop-right').html(resources)
    }

    else if(liClass.toString() === 'projects') {
        var radioastronomy = `
        <li><a href="#">Inroduction</a></li>
        <li><a href="#">Antenna Projects</a></li>
        <li><a href="#">Radio Jove</a></li>
        <li><a href="#">Meteor Projects</a></li>
        <li><a href="#">Solar Astronomy Projects</a></li>
        `
        $('.drop-right').html(radioastronomy)
    }

    else if(liClass.toString() === 'observations') {
        var radioastronomy = `<li><a href="#">Radio</a></li>`
        $('.drop-right').html(radioastronomy)
    }

    else if(liClass.toString() === 'resources') {
        var radioastronomy = `<li><a href="#">Radio</a></li>`
        $('.drop-right').html(radioastronomy)
    }

    else if(liClass.toString() === 'about') {
        var radioastronomy = `<li><a href="#">Radio</a></li>`
        $('.drop-right').html(radioastronomy)
    }
})

$('.b-categories, body').hover(function() {
    $('.drop-right').html
    (`
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
    `)
})

$('.b-user-dropdown').click(function() {
    $('.user-down').toggleClass('clicked')
    $('#drop-item-container').removeClass('clicked')
    
})

$('#username, #password').focus(function() {
    $('#warning, #success').addClass('fade')
})


$(document).ready(function() {
    var success = '#2a5bb8';
    var danger = '#e33545';
    /* Username Validation */
    if(!$('.usernameErrors').children().length){
        
        $('#username').on('change keyup', usernameValidation)
        console.log($('#username').val().length)
        if($('#username').val().length > 3) {
            $('#usernamelabel').addClass('show')
            $('#username').css('border', `1px solid ${success}`)
            $('#usernamelabel').css('color', `${success}`)
        }
    }

    else if($('.usernameErrors').children().length > 0){
        if(!$('#username').val()){
            $('#username').css('border', `1px solid ${danger}`)
            $('#usernamelabel').css('color', `${danger}`)
            $('.usernameErrors small:nth-child(2)').remove()
        }

        else if($('#username').val().length <= 3){
            $('.usernameErrors').html(`<small>Username must be at least 4 characters long</small>`)
            $('#username').css('border', `1px solid ${danger}`)
            $('#usernamelabel').css('color', `${danger}`)
            $('#usernamelabel').removeClass('none')
            $('#usernamelabel').addClass('show')
        }

        else{
            $('#username').css('border', `1px solid ${danger}`)
            $('#usernamelabel').css('color', `${danger}`)
            $('#usernamelabel').addClass('show')
        }
        $('#username').on('change keyup', usernameValidation)
    }
    function usernameValidation() {
            if($(this).val().length === 0){
                $('.usernameErrors').html('<small>Username field cannot be empty</small>')
                $('#username').css('border', `1px solid ${danger}`)
                $('#usernamelabel').css('color', `${danger}`)
                $('#usernamelabel').removeClass('show')
                $('#usernamelabel').addClass('none')
            }
            
            else if($(this).val().length > 3){
                $('.usernameErrors').html('')
                $('#usernamelabel').addClass('show')
                $('#username').css('border', `1px solid ${success}`)
                $('#usernamelabel').css('color', `${success}`)
            }

            else{
                $('.usernameErrors').html('<small>Username must be at least 4 characters long</small>')
                $('#username').css('border', `1px solid ${danger}`)
                $('#usernamelabel').css('color', `${danger}`)
                $('#usernamelabel').removeClass('none')
                $('#usernamelabel').addClass('show')
              
            }
    }

    /* Name Validation */
    if(!$('.firstnameErrors').children().length){
        $('#firstname').on('change keyup',  firstnameValidation)

        if($('#firstname').val()) {
            $('#firstname').html('')
            $('#firstnamelabel').addClass('show')
            $('#firstname').css('border', `1px solid ${success}`)
            $('#firstnamelabel').css('color', `${success}`)
            $('.firstnameErrors').html('')
        }
    }

    else if($('.firstnameErrors').children().length > 0) {

        if(!$('#firstname').val()){
            $('#firstname').css('border', `1px solid ${danger}`)
            $('#firstnamelabel').css('color', `${danger}`)
        }
        $('#firstname').on('change keyup',  firstnameValidation)
    }
 
    function firstnameValidation() {

        if(!$('#firstname').val()) {
            $('#firstnamelabel').css('color', `${danger}`)
            $('#firstname').css('border', `1px solid ${danger}`)
            $('.firstnameErrors').html('<small>Your first name is required</small>')
        }

        else{
            $('#firstname').html('')
            $('#firstnamelabel').addClass('show')
            $('#firstname').css('border', `1px solid ${success}`)
            $('#firstnamelabel').css('color', `${success}`)
            $('.firstnameErrors').html('')
        }
    }

    if(!$('.lastnameErrors').children().length) {
        $('#lastname').on('keyup', lastNameValidation)

        if($('#lastname').val()) {
            $('#lastname').html('')
            $('#lastnamelabel').addClass('show')
            $('#lastname').css('border', `1px solid ${success}`)
            $('#lastnamelabel').css('color', `${success}`)
            $('.lastnameErrors').html('')
        }
    }

    else if($('.lastnameErrors').children().length > 0) {

        if(!$('#lastname').val()){
            $('#lastname').css('border', `1px solid ${danger}`)
            $('#lastnamelabel').css('color', `${danger}`)
        }
        $('#lastname').on('change keyup',  lastNameValidation)
    }
    
    function lastNameValidation() {
        if(!$('#lastname').val()) {
            $('#lastnamelabel').css('color', `${danger}`)
            $('#lastname').css('border', `1px solid ${danger}`)
            $('.lastnameErrors').html('<small>Your last name is required</small>')
        } 

        else{
            $('#lastname').html('')
            $('#lastnamelabel').addClass('show')
            $('#lastname').css('border', `1px solid ${success}`)
            $('#lastnamelabel').css('color', `${success}`)
            $('.lastnameErrors').html('')
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(String(email).toLowerCase())
    }

    if(!$('.emailErrors').children().length) {
        function validate() {
            var email = $('#email').val()
            if(validateEmail(email)) {
                return true
            }
            else{
                return false
            }
        }

        var isEmail = validate()
        
        $('#email').on('keyup', emailValidation)
        if(!isEmail) {

        }   
        else {      
            $('.emailErrors').html('')
            $('#emaillabel').addClass('show')
            $('#email').css('border', `1px solid ${success}`)
            $('#emaillabel').css('color', `${success}`)
        }
    }

    else if($('.emailErrors').children().length > 0) {
        
        if(!$('#email').val()){
            $('#email').css('border', `1px solid ${danger}`)
            $('#emaillabel').css('color', `${danger}`)
            $('.emailErrors small:nth-child(2), .emailErrors small:nth-child(3) ').remove()
        }

        else if($('#email').val().length < 4){
            $('.emailErrors').html(`<small>Email address must be at least 3 characters long</small>`)
            $('#email').css('border', `1px solid ${danger}`)
            $('#emaillabel').css('color', `${danger}`)
            $('#emaillabel').removeClass('none')
            $('#emaillabel').addClass('show')
        }
        else{
            $('#emaillabel').addClass('show')
            $('#email').css('border', `1px solid ${danger}`)
            $('#emaillabel').css('color', `${danger}`)
        }
        $('#email').on('change keyup', emailValidation)
    }

    function emailValidation() {
        function validate() {
            var email = $('#email').val()

            if(validateEmail(email)) {
                return true
            }

            else{
                return false
            }
        }
        var isEmail = validate()

        if(!$(this).val()){
            $('.emailErrors').html('<small>Email field is required</small>')
            $('#email').css('border', `1px solid ${danger}`)
            $('#emaillabel').css('color', `${danger}`)
            $('#emaillabel').removeClass('show')
        }

        else if($(this).val().length < 4) {
            $('.emailErrors').html('<small>Email address must be at least 3 characters long</small>')
            $('#email').css('border', `1px solid ${danger}`)
            $('#emaillabel').css('color', `${danger}`)
            $('#emaillabel').removeClass('none')
            $('#emaillabel').addClass('show')
        }

        else if(!isEmail) {
            $('.emailErrors').html('<small>Invalid Email</small>')
            $('#email').css('border', `1px solid ${danger}`)
            $('#emaillabel').css('color', `${danger}`)
            $('#emaillabel').removeClass('none')
            $('#emaillabel').addClass('show')
        }
        
        else{
            $('.emailErrors').html('')
            $('#emaillabel').addClass('show')
            $('#email').css('border', `1px solid ${success}`)
            $('#emaillabel').css('color', `${success}`)
     
        }
    }
    if(!$('.passwordErrors').children().length) {
        $('#password').keyup(checkPassword)
    }

    else if($('.passwordErrors').children().length === 1) {

        if(!$('#password').val()) {
        $('#password').keyup(checkPassword)
            $('#password').css('border', `1px solid ${danger}`)
            $('#passwordlabel').css('color', `${danger}`)
        }
    }

    else if($('.passwordErrors').children().length >= 2){
        if(!$('#password').val()) {
            $('.passwordErrors small:nth-child(2)').remove()
            $('#password').css('border', `1px solid ${danger}`)
            $('#passwordlabel').css('color', `${danger}`)
            $('#password').keyup(checkPassword)
        }
    }
    function checkPassword() {
        $('#strengthchecker').html(checkStrength($('#password').val()))
        
    }
    function checkStrength(password) {
        var strength = 0;
        if(password.length === 0) {
            $('#strengthchecker').removeClass()
            $('#strengthchecker').addClass('short')
            $('#password').css('border', `1px solid ${danger}`)
            $('#passwordlabel').css('color', `${danger}`)
            $('#passwordlabel').removeClass('show')
            $('#passwordlabel').addClass('none')
            $('.passwordErrors').children().remove()
            return 'Password is required'
        }
        else if(password.length < 8) {
            $('#strengthchecker').removeClass()
            $('#strengthchecker').addClass('short')
            $('#password').css('border', `1px solid ${danger}`)
            $('#passwordlabel').css('color', `${danger}`)
            $('#passwordlabel').addClass('show')
            $('#passwordlabel').removeClass('none')
            $('.passwordErrors').remove()
            return 'Password should be at least 8 characters'
        }
        if (password.length > 7) strength += 1
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1

        if(strength < 2) {
            $('#password').css('border', `1px solid ${success}`)
            $('#passwordlabel').css('color', `${success}`)
            $('#strengthchecker').removeClass()
            $('#strengthchecker').addClass('weak')
            return 'Weak'
        }

        else if(strength == 2) {
            $('#password').css('border', `1px solid ${success}`)
            $('#passwordlabel').css('color', `${success}`)
            $('#strengthchecker').removeClass()
            $('#strengthchecker').addClass('good')
            return 'Good'
        }

        else{
            $('#password').css('border', `1px solid ${success}`)
            $('#passwordlabel').css('color', `${success}`)
            $('#strengthchecker').removeClass()
            $('#strengthchecker').addClass('strong')
            return 'Strong'
        }
    }
    $('#password2').keyup(confirmPassword)

    if($('.password2Errors').children().length > 0) {
        $('#password2').css('border', `1px solid ${danger}`)
        $('#password').css('border', `1px solid ${danger}`)

    }
    function confirmPassword () {
        if(!$('#password2').val().length) {
            $('#password2').css('border', `1px solid ${danger}`)
            $('#password2label').removeClass('show')
            $('.password2Errors').html('<small>Confirm Your Password</small>')
        }
        else{
            $('#password2').css('border', `1px solid ${success}`)
            $('#password2label').addClass('show')
            $('#password2label').removeClass('none')
            $('.password2Errors').html('')
        }
    }
})