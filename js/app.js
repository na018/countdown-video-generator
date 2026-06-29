window.addEventListener("load", async () => {

    await document.fonts.ready;

    const canvas = document.getElementById("countdownCanvas");

    const audio = new AudioPlayer();

    const renderer = new CanvasRenderer(canvas);

    const timer = new CountdownTimer(renderer, audio);

    const secondsInput = document.getElementById("seconds");

    document.getElementById("start").onclick = async () => {

        await audio.init();

        // Only set the duration before the first start
        if (!timer.started) {
            timer.setDuration(Number(secondsInput.value));
        }

        timer.start();
    };

    document.getElementById("pause").onclick = () => {

        timer.pause();

    };

    document.getElementById("reset").onclick = () => {

        timer.reset();

    };

    canvas.onclick = async () => {

    await audio.init();

    if (timer.running)
        timer.pause();
    else {

        if (!timer.started)
            timer.setDuration(Number(secondsInput.value));

        timer.start();
    }

};

});