import Josh from "@joshdb/core"; // @ts-expect-error 7016
import provider from "@joshdb/sqlite";
import path from "path";
import { TruthOrDare, Question } from "../index.js";

// Allows me to call Truth or Dare databases/functions later in other files.
export const truthOrDare: TruthOrDare = {

	db: new Josh<Question>({
		name: "truthOrDare",
		provider,
		providerOptions: {
			dataDir: path.join(process.cwd(), "data", "truthOrDare")
		}
	}),

	async addQuestion(type: "NHIE"|"P"|"T"|"D"|"WYR", question: string): Promise<boolean> {
		if ((await this.db.find((Q: Question) => Q.question === question))) return false;

		const id = await this.db.autoId();
		await this.db.set(id, { id, type, question } as Question);
		return true;
	},

	async getByID<T>(id: string): Promise<T|false> {
		return (await this.db.get(`${id}`) ?? false);
	},

	async getRandom(): Promise<Question> {
		const questions = await this.db.keys;
		return this.db.get(questions[Math.floor(Math.random() * questions.length)]);
	},

	async getRandomByType<T>(type: "NHIE"|"P"|"T"|"TD"|"D"|"WYR"): Promise<T> {
		if (type === "TD") type = ["T", "D"][Math.floor(Math.random() * 2)] as "T"|"D";
		const questions: [string, T][] = await this.db.filter((q: Question) => q.type === type) as unknown as [string, T][];
		return questions[Math.floor(Math.random() * questions.length)][1];
	}
};