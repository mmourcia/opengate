import { EventEmitter } from 'events';

export class EventService {
  private eventEmitter: EventEmitter;
  private maxListeners = 20;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(this.maxListeners);
  }

  onActionsUpdated(callback: () => void) {
    this.eventEmitter.on('actionsUpdated', callback);
    return () => this.eventEmitter.off('actionsUpdated', callback);
  }

  emitActionsUpdated() {
    this.eventEmitter.emit('actionsUpdated');
  }

  onMappingsUpdated(callback: () => void) {
    this.eventEmitter.on('mappingsUpdated', callback);
    return () => this.eventEmitter.off('mappingsUpdated', callback);
  }

  emitMappingsUpdated() {
    this.eventEmitter.emit('mappingsUpdated');
  }
}

export const eventService = new EventService();