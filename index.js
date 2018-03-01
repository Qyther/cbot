var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
const Discord = require("discord.js");
const client = new Discord.Client();
var confchannel;
var statuses = ["Asking da wae","Being a bot; Beep-Boop-Beep","Programming","Eating nacho's","Destroying memes","Making dank memes old","Experimenting","Hiding from people","Being afraid of abusive owner","Trying to find out how to destroy humanity","Trading pokemon cards","Mining bitcoins","Lickin' asses","Charging...","Beep-Beep-Boop-Beep...?","Eating/Drinking motoroil","Consuming non-effective alcohol"];

var mainstatus = "Being aware";
client.on("ready", () => {
  console.log("Ready to rumble!");
  client.channels.forEach(channel => {
    return confchannel = channel.name;
  });
  client.user.setPresence({
    game: {
        name: " and " + statuses[Math.floor(Math.random()*statuses.length)],
        type: 0
    }
  });
});

var prefix = "*";
var list = "help,kick,ban,ban all,kick all,purge,purge --number--,mute,unmute,delete channels,delete roles,delete channel,delete role,edit channels,edit roles,edit channel,edit role,create channel".split(",");

client.login(process.env.BOT_TOKEN);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
cm = 0;
// Chatroom
var permitted = ["owner", "CookieBot"];
var numUsers = 0;

