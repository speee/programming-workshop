import browserify from 'browserify'
import buffer     from 'vinyl-buffer'
import fs         from 'fs'
import gutil      from 'gulp-util'
import source     from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import uglify     from 'gulp-uglify'
import watchify   from 'watchify'

const gulp = (require('gulp-help'))(require('gulp'))

const SRC_DIR = './frontend'
const DIST_DIR = './frontend-dist/javascripts'

const MODULES = (() => {
  let isModule = (file) =>
    fs.statSync(`${SRC_DIR}/${file}`).isFile() && file.indexOf('.js') >= 0
  return fs.readdirSync(SRC_DIR).filter(isModule)
})()

gulp.task('modules', 'show all modules available', () =>
  gutil.log(gutil.colors.magenta(MODULES)));

gulp.task(
  'build',
  'build JavaScript',
  () => {
    let env = gutil.env.env || 'production';
    gutil.log(`build for ${env}...`);
    MODULES.forEach((module) => {
      let browserifyOpts = {
        entries: [`${SRC_DIR}/${module}`],
        extensions: ['.js'],
        debug: env == 'development',
      };
      if (gutil.env.watch) {
        browserifyOpts.cache = {};
        browserifyOpts.packageCache = {};
        browserifyOpts.plugin = [watchify];
      }

      let b = browserify(browserifyOpts);
      b.transform('babelify');

      let bundle = () => {
        let pipeline = b
          .bundle()
          .on('error', gutil.log)
          .pipe(source(module))
          .pipe(buffer());

        if (env == 'development') {
          pipeline = pipeline
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'));
        } else {
          pipeline = pipeline
            .pipe(uglify({
              compress: { drop_console: true }
            }));
        }

        return pipeline.pipe(gulp.dest(DIST_DIR));
      }

      b.on('update', bundle);
      b.on('log', gutil.log);
      bundle();
    });
  },
  { options: {
    'env=production': 'build for production(default)',
    'env=development': 'build for development, with sourcemaps',
    'watch': 'watch updating src files',
  }});

gulp.task('set-watch-mode', false, () => {
  gutil.env.env = 'development'
  gutil.env.watch = true
});

gulp.task(
  'watch',
  'watch src files and build incrementally',
  ['set-watch-mode', 'build']
);

gulp.task('default', false, ['help']);
