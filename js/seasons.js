(function($, Vue, window, undefined) {

'use strict';

var config = {
    logicTimer: 2000
};

var nature = new Vue({
    el: '#nature',
    data: {
        solstice: 0,
        weather: -100,
        season: 50
    }
});

var Village = (function() {
    function Village(id) {
        this.id = id;
    
        this.energy = 10;
        this.food = 10;
        this.water = 10;
    }

    Village.prototype.update = function() {
        
    };

    return Village;
})();

var west = new Village('west');
var east = new Village('east');

var logicLoop = function() {
    west.update();
    east.update();
    
    setTimeout(logicLoop, config.logicTimer);
}

setTimeout(logicLoop, config.logicTimer);

})(jQuery, Vue, window);