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
		// Assembler la chaîne complète
		const fullString = strings.map((str, i) => `${str}${values[i] || ''}`).join('');
    
		// Préserver le contenu des balises pre
		const parts = [];
		let lastIndex = 0;
		let preTagPattern = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
		let match;
		
		while ((match = preTagPattern.exec(fullString)) !== null) {
			// Ajouter la partie avant le tag pre (nettoyée)
			if (match.index > lastIndex) {
				const beforePre = fullString.substring(lastIndex, match.index);
				parts.push(beforePre.replace(/\s*\n\s*/g, ' ').trim());
			}
			
			// Ajouter le contenu du tag pre (préservé)
			parts.push(match[0]);
			lastIndex = match.index + match[0].length;
		}
		
		// Ajouter la dernière partie après le dernier pre (si elle existe)
		if (lastIndex < fullString.length) {
			const afterLastPre = fullString.substring(lastIndex);
			parts.push(afterLastPre.replace(/\s*\n\s*/g, ' ').trim());
		}
		
		// Si aucun tag pre n'a été trouvé, retourner la chaîne nettoyée normalement
		if (parts.length === 0) {
			return fullString.replace(/\s*\n\s*/g, ' ').trim();
		}
		
		return parts.join('');
	},
	onThemeChange: (callback) => {
		const observer = new MutationObserver(callback);
		observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
	},
	tabFirst: (container = document.body, ignoreChildren = false) => {
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
			return !ignoreChildren || !container.contains(el) || (container.contains(el) && el == document.activeElement);
		});
		
		return focusableElements[0] || null;
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
