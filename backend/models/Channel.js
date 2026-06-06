import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
{
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},


name: {
  type: String,
  required: true
},

description: String,

niche: {
  type: String,
  default: "general"
},

language: {
  type: String,
  enum: ["english", "hindi"],
  default: "english"
},

voiceProvider: {
  type: String,
  enum: ["edge", "elevenlabs", "human"],
  default: "elevenlabs"
},

voiceId: String,

youtubeChannelId: String,

youtubeAccessToken: String,

youtubeRefreshToken: String,

autoUpload: {
  type: Boolean,
  default: false
},

isActive: {
  type: Boolean,
  default: true
}


},
{
timestamps: true
}
);

export default mongoose.model("Channel", channelSchema);
