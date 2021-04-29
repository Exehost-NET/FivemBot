const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch");
const config = require("./config.json")

const getPlayers =  async() => {
    try {
        const players = await (await fetch(`http://${config.ip}:${config.port ?? 30120}/players.json`, {
            timeout: 5000
        })).json();

        const maxPlayers = (await (await fetch(`http://${config.ip}:${config.port ?? 30120}/dynamic.json`, {
            timeout: 5000
        })).json()).sv_maxclients;

        return {
            online: players.length,
            max: Number(maxPlayers)
        }
    } catch (e) {
        return {
            error: true,
            message: e
        }
    }
}

const updateStatus = async () => {
    const status = await getPlayers();

    if(status.error) {
        console.log(status.message)
        return client.user.setActivity(`Serwer off!`, {
            type: "WATCHING"
        })
    }

    await client.user.setActivity(`${status.online}/${status.max} graczy!`, {
        type: "WATCHING"
    })
}

client.on("ready",  () => {
    console.log(`Bot uruchomil sie poprawnie!`)
    console.log(`Zalogowano jako ${client.user.tag}`)

    updateStatus()

    setInterval(updateStatus, 60000) // Aktualizacja statusu co minutę

})

client.login(config.token)