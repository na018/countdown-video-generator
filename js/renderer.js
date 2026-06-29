class CanvasRenderer {

    constructor(canvas){

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        this.width = canvas.width;
        this.height = canvas.height;

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.radius = 190;

        this.font = "700 78px 'Inter'";
    }

    render(state){

        const ctx = this.ctx;

        ctx.clearRect(0,0,this.width,this.height);

        //------------------------------
        // shadow
        //------------------------------

        ctx.save();

        ctx.shadowColor = "rgba(0,0,0,.45)";
        ctx.shadowBlur = 35;

        ctx.beginPath();
        ctx.arc(
            this.centerX,
            this.centerY,
            this.radius+12,
            0,
            Math.PI*2
        );

        ctx.fillStyle = "rgba(255,255,255,.08)";
        ctx.fill();

        ctx.restore();

        //------------------------------
        // glass background
        //------------------------------

        ctx.beginPath();

        ctx.arc(
            this.centerX,
            this.centerY,
            this.radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle="rgba(255,255,255,.08)";
        ctx.fill();

        //------------------------------
        // track
        //------------------------------

        ctx.beginPath();

        ctx.arc(
            this.centerX,
            this.centerY,
            this.radius-18,
            0,
            Math.PI*2
        );

        ctx.strokeStyle="rgba(255,255,255,.12)";
        ctx.lineWidth=20;

        ctx.stroke();

        //------------------------------
        // progress
        //------------------------------

        // Progress ring
        if (state.progress > 0.001) {

            const start = -Math.PI / 2;
            const end = start + Math.PI * 2 * state.progress;

            ctx.beginPath();

            ctx.arc(
                this.centerX,
                this.centerY,
                this.radius - 18,
                start,
                end
            );

            ctx.strokeStyle = state.color;
            ctx.lineCap = "round";
            ctx.lineWidth = 20;

            ctx.shadowBlur = 12;
            ctx.shadowColor = state.color;

            ctx.stroke();

            ctx.shadowBlur = 0;
        }

        //------------------------------
        // text
        //------------------------------

        ctx.fillStyle="white";

        ctx.textAlign="center";
        ctx.textBaseline="middle";

        ctx.font=this.font;

        const minutes =
            Math.floor(state.remaining/60);

        const seconds =
            Math.ceil(state.remaining)%60;

        ctx.fillText(

            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`,

            this.centerX,

            this.centerY

        );

    }

}