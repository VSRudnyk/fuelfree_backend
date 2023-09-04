const axios = require("axios");
const logger = require("../logger");

const { SLACK_BOT_TOKEN, SLACK_CHANNEL } = process.env;

async function sendMessageToSlack(message) {
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: SLACK_CHANNEL,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    console.log("Message sent to Slack:", response.data);
    logger.info("Message sent to Slack");
  } catch (err) {
    console.error("Error sending message to Slack:", err);
    logger.error("Error sending message to Slack");
  }
}

module.exports = { sendMessageToSlack };
