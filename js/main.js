(function () {
  let seleted = [];

  function onClickItem() {
    const div = this;
    const url = div.getAttribute("url");
    let className = div.className;

    if (className.indexOf("tab-item-seleted") >= 0) {
      seleted = seleted.filter(function (item) { return item !== url; });
      className = className.split("tab-item-seleted").join(" ");
    } else {
      seleted.push(url);
      className += " tab-item-seleted";
    }

    div.setAttribute("class", className);
  }

  function createTabItem(item) {
    const div = document.createElement("div");
    const urlDiv = document.createElement("div");
    const seletedClass = seleted.indexOf(item.url) >= 0 ? " tab-item-seleted" : "";
    const className = "tab-item text-overflow" + seletedClass;

    urlDiv.textContent = item.url;
    urlDiv.setAttribute("title", item.url);
    urlDiv.setAttribute("class", "tab-item-url text-overflow");

    div.textContent = item.title;
    div.setAttribute("url", item.url)
    div.setAttribute("class", className);
    div.appendChild(urlDiv);
    div.addEventListener("click", onClickItem)

    return div;
  }

  function showUrls(list) {
    const tabs = document.getElementById("tabs");
    list.forEach(function (item) {
      tabs.appendChild(createTabItem(item))
    });
  }

  function onLoad() {
    showList();

    const button = document.getElementById("makeQRCode");
    const clearButton = document.getElementById("clearQRCode");

    button.addEventListener("click", clickButton);
    clearButton.addEventListener("click", clearQRCode);
  }


  function clickButton() {
    const content = document.getElementById("qrcode");
    content.innerHTML = "";

    if (seleted.length == 0)
      return;

    const qrcode = new QRCode(content, {
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L
    });

    qrcode.makeCode(seleted.join("+"));
  }

  function showList() { chrome.tabs.query({}, showUrls); }
  function clearQRCode() { document.getElementById("qrcode").innerHTML = "" }

  chrome.tabs.onRemoved.addListener(function (tabId, info) {
    chrome.tabs.get(tabId, function (tab) {
      seleted = seleted.filter(function (item) {
        item !== tab.url;
      });
    });
  });

  window.addEventListener('DOMContentLoaded', onLoad, true);
})();