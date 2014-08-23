(function($, Vue, window, undefined) {

'use strict';

var utils = {
    random: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
};

var config = {
    logicTimer: 2000,
    pool: 10000,
    baseValue: 2500,
    degeneration: 200
};

var nature = new Vue({
    el: '#nature',
    data: {
        solstice: 0,
        weather: 0,
        season: 0
    }
});

var Village = (function() {
    function Village(id, modifier) {
        this.id = id;
        
        this.modifier = modifier;
        
        this.energy = config.baseValue;
        this.food = config.baseValue;
        this.water = config.baseValue;
        
        var resources = ['energy', 'food', 'water'];
        var pool = config.pool;
        
        while (resources.length > 0) {
            var index = utils.random(0, resources.length - 1);
            var add = utils.random(0, pool);
            this[resources[index]] += add;
            pool -= add;
            resources.splice(index, 1);
        }
    }

    Village.prototype.update = function() {
        var solstice = parseInt(nature.$data.solstice) * this.modifier,
            weather = parseInt(nature.$data.weather) * this.modifier,
            season = parseInt(nature.$data.season) * this.modifier,
            energyAlter = (50 - solstice / 2) + (50 + season / 2),
            foodAlter = (50 - weather / 2) + (50 + solstice / 2),
            waterAlter = (50 - season / 2) + (50 + weather / 2);
        
        /****************
         *   SOL WEA SEA
         * E  -       + 
         * F  +   -   
         * W      +   -
         ****************/
            
        this.energy += energyAlter - config.degeneration;
        this.food += foodAlter - config.degeneration;
        this.water += waterAlter - config.degeneration;
        
        if (this.energy <= 0
            || this.food <= 0
            || this.water <= 0
        ) {
            console.log(this.id + 'ern village died');
        }
         
        $('#' + this.id + ' .energy').html(this.energy);
        $('#' + this.id + ' .food').html(this.food);
        $('#' + this.id + ' .water').html(this.water);
        
        $('#' + this.id + ' .energy-alter').html(energyAlter);
        $('#' + this.id + ' .food-alter').html(foodAlter);
        $('#' + this.id + ' .water-alter').html(waterAlter);
    };

    return Village;
})();

var west = new Village('west', -1);
var east = new Village('east', 1);

var logicLoop = function() {
    west.update();
    east.update();
    
    setTimeout(logicLoop, config.logicTimer);
}

setTimeout(logicLoop, config.logicTimer);

})(jQuery, Vue, window);