"use strict";
var page = require('webpage').create();

page.open('https://www.viajanet.com.br/busca/voos-resultados#/REC/LIS/RT/01-10-2017/10-10-2017/-/-/-/1/0/0/-/-/-/-', function(status) {
    switch (status) {
        case 'success':
            console.log('\nwebpage opened successfully\n');

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
                
                console.log('******************** bestPrices: ' + bestPrices);

                phantom.exit(0);
            }, 19000);

        break;
    case 'fail':
        console.error('webpage did not open successfully');
        phantom.exit(1);
        break;
    default:
        console.error('webpage opened with unknown status: ' + status);
        phantom.exit(1);
    }
});