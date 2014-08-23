(function($, window, undefined) {

'use strict';

var config = {
    logicTimer: 2000
};

Village = (function() {
    function Village(id) {
        this.id = id;
    
        this.energy = 10;
        this.food = 10;
        this.water = 10;
    }

    Village.prototype.update = function(meters) {
        return;
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

})(jQuery, window);