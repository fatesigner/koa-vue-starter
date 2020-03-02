/**
 * tasks
 */

const Gulp = require('gulp');
const Path = require('path');
const Rimraf = require('rimraf');
const { RunWebpack, RunWebpackWatch, RunWebpackServe } = require('handypack');

Gulp.task('clean:client', async function() {
  const ENV = require('./env')();
  Rimraf.sync(ENV.outputPath);
  Rimraf.sync(ENV.outputPathForRender);
});

Gulp.task('clean:server', async function() {
  const ENV = require('./env')();
  Rimraf.sync(ENV.outputPathForServer);
});

Gulp.task('clean', Gulp.parallel('clean:client', 'clean:server'));

Gulp.task('build', async function() {
  const ENV = require('./env')();

  // copy npm publish files to output
  await Gulp.src(['package.json', 'README.md'].map(x => Path.join(ENV.rootPath, x))).pipe(Gulp.dest(ENV.outputPath));
});

Gulp.task(
  'server:build',
  Gulp.series('clean:server', async function() {
    const ENV = require('./env')();
    // copy other files to output
    await Gulp.src([Path.resolve(ENV.srcPath, '**/*'), '!' + Path.resolve(ENV.srcPath, '**/*.ts')]).pipe(
      Gulp.dest(ENV.outputPathForServer)
    );
  })
);

Gulp.task(
  'client:build',
  Gulp.series('clean:client', function() {
    return RunWebpack([require('./webpack/webpack.client.config')(), require('./webpack/webpack.server.config')()]);
  })
);

Gulp.task(
  'client:watch',
  Gulp.series('clean:client', function() {
    return RunWebpackWatch([
      require('./webpack/webpack.client.config')(),
      require('./webpack/webpack.server.config')()
    ]);
  })
);

Gulp.task(
  'client:serve',
  Gulp.series('clean:client', function() {
    return RunWebpackServe(
      [require('./webpack/webpack.client.config')(), require('./webpack/webpack.server.config')()],
      {
        stats: { colors: true },
        open: 'http://localhost:12306'
      },
      '12306',
      ''
    );
  })
);
