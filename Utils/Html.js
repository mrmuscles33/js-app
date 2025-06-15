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
	tabNext: (container = document.body, currentElement = document.activeElement, previous = false, loop = true, ignoreChildren = false) => {
		const focusableSelector = [
			'a[href]:not([tabindex="-1"]):not([inert])',
			'button:not([disabled]):not([tabindex="-1"]):not([inert])',
			'input:not([disabled]):not([tabindex="-1"]):not([inert])',
			'select:not([disabled]):not([tabindex="-1"]):not([inert])',
			'textarea:not([disabled]):not([tabindex="-1"]):not([inert])',
			'[tabindex]:not([tabindex="-1"]):not([inert])',
			'[contenteditable="true"]:not([tabindex="-1"]):not([inert])'
		].join(',');
		
		let focusableElements = Array.from(container.querySelectorAll(focusableSelector));
		if (focusableElements.length === 0) return null;
		
		focusableElements = focusableElements.filter(el => {
			let parent = el;
			while (parent) {
				if (parent.hasAttribute('inert')) {
					return false;
				}
				parent = parent.parentElement;
			}
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
	},
	nearest: (parent, selector) => {
		const elements = parent.querySelectorAll(selector);
		if (elements.length === 0) return null;
		let closestElement = null;
		let minDepth = Infinity;
		elements.forEach(element => {
			let depth = 0;
			let currentNode = element;
			while (currentNode && currentNode !== parent) {
				depth++;
				currentNode = currentNode.parentNode;
			}
			if (depth < minDepth) {
				minDepth = depth;
				closestElement = element;
			}
		});
		return closestElement;
	}
};
export default Html;
