var buildHandler = function(input, validateFunction) {
  return function (event) {
    if (validateFunction(input.value)) {
      input.setCustomValidity("");
    } else {
      input.setCustomValidity("Error!");
    }
  }
}
for (var key in validator) {
  if (key == 'getCurrentDate') {
    continue;
  }
  var dom = document.getElementById(key);
  var handler = buildHandler(dom, validator[key].bind(validator));
  if (dom) {
    dom.addEventListener("input", handler);
  }
}
