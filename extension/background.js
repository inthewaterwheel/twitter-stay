/*chrome.action.onClicked.addListener( function(tab) {
	chrome.storage.sync.get(['last_tweet'], function({last_tweet}) {
		if (last_tweet != null & last_tweet != ""){
			chrome.tabs.update(
				tab.id,
				{url: last_tweet},
				null
			)
		}
	})
})
*/
function getUsername(){
	console.log(document.getElementsByTagName("span"))
	
	console.log(Array.from(document.getElementsByTagName("span")).filter(x=>x.innerHTML.includes("@")))
	return Array.from(document.getElementsByTagName("span")).filter(x=>x.innerHTML.includes("@"))[0].innerHTML
}

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
	console.log(changeInfo)
	if (changeInfo.status == "complete") {
		if (tab.url.includes("twitter") && !tab.url.includes("home")){
			console.log("Twitter load on non-home")
			chrome.storage.sync.set({last_tweet: tab.url}, () => {
				console.log("Remembering: " + tab.url)
			})
			setTimeout(() => {
				chrome.scripting.executeScript({
					target: {tabId: tab.id},
					func: getUsername}, function(results){
						r = results[0].result
						console.log(results)
						chrome.storage.sync.set({username: r}, () => {
							console.log("Storing user..." + r)
						})
					}
				)
			}, 500)
		}
				
		if (tab.url.includes("twitter") && tab.url.includes("home")){
			console.log("Twitter load on home")

			//Get stored logged in user
			chrome.storage.sync.get(['username'], function({username}) {
				//Get current logged in user
				setTimeout(() => {
					chrome.scripting.executeScript({
						target: {tabId: tab.id},
						func: getUsername}, function(results){
							r = results[0].result
							if (username != r){
								console.log("Got user" + r + "that doesn't match")
								chrome.storage.sync.get(['last_tweet'], function({last_tweet}) {
									if (last_tweet != null & last_tweet != ""){
										chrome.tabs.update(
											tab.id,
											{url: last_tweet},
											null
										)
									}
								})
								chrome.storage.sync.set({username: r}, () => {
									console.log("Storing user..." + r)
								})
							}
						}
					)
				}, 500)
			})
		}
	}
})