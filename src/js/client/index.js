class KunsidoClient {
    constructor(options = {}) {
        this.options = options;
    }

    start() {
        let _options = {
            protocol: this.options.protocol || 'http',
            host: this.options.host || 'localhost',
            port: this.options.port || 1337,
            onRoomUpdate: typeof this.options.onRoomUpdate === 'function' ? this.options.onRoomUpdate : function(){},
            onConnectionRequest: typeof this.options.onConnectionRequest === 'function' ? this.options.onConnectionRequest : function(){console.warn('WARNING: No onConnectionRequest function provided to client.')},
            onHost: typeof this.options.onHost === 'function' ? this.options.onHost : function(){console.warn('WARNING: No onHost function provided to client.')},
            onJoin: typeof this.options.onJoin === 'function' ? this.options.onJoin : function(){console.warn('WARNING: No onJoin function provided to client.')}
        };
        this.client = require('./client')(_options);
        return this.client;
    }
}

module.exports = (...args) => {
    return new KunsidoClient(...args);
}