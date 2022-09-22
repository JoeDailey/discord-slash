# Discord Interaction Manager
This module helps manage interactions Discord.js interactions.
```
(async () => {
  const client = slash(new Client({intents}))
    .addChatInputCommand(SayHello)
    .addChatInputCommand(MediaCommands);
  
  client.addButtonInteraction(CreateVoiceChannelButton);

  // Optional: Register slash commands directly to a guild
  client.addDeveloperGuilds(process.env.DISCORD_GUILD);
  
  // Optional: Handle interaction failures manually
  client.setErrorHandler(interaction => {...});

  await client.login(process.env.DISCORD_TOKEN);
})();
```

Commands are defined with a name, description, handler, and options builder.
```
const SayHelloCommand = Command.create(
  "hello",
  "Say hello to someone",
  interaction => {
    const member = interaction.options.getMember('member');
    interaction.reply(`Hello `${member}`);
  },
  builder => builder
    .addUserOption(member => member
      .setName('member')
      .setDescription('Member to mention')
      .setRequired(true)
    ),
);
```

Commands can also have subcommands. Subcommands have a similar definition.
```
const MediaCommands = Command.createWithSubCommands(
  "media",
  "Control the media player",
  new Subcommand(
    "play",
    "Resume the media",
    interaction => {...},
    builder => {...},
  ),
  new Subcommand(
    "pause",
    "Pause the media",
    interaction => {...},
    builder => {...},
  ),
);
```

Buttons only require a `CustomID` pattern and an handler.
```
const CreateVoiceChannelButton = new Button(
  /^create-voice-channel:\w+$/,
  interaction => {...}
);
```

Bot can include buttons on messages and replies.
```
await interaction.reply({
  content: "User wants to create channel",
  components: [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`create-voice-channel:${newChannelName}`)
        .setLabel(`Create ${newChannelName}`)
        .setStyle(ButtonStyle.Primary),
    ),
  ],
});
```

---

This module currently only support slash commands and button interactions. More support may be added in the future. Contribution is welcome.