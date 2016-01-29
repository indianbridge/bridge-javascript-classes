
$(function() {
	try {	
		var deal = new Bridge.Deal();
		deal.fromString( "s=sakqhakqdakxcakqj&a=pp1dp1np2cp3hp3nppp" );
		var source   = $("#bw-auction").html();
		var template = Handlebars.compile(source);
		var context = deal.getAuction().toTemplate();
		var html    = template(context);
		$('#auction').html(html);
		source   = $("#bw-one-hand").html();
		template = Handlebars.compile(source);
		context = deal.getHand( 's' ).toTemplate();
		var html    = template(context);
		$('#hand').html(deal.getHand( 's' ).toHTML());
	}
	catch ( err ) {
		alert(err.message);
	}	

});

