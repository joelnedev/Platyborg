module.exports = { // eslint-disable-line no-undef
	name: 'Info',
	description: 'Provides helpful information about the server, a channel, or a staff/active member.',
	aliases: [],
	args: true,
	usage: " <\"server\" | staff member | active member>",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord) {
        switch(args[0]){
            // If the requested information is for stoneworm or any of his nicknames, provide helpful information about them.
            case "stoneworm":
            case "stonwrom":
            case "sotenwored":
            case "stenwor":
            case "wored":
            case "stoenwarudo":
                const stoneworm = ["stoneworm", "sotenwored", "stonwrom", "stenwor", "wored", "the wored", "stoenwarudo", "sonic admin",];
                message.channel.send(`${stoneworm[Math.floor(Math.random() * stoneworm.length)]} bad lol`);
                break;
                
            // If the requested information is for spoons or any of his nicknames, provide helpful information about them.
            case "spoons":
            case "spoon":
            case "spoonman":
            case "sopons":
            case "spones":
            case "sopones":
                message.channel.send("he is an extremely amazing and totally awesome admin (please help if i show any disrespect i will be killed :sob:)");
                break;
        }
	},
};