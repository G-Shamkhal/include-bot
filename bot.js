const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const robot = new Discord.Client(); // Объявляем, что robot - бот
const comms = require("./comms.js"); // Подключаем файл с командами для бота
const fs = require('fs'); // Подключаем родной модуль файловой системы node.js  
const ytdl = require('ytdl-core'); // Подключаем библиотеку ytdl-core
let config = require('./config.json'); // Подключаем файл с конфигруацией

const prefix = config.prefix; // «Вытаскиваем» из него префикс
const token = process.env.token;


robot.on("ready", function() {
  /* При успешном запуске, в консоли появится сообщение «[Имя бота] запустился!» */
  console.log(robot.user.username + " запустился!");
});


robot.on('message', (msg) => { // Реагирование на сообщения

  if (msg.author.username != robot.user.username && msg.author.discriminator != robot.user.discriminator) {
    var comm = msg.content.trim() + " ";
    var comm_name = comm.slice(0, comm.indexOf(" "));
    var messArr = comm.split(" ");

    for (comm_count in comms.comms) {
      var comm2 = prefix + comms.comms[comm_count].name;
      if (comm2 == comm_name) {
        comms.comms[comm_count].out(robot, msg, messArr, serverQueue);
      }

    }
  }
});

robot.login(token); // Авторизация бота