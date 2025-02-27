// Tab Management
function openTab(evt, tabID) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (const tabContent of tabContents) {
        tabContent.style.display = "none";
    }
    const tabButtons = document.getElementsByClassName("tab-button");
    for (const tabButton of tabButtons) {
        tabButton.classList.remove("active");
    }

    document.getElementById(tabID).style.display = "block";
    evt.currentTarget.classList.add("active");

    enablePasteToTable(tabID);

    if (tabID === 'summary') {
        updateSummary();
    }
}

function updateSummary() {
    // Get values from each tab
    const localPurchaseTotal = parseFloat(document.getElementById('total-cost-localpurchase').textContent) || 0;
    const materialTotal = parseFloat(document.getElementById('total-cost-material').textContent) || 0;
    const consumableTotal = parseFloat(document.getElementById('total-cost-consumable').textContent) || 0;
    const manufacturingTotal = parseFloat(document.getElementById('total-cost-manufacturing').textContent) || 0;
    const serviceTotal = parseFloat(document.getElementById('total-cost-service').textContent) || 0;
    const laborTotal = parseFloat(document.getElementById('total-cost-labor').textContent) || 0;

    // Update individual summary fields
    document.getElementById('summary-localpurchase').textContent = localPurchaseTotal.toFixed(2);
    document.getElementById('summary-material').textContent = materialTotal.toFixed(2);
    document.getElementById('summary-consumable').textContent = consumableTotal.toFixed(2);
    document.getElementById('summary-manufacturing').textContent = manufacturingTotal.toFixed(2);
    document.getElementById('summary-service').textContent = serviceTotal.toFixed(2);
    document.getElementById('summary-labor').textContent = laborTotal.toFixed(2);

    // Calculate totals
    const totalDM = localPurchaseTotal + materialTotal + consumableTotal;
    const totalDL = manufacturingTotal + serviceTotal + laborTotal;
    const totalCOGM = totalDM + totalDL;

    // Update total fields
    document.getElementById('total-dm').textContent = totalDM.toFixed(2);
    document.getElementById('total-dl').textContent = totalDL.toFixed(2);
    document.getElementById('total-cogm').textContent = totalCOGM.toFixed(2);

    // Calculate COGS
    const overheadCost = parseFloat(document.getElementById('overhead-cost').value) || 0;
    const totalCOGS = totalCOGM * (1 + overheadCost / 100);

    // Update COGS field
    document.getElementById('total-cogs').textContent = totalCOGS.toFixed(2);

    // Calculate Selling Price with GP%
    const grossProfit = parseFloat(document.getElementById('gross-profit').value) || 0;
    const sellingPrice = grossProfit === 100 ? 0 : totalCOGS / (1 - (grossProfit / 100));

    // Update Selling Price field
    document.getElementById('selling-price').textContent = sellingPrice.toFixed(2);

    updateSellingPriceTable();
}

// Update calculateTabTotal function
function calculateTabTotal(tabID) {
    // ...existing code...
    const total = calculateTotalForTab(tabID); // Ensure this function is defined
    document.getElementById(`total-cost-${tabID}`).innerText = total.toFixed(2);
    updateSummary();  // Add this line
}

// Ensure this function is defined
function calculateMaterialTableTotal() {
    // Implement the logic to calculate the total for the material table
    // Example:
    let total = 0;
    const rows = document.querySelectorAll('#material-table tbody tr');
    rows.forEach(row => {
        const cost = parseFloat(row.querySelector('.cost').textContent) || 0;
        total += cost;
    });
    return total;
}

function addSellingPriceRow() {
    const tbody = document.getElementById('sellingPriceTableBody');
    const row = tbody.insertRow();
    const currentSellingPrice = document.getElementById('selling-price').textContent;
    const currentCOGS = parseFloat(document.getElementById('total-cogs').textContent) || 0;
    
    row.innerHTML = `
        <td contenteditable="true" onblur="calculateRowGP(this)">${currentSellingPrice}</td>
        <td>0.00%</td>
        <td><button onclick="deleteSellingPriceRow(this)">Delete</button></td>
    `;
    calculateRowGP(row.cells[0]);
}

