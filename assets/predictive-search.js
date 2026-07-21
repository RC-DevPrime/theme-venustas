class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="text"]');
    this.predictiveSearchResults = document.querySelector('#predictive-search .inner-content');
    this.recommendations = document.querySelector('.recommendations');

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
  }

  onChange() {
    this.removeWrapper();

    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&resources[type]=product,page,article&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          this.removeWrapper();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-predictive-search').innerHTML;

        // Replace existing results instead of appending
        this.predictiveSearchResults.innerHTML = resultsMarkup;

        const resultCount = this.predictiveSearchResults.querySelectorAll('.predictive-wrapper .results').length;

        if (resultCount > 0) {
          this.open();
        } else {
          this.close();
          this.removeWrapper();
        }
      })
      .catch((error) => {
        this.close();
        this.removeWrapper();
        throw error;
      });
  }

  open() {
    this.recommendations.style.display = 'block';
  }

  close() {
    this.recommendations.style.display = 'block';
  }

  removeWrapper() {
    const predictiveWrappers = document.querySelectorAll('.predictive-wrapper');
    predictiveWrappers.forEach(wrapper => wrapper.remove());
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);
