let stores = [];

function loadStores() {
    const storedStores = localStorage.getItem('stores');
    if (storedStores) {
        stores = JSON.parse(storedStores);
    } else {
        stores = ['Default Store']; // Varsayılan bir mağaza
    }
    renderStores();
    if (stores.length > 0) {
        selectStore(0); // İlk mağazayı seç
    }
}

function saveStores() {
    localStorage.setItem('stores', JSON.stringify(stores));
}

function loadStoreData(storeName) {
    const data = JSON.parse(localStorage.getItem(`store_${storeName}`) || '{}');
    document.getElementById('title').value = data.title || '';
    document.getElementById('tags').value = data.tags || '';
    document.getElementById('description').value = data.description || '';
    countTitle(); // Karakter sayısını güncelle
    countTags();  // Etiket sayısını güncelle
}

function saveStoreData(storeName) {
    const data = {
        title: document.getElementById('title').value,
        tags: document.getElementById('tags').value,
        description: document.getElementById('description').value
    };
    localStorage.setItem(`store_${storeName}`, JSON.stringify(data));
}

function countTitle() {
    const title = document.getElementById('title').value;
    const remaining = 140 - title.length;
    document.getElementById('title-count').textContent = remaining;
    saveCurrentStoreData(); // Veriyi her değişiklikte kaydet
}

function countTags() {
    const tags = document.getElementById('tags').value;
    const tagArray = tags.split(',').filter(tag => tag.trim() !== '');
    const tagCount = tagArray.length;
    document.getElementById('tag-count').textContent = tagCount;
    if (tagCount > 13) {
        alert('Maksimum 13 etiket kullanabilirsiniz!');
    }
    saveCurrentStoreData(); // Veriyi her değişiklikte kaydet
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('description').value = '';
    document.getElementById('title-count').textContent = '140';
    document.getElementById('tag-count').textContent = '0';
    saveCurrentStoreData(); // Boş veriyi kaydet
}

function addStore() {
    const storeName = prompt('Mağaza adını girin:');
    if (storeName && !stores.includes(storeName.trim())) {
        stores.push(storeName.trim());
        saveStores();
        renderStores();
        selectStore(stores.length - 1); // Yeni eklenen mağazayı seç
    } else if (stores.includes(storeName.trim())) {
        alert('Bu mağaza zaten ekli!');
    }
}

function removeStore(index) {
    stores.splice(index, 1);
    saveStores();
    renderStores();
    if (stores.length > 0) {
        selectStore(0); // İlk mağazayı seç
    } else {
        clearForm(); // Mağazalar boşsa formu temizle
    }
}

function renderStores() {
    const storeList = document.getElementById('store-list');
    storeList.innerHTML = '';
    stores.forEach((store, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span onclick="selectStore(${index})">${store}</span>
            <button class="delete-btn" onclick="removeStore(${index})">Sil</button>
        `;
        if (index === 0) li.classList.add('active'); // İlk mağazayı varsayılan olarak seçili yap
        storeList.appendChild(li);
    });
}

function selectStore(index) {
    const storeItems = document.querySelectorAll('#store-list li');
    storeItems.forEach(item => item.classList.remove('active'));
    storeItems[index].classList.add('active');
    loadStoreData(stores[index]); // Seçilen mağazanın verilerini yükle
}

function saveCurrentStoreData() {
    if (stores.length > 0) {
        const activeStore = document.querySelector('#store-list li.active');
        if (activeStore) {
            const storeIndex = Array.from(document.querySelectorAll('#store-list li')).indexOf(activeStore);
            saveStoreData(stores[storeIndex]);
        }
    }
}

// Sayfa yüklendiğinde mağazaları ve verileri yükle
window.onload = function() {
    loadStores();
};