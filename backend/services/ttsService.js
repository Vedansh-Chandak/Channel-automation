import { execFile } from "child_process";

export const generateVoice = (
text,
outputPath,
language = "english"
) => {

return new Promise(
(resolve, reject) => {


  const voice =
    language === "hindi"
      ? "hi-IN-MadhurNeural"
      : "en-US-EricNeural";

  execFile(
    "python3",
    ["-m", "edge_tts", "--voice", voice, "--text", text, "--write-media", outputPath],
    error => {

      if (error) {
        reject(error);
      } else {
        resolve(outputPath);
      }

    }
  );

}


);
};
