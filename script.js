// Function to navigate between pages
function navigateToPage(page) {
    window.location.assign(page);
    console.log(`${page} accessed`);
}

// Inventory System
function addToInventory(imageSrc) {
    const maxItems = 6;
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    if (inventory.length < maxItems) {
        const uniqueId = new Date().getTime();
        const item = { src: imageSrc, id: uniqueId };

        inventory.push(item);
        localStorage.setItem("inventory", JSON.stringify(inventory));

        updateInventoryDisplay();
    }
}

function removeFromInventory(itemId) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory = inventory.filter((item) => item.id !== itemId);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryDisplay();
}

function updateInventoryDisplay() {
    const inventorySlot = document.getElementById("inventory-slot");
    if (!inventorySlot) return; // Stop execution if the element does not exist

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventorySlot.innerHTML = "";

    inventory.forEach((item) => {
        const img = document.createElement("img");
        img.src = item.src;
        img.dataset.id = item.id;
        img.width = 100;
        img.height = 100;
        img.onclick = addItemToEnchant;
        img.ondblclick = function () {
            removeFromInventory(item.id);
        };
        inventorySlot.appendChild(img);
    });
}


// Enchanting System
let selectedItem = null;

function addItemToEnchant(event) {
    selectedItem = event.target;

    const selectedItemElement = document.getElementById("selected-item");
    selectedItemElement.innerHTML = "";

    const itemElement = document.createElement("img");
    itemElement.src = selectedItem.src;
    itemElement.width = 100;
    itemElement.height = 100;

    selectedItemElement.appendChild(itemElement);
}

function enchantItem() {
    if (!selectedItem) {
        alert("Select an item to enchant first!");
        return;
    }

    console.log("Selected item src:", selectedItem.src);

    const enchantment = document.getElementById("enchantment-select").value;
    alert(`Your item has been enchanted with ${enchantment}!`);

    let newSrc = "";
    let newName = "";

    if (enchantment === "Fire") {
        if (selectedItem.src.includes("heart.png")) {
            newSrc = "heartG.png";
            newName = "heartG";
        } else if (selectedItem.src.includes("stick.png")) {
            newSrc = "stickG.png";
            newName = "stickG";
        } else if (selectedItem.src.includes("book.png")) {
            newSrc = "brain.png";
            newName = "brain";
        } else if (selectedItem.src.includes("banana.png")) {
            newSrc = "peel.png";
            newName = "peel";
        } else {
            alert("This item cannot be enchanted!");
            return;
        }

        selectedItem.src = newSrc;

        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

        inventory = inventory.map((item) => {
            if (item.id == selectedItem.dataset.id) {
                return { ...item, src: newSrc, name: newName };
            }
            return item;
        });

        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateInventoryDisplay();
    }
}

// Consolidated inventory check function
function checkItemsInInventory(items, successMessage, failureMessage, keySrc, conditionContainerId) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    const areItemsPresent = items.every(item => inventory.some(i => i.src === item));

    const conditionContainer = document.getElementById(conditionContainerId);

    if (areItemsPresent) {
        conditionContainer.innerHTML = `
            <div class="condition2">
                <h1>Congratulations!</h1>
                <h3>${successMessage}</h3>
                <img src="doorO.png" width="150" height="150" alt="door" onclick="enchant()">
            </div>
        `;
        alert("You have received a key! It has been added to your inventory.");

        const keyItem = {
            src: keySrc,
            id: new Date().getTime(),
            name: keySrc.split('/').pop().split('.')[0], // Fixing key name extraction
        };

        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.push(keyItem);
        localStorage.setItem("inventory", JSON.stringify(inventory));

        updateInventoryDisplay();
    } else {
        conditionContainer.innerHTML = `
            <div class="condition1">
                <h1>You lost the battle!</h1>
                <p>${failureMessage}</p>
            </div>
        `;
    }
}

// Final Door Key Check
function checkForFinalDoorKey() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const requiredKeys = ["key1.png", "key2.png"]; // Adjust key names if needed

    const hasAllKeys = requiredKeys.every(key => inventory.some(item => item.src === key));

    if (hasAllKeys) {
        navigateToPage('finalDoor.html');
    } else {
        alert("You need to collect all the keys to open the final door!");
        navigateToPage('index.html'); // Redirects back to index.html
    }
}


// Boss Reward Handling (after winning boss)
function giveBossReward() {
    const rewardItem = {
        src: "key1.png", // Adjust based on actual key images
        id: new Date().getTime(),
        name: "key1",
    };

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory.push(rewardItem);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    updateInventoryDisplay();
    alert("Congratulations, you won the boss fight! A key has been added to your inventory.");
}

// Inventory Clear Function
function itemClear() {
    localStorage.removeItem("inventory");
    updateInventoryDisplay();
    alert("Ha-Ha, your inventory got cleared!");
}

// Initialize inventory on page load
window.onload = updateInventoryDisplay;
