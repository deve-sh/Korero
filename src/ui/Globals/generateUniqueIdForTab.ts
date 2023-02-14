// When a single user visits a website from multiple tabs, there's bound to be inconcistencies.
// For that, in our firestore document, we store user presence info basis separate tabs.
// Since the following function is a closure function that's invoked before export,
// each instance of the app running in a separate tab will have a different Unique ID,
// and that unique ID will be stored across the timeline of the tab.

// This way, when the client subscribes and gets the same user from two different tabs,
// they are automatically clubbed into one presence indicator using deduplication using their user ID.
// and if the user closes one tab, the entry in the presence document for other tab will still be active.

const generateUniqueIdForPresenceAcrossTabs = () => {
	const tabId = new Date().getTime() + Math.floor(1000000 * Math.random());
	return tabId;
};

export default generateUniqueIdForPresenceAcrossTabs();
