const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const robot = new Discord.Client(); // Объявляем, что robot - бот
const comms = require("./comms.js"); // Подключаем файл с командами для бота
const fs = require('fs'); // Подключаем родной модуль файловой системы node.js  
const ytdl = require('ytdl-core');
const queue = new Map();
let config = require('./config.json'); // Подключаем файл с параметрами и информацией
//let token = config.token; // «Вытаскиваем» из него токен
let prefix = config.prefix; // «Вытаскиваем» из него префикс

const token = process.env.token;

//const serverQueue = queue.get(message.guild.id);


robot.on("ready", function() {
  /* При успешном запуске, в консоли появится сообщение «[Имя бота] запустился!» */
  console.log(robot.user.username + " запустился!");
});


robot.on('message', (msg) => { // Реагирование на сообщения

  if (msg.author.username != robot.user.username && msg.author.discriminator != robot.user.discriminator) {
    var comm = msg.content.trim() + " ";
    var comm_name = comm.slice(0, comm.indexOf(" "));
    var messArr = comm.split(" ");

const serverQueue = queue.get(msg.guild.id);

 

    for (comm_count in comms.comms) {
      var comm2 = prefix + comms.comms[comm_count].name;
      if (comm2 == comm_name) {
        comms.comms[comm_count].out(robot, msg, messArr, serverQueue);
      }

       if (msg.content.startsWith(`${prefix}play`)) {
    execute(msg, serverQueue);
    return;
  } else if (msg.content.startsWith(`${prefix}skip`)) {
    skip(msg, serverQueue);
    return;
  } else if (msg.content.startsWith(`${prefix}stop`)) {
    stop(msg, serverQueue);
    return;
  } 
    }
    
  }
});

async function execute(msg, serverQueue) {
  const args = msg.content.split(" ");

  const voiceChannel = msg.member.voice.channel;
  if (!voiceChannel)
    return msg.channel.send(
      "Вы должны быть в голосовом канале, чтобы воспроизвести музыку!"
    );

  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return msg.channel.send(
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
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 1,
      playing: true
    };

    queue.set(msg.guild.id, queueContruct);

console.log( "\n ********************* \n" + args[1] + " \n *********************" );

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(msg.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(msg.guild.id);
      return msg.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return msg.channel.send(`${song.title} был добавлен в очередь!`);
  }
}

function skip(msg, serverQueue) {
  if (!msg.member.voice.channel)
    return msg.channel.send(
      "Вы должны быть в голосовом канале, чтобы остановить музыку!"
    );
  if (!serverQueue)
    return msg.channel.send("Нет такой песни, которую я мог бы пропустить!");
  serverQueue.connection.dispatcher.end();
}

function stop( msg, serverQueue) {
  if (!msg.member.voice.channel)
    return msg.channel.send(
      "Вы должны быть в голосовом канале, чтобы остановить музыку!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play( guild, song) {
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

robot.login(token); // Авторизация бота