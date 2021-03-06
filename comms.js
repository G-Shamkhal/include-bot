// Библиотеки и константы //
const ytdl = require('ytdl-core'); // Подключаем библиотеку ytdl-core
const queue = new Map(); // Создаём очередь

// Переменные //
var Vol = 5;

// Команды //
function test(robot, mess, args) {
  mess.channel.send("Тест!")
}

function hello(robot, mess, args) {
  mess.reply("Привет!")
}

function say(robot, mess, args) {
  if (!mess.member.hasPermission("MANAGE_MESSAGES")) {
    return mess.channel.send("У вас нет прав"); /* Если у исполнителя команды нету привилегии MANGAGE_MESSAGES, он не сможет её использовать */
  }

  let robotmessage = args = mess.content.split(' '); // Пробелы между словами 
  args.shift();
  args = args.join(' ');

  mess.delete().catch(); // Удаление сообщения пользователя после отправки 

  mess.channel.send(robotmessage).then(mess.channel.send(args)) /* Отправление в чат сообщения бота */
}

async function play(robot, mess, args) {

  console.log("Выполняется функция извлечения информации из запроса.");

  serverQueue = queue.get(mess.guild.id);
  //const args = mess.content.split(" ");

  if (args[2] != "") {
    Vol = args[2];
  }

  console.log("Информация из сообщения:\n" + args);

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

  let songInfo = await ytdl.getInfo(args[1]);
  let song = {
    title: songInfo.videoDetails.title,
    url: args[1]
  };

  console.log("Информация из ссылки:\n" + song);

  if (!serverQueue) {
    let queueContruct = {
      textChannel: mess.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: Vol,
      playing: true
    };

    queue.set(mess.guild.id, queueContruct);
    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      console.log(queueContruct);
      playSong(mess.guild, queueContruct.songs[0])

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


function stop(robot, mess, args) {
  serverQueue = queue.get(mess.guild.id);

  console.log("Выполняется функция stop.\n");

  const voiceChannel = mess.member.voice.channel;
  if (!voiceChannel)
    return mess.channel.send("Вы должны быть в голосовом канале, чтобы остановить музыку!");
  serverQueue.songs = [];
  if (serverQueue.connection.dispatcher != null) {
    serverQueue.connection.dispatcher.end();
  }
  serverQueue.voiceChannel.leave();

}

function skip(robot, mess, args) {
  let serverQueue = queue.get(mess.guild.id);

  console.log("Выполняется функция skip.\n");

  if (!mess.member.voice.channel)
    return mess.channel.send("Вы должны быть в голосовом канале, чтобы остановить музыку!");
  if (!serverQueue)
    return mess.channel.send("Нет такой песни, которую я мог бы пропустить!");
  if (serverQueue.connection.dispatcher != null) {
    serverQueue.connection.dispatcher.end();
  }
  serverQueue.songs.shift();
  playSong(mess.guild, serverQueue.songs[0]);
}

function playSong(guild, song) {
  console.log("Выполняется запуск проигрывания.\n");
  console.log("Информация из ссылки:\n" + song);

  let serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  var dispatcher = serverQueue.connection.play(ytdl(song.url)).on("Завершить", () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  }).on("Ошибка", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`Начиниается воспроизведение: **${song.title}**`);
}


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
  name: "play",
  out: play,
  about: "play"
},
{
  name: "stop",
  out: stop,
  about: "stop"
},
{
  name: "skip",
  out: skip,
  about: "skip"
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