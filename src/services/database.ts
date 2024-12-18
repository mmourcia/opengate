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
        type TEXT NOT NULL,
        triggerType TEXT NOT NULL,
        config TEXT NOT NULL,
        lastExecution TEXT
      );
    `;

    try {
      await this.database?.executeSql(createActionTableQuery);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async deleteDatabase(): Promise<void> {
    try {
      if (this.database) {
        await this.database.close();
        this.database = null;
      }
      await SQLite.deleteDatabase({
        name: 'ActionDatabase.db',
        location: 'default'
      });
      console.log('Database deleted successfully');
    } catch (error) {
      console.error('Error deleting database:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService(); 