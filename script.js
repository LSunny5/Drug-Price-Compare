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
    for (let i = 0; i < responseJson.data.length & i < numResults; i++) {
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
    };

    //display the results section  
    $('#results').removeClass('hidden');
};

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}










/*event listener for if user enters a new item*/
function searchAgain() {
    //console.log('This is step 2');
    $('.findTextBox').on('click', '.searchAgainButton', function (event) {
        const item2 = $('.findItemQuery').val();
        if (item2 === '') {
            event.preventDefault();
            alert('Please enter an item in the text box...');
           
        } else {
            event.preventDefault();
    
           // console.log('this is step 3');
            //console.log(item2);
            $('.userItem').html(item2);
            $('.findItemQuery').val('');
        }

    });
    //searchAgain();
}

/*find the item in a list screen*/
function findUserItem(item) {
    
    $('.startScreen').addClass('hidden');
    $('main').addClass('hidden');
    $('#findItem').removeClass('hidden');

    //print to console to check
    //console.log(item);

    $('.userItem').html(item);

    //searchAgain();



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
    $('.appInfo').submit(event => {
        event.preventDefault();
        const userItem = $('#searchArea').val();
        findUserItem(userItem);
    });
    searchAgain();
}

$(startApp);