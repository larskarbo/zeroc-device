
var util = require('util');
var bleno = require('bleno');

var VideoCharacteristic = require('./snake-characteristic');
// var PizzaToppingsCharacteristic = require('./pizza-toppings-characteristic');
// var PizzaBakeCharacteristic = require('./pizza-bake-characteristic');

function VideoService(CameraMan) {
    bleno.PrimaryService.call(this, {
        uuid: '17283985372901293487120938478700',
        characteristics: [
            new VideoCharacteristic(CameraMan),
        ]
    });
}

util.inherits(VideoService, bleno.PrimaryService);

module.exports = VideoService;