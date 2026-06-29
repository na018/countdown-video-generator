class CountdownTimer {

    constructor(renderer, audio) {

        this.renderer = renderer;
        this.audio = audio;

        this.duration = 30;
        this.remaining = this.duration;

        this.running = false;

        this.startTime = 0;
        this.pauseTime = 0;
        this.started = false;

        // Ring starts moving 0.5 seconds later
        this.ringDelay = 0.5;
        this.warningTime = null; // half duration
        this.dangerTime = 3;
        this.lastWholeSecond = null;

        this.animate = this.animate.bind(this);

        this.render();
    }

    //------------------------------------------
    // Public API
    //------------------------------------------

    start() {

        if (this.running)
            return;

        if (!this.started) {
            this.remaining = this.duration;
            this.started = true;
    }

        this.running = true;

        this.startTime =
            performance.now() -
            (this.duration - this.remaining) * 1000;

        requestAnimationFrame(this.animate);
    }

    pause() {

        this.running = false;
    }

    reset() {
        this.started = false;
        this.running = false;

        this.remaining = this.duration;

        this.render();
    }

    setDuration(seconds) {

        this.duration = seconds;
        this.remaining = seconds;

        this.warningTime = seconds / 2;

        this.render();
    }

    //------------------------------------------
    // Animation Loop
    //------------------------------------------

    animate(timestamp) {

        if (!this.running)
            return;

        const elapsed =
            (timestamp - this.startTime) / 1000;

        this.remaining =
            Math.max(
                this.duration - elapsed,
                0
            );

        this.render();

        if (this.remaining > 0)
            requestAnimationFrame(this.animate);
        else
            this.running = false;

        const wholeSecond = Math.ceil(this.remaining);

        if (wholeSecond !== this.lastWholeSecond) {

            this.lastWholeSecond = wholeSecond;

            switch (wholeSecond) {

                case 3:
                    this.audio.three();
                    break;

                case 2:
                    this.audio.two();
                    break;

                case 1:
                    this.audio.one();
                    break;

                case 0:
                    this.audio.finish();
                    break;

            }

        }
    }

    //------------------------------------------
    // Rendering State
    //------------------------------------------

    render() {

        // -----------------------------
        // Ring Progress
        // -----------------------------

        const elapsed = this.duration - this.remaining;

        let progress;

        if (elapsed <= this.ringDelay) {
            progress = 1;
        } else {

            progress =
                1 - (elapsed - this.ringDelay) /
                    (this.duration - this.ringDelay);

            progress = Math.max(0, progress);
        }

        // -----------------------------
        // Ring Color
        // -----------------------------

        let color = "#3DA9FC";

       if (this.remaining <= this.dangerTime)
            color = "#ff3b30";
        else if (this.remaining <= this.warningTime)
            color = "#FFD60A";

        this.renderer.render({

            remaining: this.remaining,

            progress,

            color

        });

    }

}