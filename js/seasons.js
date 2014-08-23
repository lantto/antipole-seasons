(function($, Vue, window, undefined) {

'use strict';

var config = {
    logicTimer: 2000
};

var nature = new Vue({
    el: '#nature',
    data: {
        solstice: 100,
        weather: -100,
        season: -100
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