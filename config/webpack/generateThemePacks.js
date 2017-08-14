// Automatically generate packs for each directory in `/app/javascript/styles/themes`.
// Based on the `generateLocalePacks.js` script in this same directory.

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const themesPathRelative = '../../app/javascript/styles/themes';
const themesPath = path.join(__dirname, themesPathRelative);

const themes = fs.readdirSync(themesPath).filter(filename => {
  // Get directories only
  return fs.lstatSync(path.join(themesPath, filename)).isDirectory();
});

const outPath = path.join(__dirname, '../../tmp/themePacks');

rimraf.sync(outPath);
mkdirp.sync(outPath);

const outPaths = [];

themes.forEach(theme => {
  const themePath = path.join(outPath, `theme_${theme}.js`);

  const baseThemeDataPath = `${themesPathRelative}/${theme}`;

  const themeDataPath = [
    `${baseThemeDataPath}/application.scss`,
    `${baseThemeDataPath}/application.sass`,
    `${baseThemeDataPath}/application.css`
  ].filter(filename => fs.existsSync(path.join(outPath, filename)))[0];

  const packContent = `//
// theme_${theme}.js
// automatically generated by generateThemePacks.js
//
require(${JSON.stringify(themeDataPath)});
`;

  fs.writeFileSync(themePath, packContent, 'utf8');
  outPaths.push(themePath);
});

module.exports = outPaths;