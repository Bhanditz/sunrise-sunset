var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


dataLoad = {

    loadString: function(state, place, path) {
        // Inputs state and city, goes to the appropriate link,
        //    then outputs the page as a string.

        var global;
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
    }
};

dataLoad.loadString("FL", "miami", "../data/store.txt");
