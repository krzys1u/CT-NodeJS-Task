import {logger} from "../logger";

const amqplib = require('amqplib');

import type {RabbitConfig} from "../../types";
//
// export interface QueueClient {
//     send: (value: string) => void
// }

export const createQueueClient = async (config: RabbitConfig): Promise<void> => {
    const queue = 'productReviews';

    const conn = await amqplib.connect(config.url);

    const channel = await conn.createChannel();

    await channel.assertQueue(queue);

    // Listener
    channel.consume(queue, (msg: any) => {
        if (msg !== null) {
            logger.log('Received:', msg.content.toString());
            channel.ack(msg);
        } else {
            logger.log('Consumer cancelled by server');
        }
    });
}

