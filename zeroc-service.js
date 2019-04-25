
var util = require('util');
var bleno = require('bleno');

var SnakeCharacteristic = require('./snake-characteristic');
// var PizzaToppingsCharacteristic = require('./pizza-toppings-characteristic');
// var PizzaBakeCharacteristic = require('./pizza-bake-characteristic');

function PizzaService() {
    bleno.PrimaryService.call(this, {
        uuid: '172839853729012934871209384787',
        characteristics: [
            new SnakeCharacteristic(),
        ]
    });
}

util.inherits(PizzaService, bleno.PrimaryService);

module.exports = PizzaService;