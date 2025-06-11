import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db';

console.log('[MIGRATE_SCRIPT_START] Script migrate.ts is starting.');

// Получаем __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('[MIGRATE_SCRIPT_START_FUNC] runMigrations() called.');
  try {
    // Корректируем путь к папке миграций
    // __dirname для src/lib/migrate.ts будет /var/www/studio-app/src/lib
    // Нам нужна папка /var/www/studio-app/src/migrations
    const migrationsDir = path.resolve(__dirname, '../migrations');
    console.log(`[MIGRATE_SCRIPT_DEBUG] Looking for migrations in: ${migrationsDir}`);
    
    let files;
    try {
      files = await fs.readdir(migrationsDir);
      console.log(`[MIGRATE_SCRIPT_DEBUG] Files found in directory: ${files.join(', ') || 'No files found'}`);
    } catch (dirError) {
      console.error(`[MIGRATE_SCRIPT_ERROR] Failed to read migrations directory: ${migrationsDir}`, dirError);
      throw dirError; // Перевыбрасываем ошибку, чтобы она была поймана внешним catch
    }
    
    // Сортируем файлы миграций по имени
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`[MIGRATE_SCRIPT_DEBUG] SQL migration files to run: ${migrationFiles.join(', ') || 'None'}`);

    if (migrationFiles.length === 0) {
      console.log('[MIGRATE_SCRIPT_INFO] No SQL migration files found to execute.');
    }
    
    // Выполняем каждую миграцию по порядку
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`[MIGRATE_SCRIPT_DEBUG] Reading file: ${filePath}`);
      const sql = await fs.readFile(filePath, 'utf8');
      
      console.log(`[MIGRATE_SCRIPT_RUN] Running migration: ${file}`);
      // Используем sequelize.query вместо db.query, так как db - это объект с моделями и sequelize
      // db.query может не существовать в том виде, как ожидает старый код
      await db.sequelize.query(sql);
      console.log(`[MIGRATE_SCRIPT_SUCCESS] Successfully ran migration: ${file}`);
    }
    
    if (migrationFiles.length > 0) {
        console.log('[MIGRATE_SCRIPT_COMPLETE] All migrations completed successfully');
    }

  } catch (error) {
    console.error('[MIGRATE_SCRIPT_FAILED] Migration failed overall:', error);
    // Не выбрасываем ошибку дальше, чтобы увидеть лог, если скрипт завершается из-за нее
    // throw error; 
  }
}

// Вызываем функцию, чтобы скрипт действительно что-то делал при запуске через tsx
runMigrations()
  .then(() => {
    console.log('[MIGRATE_SCRIPT_EXIT] runMigrations finished.');
    // Принудительный выход, если это необходимо (например, если есть открытые хендлы БД)
    // process.exit(0);
  })
  .catch(err => {
    console.error('[MIGRATE_SCRIPT_UNHANDLED_ERROR] Unhandled error in runMigrations promise chain:', err);
    // process.exit(1);
  });