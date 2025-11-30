import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { diffWords } from "../../diff.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing version id" });
  }

  const filePath = path.join(process.cwd(), "data", "versions.json");

  let versions = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : [];

  const selected = versions.find((v) => v.id === id);
  if (!selected) {
    return res.status(404).json({ error: "Version not found" });
  }

  // current latest text
  const currentText = versions.length > 0 ? versions[0].fullText : "";

  // text to restore
  const restoreText = selected.fullText;

  // use your diff algorithm
  const { addedWords, removedWords } = diffWords(currentText, restoreText);

  // create history entry
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    addedWords,
    removedWords,
    oldLength: currentText.length,
    newLength: restoreText.length,
    fullText: restoreText
  };

  // latest on top
  versions.unshift(entry);

  fs.writeFileSync(filePath, JSON.stringify(versions, null, 2), "utf8");

  return res.status(200).json(entry);
}
