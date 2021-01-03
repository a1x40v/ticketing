import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@achtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
