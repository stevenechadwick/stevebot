import { SlashCommandBuilder } from 'discord.js';
import moment from 'moment';

const eventStartDate = moment('2022-07-27');
const eventEndDate = moment('2022-09-26');

const bpLevels = [...Array(20).keys()].map((level) => {
  const entry = {
    name: `Level ${level + 1}`,
    value: level + 1,
  };
  return entry;
});

const bpLeveLPoints = [
  0, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
  1700, 1800, 1900, 2000, 2100,
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
  const now = moment();
  const timeSoFar = moment.duration(now.diff(eventStartDate));
  const timeLeft = moment.duration(eventEndDate.diff(now));

  return { timeSoFar, timeLeft };
};

const getReturnMessage = (level, points) => {
  const { timeSoFar, timeLeft } = calculateTimes();
  const { currentPoints, pointsRemaining } = calculatePoints(level, points);

  const daysUsed = timeSoFar.days();
  const daysLeft = timeLeft.days();

  const averageRateSoFar = currentPoints / daysUsed;
  const averageNeededToFinish = pointsRemaining / daysLeft;

  const message = `
  ${daysUsed} days have passed.
  ${daysLeft} days are left.
  You have earned a total of ${currentPoints} points so far.
  Your average point gain is ${averageRateSoFar} points/day.
  To complete the event you need ${pointsRemaining} more points (that's ${
    pointsRemaining / 2
  } snakes).
  This will require an average of ${averageNeededToFinish} points/day for the rest of the event.
  `;
  return message;
};

export const command = {
  data: new SlashCommandBuilder()
    .setName('snek')
    .setDescription(
      'Responds with info on how far from completing the Serpent Moon event you have to go.'
    )
    .addIntegerOption((option) => {
      option
        .setName('Pass Level')
        .setDescription(
          'The level of the event battle pass you are currently at.'
        )
        .setRequired(true)
        .addChoices(bpLevels);
    })
    .addIntegerOption((option) => {
      option
        .setName('Level Points')
        .setDescription(
          'The amount of points you have at your current battle pass level.'
        )
        .setRequired(true);
    }),
  async execute(interaction) {
    const level = interaction.options.getInteger('Pass Level');
    const points = interaction.options.getInteger('Level Points');
    await interaction.reply({
      content: getReturnMessage(level, points),
      ephemeral: true,
    });
  },
};
