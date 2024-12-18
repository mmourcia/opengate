import SQLite from 'react-native-sqlite-storage';
import { ActionConfig } from '../types/action';
import { databaseService } from '../services/database';

export class ActionRepository {
  async createAction(action: ActionConfig): Promise<void> {
    const query = `
      INSERT INTO actions (id, name, url, method, headers, payload, authType, authToken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      action.id,
      action.name,
      action.url,
      action.method,
      JSON.stringify(action.headers),
      action.payload || null,
      action.authType,
      action.authToken || null,
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
      const [results] = await databaseService.getDatabase()?.executeSql(query) || [[]];
      return this.mapResultsToActions(results);
    } catch (error) {
      console.error('Error getting actions:', error);
      throw error;
    }
  }

  async updateAction(action: ActionConfig): Promise<void> {
    const query = `
      UPDATE actions
      SET name = ?, url = ?, method = ?, headers = ?, payload = ?, authType = ?, authToken = ?
      WHERE id = ?
    `;
    const params = [
      action.name,
      action.url,
      action.method,
      JSON.stringify(action.headers),
      action.payload || null,
      action.authType,
      action.authToken || null,
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
      const row = results.rows.item(i);
      actions.push({
        id: row.id,
        name: row.name,
        url: row.url,
        method: row.method as ActionConfig['method'],
        headers: JSON.parse(row.headers),
        payload: row.payload,
        authType: row.authType as ActionConfig['authType'],
        authToken: row.authToken,
      });
    }
    return actions;
  }
}

export const actionRepository = new ActionRepository(); 