function deleteSellingPriceRow(button) {
    const row = button.closest('tr');
    row.parentNode.removeChild(row);
}

function calculateRowGP(cell) {
    const row = cell.closest('tr');
    const sellingPrice = parseFloat(cell.textContent) || 0;
    const cogs = parseFloat(document.getElementById('total-cogs').textContent) || 0;
    const gp = sellingPrice > 0 ? ((sellingPrice - cogs) / sellingPrice * 100) : 0;
    row.cells[1].textContent = gp.toFixed(2) + '%';
}

function updateSellingPriceTable() {
    const rows = document.getElementById('sellingPriceTableBody').getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        calculateRowGP(row.cells[0]);
    });
}

// Add this at the end of your existing script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Remove toggle nav event listeners
    
    // Set first tab as active by default
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.click();
    }
});

function calculateLaborTotal() {
    // Implement the logic to calculate the total for the labor table
    // Example:
    let total = 0;
    const rows = document.querySelectorAll('#labor-table tbody tr');
    rows.forEach(row => {
        const cost = parseFloat(row.querySelector('.cost').textContent) || 0;
        total += cost;
    });
    return total;
}

function addLaborRow() {
    const description = document.getElementById('description-labor').value;
    if (!description) {
        alert("Service description cannot be empty!");
        return;
    }
    const rate = parseFloat(document.getElementById('rate-labor').value) || 0;
    const duration = parseFloat(document.getElementById('duration-labor').value) || 0;
    const workers = parseFloat(document.getElementById('workers-labor').value) || 0;
    const total = (rate * duration * workers).toFixed(2);
    const tableBody = document.getElementById('serviceTable-labor').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();
    row.innerHTML = `
        <td contenteditable="true">${description}</td>
        <td contenteditable="true" oninput="updateLaborTotal(this)">${rate}</td>
        <td contenteditable="true" oninput="updateLaborTotal(this)">${duration}</td>
        <td contenteditable="true" oninput="updateLaborTotal(this)">${workers}</td>
        <td>${total}</td>
        <td><button onclick="deleteLaborRow(this)">Delete</button></td>
    `;
    calculateTabTotal('labor');
}

function updateLaborTotal(element) {
    const row = element.parentNode;
    const rate = parseFloat(row.cells[1].innerText) || 0;
    const duration = parseFloat(row.cells[2].innerText) || 0;
    const workers = parseFloat(row.cells[3].innerText) || 0;
    const total = (rate * duration * workers).toFixed(2);
    row.cells[4].innerText = total;
    calculateTabTotal('labor');
}

function deleteLaborRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateTabTotal('labor');
}

document.addEventListener('DOMContentLoaded', function() {
    const laborInputs = ['pricePerPcs-labor', 'duration-labor', 'quantity-labor'];
    laborInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateLaborTotal);
    });
});

function updateMaterialImage(materialShape) {
    const imageContainer = document.getElementById('material-image');
    if (!imageContainer) return;

    if (!materialShape) {
        imageContainer.innerHTML = '<div class="image-placeholder">Select a material shape to view diagram</div>';
        return;
    }

    // Update the image path to use the correct directory and file extension
    const imagePath = `./img/${materialShape}-diagram.png`;
    imageContainer.innerHTML = `
        <img src="${imagePath}" 
             alt="${materialShape} diagram" 
             onerror="handleImageError(this)"
             class="material-shape-image">`;
}

function handleImageError(img) {
    const materialShape = img.alt.replace(' diagram', '');
    img.parentElement.innerHTML = `
        <div class="image-placeholder">
            <span>Diagram for ${materialShape}</span>
            <br>
            <small>Image not found: ${img.src}</small>
        </div>`;
}

