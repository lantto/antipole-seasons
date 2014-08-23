(function($, Vue, window, undefined) {

'use strict';

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
    degeneration: 60
};

var nature = new Vue({
    el: '#nature',
    data: {
        solstice: 0,
        weather: 0,
        season: 0
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
            
            var resources = ['energy', 'food', 'water', 'happiness', 'chill', 'heat'];
            
            var pool = config.pool.slice(0);
            
            while (resources.length > 0) {
                var resourceIndex = utils.random(0, resources.length - 1);
                var poolIndex = utils.random(0, pool.length - 1);
                this[resources[resourceIndex]] += pool[poolIndex];
                
                switch (config.pool.indexOf(pool[poolIndex])) {
                    case 0:
                    case 1:
                        resourcesForSecondVillage[resources[resourceIndex]] = config.pool[4];
                        break;
                    case 2:
                    case 3:
                        resourcesForSecondVillage[resources[resourceIndex]] = config.pool[2];
                        break;
                    case 4:
                    case 5:
                        resourcesForSecondVillage[resources[resourceIndex]] = config.pool[0];
                        break;
                }
                
                resources.splice(resourceIndex, 1);
                pool.splice(poolIndex, 1);
            }
        } else {
            console.log(resourcesForSecondVillage);
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
        
        if (this.energy > config.maxValue) this.energy = config.maxValue;
        if (this.food > config.maxValue) this.food = config.maxValue;
        if (this.water > config.maxValue) this.water = config.maxValue;
        if (this.happiness > config.maxValue) this.happiness = config.maxValue;
        if (this.chill > config.maxValue) this.chill = config.maxValue;
        if (this.heat > config.maxValue) this.heat = config.maxValue;
        
        if (this.energy <= 0
            || this.food <= 0
            || this.water <= 0
            || this.happiness <= 0
            || this.chill <= 0
            || this.heat <= 0
        ) {
            console.log(this.id + 'ern village died');
        }
         
        $('#' + this.id + ' .energy').html(this.energy);
        $('#' + this.id + ' .food').html(this.food);
        $('#' + this.id + ' .water').html(this.water);
        $('#' + this.id + ' .happiness').html(this.happiness);
        $('#' + this.id + ' .chill').html(this.chill);
        $('#' + this.id + ' .heat').html(this.heat);
        
        $('#' + this.id + ' .energy-alter').html(energyAlter);
        $('#' + this.id + ' .food-alter').html(foodAlter);
        $('#' + this.id + ' .water-alter').html(waterAlter);
        $('#' + this.id + ' .happiness-alter').html(happinessAlter);
        $('#' + this.id + ' .chill-alter').html(chillAlter);
        $('#' + this.id + ' .heat-alter').html(heatAlter);
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

})(jQuery, Vue, window);