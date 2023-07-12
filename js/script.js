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
const downloadPdfBtn = document.getElementById('download-pdf-btn');

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
  }
});

// Eliminar columna
function deleteColumn(button) {
  const headerCell = button.parentNode;
  const columnIndex = Array.from(headerCell.parentNode.children).indexOf(headerCell);

  const headerRow = inventoryTable.querySelector('thead tr');
  const cells = headerRow.querySelectorAll('th');
  const rows = inventoryTable.querySelectorAll('tbody tr');

  cells.forEach((cell) => {
    if (cell === headerCell) {
      cell.remove();
    }
  });

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      if (cell === cells[columnIndex]) {
        cell.remove();
      }
    });
  });

  updateTotals();
}

// Eliminar celda
function deleteCell(button) {
  const cell = button.parentNode.parentNode;
  const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);

  const headerRow = inventoryTable.querySelector('thead tr');
  const headerCell = headerRow.children[cellIndex];

  const rows = inventoryTable.querySelectorAll('tbody tr');
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      if (cell === cells[cellIndex]) {
        cell.remove();
      }
    });
  });

  headerCell.remove();

  updateTotals();
}

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
      const cloneOption = categoryOption.cloneNode(true);
      select.appendChild(cloneOption);
    });

    addCategoryInput.value = '';
    populateCategoryFilter();
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

// Descargar la tabla como PDF
downloadPdfBtn.addEventListener('click', () => {
  downloadAsPDF();
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
    const selectedCategory = select.value;

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

    select.value = selectedCategory;
  });
}

// Generar opciones de categoría en el filtro de categoría
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('category-filter');
  const selectedCategory = categoryFilter.value;

  categoryFilter.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Todas';
  categoryFilter.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selectedCategory;
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

// Descargar la tabla como PDF
function downloadAsPDF() {
  const doc = new jsPDF();

  // Configurar propiedades del PDF
  const title = 'Inventario';
  const columns = ['#', 'Producto', 'Cantidad', 'Precio', 'Categoría'];
  const data = [];

  // Obtener los datos de la tabla
  const rows = inventoryTable.querySelectorAll('tbody tr');
  rows.forEach((row, index) => {
    const rowData = [];
    rowData.push(index + 1); // Agregar número de fila
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      rowData.push(cell.textContent.trim()); // Agregar contenido de las celdas
    });
    data.push(rowData);
  });

  // Generar el PDF
  doc.text(title, 10, 10);
  doc.autoTable({
    head: [columns],
    body: data,
  });

  // Descargar el PDF
  doc.save('inventario.pdf');
}

// Inicializar la generación de opciones de categoría
populateCategoryOptions();
populateCategoryFilter();
