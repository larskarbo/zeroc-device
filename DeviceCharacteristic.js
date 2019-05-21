var util = require('util');
var bleno = require('bleno');
var sleep = require("sleep-promise")
var util = require('util')
const exec = util.promisify(require('child_process').exec);

class SnakeCharacteristic extends bleno.Characteristic {
    constructor(CameraMan) {
        super({
            uuid: '17283985372901293487120938478702',
            properties: ['read', 'write', 'notify'],
            descriptors: [
                // new bleno.Descriptor({
                //     uuid: '1234',
                //     value: 'Starts video (?)'
                // })
            ]
        });

        this.cameraMan = CameraMan;
        this.counter = 0;


    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        // console.log('writerequest')
        // if (offset) {
        //     callback(this.RESULT_ATTR_NOT_LONG);
        // }
        // else if (data.length !== 1) {
        //     callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
        // }
        // else {
        //     var shouldRecord = data.readUInt8(0);
        //     console.log('shouldRecord: ', shouldRecord);
        //     if(shouldRecord){
        //         this.cameraMan.startRecording()
        //     } else {
        //         this.cameraMan.stopRecording()
        //     }


        //     callback(this.RESULT_SUCCESS);
        //     // case pizza.PizzaCrust.NORMAL:
        //     // case pizza.PizzaCrust.DEEP_DISH:
        //     // case pizza.PizzaCrust.THIN:
        //     // this.pizza.crust = crust;
        //     // break;
        //     //     default:
        //     // callback(this.RESULT_UNLIKELY_ERROR);
        //     // break;
        // }
    }
    onReadRequest (offset, callback) {
        console.log('readrequest')
        console.log('offset: ', offset);
        if (offset) {
            console.warn("OFFSET?")
            // callback(this.RESULT_ATTR_NOT_LONG, null);
            exec(`ifconfig`).then(({stdout}) => {
                const yeah = stdout.substr(offset)
                console.log('yeah: ', yeah);
                var data = new Buffer(yeah)
                // console.log('data: ', data.toJSON(this.cameraMan.isRecording));
                callback(this.RESULT_SUCCESS, data);
            })
        }
        else {
            exec(`ifconfig | grep "inet "`).then(({stdout}) => {
                console.log('stdout: ', stdout);
                var data = new Buffer(stdout)
                // console.log('data: ', data.toJSON(this.cameraMan.isRecording));
                callback(this.RESULT_SUCCESS, data);
            })
        }
    }

    onSubscribe (maxValueSize, updateValueCallback) {
        // console.log(`Counter subscribed, max value size is ${maxValueSize}`);
        // this.updateValueCallback = updateValueCallback

        // this.cameraMan.onVideoFinish((link) => {
        //     if (this.updateValueCallback) {
        //         var data = new Buffer(link);
        //         // data.writeUInt8(str, 0);
        //         this.updateValueCallback(data);
        //     }
        // })

    };
}


module.exports = SnakeCharacteristic;