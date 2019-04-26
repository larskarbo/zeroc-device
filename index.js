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

console.log('yeah')