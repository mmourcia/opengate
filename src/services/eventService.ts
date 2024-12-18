import { EventEmitter } from 'events';

export class EventService {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  onActionsUpdated(callback: () => void) {
    this.eventEmitter.on('actionsUpdated', callback);
    return () => this.eventEmitter.off('actionsUpdated', callback);
  }

  emitActionsUpdated() {
    this.eventEmitter.emit('actionsUpdated');
  }

  onButtonPress(callback: (type: 'SINGLE' | 'DOUBLE') => void) {
    this.eventEmitter.on('buttonPress', callback);
  }

  emitButtonPress(type: 'SINGLE' | 'DOUBLE') {
    this.eventEmitter.emit('buttonPress', type);
  }
}

export const eventService = new EventService();
export const buttonEventService = eventService;