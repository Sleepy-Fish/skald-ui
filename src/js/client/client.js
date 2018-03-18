class Client {
    constructor(options) {
        this.cookies = require('js-cookie');
        let cid = this.cookies.get('cid');
        let rid = this.cookies.get('rid');
        this.socket = require('socket.io-client').connect(
            options.protocol+'://'+options.host+':'+options.port,
            { query: (cid?"cid="+cid+(rid?"&rid="+rid:""):"")}
        );
        this.socket.on('create_client', function (data) {
            this.cookies.set('cid',data.cid,{ expires: data.expiration });
        }.bind(this));
        this.socket.on('update_room', function (data) {
            this.cookies.set('rid',data.id,{ expires: data.expiration });
            localStorage.setItem('room', JSON.stringify(data.members));
            options.onRoomUpdate(data);
        }.bind(this));
        this.socket.on('connect_request', function(data){
            options.onConnectionRequest(data);
        });
        this.socket.on('connect_host', function(data){
            options.onHost(data);
        });
        this.socket.on('connect_join', function(data){
            options.onJoin(data);
        });
    }

    host(){
        this.socket.emit('connect_client', {
            role: 'host',
            id: this.cookies.get('cid')
        });
    }
    join(rid){
        this.socket.emit('connect_client', {
            role: 'member',
            id: this.cookies.get('cid'),
            room: rid.toUpperCase()
        });
    }
    leave(){
        this.socket.emit('disconnect_client', {
            id: this.cookies.get('cid'),
            room: this.cookies.get('rid')
        });
        this.cookies.remove('cid');
        this.cookies.remove('rid');
        location=location;
    }
}

module.exports = (...args) => {
    return new Client(...args);
}