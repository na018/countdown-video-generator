class CountdownTimer {

    constructor(audio) {

        this.audio = audio;

        this.duration = 10;
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
        this.onFinished = null;
        this.onUpdate = null;

        this.animate = this.animate.bind(this);


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
        if (this.onUpdate)
            this.onUpdate();

    }

    setDuration(seconds) {

        this.duration = seconds;
        this.remaining = seconds;

        this.warningTime = seconds / 2;

        if (this.onUpdate)
            this.onUpdate();

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

        if (this.onUpdate)
            this.onUpdate();



        if (this.remaining > 0) {

            requestAnimationFrame(this.animate);

        } else {

            this.running = false;
            this.started = false;

            if (this.onFinished) {
                this.onFinished();
            }

        }

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


    toggle() {

        if (this.running)
            this.pause();
        else
            this.start();

    }

    isFinished() {

        return this.remaining === 0;

    }

    getState() {

        const elapsed =
            this.duration - this.remaining;

        let progress;

        if (elapsed <= this.ringDelay) {

            progress = 1;

        } else {

            progress =
                1 -
                (elapsed - this.ringDelay) /
                (this.duration - this.ringDelay);

            progress = Math.max(0, progress);

        }

        let color = "#3DA9FC";

        if (this.remaining <= this.dangerTime)
            color = "#FF3B30";
        else if (this.remaining <= this.warningTime)
            color = "#FFD60A";

        return {

            duration: this.duration,

            remaining: this.remaining,

            elapsed,

            progress,

            color,

            running: this.running,

            finished: this.remaining <= 0

        };

    }


}