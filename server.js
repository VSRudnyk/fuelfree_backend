const logger = require("./logger");
const mongoose = require("mongoose");

const app = require("./app");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT = 3000,
  MONGO_DB,
} = process.env;

mongoose.set("strictQuery", true);

const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => {
    app.listen(MONGO_PORT, async () => {
      logger.info(`MongoDB is connected. API is on port: ${MONGO_PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error.message);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
  req.log.info("Not found");
});
