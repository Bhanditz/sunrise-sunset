var fs = require('fs');
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var month30 = ["January", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var month31 = ["January", "March", "May", "July", "August", "October", "December"];


var array = fs.readFileSync('miami.txt').toString().split("\n");

// List of objects
var sunTimes = [];

for (i in array) {

    temp = array[i].split("  ");

    // Only looks at rows that have numbers
    //    Skips rows without numbers
    if (isNaN(parseInt(temp[0])) === true) {
        continue;
    }
    // If a row has numbers, do something
    else {
        // Convert first entry into a number, which is the day of the month
        var day = parseInt(temp[0]);
        //console.log(temp);

        // Make a list that doesn't include the first entry, which is the day
        var timesInDay = temp.slice(1);

        if (day > 29) {
            var longMonths = timesInDay.filter(
                    function(value) {
                        return !(value === "");
                    })
                .map(function(value) {
                    if (value[0] === " ") {
                        return value.slice(1);
                    } else {
                        return value;
                    }
                });
            //console.log(longMonths);

            for (j in longMonths) {
                var riseSetString = longMonths[j]
                if (day === 30) {
                    var dayObj = makeDayEntry(day, riseSetString, month30);
                } else {
                    var dayObj = makeDayEntry(day, riseSetString, month31);
                }

                console.log(dayObj);
                sunTimes.push(dayObj);
            }
        } else {
            // Loops through 12 entries and does something
            for (j in timesInDay) {
                var riseSetString = timesInDay[j];

                var dayObj = makeDayEntry(day, riseSetString, months);

                console.log(dayObj);
                sunTimes.push(dayObj);

            }
        }
    }
}

sunTimes.sort(function(a,b){
  if (a.month == b.month) {
    return a.day - b.day;
  } else {
    return months.indexOf(a.month) - months.indexOf(b.month);
  }

});

fs.writeFile("data.json", JSON.stringify(sunTimes, null, 4));

function makeDayEntry(day, val, month_arr) {

    var monthLen = month_arr.length;
    var tempObj = splitRiseSet(val);

    tempObj.month = month_arr[(j % monthLen)];
    tempObj.day = day;

    return tempObj;

}

function splitRiseSet(str) {
    /*
     Input: string, "hhmm hhmm"
     Output: object {sunrise, sunset}
    */

    //    Splits to ["hhmm", "hhmm"]
    var splitList = str.split(" ");

    //    hhmm --> 60*hh + mm
    var riseTime = convertTime(splitList[0].slice(0, 2), splitList[0].slice(2));
    var setTime = convertTime(splitList[1].slice(0, 2), splitList[1].slice(2));

    return {
        rise: riseTime,
        set: setTime
    };
}

function convertTime(n, m) {
    /*
      Input: two strings to be parsed into integers
      Output: integer, time of day
    */
    return 60 * parseInt(n) + parseInt(m);
}
