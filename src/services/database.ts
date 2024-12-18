import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;

  public getDatabase(): SQLite.SQLiteDatabase | null {
    return this.database;
  }

  async initDatabase(): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: 'ActionDatabase.db',
        location: 'default',
      });
      this.database = db;
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const createActionTableQuery = `
      CREATE TABLE IF NOT EXISTS actions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        method TEXT NOT NULL,
        headers TEXT,
        payload TEXT,
        authType TEXT NOT NULL,
        authToken TEXT
      );
    `;

    try {
      await this.database?.executeSql(createActionTableQuery);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService(); 