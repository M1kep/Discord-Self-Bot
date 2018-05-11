/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const commando = require('discord.js-commando'),
  zalgo = require('zalgotxt'),
  {deleteCommandMessages} = require('../../util.js');


module.exports = class zalgoCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'zalgo',
      memberName: 'zalgo',
      group: 'misc',
      description: 'F*ck up text using Zalgo',
      format: 'ContentToTransform',
      examples: ['zalgo HE COMES'],
      guildOnly: false,
      args: [
        {
          key: 'txt',
          prompt: 'What should I zalgolize?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, args) {
    deleteCommandMessages(msg, this.client);
		
    return msg.say(zalgo(args.txt));
  }
};