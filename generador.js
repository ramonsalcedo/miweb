(function() {
    exports.onConnect = function(client, done) {
        client.emit('test', 'TEST');
        done();
    };
    exports.sendMessage = function(client, done) {
        done();
    };
})();