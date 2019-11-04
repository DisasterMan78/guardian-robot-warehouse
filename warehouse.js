// Setup with `npm install`
// Run me with `node warehouse.js`
// Run tests with `npm run test`
// Run persistent tests during development with `npm run watch test`

// eslint-disable-next-line no-console
console.log('Welcome to Mr. Robot\'s Warehouse'); // https://github.com/guardian/pairing-tests/tree/master/warehouse-robot

const resetConfig = () => ({
        startPostion: {
          x: 5,
          y: 5,
        },
        maxWidth: 10,
        maxHeight: 10,
        output: [],
        crateLocations: {
          '5-5': true,
          '10-10': true,
        },
        crateOnBoard: false,
      }),
      moveRobot = (config, commandString) => {
        const settings = config,
              // eslint-disable-next-line arrow-body-style
              sanitiseCommands = (commands) => {
                return commands
                  .trim()
                  .toUpperCase()
                  .replace(/\s{2,}/g, ' '); // Replace any instance of more than one space with one
              },
              checkForCrate = (warehouse, locationString) => {
                if (
                  Object.prototype.hasOwnProperty.call(warehouse.crateLocations, locationString)
                  && warehouse.crateLocations[locationString] === true
                ) {
                  return true;
                }
                return false;
              },
              commandList = sanitiseCommands(commandString).split(' '),
              currentPosition = {
                x: settings.startPostion.x,
                y: settings.startPostion.y,
              },
              invalidCommands = [];

        let collisions = 0,
              invalidCount = 0,
              crateAtLocation,
              locationString;

        commandList.forEach((command) => {
          settings.output.push(command);

          switch (command) {
            case 'NULL':
              break;
            case 'N':
              if (currentPosition.x + 1 < settings.maxHeight + 1) {
                currentPosition.x += 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'E':
              if (currentPosition.y + 1 < settings.maxWidth + 1) {
                currentPosition.y += 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'S':
              if (currentPosition.x - 1 > -1) {
                currentPosition.x -= 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'W':
              if (currentPosition.y - 1 > -1) {
                currentPosition.y -= 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'NE':
            case 'EN':
              if (
                (currentPosition.x + 1 < settings.maxHeight + 1)
                && (currentPosition.y + 1 < settings.maxWidth + 1)
              ) {
                currentPosition.x += 1;
                currentPosition.y += 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'SE':
            case 'ES':
              if ((currentPosition.x - 1 > -1) && (currentPosition.y + 1 < settings.maxWidth + 1)) {
                currentPosition.x -= 1;
                currentPosition.y += 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'SW':
            case 'WS':
              if ((currentPosition.x - 1 > -1) && (currentPosition.y - 1 > -1)) {
                currentPosition.x -= 1;
                currentPosition.y -= 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'NW':
            case 'WN':
              if (
                (currentPosition.x + 1 < settings.maxHeight + 1)
                && (currentPosition.y - 1 > -1)
              ) {
                currentPosition.x += 1;
                currentPosition.y -= 1;
              } else {
                settings.output.push('OUCH!');
                collisions += 1;
              }
              break;
            case 'G':
            case 'D':
              locationString = `${currentPosition.x}-${currentPosition.y}`;

              crateAtLocation = checkForCrate(settings, locationString);

              if (command === 'G' && crateAtLocation === true && settings.crateOnBoard === false) {
                settings.crateLocations[locationString] = false;
                settings.crateOnBoard = true;
                crateAtLocation = checkForCrate(settings, locationString);
              }

              if (command === 'D' && crateAtLocation === false && settings.crateOnBoard === true) {
                settings.crateLocations[locationString] = true;
                settings.crateOnBoard = false;
                crateAtLocation = checkForCrate(settings, locationString);
              }
              break;
            default:
              settings.output.push(`Invalid command: ${command}`);
              invalidCount += 1;
              invalidCommands.push(command);
              break;
          }
          settings.output.push(`Position x: ${currentPosition.x} y: ${currentPosition.y}`);
        });

        settings.crateAtLocation = crateAtLocation;
        settings.output.push(currentPosition);
        settings.x = currentPosition.x;
        settings.y = currentPosition.y;
        settings.collisions = collisions;
        settings.invalidCount = invalidCount;
        settings.invalidCommands = invalidCommands;
        return settings;
      },
      outputRobot = (warehouse, commandString) => {
        const result = moveRobot(warehouse, commandString);
        result.output.forEach((logline) => {
          // eslint-disable-next-line no-console
          console.log(logline);
        });
      },
      config = resetConfig();

/* commands may be commented out to reduce noise in tests while developing */
outputRobot(config, 'N E S W');
outputRobot(config, 'N E N E N E N E');

exports.moveRobot = moveRobot;
exports.resetConfig = resetConfig;
