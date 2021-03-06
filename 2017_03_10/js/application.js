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

// function flagErrors {
// 	for ()
// }

// function createErrorMsg() {
// 	var travelersLabel = document.getElementById('travelers-input');
// 	var budgetLabel = document.getElementById('budget-input');
// 	if (values.travelersValue == '' && values.budgetValue == '') {
// 		$('#error-msg').append('<span>Number of travelers, Budget</span>');
// 	} else if (values.travelersValue !== '' && values.budgetValue == '') {
// 		$('#error-msg').append('<span>Budget</span>');
// 	} else if (values.travelersValue == '' && values.budgetValue !== '') {
// 		$('#error-msg').append('<span>Number of travelers</span>');
// 	}
// }
// var errorMsg = createErrorMsg();

function showErrorMsg() {

	// var labelList = // look for the things for which value == '', then get the contents of the label element
	$('#homepage-submit').prepend('<p id="error-msg">Whoa there, looks like you skipped something...</p>');
}

function checkValues(values) {
	var soFar = (values.lodgingPrice + values.foodPrice + values.transpoPrice) * values.tripDurationInDays * values.travelersValue;
	var canDo = soFar < values.budgetValue;
	var errorMsgExists = document.getElementById('error-msg');

	function showBudgetBreakdown() {
		$('#results-blurb').append('<p>Here\'s your Budget Breakdown:</p><ul><li>Lodging: $' + values.lodgingPrice + ' /day</li><li>Food: $' + values.foodPrice + ' /day</li><li>Transportation: $' + values.transpoPrice + ' /day</li></ul>');
	}

	if (values.startDateValue !== '' && values.returnDateValue !== '' && values.travelersValue !== '' && values.budgetValue !== '') {
		if (canDo) {
			fakeRefresh();
			$('#results-blurb').append('<h2>Yes, Paris is indeed a good idea!</h2>');
			showBudgetBreakdown();
		}
		else {
			fakeRefresh();
			$('#results-blurb').append('<h2>Sorry, Paris isn\'t such a good idea right now.</h2><p>You\'ll need at least $' + soFar + ' to cover your expenses.</p>');
		}
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




});





