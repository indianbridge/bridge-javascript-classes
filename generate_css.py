suits = [ 's', 'h', 'd', 'c' ]
ranks = [ 'a', 'k', 'q', 'j', 't', '9', '8', '7', '6', '5', '4', '3', '2' ]
output = ""
for suit in suits :
	for rank in ranks :
		output += "table.images span.card-deck-field-cards-" + suit + "-" + rank + ".unassigned {\n"
		output += "\tbackground-image: url(img/cards/" + suit + rank + ".png);\n"
		output += "\tbackground-size: contain;\n"
		output += "}\n"
		output += "\n"

print output
