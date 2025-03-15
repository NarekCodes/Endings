// List of pairs of values for memory game (you can use images or text)
const cardValues = ['🍎', '🍌', '🍒', '🍍', '🍓', '🍇', '🍊', '🍉'];
let gameDeck = [...cardValues, ...cardValues]; // Duplicate to create pairs
let flippedCards = [];
let matchedPairs = 0;

// Shuffle the deck
function shuffleDeck() {
  for (let i = gameDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameDeck[i], gameDeck[j]] = [gameDeck[j], gameDeck[i]]; // Swap
  }
}

// Create the game cards
function createCards() {
  shuffleDeck();
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Clear any previous cards
  gameDeck.forEach((value, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-index', index);
    card.addEventListener('click', flipCard);
    container.appendChild(card);
  });
}

// Flip the card
function flipCard(event) {
  const card = event.target;
  if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
    card.classList.add('flipped');
    card.textContent = gameDeck[card.getAttribute('data-index')];
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}

// Check if the two flipped cards match
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const firstValue = firstCard.textContent;
  const secondValue = secondCard.textContent;

  if (firstValue === secondValue) {
    matchedPairs++;
    flippedCards = [];

    // If all pairs are matched, show the reward and give items
    if (matchedPairs === cardValues.length) {
      document.getElementById('reward').style.display = 'block';

      // Show alert and update inventory with new items
      alert("Congratulations! You have earned new items!");
      
      // Add both items to the inventory
      addToInventory('book.png');
      
      // Update the inventory display after both items are added
      updateInventoryDisplay();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      flippedCards = [];
    }, 1000); // Delay to flip back
  }
}

// Function to add item to inventory when clicked
function addToInventory(itemSrc) {
  let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  const maxItems = 4;

  if (inventory.length < maxItems) {
    inventory.push({ src: itemSrc, id: Date.now() });
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }
}

// Function to update the inventory display
function updateInventoryDisplay() {
  const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  const inventoryDisplay = document.getElementById('inventory-display');
  
  inventoryDisplay.innerHTML = ''; // Clear current inventory display

  // Show the items added in the inventory
  inventory.forEach(item => {
    const itemImage = document.createElement('img');
    itemImage.src = item.src;
    inventoryDisplay.appendChild(itemImage);
  });
}

// Start the game
createCards();

function navigateToPage(page) {
  window.location.assign(page);
  console.log(`${page} accessed`);
}