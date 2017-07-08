// Zoom constants. Define Max, Min, increment and default values

var contadorTabs=0;
var tabsList = document.getElementById('tabs-list');
var currentTabs = document.createDocumentFragment();
var limit = 20;
var counter = 0;
var arregloTabs=[];
var sw=true;
var sw2=true;
var auxTab;
function firstUnpinnedTab(tabs) {
  for (var tab of tabs) {
    if (!tab.pinned) {
      return tab.index;
    }
  }
}

/**
 * listTabs
 */
function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    tabsList.textContent = '';

    for (let tab of tabs) {
      if (!tab.active ) {
        let tabLink = document.createElement('a');

        tabLink.textContent = tab.title || tab.id;
        tabLink.setAttribute('href', tab.id);
        tabLink.classList.add('switch-tabs');
        currentTabs.appendChild(tabLink);
      }
       arregloTabs.push(tab);
      counter += 1;
    }
    let node = document.createElement("LI");
    let textnode = document.createTextNode(counter);
    node.appendChild(textnode);
    document.getElementById("tabs-cant").appendChild(node);
    tabsList.appendChild(currentTabs);
  });

}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
}
     
document.addEventListener("click", function(e) {

  if (e.target.id === "create") {
    browser.tabs.create({url: "https://developer.mozilla.org/en-US/Add-ons/WebExtensions"});
    console.log(`Its window is not closing`);
  }

  if (e.target.id === "panic") {
    var pages = [];
    getCurrentWindowTabs().then((tabs) => {
      for (let tab of tabs) {
               
              browser.tabs.remove(tab.id);
      }
    });
    browser.tabs.create({url: "https://github.com/mdn/webextensions-examples"});
  }

  if (e.target.id === "restore") {
     getCurrentWindowTabs().then((tabs) => {

      for (i = 1; i <= counter; i++) {
        var auxTab = arregloTabs[i];
        browser.tabs.create({url: auxTab.url});
      }

    });
  }

  e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener(function(tabId, removeInfo){
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener(function(tabId, moveInfo){
  var startIndex = moveInfo.fromIndex;
  var endIndex = moveInfo.toIndex;
  console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});
