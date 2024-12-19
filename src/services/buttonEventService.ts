import { EventEmitter } from 'events';

class ButtonEventService {
  private eventEmitter: EventEmitter;
  private actionExecutor: any;
  private lastProcessedTimestamp = 0;
  private isProcessing = false;
  private totalEventsReceived = 0;
  private skippedEvents = 0;
  private processedEvents = 0;
  private maxQueueSize = 10;
  private eventQueue: Array<{
    type: 'SINGLE' | 'DOUBLE';
    deviceId: string;
    characteristicUuid: string;
  }> = [];
  private processingTimeout: NodeJS.Timeout | null = null;
  private readonly PROCESSING_TIMEOUT = 5000; // 5 seconds timeout

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(100);
  }

  private clearProcessingState() {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = null;
    }
    this.isProcessing = false;
  }

  setActionExecutor(executor: any) {
    this.actionExecutor = executor;
  }

  public getEventStats() {
    return {
      total: this.totalEventsReceived,
      processed: this.processedEvents,
      skipped: this.skippedEvents,
      queueSize: this.eventQueue.length,
    };
  }

  public async emitButtonPress(type: 'SINGLE' | 'DOUBLE', deviceId: string, characteristicUuid: string) {
    this.totalEventsReceived++;
    const now = Date.now();
    
    if (now - this.lastProcessedTimestamp < 2000) {
      console.log('Debouncing - too soon after last press');
      console.log(`Event stats - Total: ${this.totalEventsReceived}, Processed: ${this.processedEvents}, Skipped: ${++this.skippedEvents}, Queue: ${this.eventQueue.length}`);
      return;
    }

    try {
      this.isProcessing = true;
      this.lastProcessedTimestamp = now;

      // First emit the event to all listeners
      this.eventEmitter.emit('buttonPress', type, deviceId, characteristicUuid);

      // Then execute through the action executor and wait for completion
      if (this.actionExecutor) {
        await this.actionExecutor.handleButtonPress(type, deviceId, characteristicUuid);
        this.processedEvents++;
        console.log('Button press handled successfully');
      }
    } catch (error) {
      console.error('Error handling button press:', error);
      this.skippedEvents++;
    } finally {
      this.clearProcessingState();
    }
  }

  public onButtonPress(callback: (type: 'SINGLE' | 'DOUBLE', deviceId: string, characteristicUuid: string) => void) {
    this.eventEmitter.removeListener('buttonPress', callback);
    this.eventEmitter.on('buttonPress', callback);
    return () => {
      this.eventEmitter.removeListener('buttonPress', callback);
    };
  }

  public emitMappingsUpdated() {
    this.eventEmitter.emit('mappingsUpdated');
  }

  public onMappingsUpdated(callback: () => void) {
    this.eventEmitter.removeListener('mappingsUpdated', callback);
    this.eventEmitter.on('mappingsUpdated', callback);
    return () => {
      this.eventEmitter.removeListener('mappingsUpdated', callback);
    };
  }
}

export const buttonEventService = new ButtonEventService(); 