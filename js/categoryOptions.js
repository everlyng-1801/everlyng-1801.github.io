// Obtener referencia a los elementos HTML
const addCategoryForm = document.getElementById('add-category-form');
const addCategoryInput = document.getElementById('add-category-input');
const categoryContainer = document.getElementById('category-container');

// Arreglo para almacenar las categorías
const categories = [];

// Agregar evento al formulario para agregar categoría
addCategoryForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario se envíe

  const category = addCategoryInput.value.trim();
  if (category !== '') {
    const categoryId = categories.length; // Generar un identificador único para la categoría
    categories.push({ id: categoryId, name: category }); // Agregar la categoría al arreglo categories junto con su identificador único

    // Crear elemento de categoría
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('category-item');
    categoryElement.dataset.id = categoryId; // Asignar el identificador único como atributo de datos del elemento de categoría

    // Crear un span para cada palabra de la categoría con fondo resaltado
    const categoryWords = category.split(' ');
    categoryWords.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.textContent = word;
      categoryElement.appendChild(wordSpan);
    });

    // Agregar botón de eliminar categoría
    const deleteCategoryBtn = document.createElement('button');
    deleteCategoryBtn.textContent = 'Eliminar';
    deleteCategoryBtn.classList.add('delete-category-btn');
    deleteCategoryBtn.addEventListener('click', () => {
      deleteCategory(categoryId);
      categoryElement.remove();
    });

    // Añadir botón de eliminar categoría junto con el elemento de categoría
    categoryElement.appendChild(deleteCategoryBtn);

    // Agregar elemento de categoría al contenedor de categorías
    categoryContainer.appendChild(categoryElement);

    addCategoryInput.value = '';
  }
});

// Función para eliminar categoría
function deleteCategory(categoryId) {
  const categoryIndex = categories.findIndex(category => category.id === categoryId); // Buscar el índice de la categoría en el arreglo categories
  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1); // Eliminar la categoría del arreglo categories
  }
}
