import { button, input, resultsList, spinner } from "./constants.js";

const clearResults = (childrenNum) => {
  for (let i = 0; i < childrenNum - 1; i++) {
    resultsList.removeChild(resultsList.lastChild);
  }
};

const classChangesOnSearchStart = () => {
  if (resultsList.children.length > 1) {
    clearResults(resultsList.children.length);
  }
  resultsList.classList.remove("p-top-0");
  spinner.classList.remove("d-none");
  resultsList.classList.add("align-center");
};

const classChangesOnSearchFinish = () => {
  spinner.classList.add("d-none");
  resultsList.classList.remove("align-center");
  resultsList.classList.add("p-top-0");
};

const onSearchCallAsync = async (query) => {
  try {
    classChangesOnSearchStart();
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
    );
    const data = await response.json();
    data.map((stock) => {
      const listItem = document.createElement("a");
      listItem.href = `./company.html?symbol=${stock.symbol}`;
      listItem.classList.add("result-tile");
      listItem.innerText = `${stock.name} (${stock.symbol})`;
      resultsList.appendChild(listItem);
    });
  } catch (err) {
    throw new Error(err);
  } finally {
    classChangesOnSearchFinish();
  }
};

button.addEventListener("click", async (e) => {
  const response = await onSearchCallAsync(input.value);
  return response;
});

input.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    const response = await onSearchCallAsync(input.value);
    return response;
  }
});
