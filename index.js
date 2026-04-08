const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

let items = [];

if (!isBrowser) {
    console.warn('shopping-list/index.js is intended for browser use only.');
} else {
    const storage = window.localStorage;
    const nameInput = document.getElementById('itemInput');
    const costInput = document.getElementById('itemPrice');
    const list = document.getElementById('shoppingList');
    const total = document.getElementById('totalCost');

    const addButton = document.getElementById('addItemButton');
    const clearButton = document.getElementById('sortListButton');

    items = JSON.parse(storage.getItem('items')) || [];

    addButton.onclick = addItem;
    clearButton.onclick = clearList;

    function addItem() {
        let name = nameInput.value.trim();
        let cost = costInput.value.trim();

        if (name === '' || cost === '') {
            alert('Please enter both name and cost');
            return;
        }

        items.push({ name, cost, purchased: false });
        storage.setItem('items', JSON.stringify(items));
        nameInput.value = '';
        costInput.value = '';
        displayItems();
    }

    function displayItems() {
        list.innerHTML = '';
        let totalCost = 0;

        items.forEach(function(item, index) {
            let li = document.createElement('li');
            li.textContent = `${item.name} - $${item.cost}`;

            if (item.purchased) {
                li.classList.add('purchased');
                totalCost += parseFloat(item.cost) || 0;
            }

            let toggleButton = document.createElement('button');
            toggleButton.textContent = item.purchased ? 'Unmark Purchased' : 'Mark Purchased';
            toggleButton.onclick = function() {
                togglePurchased(index);
            };

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                deleteItem(index);
            };

            li.appendChild(toggleButton);
            li.appendChild(deleteButton);
            list.appendChild(li);
        });

        total.textContent = totalCost.toFixed(2);
        storage.setItem('items', JSON.stringify(items));
    }

    function togglePurchased(index) {
        if (items[index]) {
            items[index].purchased = !items[index].purchased;
            storage.setItem('items', JSON.stringify(items));
            displayItems();
        }
    }

    function deleteItem(index) {
        items.splice(index, 1);
        storage.setItem('items', JSON.stringify(items));
        displayItems();
    }

    function clearList() {
        items = [];
        storage.setItem('items', JSON.stringify(items));
        displayItems();
    }

    displayItems();
}



