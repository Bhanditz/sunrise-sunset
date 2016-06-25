var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


pageLoad = {

    loadString: function(state, place) {
        var url = "http://aa.usno.navy.mil/cgi-bin/aa_rstablew.pl?ID=AA&year=2016&task=0&state=" + state + " &place=" + place;

        request(url, function(error, response, body) {
            console.log("enter");

            if (!error) {
                var $ = cheerio.load(body);

                var data = $("pre").html();

                console.log(data);
                console.log(state, place);

            } else {
                console.log("ERROR: " + error);
            }
        });

    }
};

pageLoad.loadString("FL","miami");
