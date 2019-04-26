
var sys = require('sys')
var exec = require('child_process').exec;

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

    startRecording() {
        this.isRecording = true
        const name = Math.round( Math.random() * 10000 )
        const cmd = `raspivid -o ${name}.mp4 -t 10000`

        const child = exec(cmd, function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }
}

module.exports = CameraMan