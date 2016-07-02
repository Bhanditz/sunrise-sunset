import requests
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

def mapSpace(val):
    if val[0] == " ":
        return val[1:]
    else:
        return val

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
            longMonths = map(mapSpace, filterSpace)

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
    print new











url = makeUrl("FL", "miami")
data = grabRawText(url)

textToDict(data)
