const pino = require("pino");
require("dotenv").config();

const { PINO_LOG_LEVEL } = process.env;

const fileTransport = pino.transport({
  targets: [
    {
      target: "pino/file",

      options: {
        destination: `app.log`,
        mkdir: true,
      },
    },
    {
      target: "pino/file", // по-умолчанию логирует в стандартный вывод
    },
    {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        ignore: "pid, hostname",
        levelFirst: true,
      },
    },
  ],
});

module.exports = pino(
  {
    level: PINO_LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        "name",
        "email",
        "phone",
        "user.name",
        "user.email",
        "user.phone",
        "*.user.name", // * — шаблон с уровнем вложенности 1
        "*.user.email",
        "*.user.phone",
      ],
      censor: "[PERSONAL_DATA]",
      remove: true,
    },
  },
  fileTransport
);
