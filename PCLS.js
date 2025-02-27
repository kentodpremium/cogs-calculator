// Data Module
const DATA = {
    suggestions: {
        localpurchase: [
            { description: 'GRADE 700 6x1550x6000', partNumber: '1H4-0060-155600', price: 8986668 },
            { description: 'GRADE 700 6x1550x6096', partNumber: '1H4-0060-155609', price: 8461750 },
            { description: 'GRADE 700 6x1800x2980', partNumber: '1H4-0060-180298-X', price: 7105700 },
            { description: 'GRADE 700 6x1800x6020', partNumber: '1H4-0060-180602-X', price: 14223500 },
            { description: 'GRADE 700 6x2000x8000', partNumber: '1H4-0060-200800', price: 27500000 },
            { description: 'GRADE 700 6X2100X8400', partNumber: '1H4-0060-210840', price: 23687731 },
            { description: 'GRADE 700 6x2450x6700', partNumber: '1H4-0060-245670-X', price: 17070810 },
            { description: 'GRADE 700 6x2485x6000', partNumber: '1H4-0060-248600', price: 14747481 },
            { description: 'GRADE 700 6x2485x8000', partNumber: '1H4-0060-248800-X', price: 15463973 },
            { description: 'GRADE 700 6x2500x6000', partNumber: '1H4-0060-250600', price: 16386887 },
            { description: 'GRADE 700 6x2500x6000', partNumber: '1H4-0060-250600-X', price: 27229176 },
            { description: 'GRADE 700 6x2500x6000', partNumber: '1H4-0060-250600-X', price: 20674245 },
            { description: 'GRADE 700 6x2500x8000', partNumber: '1H4-0060-250800-X', price: 29076196 },
            { description: 'GRADE 700 6x1800x2980', partNumber: '1H4-0060-180298', price: 7105700 },
            { description: 'GRADE 700 6x1800x6020', partNumber: '1H4-0060-180602', price: 14223500 },
            { description: 'GRADE 700 6x2000x6000', partNumber: '1H4-0060-200600', price: 10059223 },
            { description: 'GRADE 700 6x2450x6700', partNumber: '1H4-0060-245670', price: 17070810 },
            { description: 'GRADE 700 6x2485x8000', partNumber: '1H4-0060-248800', price: 15463975 },
            { description: 'GRADE 700 6x2485x8000', partNumber: '1H4-0060-248800-S', price: 14824724 },
            { description: 'GRADE 700 6x2500x8000', partNumber: '1H4-0060-250800', price: 25465055 },
            { description: 'GRADE 700 8x2500x6000', partNumber: '1H4-0080-250600', price: 20091473 },
            { description: 'GRADE 700 8x2500x6000', partNumber: '1H4-0080-250600', price: 33912000 },
            { description: 'GRADE 700 8x2500x6500', partNumber: '1H4-0080-250650', price: 18002584 }
        ],
        consumable: [
            { description: 'AFNAC COOLANT', partNumber: 'CGS-001-AFN001', price: 9460000 },
            { description: 'GENERAL SPRAYER PLASTIK', partNumber: 'CGS-001-GEN015', price: 75000 },
            { description: 'GENERAL SPRAYER PLASTIK', partNumber: 'CGS-001-GEN015', price: 75000 },
            { description: 'HEO ENGINE OIL SAE 15W40 CF4', partNumber: 'CGS-001-HEO003', price: 7731000 },
            { description: 'TURALIK OIL 48', partNumber: 'CGS-001-TRK001', price: 43550 },
            { description: 'ARCAIR KAWAT LAS COUGING ARCAIR 6MM', partNumber: 'CGS-002-ARR001', price: 380000 },
            { description: 'ATL KWT LAS 3.2MM CHH 308-E8018-B2 @5KG', partNumber: 'CGS-002-ATL007', price: 44680 },
            { description: 'ATL KWT LAS 3.2MM CHH 308-E8018-B2 @5KG', partNumber: 'CGS-002-ATL007', price: 45332 },
            { description: 'ATL KWT LAS 4.0MM CHH 308-E8018-B2 @5KG', partNumber: 'CGS-002-ATL008', price: 38500 },
            { description: 'ATL KWT LAS 4.0MM CHH 308-E8018-B2 @5KG', partNumber: 'CGS-002-ATL008', price: 38500 }
        ],
        labor: [
            { description: 'Fabrication', partNumber: '', price: 165000 },
            { description: 'Assembly', partNumber: '', price: 165000 },
            { description: 'Installation', partNumber: '', price: 165000 },
            { description: 'Painting', partNumber: '', price: 165000 },
            { description: 'Design', partNumber: '', price: 115000 },
            { description: 'Transport', partNumber: '', price: 1000000 }
        ],
        service: [
            { description: 'Other', price: 0 },
            { description: 'Transportasi', price: 0 },
            { description: 'Sewa', price: 0 },
            { description: 'Akomodasi', price: 0 },
            { description: 'Engineering', price: 0 },
            { description: 'Management Fee', price: 0 },
            { description: 'Deliver', price: 0 },
            { description: 'MCU', price: 0 },
        ]
    }
};

