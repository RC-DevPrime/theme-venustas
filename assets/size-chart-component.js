(function () {
  if (window.SizeChartComponent) return;

  const OPEN_CLASS = 'open';
  const NO_SCROLL_CLASS = 'no-scroll';

  function getModal(id) {
    if (!id) return null;
    return document.getElementById(id);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add(OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add(NO_SCROLL_CLASS);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove(OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'true');

    if (!document.querySelector('.popup-modal.open')) {
      document.body.classList.remove(NO_SCROLL_CLASS);
    }
  }

  function inToCm(value) {
    let converted = (parseFloat(value) * 2.54).toFixed(1);
    return converted.replace(/\.0$/, '');
  }

  function convertValueToCm(text) {
    const value = text.trim();
    if (!value || Number.isNaN(parseFloat(value))) return value;

    if (value.includes('-')) {
      return value
        .split('-')
        .map((item) => item.trim())
        .map(inToCm)
        .join(' - ');
    }

    return inToCm(value);
  }

  function initUnitToggle(component) {
    const toggle = component.querySelector('[data-size-chart-toggle]');
    const table = component.querySelector('.size-chart-table');
    if (!toggle || !table || toggle.dataset.sizeChartReady) return;

    const labels = Array.from(toggle.querySelectorAll('[data-size-chart-unit]'));
    const box = toggle.querySelector('.toggle-box');
    const cells = Array.from(table.querySelectorAll('tbody td:not(:first-child)'));
    const originalValues = cells.map((cell) => cell.textContent.trim());

    function setUnit(unit) {
      const nextUnit = unit === 'cm' ? 'cm' : 'in';
      toggle.dataset.unit = nextUnit;

      labels.forEach((label) => {
        label.classList.toggle('active', label.dataset.sizeChartUnit === nextUnit);
      });

      if (box) {
        box.classList.toggle('right', nextUnit === 'cm');
      }

      cells.forEach((cell, index) => {
        cell.textContent = nextUnit === 'cm' ? convertValueToCm(originalValues[index]) : originalValues[index];
      });
    }

    labels.forEach((label) => {
      label.addEventListener('click', () => setUnit(label.dataset.sizeChartUnit));
    });

    if (box) {
      box.addEventListener('click', () => setUnit(toggle.dataset.unit === 'cm' ? 'in' : 'cm'));
    }

    toggle.dataset.sizeChartReady = 'true';
    setUnit(toggle.dataset.unit || 'in');
  }

  function initTableHighlight(component) {
    const table = component.querySelector('.size-chart-table');
    if (!table || table.dataset.sizeChartReady) return;

    const cells = Array.from(table.querySelectorAll('tbody td'));
    const isTouch = window.matchMedia('(hover: none)').matches;

    function clearAll() {
      table.querySelectorAll('.grey, .red').forEach((item) => item.classList.remove('grey', 'red'));
    }

    function highlightCell(cell) {
      clearAll();

      const row = cell.parentElement;
      const columnIndex = cell.cellIndex;
      const rowIndex = row.rowIndex;
      const headerCell = table.rows[0] && table.rows[0].cells[columnIndex];

      if (headerCell) headerCell.classList.add('red');

      for (let index = 1; index < rowIndex; index += 1) {
        const rowCell = table.rows[index] && table.rows[index].cells[columnIndex];
        if (rowCell) rowCell.classList.add('grey');
      }

      cell.classList.add('red');

      for (let index = 0; index < columnIndex; index += 1) {
        const leftCell = row.cells[index];
        if (!leftCell) continue;
        leftCell.classList.add(index === 0 ? 'red' : 'grey');
      }
    }

    cells.forEach((cell) => {
      if (isTouch) {
        cell.addEventListener('click', (event) => {
          event.stopPropagation();
          highlightCell(cell);
        });
      } else {
        cell.addEventListener('mouseenter', () => highlightCell(cell));
      }
    });

    if (isTouch) {
      document.addEventListener('click', clearAll);
    } else {
      table.addEventListener('mouseleave', clearAll);
    }

    table.dataset.sizeChartReady = 'true';
  }

  function initTabs(component) {
    if (component.dataset.sizeChartTabsReady) return;

    const tabs = Array.from(component.querySelectorAll('[data-size-chart-tab]'));
    const panels = Array.from(component.querySelectorAll('[data-size-chart-panel]'));
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.sizeChartTab;

        tabs.forEach((item) => {
          const isActive = item === tab;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach((panel) => {
          const isActive = panel.dataset.sizeChartPanel === target;
          panel.classList.toggle('is-active', isActive);
          panel.hidden = !isActive;
        });
      });
    });

    component.dataset.sizeChartTabsReady = 'true';
  }

  function initComponent(component) {
    initTabs(component);
    initUnitToggle(component);
    initTableHighlight(component);
  }

  function initAll() {
    document.querySelectorAll('[data-size-chart-component]').forEach(initComponent);
  }

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-size-chart-open]');
    if (openButton) {
      event.preventDefault();
      const modal = getModal(openButton.dataset.sizeChartOpen);
      initAll();
      openModal(modal);
      return;
    }

    const closeButton = event.target.closest('[data-size-chart-close]');
    if (closeButton) {
      event.preventDefault();
      closeModal(closeButton.closest('[data-size-chart-modal]'));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('[data-size-chart-modal].open').forEach(closeModal);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.SizeChartComponent = {
    init: initAll,
    open: openModal,
    close: closeModal
  };
})();
