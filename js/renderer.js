class CanvasRenderer {

    constructor(canvas, theme = {}) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.theme = {

            background: "#151515",

            glass: "rgba(255,255,255,0.08)",

            track: "rgba(255,255,255,0.12)",

            blue: "#3DA9FC",

            yellow: "#FFD60A",

            red: "#FF3B30",

            text: "#FFFFFF",

            shadow: "rgba(0,0,0,0.45)",

            ...theme

        };

        this.resize();

    }

    resize() {

        this.width = this.canvas.width;
        this.height = this.canvas.height;

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

    //----------------------------------------------------

    drawShadow() {

        const ctx = this.ctx;

        ctx.save();

        ctx.shadowColor = this.theme.shadow;
        ctx.shadowBlur = this.shadowBlur;

        ctx.beginPath();

        ctx.arc(
            this.cx,
            this.cy,
            this.radius + this.trackWidth * 0.6,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.theme.glass;

        ctx.fill();

        ctx.restore();

    }

    //----------------------------------------------------

    drawGlass() {

        const ctx = this.ctx;

        ctx.beginPath();

        ctx.arc(
            this.cx,
            this.cy,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.theme.glass;

        ctx.fill();

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

        ctx.strokeStyle = this.theme.track;

        ctx.lineWidth = this.trackWidth;

        ctx.stroke();

    }

    //----------------------------------------------------

    drawProgress(state) {

        if (state.progress <= 0.001)
            return;

        const ctx = this.ctx;

        const start = -Math.PI / 2;

        const end =
            start +
            Math.PI * 2 * state.progress;

        ctx.beginPath();

        ctx.arc(
            this.cx,
            this.cy,
            this.trackRadius,
            start,
            end
        );

        ctx.strokeStyle = state.color;

        ctx.lineWidth = this.trackWidth;

        ctx.lineCap = "round";

        ctx.shadowBlur = this.glowBlur;

        ctx.shadowColor = state.color;

        ctx.stroke();

        ctx.shadowBlur = 0;

    }

    //----------------------------------------------------

    drawText(state) {

        const ctx = this.ctx;

        const minutes =
            Math.floor(state.remaining / 60);

        const seconds =
            Math.ceil(state.remaining) % 60;

        ctx.fillStyle = this.theme.text;

        ctx.font =
            `700 ${this.fontSize}px Inter`;

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(

            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,

            this.cx,

            this.cy

        );

    }

    //----------------------------------------------------

    render(state, options = {}) {

        this.clear();

        this.drawShadow();

        this.drawGlass();

        this.drawTrack();

        this.drawProgress(state);

        this.drawText(state);

    }

}