// Utility Module
const UTIL = {
    parseFloatInput(value, isPrice = false) {
        if (!value) return 0;
        if (typeof value === 'string') {
            const normalized = value.replace(/,/g, '.').replace(/[^\d.-]/g, '');
            value = parseFloat(normalized) || 0;
        } else {
            value = parseFloat(value) || 0;
        }
        return isPrice ? value : value / 1000;
    },

    hideAllSuggestions() {
        document.querySelectorAll('.autocomplete-suggestions').forEach(box => {
            box.innerHTML = '';
            box.style.display = 'none';
        });
    }
};

// Calculator Module
const CALCULATOR = {
    calculateTotal(tabID) {
        const quantity = UTIL.parseFloatInput(document.getElementById(`quantity-${tabID}`).value, true);
        const pricePerPcs = UTIL.parseFloatInput(document.getElementById(`pricePerPcs-${tabID}`).value, true);
        const total = (quantity * pricePerPcs).toFixed(2);
        document.getElementById(`calculated-temp-${tabID}`).value = total;
        updateSummary();  // Add this line
        return total;
    },

    calculateTabTotal(tabID) {
        const table = document.getElementById(`serviceTable-${tabID}`);
        const totalIndex = tabID === 'service' ? 3 : 4; // Different column index for service tab
        const total = Array.from(table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'))
            .reduce((sum, row) => sum + (parseFloat(row.cells[totalIndex].innerText) || 0), 0);
        document.getElementById(`total-cost-${tabID}`).innerText = total.toFixed(2);
        updateSummary();  // Add this line
    },

    calculateLaborTotal() {
        const rate = UTIL.parseFloatInput(document.getElementById('pricePerPcs-labor').value, true);
        const duration = UTIL.parseFloatInput(document.getElementById('duration-labor').value, true);
        const workers = UTIL.parseFloatInput(document.getElementById('quantity-labor').value, true);
        const total = (rate * duration * workers).toFixed(2);
        document.getElementById('calculated-temp-labor').value = total;
        return total;
    }
};

// UI Module
const UI = {
    setupAutoComplete(tabID) {
        const input = document.getElementById(`description-${tabID}`);
        input.addEventListener('input', () => this.showDescriptionSuggestions(tabID));
        
        const partNumberInput = document.getElementById(`partNumber-${tabID}`);
        if (partNumberInput) {
            partNumberInput.addEventListener('input', () => this.showPartNumberSuggestions(tabID));
        }
    },

    showDescriptionSuggestions(tabID) {
        const input = document.getElementById(`description-${tabID}`);
        const suggestionsBox = document.getElementById(`description-suggestions-${tabID}`);
        const suggestions = DATA.suggestions[tabID] || [];
        
        if (!input || !suggestionsBox) return;

        const filtered = suggestions.filter(item => 
            item.description.toLowerCase().includes(input.value.toLowerCase())
        );

        this.renderSuggestions(filtered, suggestionsBox, item => {
            input.value = item.description;
            if (tabID === 'labor') {
                document.getElementById('pricePerPcs-labor').value = item.price;
                CALCULATOR.calculateLaborTotal();
            } else if (tabID === 'service') {
                document.getElementById('pricePerPcs-service').value = item.price;
                CALCULATOR.calculateTotal(tabID);
            } else {
                this.autocompletePartNumber(tabID, item.partNumber, item.price);
            }
            UTIL.hideAllSuggestions();
        });

        // Add blur event listener to hide suggestions when input loses focus
        input.addEventListener('blur', () => {
            // Small delay to allow click event on suggestions
            setTimeout(() => UTIL.hideAllSuggestions(), 200);
        });
    },

    showPartNumberSuggestions(tabID) {
        const partNumberInput = document.getElementById(`partNumber-${tabID}`);
        const suggestionsBox = document.getElementById(`partNumber-suggestions-${tabID}`);
        const suggestions = DATA.suggestions[tabID];
        const filtered = suggestions.filter(item =>
            item.partNumber.toLowerCase().includes(partNumberInput.value.toLowerCase())
        );
        suggestionsBox.innerHTML = '';
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            div.textContent = item.partNumber;
            div.onclick = () => {
                partNumberInput.value = item.partNumber;
                document.getElementById(`pricePerPcs-${tabID}`).value = item.price.toFixed(2);
                CALCULATOR.calculateTotal(tabID);
                UTIL.hideAllSuggestions();
            };
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = filtered.length ? 'block' : 'none';
    },

    renderSuggestions(items, container, onClick) {
        container.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            div.textContent = item.description;
            div.onclick = () => onClick(item);
            container.appendChild(div);
        });
        container.style.display = items.length ? 'block' : 'none';
    },

    autocompletePartNumber(tabID, partNumber, price) {
        const partNumberInput = document.getElementById(`partNumber-${tabID}`);
        const priceInput = document.getElementById(`pricePerPcs-${tabID}`);
        partNumberInput.oninput = () => this.showPartNumberSuggestions(tabID);
        partNumberInput.value = partNumber;
        priceInput.value = price.toFixed(2);
        partNumberInput.readOnly = false;
        CALCULATOR.calculateTotal(tabID);
    },

    clearInputs(tabID) {
        const fields = ['description', 'partNumber', 'quantity', 'pricePerPcs', 'calculated-temp'];
        fields.forEach(field => {
            const element = document.getElementById(`${field}-${tabID}`);
            if (element) {
                element.value = field === 'quantity' ? '1' : '0';
            }
        });
    },

    setupRealTimeCalculation(tabID) {
        const inputs = [
            `quantity-${tabID}`,
            `pricePerPcs-${tabID}`,
            `description-${tabID}`
        ];
        
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Use 'input' event instead of 'change' for real-time updates
                element.addEventListener('input', () => {
                    CALCULATOR.calculateTotal(tabID);
                });
            }
        });
    },

    setupTab(tabID) {
        this.setupAutoComplete(tabID);
        this.setupRealTimeCalculation(tabID);
        PASTE_HANDLER.enablePasteToTable(tabID);
    }
};

