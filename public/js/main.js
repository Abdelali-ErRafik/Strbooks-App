// Language: Jquery

$(document).ready(function(){
    //Responsive menu
    $('.sidenav').sidenav();
    //Dropdown
    $('.modal').modal();
    $('.dropdown-trigger').dropdown();
    //Select
    $('select').formSelect();
    //Confirm delete
    $('.confirm').click(function(){
        return confirm('Are you sure you want to delete?');
    });
});


// ckeditor
CKEDITOR.replace( 'body', {
    plugins: 'wysiwygarea, toolbar, basicstyles, link'
});


