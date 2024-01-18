$(document).ready(function () {
    $('#new_db').click(function (e) { 
        e.preventDefault();
        var newParagraph = $('<div>').text('TABLE').addClass('button').attr('id','database');
        $('#leftbar_options').prepend(newParagraph);
        
    });
});
