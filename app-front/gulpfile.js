const { parallel } = require('gulp');
const watch = require('gulp-watch');
const run = require('gulp-run');

function ionicBuild() {
    return watch('src/*', { ignoreInitial:false })
    .pipe(run('ionic build')).pipe(run('echo Terminado'));
}

exports.default = ionicBuild