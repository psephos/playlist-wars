//=============================================================================
// Stars
//=============================================================================
Stars = {
  Defaults: {
    fullscreen: true,
    stats: true,
    dx: -2,
    dy: 0,
    maxspeed: 10,
    layers: [{
      percent: 30,
      size: {
        min: 0.4,
        max: 1.0
      },
      speed: {
        min: 1,
        max: 2
      },
      colors: ['#111', '#111', '#811']
    }, // 1 in 3 get a tint of red
    {
      percent: 25,
      size: {
        min: 0.6,
        max: 1.2
      },
      speed: {
        min: 2,
        max: 4
      },
      colors: ['#333', '#333', '#833']
    }, // 1 in 3 get a tint of red
    {
      percent: 15,
      size: {
        min: 0.8,
        max: 1.4
      },
      speed: {
        min: 4,
        max: 8
      },
      colors: ['#555', '#555', '#855']
    }, // 1 in 3 get a tint of red
    {
      percent: 15,
      size: {
        min: 1.0,
        max: 1.6
      },
      speed: {
        min: 8,
        max: 16
      },
      colors: ['#777']
    }, {
      percent: 8,
      size: {
        min: 1.2,
        max: 1.8
      },
      speed: {
        min: 16,
        max: 32
      },
      colors: ['#999']
    }, {
      percent: 4,
      size: {
        min: 1.4,
        max: 2.0
      },
      speed: {
        min: 32,
        max: 64
      },
      colors: ['#BBB']
    }, {
      percent: 2,
      size: {
        min: 1.6,
        max: 2.2
      },
      speed: {
        min: 64,
        max: 128
      },
      colors: ['#DDD']
    }, {
      percent: 1,
      size: {
        min: 1.8,
        max: 2.4
      },
      speed: {
        min: 128,
        max: 256
      },
      colors: ['#FFF']
    }]
  },
  //-----------------------------------------------------------------------------
  initialize: function (runner, cfg) {
    this.cfg = cfg;
    this.runner = runner;
    this.width = runner.width;
    this.height = runner.height;
    this.initLayers(cfg.layers);
    this.initStars();
    this.runner.start();
  },
  update: function (dt) {
    var star, n, max = this.stars.length;
    for (n = 0; n < max; n++) {
      star = this.stars[n];
      star.x = star.x + (this.cfg.dx * star.speed * dt);
      star.y = star.y + (this.cfg.dy * star.speed * dt);
      if ((star.x < 0) || (star.y < 0) || (star.x > this.width) || (star.y > this.height)) this.repositionStar(star);
    }
  },
  draw: function (ctx) {
    var star, n;
    for (n = 0; n < this.stars.length; n++) {
      star = this.stars[n];
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
    ctx.fillStyle = 'white';
    //ctx.fillText("dx: " + this.cfg.dx, 30, 40);
    //ctx.fillText("dy: " + this.cfg.dy, 30, 50);
  },
  initLayers: function (layers) {
    var n, sum = 0,
      l;
    for (n = 0; n < layers.length; n++) {
      l = layers[n];
      l.min = sum;
      l.max = sum + l.percent;
      sum = l.max;
    }
    this.layers = layers;
  },
  initStars: function () {
    var n, layer, count = (this.height / 2); // good ballpark for sensible number of stars based on screensize
    this.stars = [];
    for (n = 0; n < count; n++) {
      layer = this.randomLayer();
      this.stars.push({
        layer: layer,
        color: Game.randomChoice(layer.colors),
        speed: Game.random(layer.speed.min, layer.speed.max),
        size: Game.random(layer.size.min, layer.size.max),
        x: Game.random(0, this.width),
        y: Game.random(0, this.height)
      });
    }
  },
  repositionStar: function (star) {
    var horizontal = (this.cfg.dy == 0);
    var vertical = (this.cfg.dx == 0);
    if (horizontal || (!horizontal && !vertical && Game.randomBool())) {
      star.x = (this.cfg.dx > 0) ? 0 : this.width;
      star.y = Game.random(0, this.height);
    } else {
      star.x = Game.random(0, this.width);
      star.y = (this.cfg.dy > 0) ? 0 : this.height;
    }
  },
  randomLayer: function () {
    var i, n = Game.random(1, 100);
    for (i = 0; i < this.layers.length; i++) {
      if (n <= this.layers[i].max) return this.layers[i];
    }
  },
  changeDirection: function (dir) {
    if ((dir == 'left') && (this.cfg.dx < this.cfg.maxspeed)) this.cfg.dx = (this.cfg.dx == -1) && (this.cfg.dy == 0) ? 1 : this.cfg.dx + 1;
    else if ((dir == 'right') && (this.cfg.dx > -this.cfg.maxspeed)) this.cfg.dx = (this.cfg.dx == 1) && (this.cfg.dy == 0) ? -1 : this.cfg.dx - 1;
    else if ((dir == 'up') && (this.cfg.dy < this.cfg.maxspeed)) this.cfg.dy = (this.cfg.dy == -1) && (this.cfg.dx == 0) ? 1 : this.cfg.dy + 1;
    else if ((dir == 'down') && (this.cfg.dy > -this.cfg.maxspeed)) this.cfg.dy = (this.cfg.dy == 1) && (this.cfg.dx == 0) ? -1 : this.cfg.dy - 1;
  },
  onkeydown: function (keyCode) {
    if (keyCode == Game.KEY.DOWN) this.changeDirection('down');
    else if (keyCode == Game.KEY.UP) this.changeDirection('up');
    else if (keyCode == Game.KEY.RIGHT) this.changeDirection('right');
    else if (keyCode == Game.KEY.LEFT) this.changeDirection('left');
  },
  onresize: function (width, height) {
    this.width = width;
    this.height = height;
    this.initStars();
  },
  //=============================================================================
}; // Stars

//=============================================================================
//
// We need some ECMAScript 5 methods but we need to implement them ourselves
// for older browsers (compatibility: http://kangax.github.com/es5-compat-table/)
//
//  Function.bind:        https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
//  Object.create:        http://javascript.crockford.com/prototypal.html
//  Object.extend:        (defacto standard like jquery $.extend or prototype's Object.extend)
//
//  Object.construct:     our own wrapper around Object.create that ALSO calls
//                        an initialize constructor method if one exists
//
//=============================================================================

if (!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    var slice = [].slice,
        args  = slice.call(arguments, 1),
        self  = this,
        nop   = function () {},
        bound = function () {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));   
        };
    nop.prototype   = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}

