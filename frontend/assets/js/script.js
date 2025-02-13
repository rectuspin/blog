
////////////////////Highlight//////////////////////////
$(document).ready(function() {
    //highlight clicked items
    $('.highlight').on('click', function() {
        let target = $(this).data("target");
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

    //Show country name
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


    //Search Country name
    $('#search-button').on('click', function () {
        let query = $('#country-search').val().trim();
        if (query === '') {
            $('#searchResult').text('Please enter a search term.');
            return;
        }

        axios.get(`/search?query=${query}`)
            .then(response => {
                console.log("Result:"+response.data.length);
                if (response.data.length>0) {
                    let target = "#"+response.data[0].country_code
                    $(target).addClass('blink');
                    setTimeout(function() {
                        $(target).removeClass('blink');
                    }, 4000); 
                    
                    $('#searchResult').text(response.data[0].country_name);
                } else {
                    $('#searchResult').text(`No matching record found.`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                $('#searchResult').text('An error occurred while searching for the country.');
            });
    });
});


