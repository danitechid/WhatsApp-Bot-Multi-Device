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
const { reSize } = require('../lib/function.js');

exports.messagesText = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'extendedTextMessage': {
      'text': config.botName,
    }
  }
}

exports.messagesShop = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'productMessage': {
      'product': {
        'productImage': {
          'mimetype': 'image/jpeg',
          'jpegThumbnail': reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100)
        },
        'title': config.botName,
        'currencyCode': 'IDR',
        'priceAmount1000': '1000000000000000000',
        'productImageCount': 1
      },
      'businessOwnerJid': `0@s.whatsapp.net`
    }
  }
}

exports.messagesTroli = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  'message': {
    orderMessage: {
      itemCount: 1,
      status: 200,
      thumbnail: reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100),
      surface: 200,
      message: config.botName,
      sellerJid: '0@s.whatsapp.net'
    }
  },
  contextInfo: {
    'forwardingScore': 999,
    'isForwarded': true
  },
  sendEphemeral: true
}

exports.messagesDocument = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    documentMessage: {
      title: config.botName,
      jpegThumbnail: reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100)
    }
  }
}

exports.messagesVn = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'audioMessage': {
      'mimetype': 'audio/ogg; codecs=opus',
      'seconds': 359996400,
      'ptt': 'true'
    }
  }
}

exports.messagesGif = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'videoMessage': {
      'seconds': '359996400',
      'gifPlayback': 'true',
      'caption': config.botName,
      'jpegThumbnail': reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100)
    }
  }
}

exports.messagesVideo = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'videoMessage': {
      'seconds': '359996400',
      'caption': config.botName,
      'jpegThumbnail': reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100)
    }
  }
}

exports.messagesLocation = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    locationMessage: {
      caption: config.botName,
      jpegThumbnail: reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100)
    }
  }
}

exports.messagesGroupLink = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  'message': {
    'groupInviteMessage': {
      'groupJid': '0@g.us',
      'caption': config.botName,
      'jpegThumbnail': reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100)
    }
  }
}

exports.messagesContact = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'contactMessage': {
      'displayName': config.botName,
      'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;ytname,;;;\nFN:ytname\nitem1.TEL;waid=6289512545999:6289512545999\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      'jpegThumbnail': reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100),
      thumbnail: reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100),
      sendEphemeral: true
    }
  }
}

exports.messagesStatus = {
  key: {
    fromMe: false,
    'participant': '0@s.whatsapp.net',
    'remoteJid': 'status@broadcast'
  },
  message: {
    'imageMessage': {
      'url': 'https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc',
      'mimetype': 'image/jpeg',
      'caption': config.botName,
      'fileSha256': '+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=',
      'fileLength': '28777',
      'height': 1080,
      'width': 1079,
      'mediaKey': 'vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=',
      'fileEncSha256': 'sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=',
      'directPath': '/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69',
      'mediaKeyTimestamp': '1610993486',
      'jpegThumbnail': reSize('https://www.danitechid.com/img/portfolio/RESTful-API-with-full-CRUD.jpg', 100, 100),
      'scansSidecar': '1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw=='
    }
  }
}