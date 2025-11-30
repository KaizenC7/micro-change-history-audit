import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { newText } = req.body;

  const filePath = path.join(process.cwd(), "data", "versions.json");
  let versions = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : [];

  // previous text = latest version (if any)
  const previousText =
    versions.length > 0 ? versions[0].fullText : "";

  // Split into words
  const prevWords = previousText ? previousText.split(/\s+/) : [];
  const newWords = newText ? newText.split(/\s+/) : [];

  // Word diff
  const addedWords = newWords.filter((w) => !prevWords.includes(w));
  const removedWords = prevWords.filter((w) => !newWords.includes(w));

  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    addedWords,
    removedWords,
    oldLength: previousText.length,
    newLength: newText.length,
    fullText: newText
  };

  versions.unshift(entry);

  fs.writeFileSync(filePath, JSON.stringify(versions, null, 2), "utf8");

  return res.status(200).json(entry);
}