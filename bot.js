const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const robot = new Discord.Client(); // Объявляем, что robot - бот
const fs = require("fs");
const comms = require("./comms.js"); // Подключаем файл с командами для бота
let config = require('./config.json'); // Подключаем файл с конфигруацией

const prefix = config.prefix; // «Вытаскиваем» из него префикс
const token = process.env.token;

robot.on("ready", function () {

  /* При успешном запуске, в консоли появится сообщение «[Имя бота] запустился!» */
  console.log(robot.user.username + " запустился!");
});


robot.on('message', (msg) => { // Реагирование на сообщения

  if (msg.author.username != robot.user.username && msg.author.discriminator != robot.user.discriminator) {
    var comm = msg.content.trim() + " ";
    var comm_name = comm.slice(0, comm.indexOf(" "));

    var args = comm.split(" ");

    if (args[0] == "!restart") {
      restart(msg, args);
    } else {
      for (comm_count in comms.comms) {
        var comm2 = prefix + comms.comms[comm_count].name;
        if (comm2 == comm_name) {
          comms.comms[comm_count].out(robot, msg, args);
        }

      }
    }
  }
});

function restart(mess, args) {
  if (!mess.member.hasPermission("ADMINISTRATOR ")) {
    return mess.channel.send("У вас нет прав"); /* Если у исполнителя команды нету привилегии MANGAGE_MESSAGES, он не сможет её использовать */
  }
  if (args[1] == "000") {
    mess.delete().catch(); // Удаление сообщения пользователя после отправки 
    console.log("Bot restarting...");
    mess.channel.send("Перезагрузка бота...").then(process.exit(0));
    mess.channel.send(robot.user.username + " запустился!");
    console.log(robot.user.username + " запустился!");
  } else {

    console.log("Invalid restart password.");
    mess.channel.send("Неверный код автивации.");
  }
  
}

robot.login(token); // Авторизация бота