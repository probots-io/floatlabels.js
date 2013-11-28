$(document).ready(function() {

	$('#demo-floatlabel').floatlabel({
		labelEndTop: "12px"
	});

	Socialite.load();

	$('#demo-floatlabel').on('keyup blur change', function() {

		if( $(this).val() != '' ) {

			$('#tagbox').fadeOut();
			$('#tagbox2').fadeIn();

		} else {

			$('#tagbox2').fadeOut();
			$('#tagbox').fadeIn();

		}

	}).focus();

});