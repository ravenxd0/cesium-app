from satellite_czml import czml, satellite_czml

single_tle = [open("../tle-CATNR-44804.txt",'r').readlines()]

czml_string = satellite_czml(tle_list=single_tle).get_czml()
filename = f'{single_tle[0][0].strip()}.czml'

open(filename,'w').write(czml_string)
