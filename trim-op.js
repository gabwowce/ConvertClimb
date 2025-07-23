// trim-op.cjs
const fs = require("node:fs");

// argv: node trim-op.cjs <įvestis> <išvestis> [sekundės]
const [, , src, dest, secs = "3"] = process.argv;
if (!src || !dest)
  throw new Error("Usage: node trim-op.cjs <input> <output> [seconds]");

const data = JSON.parse(fs.readFileSync(src, "utf8"));
const frames = Math.round(data.fr * Number(secs));
data.op = data.ip + frames;

fs.writeFileSync(dest, JSON.stringify(data));
console.log(`✓ Trimmed to ${secs}s → op = ${data.op}`);
