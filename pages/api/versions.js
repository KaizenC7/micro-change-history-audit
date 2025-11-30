import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "versions.json");

  const versions = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : [];

  const formatted = versions.map((v) => ({
    id: v.id,
    timestamp: v.timestamp,
    addedWords: v.addedWords,
    removedWords: v.removedWords,
    oldLength: v.oldLength,
    newLength: v.newLength
  }));

  return res.status(200).json(formatted);
}