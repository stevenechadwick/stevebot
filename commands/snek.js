import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import moment from 'moment';

const eventStartDate = moment([2022, 6, 27]);
const eventEndDate = moment([2022, 8, 26]);

const bpLevels = [...Array(20).keys()].map((level) => {
  const entry = {
    name: `Level ${level + 1}`,
    value: level + 1,
  };
  return entry;
});

const bpLeveLPoints = [
  400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
  1800, 1900, 2000, 2100, 2200,
];

const calculatePoints = (level, points) => {
  const getCurrentMinPoints = (l) => {
    let sum = 0;
    for (let i = 0; i < l - 1; i++) {
      sum += bpLeveLPoints[i];
    }
    return sum;
  };
  const getMaxPointsRemaining = (l) => {
    let sum = 0;
    for (let i = l - 1; i < bpLeveLPoints.length; i++) {
      sum += bpLeveLPoints[i];
    }
    return sum;
  };

  const minPoints = getCurrentMinPoints(level);
  const maxPointsRemaining = getMaxPointsRemaining(level);
  const currentPoints = minPoints + points;
  const pointsRemaining = maxPointsRemaining - points;

  return { currentPoints, pointsRemaining };
};

const calculateTimes = () => {
  const now = moment().startOf('day');
  const daysUsed = now.diff(eventStartDate, 'days');
  const daysLeft = eventEndDate.diff(now, 'days');

  return { daysUsed, daysLeft };
};

const getReturnMessage = (level, points) => {
  const { daysUsed, daysLeft } = calculateTimes();
  const { currentPoints, pointsRemaining } = calculatePoints(level, points);

  const averageRateSoFar = currentPoints / daysUsed;
  const averageNeededToFinish = pointsRemaining / daysLeft;

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Snake Report')
    .setAuthor({
      name: 'SteveBot',
      iconURL:
        'https://i.kym-cdn.com/photos/images/original/001/232/368/b4a.jpg',
    })
    .setDescription('Summary of your Serpent Moon event progress.')
    .setThumbnail(
      'https://i.pinimg.com/564x/b1/83/47/b18347073d92a3ac715703fd8e63d19a.jpg'
    )
    .addFields(
      { name: 'Days Passed', value: `${daysUsed}` },
      { name: 'Days Left', value: `${daysLeft}` },
      { name: 'Points Earned', value: `${currentPoints}` },
      { name: 'Points Left', value: `${pointsRemaining}` },
      { name: 'Points/Day', value: `${averageRateSoFar}` },
      { name: 'Points/Day To Finish', value: `${averageNeededToFinish}` }
    );

  return embed;
};

const command = {
  data: new SlashCommandBuilder()
    .setName('snek')
    .setDescription(
      'Responds with info on how far from completing the Serpent Moon event you have to go.'
    )
    .addIntegerOption((option) => {
      return option
        .setName('passlevel')
        .setDescription(
          'The level of the event battle pass you are currently at.'
        )
        .setRequired(true)
        .addChoices(...bpLevels);
    })
    .addIntegerOption((option) => {
      return option
        .setName('levelpoints')
        .setDescription(
          'The amount of points you have at your current battle pass level.'
        )
        .setRequired(true);
    }),
  async execute(interaction) {
    const level = interaction.options.getInteger('passlevel');
    const points = interaction.options.getInteger('levelpoints');
    await interaction.reply({
      embeds: [getReturnMessage(level, points)],
      ephemeral: true,
    });
  },
};

export default command;
