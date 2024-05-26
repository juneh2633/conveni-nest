import { Injectable } from '@nestjs/common';

import { EventHistory } from '../model/event-history.model';
import { PossibleProductIdx } from '../model/possible-product-idx.model';
import { EventRepository } from '../repository/event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getEventList(
    possibleProductList?: Array<PossibleProductIdx>,
    month: number = 0,
  ): Promise<Array<EventHistory>> {
    const possibleProductIdxArray = possibleProductList?.map(
      (item) => item.idx,
    );

    return this.eventRepository.selectEventInfo(possibleProductIdxArray, month);
  }
}
