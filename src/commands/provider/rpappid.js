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
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpappidCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'rpappid',
      memberName: 'rpappid',
      group: 'provider',
      aliases: ['appid', 'rpapp', 'rpapplication'],
      description: 'Set your Rich Presence app ID',
      format: 'ApplicationID',
      examples: ['rpappid 355326429178757131'],
      guildOnly: false,
      args: [
        {
          key: 'appid',
          prompt: 'What is the ClientID of your Discord application?',
          type: 'string',
          label: 'appid',
          validate: (id) => {
            if (id.length === 18) {
              return true;
            }

            return 'The AppID has to be 18 digits';
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rpappid', args.appid);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence AppID has been set to \`${args.appid}\``);
  }
};