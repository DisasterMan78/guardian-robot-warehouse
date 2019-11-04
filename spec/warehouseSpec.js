/* global describe, beforeEach, it, expect */

const { moveRobot, resetConfig } = require('../warehouse');

describe('Test movement', () => {
  let config;

  beforeEach(() => {
    config = resetConfig();
  });

  it('should should move north when requested', () => {
    const command = 'N',
          result = moveRobot(config, command);

    expect(result.x).toBe(config.startPostion.x);
    expect(result.y).toBe(6);
  });

  it('should should move east when requested', () => {
    const command = 'E',
          result = moveRobot(config, command);

    expect(result.x).toBe(6);
    expect(result.y).toBe(config.startPostion.y);
  });

  it('should should move south when requested', () => {
    const command = 'S',
          result = moveRobot(config, command);

    expect(result.x).toBe(config.startPostion.x);
    expect(result.y).toBe(4);
  });

  it('should should move west when requested', () => {
    const command = 'W',
          result = moveRobot(config, command);

    expect(result.x).toBe(4);
    expect(result.y).toBe(config.startPostion.y);
  });

  it('should should move south-east when requested', () => {
    const command = 'NE',
          result = moveRobot(config, command);

    expect(result.x).toBe(6);
    expect(result.y).toBe(6);
  });

  it('should should move south-east when requested', () => {
    const command = 'SE',
          result = moveRobot(config, command);

    expect(result.x).toBe(6);
    expect(result.y).toBe(4);
  });

  it('should should move south-west when requested', () => {
    const command = 'SW',
          result = moveRobot(config, command);

    expect(result.x).toBe(4);
    expect(result.y).toBe(4);
  });

  it('should should move north-west when requested', () => {
    const command = 'NW',
          result = moveRobot(config, command);

    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should should return to start with the command N E S W', () => {
    const command = 'N E S W',
          result = moveRobot(config, command);

    expect(result.x).toBe(config.startPostion.x);
    expect(result.y).toBe(config.startPostion.y);
  });

  it('should should finish on 9,9 with the command N E N E N E N E', () => {
    const command = 'N E N E N E N E',
          result = moveRobot(config, command);

    expect(result.x).toBe(9);
    expect(result.y).toBe(9);
  });

  it('should detect collisions and not drive through walls', () => {
    const command = 'N N N N N N',
          result = moveRobot(config, command);

    expect(result.x).toBe(5);
    expect(result.y).toBe(10);
    expect(result.collisions).toBe(1);
  });

  it('should count collisions', () => {
    const command = 'N N N N N N S E E E E E E',
          result = moveRobot(config, command);

    expect(result.x).toBe(10);
    expect(result.y).toBe(9);
    expect(result.collisions).toBe(2);
  });

  it('should reject and log invalid commands', () => {
    const command = 'N invalid N junk N',
          result = moveRobot(config, command);

    expect(result.x).toBe(5);
    expect(result.y).toBe(8);
    expect(result.invalidCount).toBe(2);
    expect(result.invalidCommands).toEqual(['INVALID', 'JUNK']);
  });

  it('should not care about excess whitespace', () => {
    const command = ' N  N   N ',
          result = moveRobot(config, command);

    expect(result.x).toBe(5);
    expect(result.y).toBe(8);
    expect(result.invalidCount).toBe(0);
  });

  it('should not care about case', () => {
    const command = 'N n N',
          result = moveRobot(config, command);

    expect(result.x).toBe(5);
    expect(result.y).toBe(8);
    expect(result.invalidCount).toBe(0);
  });

  it('should pick up crates if one is present when requested', () => {
    const command = 'null G',
          result = moveRobot(config, command);

    expect(result.crateOnBoard).toBe(true);
    expect(result.crateAtLocation).toBe(false);
    expect(result.crateLocations['5-5']).toBe(false);
  });

  it('should not pick up crates if none is present when requested', () => {
    const command = 'N G',
          result = moveRobot(config, command);

    expect(result.x).toBe(5);
    expect(result.y).toBe(6);
    expect(result.crateOnBoard).toBe(false);
    expect(result.crateAtLocation).toBe(false);
  });

  it('should not pick up crates if one is already on board when requested', () => {
    const command = 'null G ne ne ne ne ne G',
          result = moveRobot(config, command);

    expect(result.x).toBe(10);
    expect(result.y).toBe(10);
    expect(result.crateOnBoard).toBe(true);
    expect(result.crateAtLocation).toBe(true);
    expect(result.crateLocations['5-5']).toBe(false);
  });

  it('should drop crates when requested', () => {
    const command = 'null G n d',
          result = moveRobot(config, command);

    expect(result.x).toBe(5);
    expect(result.y).toBe(6);
    expect(result.crateOnBoard).toBe(false);
    expect(result.crateAtLocation).toBe(true);
    expect(result.crateLocations['5-5']).toBe(false);
  });
});
