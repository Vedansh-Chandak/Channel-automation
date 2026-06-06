import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { google } from "googleapis";

console.log(
  "CLIENT_ID:",
  process.env.YOUTUBE_CLIENT_ID
);

console.log(
  "REDIRECT_URI:",
  process.env.YOUTUBE_REDIRECT_URI
);

export const oauth2Client =
  new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

oauth2Client.setCredentials({
  refresh_token:
    process.env.YOUTUBE_REFRESH_TOKEN
});

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.upload"
    ]
  });
};

export const uploadVideo = async (
  videoPath,
  title,
  description,
  tags = []
) => {

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client
  });

  const response =
    await youtube.videos.insert({
      part: [
        "snippet",
        "status"
      ],

      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "22"
        },

        status: {
          privacyStatus: "public"
        }
      },

      media: {
        body: fs.createReadStream(
          videoPath
        )
      }
    });

  return response.data;
};