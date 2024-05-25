import { Injectable } from '@nestjs/common';
import { EventRepository } from '../product/event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getEventInfo() {}
}
