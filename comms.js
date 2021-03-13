const ytdl = require('ytdl-core');
const Queue = new Map();

var Vol = 0.80;
var Repeat = false;
// Команды //

function help(robot, mess, args) {
  console.log("\t\tFunction HELPL activated.");
 for (count in comms_list) {
   mess.channel.send(`№**${count+1}** в очереди:\nName: **${comms_list[count].name}**\nAbout: **${comms_list[count].about}**\n======================================================\n`);
 }
  console.log("\t\tEnd function HELP.");
}

function queue(robot, mess, args) {
  let serverQueue = Queue.get(mess.guild.id)
  console.log("\t\tFunction QUEUE activated.");
  for (count in serverQueue.songs) {
    mess.channel.send(`Name: **${serverQueue.songs[count].title}**\nURL: **${serverQueue.songs[count].url}**\n======================================================\n`);
  }
  console.log("\t\tEnd function QUEUE.");
}

function hello(robot, mess, args) {
    mess.reply("Привет!")
}

function say(robot, mess, args) {
  console.log("\t\tFunction SAY activated.");
  if (!mess.member.hasPermission("MANAGE_MESSAGES")) {
    return mess.channel.send("У вас нет прав"); /* Если у исполнителя команды нету привилегии MANGAGE_MESSAGES, он не сможет её использовать */
  }

  //let robotmessage = args = mess.content.split(' '); // Пробелы между словами 
  args.shift();
  args = args.join(' ');
  let robotmessage = args;
  mess.delete().catch(); // Удаление сообщения пользователя после отправки 

  //mess.channel.send(robotmessage).then(mess.channel.send(args)) /* Отправление в чат сообщения бота */
  mess.channel.send(robotmessage);
  console.log("\t\tEnd function SAY.");
}

async function play(robot, mess, args) {
  
  console.log("\t\tFunction PLAY activated.");
  console.log("\t\tLoading GuildID...");
  let serverQueue = Queue.get(mess.guild.id);
  console.log("\t\tserverQueue value: \n" + serverQueue);
  /*
  if ( args[2] != "" ) {
    Vol = args[2] / 2;
  }
  */
  console.log("\t\tVolume value = " + Vol);
  console.log("\t\tArguments from channel: \n" + args);
  
  const voiceChannel = mess.member.voice.channel;
  console.log("\t\tVoiceChannel value = " + voiceChannel);

  if (!voiceChannel)
    return mess.channel.send(
      "Вы должны быть в голосовом канале, чтобы воспроизвести музыку!"
    );

  const permissions = voiceChannel.permissionsFor(mess.client.user);
  console.log("\t\tPermissions value = " + permissions);

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

  console.log("\t\tSong info: \n" + songInfo);

  if (!serverQueue) {
    let queueContruct = {
      textChannel: mess.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      playing: true
    };
    
    Queue.set(mess.guild.id, queueContruct);
    queueContruct.songs.push(song);

    console.log("\t\tQueue: \n" + Queue);
    console.log("\t\tqueueContruct: \n" + queueContruct);

    try {
      var connection = await voiceChannel.join();
      console.log("\t\tConnection: \n");
      queueContruct.connection = connection;
      console.log("\t\tqueueConstruct: \n" + queueContruct);
      playSong(mess, queueContruct.songs[0])

    } catch (err) {
      console.log(err);
      Queue.delete(mess.guild.id);
      return mess.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    console.log("\t\tSong add queue.");
    return mess.channel.send(`${song.title} был добавлен в очередь!`);
  }
  console.log("\t\tEnd function PLAY.");
}



function stop(robot, mess, args) {
  console.log("\t\tFunction STOP activated.");
  console.log("Loading GuildID...");
  serverQueue = Queue.get(mess.guild.id);
  
  console.log("\t\tserverQueue value: \n" + serverQueue);

  const voiceChannel = mess.member.voice.channel;
  console.log("\t\tVoiceChannel value = " + voiceChannel);

  if (!voiceChannel)
    return mess.channel.send("Вы должны быть в голосовом канале, чтобы остановить музыку!");
  console.log("\t\tserverQueue.songs resets...");
  //console.log("\t\tserverQueue.connection.dispatcher value: \n" + serverQueue.connection.dispatcher);
  //serverQueue.songs = [];
  
  /*
  if (serverQueue.connection.dispatcher != null) {
    console.log("\t\tserverQueue.connection.dispatcher.end().");
    serverQueue.connection.dispatcher.end();
  }
  */
  console.log("\t\tBot exit from channel.");
  if (serverQueue) {
    if(serverQueue.voiceChannel){
      serverQueue.voiceChannel.leave();
  }
}
     Queue.delete(mess.guild.id);
  
  console.log("\t\tEnd function STOP.");
}

function skip(robot, mess, args) {
  console.log("\t\tFunction SKIP activated.");
  let serverQueue = Queue.get(mess.guild.id);
  console.log("\t\tserverQueue value: \n" + serverQueue);

  if (!mess.member.voice.channel)
    return mess.channel.send("Вы должны быть в голосовом канале, чтобы остановить музыку!");
  if (!serverQueue)
    return mess.channel.send("Нет такой песни, которую я мог бы пропустить!");

  console.log("\t\tserverQueue.connection.dispatcher value: \n" + serverQueue.connection.dispatcher);
  if (serverQueue.connection.dispatcher != null) {
    console.log("\t\tserverQueue.connection.dispatcher.end().");
    serverQueue.connection.dispatcher.end();
  }

  console.log("\t\tserverQueue.songs first value skip.");
  serverQueue.songs.shift();
  playSong(mess, serverQueue.songs[0]);
  console.log("\t\tEnd function SKIP.");
}

function playSong(mess, song) {
  console.log("\t\tFunction PLAYSONG activated.");
  console.log("\t\tGuildID loading...");
    let serverQueue = Queue.get(mess.guild.id);
  console.log("\t\tsreverQueue value = \n" + serverQueue);
    if (!song) {
      console.log("\t\tNot songs.");
      serverQueue.voiceChannel.leave();
      Queue.delete(mess.guild.id);
      return;
    }
    var dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {
      serverQueue.textChannel.send("Воспроизведение музыки завершено.");
      console.log("\t\tMusic ended.");
      if (!Repeat) {
        serverQueue.songs.shift();
      }
        dispatcher = null;
        playSong(mess, serverQueue.songs[0]);
    }).on('error', error => {
      console.log("\t\tERROR:");
      serverQueue.textChannel.send("Я конечно дико извиняюсь, но это у меня чёт не получается запустить. Так что пой сам.");
      stop(null, mess);
      console.error(error);
    });
    dispatcher.setVolumeLogarithmic(Vol);
  console.log("\t\tDispatcher: \n" + dispatcher);
  serverQueue.textChannel.send(`Начиниается воспроизведение: **${song.title}** \nГромкость воспроизведения: **${Vol*100}**%`);
  console.log("\t\tEnd function PLAYSONG.");
}

