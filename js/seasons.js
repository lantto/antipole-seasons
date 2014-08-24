(function($, Vue, window, undefined) {

'use strict';

// RAF shim
var requestAnimFrame = (function(){
    return window.requestAnimationFrame 
           || window.webkitRequestAnimationFrame
           || window.mozRequestAnimationFrame
           || window.oRequestAnimationFrame 
           || window.msRequestAnimationFrame
           || function(callback, element){ window.setTimeout(callback, 1000 / 60); };
})();

// Image loader (by jlongster: https://github.com/jlongster/canvas-game-bootstrap/blob/master/js/resources.js)
var images = (function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    return { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

var utils = {
    random: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
};

var config = {
    logicTimer: 500,
    pool: [7500, 7500, 5000, 5000, 2500, 2500],
    baseValue: 0,
    maxValue: 10000,
    degeneration: 60,
    opposites: {
        energy: 'food',
        food: 'energy',
        water: 'happiness',
        happiness: 'water',
        chill: 'heat',
        heat: 'chill'
    }
};

var resources = [];

for (var prop in config.opposites) {
    resources.push(prop);
}

var nature = new Vue({
    el: '#nature',
    data: {
        solstice: utils.random(-100, 100),
        weather: utils.random(-100, 100),
        season: utils.random(-100, 100)
    }
});

var resourcesForSecondVillage = {};

var Village = (function() {
    function Village(id, modifier, first) {
        this.id = id;
        
        this.modifier = modifier;
        
        if (first) {
            this.energy
            = this.food
            = this.water
            = this.happiness
            = this.chill
            = this.heat 
            = config.baseValue;
            
            var tempResources = resources.slice(0);;
            
            var pool = config.pool.slice(0);
            
            while (tempResources.length > 0) {
                var resourceIndex = utils.random(0, tempResources.length - 1);
                var poolIndex = utils.random(0, pool.length - 1);
                var resource = tempResources[resourceIndex];
                this[resource] += pool[poolIndex];
                tempResources.splice(resourceIndex, 1);
                tempResources.splice(tempResources.indexOf(config.opposites[resource]), 1);
                resourcesForSecondVillage[config.opposites[resource]] = pool[poolIndex];
                
                var oppositePool;
                
                switch (config.pool.indexOf(pool[poolIndex])) {
                    case 0:
                    case 1:
                        resourcesForSecondVillage[resource]
                        = this[config.opposites[resource]]
                        = oppositePool
                        = config.pool[4];
                        break;
                    case 2:
                    case 3:
                        resourcesForSecondVillage[resource]
                        = this[config.opposites[resource]]
                        = oppositePool
                        = config.pool[2];
                        break;
                    case 4:
                    case 5:
                        resourcesForSecondVillage[resource]
                        = this[config.opposites[resource]]
                        = oppositePool
                        = config.pool[0];
                        break;
                }
                
                pool.splice(poolIndex, 1);
                pool.splice(pool.indexOf(oppositePool), 1);
            }
        } else {
            for (var resource in resourcesForSecondVillage) {
                this[resource] = config.baseValue + resourcesForSecondVillage[resource];
            }
        }
    }

    Village.prototype.update = function() {
        var solstice = parseInt(nature.$data.solstice) * this.modifier,
            weather = parseInt(nature.$data.weather) * this.modifier,
            season = parseInt(nature.$data.season) * this.modifier,
            energyAlter = this.getIncrementValue(-solstice),
            foodAlter = this.getIncrementValue(solstice),
            waterAlter = this.getIncrementValue(weather),
            happinessAlter = this.getIncrementValue(-weather),
            chillAlter = this.getIncrementValue(season),
            heatAlter = this.getIncrementValue(-season);

        /****************
         *   SOL WEA SEA
         * E  -         
         * F  +       
         * W      +   
         * :)     -
         * C          +
         * H          -
         ****************/
        
        this.energy += energyAlter;
        this.food += foodAlter;
        this.water += waterAlter;
        this.happiness += happinessAlter;
        this.chill += chillAlter;
        this.heat += heatAlter;

        for (var i = 0; i < resources.length; i++) {
            $('#' + this.id + ' .' + resources[i]).html(this[resources[i]]);
            if (this[resources[i]] > config.maxValue) this[resources[i]] = config.maxValue; // Will this ever happen?
        }
        
        $('#' + this.id + ' .energy-alter').html(energyAlter);
        $('#' + this.id + ' .food-alter').html(foodAlter);
        $('#' + this.id + ' .water-alter').html(waterAlter);
        $('#' + this.id + ' .happiness-alter').html(happinessAlter);
        $('#' + this.id + ' .chill-alter').html(chillAlter);
        $('#' + this.id + ' .heat-alter').html(heatAlter);
        
        if (this.energy <= 0
            || this.food <= 0
            || this.water <= 0
            || this.happiness <= 0
            || this.chill <= 0
            || this.heat <= 0
        ) {
            console.log(this.id + 'ern village died');
        }
    };
    
    Village.prototype.getIncrementValue = function(element) {
        return 50 + element / 2 - config.degeneration;
    };

    return Village;
})();

var west = new Village('west', -1, true);
var east = new Village('east', 1);

var logicLoop = function() {
    west.update();
    east.update();
    
    setTimeout(logicLoop, config.logicTimer);
}

setTimeout(logicLoop, config.logicTimer);



var Entity = (function() {
    function Entity(id, modifier, first) {
    
    };
    
    Entity.prototype.update = function() {
    
    };
    
    Entity.prototype.render = function() {
    
    };
})();

var lastTime;
var renderLoop = function() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    
    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

renderLoop();

})(jQuery, Vue, window);