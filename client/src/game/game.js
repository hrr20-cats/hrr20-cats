// create the game instance
var game = new RL.Game();

var mapData = [
    "#####################",
    "#.........#.........#",
    "#....Z....#....##...#",
    "#.........+....##...#",
    "#.........#.........#",
    "#.#..#..#.#.........#",
    "#.........#...####+##",
    "#.........#...#.....#",
    "#.........#...#.....#",
    "#.........#...#.....#",
    "#####################"
];

var mapCharToType = {
    '#': 'wall',
    '.': 'floor',
    '+': 'door'
};

var entityCharToType = {
    'Z': 'zombie'
};

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
};

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');
game.entityManager.loadFromArrayString(mapData, entityCharToType);

// generate and assign a map object (repaces empty default)
game.setMapSize(game.map.width, game.map.height);

// add input keybindings
game.input.addBindings(keyBindings);

// create entities and add to game.entityManager
var entZombie = new RL.Entity(game, 'zombie');
game.entityManager.add(2, 8, entZombie);

// or just add by entity type
game.entityManager.add(5, 9, 'zombie');

// set player starting position
game.player.x = 3;
game.player.y = 3;

// make the view a little smaller
game.renderer.resize(5, 5);

// get existing DOM elements
var mapContainerEl = document.getElementById('example-map-container');
var consoleContainerEl = document.getElementById('example-console-container');

// append elements created by the game to the DOM
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);

game.renderer.layers = [
    new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false}),
];

// start the game


class GameAppConnector {
  constructor(app) {
    this.game = window.game;
    this.game.start();
    this.game.console.log('The game starts.');
    this.app = app;
    this.grid = undefined;
  }

  setGrid(grid) {
    this.grid = JSON.parse(JSON.stringify(this.app.state.grid));
  }

  drawSquare(x, y, char) {
    var gridNumber = (y * 5) + (x + 1);
    var contents = null;
    if (char === '@') {
      this.app.setState({
        player: {
            position: gridNumber,
            previousPosition: 1,
            health: 100
        }
      });
      contents = 'player';
    } else if (char === '.') {
      contents = 'grass';
    } else if (char === '#') {
      contents = 'potion';
    } else if (char === 'z') {
      contents = 'enemy';
    } else if (char === '+') {
      contents = 'door';
    } else {
      return;
    }
    this.grid[gridNumber] = {
      id: gridNumber,
      item: contents
    };
  }

  updateGrid() {
    this.app.setState({
      grid: this.grid
    });
  }
};