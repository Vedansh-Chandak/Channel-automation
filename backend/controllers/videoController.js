import Video from "../models/Video.js";
import { generateScript } from "../services/geminiService.js";
import path from "path";
import fs from "fs";
import { generateVoice } from "../services/ttsService.js";
import { renderVideo } from "../services/renderService.js";
import { downloadPexelsVideo } from "../services/pexelsService.js";
import { generateSEO } from "../services/seoService.js";
import { generateSRT } from "../services/captionService.js";
import { uploadVideo }
from "../services/youtubeService.js";

export const createVideo = async (req, res) => {
try {
const {
topic,
language,
channelId
} = req.body;


if (!topic || !language || !channelId) {
  return res.status(400).json({
    success: false,
    message: "Topic, language and channelId are required"
  });
}

const video = await Video.create({
  userId: req.user.userId,
  channelId,
  topic,
  language
});

return res.status(201).json({
  success: true,
  message: "Video created successfully",
  video
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: "Server Error"
});


}
};


export const generateVideoScript = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }
   

    const aiData = await generateScript(video.topic);

    video.title = aiData.title;
    video.hook = aiData.hook;
    video.englishScript = aiData.englishScript;
    video.hindiScript = aiData.hindiScript;
    video.status = "scripted";

    await video.save();

    return res.status(200).json({
      success: true,
      message: "Script generated successfully",
      video
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const generateVoiceOver = async (req, res) => {
try {
const { id } = req.params;


const video = await Video.findById(id);

if (!video) {
  return res.status(404).json({
    success: false,
    message: "Video not found"
  });
}

const script =
  video.language === "hindi"
    ? video.hindiScript
    : video.englishScript;
 
    console.log("Language:", video.language);
console.log(
  "Selected Script:",
  script.substring(0, 100)
);
console.log("Language:", video.language);

if (!script) {
  return res.status(400).json({
    success: false,
    message: "Generate script first"
  });
}

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("uploads/audio")) {
  fs.mkdirSync("uploads/audio", {
    recursive: true
  });
}

const audioPath =
  `uploads/audio/${video._id}.mp3`;

await generateVoice(
  script,
  audioPath,
  video.language
);

if (video.language === "hindi") {
  video.hindiVoicePath = audioPath;
} else {
  video.englishVoicePath = audioPath;
}
video.status = "voiced";

await video.save();

return res.status(200).json({
  success: true,
  message: "Voice generated successfully",
  audioPath
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: error.message
});


}
};



export const getVideos = async (req, res) => {
try {
const videos = await Video.find({
userId: req.user.userId
})
.populate("channelId")
.sort({ createdAt: -1 });


return res.status(200).json({
  success: true,
  count: videos.length,
  videos
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: "Server Error"
});


}
};

export const renderVideoFile = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    if (!video.englishVoicePath && !video.hindiVoicePath) {
      return res.status(400).json({
        success: false,
        message: "Generate voice first"
      });
    }

    // Select correct voice path and script based on language
    const voicePath = video.language === "hindi" 
      ? video.hindiVoicePath 
      : video.englishVoicePath;
    
    const script = video.language === "hindi"
      ? video.hindiScript
      : video.englishScript;

    // Create folders
    if (!fs.existsSync("uploads/videos")) {
      fs.mkdirSync("uploads/videos", {
        recursive: true
      });
    }

    if (!fs.existsSync("uploads/rendered")) {
      fs.mkdirSync("uploads/rendered", {
        recursive: true
      });
    }

    if (!fs.existsSync("uploads/captions")) {
      fs.mkdirSync("uploads/captions", {
        recursive: true
      });
    }

    // Download Pexels video
    const downloadedVideo =
      `uploads/videos/${video._id}.mp4`;

    console.log(
      "Downloading Pexels video for:",
      video.topic
    );

    await downloadPexelsVideo(
      video.topic,
      downloadedVideo
    );

    // Generate captions
    const srtPath =
      `uploads/captions/${video._id}.srt`;

    const srtContent =
      generateSRT(script, video.language);

    fs.writeFileSync(
      srtPath,
      srtContent
    );

    // Render final video
    const outputFile =
      `uploads/rendered/${video._id}-captions.mp4`;

    await renderVideo(
      downloadedVideo,
      voicePath,
      srtPath,
      outputFile
    );

    // Save paths
    video.videoPath = downloadedVideo;
    video.captionPath = srtPath;
    video.renderedVideoPath = outputFile;
    video.status = "rendered";

    await video.save();

    return res.status(200).json({
      success: true,
      message: "Video rendered successfully",
      outputFile,
      captionPath: srtPath
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const testPexels = async (req, res) => {
  try {
    const topic = req.query.q || "nature";

    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    if (!fs.existsSync("uploads/videos")) {
      fs.mkdirSync("uploads/videos", { recursive: true });
    }

    const dest = `uploads/videos/test-${Date.now()}.mp4`;

    await downloadPexelsVideo(topic, dest);

    return res.status(200).json({
      success: true,
      message: "Pexels video downloaded",
      path: dest
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const generateVideoSEO = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    if (!video.englishScript && !video.hindiScript) {
      return res.status(400).json({
        success: false,
        message: "Generate script first"
      });
    }

    const script = video.language === "hindi"
      ? video.hindiScript
      : video.englishScript;

    const seoData = await generateSEO(
      video.topic,
      script
    );

    video.seoTitle = seoData.seoTitle;
    video.seoDescription =
      seoData.seoDescription;

    video.tags = seoData.tags;
    video.hashtags = seoData.hashtags;
    video.keywords = seoData.keywords;

    video.seoScore = seoData.seoScore;
    video.seoReason = seoData.seoReason;

    await video.save();

    return res.status(200).json({
      success: true,
      message: "SEO generated successfully",
      seo: seoData
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const uploadToYoutube =
  async (req, res) => {

    try {

      const { id } = req.params;

      const video =
        await Video.findById(id);

      if (!video) {
        return res.status(404).json({
          success: false,
          message: "Video not found"
        });
      }

      if (!video.renderedVideoPath) {
        return res.status(400).json({
          success: false,
          message:
            "Render video first"
        });
      }

      const uploaded =
        await uploadVideo(
          video.renderedVideoPath,
          video.seoTitle ||
            video.title,
          video.seoDescription ||
            "",
          video.tags || []
        );

      video.youtubeVideoId =
        uploaded.id;

      video.youtubeUrl =
        `https://youtube.com/watch?v=${uploaded.id}`;

      video.uploadStatus =
        "uploaded";

      video.uploadedAt =
        new Date();

      await video.save();

      return res.json({
        success: true,
        youtubeUrl:
          video.youtubeUrl
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };


  export const autoGenerateVideo = async (
req,
res
) => {
try {
const { id } = req.params;


const video = await Video.findById(id);

if (!video) {
  return res.status(404).json({
    success: false,
    message: "Video not found"
  });
}

// 1. Generate Script
const aiData = await generateScript(
  video.topic
);

video.title = aiData.title;
video.hook = aiData.hook;
video.englishScript =
  aiData.englishScript;
video.hindiScript =
  aiData.hindiScript;

await video.save();

// Select script based on language
const script =
  video.language === "hindi"
    ? video.hindiScript
    : video.englishScript;

// 2. Generate SEO
const seoData = await generateSEO(
  video.topic,
  script
);

video.seoTitle =
  seoData.seoTitle;

video.seoDescription =
  seoData.seoDescription;

video.tags =
  seoData.tags;

video.hashtags =
  seoData.hashtags;

video.keywords =
  seoData.keywords;

video.seoScore =
  seoData.seoScore;

await video.save();

// 3. Generate Voice
const audioPath =
  `uploads/audio/${video._id}.mp3`;

await generateVoice(
  script,
  audioPath,
  video.language
);

if (video.language === "hindi") {
  video.hindiVoicePath = audioPath;
} else {
  video.englishVoicePath = audioPath;
}

video.status =
  "voiced";

await video.save();

//4. Download Background Video
const downloadedVideo =
  `uploads/videos/${video._id}.mp4`;

await downloadPexelsVideo(
  video.topic,
  downloadedVideo
);

// Generate Captions
const captionPath =
  `uploads/captions/${video._id}.srt`;

fs.writeFileSync(
  captionPath,
  generateSRT(script, video.language)
);

// Render Final Video
const outputFile =
  `uploads/rendered/${video._id}-captions.mp4`;

await renderVideo(
  downloadedVideo,
  audioPath,
  captionPath,
  outputFile
);

video.videoPath =
  downloadedVideo;

video.captionPath =
  captionPath;

video.renderedVideoPath =
  outputFile;

video.status =
  "rendered";

await video.save();

// 5. Upload to YouTube
const uploaded =
  await uploadVideo(
    outputFile,
    video.seoTitle ||
      video.title,
    video.seoDescription ||
      "",
    video.tags || []
  );

video.youtubeVideoId =
  uploaded.id;

video.youtubeUrl =
  `https://youtube.com/watch?v=${uploaded.id}`;

video.uploadStatus =
  "uploaded";

video.status =
  "uploaded";

video.uploadedAt =
  new Date();

await video.save();

return res.status(200).json({
  success: true,
  youtubeUrl:
    video.youtubeUrl,
  video
});


} catch (error) {


console.error(error);

return res.status(500).json({
  success: false,
  message: error.message
});


}
};
