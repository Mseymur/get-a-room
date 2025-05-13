import Dexie from 'dexie';
import {Name} from '../interfaces/examples/name';

interface TableEntry {
  [tableName: string]: string
}

class DBService extends Dexie {

  public names!: Dexie.Table<Name, number>;

  /**
   *
   */
  constructor() {
    super('Tables');
    const tables: TableEntry = {
      // Add your tables here
      names: '++id',
    };
    // TODO: Add tables here
    this.version(1).stores(tables);
    this.on('populate', () => this.populate());
  }

  /**
   *
   * @private
   */
  private populate(): void {
    // Add predefined datasets here
  }
}

export const db = new DBService();
