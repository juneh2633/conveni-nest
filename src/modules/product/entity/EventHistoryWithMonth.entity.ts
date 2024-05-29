import { EventHistoryEntity } from './EventHistory.entity';

export class EventHistoryWithMonth {
  month: Date;
  events?: EventHistoryEntity[] | null;
}
