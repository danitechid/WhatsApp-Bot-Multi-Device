/*
Information:
- Developer: Dani
- Version: 1.0.0
- Programming language: JavaScript
- Runtime environment: Node.Js
- Libraries: Baileys
- Created on: July 12, 2023

Donate:
- Dana: 0882 9633 9947
- GoPay: 0895 1254 5999

Thanks to:
- Adiwajshing (Baileys provider)
- WhiskeySockets (Baileys provider)
- Dani Tech. (Dani Ramdani - FullStack Engineer & Developer)
*/
const config = require('../config.json');
const {
  MessageType,
  MessageOptions,
  Mimetype
} = require('@whiskeysockets/baileys');
const {
  Configuration,
  OpenAIApi
} = require('openai');
const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const cron = require('node-cron');
const timeZone = require('moment-timezone');

const {
  messagesText,
  messagesShop,
  messagesTroli,
  messagesDocument,
  messagesVn,
  messagesGif,
  messagesVideo,
  messagesLocation,
  messagesGroupLink,
  messagesContact,
  messagesStatus
} = require('../controller/messages.js');

const {
  fetchJson,
  getBuffer
} = require('../lib/function.js');

module.exports = async (client, messages) => {
  const body = messages.mtype === 'conversation' ? messages.message.conversation : messages.mtype === 'extendedTextMessage' ? messages.message.extendedTextMessage.text : '';
  const budy = typeof messages.text === 'string' ? messages.text : '';
  const command = body.startsWith(config.prefix) ? body.replace(config.prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
  const cleanCommand = command.replace(config.prefix, '');
  const args = body.trim().split(/ +/).slice(1);
  const text = args.join(' ');
  const message = messages;
  const messageType = messages.mtype;
  const messageKey = message.key;
  const pushName = messages.pushName || 'Undefined';
  const chat = (from = messages.chat);
  const sender = messages.sender;
  const botNumber = await client.decodeJid(client.user.id);
  const myNumber = sender === botNumber ? true : false;
  const isOwner = config.ownerNumber.map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(from) || false;

  if (message.message) {
    client.readMessages([messageKey]);
    console.log(chalk.magentaBright('Chat with:'), chalk.blueBright(pushName), chalk.greenBright(from));
  }

  if (messageType !== 'conversation' && messageType !== 'extendedTextMessage') {
    return;
  }

  if (body === 'Nama anda siapa?') {
    messages.reply('Nama saya: ' + config.botName);
  }

  if (!body.startsWith(config.prefix)) {
    return;
  }

  switch (cleanCommand) {
    case 'owner': {
      const vcard = 'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:' + config.ownerName + '\n' +
        'ORG:' + config.ownerOrg + ';\n' +
        'TEL;type=CELL;type=VOICE;waid=' + config.ownerNumber + ':' + config.ownerNumber + '\n' +
        'END:VCARD'
      client.sendMessage(
        from, {
          contacts: {
            displayName: config.ownerName,
            contacts: [{
              vcard
            }]
          }
        }
      )
      break;
    }
    case 'menu': {
      client.sendMessage(from, {
        text: `*Information:*
- Bot name: ${config.botName}
- Owner name: ${config.ownerName}
- Owner number: ${config.ownerNumber}
- Prefix: ${config.prefix}
- Developer: Dani
- Version: 1.0.0
- Programming language: JavaScript
- Runtime environment: Node.Js
- Libraries: Baileys
- Created on: July 12, 2023

*Donate:*
- Dana: 0882 9633 9947
- GoPay: 0895 1254 5999

*Thanks to:*
- Adiwajshing (Baileys provider)
- WhiskeySockets (Baileys provider)
- Dani Tech. (Dani Ramdani - FullStack Engineer & Developer)

*Features:*
*Fitur1:*
- ${config.prefix}menu1
- ${config.prefix}menu2

*Fitur2:*
- ${config.prefix}menu1
- ${config.prefix}menu2
`
      }, {
        quoted: messages
      });
      break;
    }
    
    case 'fitur1': {
  if (!text) {
    message.reply('Sertakan judulnya tot!');
    break;
  }
  
  const reactionMessage = {
    react: {
      text: '⏳',
      key: message.key,
    },
  };
  client.sendMessage(from, reactionMessage);

  // Fitur area
  const API = await fetchJson(`https://daniapi.my.id/api/downloader/youtube-play-audio?title=${text}&key=${config.apiKey}`);
  console.log(API);

  client.sendMessage(from, {
    audio: {
      url: API.data.url
    },
    mimetype: 'audio/mp4',
    ptt: false,
  }, {
    quoted: messages
  }).then(() => {
    const reactionMessageCompleted = {
      react: {
        text: '✅',
        key: message.key,
      },
    };
    client.sendMessage(from, reactionMessageCompleted);
  }).catch((error) => {
    console.error('Terjadi kesalahan:', error);
    messages.reply('Terjadi kesalahan:', error);
  });

  break;
}
    
    
    case 'react': {
      const reactionMessage = {
        react: {
          text: '🗿',
          key: message.key,
        },
      };
      client.sendMessage(from, reactionMessage);
      break;
    }
    case 'link': {
      client.sendMessage(from, {
        text: 'Hi, this was sent using https://github.com/adiwajshing/baileys',
      }, {
        quoted: messages
      });
      break;
    }
    case 'audio': {
      client.sendMessage(from, {
        audio: {
          url: 'https://cdn.miftahbot.my.id/audio/12.mp3'
        },
        mimetype: 'audio/mp4',
        ptt: false,
      }, {
        quoted: messages
      });
      break;
    }
    case 'vn': {
      client.sendMessage(from, {
        audio: {
          url: 'https://cdn.miftahbot.my.id/audio/12.mp3'
        },
        mimetype: 'audio/mp4',
        ptt: true,
      }, {
        quoted: messages
      });
      break;
    }
    case 'img': {
      client.sendMessage(from, {
        image: {
          url: 'https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg'
        },
        caption: 'ya',
      }, {
        quoted: messages
      });
      break;
    }
    case 'video': {
      client.sendMessage(from, {
        video: {
          url: 'https://file-examples.com/storage/fe56bbd83564ad7489ca047/2017/04/file_example_MP4_480_1_5MG.mp4'
        },
        caption: 'ya',
        mimetype: 'video/mp4',
      }, {
        quoted: messages
      });
      break;
    }
    case 'doc': {
      client.sendMessage(from, {
        document: {
          url: 'https://download2393.mediafire.com/4kubtczfrbggP9-7brMcM4elng3ur4Ult21fARAnJri4H7YOcw-GAqTEH5lWlWPnLBIOpX9qXI6wiuy2PE-yxlccCBsMqMhw3pY3ZbokzwBD_PRAqcFGHOSe2Jtg8QdMGLPFhPxZO--uIgKsYHBkLwdp2Ue4KqsgqbfoghwcgSCDbiJV/pwxob70rpgma9lz/GBWhatsApp+v8.75%28Tutorial+Yud%29.apk'
        },
        fileName: '1.zip',
        caption: 'Done nyet',
        mimetype: 'document/zip',
      }, {
        quoted: messages
      });
      break;
    }

    default: {
      client.sendMessage(from, {
        text: `Command: ${cleanCommand}, tidak tersedia!`,
      }, {
        quoted: messages
      });
      break;
    }
  }
};