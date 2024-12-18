import SQLite from 'react-native-sqlite-storage';
import { ActionConfig } from '../types/action';
import { databaseService } from '../services/database';

export class ActionRepository {
  async createAction(action: ActionConfig): Promise<void> {
    const query = `
      INSERT INTO actions (id, name, type, triggerType, config, lastExecution)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      action.id,
      action.name,
      action.type,
      action.triggerType,
      JSON.stringify(action.config),
      action.lastExecution ? JSON.stringify(action.lastExecution) : null
    ];

    try {
      await databaseService.getDatabase()?.executeSql(query, params);
    } catch (error) {
      console.error('Error creating action:', error);
      throw error;
    }
  }

  async getAllActions(): Promise<ActionConfig[]> {
    const query = 'SELECT * FROM actions';
    try {
      const database = databaseService.getDatabase();
      if (!database) {
        throw new Error('Database not initialized');
      }
      const [results] = await database.executeSql(query);
      return this.mapResultsToActions(results);
    } catch (error) {
      console.error('Error getting actions:', error);
      throw error;
    }
  }

  async updateAction(action: ActionConfig): Promise<void> {
    const query = `
      UPDATE actions
      SET name = ?, type = ?, triggerType = ?, config = ?
      WHERE id = ?
    `;
    const params = [
      action.name,
      action.type,
      action.triggerType,
      JSON.stringify(action.config),
      action.id,
    ];

    try {
      await databaseService.getDatabase()?.executeSql(query, params);
    } catch (error) {
      console.error('Error updating action:', error);
      throw error;
    }
  }

  async deleteAction(id: string): Promise<void> {
    const query = 'DELETE FROM actions WHERE id = ?';
    try {
      await databaseService.getDatabase()?.executeSql(query, [id]);
    } catch (error) {
      console.error('Error deleting action:', error);
      throw error;
    }
  }

  private mapResultsToActions(results: SQLite.ResultSet): ActionConfig[] {
    const actions: ActionConfig[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      try {
        const row = results.rows.item(i);
        const config = typeof row.config === 'string' ? JSON.parse(row.config) : row.config;
        const lastExecution = row.lastExecution ? 
          (typeof row.lastExecution === 'string' ? JSON.parse(row.lastExecution) : row.lastExecution) 
          : undefined;

        actions.push({
          id: row.id,
          name: row.name,
          type: row.type as 'HTTP_REQUEST',
          triggerType: row.triggerType as 'SINGLE' | 'DOUBLE',
          config,
          lastExecution
        });
      } catch (error) {
        console.error('Error parsing action data:', error);
        // Skip invalid entries
        continue;
      }
    }
    return actions;
  }
}

export const actionRepository = new ActionRepository(); 