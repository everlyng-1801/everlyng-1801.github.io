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

// Exportar a Excel al hacer clic en el botón "Exportar a Excel"
exportBtn.addEventListener('click', () => {
  exportToExcel();
});
