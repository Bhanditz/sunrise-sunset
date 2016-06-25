var fs = require('fs');
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


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

        if (day < 29) {
            // Make a list that doesn't include the first entry, which is the day
            var timesInDay = temp.slice(1);

            // Loops through 12 entries and does something
            for (j in timesInDay) {
                // Takes the rise and set times, and creates an object with them
                var tempObj = splitRiseSet(timesInDay[j]);

                // Add some more attributes to each object
                tempObj.month = months[(j % 12)];
                tempObj.day = day;
                console.log(tempObj);

                // Adjoin object to master list
                sunTimes.push(tempObj);
            }
        }
    }
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