function volume(robot, mess, args) {
  console.log("\t\tFunction VOLUME activated.");
  let temp = args[1];
  console.log("\t\tTemp = " + temp);
  if (temp.slice(temp.length-2) == '%') {
    temp = temp.slice(0, temp.length - 1);
    console.log("\t\tTemp size = " + temp.length);
    console.log("\t\tTemp slice = " + temp.slice(0, temp.length - 1));
  }
 
  Vol = temp / 100;
  console.log("\t\tGuildID loading...");
  let serverQueue = Queue.get(mess.guild.id);
  console.log("\t\tserverQueue value: \n" + serverQueue);

  if (Vol*100 >= 0 && Vol*100 <= 300) {
    if (serverQueue) {
      console.log("\t\tSong volume value = " + args[1]);
      if (serverQueue.connection.dispatcher) {
        serverQueue.connection.dispatcher.setVolumeLogarithmic(Vol);
        mess.channel.send("Громкость воспроизведения: " + (Vol * 100 + "%"));
      }

    } else {
      console.log("\t\tSong volume value = " + Vol);
      mess.channel.send("Мне нужна музыка чтобы изменить её громкость.");
    }
  } else {
    mess.channel.send("Куда погнал, спустись на землю.");
  }


  console.log("\t\tEnd function VOLUME.");
}

function repeat(robot, mess, args) {
  Repeat = (args[1] == "on" || args[1] == "On") ? (true, mess.channel.send("Повторение включено.")) : (args[1] == "off" || args[1] == "Off") ? (false, mess.channel.send("Повторение выключено.")) : mess.channel.send("Я конечно не экстрасенс, но ты по-моему что-то не так ввёл. Давай по новой.");;
}


// Список комманд //

var comms_list = [{
    name: "help",
    out: help,
    about: "Выдать список всех команд и их описание."
  },
  {
    name: "hello",
    out: hello,
    about: "Команда для приветствия!"
  },
  {
    name: "play",
    out: play,
    about: "Воспроизвести музыку, или добавить в очередь. Синтаксис:\n<!play> <ссылка с YouTube>"
  },
  {
    name: "stop",
    out: stop,
    about: "Остановить музыку и очистить очередь."
  },
  {
    name: "skip",
    out: skip,
    about: "Перейти к следующей музыке в очереди."
  },
  {
    name: "volume",
    out: volume,
    about: "Изменить громкость музыки (оптимальные значения от 0 до 100)."
  },
  {
    name: "queue",
    out: queue,
    about: "Просмотр очереди."
  },
  {
    name: "repeat",
    out: repeat,
    about: "Поставить на повтор."
  },
  {
    name: "say",
    out: say,
    about: "Вывести сообщение м помощью бота."
  },
  /*,
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