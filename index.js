var bleno = require('bleno');

var CameraMan = require("./CameraMan")
var cameraMan = new CameraMan()
var VideoService = require('./zeroc-service');
var videoService = new VideoService(cameraMan);

const express = require('express')
const app = express()
const port = 3000
app.use(express.static('out'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

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
            videoService
        ]);
        // cameraMan.startRecording()
    }
});

bleno.on('advertisingStartError', error => {
    console.log('error :(')
    console.log('error: ', error);
})

bleno.on('accept', asdf => {
    console.log('accept: ', asdf);
});
bleno.on('servicesSet', asdf => {
    console.log('servicesSet: ', asdf);
});
bleno.on('servicesSetError', asdf => {
    console.log('servicesSetError: ', asdf);
});
bleno.on('disconnect', asdf => {
    console.log('disconnect: ', asdf);
});
bleno.on('rssiUpdate', asdf => {
    console.log('rssiUpdate: ', asdf);
});


console.log('yeah')