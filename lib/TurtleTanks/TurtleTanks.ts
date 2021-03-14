import {
    Message,
    MessageAttachment,
    MessageEmbed,
} from 'discord.js';

import { fabric } from 'fabric';

import { Database } from 'sqlite3';

import { Game } from './Game';
import { randomTurtle, faces, specificTurtle } from './Avatar';
import { map1 } from './Maps';

export async function handleTurtle(msg: Message, face: string) {
    const canvas = new fabric.StaticCanvas(null, {});

    const filePath = face
        ? face + '.png'
        : '';

    const outputFileName = filePath === ''
        ? 'turtle.png'
        : filePath;

    if (faces.includes(filePath)) {
        await specificTurtle(canvas, filePath);
    } else {
        await randomTurtle(canvas);
    }

    canvas.renderAll();

    const attachment = new MessageAttachment((canvas as any).createPNGStream(), outputFileName);

    msg.reply(attachment);
}

let game: undefined | Game;

export async function handleTurtleTanks(msg: Message, args: string[], db: Database) {
    if (!game) {
        game = new Game(map1);
        msg.channel.send('Created new game!');
    }

    if (!game.hasPlayer(msg.author.id)) {
        const err = game.join(msg.author.id);

        if (err) {
            msg.reply(err);
        } else {
            msg.reply('You have successfully joined the game!');
        }
    }

    const gameImage = await game.render(msg.author.id);

    const attachment = game.getGameImageAttachment();

    msg.reply(attachment);
}
