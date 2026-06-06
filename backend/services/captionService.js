export const generateSRT = (text, language = "english") => {

  const delimiter = language === "hindi" ? "।" : ".";
  const sentences =
    text.split(delimiter).filter(Boolean);

  let srt = "";

  let start = 0;

  sentences.forEach((sentence, index) => {

    const end = start + 4;

    srt += `${index + 1}\n`;
    srt += `${formatTime(start)} --> ${formatTime(end)}\n`;
    srt += `${sentence.trim()}\n\n`;

    start = end;

  });

  return srt;
};

function formatTime(seconds) {

  const hrs = String(
    Math.floor(seconds / 3600)
  ).padStart(2, "0");

  const mins = String(
    Math.floor((seconds % 3600) / 60)
  ).padStart(2, "0");

  const secs = String(
    Math.floor(seconds % 60)
  ).padStart(2, "0");

  return `${hrs}:${mins}:${secs},000`;

}