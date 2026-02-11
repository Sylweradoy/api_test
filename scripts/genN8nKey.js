const crypto = require("crypto");

// 32 bytes = 256-bit secret (bardzo bezpieczne)
const key = crypto.randomBytes(32).toString("hex"); // 64 znaki hex

console.log(key);
// #lodowy