var util = require('util');
var bleno = require('bleno');
var sleep = require("sleep-promise")
const exec = util.promisify(require('child_process').exec);
var path = require("path")
var globby = require("globby")
var { DateTime } = require("luxon")

class SnakeCharacteristic extends bleno.Characteristic {
    constructor(CameraMan) {
        super({
            uuid: '17283985372901293487120938478701',
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
        console.log('writerequest')
        if (offset) {
            callback(this.RESULT_ATTR_NOT_LONG);
        }
        else if (data.length !== 1) {
            callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
        }
        else {
            var command = data.readUInt8(0);
            console.log('command: ', command);

            if(command ==  1){
                this.cameraMan.startRecording((obj) => {
                    this.sendData(obj)
                })
            } else if(command == 0) {
                this.cameraMan.stopRecording((obj) => {
                    this.sendData(obj)
                })
            } else if(command == 2) {
                this.cameraMan.startStream((obj) => {
                    this.sendData(obj)
                })
            } else if(command == 3) {
                this.cameraMan.stopStream((obj) => {
                    this.sendData(obj)
                })
            }


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

    async onReadRequest (offset, callback) {
        console.log('readrequest')
        console.log('offset: ', offset);

        const paths = await globby('out/*.mp4');
        const fileinfo = paths.map(p => {
            // mediainfo --Inform="Video;%Duration%" out/May-03-04-24-15.mp4
            return {
                name: path.basename(p),
                // date: DateTime.local().toString()
            }
        })


        const str = JSON.stringify(fileinfo)

        // if (offset) {
        //     callback(this.RESULT_ATTR_NOT_LONG, null);
        // }
        // else {
            console.log('str: ', str);
            var data = new Buffer(str);
            callback(this.RESULT_SUCCESS, data.slice(offset));
        // }
    }

    sendData(obj) {
        if(typeof obj.type == "undefined"){
            throw "you need to specify type of the object you looser!"
        }
        if (this.updateValueCallback) {
            var data = new Buffer(JSON.stringify(obj));
            // data.writeUInt8(str, 0);
            this.updateValueCallback(data);
        }
    }

    onSubscribe (maxValueSize, updateValueCallback) {
        // console.log(`Counter subscribed, max value size is ${maxValueSize}`);
        this.updateValueCallback = updateValueCallback

    };
}


module.exports = SnakeCharacteristic;