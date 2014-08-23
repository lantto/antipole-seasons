(function($, Vue, window, undefined) {

'use strict';

var utils = {
    random: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
};

var config = {
    logicTimer: 2000,
    pool: 10000
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
        
        // TODO: Use a pool instead so the total is always the same
        
        this.energy = 2500;
        this.food = 2500;
        this.water = 2500;
        
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
        var solstice = parseInt(nature.$data.solstice),
            weather = parseInt(nature.$data.weather),
            season = parseInt(nature.$data.season),
            energyAlter = (weather + season - solstice) * this.modifier,
            foodAlter = (solstice + season - weather) * this.modifier,
            waterAlter = (weather + solstice - season) * this.modifier;
            
        this.energy += energyAlter - 100;
        this.food += foodAlter - 100;
        this.water += waterAlter - 100;
        
        if (this.energy <= 0
            || this.food <= 0
            || this.water <=  0
        ) {
            alert(this.id + 'ern village died');
        }
        
        /****************
         *   SOL WEA SEA
         * E  -   +   +
         * F  +   -   +
         * W  +   +   -
         ****************/
         
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