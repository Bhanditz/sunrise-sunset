import random, json

sunDataList = []

maxTimeInDay = 60*24-1

dummyCalendar = [
    {"month": "January", "days": 31},
    {"month": "February", "days": 28},
    {"month": "March", "days": 31}
]

for m in dummyCalendar:
    for day in range(m["days"]):
        sunrise = random.randrange(maxTimeInDay)
        sunset = random.randrange(sunrise,maxTimeInDay)
        temp = {"rise": sunrise, "set": sunset, "month": m["month"]}
        sunDataList.append(temp)

print sunDataList

with open('data.json', 'w') as f:
    json.dump(sunDataList, f)
