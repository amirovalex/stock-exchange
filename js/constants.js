const button = document.getElementById("searchButton");
const input = document.getElementsByTagName("input")[0];
const resultsList = document.getElementsByClassName("results-list")[0];
const spinner = document.getElementById("loading");
const urlParams = new URLSearchParams(window.location.search);

export { button, input, resultsList, spinner, urlParams };
