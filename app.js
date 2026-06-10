let artworks = [
  { id: 1, title: "Катерина",       author: "Тарас Шевченко",  year: 1842, genre: "живопис",   desc: "Картина маслом, зображення долі покритки" },
  { id: 2, title: "Думи мої",       author: "Тарас Шевченко",  year: 1840, genre: "поезія",    desc: "Перший вірш збірки «Кобзар»" },
  { id: 3, title: "Богдан Хмельницький", author: "Михайло Мікешин", year: 1888, genre: "скульптура", desc: "Пам'ятник у Києві на Софійській площі" },
];
let nextId = 4;

function createArtwork(title, author, year, genre, desc) {
  const newArtwork = {
    id:     nextId++,
    title:  title,
    author: author,
    year:   year,
    genre:  genre,
    desc:   desc,
  };

  artworks.push(newArtwork);
  return newArtwork;
}

function getAllArtworks() {
  return artworks;
}

function getArtworkById(id) {
  return artworks.find(function(item) {
    return item.id === id;
  });
}

function searchArtworks(query) {
  const q = query.toLowerCase();
  return artworks.filter(function(item) {
    return (
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q)
    );
  });
}

function updateArtwork(id, title, author, year, genre, desc) {
  const index = artworks.findIndex(function(item) {
    return item.id === id;
  });

  if (index === -1) return false; 

  artworks[index] = {
    id:     id,
    title:  title,
    author: author,
    year:   year,
    genre:  genre,
    desc:   desc,
  };

  return true;
}

function deleteArtwork(id) {
  const before = artworks.length;
  artworks = artworks.filter(function(item) {
    return item.id !== id;
  });
  return artworks.length < before; 
}


function renderTable(list) {
  const tbody       = document.getElementById('artworks-tbody');
  const emptyMsg    = document.getElementById('empty-message');
  const countLabel  = document.getElementById('count-label');

  countLabel.textContent = 'Записів: ' + list.length;

  if (list.length === 0) {
    tbody.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }
  emptyMsg.classList.add('hidden');

  tbody.innerHTML = list.map(function(item, index) {
    return (
      '<tr>' +
        '<td>' + (index + 1) + '</td>' +
        '<td>' +
          '<div class="td-title">' + item.title + '</div>' +
          (item.desc ? '<div class="td-desc">' + item.desc + '</div>' : '') +
        '</td>' +
        '<td>' + item.author + '</td>' +
        '<td>' + (item.year || '—') + '</td>' +
        '<td><span class="badge badge-' + item.genre + '">' + item.genre + '</span></td>' +
        '<td>' +
          '<button class="btn-edit"   onclick="onEditClick(' + item.id + ')">✏️ Редагувати</button>' +
          '<button class="btn-delete" onclick="onDeleteClick(' + item.id + ')">🗑️ Видалити</button>' +
        '</td>' +
      '</tr>'
    );
  }).join('');
}

function refreshTable() {
  const query = document.getElementById('search-input').value;
  const list  = query ? searchArtworks(query) : getAllArtworks();
  renderTable(list);
}

function getFormValues() {
  return {
    id:     document.getElementById('field-id').value,
    title:  document.getElementById('field-title').value.trim(),
    author: document.getElementById('field-author').value.trim(),
    year:   parseInt(document.getElementById('field-year').value) || 0,
    genre:  document.getElementById('field-genre').value,
    desc:   document.getElementById('field-desc').value.trim(),
  };
}

function fillForm(artwork) {
  document.getElementById('field-id').value     = artwork.id;
  document.getElementById('field-title').value  = artwork.title;
  document.getElementById('field-author').value = artwork.author;
  document.getElementById('field-year').value   = artwork.year || '';
  document.getElementById('field-genre').value  = artwork.genre;
  document.getElementById('field-desc').value   = artwork.desc || '';
  document.getElementById('form-title').textContent = '✏️ Редагувати твір';
}

function clearForm() {
  document.getElementById('artwork-form').reset();
  document.getElementById('field-id').value = '';
  document.getElementById('form-title').textContent = 'Додати твір';
}

function showAlert(message, type) {
  const box = document.getElementById('alert-box');
  box.textContent = message;
  box.className = 'alert ' + type; 
  box.classList.remove('hidden');
  setTimeout(function() {
    box.classList.add('hidden');
  }, 3000);
}


function onFormSubmit(event) {
  event.preventDefault(); 

  const values = getFormValues();

  if (!values.title || !values.author) {
    showAlert('❌ Заповніть назву та автора!', 'error');
    return;
  }

  if (values.id) {
    const ok = updateArtwork(
      parseInt(values.id),
      values.title,
      values.author,
      values.year,
      values.genre,
      values.desc
    );
    if (ok) showAlert('✅ Твір оновлено!', 'success');

  } else {
    createArtwork(
      values.title,
      values.author,
      values.year,
      values.genre,
      values.desc
    );
    showAlert('✅ Твір додано!', 'success');
  }

  clearForm();
  refreshTable();
}

function onEditClick(id) {
  const artwork = getArtworkById(id);
  if (!artwork) return;
  fillForm(artwork);

  document.getElementById('artwork-form').scrollIntoView({ behavior: 'smooth' });
}

function onDeleteClick(id) {
  const artwork = getArtworkById(id);
  if (!artwork) return;

  const confirmed = confirm('Видалити твір "' + artwork.title + '"?');
  if (!confirmed) return;

  deleteArtwork(id);
  showAlert('🗑️ Твір видалено', 'success');
  refreshTable();
}

function onSearchInput() {
  refreshTable();
}

function onCancelClick() {
  clearForm();
}


document.getElementById('artwork-form').addEventListener('submit', onFormSubmit);
document.getElementById('btn-cancel').addEventListener('click', onCancelClick);
document.getElementById('search-input').addEventListener('input', onSearchInput);


refreshTable();