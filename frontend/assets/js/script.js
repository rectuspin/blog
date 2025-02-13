
////////////////////Highlight//////////////////////////
$(document).ready(function() {
    //highlight clicked items
    $('.highlight').on('click', function() {
        var target = $(this).data("target");
        $('html, body').animate({
            scrollTop: $(target).offset().top -120
        }, 1000);  
        $(target).addClass('blink');
        setTimeout(function() {
            $(target).removeClass('blink');
        }, 4000); 
    });

    const url = new URLSearchParams(window.location.search);
    
    //Creation Alert
    const postCreated = url.get('postCreated');
    if (postCreated==='true') {
        alert('Item created successfully');
    } else if(postCreated==='false'){
        alert('There was an error creating the item');
    }

    //Deletion
    $('.delete-btn').on('click', function() {
        const itemId = $(this).data('id');  

        axios.delete(`/items/${itemId}`)
            .then(response => {
                alert(response.data.message);  
                // Remove the item from the list
                $(this).parent().remove(); 
                window.location.href = "/items"; 
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting the item');
                window.location.href = "/items";
            });
    });

    $(".path-country").on('mousemove', function (event) {
        const text = $(this).attr("title"); 
        $('#country-name-box').text(text) 
                     .css({
                        left: event.pageX + 10 + 'px',
                        top: event.pageY + 10 + 'px',
                        display: 'block'
                     });
    });

    $('.path-country').on('mouseleave', function () {
        $('#country-name-box').hide(); 
    });

});


