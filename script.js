'use strict';

// put your own value below!
//const apiKey = 'zueKVvh18kGUi882n17eaezG8crct0LeV2Yt1HB6';
const baseNURL = 'https://data.medicaid.gov/resource/a4y5-998d.json';
const baseAURL = 'https://data.medicaid.gov/resource/yns6-zx8k.json';








/*Button on results screen that will submit a new search*/
function restartApp() {
    // console.log('eight');
    $('.restart').submit(event => {
        event.preventDefault();
        //  console.log('nine');
        let restartSearch = $('#searchBar2').val();
        restartSearch = restartSearch.toUpperCase();

        //console.log(restartSearch);

        $('.startScreen').addClass('hidden');
        $('#findScreen').removeClass('hidden');
        $('main').addClass('hidden');
        $('.userItem').html(restartSearch);
        $('.findItemQuery').val('');

        drugFind(restartSearch);


    });
}

/*
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}*/

function displayACAInfo(responseA) {

    let acaPrice = responseA.aca_ful;
    let acaCost = (Math.round(acaPrice * 100) / 100).toFixed(2);


    $('.other2').empty();
    if (JSON.stringify(responseA) === '[]') {
        $('.other2').text(`Sorry there was no matching drug...there are no ACA FUL pricing for over the counter drugs.`);
    } else {
        $('.other2').html(`
        <p class="title">ACA FUL Pricing<p>
        <p>The main ingredient name is ${responseA.ingredient}.</p>
        <p>$${acaCost} / ${responseA.mdr_unit_type}</p> 
        
        
        `);




    }


    /*
       $('.itemFindBox').append(
           `<label class="choiceLabel" for="${i}"><input type="radio" class="radioChoice" id="${i}" name="drugChoices" value ="${responseJson[i]}">${responseJson[i].ndc_description} ${drugType}</label>`
       );
    }*/



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
            $('.other2').text(`Sorry you have encountered an error: ${err.message}`);
        });
}


function comparePrice(name, ndc, nPrice, unit, otc) {
    $('.startScreen').addClass('hidden');
    $('#findScreen').addClass('hidden');
    $('main').removeClass('hidden');
    $('#searchBar2').focus();
    let otcYorN = '';
    if (otc === 'Y') {
        otcYorN = "over the counter";
    } else {
        otcYorN = "not over the counter";
    }

    acaFind(ndc);





    $('.other1').html(`
    <p class="title">NADAC Pricing<p>
    <p>${name}<span> $${nPrice} / ${unit}</p>
    <p>${name} is ${otcYorN}</p>
    `);



    //   console.log('seven');
    // $('#findScreen').on('click', '.submitItem', function (event) {





    //   console.log ("picked equals " + picked);

    // if (!picked.val()) {
    //    event.preventDefault();
    //  alert('Please choose one item!');
    // 
    //make sure user selects one button
    //  } else {


    // let itemNDC=picked.ndc;
    /// let unit= picked.Pricing_Unit;
    // let price = picked.NADAC_Per_Unit;




    //let userAnswer = picked;

    //       console.log('user answer is '+ userAnswer);
    //      console.log('unit for drug is '+ unit);
    //      console.log('ndc number is '+ itemNDC);
    //     console.log('price is '+ price);




    // }






    //  });



}

/*find the item in a list screen*/
function findUserItem(item) {
    $('.itemFindBox').empty();
    $('.startScreen').addClass('hidden');
    $('main').addClass('hidden');
    $('#findScreen').removeClass('hidden');
    $('.userItem').html(item);
    $('.submitItem').focus();

    // console.log('six');

    drugFind(item);

}




