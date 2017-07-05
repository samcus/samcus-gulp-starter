const $ = require('jquery');
const test = 'test3';
const test2 = "est3";

$(document).ready(function(){
  //$('body').html('Samcus GulpJS Starter');
});

function intersectionA(array1, array2) {
  array1.filter(function(n) {
    return array2.indexOf(n) != -1;
  });
  array2.filter(function(n) {
    return array2.indexOf(n) != -1;
  });
}

function intersectionB(arrayA, arrayB) {
  arrayA.filter(function(n) {
    return arrayB.indexOf(n) != -1;
  });
  arrayB.filter(function(n) {
    return arrayB.indexOf(n) != -1;
  });
}
