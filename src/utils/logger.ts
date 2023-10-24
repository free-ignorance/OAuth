import { createLogger, transports, format } from "winston";

// Create a logger instance
const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, metadata }) => {
          const meta = JSON.stringify(metadata) != "{}" ? JSON.stringify(metadata) : '';
          return `[${timestamp}] ${level}: ${message} ${meta}`;
        })
      ),
    }),
  ],
  format: format.combine(format.metadata(), format.timestamp()),
});

function fancyText(text: string, color: string) {
  const reset = "\x1b[0m";
  const colors = [
    {name: 'green', code: 32},
    {name: 'yellow', code: 33},
    {name: 'blue', code: 34},
    {name: 'magenta', code: 35},
  ];

  const colorCode = colors.find(c => c.name === color)|| {name: 'green', code: 32};

  return `\x1b[${colorCode.code}m${text}\x1b[0m`;  
}

export { logger, fancyText };