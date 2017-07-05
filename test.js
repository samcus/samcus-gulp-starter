var fs = require('fs')
var doiuse = require('doiuse/stream');

console.log(1);
var css = "box-sizing: content-box;"

fs.createReadStream('resources/stylesheets/app.css')
  .pipe(doiuse(['ie >= 7', '> 1%']))
  .on('data', function(usageInfo) {
     //console.log(usageInfo.message)
   });

// doiuse({
//     browsers: [
//     'ie >= 8',
//     '> 1%'
//     ],
//     ignore: ['rem'], // an optional array of features to ignore
//     ignoreFiles: ['**/normalize.css'], // an optional array of file globs to match against original source file path, to ignore
//     onFeatureUsage: function (usageInfo) {
//     console.log(usageInfo.message)
// }}).();