import ws from 'ws';
import { token, guildID } from './config.js';

const wss = new ws('wss://gateway.discord.gg');

wss.on('open', () => {
    console.log('Connected to Discord');
    wss.send(JSON.stringify({
        op: 2,
        d: {
            token,
            properties: {
                $os: 'linux',
                $browser: 'discord.js',
                $device: 'discord.js'
            },
            compress: false,
            large_threshold: 250,
            shard: [0, 1],
            presence: {
                game: {
                    name: 'with JavaScript',
                    type: 0
                },
                status: 'online',
                since: null,
                afk: false
            }
        }
    }));
});

wss.on('message', (message) => {
    const data = JSON.parse(message)

    if(data.op === 10) {
        console.log('Heartbeat interval: ' + data.d.heartbeat_interval);
        setInterval(() => {
            wss.send(JSON.stringify({
                op: 1,
                d: Date.now()
            }));
        }, data.d.heartbeat_interval);
    }

    if (data.t === 'READY') {
        console.log(`
User: ${data.d.user.username}
ID: ${data.d.user.id}
GEO: ${data.d.geo_ordered_rtc_regions}`);
console.log('');
    }
    
    if (data.d === null) return;
    if (data.d.guild_id !== guildID || data.d.guild_id === undefined) return;

    switch (data.t) {
        case 'GUILD_UPDATE':
            console.log(`Guild updated: ${data.d.id}`);
            break;
        case 'GUILD_MEMBER_UPDATE':
            console.log(`Member updated: ${data.d.user.username}`);
            break;
        case 'GUILD_MEMBER_ADD':
            console.log(`Member added: ${data.d.user.username}`);
            break;
        case 'GUILD_MEMBER_REMOVE':
            console.log(`Member removed: ${data.d.user.username}`);
            break;
        case 'CHANNEL_CREATE':
            console.log(`Channel created: ${data.d.name}`);
            break;
        case 'CHANNEL_UPDATE':
            console.log(`Channel updated: ${data.d.name}`);
            break;
        case 'CHANNEL_DELETE':
            console.log(`Channel deleted: ${data.d.name}`);
            break;
        case 'CHANNEL_PINS_UPDATE':
            console.log(`Channel pins updated: ${data.d.channel_id}`);
            break;
        case 'MESSAGE_CREATE':
            console.log(`Message created: ${data.d.content}`);
            break;
        case 'MESSAGE_UPDATE':
            console.log(`Message updated: ${data.d.content}`);
            break;
        case 'MESSAGE_DELETE':
            console.log(`Message deleted: ${data.d.id}`);
            break;
        case 'MESSAGE_DELETE_BULK':
            console.log(`Messages deleted: ${data.d.ids}`);
            break;
        case 'MESSAGE_REACTION_ADD':
            console.log(`Reaction added: ${data.d.emoji.name}`);
            break;
        case 'MESSAGE_REACTION_REMOVE':
            console.log(`Reaction removed: ${data.d.emoji.name}`);
            break;
        case 'MESSAGE_REACTION_REMOVE_ALL':
            console.log(`All reactions removed: ${data.d.message_id}`);
            break;
        case 'MESSAGE_REACTION_REMOVE_EMOJI':
            console.log(`Reaction removed: ${data.d.emoji.name}`);
            break;
        case 'WEBHOOKS_UPDATE':
            console.log(`Webhook updated: ${data.d.guild_id}`);
            break;
        case 'INVITE_CREATE':
            console.log(`Invite created: ${data.d.code}`);
            break;
        case 'INVITE_DELETE':
            console.log(`Invite deleted: ${data.d.code}`);
            break;
        case 'VOICE_STATE_UPDATE':
            console.log(`Voice state updated: ${data.d.user_id}`);
            break;
        case 'PRESENCE_UPDATE':
            console.log(`Presence updated: ${data.d.user.username}`);
            break;
        case 'TYPING_START':
            console.log(`Typing started: ${data.d.user_id}`);
            break;
        case 'USER_UPDATE':
            console.log(`User updated: ${data.d.username}`);
            break;
        case 'GUILD_BAN_ADD':
            console.log(`User banned: ${data.d.user.username}`);
            break;
        case 'GUILD_BAN_REMOVE':
            console.log(`User unbanned: ${data.d.user.username}`);
            break;
        case 'GUILD_EMOJIS_UPDATE':
            console.log(`Emojis updated: ${data.d.guild_id}`);
            break;
        case 'GUILD_INTEGRATIONS_UPDATE':
            console.log(`Integrations updated: ${data.d.guild_id}`);
            break;
        case 'GUILD_ROLE_CREATE':
            console.log(`Role created: ${data.d.role.name}`);
            break;
        case 'GUILD_ROLE_UPDATE':
            console.log(`Role updated: ${data.d.role.name}`);
            break;
        case 'GUILD_ROLE_DELETE':
            console.log(`Role deleted: ${data.d.role_id}`);
            break;
    }
});