if (!Object.create) {
  Object.create = function(base) {
    function F() {};
    F.prototype = base;
    return new F();
  }
}

if (!Object.construct) {
  Object.construct = function(base) {
    var instance = Object.create(base);
    if (instance.initialize)
      instance.initialize.apply(instance, [].slice.call(arguments, 1));
    return instance;
  }
}

if (!Object.extend) {
  Object.extend = function(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property))
        destination[property] = source[property];
    }
    return destination;
  };
}

/* NOT READY FOR PRIME TIME
if (!window.requestAnimationFrame) {// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame    || 
                                 window.oRequestAnimationFrame      || 
                                 window.msRequestAnimationFrame     || 
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}
*/

//=============================================================================
// GAME
//=============================================================================

Game = {

  compatible: function() {
    return Object.create &&
           Object.extend &&
           Function.bind &&
           document.addEventListener && // HTML5 standard, all modern browsers that support canvas should also support add/removeEventListener
           Game.ua.hasCanvas
  },

  start: function(id, game, cfg) {
    if (Game.compatible())
      return Game.current = Object.construct(Game.Runner, id, game, cfg).game; // return the game instance, not the runner (caller can always get at the runner via game.runner)
  },

  ua: function() { // should avoid user agent sniffing... but sometimes you just gotta do what you gotta do
    var ua  = navigator.userAgent.toLowerCase();
    var key =        ((ua.indexOf("opera")   > -1) ? "opera"   : null);
        key = key || ((ua.indexOf("firefox") > -1) ? "firefox" : null);
        key = key || ((ua.indexOf("chrome")  > -1) ? "chrome"  : null);
        key = key || ((ua.indexOf("safari")  > -1) ? "safari"  : null);
        key = key || ((ua.indexOf("msie")    > -1) ? "ie"      : null);

    try {
      var re      = (key == "ie") ? "msie (\\d)" : key + "\\/(\\d\\.\\d)"
      var matches = ua.match(new RegExp(re, "i"));
      var version = matches ? parseFloat(matches[1]) : null;
    } catch (e) {}

    return {
      full:      ua, 
      name:      key + (version ? " " + version.toString() : ""),
      version:   version,
      isFirefox: (key == "firefox"),
      isChrome:  (key == "chrome"),
      isSafari:  (key == "safari"),
      isOpera:   (key == "opera"),
      isIE:      (key == "ie"),
      hasCanvas: (document.createElement('canvas').getContext),
      hasAudio:  (typeof(Audio) != 'undefined')
    }
  }(),

  addEvent:    function(obj, type, fn) { obj.addEventListener(type, fn, false);    },
  removeEvent: function(obj, type, fn) { obj.removeEventListener(type, fn, false); },

  windowWidth:  function() { return window.innerWidth  || /* ie */ document.documentElement.offsetWidth;  },
  windowHeight: function() { return window.innerHeight || /* ie */ document.documentElement.offsetHeight; },

  ready: function(fn) {
    if (Game.compatible())
      Game.addEvent(document, 'DOMContentLoaded', fn);
  },

  createCanvas: function() {
    return document.createElement('canvas');
  },

  createAudio: function(src) {
    try {
      var a = new Audio(src);
      a.volume = 0.1; // lets be real quiet please
      return a;
    } catch (e) {
      return null;
    }
  },

  loadImages: function(sources, callback) { /* load multiple images and callback when ALL have finished loading */
    var images = {};
    var count = sources ? sources.length : 0;
    if (count == 0) {
      callback(images);
    }
    else {
      for(var n = 0 ; n < sources.length ; n++) {
        var source = sources[n];
        var image = document.createElement('img');
        images[source] = image;
        Game.addEvent(image, 'load', function() { if (--count == 0) callback(images); });
        image.src = source;
      }
    }
  },

  random: function(min, max) {
    return (min + (Math.random() * (max - min)));
  },

  randomChoice: function(choices) {
    return choices[Math.round(Game.random(0, choices.length-1))];
  },

  randomBool: function() {
    return Game.randomChoice([true, false]);
  },

  timestamp: function() { 
    return new Date().getTime();
  },

  KEY: {
    BACKSPACE: 8,
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    SPACE:    32,
    LEFT:     37,
    UP:       38,
    RIGHT:    39,
    DOWN:     40,
    DELETE:   46,
    HOME:     36,
    END:      35,
    PAGEUP:   33,
    PAGEDOWN: 34,
    INSERT:   45,
    ZERO:     48,
    ONE:      49,
    TWO:      50,
    A:        65,
    L:        76,
    P:        80,
    Q:        81,
    TILDA:    192
  },

  //-----------------------------------------------------------------------------

  Runner: {

    initialize: function(id, game, cfg) {
      this.cfg          = Object.extend(game.Defaults || {}, cfg || {}); // use game defaults (if any) and extend with custom cfg (if any)
      this.fps          = this.cfg.fps || 60;
      this.interval     = 1000.0 / this.fps;
      this.canvas       = document.getElementById(id);
      this.width        = this.cfg.fullscreen ? Game.windowWidth()  : (this.cfg.width  || this.canvas.offsetWidth);
      this.height       = this.cfg.fullscreen ? Game.windowHeight() : (this.cfg.height || this.canvas.offsetHeight);
      this.front        = this.canvas;
      this.front.width  = this.width;
      this.front.height = this.height;
      this.back         = Game.createCanvas();
      this.back.width   = this.width;
      this.back.height  = this.height;
      this.front2d      = this.front.getContext('2d');
      this.back2d       = this.back.getContext('2d');
      this.addEvents();
      this.resetStats();

      this.game = Object.construct(game, this, this.cfg); // finally construct the game object itself
    },

    start: function() { // game instance should call runner.start() when its finished initializing and is ready to start the game loop
      this.lastFrame = Game.timestamp();
      this.timer     = setInterval(this.loop.bind(this), this.interval);
    },

    stop: function() {
      clearInterval(this.timer);
    },

    loop: function() {
      var start  = Game.timestamp(); this.update((start - this.lastFrame)/1000.0); // send dt as seconds
      var middle = Game.timestamp(); this.draw();
      var end    = Game.timestamp();
      this.updateStats(middle - start, end - middle);
      this.lastFrame = start;
    },

    update: function(dt) {
      this.game.update(dt);
    },

    draw: function() {
//      this.back2d.clearRect(0, 0, this.width, this.height);
//      this.game.draw(this.back2d);
//      this.drawStats(this.back2d);
//      this.front2d.clearRect(0, 0, this.width, this.height);
//      this.front2d.drawImage(this.back, 0, 0);
      this.front2d.clearRect(0, 0, this.width, this.height);
      this.game.draw(this.front2d);
      //this.drawStats(this.front2d);
    },

    resetStats: function() {
      this.stats = {
        count:  0,
        fps:    0,
        update: 0,
        draw:   0, 
        frame:  0  // update + draw
      };
    },

    updateStats: function(update, draw) {
      if (this.cfg.stats) {
        this.stats.update = Math.max(1, update);
        this.stats.draw   = Math.max(1, draw);
        this.stats.frame  = this.stats.update + this.stats.draw;
        this.stats.count  = this.stats.count == this.fps ? 0 : this.stats.count + 1;
        this.stats.fps    = Math.min(this.fps, 1000 / this.stats.frame);
      }
    },

    drawStats: function(ctx) {
      if (this.cfg.stats) {
        ctx.fillStyle = 'white';
        ctx.fillText("frame: "  + Math.round(this.stats.count),         this.width - 100, this.height - 60);
        ctx.fillText("fps: "    + Math.round(this.stats.fps),           this.width - 100, this.height - 50);
        ctx.fillText("update: " + Math.round(this.stats.update) + "ms", this.width - 100, this.height - 40);
        ctx.fillText("draw: "   + Math.round(this.stats.draw)   + "ms", this.width - 100, this.height - 30);
      }
    },

    addEvents: function() {
      Game.addEvent(document, 'keydown', this.onkeydown.bind(this));
      Game.addEvent(document, 'keyup',   this.onkeyup.bind(this));
      Game.addEvent(window,   'resize',  this.resize.bind(this));
    },

    resize: function() {
      if (this.cfg.fullscreen) {
        this.width  = this.front.width  = this.back.width  = Game.windowWidth();
        this.height = this.front.height = this.back.height = Game.windowHeight();
        this.front.style.width  = this.back.style.width  = this.width  + "px";
        this.front.style.height = this.back.style.height = this.height + "px";
        if (this.game.onresize)
          this.game.onresize(this.width, this.height);
      }
    },

    onkeydown: function(ev) { if (this.game.onkeydown) this.game.onkeydown(ev.keyCode); },
    onkeyup:   function(ev) { if (this.game.onkeyup)   this.game.onkeyup(ev.keyCode);   },

    hideCursor: function() { this.canvas.style.cursor = 'none'; },
    showCursor: function() { this.canvas.style.cursor = 'auto'; },

    alert: function(msg) {
      this.stop(); // alert blocks thread, so need to stop game loop in order to avoid sending huge dt values to next update
      result = window.alert(msg);
      this.start();
      return result;
    },

    confirm: function(msg) {
      this.stop(); // alert blocks thread, so need to stop game loop in order to avoid sending huge dt values to next update
      result = window.confirm(msg);
      this.start();
      return result;
    }

    //-------------------------------------------------------------------------

  } // Game.Runner
} // Game