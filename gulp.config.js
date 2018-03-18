module.exports = {
    port: 9015,
    protocol: 'http',
    domain: 'localhost',
    entry: 'dist/build/index.html',
    paths: {
        index: {
            html: './src/index.html',
            js: './src/index.js',
            scss: './src/index.scss',
        },
        glob: {
            html: './src/**/*.html',
            js: './src/js/**/*.js',
            scss: './src/scss/**/*.scss'
        },
        vendor: {
            js: [
                './node_modules/jquery/dist/jquery.min.js',
                './node_modules/materialize-css/dist/js/materialize.js'
            ],
            css: [
                './node_modules/font-awesome/css/font-awesome.min.css'
            ],
            scss: [
                './node_modules/materialize-css/sass/materialize.scss'
            ],
            fonts: [
                './node_modules/font-awesome/fonts/fontawesome-webfont.*',
                './node_modules/materialize-css/dist/fonts/roboto/*'
            ],
            override: './src/scss/overrides/',
            overrides: [{
                trg: {
                    path: './node_modules/materialize-css/sass/components/',
                    file: '_variables.scss'
                },
                src: '_materialize.scss'
            }]
        },
        img: './src/img/*',
        dist: {
            build: './dist/build',
            test: './dist/test'
        }
    }
}