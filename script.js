'use strict';

// put your own value below!
//const apiKey = 'zueKVvh18kGUi882n17eaezG8crct0LeV2Yt1HB6';
//const baseURL = 'https://developer.nps.gov/api/v1/parks';

function displayResults(responseJson, numResults) {
    // if there are previous results, remove them
    //  console.log(responseJson);
    //  $('#results-list').empty();
    //  $('#error-message').empty();

    // iterate through the items array
  //  for (let i = 0; i < responseJson.data.length & i < numResults; i++) {
        // for each park object, add full name, description, website URL, and park address
        //   $('#results-list').append(
        //      `<li><h3>${responseJson.data[i].fullName}</h3>
        //       <p>Location: 
        //        <br>
        //        <p>${responseJson.data[i].directionsInfo}</p>
        //       <p>Description:  
        //       <br>
        //       ${responseJson.data[i].description}</p>
        //      <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
        //       </li>`
        //   )
  //  };

    //display the results section  
 //   $('#results').removeClass('hidden');
};

//function formatQueryParams(params) {
//    const queryItems = Object.keys(params)
//        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
 //   return queryItems.join('&');
//}


function restartApp() {

    $('.restart').submit(event => {
        event.preventDefault();
        let restartSearch = $('#searchBar2').val();

        console.log(restartSearch);

            $('.startScreen').addClass('hidden');
            $('#findItem').removeClass('hidden');
            $('main').addClass('hidden');
       
          
            $('.userItem').html(restartSearch);
            $('.findItemQuery').val('');


    });
}


function comparePrice(product) {
    $('#findItem').on('click', '.submitItem', function (event) {
        $('.startScreen').addClass('hidden');
        $('#findItem').addClass('hidden');
        $('main').removeClass('hidden');
        $('#searchBar2').focus();


    });



}





/*event listener for if user enters a new item*/
function searchAgain() {
    
    
    $('.findTextBox').on('click', '.goButton', function (event) {
        let itemName = $('.findItemQuery').val();

        if (itemName === '') {
            event.preventDefault();
            alert('Please enter an item in the text box...');

        } else {
            event.preventDefault();


            $('.userItem').html(itemName);
            $('.findItemQuery').val('');
        }

    });

}












/*find the item in a list screen*/
function findUserItem(item) {

    $('.startScreen').addClass('hidden');
    $('main').addClass('hidden');
    $('#findItem').removeClass('hidden');

    $('.userItem').html(item);
    comparePrice(item);


    //    const params = {
    //      stateCode: states,
    //    limit: numResults,
    //       api_key: apiKey
    // };

    //   const queryString = formatQueryParams(params);
    //  const url = baseURL + '?' + queryString;



    // fetch(url)
    //     .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         }
    //         throw new Error(response.statusText);
    //    })
    //    .then(responseJson => displayResults(responseJson, numResults))
    //    .catch(err => {
    //       $('#error-message').text(`Sorry you have encountered an error: ${err.message}`);
    //   });
}














/*start app wait for user to enter product and submit*/
function startApp() {
    $('.startScreen').submit(event => {
        event.preventDefault();
        const userItem = $('#searchArea').val();
        findUserItem(userItem);
    });
    searchAgain();
    restartApp();
}

$(startApp);