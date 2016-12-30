$(function() {
  try {
    var deal = new Bridge.Deal();
    deal.fromString("s=S7HDQT8742CAT8543");
    deal.getHand('s').toHTML({
			"template": "concise",
			"wrapperClass": "images",
			"alternateSuitColor": true,
			"containerID": "hand",
		});
  }
  catch ( err ) {
    alert(err.message);
  }
});
