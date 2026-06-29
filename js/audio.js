class AudioPlayer {

    constructor() {

        this.ctx = null;

    }

    async init() {

        if (this.ctx)
            return;

        this.ctx = new AudioContext();

        if (this.ctx.state === "suspended")
            await this.ctx.resume();

    }

    beep(frequency, duration = 0.12) {

        if (!this.ctx)
            return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            this.ctx.currentTime + duration
        );

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);

    }

    three() {

        this.beep(700);

    }

    two() {

        this.beep(800);

    }

    one() {

        this.beep(900);

    }

    finish() {

        this.beep(1200, 0.25);

    }

}