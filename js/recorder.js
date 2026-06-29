class Recorder {

    constructor(canvas) {

        this.canvas = canvas;

        this.stream = null;
        this.recorder = null;

        this.chunks = [];

    }

    start() {

        this.chunks = [];

        this.stream = this.canvas.captureStream(60);

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: "video/webm"
        });

        this.recorder.ondataavailable = (e) => {

            if (e.data.size > 0)
                this.chunks.push(e.data);

        };

        this.recorder.start();

        console.log("Recording started");

    }

    stop() {

        return new Promise(resolve => {

            this.recorder.onstop = () => {

                const blob = new Blob(
                    this.chunks,
                    { type: "video/webm" }
                );

                const url =
                    URL.createObjectURL(blob);

                const a =
                    document.createElement("a");

                a.href = url;
                a.download = "countdown.webm";

                a.click();

                URL.revokeObjectURL(url);

                console.log("Recording finished");

                resolve();

            };

            this.recorder.stop();

        });

    }

}