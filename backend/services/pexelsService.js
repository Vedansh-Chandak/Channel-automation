import axios from "axios";
import fs from "fs";

export const downloadPexelsVideo = async (
query,
outputPath
) => {

const response = await axios.get(
"https://api.pexels.com/videos/search",
{
params: {
query,
per_page: 20,
orientation: "portrait"
},
headers: {
Authorization:
process.env.PEXELS_API_KEY
}
}
);

const videos =
response.data.videos || [];

if (!videos.length) {
throw new Error(
"No Pexels videos found"
);
}

const portraitVideos =
videos.filter(
video =>
video.width < video.height
);

const selectedVideo =
portraitVideos.length
? portraitVideos.sort(
(a, b) =>
(b.width * b.height) -
(a.width * a.height)
)[0]
: videos[0];

console.log(
"Selected Video:",
selectedVideo.width,
"x",
selectedVideo.height
);

const bestFile =
selectedVideo.video_files
.sort(
(a, b) =>
(b.width * b.height) -
(a.width * a.height)
)[0];

const videoUrl = bestFile.link;

console.log(
"Downloading:",
bestFile.width,
"x",
bestFile.height
);

const videoResponse =
await axios({
method: "GET",
url: videoUrl,
responseType: "stream"
});

const writer =
fs.createWriteStream(outputPath);

videoResponse.data.pipe(writer);

return new Promise(
(resolve, reject) => {
writer.on(
"finish",
resolve
);


  writer.on(
    "error",
    reject
  );
}


);
};
