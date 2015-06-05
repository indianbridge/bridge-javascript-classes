
$(function() {
	try {
		var lin = "pn|shdinkin,~~M5041ckc,~~M5177yqh,~~M52290ji|st||md|2S2468AH7QD2JC236A,S35TQKH89D8KC579J,SH36TKD34679QAC4T,|rh||ah|Board 12|sv|n|mb|p|mb|p|mb|p|mb|1S|an|Major suit opening -- 5+ !S; 11-21 HCP; |mb|p|mb|1N|an|2- !S; 6-11 HCP; 12- total points |mb|p|mb|p|mb|p|pc|CK|pc|CA|pc|C5|pc|C4|pc|DJ|pc|DK|pc|D3|pc|D5|pc|D8|pc|DA|pc|DT|pc|D2|pc|DQ|pc|H2|pc|S2|pc|S3|pc|D9|pc|H5|pc|S4|pc|S5|pc|D7|pc|HJ|pc|S6|pc|H9|pc|D6|pc|S7|pc|S8|pc|ST|pc|D4|pc|SJ|pc|C2|pc|SQ|pc|H3|pc|HA|pc|H7|pc|H8|pc|CQ|pc|C3|pc|C9|pc|CT|pc|C8|pc|C6|pc|CJ|pc|H6|pc|C7|pc|HT|pc|H4|pc|HQ|pc|SK|pc|HK|pc|S9|pc|SA|";
		var deal = new Bridge.Deal();
		deal.fromLIN( lin );
		$( "#output" ).empty().append( deal.toString() );	
	}
	catch ( err ) {
		alert(err.message);
	}	

});

