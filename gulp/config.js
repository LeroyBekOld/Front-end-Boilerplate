// General paths
var source = './src';
var development = './test';
var production = './dist';

// Asset paths
var developmentAssets = development + '/assets';
var productionAssets = production + '/assets';

// file paths
var lessFiles = '/less/**/*.less';
var cssFiles = '/css/**/*.css';
var jsFiles = '/js/**/*.js';
var imageFiles = '/img/**/*.{jpg,jpeg,gif,png,svg,bmp}';
var fontFiles = '/fonts/**/*.{eot,woff,woff2,ttf.svg}';
var iconFiles = '/icons/*.svg';
var jadeFiles = '/jade/**/*.jade';
var htmlFiles = '/**/*.html';
var bowerFiles = './bower_components/**/bower.json';


module.exports = {
    clean: {
        development: {
            path: development
        },
        production: {
            path: production
        }
    },
    browserSync: {
        development: {
            server: {
                baseDir: development
            },
            port: 1337, // You know!
            files: [
                developmentAssets + cssFiles,
                developmentAssets + jsFiles,
                developmentAssets + imageFiles,
                developmentAssets + fontFiles,
                developmentAssets + iconFiles,
                development + htmlFiles
            ]
        },
        production: {
            server: {
                baseDir: production
            },
            port: 9001 // It's over 9000!
        }
    },
    less: {
        development: {
            src: source + '/less/main.less',
            dest: developmentAssets + '/css',
            options: {
                dumpLineNumbers: "comments"
            }
        },
        production: {
            src: source + lessFiles,
            dest: productionAssets + '/css',
            options: {
            }
        }
    },
    jade: {
        development: {
            src: source + jadeFiles,
            dest: development,
            options: {
                pretty: true,
                locals: {
                    env: 'development'
                }
            }
        },
        production: {
            src: source + jadeFiles,
            dest: production,
            options: {
                locals: {
                    env: 'production'
                }
            }
        }
    },
    javascript: {
        development: {
            src: source + jsFiles,
            dest: developmentAssets + '/js',
            output: 'main.js'
        },
        production: {
            src: source + jsFiles,
            dest: productionAssets + '/js',
            output: 'all.js'
        }
    },
    fonts: {
        development: {
            src: source + fontFiles,
            dest: developmentAssets + '/fonts'
        },
        production: {
            src: source + jsFiles,
            dest: productionAssets + '/fonts'
        }
    },
    images: {
        development: {
            src: source + imageFiles,
            dest: developmentAssets + '/img'
        },
        production: {
            src: source + imageFiles,
            dest: productionAssets + '/img'
        }
    },
    icons: {
        development: {
            src: source + iconFiles,
            dest: developmentAssets + '/icons'
        },
        production: {
            src: source + iconFiles,
            dest: productionAssets + '/icons'
        }
    },
    bower: {
        development: {
            dest: developmentAssets,
            cssFolder: '/css/',
            jsFolder: '/js/',
            cssOutput: 'plugins.css',
            jsOutput: 'plugins.js'
        },
        production: {

        }
    },
    watch: {
        development: {
            less: source + lessFiles,
            javascript: source + jsFiles,
            images: source + imageFiles,
            jade: source + jadeFiles,
            icons: source + iconFiles,
            fonts: source + fontFiles,
            bower: bowerFiles
        }
    }
};
