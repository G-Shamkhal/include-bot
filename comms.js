const config = require('./config.json');
const Discord = require('discord.js');
const prefix = config.prefix;
const versions = config.versions;

//const ytdl = require('ytdl-core');
//const queue = new Map();
//const serverQueue = function que(serverQueue) { return serverQueue; };

// Команды //

function test(robot, mess, args) {
  mess.channel.send("Тест!")
}

function hello(robot, mess, args) {
    mess.reply("Привет!")
}

function say(robot, mess, args) {
if (!mess.member.hasPermission("MANAGE_MESSAGES")) 
{
  return mess.channel.send("У вас нет прав"); /* Если у исполнителя команды нету привилегии MANGAGE_MESSAGES, он не сможет её использовать */
}

let robotmessage = args = mess.content.split(' '); // Пробелы между словами 
args.shift();
args = args.join(' ');

mess.delete().catch(); // Удаление сообщения пользователя после отправки 

mess.channel.send(robotmessage).then(mess.channel.send(mess.author)) /* Отправление в чат сообщения бота */
}
/**

async function execute(robot, mess) {
  const args = mess.content.split(' ');

  const voiceChannel = mess.member.voice.channel;
  if (!voiceChannel)
    return mess.channel.send(
      "Вы должны быть в голосовом канале, чтобы воспроизвести музыку!"
    );

  const permissions = voiceChannel.permissionsFor(mess.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return mess.channel.send(
      "Мне нужны разрешения, чтобы присоединиться и говорить в вашем голосовом канале!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: args[1]
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: mess.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(mess.guild.id, queueContruct);

console.log( "\n ********************* \n" + args[1] + " \n *********************" );

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(mess.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(mess.guild.id);
      return mess.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return mess.channel.send(`${song.title} был добавлен в очередь!`);
  }
}

function skip(robot, mess) {
  if (!mess.member.voice.channel)
    return mess.channel.send(
      "Вы должны быть в голосовом канале, чтобы остановить музыку!"
    );
  if (!serverQueue)
    return mess.channel.send("Нет такой песни, которую я мог бы пропустить!");
  serverQueue.connection.dispatcher.end();
}

function stop(robot, mess) {
  if (!mess.member.voice.channel)
    return mess.channel.send(
      "Вы должны быть в голосовом канале, чтобы остановить музыку!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(robot, guild, song) {
console.log( "\n ********************* \n" + song.url + " \n *********************" );

  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("Завершить", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("Ошибка", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Начиниается воспроизведение: **${song.title}**`);
}

function help(robot, mess, args) {
    
}

/*
function *(robot, mess, args) {
    
}
*/
// Список комманд //

var comms_list = [{
    name: "test",
    out: test,
    about: "Тестовая команда"
  },
  {
    name: "hello",
    out: hello,
    about: "Команда для приветствия!"
  },
  {
    name: "say",
    out: say,
    about: "say"
  }/*,
  {
    name: "help",
    out: help,
    about: ""
  },
  {
    name: "play",
    out: execute,
    about: "play"
  },
  {
    name: "stop",
    out: stop,
    about: ""
  },
  {
    name: "stop",
    out: stop,
    about: ""
  }
*/
]

/*
  {
    name: "",
    out: ,
    about: ""
  }
*/

module.exports.comms = comms_list;