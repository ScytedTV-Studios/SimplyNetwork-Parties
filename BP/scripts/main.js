import { world } from "@minecraft/server";

// Function to find the correct username with case sensitivity
function findPlayerByName(inputName) {
    const players = Array.from(world.getPlayers());
    return players.find((player) => player.nameTag.toLowerCase() === inputName.toLowerCase());
}

// Event listener for player chat
world.beforeEvents.chatSend.subscribe((eventData) => {
    const message = eventData.message;
    const sender = eventData.sender;

    // Check if the message starts with "!party invite"
    if (message.startsWith("!party invite ")) {
        // Prevent the message from appearing in the chat
        eventData.cancel = true;

        // Get the invited player's name from the message
        const args = message.split(" ");
        if (args.length > 2 && args[1] === "invite") {
            const invitedNameInput = args[2];
            const invitedPlayer = findPlayerByName(invitedNameInput);

            if (invitedPlayer) {
                // If the player exists, correct the name syntax and send the invite
                const correctName = invitedPlayer.nameTag;

                // Inform the sender that the invite was sent
                sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§eInvite sent."}]}`);

                // Send an invitation message to the invited player
                invitedPlayer.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§a${sender.nameTag} §einvited you to a party. Type §a!accept ${sender.nameTag} §eto join the party."}]}`
                );
            } else {
                // If the player does not exist, inform the sender
                sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cPlayer does not exist."}]}`);
            }
        } else {
            // If the command syntax is incorrect, show usage message
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§eUsage: !party invite <player>"}]}`);
        }
    }
});