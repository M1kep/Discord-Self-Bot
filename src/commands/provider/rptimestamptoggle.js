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

module.exports = class rptimestamptoggleCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'rptimestamptoggle',
      memberName: 'rptimestamptoggle',
      group: 'provider',
      aliases: ['timetoggle', 'tst', 'rptimestamp'],
      description: 'Configure whether you want a timestamp in your Rich Presence',
      format: 'enable|disable',
      examples: ['rptimestamptoggle enable'],
      guildOnly: false,
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable the timestamp in rich presences?',
          type: 'boolean',
          label: 'Option for toggling',
          validate: (bool) => {
            const validBools = ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-'];

            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validBools.join(', ')}`;
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rptimestamptoggle', args.option);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`The Timestamp in Rich Presence is now ${args.option 
      ? 'enabled' 
      : 'disabled'}. Run ${msg.guild 
      ? msg.guild.commandPrefix 
      : this.client.commandPrefix}rpreload to reload your presence.`);
  }
};