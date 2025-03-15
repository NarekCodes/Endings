document.getElementById("submitBtn").addEventListener("click", function () {
    const promocodeInput = document.getElementById("promocode").value.trim();
    const message = document.getElementById("message");

    const validPromocodes = ["GoodGame", "FREEITEM"];

    if (validPromocodes.includes(promocodeInput)) {
        message.textContent = "✅ Promocode applied successfully!";
        message.style.color = "black";
        alert("The item has been added to your inventory!");

        // Add specific item for the promocode
        if (promocodeInput === "GoodGame") {
            addToInventory("brain.png");
        } else if (promocodeInput === "FREEITEM") {
            addToInventory("stickG.png");
        }

        // Update the inventory display after the item is added
        updateInventoryDisplay();
    } else {
        message.textContent = "❌ Invalid promocode!";
        message.style.color = "red";
    }
});

function back() {
    window.location.assign("index.html");
    console.log("second door");
}

function addToInventory(imageSrc) {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const maxItems = 8;

    if (inventory.length < maxItems) {
        inventory.push({ src: imageSrc, id: Date.now() }); // Add unique ID
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryDisplay(); // Update inventory display after adding
    }
}

// Function to update the inventory display
function updateInventoryDisplay() {
    const inventoryContainer = document.getElementById("inventory-slot");
    inventoryContainer.innerHTML = ""; // Clear the previous inventory items

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    inventory.forEach((item, index) => {
        let img = document.createElement("img");
        img.src = item.src;
        img.width = 50;
        img.height = 50;
        img.dataset.index = index; // Store the index for deletion

        img.ondblclick = function () {
            removeFromInventory(parseInt(this.dataset.index)); // Remove only the clicked item
        };

        inventoryContainer.appendChild(img);
    });
}

function removeFromInventory(index) {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    if (index >= 0 && index < inventory.length) {
        inventory.splice(index, 1); // Remove the clicked item only
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryDisplay(); // Refresh the inventory UI
    }
}

// Load inventory on page load
document.addEventListener("DOMContentLoaded", updateInventoryDisplay);
