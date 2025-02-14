let countryData;

$(document).ready(function() {

    //Get visited countries and apply the color 
    axios.get('/api/worldmap-design')
    .then(response => {
        const countriesData = response.data;

        countriesData.forEach(country => {
            $(`#${country.country_code}`).css('fill', '#ffff99');
        });
    })
    .catch(error => console.error('Error fetching world map design:', error));

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
        axios.get(`/api/search?name=${query}`)
            .then(response => {

                let {country,isVisited,isValid}=response.data;
                countryData=country;
  
                if (isVisited&&isValid) {
                    alert("I have visited this country!");
                    let target = "#"+country.country_code;

                    $('html, body').animate({
                        scrollTop: $(target).offset().top -120
                    }, 1000);  
                    $(target).addClass('blink');
                    setTimeout(function() {
                        $(target).removeClass('blink');
                    }, 4000); 
                    
                } else if(!isVisited&&isValid){
                    alert('I have not visited this country yet!');
                    
                }else {
                    alert("Invaild Country Name");
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
          axios.get(`/api/country-search-suggestions?name=${countryName}`)
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
    
    // Hide suggestions when clicking outside
    $(document).on("click", function (event) {
        if (!$(event.target).closest("#search-suggestions").length) {
            $("#search-suggestions").hide();
        }
    });
      // When a suggestion is clicked, populate the search bar and clear suggestions
      $(document).on('click', '#search-suggestions li', function () {
        const selectedSuggestion = $(this).text();
        $('#country-search-bar').val(selectedSuggestion);
        $('#search-suggestions').empty(); 
      });

      //Leave a country review
    $('#country-review-button').on('click', function () {
        window.location.href =`/country-review?country=${countryData.country_name}`;
    });
});

