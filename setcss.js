let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.extension.getURL('darkenstyle.css');
document.head.appendChild(link);
