'use strict';

//base URLs for the sites
const baseNURL = 'https://data.medicaid.gov/resource/a4y5-998d.json?$where=ndc_description like ';
const baseAURL = 'https://data.medicaid.gov/resource/yns6-zx8k.json';

//button listener to restart the search and find new drug 
function restartApp() {
    $('.restart').submit(event => {
        event.preventDefault();
        let restartSearch = $('#searchText2').val();
        restartSearch = restartSearch.toUpperCase();

        $('.startScreen').addClass('hidden');
        $('#findScreen').removeClass('hidden');
        $('main').addClass('hidden');
        $('.userInput').html(restartSearch);
        $('.searchText').val('');

        drugFind(restartSearch);
    });
}

//Display ACA FUL pricing to screen and AMP pricing
function printACA(response) {
    let acaFirst = response[0];
    $('.acaBox').empty();
    $('.ampBox').empty();

    //display ACA FUL pricing to webpage
    if (JSON.stringify(response) === '[]') {
        $('.acaBox').html(`
        <p class="title">ACA FUL Pricing (Medicaid Upper Limit Costs)<p>
        <p>Sorry there is no ACA FUL pricing for over the counter drugs.</p>`);
    } else {
        let acaPrice = acaFirst.aca_ful;
        let acaCost = (Math.round(acaPrice * 100) / 100).toFixed(2);

        $('.drugDesc').append(` 
            <p>The main ingredient name is ${acaFirst.ingredient}.</p>
        `);

        $('.acaBox').html(`
        <p class="title">ACA FUL Pricing (Medicaid Upper Limit Costs)<p>
        <p>$${acaCost} / ${acaFirst.mdr_unit_type}</p> 
        `);
    }

    //display AMP pricing to webpage
    if (JSON.stringify(response) === '[]') {
        $('.ampBox').html(`
        <p class="title">AMP Pricing (Average Manufacturer Price)<p>
        <p>Sorry there is no AMP data for over the counter drugs.</p>`);
    } else {
        let ampPrice = acaFirst.weighted_average_amps;
        let ampCost = (Math.round(ampPrice * 100) / 100).toFixed(2);
        $('.ampBox').html(`
        <p class="title">AMP Pricing (Average Manufacturer Price)<p>
        <p>$${ampCost} / ${acaFirst.mdr_unit_type}</p> 
        `);
    }
}

//setup text for URL 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//get JSON objects for the ACA FUL values
function acaFind(drugNDC) {
    const paramsACA = {
        ndc: drugNDC
    }
    const queryString = formatQueryParams(paramsACA);
    const urlA = baseAURL + '?' + queryString;

    fetch(urlA)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => printACA(responseJson))
        .catch(err => {
            $('.acaBox').text(`Sorry you have encountered an error: ${err.message}`);
        });
}

//display content to the NADAC pricing box
function printNADAC(name, ndc, nPrice, unit, otc) {
    $('.startScreen').addClass('hidden');
    $('#findScreen').addClass('hidden');
    $('main').removeClass('hidden');
    $('#searchText2').focus();

    //convert values to usable terms for web app
    let otcYorN = '';
    if (otc === 'Y') {
        otcYorN = "over the counter";
    } else {
        otcYorN = "NOT over the counter";
    }

    acaFind(ndc);
    //print to Drug Description Box
    $('.drugDesc').html(` 
        <p class="title">${name}</p>
        <p>${name} is ${otcYorN}</p>
        <p>NDC No: ${ndc}</p>
    `);

    //print to nadac box
    $('.nadacBox').html(`
        <p class="title">NADAC Pricing (Prices Pharmacy Pays)<p>
        <p> $${nPrice} / ${unit}</p>
    `);
}

//find the item on the list screen display
function findUserItem(item) {
    $('.drugList').empty();
    $('.startScreen').addClass('hidden');
    $('main').addClass('hidden');
    $('#findScreen').removeClass('hidden');
    $('.userInput').html(item);
    $('.foundButton').focus();
    drugFind(item);
}

//get the checked JSON values for the result screen
function getValues(checkedResponse) {
    $('.foundButton').focus();
    $('#findScreen').one('click', '.foundButton', function (event) {
        let objPosition = $('input:checked').attr('id');

        //variables to hold the strings of the JSON selected object
        let ndc = checkedResponse[objPosition].ndc;
        let price = checkedResponse[objPosition].nadac_per_unit
        let unit = checkedResponse[objPosition].pricing_unit;
        let otc = checkedResponse[objPosition].otc;
        let name = checkedResponse[objPosition].ndc_description;
        let nPrice = (Math.round(price * 100) / 100).toFixed(2);
        printNADAC(name, ndc, nPrice, unit, otc);
    });
}

//display JSON objects to the drug list div for user to find
function displayDrugChoices(responseJson) {
    $('.drugList').empty();
    let maxResults = responseJson.length;

    //check to see JSON objects were returned
    if (JSON.stringify(responseJson) === '[]') {
        $('.drugList').text(`Sorry drug was not found, please try again...`);
        $('.foundButton').attr('disabled', true);
        $('#searchText1').focus();
    } else {
        //filter through objects from JSON fetch and remove duplicate ndc numbers
        let temp = [...new Map(responseJson.map(drug => [drug.ndc, drug])).values()];

        //sort results with drug name and then the ndc number
        temp.sort(function (a,b) {
            return a.ndc_description.localeCompare(b.ndc_description) || a.ndc-b.ndc;
        })

        //cycle through each object in created temp array
        for (let i = 0; i < temp.length; i++) {
            let drugType = "";
            if (temp[i].classification_for_rate_setting === "G") {
                drugType = "(Generic)"
            } else if (temp[i].classification_for_rate_setting === "B") {
                drugType = "(Brand)"
            } else {
                drugType = "(Unknown)"
            }

            //create radio buttons
            $('.drugList').append(
                `<label class="choiceLabel" for="${i}"><input type="radio" class="radioChoice" id="${i}" name="drugChoices" value ="${temp[i]}">${temp[i].ndc_description} ${drugType} <p>NDC No: ${temp[i].ndc}</p></label>`
            );
            //set first radio button to be default checked
            $("#0").prop("checked", true);
            $('.foundButton').attr('disabled', false);
        }
        getValues(temp);
    }
}

//fetch JSON objects related to the user's input for Drug text
function drugFind(drugName) {
    let capDrug = drugName.toUpperCase();
    const filter = `'%25${capDrug}%25'`;
    const url = baseNURL + filter;

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