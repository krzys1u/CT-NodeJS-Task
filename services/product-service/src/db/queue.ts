// const amqplib = require('amqplib');
//
// import type {RabbitConfig} from "../types";
//
// export interface QueueClient {
//     send: (value: string) => Promise<void>
// }
//
// export const createQueueClient = (config: RabbitConfig): QueueClient => {
//     const queue = 'productReviews';
//
//     return {
//         send: async (value: string): Promise<void> => {
//             const conn = await amqplib.connect(config.url);
//
//             const channel = await conn.createChannel();
//
//             channel.sendToQueue(queue, Buffer.from(value));
//         }
//     }
// }
//
//
const amqp = require('amqplib/callback_api');



import type {RabbitConfig} from "../types";

export interface QueueClient {
    send: (value: string) => Promise<void>
}

export const createQueueClient = async (config: RabbitConfig): Promise<QueueClient> => {
    const queue = 'productReviews';

    console.log('create queue client')

    //amqp.connect('amqp://localhost', function(error0, connection) {
    const amqpPromise = new Promise((resolve) => {
        console.log('rabbit connect');
        amqp.connect(config.url, function(error0: any, connection: any) {
            if (error0) {
                console.log('error0', error0)
                throw error0;
            }

            connection.createChannel(function(error1: any, channel: any) {
                if (error1) {
                    console.log('error1', error1)

                    throw error1;
                }
                var queue = 'hello';
                var msg = 'Hello world';

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(msg));
                console.log(" [x] Sent %s", msg);

                resolve(channel);
            });
        });
    })

    const channel: any = await amqpPromise;

    return {
        send: async (value: string): Promise<void> => {

            channel.sendToQueue(queue, Buffer.from(value));
        }
    }
}

