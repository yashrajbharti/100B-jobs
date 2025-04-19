export const addQueryToPage = (key, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
};

export const getQueryFromPage = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

export const removeQueryFromPage = (key) => {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
};
