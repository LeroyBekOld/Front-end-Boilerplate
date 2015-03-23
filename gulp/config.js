// General paths
var source = './src/';
var development = './test/';
var production = './dist/';

// Asset folder
var assetFolder = 'assets/';

// Asset paths
var developmentAssets = development + assetFolder;
var productionAssets = production + assetFolder;

// Asset folder paths
var cssFolder = 'css';
var jsFolder = 'js';
var imageFolder = 'img';
var fontFolder = 'fonts';
var iconFolder = 'icons';
var lessFolder = 'less';
var jadeFolder = 'jade';
var bowerFolder = './bower_components';

// file paths
var lessFiles = '/**/*.less';
var cssFiles = '/**/*.css';
var jsFiles = '/**/*.js';
var imageFiles = '/**/*.{jpg,jpeg,gif,png,svg,bmp}';
var fontFiles = '/**/*.{eot,woff,woff2,ttf.svg}';
var iconFiles = '/*.svg';
var jadeFiles = '/**/*.jade';
var htmlFiles = '/**/*.html';
var bowerFiles = '/**/bower.json';

// Specific file inputs
var mainLessFile = '/main.less';

// Specific file outputs
var cssOutputFile = '/all.css';
var jsOutputFile = '/all.js';

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
                developmentAssets + cssFolder + cssFiles,
                developmentAssets + jsFolder + jsFiles,
                developmentAssets + imageFolder + imageFiles,
                developmentAssets + fontFolder + fontFiles,
                developmentAssets + iconFolder + iconFiles,
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
    css: {
        development: {
            src: source + lessFolder + mainLessFile,
            dest: developmentAssets + cssFolder,
            output: cssOutputFile,
            options: {
                dumpLineNumbers: "comments"
            }
        },
        production: {
            src: source + lessFolder + mainLessFile,
            dest: productionAssets + cssFolder,
            output: cssOutputFile,
            options: {
            }
        }
    },
    jade: {
        development: {
            src: source + jadeFolder + jadeFiles,
            dest: development,
            options: {
                pretty: true,
                locals: {
                    pathToCSSFile: assetFolder + cssFolder + cssOutputFile,
                    pathToJSFile: assetFolder + jsFolder + jsOutputFile
                }
            }
        },
        production: {
            src: source + jadeFolder + jadeFiles,
            dest: production,
            options: {
                locals: {
                    pathToCSSFile: assetFolder + cssFolder + cssOutputFile,
                    pathToJSFile: assetFolder + jsFolder + jsOutputFile
                }
            }
        }
    },
    javascript: {
        development: {
            src: source + jsFolder + jsFiles,
            dest: developmentAssets + jsFolder ,
            output: jsOutputFile
        },
        production: {
            src: source + jsFiles,
            dest: productionAssets + jsFolder,
            output: jsOutputFile
        }
    },
    fonts: {
        development: {
            src: source + fontFolder + fontFiles,
            dest: developmentAssets + fontFolder
        },
        production: {
            src: source + fontFolder + fontFiles,
            dest: productionAssets + fontFolder
        }
    },
    images: {
        development: {
            src: source + imageFolder + imageFiles,
            dest: developmentAssets + imageFolder
        },
        production: {
            src: source + imageFolder + imageFiles,
            dest: productionAssets + imageFolder
        }
    },
    icons: {
        development: {
            src: source + iconFolder + iconFiles,
            dest: developmentAssets + iconFolder
        },
        production: {
            src: source + iconFolder + iconFiles,
            dest: productionAssets + iconFolder
        }
    },
    watch: {
        development: {
            less: source + lessFolder + lessFiles,
            javascript: source + jsFolder + jsFiles,
            images: source + imageFolder + imageFiles,
            jade: source + jadeFolder + jadeFiles,
            icons: source + iconFolder + iconFiles,
            fonts: source + fontFolder + fontFiles,
            bower: bowerFolder + bowerFiles
        }
    }
};
