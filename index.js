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

const config = require('./config.json');
const baileys = require('@whiskeysockets/baileys');
const {
  default: WAConnect,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidDecode
} = baileys;
const {
  Boom
} = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const pino = require('pino');
const yargs = require('yargs/yargs');
const lodash = require('lodash');

// Lib
const {
  smsg
} = require('./lib/function.js');

// Store Memory
const store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
});

// Console
function konsol() {
  console.clear();
  console.log(chalk.bold.cyan('WhatsApp Bot - Multi Device\n'));
  console.log(`Information:
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
- Dani Tech. (Dani Ramdani - FullStack Engineer & Developer)\n`);
  /*console.log((`${chalk.greenBright('Developer')}: ${chalk.whiteBright('Dani - FullStack Engineer')}
${chalk.greenBright('Version')}: ${chalk.whiteBright('1.0.0')}
${chalk.greenBright('Programming language')}: ${chalk.whiteBright('JavaScript')}
${chalk.greenBright('Runtime environment')}: ${chalk.whiteBright('Node.Js')}
${chalk.greenBright('Libraries')}: ${chalk.whiteBright('Baileys')}
${chalk.greenBright('Created on')}: ${chalk.whiteBright('July 12, 2023')}
${chalk.greenBright('Note')}: ${chalk.whiteBright('Donate:\n\nDana: 088296339947\nGopay: 089512545999\n\nDonasi seihklas nya!')}\n`));*/
}

// After Scanning
const connectToWhatsapp = async () => {
  // Session
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState('./.' + config.sessionName + '/');
  const client = baileys.default({
    printQRInTerminal: true,
    logger: pino({
      level: 'silent'
    }),
    browser: ["WhatsApp Bot", "Chrome", "3.0.0"],
    auth: state
  });
  client.ev.on('creds.update', await saveCreds);
  konsol();
  store.bind(client.ev);
  client.ev.on('messages.upsert', async chatUpdate => {
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
      if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
      if (!client.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
      if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
      messages = smsg(client, mek, store);
      require('./response/client.js')(client, messages);
    } catch (err) {
      console.log(err);
    }
  });

  client.public = config.publicMode;

  client.ev.on('connection.update',
    async (update) => {
      const {
        connection,
        lastDisconnect
      } = update;
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          client.logout();
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log('Connection closed, reconnecting....');
          connectToWhatsapp();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log('Connection Lost from Server, reconnecting...');
          connectToWhatsapp();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log('Connection Replaced, Another New Session Opened, Please Close Current Session First');
          client.logout();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Scan Again And Run.`);
          client.logout();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log('Restart Required, Restarting...');
          connectToWhatsapp();
        } else if (reason === DisconnectReason.timedOut) {
          console.log('Connection TimedOut, Reconnecting...');
          connectToWhatsapp();
        } else client.end(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
      console.log('Connected...', update);
    }
  );

  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && decode.user + '@' + decode.server || jid;
    } else return jid;
  };

  client.sendText = (jid, text, quoted = '', options) => client.sendMessage(jid, {
    text: text,
    ...options
  }, {
    quoted
  });

  client.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await client.sendMessage(jid, {
      image: buffer,
      caption: caption,
      ...options
    }, {
      quoted
    });
  };
  
  client.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await client.sendMessage(jid, {
      video: buffer,
      caption: caption,
      gifPlayback: gif,
      ...options
    }, {
      quoted
    });
  };
  
  client.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await client.sendMessage(jid, {
      audio: buffer,
      ptt: ptt,
      ...options
    }, {
      quoted
    });
  };

  client.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = '';
    let res = await axios.head(url);
    mime = res.headers['content-type'];
    if (mime.split("/")[1] === "gif") {
      return client.sendMessage(jid, {
        video: await getBuffer(url),
        caption: caption,
        gifPlayback: true,
        ...options
      }, {
        quoted: quoted,
        ...options
      });
    }
    let type = mime.split("/")[0] + "Message";
    if (mime === "application/pdf") {
      return client.sendMessage(jid, {
        document: await getBuffer(url),
        mimetype: 'application/pdf',
        caption: caption,
        ...options
      }, {
        quoted: quoted,
        ...options
      });
    }
    if (mime.split("/")[0] === "image") {
      return client.sendMessage(jid, {
        image: await getBuffer(url),
        caption: caption,
        ...options
      }, {
        quoted: quoted,
        ...options
      });
    }
    if (mime.split("/")[0] === "video") {
      return client.sendMessage(jid, {
        video: await getBuffer(url),
        caption: caption,
        mimetype: 'video/mp4',
        ...options
      }, {
        quoted: quoted,
        ...options
      });
    }
    if (mime.split("/")[0] === "audio") {
      return client.sendMessage(jid, {
        audio: await getBuffer(url),
        caption: caption,
        mimetype: 'audio/mpeg',
        ...options
      }, {
        quoted: quoted,
        ...options
      });
    }
  };

  client.sendListMsg = (jid, text = '', footer = '', title = '', butText = '', sects = [], quoted) => {
    let sections = sects;
    var listMes = {
      text: text,
      footer: footer,
      title: title,
      buttonText: butText,
      sections
    };
    client.sendMessage(jid, listMes, {
      quoted: quoted
    });
  };

  client.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
      text,
      footer,
      buttons,
      headerType: 2,
      ...options
    };
    
    client.sendMessage(jid, buttonMessage, {
      quoted,
      ...options
    });
  };
  
  client.sendTextWithMentions = async (jid, text, quoted, options = {}) => client.sendMessage(jid, {
    text: text,
    mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
    ...options
  }, {
    quoted
  });

  client.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }

    await client.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    });
    return buffer;
  };

  client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }

    await client.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    });
    return buffer;
  };

  client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  client.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  client.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    let types = await client.getFile(path, true);
    let {
      mime,
      ext,
      res,
      data,
      filename
    } = types;
    if (res && res.status !== 200 || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString())
        };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let type = '',
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
      let {
        writeExif
      } = require('./lib/exif');
      let media = {
        mimetype: mime,
        data
      };
      pathFile = await writeExif(media, {
        packname: options.packname ? options.packname : global.packname,
        author: options.author ? options.author : global.author,
        categories: options.categories ? options.categories : []
      });
      await fs.promises.unlink(filename);
      type = 'sticker';
      mimetype = 'image/webp';
    } else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await client.sendMessage(jid, {
      [type]: {
        url: pathFile
      },
      caption,
      mimetype,
      fileName,
      ...options
    }, {
      quoted,
      ...options
    });
    return fs.promises.unlink(pathFile);
  };

  client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype;
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message
      };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    };
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {});
    await client.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id
    });
    return waMessage;
  };

  client.cMod = (jid, copy, text = '', sender = client.user.id, options = {}) => {
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === 'ephemeralMessage';
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
    let content = msg[mtype];
    if (typeof content === 'string') msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== 'string') msg[mtype] = {
      ...content,
      ...options
    };
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === client.user.id;

    return proto.WebMessageInfo.fromObject(copy);
  };

  client.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
    let type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    };
    filename = path.join(__filename, '../' + new Date * 1 + '.' + type.ext);
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data
    };
  };
  return client;
};
connectToWhatsapp();