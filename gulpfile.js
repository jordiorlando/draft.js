const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const header = require('gulp-header');
const jasmine = require('gulp-jasmine');
const rename = require('gulp-rename');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const wrap = require('gulp-wrap');

var del = require('del');

var pkg = require('./package.json');

var src = [
  // Main
  'src/draw.js',
  'src/defaults.js',
  'src/helpers.js',
  // Methods
  'src/methods/attr.js',
  'src/methods/size.js',
  'src/methods/move.js',
  'src/methods/radius.js',
  'src/methods/transform.js',
  'src/methods/transforms.js',
  // Containers
  'src/elements/container.js',
  'src/elements/doc.js',
  'src/elements/group.js',
  'src/elements/page.js',
  // 'src/elements/model.js',
  // Elements
  'src/elements/element.js',
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

var headerShort = '/*<%= pkg.name %> v<%= pkg.version %> <%= pkg.license %>*/';

gulp.task('clean', function () {
	del.sync(['dist/*']);
});


gulp.task('unify', ['clean'], function () {
  pkg.buildDate = Date();

  return gulp.src(src)
    .pipe(concat('draw.js', { newLine: '\n' }))
    .pipe(wrap({ src: 'src/umd.js' }))
    .pipe(header(headerLong, { pkg: pkg }))
    .pipe(gulp.dest('dist'))
    .pipe(size({showFiles: true, title: 'Full'}));
});

gulp.task('minify', ['unify'], function () {
  return gulp.src('dist/draw.js')
    .pipe(babel({ presets: ['es2015'] })) // TODO: remove this
    .pipe(uglify())
    .pipe(rename({ suffix:'.min' }))
    .pipe(size({ showFiles: true, title: 'Minified' }))
    .pipe(header(headerShort, { pkg: pkg }))
    .pipe(gulp.dest('dist'))
    .pipe(size({ showFiles: true, gzip: true, title: 'Gzipped' }));
});

gulp.task('default', ['clean', 'unify', 'minify'], function () {});
