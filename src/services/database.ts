import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: 'opengate.db',
        location: 'default',
      });
      this.database = db;
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  getDatabase(): SQLite.SQLiteDatabase | null {
    return this.database;
  }

  private async createTables(): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    const queries = [
      `CREATE TABLE IF NOT EXISTS actions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        triggerType TEXT NOT NULL,
        config TEXT NOT NULL,
        lastExecution TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS button_mappings (
        id TEXT PRIMARY KEY,
        buttonId TEXT NOT NULL,
        buttonName TEXT NOT NULL,
        characteristicUuid TEXT NOT NULL,
        pressType TEXT NOT NULL,
        actionId TEXT NOT NULL,
        actionName TEXT NOT NULL,
        FOREIGN KEY (actionId) REFERENCES actions (id) ON DELETE CASCADE
      );`
    ];

    for (const query of queries) {
      await this.database.executeSql(query);
    }
  }
}

export const databaseService = new DatabaseService(); 