import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
{
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
},


channelId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Channel"
},

topic: {
  type: String,
  required: true
},

title: String,

hook: String,

englishScript: String,

hindiScript: String,

language: String,
seoTitle: String,
seoDescription: String,

tags: [String],

hashtags: [String],

keywords: [String],

// Voice
voiceProvider: {
  type: String,
  enum: ["edge", "elevenlabs", "human"],
  default: "elevenlabs"
},

voiceId: String,

englishVoicePath: String,

hindiVoicePath: String,

// Video Assets
videoPath: String,

renderedVideoPath: String,

thumbnail: String,

captionPath: String,

// Upload
youtubeVideoId: String,

youtubeUrl: String,

uploadedAt: Date,
seoScore: Number,
seoReason: String,
uploadStatus: {
  type: String,
  enum: [
    "pending",
    "uploading",
    "uploaded",
    "failed"
  ],
  default: "pending"
},


// Workflow
status: {
  type: String,
  enum: [
    "draft",
    "scripted",
    "voiced",
    "rendered",
    "uploaded",
    "failed"
  ],
  default: "draft"
},

errorMessage: String


},
{
timestamps: true
}
);

export default mongoose.model("Video", videoSchema);
