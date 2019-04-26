class CounterCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: "17283985372901293487120938478701",
            properties: ["notify"],
            value: null
        });

        this.counter = 0;
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        console.log(`Counter subscribed, max value size is ${maxValueSize}`);
        this.updateValueCallback = updateValueCallback;
    }

    onUnsubscribe() {
        console.log("Counter unsubscribed");
        this.updateValueCallback = null;
    }

    sendNotification(value) {
        if (this.updateValueCallback) {
            console.log(`Sending notification with value ${value}`);

            const notificationBytes = new Buffer(2);
            notificationBytes.writeInt16LE(value);

            this.updateValueCallback(notificationBytes);
        }
    }

    start() {
        console.log("Starting counter");
        this.handle = setInterval(() => {
            this.counter = (this.counter + 1) % 0xFFFF;
            this.sendNotification(this.counter);
        }, 1000);
    }

    stop() {
        console.log("Stopping counter");
        clearInterval(this.handle);
        this.handle = null;
    }
}