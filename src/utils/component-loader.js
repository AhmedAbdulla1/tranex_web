/**
 * Component Loader
 * Handles loading HTML components into pages
 */

class ComponentLoader {
  /**
   * Initialize the component loader
   */
  constructor() {
    this.componentsCache = {};
  }

  /**
   * Load a component into a target element
   * @param {string} componentPath - Path to the component HTML file
   * @param {string} targetSelector - CSS selector for the target element
   * @param {Object} options - Additional options
   * @param {Function} callback - Optional callback function after component is loaded
   * @returns {Promise} - Promise that resolves when component is loaded
   */
  async loadComponent(componentPath, targetSelector, options = {}, callback = null) {
    const targetElement = document.querySelector(targetSelector);
    
    if (!targetElement) {
      console.error(`Target element not found: ${targetSelector}`);
      return Promise.reject(`Target element not found: ${targetSelector}`);
    }

    try {
      // Check if component is already cached
      let componentHTML = this.componentsCache[componentPath];
      
      // If not cached, fetch it
      if (!componentHTML) {
        const response = await fetch(componentPath);
        if (!response.ok) {
          throw new Error(`Failed to load component: ${componentPath}`);
        }
        componentHTML = await response.text();
        this.componentsCache[componentPath] = componentHTML;
      }

      // Insert the component HTML
      targetElement.innerHTML = componentHTML;

      // Process any data attributes for language support
      if (options.language) {
        this.processLanguageAttributes(targetElement, options.language);
      }

      // Execute callback if provided
      if (callback && typeof callback === 'function') {
        callback(targetElement);
      }

      return Promise.resolve(targetElement);
    } catch (error) {
      console.error('Error loading component:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Process language attributes in a component
   * @param {HTMLElement} element - The element to process
   * @param {string} language - The current language code
   */
  processLanguageAttributes(element, language) {
    const elementsWithLangData = element.querySelectorAll(`[data-${language}]`);
    elementsWithLangData.forEach(el => {
      const translatedText = el.getAttribute(`data-${language}`);
      if (translatedText) {
        el.textContent = translatedText;
      }
    });
  }

  /**
   * Initialize all components on the page
   * @param {Object} componentMap - Map of component paths to target selectors
   * @param {Object} options - Additional options
   * @returns {Promise} - Promise that resolves when all components are loaded
   */
  async initializeComponents(componentMap, options = {}) {
    const promises = [];
    
    for (const [componentPath, targetSelector] of Object.entries(componentMap)) {
      promises.push(this.loadComponent(componentPath, targetSelector, options));
    }

    return Promise.all(promises);
  }
}

// Create and export a singleton instance
const componentLoader = new ComponentLoader();
export default componentLoader;