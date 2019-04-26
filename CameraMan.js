
var sys = require('sys')
const exec = util.promisify(require('child_process').exec);

const util = require('util');

class CameraMan {
    constructor() {
        console.log('CameraManconstructor')

        this.isRecording = false


    }

    onChange(callback){
        // setInterval(() => {
        //     callback(this.isRecording)
        //     this.isRecording = !this.isRecording
        // }, 1000)
    }

    async startRecording() {
        this.isRecording = true
        const name = Math.round( Math.random() * 10000 )
        const cmd = `raspivid -o ${name}.mp4 -t 10000`

        await exec(cmd);
        await exec(`~/dropbox_uploader.sh upload ${name}.mp4 /`)
        const { stdout, stderr } = await exec(`~/dropbox_uploader.sh share /${name}.mp4`)
        console.log('link: ', stdout);

    }
}

module.exports = CameraMan