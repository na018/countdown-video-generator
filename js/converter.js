import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export class Converter {

    constructor() {

        this.ffmpeg = new FFmpeg();

        this.ffmpeg.on("log", ({ message }) => {

            console.log(message);

        });

        this.loaded = false;

    }

    async load() {

        if (this.loaded)
            return;

        await this.ffmpeg.load();

        this.loaded = true;

        console.log("FFmpeg loaded");

    }

    async webmToMp4(blob) {

        try {

            await this.load();

            console.log("Writing input...");

            await this.ffmpeg.writeFile(
                "input.webm",
                await fetchFile(blob)
            );

            console.log("Running FFmpeg...");

            await this.ffmpeg.exec([
                "-fflags",
                "+genpts",

                "-i",
                "input.webm",

                "-r",
                "30",

                "-crf",
                "28",

                "-c:v",
                "libx264",

                "-preset",
                "ultrafast",

                "-pix_fmt",
                "yuv420p",

                "-movflags",
                "+faststart",

                "output.mp4"
            ]);
            console.log("Encoding finished");

            console.log("Reading output...");

            const data =
                await this.ffmpeg.readFile(
                    "output.mp4"
                );
            console.log("MP4 read");
            console.log("Done");

            return new Blob([data], {
                type: "video/mp4"
            });

        } catch (e) {

            console.error(e);

        }

    }

}