(function($, Vue, window, undefined) {

'use strict';

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
    
        this.energy = 1000;
        this.food = 1000;
        this.water = 1000;
        

    }

    Village.prototype.update = function() {
        this.energy += (nature.$data.weather + nature.$data.season - nature.$data.solstice) * this.modifier;
        this.food += (nature.$data.solstice + nature.$data.season - nature.$data.weather) * this.modifier;
        this.water += (nature.$data.weather + nature.$data.solstice - nature.$data.season) * this.modifier;
        
        /****************
         *   SOL WEA SEA
         * E  -   +   +
         * F  +   -   +
         * W  +   +   -
         ****************/
         
        $('#' + this.id + ' .energy').html(this.energy);
        $('#' + this.id + ' .food').html(this.food);
        $('#' + this.id + ' .water').html(this.water);
    };

    return Village;
})();

var west = new Village('west', 1);
var east = new Village('east', -1);

var logicLoop = function() {
    west.update();
    east.update();
    
    setTimeout(logicLoop, config.logicTimer);
}

setTimeout(logicLoop, config.logicTimer);

})(jQuery, Vue, window);