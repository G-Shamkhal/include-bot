const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const robot = new Discord.Client(); // Объявляем, что robot - бот
const fs = require("fs");
const comms = require("./comms.js"); // Подключаем файл с командами для бота
let config = require('./config.json'); // Подключаем файл с конфигруацией

const prefix = config.prefix; // «Вытаскиваем» из него префикс
const token = process.env.token;

var Parametrs = JSON.parse(fs.readFileSync('parametrs.json', (err, data) => (data)));

var Default = {
  Vol: 0.80,
  Repeat: "off",
};


robot.login(token); // Авторизация бота

robot.on("ready", function () {
 // fs.writeFileSync('parametrs.json', JSON.stringify(data));
  /* При успешном запуске, в консоли появится сообщение «[Имя бота] запустился!» */
  robot.channels.cache.get('786919558522994716').send(robot.user.username + " запустился!");
  console.log(robot.user.username + " запустился!");
  
});


robot.on('message', (msg) => { // Реагирование на сообщения

  if (msg.author.username != robot.user.username && msg.author.discriminator != robot.user.discriminator) {
    var comm = msg.content.trim() + " ";
    var comm_name = comm.slice(0, comm.indexOf(" "));

    var args = comm.split(" ");

    if (Parametrs[msg.guild.id]) {
      null
    } else {
      Parametrs = { [msg.guild.id]: Default };
      save();
    }

      for (comm_count in comms.comms) {
        var comm2 = prefix + comms.comms[comm_count].name;
        if (comm2 == comm_name) {
          comms.comms[comm_count].out(robot, msg, args, Parametrs);
        }

      }

  }
});

robot.on("error", (error) => {
  robot.channels.cache.get('786919558522994716').send(error);
});

function save() {
  fs.writeFileSync('parametrs.json', JSON.stringify(Parametrs));
}

/*
function restart(mess, args) {
  if (!mess.member.hasPermission("ADMINISTRATOR ")) {
    return mess.channel.send("У вас нет прав");  
  }
  if (args[1] == "000") {
    mess.delete().catch(); // Удаление сообщения пользователя после отправки 
    console.log("Bot restarting...");
    mess.channel.send("Перезагрузка бота...").then(process.exit(143));
    mess.channel.send(robot.user.username + " запустился!");
    console.log(robot.user.username + " запустился!");
  } else {

    console.log("Invalid restart password.");
    mess.channel.send("Неверный код автивации.");
  }
  
}
*/