// Row Management Module
const ROW_MANAGER = {
    addRow(tabID) {
        if (tabID === 'labor') {
            this.addLaborRow();
            return;
        }

        const rowData = {
            description: document.getElementById(`description-${tabID}`).value,
            partNumber: tabID !== 'service' ? document.getElementById(`partNumber-${tabID}`).value : '',
            quantity: UTIL.parseFloatInput(document.getElementById(`quantity-${tabID}`).value, true),
            pricePerPcs: UTIL.parseFloatInput(document.getElementById(`pricePerPcs-${tabID}`).value, true)
        };

        if (!rowData.description) {
            alert("Description cannot be empty!");
            return;
        }

        this.insertRow(tabID, rowData);
        UI.clearInputs(tabID);
        CALCULATOR.calculateTabTotal(tabID);
        updateSummary();  // Add this line
    },

    insertRow(tabID, data) {
        const total = (data.quantity * data.pricePerPcs).toFixed(2);
        const tableBody = document.getElementById(`serviceTable-${tabID}`).getElementsByTagName('tbody')[0];
        const row = tableBody.insertRow();
        row.innerHTML = this.getRowHTML(tabID, data, total);
    },

    getRowHTML(tabID, data, total) {
        if (tabID === 'service') {
            return `
                <td contenteditable="true">${data.description}</td>
                <td contenteditable="true" oninput="ROW_MANAGER.updateTotal('${tabID}', this)">${data.quantity}</td>
                <td contenteditable="true" oninput="ROW_MANAGER.updateTotal('${tabID}', this)">${data.pricePerPcs}</td>
                <td>${total}</td>
                <td><button onclick="ROW_MANAGER.deleteRow(this)">Delete</button></td>
            `;
        }
        return `
            <td contenteditable="true">${data.description}</td>
            <td contenteditable="true">${data.partNumber}</td>
            <td contenteditable="true" oninput="ROW_MANAGER.updateTotal('${tabID}', this)">${data.quantity}</td>
            <td contenteditable="true" oninput="ROW_MANAGER.updateTotal('${tabID}', this)">${data.pricePerPcs}</td>
            <td>${total}</td>
            <td><button onclick="ROW_MANAGER.deleteRow(this)">Delete</button></td>
        `;
    },

    updateTotal(tabID, element) {
        const row = element.parentNode;
        if (tabID === 'service') {
            const quantity = UTIL.parseFloatInput(row.cells[1].innerText, true);
            const pricePerPcs = UTIL.parseFloatInput(row.cells[2].innerText, true);
            const total = (quantity * pricePerPcs).toFixed(2);
            row.cells[3].innerText = total;
        } else {
            // For other tabs
            const quantity = UTIL.parseFloatInput(row.cells[2].innerText, true);
            const pricePerPcs = UTIL.parseFloatInput(row.cells[3].innerText, true);
            const total = (quantity * pricePerPcs).toFixed(2);
            row.cells[4].innerText = total;
        }
        CALCULATOR.calculateTabTotal(tabID);
        updateSummary();  // Add this line
    },

    deleteRow(button) {
        const row = button.parentNode.parentNode;
        const tabID = row.closest('table').id.replace('serviceTable-', '');
        row.parentNode.removeChild(row);
        CALCULATOR.calculateTabTotal(tabID);
        updateSummary();  // Add this line
    },

    addLaborRow() {
        const description = document.getElementById('description-labor').value;
        if (!description) {
            alert("Service description cannot be empty!");
            return;
        }

        const rate = UTIL.parseFloatInput(document.getElementById('pricePerPcs-labor').value, true);
        const duration = UTIL.parseFloatInput(document.getElementById('duration-labor').value, true);
        const workers = UTIL.parseFloatInput(document.getElementById('quantity-labor').value, true);
        const total = CALCULATOR.calculateLaborTotal();

        const tableBody = document.getElementById('serviceTable-labor').getElementsByTagName('tbody')[0];
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td contenteditable="true">${description}</td>
            <td contenteditable="true" oninput="ROW_MANAGER.updateLaborTotal(this)">${rate}</td>
            <td contenteditable="true" oninput="ROW_MANAGER.updateLaborTotal(this)">${duration}</td>
            <td contenteditable="true" oninput="ROW_MANAGER.updateLaborTotal(this)">${workers}</td>
            <td>${total}</td>
            <td><button onclick="ROW_MANAGER.deleteLaborRow(this)">Delete</button></td>
        `;

        this.clearLaborInputs();
        CALCULATOR.calculateTabTotal('labor');
    },

    updateLaborTotal(element) {
        const row = element.parentNode;
        const rate = UTIL.parseFloatInput(row.cells[1].innerText, true);
        const duration = UTIL.parseFloatInput(row.cells[2].innerText, true);
        const workers = UTIL.parseFloatInput(row.cells[3].innerText, true);
        const total = (rate * duration * workers).toFixed(2);
        row.cells[4].innerText = total;
        CALCULATOR.calculateTabTotal('labor');
    },

    clearLaborInputs() {
        document.getElementById('description-labor').value = '';
        document.getElementById('pricePerPcs-labor').value = '0';
        document.getElementById('duration-labor').value = '1';
        document.getElementById('quantity-labor').value = '1';
        document.getElementById('calculated-temp-labor').value = '0';
    },

    deleteLaborRow(button) {
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        CALCULATOR.calculateTabTotal('labor');
    }
};

// Paste Handler Module
const PASTE_HANDLER = {
    enablePasteToTable(tabID) {
        const descriptionInput = document.getElementById(`description-${tabID}`);
        if (!descriptionInput) return;
        
        descriptionInput.onpaste = (event) => {
            event.preventDefault();
            const pasteData = event.clipboardData.getData('text');
            this.processPastedData(tabID, pasteData);
        };
    },

    processPastedData(tabID, pasteData) {
        const rows = pasteData
            .split('\n')
            .map(row => row.trim())
            .filter(row => row);

        rows.forEach(row => {
            const [partNumber, description] = row.split('\t');
            if (partNumber && description) {
                this.addRowFromPaste(tabID, description, partNumber);
            }
        });
    },

    addRowFromPaste(tabID, description, partNumber) {
        const rowData = {
            description,
            partNumber,
            quantity: 1,
            pricePerPcs: 0
        };
        ROW_MANAGER.insertRow(tabID, rowData);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    ['localpurchase', 'consumable', 'service'].forEach(tabID => {
        UI.setupTab(tabID);
        
        // Add input event listeners for real-time calculation
        const quantityInput = document.getElementById(`quantity-${tabID}`);
        const priceInput = document.getElementById(`pricePerPcs-${tabID}`);
        
        if (quantityInput && priceInput) {
            [quantityInput, priceInput].forEach(input => {
                input.addEventListener('input', () => CALCULATOR.calculateTotal(tabID));
            });
        }
    });
    
    // Setup labor calculations
    const laborInputs = ['pricePerPcs-labor', 'duration-labor', 'quantity-labor'];
    laborInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', CALCULATOR.calculateLaborTotal);
    });

    // Global click handler for suggestions
    document.addEventListener('click', event => {
        if (!event.target.closest('.autocomplete-suggestions')) {
            UTIL.hideAllSuggestions();
        }
    });

    // Setup suggestions box visibility
    const inputs = document.querySelectorAll('[id^="description-"]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            setTimeout(() => UTIL.hideAllSuggestions(), 200);
        });
    });
});

// Export necessary functions for global access
window.addRow = ROW_MANAGER.addRow.bind(ROW_MANAGER);
window.updateTotal = ROW_MANAGER.updateTotal.bind(ROW_MANAGER);
window.deleteRow = ROW_MANAGER.deleteRow.bind(ROW_MANAGER);
window.showDescriptionSuggestions = UI.showDescriptionSuggestions.bind(UI);
window.showPartNumberSuggestions = UI.showPartNumberSuggestions.bind(UI);
window.enablePasteToTable = PASTE_HANDLER.enablePasteToTable.bind(PASTE_HANDLER);
