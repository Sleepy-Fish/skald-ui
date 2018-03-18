var KunsidoClient = require('./client')({
    protocol: 'https',
    host: 'sleepy.fish',
    port: 6557,
    onRoomUpdate: function(data){
        console.log('ROOM UPDATE:');
        console.log(data);
    },
    onConnectionRequest: function(data){
        console.log('CONNETION REQUEST:');
        console.log(data);
    },
    onHost: function(data){
        console.log('HOSTING:');
        console.log(data);
    },
    onJoin: function(data){
        console.log('JOINING:');
        console.log(data);
    }
}).start();

console.log(KunsidoClient);