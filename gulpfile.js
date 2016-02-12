const del = require('del');

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const header = require('gulp-header');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const umd = require('gulp-umd');

const Jasmine = require('jasmine');
const jasmine = new Jasmine();
const Reporter = require('jasmine-terminal-reporter');
const reporter = new Reporter({
  isVerbose: true,
  showColors: true
});



var pkg = require('./package.json');
pkg.buildDate = Date();

var name = 'draft.js';
var umdName = function() {
  return 'draft';
};

var src = [
  // Main
  'src/draft.js',
  'src/inherit.js',
  'src/proxy-fallback.js',
  'src/defaults.js',

  // Types
  'src/types/float.js',
  'src/types/length.js',
  'src/types/color.js',

  // Mixins
  'src/mixins/event.js',

  'src/mixins/system.js',
  'src/mixins/units.js',

  'src/mixins/position.js',
  'src/mixins/rotation.js',

  'src/mixins/fill.js',
  'src/mixins/stroke.js',

  'src/mixins/size.js',
  'src/mixins/radius.js',

  // Containers
  'src/elements/element.js',
  'src/elements/container.js',
  'src/elements/doc.js',
  'src/elements/group.js',
  'src/elements/view.js',
  // Elements
  'src/elements/point.js',
  'src/elements/line.js',
  'src/elements/shape.js',
  'src/elements/rectangle.js',
  'src/elements/ellipse.js',
  'src/elements/circle.js'
];

var headerLong = `/*
 * <%= pkg.name %> - <%= pkg.description %>
 * version v<%= pkg.version %>
 * <%= pkg.homepage %>
 *
 * copyright <%= pkg.author %>
 * license <%= pkg.license %>
 *
 * BUILT: <%= pkg.buildDate %>
 */

`;

var headerShort = [
  '/* <%= pkg.name %> v<%= pkg.version %>',
  '<%= pkg.homepage %>',
  'license <%= pkg.license %> */\n'
].join(' | ');



gulp.task('clean', function() {
  return del(['dist/*']);
});

gulp.task('es6', ['clean'], function() {
  return gulp.src(src.map(value => value.replace('-fallback', '')))
    .pipe(concat(name, {newLine: '\n'}))
    .pipe(umd({
      exports: umdName,
      namespace: umdName
    }))
    .pipe(rename({suffix: '-es6'}))
    .pipe(header(headerLong, {pkg: pkg}))
    .pipe(size({showFiles: true, title: 'Full'}))
    .pipe(gulp.dest('dist'));
});

// BACKLOG: figure out why sourcemaps don't exactly work
gulp.task('build', ['clean'], function() {
  return gulp.src(src)
    .pipe(concat(name, {newLine: '\n'}))
    .pipe(babel({
      plugins: ['array-includes', 'transform-remove-console'],
      presets: ['es2015']
    }))
    .pipe(umd({
      exports: umdName,
      namespace: umdName
    }))
    .pipe(header(headerLong, {pkg: pkg}))
    .pipe(size({showFiles: true, title: 'Full'}))
    .pipe(gulp.dest('dist'))
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(headerShort, {pkg: pkg}))
      .pipe(size({showFiles: true, title: 'Minified'}))
      .pipe(size({showFiles: true, gzip: true, title: 'Gzipped'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function() {
  jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
      '**/*[sS]pec.js'
    ],
    helpers: [
      'helpers/**/*.js'
    ],
    random: true
  });
  jasmine.addReporter(reporter);

  return jasmine.execute();
});

gulp.task('default', ['clean', 'es6', 'build', 'test'], function() {});
