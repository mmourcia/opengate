import { EventEmitter } from 'events';

class EventService extends EventEmitter {
  emitActionsUpdated() {
    this.emit('actionsUpdated');
  }

  onActionsUpdated(callback: () => void): () => void {
    this.on('actionsUpdated', callback);
    return () => this.removeListener('actionsUpdated', callback);
  }
}

export const eventService = new EventService(); 