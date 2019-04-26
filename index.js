var bleno = require('bleno');

var PizzaService = require('./zeroc-service');
var pizzaService = new PizzaService();

bleno.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        console.log('power!')
        //
        // We will also advertise the service ID in the advertising packet,
        // so it's easier to find.
        //
        bleno.startAdvertising("zeroc-1234", [pizzaService.uuid], function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    else {
        bleno.stopAdvertising();
    }
});

console.log('yeah')