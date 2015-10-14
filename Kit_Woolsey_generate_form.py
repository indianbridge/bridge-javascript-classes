# -*- coding: utf-8 -*-
fileName = "Kit_Woolsey_Spingold_Survey_2.html"
with open (fileName, "r") as myfile:
    data=myfile.read()

data = data.replace('[iframe', '<iframe src="http://www.bridgebase.com/tools/handviewer.html?')
data = data.replace('][/iframe]', '></iframe>')
data = data.replace( '!C</span>', '<font color="000000">♣</font></span>')
data = data.replace( '!CA</span>', '<font color="000000">♣</font>A</span>')
data = data.replace( '!D</span>', '<font color="CB0000">♦</font></span>')
data = data.replace( '!H</span>', '<font color="CB0000">♥</font></span>')
data = data.replace( '!HA</span>', '<font color="CB0000">♥</font>A</span>')
data = data.replace( '!S</span>', '<font color="000000">♠</font></span>')
data = data.replace( '!SK</span>', '<font color="000000">♠</font>K</span>')
data = data.replace( '&lt;br/&gt;', '<br/>')
data = data.replace( '&amp;', '&')
data = data.replace( '&C', '<font color="000000">♣</font></span>')
data = data.replace( '&D', '<font color="CB0000">♦</font></span>')
data = data.replace( '&H', '<font color="CB0000">♥</font></span>')
data = data.replace( '&S', '<font color="000000">♠</font></span>')
data = data.replace( 'handviewer.html? ', 'handviewer.html?')
with open(fileName, "w") as myfile:
	myfile.write(data)
