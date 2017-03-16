$(document).ready(function() {

	var priceLookup = {
		lodging: {
			low: 30,
			med: 75,
			high: 150
		},
		food: {
			low: 40,
			med: 80,
			high: 200
		},
		transpo: {
			low: 10,
			med: 20,
			high: 30
		}	
	};

	function getValues() {
		var startDateValue = $('#leave-input').val();
		var startDate = new Date(startDateValue).getTime();
		var returnDateValue = $('#return-input').val();
		var returnDate = new Date(returnDateValue).getTime();

		var tripDurationInDays = (returnDate - startDate) / (60000 * 60 * 24);
		var travelersValue = $('#travelers-input').val();

		var budgetValue = $('#budget-input').val();
		var lodgingValue = $('#lodging-dropdown').val();
		var lodgingPrice = priceLookup.lodging[lodgingValue];
		var foodValue = $('#food-dropdown').val();
		var foodPrice = priceLookup.food[foodValue];
		var transpoValue = $('#transpo-dropdown').val();
		var transpoPrice = priceLookup.transpo[transpoValue];
		
		return {
			startDateValue : startDateValue,
			returnDateValue : returnDateValue,
			tripDurationInDays: tripDurationInDays,
			travelersValue: travelersValue,
			budgetValue: budgetValue,
			lodgingPrice: lodgingPrice,
			foodPrice: foodPrice,
			transpoPrice: transpoPrice
		};
	}

	// Make form disappear to denote calculating results

	function fakeRefresh() {
		$('#homepage-submit').fadeOut('slow');
		$('#inputs').fadeOut('slow');
		$('#results').removeClass('hide');
	}

	function showErrorMsg() {

		$('#homepage-submit').prepend('<p id="error-msg">Whoa there, looks like you skipped something...</p>');
	}

	function checkFlights() {
		var airport = $('#airport-dropdown').val();
		// return $.ajax({
		// 	url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=yourApiKey',
		// 	type: 'post',
		// 	data: JSON.stringify({
		// 	  "request": {
		// 	    "slice": [
		// 	      {
		// 	        "origin": airport.toUpperCase(),
		// 	        "destination": "CDG",
		// 	        "date": "2017-03-12"
		// 	      }
		// 	    ],
		// 	    "passengers": {
		// 	      "adultCount": 1
		// 	    },
		// 	    "solutions": 20,
		// 	    "refundable": false
		// 	  }
		// 	}),
		// 	dataType: 'json',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// })
 		var deferred = $.Deferred();
    	return deferred.resolve(flightJSON)
	}

	function checkValues(values) {
		var soFar = (values.lodgingPrice + values.foodPrice + values.transpoPrice) * values.tripDurationInDays * values.travelersValue;
		var errorMsgExists = document.getElementById('error-msg');

		function showBudgetBreakdown() {
			checkFlights().then(function(data) {
				console.log(data);
				var flightPrice = parseInt(data.trips.tripOption[0].saleTotal.slice(3));
				fakeRefresh();
				if (soFar + flightPrice < values.budgetValue) {
					$('#results-blurb').append('<h2>Yes, Paris is indeed a good idea!</h2>');
					$('#results-blurb').append('<p>Here\'s your Budget Breakdown:</p><ul><li><span class="breakdown-info"><span class="breakdown-label">Flight</span><span class="breakdown-value"> = $' + flightPrice + '</span></span><span class="button book-button">Book Now</span></li><li><span class="breakdown-info"><span class="breakdown-label">Lodging</span><span class="breakdown-value"> = $' + values.lodgingPrice + '/day</span></span></li><li><span class="breakdown-info"><span class="breakdown-label">Food</span><span class="breakdown-value"> = $' + values.foodPrice + '/day</span></span></li><li><span class="breakdown-info"><span class="breakdown-label">Transportation</span><span class="breakdown-value"> = $' + values.transpoPrice + '/day</span></span></li></ul>');
				}
				else {
					$('#results-blurb').append('<h2>Sorry, Paris isn\'t such a good idea right now.</h2><p>You\'ll need at least $' + soFar + ' to cover your expenses.</p>');
					$('#try-again').removeClass('hide');
				}
			});
		}

		if (values.startDateValue !== '' && values.returnDateValue !== '' && values.travelersValue !== '' && values.budgetValue !== '') {
			showBudgetBreakdown();
		} else {
			if (errorMsgExists) {
				$('#error-msg').remove();
				showErrorMsg();
			} else {
				showErrorMsg();
			}
		}
	} 

	$('#homepage-submit').click(function () {
		var valuesObject = getValues();
		checkValues(valuesObject);
	});

	$('#try-again').click(function () {
		location.reload();
	});


});


/*

Questions:

Not getting flightPrice? not defined
Explain flightPrice = parseInt() line

How to prevent from entering Return Date that is before Leave Date?

How to prevent non-numbers being entered in Budget?

*/




