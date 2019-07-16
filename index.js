var bleno = require('bleno');
const path = require('path');
const qs = require('qs');
var CameraMan = require("./CameraMan")
var cameraMan = new CameraMan()
var VideoService = require('./zeroc-service');
var videoService = new VideoService(cameraMan);
const axios = require('axios')
const { spawn } = require('child_process');
const FormData = require('form-data')
var util = require('util')
var fs = require('fs')
const exec = util.promisify(require('child_process').exec);
// const express = require('express')
const cors = require('cors')

var express        =        require("express");
var bodyParser     =        require("body-parser");
var app            =        express();
app.use(cors())
// const app = express()
const port = 3000
app.use(express.static('out'))
// var bodyParser = require('body-parser')
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/deleteallfiles", async function (req, res) {
    console.log('deleting all files')
    await exec("rm ~/gzero/out/*")
    res.send({ jsfdio: "jofsi" })
})

app.get("/truecoach", async function(req,res){
    console.log('req.query: ', req.query);
    const o = req.query
    // console.log('req.body.crop: ', req.body.crop);
    res.send({jsfdio:"jofsi"})
    const server = axios.create({
        baseURL: 'http://157.230.25.171:3000',
        headers: { 'X-Custom-Header': 'foobar' }
    })

    const pt = __dirname + '/out/' + req.query.name
    const form = new FormData()
    form.append('video123', fs.createReadStream(pt))
    console.log("uploading")
    server.post('/upload/' + req.query.exercise + "?" + qs.stringify(o), form, {
        headers: form.getHeaders(),
        maxContentLength: 5242889000
    })
        .then((res) => {
            console.log('Done :)')
        })
        .catch((error) => {
            console.log('Something went wrong :(')
            console.error(error)
        })

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

bleno.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        console.log('power!')
        //
        // We will also advertise the service ID in the advertising packet,
        // so it's easier to find.
        //
        bleno.startAdvertising("zeroc", [videoService.uuid], function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function (err) {
    if (!err) {
        console.log('advertising...');
        //
        // Once we are advertising, it's time to set up our services,
        // along with our characteristics.
        //
        bleno.setServices([
            videoService
        ]);
        // cameraMan.startRecording()
    }
});

bleno.on('advertisingStartError', error => {
    console.log('error :(')
    console.log('error: ', error);
})

bleno.on('accept', asdf => {
    console.log('accept: ', asdf);
});
bleno.on('servicesSet', asdf => {
    console.log('servicesSet: ', asdf);
});
bleno.on('servicesSetError', asdf => {
    console.log('servicesSetError: ', asdf);
});
bleno.on('disconnect', asdf => {
    console.log('disconnect: ', asdf);
});
bleno.on('rssiUpdate', asdf => {
    console.log('rssiUpdate: ', asdf);
});


console.log('yeah')