const toggleSizeOnFetch = (onIndex = false) => {
  if (onIndex) {
    resultsList.classList.toggle("height-100");
  }
  //   debugger;
  html.classList.toggle("height-100");
  body.classList.toggle("height-100");
};
