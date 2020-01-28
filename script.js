'use strict';

//base URLs for the sites
const baseNURL = 'https://data.medicaid.gov/resource/a4y5-998d.json?$where=ndc_description like ';
const baseAURL = 'https://data.medicaid.gov/resource/yns6-zx8k.json';







/*Button on results screen that will submit a new search*/
function restartApp() {
    // console.log('eight');
    $('.restart').submit(event => {
        event.preventDefault();
        //  console.log('nine');
        let restartSearch = $('#searchText2').val();
        restartSearch = restartSearch.toUpperCase();

        //console.log(restartSearch);

        $('.startScreen').addClass('hidden');
        $('#findScreen').removeClass('hidden');
        $('main').addClass('hidden');
        $('.userInput').html(restartSearch);
        $('.searchText').val('');

        drugFind(restartSearch);


    });
}



function displayACAInfo(responseA) {

    let acaFirst = responseA[0];
    let acaPrice = acaFirst.aca_ful;
    let acaCost = (Math.round(acaPrice * 100) / 100).toFixed(2);


    $('.acaBox').empty();
    if (JSON.stringify(responseA) === '[]') {
        $('.acaBox').text(`Sorry there was no matching drug...there are no ACA FUL pricing for over the counter drugs.`);
    } else {
        $('.acaBox').html(`
        <p class="title">ACA FUL Pricing<p>
        <p>The main ingredient name is ${acaFirst.ingredient}.</p>
        <p>$${acaCost} / ${acaFirst.mdr_unit_type}</p> 
        `);




    }




}
//setup text for URL 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function acaFind(drugNDC) {



    const paramsACA = {
        ndc: drugNDC
        //effective_date: recentDate
    }
    const queryString = formatQueryParams(paramsACA);
    const urlA = baseAURL + '?' + queryString;

    //console.log(url);
    fetch(urlA)
        .then(response => {
            if (response.ok) {
                //console.log(response);
                //console.log(response.status);
                return response.json();
            }
            throw new Error(response.statusText);
        })

        .then(responseJson => displayACAInfo(responseJson))

        .catch(err => {
            $('.acaBox').text(`Sorry you have encountered an error: ${err.message}`);
        });
}


function comparePrice(name, ndc, nPrice, unit, otc) {
    $('.startScreen').addClass('hidden');
    $('#findScreen').addClass('hidden');
    $('main').removeClass('hidden');
    $('#searchText2').focus();
    let otcYorN = '';
    if (otc === 'Y') {
        otcYorN = "over the counter";
    } else {
        otcYorN = "not over the counter";
    }

    acaFind(ndc);





    $('.nadacBox').html(`
    <p class="title">NADAC Pricing<p>
    <p>${name}<span> $${nPrice} / ${unit}</p>
    <p>${name} is ${otcYorN}</p>
    `);


}

/*find the item in a list screen*/
function findUserItem(item) {
    $('.drugList').empty();
    $('.startScreen').addClass('hidden');
    $('main').addClass('hidden');
    $('#findScreen').removeClass('hidden');
    $('.userInput').html(item);
    $('.foundButton').focus();

    // console.log('six');

    drugFind(item);

}

//get the checked JSON values for result screen
function getValues(checkedResponse) {
    $('#findScreen').on('click', '.foundButton', function (event) {
        let objPosition = $('input:checked').attr('id');

        console.log('here is the problem');
//////////////////////////////////////////////////////////////////////
        
        
        //if there are no choices selected will be undefined
        if (objPosition === undefined) {
            alert('Sorry, cannot find drug, please enter another name in text below.');
        } else {
            //variables to hold the strings of the JSON selected object
            let ndcTemp = checkedResponse[objPosition].ndc;
            let nPrice1 = checkedResponse[objPosition].nadac_per_unit
            let unitTemp = checkedResponse[objPosition].pricing_unit;
            let otcTemp = checkedResponse[objPosition].otc;
            let nameTemp = checkedResponse[objPosition].ndc_description;

            let nPriceTemp = (Math.round(nPrice1 * 100) / 100).toFixed(2);



            console.log("ndc number is " + ndcTemp);


            comparePrice(nameTemp, ndcTemp, nPriceTemp, unitTemp, otcTemp);

    
        }




    });
}








//display JSON objects to the drug list div for user to find
function displayDrugChoices(responseJson) {
    $('.drugList').empty();
    let maxResults = responseJson.length;

    //check to see JSON objects were returned
    if (JSON.stringify(responseJson) === '[]') {
        $('.drugList').text(`Sorry drug was not found, please try again...`);
    } else {
        //cycle through each object
        for (let i = 0; i < maxResults; i++) {
            //add generic or brand text to choices
            let drugType = "";
            if (responseJson[i].classification_for_rate_setting === "G") {
                drugType = "(Generic)"
            } else if (responseJson[i].classification_for_rate_setting === "B") {
                drugType = "(Brand)"
            } else {
                drugType = "(Unknown)"
            }
            //create radio buttons
            $('.drugList').append(
                `<label class="choiceLabel" for="${i}"><input type="radio" class="radioChoice" id="${i}" name="drugChoices" value ="${responseJson[i]}">${responseJson[i].ndc_description} ${drugType} <p>NDC No: ${responseJson[0].ndc}</p></label>`
            );
            //set first radio button to be default checked
            $("#0").prop("checked", true);
        }
    }
    getValues(responseJson);
}

//fetch JSON objects related to the user's input for Drug text
function drugFind(drugName) {
    let capDrug = drugName.toUpperCase();
    const filter = `'%25${capDrug}%25'`;
    const url = baseNURL + filter;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayDrugChoices(responseJson))
        .catch(err => {
            $('.drugList').text(`Sorry you have encountered an error: ${err.message}`);
        });
}

//on the drug list screen, actions after button to search is pressed
function searchAgain() {
    $('.searchTextBox').on('click', '.goButton', function (event) {
        event.preventDefault();
        let drugSearch = $('.searchText').val();
        drugSearch = drugSearch.toUpperCase();
        if (drugSearch === '') {
            alert('Please enter a drug name...');
        } else {
            $('.userInput').html(drugSearch);
            $('.searchText').val('');
            drugFind(drugSearch);
        }
    });
}

//starts the app, waits for user to enter drug name and submit*/
function startApp() {
    $('.startScreen').submit(event => {
        event.preventDefault();
        const item = $('#startItemText').val();
        findUserItem(item);
    });
    searchAgain();
    restartApp();
}

$(startApp);