import winston from "winston";

export const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({ level: "info" }),
		new winston.transports.File({ filename: "Platyborg.log", level: "silly" }),
		new winston.transports.File({ filename: "Platyborg.error.log", level: "warn", })
	],
	format: winston.format.printf(log => {
		const date = new Date();
		return `[${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() - 2000} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${log.level.toUpperCase()}] ${log.message}`
	})
});