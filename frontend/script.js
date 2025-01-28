$(document).ready(function() {
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

});


