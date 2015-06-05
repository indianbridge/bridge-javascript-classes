import json
import os
import sys
import copy
import collections

if len(sys.argv) > 1:
	json_file_name = sys.argv[1]
else:
	json_file_name = 'C:\\Users\\snarasim\\Documents\\svn\\dash\\physics\\AGSM\\models\\gas\\template.json'
if not os.path.exists( json_file_name):
	print 'Cannot find json config file ' + json_file_name
	sys.exit(2)

with open( json_file_name, 'r' ) as json_file:
	config = json.load(json_file, object_pairs_hook=collections.OrderedDict)
	
model = collections.OrderedDict()
model["components"] = []
model["connections"] = []
model["inputs"] = []
storageTank = collections.OrderedDict([
	("type", "Tank"),
	("name", "Storage Tank"),
	("pressure", "1.2,atm"),
	("temperature", 80)
	])
vehicleTank = collections.OrderedDict([
	("type", "Tank"),
	("name", "Vehicle Tank"),
	("pressure", 101325),
	("temperature", 80)
	])
model["components"].append(storageTank)
model["components"].append(vehicleTank)

#ST to pipe1 valve
valve = collections.OrderedDict()
name = "Valve_ST_1"
valve["name"] = name
for item in config["Valve"]:
	valve[item] = config["Valve"][item]
model["components"].append(valve)
connection = collections.OrderedDict()
connection["input"] = "Storage Tank"
connection["output"] = name
model["connections"].append(connection)
connection = collections.OrderedDict()
connection["input"] = name
connection["output"] = "Pipe1"
model["connections"].append(connection)
input = collections.OrderedDict()
input["component"] = name
input["variable"] = "position"
model["inputs"].append(input)

for num in range(1,config["numPipes"]+1):
	pipe = collections.OrderedDict()
	pipe["name"] = "Pipe" + str(num)
	for item in config["Pipe"]:
		pipe[item] = config["Pipe"][item]
	model["components"].append(pipe)
	
for num in range(1,config["numPipes"]):
	valve = collections.OrderedDict()
	name = "Valve_" + str(num) + "_" + str(num+1)
	valve["name"] = name
	for item in config["Valve"]:
		valve[item] = config["Valve"][item]
	model["components"].append(valve)	
	connection = collections.OrderedDict()
	connection["input"] = "Pipe" + str(num)
	connection["output"] = name
	model["connections"].append(connection)
	connection = collections.OrderedDict()
	connection["input"] = name
	connection["output"] = "Pipe" + str(num+1)	
	model["connections"].append(connection)


#last pipe to vehicle tank valve
valve = collections.OrderedDict()
name = "Valve_" + str(config["numPipes"]) + "_VT"
valve["name"] = name
for item in config["Valve"]:
	valve[item] = config["Valve"][item]
model["components"].append(valve)
connection = collections.OrderedDict()
connection["input"] = "Pipe" + str(config["numPipes"])
connection["output"] = name
model["connections"].append(connection)
connection = collections.OrderedDict()
connection["input"] = name
connection["output"] = "Vehicle Tank"
model["connections"].append(connection)
input = collections.OrderedDict()
input["component"] = name
input["variable"] = "position"
model["inputs"].append(input)



output_file_name = 'C:\\Users\\snarasim\\Documents\\svn\\dash\\physics\\AGSM\\models\\gas\\test.json'
with open( output_file_name, 'w') as json_file:
	json.dump(model, json_file, indent=4)

