
var util = require('util');
var bleno = require('bleno');

var SnakeCharacteristic = require('./snake-characteristic');
// var PizzaToppingsCharacteristic = require('./pizza-toppings-characteristic');
// var PizzaBakeCharacteristic = require('./pizza-bake-characteristic');

function PizzaService() {
    bleno.PrimaryService.call(this, {
        uuid: '17283985372901293487120938478700',
        characteristics: [
            new SnakeCharacteristic(),
        ]
    });
}

util.inherits(PizzaService, bleno.PrimaryService);

module.exports = PizzaService;