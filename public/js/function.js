// Navigation
$('.b-menu').click(function() {
    $('#drop-item-container').toggleClass('clicked')
    $('.user-down').removeClass('clicked')
})
$('.drop-left li').hover(function() {
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
    $('#username').focus(function (){
        $('#usernamelabel').addClass('show')
        $('#usernamelabel').removeClass('none')
        $('#username').addClass('border')
})
$('#username').blur(function (){
    if($(this).val() && !$('.usernameErrors').has('small').length) {
        $('#usernamelabel').addClass('show')
        $('#usernamelabel').removeClass('none')
        $('#username').addClass('border')
    }
    else{
        $('#usernamelabel').removeClass('show')
        $('#usernamelabel').addClass('none')
        $('#username').removeClass('border')
    }
})
if($('.usernameErrors').has('small').length === 1) {
    if($('#username').val()){
    $('#username').css('border', '1px solid #e33545')
    $('#usernamelabel').css('color', '#e33545')
    $('#usernamelabel').removeClass('show')
    }
    $('#username').keyup(function() {
        if($(this).val().length === 4 || $(this).val().length === 5 || $(this).val().length === 6) {
            $('#username').css('border', '1px solid #2a5bb8')
            $('#usernamelabel').css('color', '#2a5bb8')
            $('.usernameErrors small').css('display', 'none')
        }
        else if($(this).val().length === 1 || $(this).val().length === 2 || $(this).val().length === 3 || $(this).val().length === 15 || $(this).val().length === 16 ||$(this).val().length === 17 ) {
            $('#username').css('border', '1px solid #e33545')
            $('#usernamelabel').css('color', '#e33545')
            $('#usernamelabel').addClass('show')
            $('#usernamelabel').removeClass('none')
            $('.usernameErrors small').css('display', 'block')
            $('.usernameErrors').html('<small>Username must be between 4-15 characters long</small>')
        }
        else if(!$(this).val().length) {
            $('#username').css('border', '1px solid #e33545')
            $('#usernamelabel').css('color', '#e33545')
            $('#usernamelabel').addClass('show')
            $('#usernamelabel').removeClass('none')
            $('.usernameErrors small').css('display', 'block')
            $('.usernameErrors').html('<small>Username field cannot be empty</small>')
        }
    })

}
})
