class CanvasRenderer {

    constructor(canvas, theme = {}) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.theme = {


            background: "#151515",

            glass: "rgba(255,255,255,.08)",

            track: "rgba(255,255,255,.08)",

            text: "#F7F7F7",

            shadow: "rgba(0,0,0,.55)",

            blue: "#3DA9FC",

            blueLight: "#6CC9FF",

            yellow: "#FFD60A",

            yellowLight: "#FFF27A",

            red: "#FF3B30",

            redLight: "#F9554D",

            ...theme

        };

        this.resize(
            canvas.width,
            canvas.height
        );

    }

    resize(width, height) {

        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;

        this.cx = this.width / 2;
        this.cy = this.height / 2;

        const size = Math.min(this.width, this.height);

        this.size = size;

        this.radius = size * 0.38;

        this.trackWidth = size * 0.04;

        this.trackRadius =
            this.radius - this.trackWidth;

        this.shadowBlur = size * 0.07;

        this.glowBlur = size * 0.025;

        this.fontSize = size * 0.16;

    }

    //----------------------------------------------------

    clear() {

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

    }

    drawBackground(options = {}) {

        const ctx = this.ctx;

        if (options.greenScreen) {

            ctx.fillStyle = "#00FF00";

        } else {

            ctx.fillStyle = this.theme.background;

        }

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

    }

    //----------------------------------------------------

    drawShadow() {

        const ctx = this.ctx;

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            this.cx,
            this.cy,
            this.radius + this.trackWidth,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.theme.glass;

        ctx.shadowColor = "rgba(0,0,0,0.55)";
        ctx.shadowBlur = this.size * 0.10;
        ctx.shadowOffsetY = this.size * 0.02;

        ctx.fill();

        ctx.restore();

    }

    //----------------------------------------------------

    drawGlass(settings = {}) {

        const ctx = this.ctx;

        //------------------------------------
        // Dark watch face
        //------------------------------------

        ctx.beginPath();

        ctx.arc(
            this.cx,
            this.cy,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#2A2A2A";

        ctx.fill();

        //------------------------------------
        // Glass gradient
        //------------------------------------

        const gradient = ctx.createRadialGradient(

            this.cx - this.radius * 0.25,
            this.cy - this.radius * 0.30,
            this.radius * 0.10,

            this.cx,
            this.cy,
            this.radius

        );

        gradient.addColorStop(0.0, "rgba(255,255,255,0.14)");
        gradient.addColorStop(0.4, "rgba(255,255,255,0.08)");
        gradient.addColorStop(1.0, "rgba(255,255,255,0.02)");

        ctx.beginPath();

        ctx.arc(
            this.cx,
            this.cy,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#2A2A2A";
        ctx.fill();

        ctx.fillStyle = gradient;
        ctx.fill();


        //----------------------------------------------------
        // glossy highlight
        //----------------------------------------------------

        // ctx.beginPath();

        // ctx.ellipse(

        //     this.cx,

        //     this.cy - this.radius * 0.45,

        //     this.radius * 0.55,

        //     this.radius * 0.18,

        //     0,

        //     0,

        //     Math.PI * 2

        // );

        // ctx.fillStyle = "rgba(255,255,255,.05)";

        // ctx.fill();

    }

    //----------------------------------------------------

    drawTrack() {

        const ctx = this.ctx;

        ctx.beginPath();

        ctx.arc(

            this.cx,

            this.cy,

            this.trackRadius,

            0,

            Math.PI * 2

        );

        ctx.strokeStyle = "rgba(255,255,255,0.08)";

        ctx.lineWidth = this.trackWidth;

        ctx.stroke();

    }

    //----------------------------------------------------

    drawProgress(state) {

        if (state.progress <= 0.001)
            return;

        const ctx = this.ctx;

        const start = -Math.PI / 2;

        const end = start + Math.PI * 2 * state.progress;

        //------------------------------------------
        // Gradient
        //------------------------------------------

        const gradient = ctx.createLinearGradient(

            this.cx - this.radius,

            this.cy - this.radius,

            this.cx + this.radius,

            this.cy + this.radius

        );

        if (state.color === this.theme.red) {

            // Light red → red
            gradient.addColorStop(0, this.theme.redLight);
            gradient.addColorStop(1, this.theme.red);
        } else {

            // Blue and yellow stay unchanged
            gradient.addColorStop(0, this.theme.blueLight);
            gradient.addColorStop(1, state.color);

        }

        //------------------------------------------

        ctx.beginPath();

        ctx.arc(

            this.cx,

            this.cy,

            this.trackRadius,

            start,

            end

        );

        ctx.strokeStyle = gradient;

        ctx.lineWidth = this.trackWidth;

        ctx.lineCap = "round";

        //------------------------------------------
        // Glow
        //------------------------------------------

        ctx.shadowColor = state.color;

        ctx.shadowBlur = this.glowBlur * 3;

        ctx.stroke();

        ctx.shadowBlur = 0;

    }
    //----------------------------------------------------

    drawText(state) {

        const ctx = this.ctx;

        const display =
            state.displayRemaining;

        const minutes =
            Math.floor(display / 60);

        const seconds =
            Math.ceil(display) % 60;

        ctx.fillStyle = this.theme.text;

        ctx.shadowColor = "rgba(255,255,255,.15)";
        ctx.shadowBlur = this.size * 0.01;

        ctx.font =
            `700 ${this.fontSize}px Inter`;

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(

            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,

            this.cx,

            this.cy

        );
        ctx.shadowBlur = 0;

    }

    //----------------------------------------------------

    render(state, options = {}) {


        const settings = {

            greenScreen: false,

            export: false,

            ...options

        };

        this.clear();

        this.drawBackground(options);

        this.drawShadow();

        this.drawGlass(settings);

        this.drawTrack();

        this.drawProgress(state);

        this.drawText(state);

    }

}