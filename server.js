"use strict";

var server = require('webserver').create();
var system = require('system');
var port = system.env.PORT || 8080;

var listening = server.listen(port, function (request, response) {
    if (request.post.target) {
        console.log("target=" + request.post.target);

        var page = require('webpage').create();
        page.open(request.post.target, function (status) {
            if (status === 'success') {

                setTimeout(function() {
                    var bestPrices = page.evaluate(function() {
                        var list = [];
                        var airlines = document.getElementsByClassName('list-best-val');
                        for(var i=0; i<airlines.length; i++) {
                            if (airlines[i] !== null) {
                                var resp = {};
                                resp.cia = airlines[i].getElementsByClassName('cia-logo')[0].innerText.trim();
                                var prices = airlines[i].getElementsByClassName('ng-binding ng-hide best-price');
                                var listPrices = [];
                                for(var j=0; j<prices.length; j++) {
                                    if (prices[j].innerText.trim().length > 0) {
                                        listPrices.push(prices[j].innerText.trim());
                                    }
                                }
                                if (listPrices.length > 0) {
                                    resp.prc = listPrices;
                                    list.push(resp);
                                }
                            }
                        }
                        return JSON.stringify(list);
                    });
            
                    console.log('prices: ' + bestPrices + '\n');

                    // we set the headers here
                    response.statusCode = 200;
                    response.headers = {"Cache":"no-cache", "Content-Type":"application/json"};
                    // now we write the body
                    response.write(bestPrices);
                    page.close();
                    response.close();
                }, 15000);

            } else {
                console.log('Erro ao carregar a URL ' + request.post.target);
                // we set the headers here
                response.statusCode = 200;
                response.headers = {"Cache":"no-cache", "Content-Type":"text/html"};
                response.write('<html><body>Erro ao consultar a URL ' + request.post.target + '</body></html>');
                page.close();
                response.close();
            }
        });
    } else {
        console.log('No target defined');
        response.statusCode = 200;
        response.write('<html><body>No target</body></html>');
        response.close();
    }
});

if (!listening) {
    console.log("could not create web server listening on port " + port);
    phantom.exit();
} else {
    console.log("listening on port " + port);
}