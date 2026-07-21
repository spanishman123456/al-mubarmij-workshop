#!/usr/bin/env node
/** Generate bcrypt hash for TEACHER_PASSWORD — print hash only, never commit password. */
import bcrypt from "bcryptjs";

const plain = process.env.TEACHER_PASSWORD;
if (!plain?.trim()) {
  console.error("Usage: TEACHER_PASSWORD='...' npm run hash:teacher-password");
  process.exit(1);
}
console.log(bcrypt.hashSync(plain.trim(), 10));
