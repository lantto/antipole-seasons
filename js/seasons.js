(function($, Vue, window, undefined) {

'use strict';

var utils = {
    random: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
};

var config = {
    logicTimer: 2000
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
    
        this.energy = utils.random(0, 10000);
        this.food = utils.random(0, 10000);
        this.water = utils.random(0, 10000);
    }

    Village.prototype.update = function() {
        var solstice = parseInt(nature.$data.solstice),
            weather = parseInt(nature.$data.weather),
            season = parseInt(nature.$data.season),
            energyAlter = (weather + season - solstice) * this.modifier,
            foodAlter = (solstice + season - weather) * this.modifier,
            waterAlter = (weather + solstice - season) * this.modifier;
            
        this.energy += energyAlter;
        this.food += foodAlter;
        this.water += waterAlter;
        
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