const Discord = require("discord.js");
const commando = require('discord.js-commando');
const superagent = require('superagent');
const querystring = require('querystring');
const auth = require('../../auth.json');
const googleapikey = auth.googleapikey;
const searchEngineKey = auth.searchEngineKey;

module.exports = class googleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'google',
            group: 'search',
            aliases: ['search'],
            memberName: 'google',
            description: 'Find something on google',
            examples: ['google Pyrrha Nikos'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What do you want to google?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const query = args.query //is basically the search sent by you
            .replace(/(who|what|when|where) ?(was|is|were|are) ?/gi, '')
            .split(' ')
            .map(x => encodeURIComponent(x))
            .join('+');

        const QUERY_PARAMS = {
            key: googleapikey,
            limit: 1,
            indent: true,
            query,
        };
        return superagent.get(`https://kgsearch.googleapis.com/v1/entities:search?${querystring.stringify(QUERY_PARAMS)}`)
            .then((res) => {
                let result = res.body.itemListElement[0];
                if (!result || !result.result || !result.result.detailedDescription) return Promise.reject('NO RESULT');
                result = result.result;
                let types = result['@type'].map(t => t.replace(/([a-z])([A-Z])/g, '$1 $2'));
                if (types.length > 1) types = types.filter(t => t !== 'Thing');
                const title = `${result.name} ${types.length === 0 ? '' : `(${types.join(', ')})`}`;
                const LEARN_MORE_URL = result.detailedDescription.url.replace(/\(/, '%28').replace(/\)/, '%29');
                const description = `${result.detailedDescription.articleBody} [Learn More...](${LEARN_MORE_URL})`;
                return msg.edit(result.detailedDescription.url, title, description);
            })
            .catch((knowledgeErr) => {
                let safe = 'high';
                let QUERY_PARAMS = {
                    key: googleapikey,
                    cx: searchEngineKey,
                    safe,
                    q: encodeURI(query),
                };
                return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}`)
                    .then((res) => {
                        if (res.body.queries.request[0].totalResults === '0') return Promise.reject(new Error('NO RESULTS'));
                        return msg.edit(res.body.items[0].link);
                    })
                    .catch(() => {
                        const SEARCH_URL = `https://www.google.com/search?safe=${safe}&q=${encodeURI(query)}`;
                        return superagent.get(SEARCH_URL).then((res) => {
                            const $ = cheerio.load(res.text);
                            let href = $('.r').first().find('a').first().attr('href');
                            if (!href) return Promise.reject(new Error('NO RESULTS'));
                            href = querystring.parse(href.replace('/url?', ''));
                            return msg.edit(href.q);
                        })
                    })
                    .catch((searchErr) => {
                        msg.edit('**No Results Found!**');
                        console.error(`A regular search error occured!\n================================\n${searchErr}`);
                    });
            })
    }
};