function displayDrugChoices(responseJson) {
    $('.itemFindBox').empty();
    //console.log('five');
    let maxResults = responseJson.length;
    //let maxResults = 3;

    if (JSON.stringify(responseJson) === '[]') {
        $('.itemFindBox').text(`Sorry drug was not found, please try again...`);
    } else {
        for (let i = 0; i < maxResults; i++) {
            //console.log(responseJson[i].NDC_Description);
            //   if (responseJson.effective_date === recentDate) {
            let drugType = "";
            if (responseJson[i].classification_for_rate_setting === "G") {
                drugType = "(Generic)"
            } else if (responseJson[i].classification_for_rate_setting === "B") {
                drugType = "(Brand)"
            } else {
                drugType = "(Unknown)"
            }
            if (i === 0) {
                $('.itemFindBox').append(
                    `<label class="choiceLabel" for="0"><input type="radio" class="radioChoice" id="0" name="drugChoices" value ="${responseJson[i]}" checked>${responseJson[i].ndc_description} ${drugType}</label>`
                );
            } else {
                $('.itemFindBox').append(
                    `<label class="choiceLabel" for="${i}"><input type="radio" class="radioChoice" id="${i}" name="drugChoices" value ="${responseJson[i]}">${responseJson[i].ndc_description} ${drugType}</label>`
                );
            }




            //    }

        }
    }

    
    
    $('#findScreen').on('click', '.submitItem', function (event) {
        console.log('forty');

        let checked = $('input:checked');
        let selected = checked.attr('id');

        if (responseJson[selected] === undefined) {
            alert('Sorry, cannot find drug, please enter another name in text below.');
        } else {

            


            
            // console.log("id is " + selected);
    
           
            let ndcTemp = responseJson[selected].ndc;
            let nPrice1 = responseJson[selected].nadac_per_unit
            let unitTemp = responseJson[selected].pricing_unit;
            let otcTemp = responseJson[selected].otc;
            let nameTemp = responseJson[selected].ndc_description;
    
            let nPriceTemp = (Math.round(nPrice1 * 100) / 100).toFixed(2);
    
    
    
            comparePrice(nameTemp, ndcTemp, nPriceTemp, unitTemp, otcTemp);
            /*
            if ($(responseJson).prop('checked') === true ) {
                let pickedObj=[];
              //  pickedObj[0]=$('input:checked');
                
    
                for (let i=0; i<responseJson.length; i++) {
                        pickedObj[i]=responseJson[i].value;
                        console.log ("picked object is " + pickedObj[i]);
                }
                console.log(pickedObj);
    
    
            }*/
        }
        
        
        
        







    });

}











function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function drugFind(drugName) {

    // console.log('three');
    //let recentDate = "2020-01-22T00:00:00.000";

    let upperItem = drugName.toUpperCase();

    const params = {
        ndc_description: upperItem
        //effective_date: recentDate
    }
    const queryString = formatQueryParams(params);
    const url = baseNURL + '?' + queryString;

    //console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                //console.log(response);
                //console.log(response.status);
                return response.json();
            }
            throw new Error(response.statusText);
        })

        .then(responseJson => displayDrugChoices(responseJson))

        .catch(err => {
            $('.itemFindBox').text(`Sorry you have encountered an error: ${err.message}`);
        });
}

















/*event listener for if user enters a new item*/
function searchAgain() {


    /* 
 const search = document.getElementById('searchBar');
 const drugList = document.getElementById('itemFindBox');
 
 //search nadac json and filter 
 const searchDrugs = async searchText => {
     const resp = await fetch(baseNURL);
     const drugs = await resp.json();
 
     //match them
     let matches = drugs.filter(drug => {
         const regex = new RegExp (`${searchText}`, 'gi');
         return drug.ndc_description.match(regex)
     });
 
     if (searchBar.length === 0) {
         matches = [];
         drugList.innerHTML = '';
     }
     outputHTML(matches);
 
 
 }
 
 const outputHTML = matches => {
     if (matches.length >0) {
         const html = matches    
             .map(
                 match => `
                 `
             ).join('');
         drugList.innerHTML = html;
     }
 }
 
 search.addEventListener('input', () => searchDrugs(search.value));
 
 */
    // console.log('one');
    $('.findTextBox').on('click', '.goButton', function (event) {
        //console.log('two');
        let itemName = $('.findItemQuery').val();
        itemName = itemName.toUpperCase();
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