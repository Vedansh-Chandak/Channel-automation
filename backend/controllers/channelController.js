import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
try {
const {
name,
niche,
language
} = req.body;


const channel = await Channel.create({
  userId: req.user.userId,
  name,
  niche,
  language
});

return res.status(201).json({
  success: true,
  channel
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: error.message
});


}
};

export const getChannels = async (req, res) => {
try {
const channels = await Channel.find({
userId: req.user.userId
});


return res.status(200).json({
  success: true,
  count: channels.length,
  channels
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: error.message
});


}
};

export const getChannelById = async (req, res) => {
try {
const channel = await Channel.findOne({
_id: req.params.id,
userId: req.user.userId
});


if (!channel) {
  return res.status(404).json({
    success: false,
    message: "Channel not found"
  });
}

return res.status(200).json({
  success: true,
  channel
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: error.message
});


}
};

export const deleteChannel = async (req, res) => {
try {
const channel = await Channel.findOneAndDelete({
_id: req.params.id,
userId: req.user.userId
});


if (!channel) {
  return res.status(404).json({
    success: false,
    message: "Channel not found"
  });
}

return res.status(200).json({
  success: true,
  message: "Channel deleted"
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: error.message
});


}
};
