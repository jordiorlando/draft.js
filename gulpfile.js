/* eslint dot-location: [2, "property"] */

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const header = require('gulp-header');
// const jasmine = require('gulp-jasmine');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const umd = require('gulp-umd');
const del = require('del');

var pkg = require('./package.json');

var umdName = function() {
  return pkg.name.replace('.js', '');
};

var src = [
  // Main
  'src/draft.js',
  'src/inherit.js',

  // Mixins
  'src/mixins/event.js',

  'src/mixins/system.js',
  'src/mixins/units.js',

  'src/mixins/position.js',
  'src/mixins/rotation.js',

  'src/mixins/size.js',
  'src/mixins/radius.js',

  // Containers
  'src/elements/element.js',
  'src/elements/container.js',
  'src/elements/doc.js',
  'src/elements/group.js',
  'src/elements/view.js',
  // Elements
  'src/elements/line.js',
  'src/elements/rect.js',
  'src/elements/circle.js'
];

var headerLong = [
  '/*',
  '* <%= pkg.name %> - <%= pkg.description %>',
  '* version v<%= pkg.version %>',
  '* <%= pkg.homepage %>',
  '*',
  '* copyright <%= pkg.author %>',
  '* license <%= pkg.license %>',
  '*',
  '* BUILT: <%= pkg.buildDate %>',
  '*/\n'
].join('\n');

var headerShort = [
  '/*<%= pkg.name %> v<%= pkg.version %>',
  '<%= pkg.homepage %>',
  '<%= pkg.license %> license*/\n'
].join(' | ');



gulp.task('clean', function() {
  del.sync(['dist/*']);
});

gulp.task('unify', ['clean'], function() {
  pkg.buildDate = Date();

  return gulp.src(src)
    .pipe(concat('draft.js', {newLine: '\n'}))
    .pipe(umd({
      exports: umdName,
      namespace: umdName
    }))
    .pipe(header(headerLong, {pkg: pkg}))
    .pipe(gulp.dest('dist'))
    .pipe(size({showFiles: true, title: 'Full'}));
});

// BACKLOG: figure out why sourcemaps don't exactly work
gulp.task('minify', ['unify'], function() {
  return gulp.src('dist/draft.js')
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(headerShort, {pkg: pkg}))
      .pipe(size({showFiles: true, title: 'Minified'}))
      .pipe(size({showFiles: true, gzip: true, title: 'Gzipped'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'unify', 'minify'], function() {});
