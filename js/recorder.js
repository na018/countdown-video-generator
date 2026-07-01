export class Recorder {

    constructor(canvas) {

        this.canvas = canvas;

        this.stream = null;
        this.recorder = null;

        this.chunks = [];

        this.recording = false;

    }

    start() {

        if (this.recording)
            return;

        this.recording = true;

        this.chunks = [];

        //----------------------------------------
        // Capture the canvas
        //----------------------------------------

        this.stream = this.canvas.captureStream(60);

        //----------------------------------------
        // Choose the best codec
        //----------------------------------------

        const mimeTypes = [

            "video/webm;codecs=vp9,opus",

            "video/webm;codecs=vp8,opus",

            "video/webm",

            ""

        ];

        let mimeType = "";

        for (const type of mimeTypes) {

            if (type === "" || MediaRecorder.isTypeSupported(type)) {

                mimeType = type;
                break;

            }

        }

        console.log("Using:", mimeType);

        //----------------------------------------
        // Recorder
        //----------------------------------------

        this.recorder = mimeType
            ? new MediaRecorder(this.stream, { mimeType })
            : new MediaRecorder(this.stream);

        this.recorder.ondataavailable = (event) => {

            if (event.data.size > 0)
                this.chunks.push(event.data);

        };

        this.recorder.start();

        console.log("Recording started");

    }

    stop() {

        if (!this.recording)
            return Promise.resolve(null);

        this.recording = false;

        return new Promise(resolve => {

            this.recorder.onstop = () => {

                console.log("Recording finished");

                const blob = new Blob(
                    this.chunks,
                    {
                        type: "video/webm"
                    }
                );

                resolve(blob);

            };

            this.recorder.stop();

        });

    }

}