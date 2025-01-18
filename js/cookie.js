function setCookie(key, value) {
  let expire = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  value = encodeURIComponent(value);
  document.cookie = `${key}=${value}; expires=${expire}; path=/`;
}