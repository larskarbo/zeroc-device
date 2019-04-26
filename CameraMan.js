

class CameraMan {
    constructor() {
        console.log('CameraManconstructor')

        this.isRecording = false


    }

    onChange = (callback) => {
        setInterval(() => {
            callback(this.isRecording)
            this.isRecording = !this.isRecording
        }, 1000)
    }
}

module.exports = CameraMan