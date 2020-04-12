chrome.runtime.onInstalled.addListener(evt => {
	chrome.tabs.executeScript({
		file: 'setcss.js',
	});
});

chrome.browserAction.onClicked.addListener(tabs => {
	chrome.tabs.executeScript({
		file: 'content.js',
	});
});
