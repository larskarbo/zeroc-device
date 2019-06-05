
const puppeteer = require('puppeteer');
const args = require("args")
const fs = require("fs-extra");

args
    .option('video', 'Path to video file')
    .option('exercise', 'Which excercise? squat, press, bench or deadlift')


const { video, exercise } = args.parse(process.argv)

const exercises = {
    "squat": 0,
    "press": 1,
    "bench": 1,
    "deadlift": 2
}

const start = async () => {
    if (!await fs.pathExists(video)) {
        throw("Couldn't find video")
    }

    if (typeof exercises[exercise] == "undefined") {
        throw("please specify a exercise")
    }

    let exint;
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const endpoint = browser.wsEndpoint();
    // console.log('endpoint: ', endpoint);
    const page = await browser.newPage();
    await page.goto('https://ssonlinecoaching.truecoach.co/client/workouts', { waitUntil: 'networkidle2' });

    await page.$("input[type=email]").then(e => e.type("mail@larskarbo.no"))
    await page.$("input[type=password]").then(e => e.type(process.env.PASSWORD))
    await page.$("button[type=submit]").then(e => e.click())
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.$("div.bucket.cup").then(e => e.click())
    var yo = await page.$$("a.upload")
    await yo[exercises[exercise]].click()
    await page.$(".uploadcare--button_size_big")
        .then(e => e.click())
    await page.$("input[type=file]").then(e => e.uploadFile(video))

    // await browser.close();
}
    
    
start();

console.log('hey')

const yo = async () => {
    console.log('hey')
    const browser = await puppeteer.connect({ "browserWSEndpoint": "ws://127.0.0.1:54004/devtools/browser/a60dd2ba-efc6-4821-8be1-f3d7d1a10ff4" })
    const page = (await browser.pages())[0];
}

// yo()