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

const {
  proto,
  getContentType
} = require('@whiskeysockets/baileys');
const axios = require('axios');
const jimp = require('jimp');

exports.getBuffer = async (url, options) => {
  try {
    options ? options : {}
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (err) {
    return err
  }
}

exports.fetchJson = async (url, options) => {
  try {
    options ? options : {}
    const res = await axios({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
      },
      ...options
    })
    return res.data
  } catch (err) {
    return err
  }
}

exports.smsg = (conn, m, store) => {
  if (!m) return m
  let M = proto.WebMessageInfo
  if (m.key) {
    m.id = m.key.id
    m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
    m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
    if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || ''
  }
  if (m.message) {
    m.mtype = getContentType(m.message)
    m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
    m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
    let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
    if (m.quoted) {
      let type = getContentType(quoted)
      m.quoted = m.quoted[type]
      if (['productMessage'].includes(type)) {
        type = getContentType(m.quoted)
        m.quoted = m.quoted[type]
      }
      if (typeof m.quoted === 'string') m.quoted = {
        text: m.quoted
      }
      m.quoted.mtype = type
      m.quoted.id = m.msg.contextInfo.stanzaId
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
      m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
      m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
      m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.id)
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
      m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false
        let q = await store.loadMessage(m.chat, m.quoted.id, conn)
        return exports.smsg(conn, q, store)
      }
      let vM = m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id
        },
        message: quoted,
        ...(m.isGroup ? {
          participant: m.quoted.sender
        } : {})
      })

      /**
       * 
       * @returns 
       */
      m.quoted.delete = () => conn.sendMessage(m.quoted.chat, {
        delete: vM.key
      })

      /**
       * 
       * @param {*} jid 
       * @param {*} forceForward 
       * @param {*} options 
       * @returns 
       */
      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options)

      /**
       *
       * @returns
       */
      m.quoted.download = () => conn.downloadMediaMessage(m.quoted)
    }
  }
  if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg)
  m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
  /**
   * Reply to this message
   * @param {String|Object} text 
   * @param {String|false} chatId 
   * @param {Object} options 
   */
  m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? conn.sendMedia(chatId, text, 'file', '', m, {
    ...options
  }) : conn.sendText(chatId, text, m, {
    ...options
  })
  /**
   * Copy this message
   */
  m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)))

  /**
   * 
   * @param {*} jid 
   * @param {*} forceForward 
   * @param {*} options 
   * @returns 
   */
  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)

  return m
}

/*
exports.smsg = (client, messages, store) => {
  if (!messages) return messages;
  let M = proto.WebMessageInfo;
  if (messages.key) {
    messages.id = messages.key.id;
    messages.isBaileys = messages.id.startsWith('BAE5') && messages.id.length === 16;
    messages.chat = messages.key.remoteJid;
    messages.fromMe = messages.key.fromMe;
    messages.isGroup = messages.chat.endsWith('@g.us');
    messages.sender = client.decodeJid(messages.fromMe && client.user.id || messages.participant || messages.key.participant || messages.chat || '');
    if (messages.isGroup) messages.participant = client.decodeJid(messages.key.participant) || '';
  }
  if (messages.message) {
    messages.mtype = getContentType(messages.message);
    messages.msg = (messages.mtype == 'viewOnceMessage' ? messages.message[messages.mtype].message[getContentType(messages.message[messages.mtype].message)] : messages.message[messages.mtype]);
    messages.body = messages.message.conversation || messages.msg.caption || messages.msg.text || (messages.mtype == 'listResponseMessage') && messages.msg.singleSelectReply.selectedRowId || (messages.mtype == 'buttonsResponseMessage') && messages.msg.selectedButtonId || (messages.mtype == 'viewOnceMessage') && messages.msg.caption || messages.text;
    let quoted = messages.quoted = messages.msg.contextInfo ? messages.msg.contextInfo.quotedMessage : null;
    messages.mentionedJid = messages.msg.contextInfo ? messages.msg.contextInfo.mentionedJid : [];
    if (messages.quoted) {
      let type = getContentType(quoted);
      messages.quoted = messages.quoted[type];
      if (['productMessage'].includes(type)) {
        type = getContentType(messages.quoted);
        messages.quoted = messages.quoted[type];
      }
      if (typeof messages.quoted === 'string') messages.quoted = {
        text: messages.quoted
      };
      messages.quoted.mtype = type;
      messages.quoted.id = messages.msg.contextInfo.stanzaId;
      messages.quoted.chat = messages.msg.contextInfo.remoteJid || messages.chat;
      messages.quoted.isBaileys = messages.quoted.id ? messages.quoted.id.startsWith('BAE5') && messages.quoted.id.length === 16 : false;
      messages.quoted.sender = client.decodeJid(messages.msg.contextInfo.participant);
      messages.quoted.fromMe = messages.quoted.sender === (client.user && client.user.id);
      messages.quoted.text = messages.quoted.text || messages.quoted.caption || messages.quoted.conversation || messages.quoted.contentText || messages.quoted.selectedDisplayText || messages.quoted.title || '';
      messages.quoted.mentionedJid = messages.msg.contextInfo ? messages.msg.contextInfo.mentionedJid : [];
      messages.getQuotedObj = messages.getQuotedMessage = async () => {
        if (!messages.quoted.id) return false;
        let q = await store.loadMessage(messages.chat, messages.quoted.id, client);
        return exports.smsg(client, q, store);
      };
      let vM = messages.quoted.fakeObj = messages.fromObject({
        key: {
          remoteJid: messages.quoted.chat,
          fromMe: messages.quoted.fromMe,
          id: messages.quoted.id
        },
        message: quoted,
        ...(messages.isGroup ? { participant: messages.quoted.sender } : {})
      });
    }
  }
  messages.reply = (text, chatId = messages.chat, options = {}) => Buffer.isBuffer(text) ? client.sendMedia(chatId, text, 'file', '', m, { ...options }) : client.sendText(chatId, text, messages, { ...options });
  return messages;
};
*/

exports.reSize = async (img, size, size2) => {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await jimp.read(img);
      const ab = await buffer.resize(size, size2).getBufferAsync(jimp.MIME_JPEG);
      resolve(ab);
    } catch (error) {
      reject(error);
    }
  });
};