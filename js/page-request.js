/*
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
*/

dataLoad = {

    loadString: function(state, place, path) {
        // Inputs state and city, goes to the appropriate link,
        //    then outputs the page as a string.

        var url = "http://aa.usno.navy.mil/cgi-bin/aa_rstablew.pl?ID=AA&year=2016&task=0&state=" + state + " &place=" + place;

        request(url, function(error, response, body) {

            if (!error) {
                var $ = cheerio.load(body);

                // data is a string
                var data = $("pre").html();

                //  output = data;
                //  console.log(output);

            } else {
                console.log("ERROR: " + error);
            }

            // Write string to a text file
            fs.writeFile(path, data);
        });
    },

    updateForm: function(){

      var state = document.getElementById('state-input').value;
      var city = document.getElementById("city-input").value;

      console.log(state, city);
    }
};

var dataParse = {
    writeObject: function(inpath, outpath) {

        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month30 = ["January", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month31 = ["January", "March", "May", "July", "August", "October", "December"];

        var array = fs.readFileSync(inpath).toString().split("\n");

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
                            var dayObj = dataParse.makeDayEntry(day, riseSetString, month30);
                        } else {
                            var dayObj = dataParse.makeDayEntry(day, riseSetString, month31);
                        }

                        //console.log(dayObj);
                        sunTimes.push(dayObj);
                    }
                } else {
                    // Loops through 12 entries and does something
                    for (j in timesInDay) {
                        var riseSetString = timesInDay[j];

                        var dayObj = dataParse.makeDayEntry(day, riseSetString, months);

                        //console.log(dayObj);
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

        fs.writeFile(outpath, JSON.stringify(sunTimes, null, 4));
    },

    makeDayEntry: function(day, val, month_arr) {
        var monthLen = month_arr.length;
        var tempObj = dataParse.splitRiseSet(val);

        tempObj.month = month_arr[(j % monthLen)];
        tempObj.day = day;

        return tempObj;
    },

    splitRiseSet: function(str) {
        /*
         Input: string, "hhmm hhmm"
         Output: object {sunrise, sunset}
        */

        //    Splits to ["hhmm", "hhmm"]
        var splitList = str.split(" ");

        //    hhmm --> 60*hh + mm
        var riseTime = dataParse.convertTime(splitList[0].slice(0, 2), splitList[0].slice(2));
        var setTime = dataParse.convertTime(splitList[1].slice(0, 2), splitList[1].slice(2));

        return {
            rise: riseTime,
            set: setTime
        };
    },

    convertTime: function(n, m) {
        /*
          Input: two strings to be parsed into integers
          Output: integer, time of day
        */
        return 60 * parseInt(n) + parseInt(m);
    }

}

//dataLoad.loadString("NC", "brevard", "../data/store.txt");

//dataParse.writeObject("../data/store.txt", "../data/data.json");
