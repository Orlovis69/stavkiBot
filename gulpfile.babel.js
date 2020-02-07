"use strict";

import babel from "gulp-babel";
import browserSync from "browser-sync";
import gulp from "gulp";
import sass from "gulp-sass";
import cssnano from "gulp-cssnano";
import autoprefixer from "autoprefixer";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import stylelint from "gulp-stylelint";
import purgecss from "gulp-purgecss";
import newer from "gulp-newer";
import pump from "pump";

// Project paths
const paths = {
  html: {
    src: "./development/**/*.html"
  },
  images: {
    src: "./development/img/**.*",
    dest: "./production/img/"
  },
  fonts: {
    src: "./development/fonts/**/**.*",
    dest: "./production/fonts/"
  },
  styles: {
    src: "./development/**/*.scss",
    local: "./development/css/",
    dest: "./production/css/"
  },
  scripts: {
    src: "./development/**/*.js"
  },
  php: {
    src: "./development/server/**.*",
    dest: "./production/server/"
  },
  dest: "./production/"
};

// Setting browser sync
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./production/"
    }
  });
  done();
}

// HTML copy and paste
export function html(done) {
  pump(
    [gulp.src(paths.html.src), newer(paths.dest), gulp.dest(paths.dest)],
    done
  );
}

// Images copy and paste
export function images(done) {
  pump(
    [
      gulp.src(paths.images.src),
      newer(paths.images.dest),
      gulp.dest(paths.images.dest)
    ],
    done
  );
}

// Fonts copy and paste
export function fonts(done) {
  pump(
    [
      gulp.src(paths.fonts.src),
      newer(paths.fonts.dest),
      gulp.dest(paths.fonts.dest)
    ],
    done
  );
}

var sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

// CSS copy and paste
export function productionStyles(done) {
  pump(
    [
      gulp.src(paths.styles.src),
      newer(paths.dest),
      sass().on("error", sass.logError),
      rename("style.css"),
      // purgecss({
      //   content: [paths.html.src]
      // }),
      stylelint({
        reporters: [{ formatter: "string", console: true }],
        failAfterError: false,
        fix: true
      }),
      // postcss({}),
      cssnano(),
      gulp.dest(paths.styles.dest)
    ],
    done
  );
}

// Build local css from sass
export function localSass(done) {
  pump(
    [
      gulp.src(paths.styles.src),
      newer(paths.styles.src),
      sass(sassOptions).on("error", sass.logError),
      rename("style.css"),
      autoprefixer(),
      // cssnano(),
      gulp.dest(paths.styles.local)
    ],
    done
  );
}

// JS copy and paste
export function scripts(done) {
  pump(
    [
      gulp.src(paths.scripts.src),
      newer(paths.dest),
      // babel(),
      gulp.dest(paths.dest)
    ],
    done
  );
}

// PHP copy and paste
export function php(done) {
  pump(
    [gulp.src(paths.php.src), newer(paths.php.dest), gulp.dest(paths.php.dest)],
    done
  );
}

// Watch everything
export function watch() {
  gulp.watch(paths.html.src, gulp.series(html, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.fonts.src, gulp.series(fonts, reload));
  gulp.watch(paths.styles.src, gulp.series(productionStyles, reload));
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.php.src, gulp.series(php, reload));
}

// Map out sequence of events on first load
const firstRun = gulp.series(
  html,
  images,
  fonts,
  productionStyles,
  scripts,
  php,
  serve,
  watch
);

// Run the whole thing
export default firstRun;
