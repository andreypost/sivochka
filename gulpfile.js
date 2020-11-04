var gulp = require("gulp"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  babel = require("gulp-babel"),
  minifyCSS = require("gulp-minify-css"),
  sass = require("gulp-sass"),
  htmlmin = require("gulp-htmlmin"),
  clean = require("gulp-clean"),
  autoprefixer = require("gulp-autoprefixer"),
  image = require("gulp-image"),
  webp = require("gulp-webp"),
  svgSprite = require("gulp-svg-sprites"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio"),
  replace = require("gulp-replace"),
  connect = require("gulp-connect"),
  hash = require("gulp-hash-filename"),
  rename = require("gulp-rename"),
  htmlreplace = require("gulp-html-replace"),
  ftp = require("vinyl-ftp"),
  gutil = require("gulp-util"),
  fs = require("fs"),
  open = require("gulp-open");

var hashedJS;
var hashedCSS;

gulp.task("svg-sprite", function () {
  return (
    gulp
      .src("./src/img/svg/*.svg")
      .pipe(
        cheerio({
          run: function ($) {},
          parserOptions: { xmlMode: true },
        })
      )
      // cheerio plugin create unnecessary string '>', so replace it.
      .pipe(replace("&gt;", ">"))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: "symbols",
          preview: false,
          selector: "icon-%f",
          svg: {
            symbols: "symbol_sprite.html",
          },
        })
      )
      .pipe(
        svgmin({
          plugins: [
            {
              removeComments: true,
            },
            {
              removeMetadata: true,
            },
            {
              removeEditorsNSData: true,
            },
            {
              removeAttrs: { attrs: "data.*" },
            },
            {
              removeStyleElement: true,
            },
            {
              removeDesc: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        })
      )
      .pipe(gulp.dest("./img/"))
  );
});

gulp.task("image-to-webp", () => gulp.src("./src/img/*").pipe(webp()).pipe(gulp.dest("./img")));

gulp.task("image-min", () =>
  gulp.src("./src/img/*").pipe(image()).pipe(gulp.dest("./img")).pipe(connect.reload())
);

gulp.task("compile-sass", function () {
  return gulp
    .src(["node_modules/bootstrap/dist/css/bootstrap.css", "./src/scss/*.scss"])
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(gulp.dest("./src/css/"));
});

gulp.task("minify-css", function () {
  return gulp
    .src([
      "./src/css/*.css",
      // "node_modules/intl-tel-input/build/css/intlTelInput.css",
    ])
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(concat("style.css"))
    .pipe(minifyCSS())
    .pipe(
      hash({
        format: "{name}-{hash:8}{ext}",
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        hashedCSS = "./css/" + path.basename + ".css";
      })
    )
    .pipe(gulp.dest("./css"))
    .pipe(connect.reload());
});

function foo(folder, enconding) {
  return new Promise(function (resolve, reject) {
    fs.readdir(folder, enconding, function (err, filenames) {
      if (err) reject(err);
      else resolve(filenames);
    });
  });
}

const getCssPath = async () => {
  var cssPath;
  await foo("./css/").then(
    (files) => (cssPath = "/css/" + files.filter((el) => /\.min.css$/.test(el)))
  );
  return cssPath;
};

const getJsPath = async () => {
  var jsPath;
  await foo("./js/").then(
    (files) => (jsPath = "/js/" + files.filter((el) => /\.min.js$/.test(el)))
  );
  return jsPath;
};

gulp.task("minifyhtml", function () {
  return gulp
    .src(["./src/*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(
      htmlreplace({
        css: hashedCSS ? hashedCSS : getCssPath(),
        js: hashedJS ? hashedJS : getJsPath(),
      })
    )
    .pipe(gulp.dest("./"))
    .pipe(connect.reload());
});

gulp.task("createPhpForWp", function () {
  return gulp
    .src(["./*.html"])
    .pipe(replace('"./', '"<?php echo get_template_directory_uri()?>/build/'))
    .pipe(
      rename(function (path) {
        path.extname = ".php";
      })
    )
    .pipe(gulp.dest("./php/"));
});

const js = ["./src/js/common.js"];

gulp.task("minify-main-js", function () {
  return gulp
    .src(js)
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(concat("common.min.js"))
    .pipe(gulp.dest("./src/js/"));
});

// gulp.task('deploy', () => {
// 	var conn = ftp.create({
// 		host: '',
// 		user: '',
// 		password: '',
// 		parallel: 5,
// 		log: gutil.log
// 	});
// 	var globs = [ './**', '!node_modules/**', '!.git/**' ];
// 	return gulp.src(globs, { buffer: false }).pipe(conn.dest('/'));
// });

gulp.task("scripts", function () {
  return gulp
    .src([
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/slick-carousel/slick/slick.min.js",
      "node_modules/lightgallery.js/dist/js/lightgallery.min.js",
      "./src/js/common.min.js",
    ])
    .pipe(concat("main.js"))
    .pipe(
      hash({
        format: "{name}-{hash:8}{ext}",
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        hashedJS = "./js/" + path.basename + ".js";
      })
    )
    .pipe(gulp.dest("./js/"))
    .pipe(connect.reload());
});

gulp.task("copy-scripts", function () {
  return gulp.src(["./src/js/libraries/*"]).pipe(gulp.dest("./js/"));
});

gulp.task("copy-fonts", function () {
  return gulp.src(["./src/fonts/*"]).pipe(gulp.dest("./fonts/"));
});

gulp.task("copy-json", function () {
  return gulp.src(["./src/json/*"]).pipe(gulp.dest("./json/"));
});

// Чистим директорию назначения и делаем ребилд, чтобы удаленные из проекта файлы не остались
gulp.task("clean", function () {
  return gulp.src(["./src/css/style.css"], { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("clean-js", function () {
  return gulp.src(["./src/js/common.min.js"], { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("clean-old-css", function () {
  return gulp.src(["./css"], { read: false, allowEmpty: true }).pipe(clean());
});
gulp.task("clean-old-js", function () {
  return gulp.src(["./js"], { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("connect", function () {
  var server = connect.server({
    root: "./",
    livereload: true,
  });

  return gulp.src("./").pipe(
    open({
      uri: "http://" + server.host + ":" + server.port,
    })
  );
});

function watchFiles() {
  gulp.watch(
    "./src/scss/*.scss",
    gulp.series(["clean-old-css", "compile-sass", "minify-css", "clean", "minifyhtml"])
  );
  gulp.watch("./src/*.html", gulp.series(["minifyhtml"]));
  gulp.watch("./src/img/svg/*.svg", gulp.series(["svg-sprite"]));
  gulp.watch(
    js,
    gulp.series([
      "clean-old-js",
      "copy-scripts",
      "minify-main-js",
      "scripts",
      "clean-js",
      "minifyhtml",
      "createPhpForWp",
    ])
  );
  gulp.watch("./src/img/*", gulp.series(["image-to-webp", "image-min", "svg-sprite"]));
}

const build = gulp.series(
  "clean-old-css",
  "clean-old-js",
  "compile-sass",
  "minify-css",
  "minify-main-js",
  "scripts",
  "minifyhtml",
  "createPhpForWp",
  "clean",
  "clean-js",
  "copy-scripts",
  "copy-fonts",
  "copy-json",
  "image-to-webp",
  "image-min",
  "svg-sprite"
);

const min_images = gulp.series("image-min", "image-to-webp");
// const deploy = gulp.series(build, 'deploy');
const watch = gulp.parallel("connect", watchFiles);

exports.build = build;
// exports.deploy = deploy;
exports.default = gulp.series(build, watch);
exports.min_images = min_images;
