import { type SQLiteDatabase } from "expo-sqlite";

export async function initDB(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    // 성능 최적화 코드
    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    // 목표 테이블
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS goals (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,                    -- 목표 제목
          end_date TEXT NOT NULL,                 -- 목표 완료일 (YYYY-MM-DD)
          parent_goal_id TEXT,                    -- 이어지는 이전 목표 ID (연관 목표 설정용)
          retrospective TEXT,                     -- 목표 달성 회고 내용
          is_completed INTEGER DEFAULT 0,         -- 목표 달성 여부 (0: 미완료, 1: 완료)
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_goal_id) REFERENCES goals (id) ON DELETE SET NULL
        );
    `);

    // 세부 계획 테이블
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        goal_id TEXT NOT NULL,                   -- 소속된 목표 ID
        title TEXT NOT NULL,                     -- 세부 계획 제목
        target_count INTEGER NOT NULL DEFAULT 1, -- 목표 완료 카운팅 총 횟수 (주 n회 계산 결과 포함)
        current_count INTEGER DEFAULT 0,         -- 현재까지 누적 완료 횟수
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
      );
    `);

    // 일일 완료 기록 테이블 (잔디 심기)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_logs (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,                          -- 소속된 세부 계획 ID
        log_date TEXT NOT NULL DEFAULT (date('now')),   -- 체크한 날짜 (YYYY-MM-DD)
        count_increment INTEGER DEFAULT 1,              -- 해당 날짜에 증가시킨 횟수
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE   
      );
    `);

    // 인덱스 추가 (조회 성능 향상)
    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_logs_date ON daily_logs(log_date);`,
    );
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
