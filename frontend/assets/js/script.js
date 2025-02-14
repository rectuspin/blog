
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
    $('#country-search-button').on('click', function () {
        let query = $('#country-search-bar').val().trim();
        if (query === '') {
            $('#searchResult').text('Please enter a search term.');
            return;
        }

        axios.get(`/search?name=${query}`)
            .then(response => {
                console.log("Result:"+response.data.length);
                if (response.data.length>0) {
                    let target = "#"+response.data[0].country_code;
                    $('html, body').animate({
                        scrollTop: $(target).offset().top -120
                    }, 1000);  
                    $(target).addClass('blink');
                    setTimeout(function() {
                        $(target).removeClass('blink');
                    }, 4000); 
                } else {
                    alert("No matching record found.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while searching for the country.');
            });
    });

    //Show search suggestions
    $('#country-search-bar').on('input', function () {
        const countryName = $(this).val();

        if (countryName.length > 1) {
          axios.get(`/country-search-suggestions?name=${countryName}`)
            .then(response => {
              const suggestions = response.data;

              $('#search-suggestions').empty();

              if (suggestions.length > 0) {
                suggestions.forEach(suggestion => {
                  $('#search-suggestions').append(`<li class="suggestion-item">${suggestion}</li>`);
                  $('#search-suggestions').show();
                });
              } else {
                $('#search-suggestions').append('<li class="suggestion-item">No matches found</li>');
                $('#search-suggestions').hide();
              }
            })
            .catch(error => {
              console.error('Error fetching suggestions:', error);
            });
        } else {
          $('#suggestions-list').empty();
        }
      });

      // When a suggestion is clicked, populate the search bar and clear suggestions
      $(document).on('click', '#search-suggestions li', function () {
        const selectedSuggestion = $(this).text();
        $('#country-search-bar').val(selectedSuggestion);
        $('#search-suggestions').empty(); 
      });
});


