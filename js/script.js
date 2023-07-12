// Obtener referencia a los elementos HTML
const categoryFilter = document.getElementById('category-filter');
const addCategoryInput = document.getElementById('add-category-input');
const inventoryTable = document.getElementById('inventory-table');
const addRowBtn = document.getElementById('add-row-btn');
const addColumnBtn = document.getElementById('add-column-btn');
const totalQuantity = document.getElementById('total-quantity');
const totalPrice = document.getElementById('total-price');
const addCategoryBtn = document.getElementById('add-category-btn');
const calculateBtn = document.getElementById('calculate-btn');
const exportBtn = document.getElementById('export-btn');
const deleteColumnBtn = document.getElementById('delete-column-btn');

// Opciones de categoría disponibles
const categories = [];

// Agregar fila al hacer clic en el botón "Agregar fila"
addRowBtn.addEventListener('click', () => {
  const newRow = document.createElement('tr');
  const columnCount = inventoryTable.rows[0].cells.length;

  for (let i = 0; i < columnCount; i++) {
    const newCell = document.createElement('td');
    if (i === 0) {
      newCell.innerHTML = `<button class="delete-row-btn">Eliminar</button>`;
    } else if (i === 4) {
      newCell.innerHTML = `
        <select class="category-select">
          <option value="">Sin categoría</option>
          <!-- Opciones de categoría se generarán dinámicamente -->
        </select>
      `;
    } else {
      newCell.contentEditable = true;
      newCell.className = 'numeric-field';
    }
    newRow.appendChild(newCell);
  }

  inventoryTable.querySelector('tbody').appendChild(newRow);
  updateTotals();
  populateCategoryOptions();

  const deleteRowBtn = newRow.querySelector('.delete-row-btn');
  deleteRowBtn.addEventListener('click', () => {
    newRow.remove();
    updateTotals();
  });
});

// Agregar columna al hacer clic en el botón "Agregar columna"
addColumnBtn.addEventListener('click', () => {
  const columnName = prompt('Ingrese el nombre de la columna:');
  if (columnName) {
    const headerRow = inventoryTable.querySelector('thead tr');
    const newHeaderCell = document.createElement('th');
    newHeaderCell.textContent = columnName;
    headerRow.appendChild(newHeaderCell);

    const rows = inventoryTable.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const newCell = document.createElement('td');
      newCell.contentEditable = true;
      newCell.className = 'numeric-field';
      row.appendChild(newCell);
    });

    const categorySelects = inventoryTable.querySelectorAll('.category-select');
    categorySelects.forEach((select) => {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Sin categoría';
      select.appendChild(defaultOption);
    });
  }
});

// Eliminar columna al hacer clic en el botón "Eliminar columna"
deleteColumnBtn.addEventListener('click', () => {
  const columnName = prompt('Ingrese el nombre de la columna a eliminar:');
  if (columnName) {
    const headerRow = inventoryTable.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    let columnIndex = -1;
    headerCells.forEach((cell, index) => {
      if (cell.textContent === columnName) {
        columnIndex = index;
      }
    });

    if (columnIndex === -1) {
      alert('La columna especificada no existe.');
      return;
    }

    const rows = inventoryTable.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells[columnIndex].remove();
    });

    headerCells[columnIndex].remove();
    updateTotals();
  }
});

// Agregar categoría al hacer clic en el botón "Agregar categoría"
addCategoryBtn.addEventListener('click', () => {
  const category = addCategoryInput.value.trim();
  if (category !== '') {
    categories.push(category);

    const categoryOption = document.createElement('option');
    categoryOption.value = category;
    categoryOption.textContent = category;

    const categorySelects = document.querySelectorAll('.category-select');
    categorySelects.forEach((select) => {
      select.appendChild(categoryOption.cloneNode(true));
    });

    addCategoryInput.value = '';
  }
});

// Filtrar tabla por categoría
categoryFilter.addEventListener('change', () => {
  const selectedCategory = categoryFilter.value;

  const rows = inventoryTable.querySelectorAll('tbody tr');
  rows.forEach((row) => {
    const categoryCell = row.querySelector('.category-select');
    const category = categoryCell.value;

    if (selectedCategory === '' || category === selectedCategory) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
});

// Calcular los totales al hacer clic en el botón "Calcular"
calculateBtn.addEventListener('click', () => {
  updateTotals();
});

// Exportar a Excel
exportBtn.addEventListener('click', () => {
  exportToExcel();
});

// Actualizar los totales de cantidades y precios
function updateTotals() {
  const rows = inventoryTable.querySelectorAll('tbody tr');
  let totalQuantityValue = 0;
  let totalPriceValue = 0;
  rows.forEach((row) => {
    const quantity = parseInt(row.cells[2].textContent);
    const price = parseFloat(row.cells[3].textContent);
    if (!isNaN(quantity)) {
      totalQuantityValue += quantity;
    }
    if (!isNaN(price)) {
      totalPriceValue += price;
    }
  });
  totalQuantity.textContent = totalQuantityValue;
  totalPrice.textContent = totalPriceValue.toFixed(2);
}

// Generar opciones de categoría en todos los campos de selección existentes
function populateCategoryOptions() {
  const categorySelects = document.querySelectorAll('.category-select');
  categorySelects.forEach((select) => {
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sin categoría';
    select.appendChild(defaultOption);

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  });
}

// Exportar a Excel
function exportToExcel() {
  const workbook = XLSX.utils.table_to_book(inventoryTable, { sheet: 'Inventario' });

  // Remover la última columna (botones de eliminar)
  const sheet = workbook.Sheets.Inventario;
  const lastCol = sheet['!ref'].split(':')[1];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  range.e.c -= 1;
  sheet['!ref'] = XLSX.utils.encode_range(range);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'inventario.xlsx');
}

// Inicializar la generación de opciones de categoría
populateCategoryOptions();
