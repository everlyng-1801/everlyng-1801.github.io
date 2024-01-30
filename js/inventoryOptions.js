// Obtener referencia a los elementos HTML
const inventoryTable = document.getElementById('inventory-table');
const addRowBtn      = document.getElementById('add-row-btn');
const addColumnBtn   = document.getElementById('add-column-btn');
const totalQuantity  = document.getElementById('total-quantity');
const totalPrice     = document.getElementById('total-price');
const calculateBtn   = document.getElementById('calculate-btn');
const exportBtn      = document.getElementById('export-btn');

// Función para agregar fila al hacer clic en el botón "Agregar fila"
addRowBtn.addEventListener('click', () => {
  const newRow = document.createElement('tr');
  const columnCount = inventoryTable.rows[0].cells.length;

  for (let i = 0; i < columnCount; i++) {
    const newCell = document.createElement('td');
    if (i === 0) {
      newCell.innerHTML = `<button class="delete-row-btn">X</button>`;
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

  // Agregar la clase delete-column a todas las celdas de la columna que contiene el botón de eliminar
  newRow.classList.add('delete-column');

  inventoryTable.querySelector('tbody').appendChild(newRow);

  const deleteRowBtn = newRow.querySelector('.delete-row-btn');
  deleteRowBtn.addEventListener('click', () => {
    newRow.remove();
    updateTotals();
  });

  updateTotals();
  populateCategoryOptions();
});

// Función para agregar columna al hacer clic en el botón "Agregar columna"
addColumnBtn.addEventListener('click', () => {
  const columnName = prompt('Ingrese el nombre de la columna:');
  if (columnName) {
    const headerRow = inventoryTable.querySelector('thead tr');
    const newHeaderCell = document.createElement('th');
    newHeaderCell.textContent = columnName;

    // Crear botón de eliminar columna
    const deleteColumnBtn = document.createElement('button');
    deleteColumnBtn.textContent = 'X';
    deleteColumnBtn.classList.add('delete-column-btn');
    deleteColumnBtn.addEventListener('click', () => {
      deleteColumn(newHeaderCell.cellIndex);
    });

    // Añadir botón de eliminar columna junto con el nombre de la columna
    newHeaderCell.appendChild(deleteColumnBtn);

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

// Función para eliminar columna
function deleteColumn(columnIndex) {
  const headerRow = inventoryTable.querySelector('thead tr');
  const rows = inventoryTable.querySelectorAll('tbody tr');

  // Eliminar la columna del encabezado
  headerRow.deleteCell(columnIndex);

  // Eliminar la columna de cada fila de la tabla
  rows.forEach((row) => {
    row.deleteCell(columnIndex);
  });

  updateTotals();
}

// Función para calcular totales al hacer clic en el botón "Calcular"
calculateBtn.addEventListener('click', updateTotals);

// Función para actualizar los totales de cantidades y precios
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
      option.value = category.id; // Asignar el identificador único de la categoría como valor de la opción
      option.textContent = category.name; // Asignar el nombre de la categoría como texto de la opción
      select.appendChild(option);
    });

    select.value = selectedCategory;
  });
}

// Función para eliminar categoría
function deleteCategory(categoryId) {
  const categoryIndex = categories.findIndex(category => category.id === categoryId); // Buscar el índice de la categoría en el arreglo categories
  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1); // Eliminar la categoría del arreglo categories
    populateCategoryOptions(); // Actualizar el select de categorías después de eliminar la categoría
  }
}