io.on('connection', function (socket) {
  try {
  client.on("message", msg => {
    if (msg.guild === null) return;
    // this is where we add chat messages
    cm++;
    if (cm >= 2) return cm = 0;
    client.user.setPresence({
    game: {
        name: " and " + mainstatus,
        type: 0
    }
}).then(() => {
    setTimeout(() => {
      client.user.setPresence({
        game: {
            name: " and " + statuses[Math.floor(Math.random()*statuses.length)],
            type: 0
        }
    });
  }, 5000);
  });
    if (msg.content.toLowerCase() === "*help") {
      msg.delete();
      msg.author.send("Here is a list!\n" + list.join("\n"));
      return;
    }
    if (msg.member.roles.find("name", "owner") !== null && msg.content.startsWith(prefix) || msg.author.bot && msg.content.startsWith(prefix)) {
    if (msg.content.toLowerCase() === "*purge") {
      msg.delete();
      msg.channel.bulkDelete(100).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully purged " + msg.channel.name
        });
      });
      return;
    }
    if (msg.content.toLowerCase().startsWith("*ban")) {
      msg.delete();
      if (!msg.mentions.members) return;
      var member = msg.mentions.members.first();
      var dayz = parseInt(msg.content.split("ban " + member + " ")[1]);
      if (!dayz || dayz < 0 || dayz > 7) return;
      if (member.bannable) {
      member.ban(dayz).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully banned " + member.user.username
        });
        msg.channel.send(msg.author.username + " has succesfully banned " + member.user.username);
      }).catch(() => {
        msg.reply("Could not ban " + member.user.username);
      });
    }
      return;
    }
    if (msg.content.toLowerCase().startsWith("*kick")) {
      msg.delete();
      if (!msg.mentions.members) return;
      var member = msg.mentions.members.first();
      if (member.kickable) {
        member.kick().then(() => {
          socket.broadcast.emit('new message', {
            username: "",
            message: "Succesfully kicked " + member.user.username
          });
          msg.channel.send(msg.author.username + " has succesfully kicked " + member.user.username);
        }).catch(() => {
          msg.reply("Could not kick " + member.user.username);
        });
      }
      return;
    }
    if (msg.content.toLowerCase().startsWith("*mute")) {
      msg.delete();
      if (!msg.mentions.members) return;
      var member = msg.mentions.members.first();
      if (!msg.guild.roles.find("name", "muted")) return;
      member.addRole(msg.guild.roles.find("name", "muted").id).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully muted " + member.user.username
        });
        msg.channel.send(msg.author.username + " has succesfully muted " + member.user.username);
      }).catch(() => {
        msg.reply("Could not mute " + member.user.username);
      });
      return;
    }
    if (msg.content.toLowerCase().startsWith("*unmute")) {
      msg.delete();
      if (!msg.mentions.members) return;
      var member = msg.mentions.members.first();
      if (!msg.guild.roles.find("name", "muted")) return;
      member.removeRole(msg.guild.roles.find("name", "muted").id).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully unmuted " + member.user.username
        });
        msg.channel.send(msg.author.username + " has succesfully unmuted " + member.user.username);
      }).catch(() => {
        msg.reply("Could not unmute " + member.user.username);
      });
      return;
    }
    if (msg.content.toLowerCase().startsWith("*purge")) {
      msg.delete();
      var mc = parseInt(msg.content.split("*purge ")[1]);
      if (!mc) return;
      msg.channel.bulkDelete(mc).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully purged " + mc + " messages in " + msg.channel.name
        });
      }).catch(() => {});
      return;
    }
    if (msg.content.toLowerCase() === "*ban all") {
      msg.delete();
      var count = 0;
      msg.guild.members.forEach(member => {

        if (member.bannable) {
          member.ban(7).then(() => {
            count++;
          }).catch(() => {})
        };
      });
      setTimeout(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully banned players"
        });
      }, 1000);
      return;
    }
    if (msg.content.toLowerCase() === "*kick all") {
      msg.delete();
      var count = 0;
      msg.guild.members.forEach(member => {
        if (member.kick) {
           member.kick().then(() => {
             count++;
           }).catch(() => {});
       }
     });
     setTimeout(() => {
       socket.broadcast.emit('new message', {
         username: "",
         message: "Succesfully kicked players"
       });
     }, 1000);
      return;
    }
    if (msg.content.toLowerCase().startsWith("*create channel")) {
      msg.delete();
      var name = msg.content.split("*create channel ")[1];
      msg.guild.createChannel(name, "text").then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully made textchannel called " + name
        });
      }).catch(() => {});
      return;
    }
    if (msg.content.toLowerCase().startsWith("*delete channels")) {
      msg.delete();
      var count = 0;
      msg.guild.channels.forEach(channel => {
        channel.delete().then(() => {
          count++;
        }).catch(() => {});
      });
      setTimeout(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully deleted channels"
        });
      }, 1000);
      return;
    }
    if (msg.content.toLowerCase().startsWith("*delete roles")) {
      msg.delete();
      var count = 0;
      msg.guild.roles.forEach(role => {
        role.delete().then(() => {
          count++;
        }).catch(() => {});
      });
      setTimeout(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully deleted roles"
        });
      }, 1000);
      return;
    }
    if (msg.content.toLowerCase().startsWith("*delete channel")) {
      msg.delete();
      var cha = msg.content.split("*delete channel ")[1];
      if (!cha) return;
      if (!msg.guild.channels.find("name", cha)) return;
      msg.guild.channels.find("name", cha).delete().then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully deleted " + cha + " channel"
        });
      }).catch(() => {});
      return;
    }
    if (msg.content.toLowerCase().startsWith("*delete role")) {
      msg.delete();
      var rol = msg.content.split("*delete role ")[1];
      if (!rol) return;
      if (!msg.guild.roles.find("name", rol)) return;
      msg.guild.roles.find("name", rol).delete().then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully deleted " + rol + " role"
        });
      }).catch(() => {});
      return;
    }
    if (msg.content.toLowerCase().startsWith("*edit channels")) {
      msg.delete();
      var name = msg.content.split("*edit channels")[1];
      if (!name) return;
      msg.guild.channels.forEach(channel => {
        channel.setName(name);
      });
      setTimeout(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully changed channel names to " + name
        });
      }, 1500);
      return;
    }
    if (msg.content.toLowerCase().startsWith("*edit roles")) {
      msg.delete();
      var name = msg.content.split("*edit roles")[1];
      if (!name) return;
      msg.guild.roles.forEach(role => {
        role.setName(name);
      });
      setTimeout(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully changed role names to " + name
        });
      }, 1500);
      return;
    }
    if (msg.content.toLowerCase().startsWith("*edit channel")) {
      msg.delete();
      var cha = msg.content.split(" ")[2];
      var name = msg.content.split("*edit channel " + cha)[1];
      if (!cha || !name) return;
      if (!msg.guild.channels.find("name", cha)) return;
      msg.guild.channels.find("name", cha).setName(name).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully changed the channel " + cha + "'s name to " + name
        });
      });
      return;
    }
    if (msg.content.toLowerCase().startsWith("*edit role")) {
      msg.delete();
      var rol = msg.content.split(" ")[2];
      var name = msg.content.split(" ")[3];
      if (!rol || !name) return;
      if (!msg.guild.roles.find("name", rol)) return;
      msg.guild.roles.find("name", rol).setName(name).then(() => {
        socket.broadcast.emit('new message', {
          username: "",
          message: "Succesfully changed the role " + rol + "'s name to " + name
        });
      });
      return;
    }
    msg.delete();
    return msg.reply("That is an invalid command!");
  } else if (msg.content.startsWith(prefix)) {
    return msg.reply("You do not have access to the admin commands!");
  }
  if (msg.content.includes("<@0") || msg.content.includes("<@1") || msg.content.includes("<@2") || msg.content.includes("<@3") || msg.content.includes("<@4") || msg.content.includes("<@5") || msg.content.includes("<@6") || msg.content.includes("<@7") || msg.content.includes("<@8") || msg.content.includes("<@9")) {
  var replacive = msg.mentions.members.first().toString();
  var realuser = client.users.get(msg.mentions.members.first().id).username;
  var realdisc = client.users.get(msg.mentions.members.first().id).discriminator;
  var reg = new RegExp(replacive,"g");
  var mesg = msg.content.toString().replace(reg, "@"+realuser+"#"+realdisc);
} else {
  var mesg = msg.content.toString()
}
//Edit all channels --Name--
//Edit all roles --Name--
//Edit channel --name-- --name--
//Edit role --name-- --name--
    socket.broadcast.emit('new message', {
      username: msg.author.username.toString() + "(" + msg.channel.name +")",
      message: mesg
    });
    if (msg.author.bot) return;
    // this is where we test for commands
  });
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message';
    if (data.startsWith("#")) {
      return confchannel = data.split("#")[1];
    }
    if (data === "showlist") {
      client.channels.forEach(channel => {
        console.log(channel.name);
      });
      return;
    }
    if (!client.channels.find("name", confchannel)) return;
    client.channels.find("name", confchannel).send(data);
  });
} catch (e) {}
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
var date;
var dates;
client.on("guildMemberRemove", (member, guild) => {
  if (member.user.username === client.user.username) return;
  dates = [];
  date = new Date();
  dates.push(days[date.getDay()], months[date.getMonth()], date.getDate(), date.getYear()+1900, date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
  if (!guild.channels.find("name", "welcome")) return;
  guild.channels.find("name","welcome").send("R.I.P " + member.user.username + " : " + dates.join(" "));
  console.log(member.user.username + " has left the server");
});
client.on("guildMemberAdd", (member, guild) => {
  if (member.user.username === client.user.username) return;
  if (!guild.channels.find("name", "welcome")) return;
  guild.channels.find("name","welcome").send("Welcome to LuneXum, " + member.user.username + "! To get the command list just say what are the commands !");
  console.log(member.user.username + " has joined the server");
});
