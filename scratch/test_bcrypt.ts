import bcrypt from "bcryptjs";

async function run() {
  try {
    const hash = await bcrypt.hash("password123", 10);
    console.log("HASH:", hash);
    const ok = await bcrypt.compare("password123", hash);
    console.log("MATCH:", ok);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

run();
