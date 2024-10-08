const serverCreateSettings = require("../../../../createData");
exports.run = async (client, message, args) => {
    let helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(
            `List of servers: (use !server create <type> <name>)\n\n*Please note that some nodes might be having trouble connecting to the bot which may lead into this process giving out an error.*\n`
        )
        .addField("__**Languages:**__", "NodeJS \nBun \nPython \nAIO", true)
        .addField("__**Databases:**__", "Postgres16 \nMongoDB \nRedis", true)
        .addField("__**Software:**__", "Uptimekuma", true)
        .setFooter("Example: !server create NodeJS Testing Server");

    const serverName = message.content.split(" ").slice(3).join(" ") || "Untitled Server (settings -> server name)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                config.DiscordBot.Prefix +
                "user new` to create an account \nIf you already have an account link it using `" +
                config.DiscordBot.Prefix +
                "user link`"
        );
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[1]) {
        await message.reply(helpEmbed);
        return;
    }

    if (args[1] == "list") {
        await message.reply(helpEmbed);
        return;
    }

    let types = {
        storage: data.storage,
        nginx: data.nginx,
        nodejs: data.nodejs,
        python: data.python,
        aio: data.aio,
        java: data.java,
        ts3: data.ts3,
        mumble: data.mumble,
        mongodb: data.mongodb,
        redis: data.redis,
        postgres14: data.postgres14,
        postgres16: data.postgres16,
        sharex: data.sharex,
        codeserver: data.codeserver,
        gitea: data.gitea,
        haste: data.haste,
        uptimekuma: data.uptimekuma,
        rustc: data.rustc,
        redbot: data.redbot,
        grafana: data.grafana,
        openx: data.openx,
        mariadb: data.mariadb,
        rabbitmq: data.rabbitmq,
        bun: data.bun,
        storage: data.storage,
    };

    if (!Object.keys(types).includes(args[1].toLowerCase())) {
        return message.reply(helpEmbed);
    }

    function createServerAndSendResponse(type, message) {
        serverCreateSettings
            .createServer(types[type])
            .then((response) => {
                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                    .addField(`__**Server name:**__`, serverName)
                    .addField(`__**Type:**__`, type);

                message.reply(embed);
            })
            .catch((error) => {
                if (error == "AxiosError: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The node is currently full. If there are no updates soon, alert an admin.`
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `The node is currently offline or having issues. **PLEASE RETRY**`
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Failed to create a new server**__`,
                            `Uh oh, This shouldn\'t happen, Try again in a minute or two.`
                        );
                    message.reply(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(`__**Failed to create a new server**__`, `Some other issue happened. If this continues please open a ticket and report this to an admin. Please share this info with them: \nError: ${error}`);
                    message.reply(embed);
                }
            });
    }

    const type = args[1].toLowerCase();
    createServerAndSendResponse(type, message);
};
