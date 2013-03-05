function headersReceivedListener (evn) {
	var  results = [];
	for (var i in evn.responseHeaders) {
		var header = evn.responseHeaders[i];
		results.push(header);
		if (!header.name || header.name.toLowerCase() !== 'content-type') {
			continue;
		}
		if (header.value.match(/charset/)) {
			continue;
		}
		header.value += '; charset=UTF8';
	}
	return {
		'responseHeaders' : results
	};
}
function completedListener () {
	chrome.webRequest.onHeadersReceived.removeListener(
		headersReceivedListener,
		{ 'urls' : ['*://*/*.css', '*://*/*.js'] },
		['blocking', 'responseHeaders']
	);
	setTimeout(function () {
		chrome.webNavigation.onCompleted.removeListener(
			completedListener,
			urlFilter
		);
	});
}
var urlFilter = {
	'url' : [
		{
			'pathSuffix' : '.css'
		},
		{
			'pathSuffix' : '.js'
		},
	]
};
chrome.webNavigation.onBeforeNavigate.addListener(function (evn) {
	chrome.webRequest.onHeadersReceived.addListener(
		headersReceivedListener,
		{ 'urls' : ['*://*/*.css', '*://*/*.js'] },
		['blocking', 'responseHeaders']
	);
	chrome.webNavigation.onCompleted.addListener(
		completedListener,
		urlFilter
	);
}, urlFilter);

