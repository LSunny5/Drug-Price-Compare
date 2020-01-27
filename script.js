'use strict';

// put your own value below!
//const apiKey = 'zueKVvh18kGUi882n17eaezG8crct0LeV2Yt1HB6';
const baseNURL = 'https://data.medicaid.gov/resource/a4y5-998d.json';

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






/*Button on results screen that will submit a new search*/
function restartApp() {
    $('.restart').submit(event => {
        event.preventDefault();
        let restartSearch = $('#searchBar2').val();

        //console.log(restartSearch);

        $('.startScreen').addClass('hidden');
        $('#findScreen').removeClass('hidden');
        $('main').addClass('hidden');
        $('.userItem').html(restartSearch);
        $('.findItemQuery').val('');

        drugFind(restartSearch);


    });
}


function comparePrice(product) {
    $('#findScreen').on('click', '.submitItem', function (event) {
        
        $('.startScreen').addClass('hidden');
        $('#findScreen').addClass('hidden');
        $('main').removeClass('hidden');
        $('#searchBar2').focus();


    });



}



function displayDrugChoices(responseJson) {
    $('.itemFindBox').empty();
    let maxResults=10;
    if (JSON.stringify(responseJson) === '[]') {
        $('.itemFindBox').text(`Sorry item was not found, please try again...`);
    } else {
        for (let i = 0; i < maxResults; i++) {
            //console.log(responseJson[i]);
            $('.itemFindBox').append(
                `<label class="choiceLabel" for="choice${i}">
                <input type="radio" class="radioChoice" id="choice${i}" name="drugChoices" value ="${responseJson[i].ndc_description}" checked>
                    ${responseJson[i].ndc_description}</label>`
            );
            
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


    }


        
        
        


    


    

    }
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



}











function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
   return queryItems.join('&');
}


function drugFind(drugName) {




    let upperItem = drugName.toUpperCase();

    const params = {
        ndc_description: upperItem
    }
    const queryString = formatQueryParams(params);
    const url = baseNURL + '?' + queryString;

    console.log(url);
     fetch(url)
         .then(response => {
             if (response.ok) {
                 console.log(response);
                 console.log(response.status);
                 return response.json();
             }
             throw new Error(response.statusText);
        })
        
        .then(responseJson => displayDrugChoices(responseJson))
        
        .catch(err => {
           $('.itemFindBox').text(`Sorry you have encountered an error: ${err.message}`);
       });





}

/*find the item in a list screen*/
function findUserItem(item) {
    $('.itemFindBox').empty();
    $('.startScreen').addClass('hidden');
    $('main').addClass('hidden');
    $('#findScreen').removeClass('hidden');
    $('.userItem').html(item);
    $('.submitItem').focus();

    drugFind(item);
    comparePrice(item);
}






/*event listener for if user enters a new item*/
function searchAgain() {
    $('.findTextBox').on('click', '.goButton', function (event) {
        let itemName = $('.findItemQuery').val();
        if (itemName === '') {
            event.preventDefault();
            alert('Please enter a drug name...');
        } else {
            event.preventDefault();
            $('.userItem').html(itemName);
            $('.findItemQuery').val('');
            drugFind(itemName);
        }
        
    });
}

/*start app wait for user to enter product and submit*/
function startApp() {
    $('.startScreen').submit(event => {
        event.preventDefault();
        const userItem = $('#startItemText').val();
        findUserItem(userItem);
    });
    searchAgain();
    restartApp();
}

$(startApp);