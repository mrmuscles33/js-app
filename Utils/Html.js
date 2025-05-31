const Html = {
	search: (selector, root = document.body) => {
		let elements = Array.from(root.querySelectorAll(selector));
		const shadowRoots = Array.from(root.querySelectorAll("*")).filter((el) => el.shadowRoot);
		shadowRoots.forEach((shadowRoot) => {
			const shadowElements = Html.search(selector, shadowRoot);
			if (shadowElements.length > 0) {
				elements = [...elements, shadowElements];
			}
		});
		return elements;
	},
	render: (root, html) => {
		root.innerHTML = html;
	},
	clean:(strings, ...values) => {
		return strings
			.map((str, i) => `${str}${values[i] || ''}`)
			.join('')
			.replace(/\s*\n\s*/g, ' ')
			.trim();
	},
	onThemeChange: (callback) => {
		const observer = new MutationObserver(callback);
		observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
	},
	getNextFocusableElement: (container = document.body, currentElement = document.activeElement, previous = false, loop = true, ignoreChildren = false) => {
		const focusableSelector = [
			'a[href]:not([tabindex="-1"])',
			'button:not([disabled]):not([tabindex="-1"])',
			'input:not([disabled]):not([tabindex="-1"])',
			'select:not([disabled]):not([tabindex="-1"])',
			'textarea:not([disabled]):not([tabindex="-1"])',
			'[tabindex]:not([tabindex="-1"])',
			'[contenteditable="true"]:not([tabindex="-1"])'
		].join(',');
		
		let focusableElements = Array.from(container.querySelectorAll(focusableSelector));
		if (focusableElements.length === 0) return null;
		
		focusableElements = focusableElements.filter(el => {
			return !ignoreChildren || !currentElement.contains(el) || (currentElement.contains(el) && el == document.activeElement);
		});
    	const currentIndex = focusableElements.indexOf(document.activeElement);
		let nextIndex;
		if (currentIndex === -1) {
			nextIndex = previous ? focusableElements.length - 1 : 0;
		} else if (previous) {
			nextIndex = currentIndex - 1;
			if (nextIndex < 0) {
				nextIndex = loop ? focusableElements.length - 1 : -1;
			}
		} else {
			nextIndex = currentIndex + 1;
			if (nextIndex >= focusableElements.length) {
				nextIndex = loop ? 0 : -1;
			}
		}
		
		return nextIndex === -1 ? null : focusableElements[nextIndex];
	}
};
export default Html;
