import {
  getAuthUrl,
  oauth2Client
} from "../services/youtubeService.js";

export const connectYoutube = async (
  req,
  res
) => {

  const url = getAuthUrl();

  return res.json({
    success: true,
    url
  });

};

export const youtubeCallback =
  async (req, res) => {

    try {

      const { code } = req.query;

      const { tokens } =
        await oauth2Client.getToken(code);

      console.log(tokens);

      return res.json({
        success: true,
        tokens
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };