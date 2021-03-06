import babel from 'gulp-babel';
import gulp from 'gulp';
import ractive from 'gulp-ractive';
import rename from 'gulp-rename';
import rollup from 'gulp-rollup';
import watch from 'gulp-watch';
import wrap from 'gulp-wrap';
import rpg from 'rollup-plugin-gulp';

gulp.task('hbs', function () {
    return gulp.src('**/*.hbs')
        .pipe(ractive())
        .pipe(wrap('export default <%= contents %>;\n\n'))
        .pipe(rename({extname: '.hbs.js'}))
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['hbs'], function () {
    return gulp.src([
            'node_modules/ux-checkbox/ux-checkbox*.js',
            'ux-todo*.js'
        ])
        .pipe(rollup({
            entry: './ux-todo.js',
            plugins: [
                rpg(ractive())
            ],
            moduleName: 'uxToDo',
            globals: {
                Ractive: 'Ractive'
            },
            format: 'iife'
        }))
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(rename({basename: 'index'}))
        .pipe(gulp.dest('.'));
});

gulp.task('default', function () {
    return watch(['**/*.hbs', 'ux-todo*.js'], function () {
       return gulp.tasks[build]();
   });
});
