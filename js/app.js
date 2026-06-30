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
    // Export canvas
    //--------------------------------------------------

    const exportCanvas = document.createElement("canvas");

    exportCanvas.width = 1080;
    exportCanvas.height = 1080;

    //--------------------------------------------------
    // Core components
    //--------------------------------------------------

    const audio = new AudioPlayer();

    const renderer = new CanvasRenderer(canvas);

    const exportRenderer =
        new CanvasRenderer(exportCanvas);

    const recorder = new Recorder(exportCanvas);

    const timer = new CountdownTimer(audio);

    //--------------------------------------------------
    // UI Elements
    //--------------------------------------------------

    const secondsInput = document.getElementById("seconds");

    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");
    const resetButton = document.getElementById("reset");
    const downloadButton = document.getElementById("download");

    //--------------------------------------------------
    // Rendering
    //--------------------------------------------------
    function resizeCanvas() {

        const size = Math.min(
            window.innerWidth * 0.9,
            650
        );

        canvas.width = size;
        canvas.height = size;

        renderer.resize(
            canvas.width,
            canvas.height
        );

        render();

    }

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    resizeCanvas();

    // Force one final render after everything
    requestAnimationFrame(() => {
        render();
    });

    function render() {
        console.log(
            canvas.width,
            canvas.height
        );

        const state =
            timer.getState();

        renderer.render(state);

        if (recorder.recording) {

            exportRenderer.render(
                state,
                {
                    greenScreen: true
                }
            );

        }

    }

    timer.onUpdate = render;

    render();

    //--------------------------------------------------
    // Helper Functions
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

        render();

    };

    canvas.onclick = async () => {

        await initializeAudio();

        prepareTimer();

        timer.toggle();

    };

    downloadButton.onclick = async () => {

        await initializeAudio();

        timer.reset();

        timer.setDuration(
            Number(secondsInput.value)
        );

        render();

        timer.onFinished = async () => {

            await recorder.stop();

            timer.onFinished = null;

        };


        // Draw the very first frame
        exportRenderer.render(
            timer.getState(),
            {
                greenScreen: true
            }
        );

        await new Promise(requestAnimationFrame);

        recorder.start();

        timer.start();
    };

});