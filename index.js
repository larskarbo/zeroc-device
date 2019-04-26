var bleno = require('bleno');

var VideoService = require('./zeroc-service');
var videoService = new VideoService();

bleno.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        console.log('power!')
        //
        // We will also advertise the service ID in the advertising packet,
        // so it's easier to find.
        //
        bleno.startAdvertising("zeroc", [videoService.uuid], function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function (err) {
    if (!err) {
        console.log('advertising...');
        //
        // Once we are advertising, it's time to set up our services,
        // along with our characteristics.
        //
        bleno.setServices([
            pizzaService
        ]);
    }
});

console.log('yeah')