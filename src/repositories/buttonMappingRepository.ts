import { ButtonMapping } from '../types/buttonMapping';
import { databaseService } from '../services/database';

class ButtonMappingRepository {
  async createMapping(mapping: ButtonMapping): Promise<void> {
    const query = `
      INSERT INTO button_mappings (
        id, buttonId, buttonName, characteristicUuid, 
        pressType, actionId, actionName
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      mapping.id,
      mapping.buttonId,
      mapping.buttonName,
      mapping.characteristicUuid,
      mapping.pressType,
      mapping.actionId,
      mapping.actionName
    ];

    try {
      await databaseService.getDatabase()?.executeSql(query, params);
    } catch (error) {
      console.error('Error creating button mapping:', error);
      throw error;
    }
  }

  async getMappings(): Promise<ButtonMapping[]> {
    const query = 'SELECT * FROM button_mappings';
    try {
      const database = databaseService.getDatabase();
      if (!database) {
        throw new Error('Database not initialized');
      }
      const [results] = await database.executeSql(query);
      return this.mapResultsToMappings(results);
    } catch (error) {
      console.error('Error getting button mappings:', error);
      throw error;
    }
  }

  async deleteMapping(id: string): Promise<void> {
    const query = 'DELETE FROM button_mappings WHERE id = ?';
    try {
      await databaseService.getDatabase()?.executeSql(query, [id]);
    } catch (error) {
      console.error('Error deleting button mapping:', error);
      throw error;
    }
  }

  private mapResultsToMappings(results: any): ButtonMapping[] {
    const mappings: ButtonMapping[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      mappings.push({
        id: row.id,
        buttonId: row.buttonId,
        buttonName: row.buttonName,
        characteristicUuid: row.characteristicUuid,
        pressType: row.pressType,
        actionId: row.actionId,
        actionName: row.actionName
      });
    }
    return mappings;
  }
}

export const buttonMappingRepository = new ButtonMappingRepository(); 