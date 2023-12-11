const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const express = require('express');
const app = express();
const port = 3000;
const got = require('got');
const sharp = require('sharp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

require('dotenv').config();

// Discord.js botu başlatıldığında
client.once('ready', () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

// Yeni bir üye sunucuya katıldığında
client.on('guildMemberAdd', async (member) => {
  const welcomeChannelName = process.env.WELCOME_CHANNEL_NAME || 'welcome';
  const channel = member.guild.channels.cache.find(ch => ch.name === welcomeChannelName);

  if (channel) {
    // Profil fotoğrafını ve hoşgeldin mesajını içeren kartı oluştur
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const backgroundImage = await loadImage('https://cdn.discordapp.com/attachments/1164623560564822036/1183470733284868096/images_3.png?ex=65887402&is=6575ff02&hm=2df6e2223d88ca6bf12523b2e728430229c0e9d97474f1f85de5a34919cc56a0');
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff'; // Yazı rengi
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'left'; // Metni sola hizala

    const text = `Hoş geldin, ${member.user.tag}!\nSunucudaki kişi sayısı: ${member.guild.memberCount}`;
    ctx.fillText(text, 30, canvas.height - 60);

    // Profil fotoğrafını indirin ve JPEG formatına dönüştürün
    const avatarURL = member.user.displayAvatarURL({ format: 'webp', dynamic: true, size: 512 });
    const avatarBuffer = await got(avatarURL, { responseType: 'buffer' });
    const avatar = await sharp(avatarBuffer.body).jpeg().toBuffer();
    const avatarImage = await loadImage(avatar);

    // Kart üzerine profil fotoğrafını ekleyin
    ctx.drawImage(avatarImage, 30, 30, 120, 120);

    // Kartı bir dosya olarak kaydedin ve kanala gönderin
    const attachment = canvas.toBuffer();
    channel.send({ files: [attachment] });
  } else {
    console.error(`Belirtilen isimde (${welcomeChannelName}) kanal bulunamadı!`);
  }
});

// Bir üye sunucudan çıkınca
client.on('guildMemberRemove', async (member) => {
  const goodbyeChannelName = process.env.GOODBYE_CHANNEL_NAME || 'goodbye';
  const channel = member.guild.channels.cache.find(ch => ch.name === goodbyeChannelName);

  if (channel) {
    // Profil fotoğrafını ve hoşça kal mesajını içeren kartı oluştur
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const backgroundImage = await loadImage('https://cdn.discordapp.com/attachments/1164623560564822036/1183470733284868096/images_3.png?ex=65887402&is=6575ff02&hm=2df6e2223d88ca6bf12523b2e728430229c0e9d97474f1f85de5a34919cc56a0');
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff'; // Yazı rengi
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'left'; // Metni sola hizala

    const text = `Hoşça kal, ${member.user.tag}!\nSunucudan ayrıldı.\nSunucudaki kişi sayısı: ${member.guild.memberCount}`;
    ctx.fillText(text, 30, canvas.height - 60);

    // Profil fotoğrafını indirin ve JPEG formatına dönüştürün
    const avatarURL = member.user.displayAvatarURL({ format: 'webp', dynamic: true, size: 512 });
    const avatarBuffer = await got(avatarURL, { responseType: 'buffer' });
    const avatar = await sharp(avatarBuffer.body).jpeg().toBuffer();
    const avatarImage = await loadImage(avatar);

    // Kart üzerine profil fotoğrafını ekleyin
    ctx.drawImage(avatarImage, 30, 30, 120, 120);

    // Kartı bir dosya olarak kaydedin ve kanala gönderin
    const attachment = canvas.toBuffer();
    channel.send({ files: [attachment] });
  } else {
    console.error(`Belirtilen isimde (${goodbyeChannelName}) kanal bulunamadı!`);
  }
});

client.login(process.env.TOKEN);

app.get('/', (req, res) => res.send('PowerDark Uptime'));

app.listen(port, () =>
  console.log(`Bot is running at http://localhost:${port}`)
);
