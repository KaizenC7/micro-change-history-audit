import { Redis } from "@upstash/redis";
import { diffWords } from "../../utils/diff";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    console.log("BODY:", req.body);

    const { text } = req.body;

    if (typeof text !== "string") {
      console.error("Invalid text:", text);
      return res.status(400).json({ error: "Invalid text field" });
    }

    let versions = await redis.get("versions");
    console.log("VERSIONS LOADED:", versions);

    if (!versions) versions = [];

    const previousText = versions[0]?.text || "";
    console.log("PREVIOUS TEXT:", previousText);

    const { addedWords, removedWords } = diffWords(previousText, text);
    console.log("DIFF:", addedWords, removedWords);

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

    console.log("UPDATED ARRAY:", updated);

    await redis.set("versions", updated);

    return res.status(200).json({ success: true, version: newVersion });

  } catch (err) {
    console.error("SAVE VERSION ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
