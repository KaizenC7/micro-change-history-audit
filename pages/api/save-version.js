import { Redis } from "@upstash/redis";
import { diffWords } from "../../utils/diff";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  // Get versions array
  let versions = await redis.get("versions");
  if (!versions) versions = [];

  const previousText = versions[0]?.text || "";
  const { addedWords, removedWords } = diffWords(previousText, text);

  const newVersion = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    text,
    oldLength: previousText.length,
    newLength: text.length,
    addedWords,
    removedWords,
  };

  const updated = [newVersion, ...versions];

  await redis.set("versions", updated);

  return res.status(200).json({ success: true, version: newVersion });
}
