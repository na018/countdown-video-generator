class Recorder {

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

        this.stream = this.canvas.captureStream(60);

        this.recorder = new MediaRecorder(this.stream);

        this.recorder.ondataavailable = (e) => {

            if (e.data.size > 0)
                this.chunks.push(e.data);

        };

        this.recorder.start();

        console.log("Recording started");

    }

    stop() {

        if (!this.recording)
            return Promise.resolve();

        this.recording = false;

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

                document.body.appendChild(a);

                a.click();

                a.remove();

                URL.revokeObjectURL(url);

                console.log("Recording finished");

                resolve();

            };

            this.recorder.stop();

        });

    }

}