// Setup with `npm install`
// Run me with `node warehouse.js`
// Run tests with `npm run test`
// Run persistent tests during development with `npm run watch test`

console.log('Welcome to Mr. Robot\'s Warehouse'); // https://github.com/guardian/pairing-tests/tree/master/warehouse-robot

const resetConfig = () => {
        return {
          startPostion: { x:5, y:5 },
          maxWidth: 10,
          maxHeight: 10,
          output: [],
          crateLocations: {
            '5-5': true,
            '10-10': true,
          },
          crateOnBoard: false,
        };
      },
      config = resetConfig(),
      moveRobot = (warehouse, commandString) => {

        const sanitiseCommands = (commandString) => {
                return commandString
                .trim()
                .toUpperCase()
                .replace(/\s{2,}/g, ' ');//Replace any instance of more than one space with one
              },
              checkForCrate = (warehouse, locationString) => {
                if(warehouse.crateLocations.hasOwnProperty(locationString) && warehouse.crateLocations[locationString] === true) {
                  return true;
                }
                return false;
              },
              commandList = sanitiseCommands(commandString).split(' ');

        let currentPosition = {
            x: warehouse.startPostion.x,
            y: warehouse.startPostion.y,
          },
          collisions = 0,
          invalidCount = 0,
          invalidCommands = [],
          crateAtLocation;

        commandList.forEach((command) => {
          warehouse.output.push(command)
          switch(command) {
            case 'NULL':
              break;
            case 'N':
              if (currentPosition.x + 1 < warehouse.maxHeight + 1) {
                currentPosition.x++;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'E':
              if (currentPosition.y + 1 < warehouse.maxWidth + 1) {
                currentPosition.y++;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'S':
              if (currentPosition.x - 1 > -1) {
                currentPosition.x--;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'W':
              if (currentPosition.y - 1 > -1) {
                currentPosition.y--;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'NE':
            case 'EN':
              if ((currentPosition.x + 1 < warehouse.maxHeight + 1) && (currentPosition.y + 1 < warehouse.maxWidth + 1)) {
                currentPosition.x++;
                currentPosition.y++;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'SE':
            case 'ES':
              if ((currentPosition.x - 1 > -1) && (currentPosition.y + 1 < warehouse.maxWidth + 1)) {
                currentPosition.x--;
                currentPosition.y++;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'SW':
            case 'WS':
              if ((currentPosition.x - 1 > -1) && (currentPosition.y - 1 > -1)) {
                currentPosition.x--;
                currentPosition.y--;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
              break;
            case 'NW':
            case 'WN':
              if ((currentPosition.x + 1 < warehouse.maxHeight + 1) && (currentPosition.y - 1 > -1)) {
                currentPosition.x++;
                currentPosition.y--;
              } else {
                warehouse.output.push('OUCH!');
                collisions++;
              }
                break;
            case 'G':
            case 'D':
              let locationString = `${currentPosition.x}-${currentPosition.y}`;

              crateAtLocation = checkForCrate(warehouse, locationString);

              if(command === 'G' && crateAtLocation === true && warehouse.crateOnBoard === false) {
                warehouse.crateLocations[locationString] = false;
                warehouse.crateOnBoard = true;
                crateAtLocation = checkForCrate(warehouse, locationString);
              }

              if(command === 'D' && crateAtLocation === false && warehouse.crateOnBoard === true) {
                warehouse.crateLocations[locationString] = true;
                warehouse.crateOnBoard = false;
                crateAtLocation = checkForCrate(warehouse, locationString);
              }
              break;
            default:
              warehouse.output.push(`Invalid command: ${command}`);
              invalidCount++;
              invalidCommands.push(command);
              break;
          }
          warehouse.output.push(`Position x: ${currentPosition.x} y: ${currentPosition.y}`);

        });

        warehouse.crateAtLocation = crateAtLocation;
        warehouse.output.push(currentPosition)
        warehouse.x = currentPosition.x;
        warehouse.y = currentPosition.y;
        warehouse.collisions = collisions;
        warehouse.invalidCount = invalidCount;
        warehouse.invalidCommands = invalidCommands;
        return warehouse;
      },
      outputRobot = (warehouse, commandString) => {
        const result = moveRobot(warehouse, commandString);
        result.output.forEach((logline) => {
          console.log(logline);
        });
      };

/* commands commented out to reduce noise in tests while developing */
// outputRobot(config, 'N E S W');
// outputRobot(config, 'N E N E N E N E');

exports.moveRobot = moveRobot;
exports.resetConfig = resetConfig;