var gulp =            require('gulp');
var concat =          require('gulp-concat');
var minifyHtml =      require("gulp-minify-html");
var templateCache =   require('gulp-angular-templatecache');
var ngAnnotate =      require('gulp-ng-annotate');
var rename =          require('gulp-rename');
var rimraf =          require('gulp-rimraf');
var uglify =          require('gulp-uglify');
var addStream =       require('add-stream');

var config = {
  dir : {
    app: 'app/',
    css: 'app/css/',
    js: 'app/src/',
    out: 'dist/',
    template: 'app/template/'
  }
};

gulp.task('build', ['app']);
gulp.task('default', ['build']);

gulp.task('clean', function() {
  return gulp.src(config.dir.out)
    .pipe(rimraf());
});

gulp.task('template', [], function() {
  gulp.src(config.dir.template + "**/*.html")
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(templateCache('template.js', { module:'BootstrapAddonsTemplateCache', standalone:true }))
    .pipe(gulp.dest(config.dir.out + '/js'));
})

function prepareTemplates() {
  return gulp.src(config.dir.template + "**/*.html")
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(templateCache('template.js', { module:'BootstrapAddonsTemplateCache', standalone:true }))
}

gulp.task('js', ['clean'], function() {
  return gulp.src([
      config.dir.js + 'module.js', 
      config.dir.js + '**/*.js'
    ])
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(concat('bootstrap-addons.js'))
    .pipe(gulp.dest(config.dir.out + '/js')) //save before ngAnnotate for debugging
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.dir.out + '/js'))
    .pipe(rename('bootstrap-addons.min.js'))
    .pipe(uglify()).on('error', function(e){
        console.log(e);
     })
    .pipe(gulp.dest(config.dir.out + '/js'));
});
gulp.task('css', ['clean'], function() {
  return gulp.src([config.dir.css + '**/*.css'])
    .pipe(concat('bootstrap-addons.css'))
    .pipe(gulp.dest(config.dir.out + '/css'))
})
gulp.task('app', ['js', 'css']);

gulp.task('watch', ['build'], function() {
  gulp.watch(config.dir.app + "**/*", ['build']);
})