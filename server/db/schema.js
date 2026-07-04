export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS onboarding_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  signature_text TEXT,
  signed_at TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(student_id, doc_type, version)
);

CREATE TABLE IF NOT EXISTS bingo_progress (
  student_id TEXT PRIMARY KEY,
  cells_json TEXT NOT NULL DEFAULT '{}',
  started_at TEXT,
  completed_at TEXT,
  submitted_at TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  section_id TEXT NOT NULL DEFAULT '',
  progress_json TEXT NOT NULL DEFAULT '{}',
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  UNIQUE(student_id, lesson_id, section_id)
);

CREATE TABLE IF NOT EXISTS lesson_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  answer TEXT,
  correct INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  error_type TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS student_progress (
  student_id TEXT PRIMARY KEY,
  progress_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_onboarding_student ON onboarding_records(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_attempts_student ON lesson_attempts(student_id);
`;
