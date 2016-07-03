import requests
import json
from BeautifulSoup import BeautifulSoup

months = {
    "all": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "thirty": ["January", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "thirty_one": ["January", "March", "May", "July", "August", "October", "December"]
    }

def makeUrl(state, city):
    url = "http://aa.usno.navy.mil/cgi-bin/aa_rstablew.pl?ID=AA&year=2016&task=0&state=" + state + " &place=" + city

    return url

def grabRawText(url):
    response = requests.get(url)
    html = response.content

    soup = BeautifulSoup(html)
    data = soup.findAll('pre')

    return str(data[0])


def convertTime(n,m):
    return 60 * int(n) + int(m)

def splitRiseSet(string):
    sp = string.split(" ")

    riseTime = convertTime(sp[0][:2], sp[0][2:])
    setTime = convertTime(sp[1][:2], sp[1][2:])

    return {
        "rise": riseTime,
        "set": setTime
        }


def dayEntry(day, val, month, index):
    monthLen = len(month)
    tempObj = splitRiseSet(val)

    tempObj['month'] = month[(index % monthLen)]
    tempObj['day'] = day

    return tempObj

def comp(a, b):
    m = months['all']

    if a['month'] == b['month']:
        return a['day'] - b['day']
    else:
        return m.index(a['month']) - m.index(b['month'])


def textToDict(raw):
    array = raw.split("\n")
    new = []

    for elmt in array:
        temp = elmt.split("  ")
        # Ignore rows that have words
        try:
            day = int(temp[0])
        except ValueError:
            continue

        timesInDay = temp[1:]

        if day > 29:
            # Format data entries
            filterSpace = filter(lambda x: x != "", timesInDay)
            longMonths = map(lambda x: x[1:] if x[0] == " " else x, filterSpace)

            for j in range(len(longMonths)):
                riseSetString = longMonths[j]

                if day == 30:
                    dayObj = dayEntry(day, riseSetString, months['thirty'], j)
                else:
                    dayObj = dayEntry(day, riseSetString, months['thirty_one'], j)

                new.append(dayObj)

        else:
            for k in range(len(timesInDay)):
                sunString = timesInDay[k]

                dayObj = dayEntry(day, sunString, months["all"], k)
                new.append(dayObj)

    new.sort(comp)

    return new


cities = ["Miami,FL",
"Tallahassee,FL",
"Savannah,GA",
"Atlanta,GA",
"Columbia,SC",
"Latta,SC",
"raleigh,NC",
"charlotte,NC",
"richmond,VA"]

cities_json = []

for c in cities:
    splt = c.split(",")
    city = splt[0].title()
    state = splt[1].upper()

    url = makeUrl(state, city)
    path = "../data/cities/" + city + state +".json"

    obj = {
    "city": city,
    "state": state,
    "url": url,
    "path": path
    }

    cities_json.append(obj)

    rawData = grabRawText(url)
    data = textToDict(rawData)

    with open(path, "w") as outfile:
        json.dump(data, outfile)


cities_path = "../data/cities/ALL.json"

with open(cities_path, "w") as out:
    json.dump(cities_json, out)
