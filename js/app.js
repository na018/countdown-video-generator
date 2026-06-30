window.addEventListener("load", async () => {

    //--------------------------------------------------
    // Wait for fonts
    //--------------------------------------------------

    await document.fonts.ready;

    //--------------------------------------------------
    // Canvas
    //--------------------------------------------------

    const canvas = document.getElementById("countdownCanvas");

    //--------------------------------------------------
    // Core components
    //--------------------------------------------------

    const audio = new AudioPlayer();

    const renderer = new CanvasRenderer(canvas);

    const recorder = new Recorder(canvas);

    const timer = new CountdownTimer(renderer, audio);

    //--------------------------------------------------
    // UI Elements
    //--------------------------------------------------

    const secondsInput = document.getElementById("seconds");

    const startButton = document.getElementById("start");

    const pauseButton = document.getElementById("pause");

    const resetButton = document.getElementById("reset");

    const downloadButton = document.getElementById("download");

    //--------------------------------------------------
    // Helper functions
    //--------------------------------------------------

    async function initializeAudio() {

        await audio.init();

    }

    function prepareTimer() {

        if (!timer.started) {

            timer.setDuration(
                Number(secondsInput.value)
            );

        }

    }

    //--------------------------------------------------
    // Event Handlers
    //--------------------------------------------------

    startButton.onclick = async () => {

        await initializeAudio();

        prepareTimer();

        timer.start();

    };

    pauseButton.onclick = () => {

        timer.pause();

    };

    resetButton.onclick = () => {

        timer.reset();

    };

    canvas.onclick = async () => {

        await initializeAudio();

        if (!timer.started)
            prepareTimer();

        timer.toggle();

    };

    downloadButton.onclick = async () => {

        await initializeAudio();

        timer.reset();

        timer.setDuration(
            Number(secondsInput.value)
        );

        timer.onFinished = async () => {

            await recorder.stop();

            timer.onFinished = null;

        };

        recorder.start();

        timer.start();

    };

});