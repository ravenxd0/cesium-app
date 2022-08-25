from skyfield.api import EarthSatellite,load, position_from_radec,wgs84
from requests import api

ts =load.timescale()

tle_lines = open("./tle-CATNR-44804.txt",'r').readlines()

satellite = EarthSatellite(name=tle_lines[0],line1=tle_lines[1],line2=tle_lines[2],ts=ts)
print('Epoch - ',satellite.epoch.utc_jpl())

lines = []

for i in range(1,4*60):

    t = ts.utc(2022,8,25,i,0,0)
    #print(t)

    geocentric = satellite.at(t)
    #print('Geocentric - ',geocentric.position.km)
    first_point = geocentric
    second_point = geocentric

    first_point.position.km[1] -= 5
    second_point.position.km[1] += 5

    #print('Vector - ',geocentric.velocity.km_per_s)

    lat,lon = wgs84.latlon_of(geocentric)
  #  print('Latitude',lat)
   # print('Longitude',lon)

    first_lat,first_lon = wgs84.latlon_of(first_point)
    second_lat,second_lon = wgs84.latlon_of(second_point)

    lines.append([ [first_lat,first_lon],[second_lat,second_lon]   ])
    #print(first_lat,first_lon)
    #print(second_lat,second_lat)


for l in lines:
    print(l)



