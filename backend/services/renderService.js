import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const renderVideo = (
backgroundVideo,
audioFile,
subtitleFile,
outputFile
) => {

return new Promise((resolve, reject) => {

const backgroundVideoPath = path
  .resolve(backgroundVideo)
  .replace(/\\/g, "/");

const audioFilePath = path
  .resolve(audioFile)
  .replace(/\\/g, "/");

const resolvedOutputFile = path
  .resolve(outputFile)
  .replace(/\\/g, "/");

const outputDir = path.dirname(resolvedOutputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

ffmpeg()
  .input(backgroundVideoPath)
  .inputOptions(["-stream_loop", "-1"])
  .input(audioFilePath)

  .videoFilters([
    "scale=720:1280:force_original_aspect_ratio=increase",
    "crop=720:1280"
  ])

  .outputOptions([
    "-map 0:v:0",
    "-map 1:a:0",
    "-c:v libx264",
    "-c:a aac",
    "-b:a 192k",
    "-shortest",
    "-pix_fmt yuv420p"
  ])

  .on("start", command => {
    console.log("FFmpeg Command:", command);
  })

  .on("end", () => {
    console.log("Render completed");
    resolve(outputFile);
  })

  .on("error", err => {
    console.error(
      "FFmpeg Error:",
      err.message
    );
    reject(err);
  })

  .save(resolvedOutputFile);


});

};
