import { Listener, OrderCreatedEvent, Subjects } from '@achtickets/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    /*  Find the ticket that the order is reserving */
    const ticket = await Ticket.findById(data.ticket.id);

    /*  If no ticket, throw error */
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    /*  Mark the ticket as being reserved by setting its orderId property */
    ticket.set({ orderId: data.id });

    /*  Save the ticket */
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id!,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    /*  Ack the message */
    msg.ack();
  }
}
