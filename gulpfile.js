const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const header = require('gulp-header');
const jasmine = require('gulp-jasmine');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const wrap = require("gulp-wrap");
var wrapContent = '<%= data.contents %>';
const del = require('del');



var name = 'Draft';



var pkg = require('./package.json');
var src = [
  // Main
  'src/draft.js',
  'src/defaults.js',
  'src/helpers.js',

  // Methods
  'src/methods/json.js',
  'src/methods/system.js',
  'src/methods/units.js',

  'src/methods/size.js',
  'src/methods/move.js',
  'src/methods/radius.js',

  'src/methods/transform.js',
  'src/methods/transforms.js',

  // Containers
  'src/elements/element.js',
  'src/elements/container.js',
  'src/elements/group.js',
  'src/elements/page.js',
  // Elements
  'src/elements/line.js',
  'src/elements/rect.js',
  'src/elements/circle.js'
];

var umdTop = [
  '(function (root, factory) {',
  '  if (typeof define === \'function\' && define.amd) {',
  '    // AMD. Register as an anonymous module.',
  '    define(function () {',
  '      return factory(root, root.document);',
  '    });',
  '  } else if (typeof module === \'object\' && module.exports) {',
  '    // Node. Does not work with strict CommonJS.',
  '    module.exports = root.document ? factory(root, root.document) :',
  '      function (w) {',
  '        return factory(w, w.document);',
  '      };',
  '  } else {',
  '    // Browser globals (root is window)',
  '    root.<%= data.name %> = factory(root, root.document);',
  '  }',
  '}(typeof window !== "undefined" ? window : this, function (window, document) {'
].join('\n');
var umdBottom = [
  '  return <%= data.name %>;',
  '}));'
].join('\n');
var umd = [umdTop, wrapContent, umdBottom].join('\n');

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
    // .pipe(sourcemaps.init())
    .pipe(concat('draft.js', { newLine: '\n' }))
    .pipe(wrap(umd, {name: name}, {variable: 'data'}))
    .pipe(header(headerLong, { pkg: pkg }))
    /*.pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
    .pipe(sourcemaps.write('.', {
      sourceRoot: function(file) {
        console.log(file.base);
        return '/src';
      }
    }))*/
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(size({showFiles: true, title: 'Full'}));
});

// FIXME: minified distribution doesn't work, the UMD headers are mangled
gulp.task('minify', ['unify'], function () {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(concat('draft.min.js', { newLine: '\n' }))
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
    .pipe(uglify())
    .pipe(size({ showFiles: true, title: 'Minified' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(size({ showFiles: true, gzip: true, title: 'Gzipped' }));
});

gulp.task('default', ['clean', 'unify', 'minify'], function () {});
