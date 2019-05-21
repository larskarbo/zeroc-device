
var sys = require('sys')
var util = require('util')
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn
var sleep = require("sleep-promise")
var globby = require("globby")
var { DateTime } = require('luxon');
const path = require("path")

class CameraMan {
    constructor() {
        this.isRecording = false
        this.isStream = false

    }

    async startStream(cb) {
        try{
            await exec(`~/gzero/start_stream.sh`)
            cb({
                type:"streamstart"
            })
        } catch(e) {
            cb({
                type:"error",
                err:e
            })
        }
    }

    async stopStream(cb) {
        try{
            await exec(`killall mjpg_streamer`)
            cb({
                type:"streamstop"
            })
        } catch(e) {
            cb({
                type:"error",
                err:e
            })
        }
    }


    async startRecording(sendData) {
        if(this.isRecording){
            return 
        }
        this.isRecording = true
        
        const names = await globby('out/*.mp4');
        console.log('names: ', names);
        const namesnum = names.map(n => path.basename(n, path.extname(n)) * 1)
        console.log('namesnum: ', namesnum);
        const highestnum = namesnum.reduce((acc, curr) => curr > acc ? curr : acc, 0)
        const name = highestnum + 1
        
        this.recinfo = {
            name
        }


        console.log('recording')
        var child = spawn(`raspivid`, `-fps 30 -vf -hf -w 960 -h 720 -o out/${name}.h264 -t 99999999999`.split(" "));
        child.on('error', err => {
            console.log(`ERR is: ${err}`);
            sendData({
                type:"error",
                err
            })
        });

        sendData({
            type:"recstart",
        })
        // await sleep(4000)
        
    }

    async stopRecording(cb) {
        if(!this.isRecording){
            return
        }
        const { name } = this.recinfo
        const lpath = "out/" + name
        console.log('stopping recording')

        try{
            await exec("killall raspivid");
            cb({
                type:"recfinish"
            })
            console.log('making mp4...')

            cb({
                type:"status",
                text:"making mp4"
            })
            await exec(`MP4Box -fps 30 -add ${lpath}.h264 ${lpath}.mp4`)
            console.log('making thumbnail...')
            exec(`ffmpeg -i ${lpath}.mp4 -ss 1 -vframes 1 ${lpath}.jpg`)
        }catch(e){

            cb({
                type:"error",
                text:"making mp4"
            })
            console.error("error", e)
        }

        console.log('finished encoding')
        this.isRecording = false

        // await exec(`~/dropbox_uploader.sh upload ${lpath}.mp4 /`)

        // const { stdout, stderr } = await exec(`~/dropbox_uploader.sh share /${name}.mp4`)
        // console.log('link: ', stdout);
        cb({
            type:"videofinish",
            name: name + ".mp4",
            date: DateTime.local().toString(),
        })
    }
}

module.exports = CameraMan