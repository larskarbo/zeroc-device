var util = require('util');
var bleno = require('bleno');

class CounterCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: '17283985372901293487120938478701',
            properties: ['read', 'write', 'notify'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: '1234',
                    value: 'Starts video (?)'
                })
            ]
        });

        this.cameraMan = CameraMan;
        this.counter = 0;


    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        console.log('writerequest')
        if (offset) {
            callback(this.RESULT_ATTR_NOT_LONG);
        }
        else if (data.length !== 1) {
            callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
        }
        else {
            var shouldRecord = data.readUInt8(0);
            console.log('shouldRecord: ', shouldRecord);
            this.cameraMan.startRecording()

            this.cameraMan.onChange((r) => {
                if (this.updateValueCallback) {
                    var data = new Buffer(1);
                    data.writeUInt8(r, 0);
                    this.updateValueCallback(data);
                }
            })


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
    }
    onReadRequest (offset, callback) {
        console.log('readrequest')
        console.log('offset: ', offset);
        if (offset) {
            callback(this.RESULT_ATTR_NOT_LONG, null);
        }
        else {
            var data = Buffer.alloc(1);
            data.writeUInt8(1, 0);
            console.log('data: ', data.toJSON(this.cameraMan.isRecording));
            callback(this.RESULT_SUCCESS, data);
        }
    }

    onSubscribe (maxValueSize, updateValueCallback) {
        console.log(`Counter subscribed, max value size is ${maxValueSize}`);
        this.updateValueCallback = updateValueCallback
    };
}


module.exports = SnakeCharacteristic;