var util = require('util');
var bleno = require('bleno');

function SnakeCharacteristic(pizza) {
    bleno.Characteristic.call(this, {
        uuid: '17283985372901293487120938478701',
        properties: ['read', 'write'],
        descriptors: [
            new bleno.Descriptor({
                uuid: '1234',
                value: 'Starts video (?)'
            })
        ]
    });

    this.pizza = pizza;
}

util.inherits(SnakeCharacteristic, bleno.Characteristic);

SnakeCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    console.log('writerequest')
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        // var crust = data.readUInt8(0);
        callback(this.RESULT_SUCCESS);
        // case pizza.PizzaCrust.NORMAL:
        // case pizza.PizzaCrust.DEEP_DISH:
        // case pizza.PizzaCrust.THIN:
        // this.pizza.crust = crust;
        // break;
        //     default:
        // callback(this.RESULT_UNLIKELY_ERROR);
        // break;
    }
};

SnakeCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log('readrequest')
    console.log('offset: ', offset);
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG, null);
    }
    else {
        var data = new Buffer(1);
        data.writeUInt8("asdf", 0);
        callback(this.RESULT_SUCCESS, data);
    }
};

module.exports = SnakeCharacteristic;