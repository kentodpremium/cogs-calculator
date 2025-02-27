// ERORR
// ketika manufacturing udah di ceklis, angkanya diedit, amount cost nya tidak berubah, manufacturing pakainya netweight bukan grossweight

// Add this utility function at the top of the file
function parseFloatInput(value) {
    if (!value) return 0;
    if (typeof value === 'string') {
        // Handle both comma and dot, and multiple instances
        const normalized = value.replace(/,/g, '.').replace(/[^\d.-]/g, '');
        return parseFloat(normalized) || 0;
    }
    return parseFloat(value) || 0;
}

// Add manufacturingServices constant near the top with other constants
const manufacturingServices = {
    Cutting: {
        mildSteel: { costPerKg: 3000 },
        highGradeHardened: { costPerKg: 3000 },
        stainlessSteel: { costPerKg: 4500 }
    },
    Forming: {
        mildSteel: { costPerKg: 2500 },
        highGradeHardened: { costPerKg: 4500 },
        stainlessSteel: { costPerKg: 4500 }
    },
    Rolling: {
        mildSteel: { costPerKg: 3500 },
        highGradeHardened: { costPerKg: 4500 },
        stainlessSteel: { costPerKg: 4500 }
    },
    Machining: {
        mildSteel: { costPerKg: 3500 },
        highGradeHardened: { costPerKg: 6000 },
        stainlessSteel: { costPerKg: 6000 }
    }
};

// Add this near the top of the file after utility functions
const materialShapeConfigurations = {
    plate: {
        name: "Plate",
        fields: ['length', 'width', 'thickness'],
        formula: "length × width × thickness × density",
        example: "Example: 1000mm × 500mm × 6mm",
        calculateWeight: (dimensions, density) => {
            return (dimensions.length * dimensions.width * dimensions.thickness * density) / 1000000;
        }
    },
    'h-beam': {
        name: "H-Beam",
        fields: ['length', 'webThickness', 'webHeight', 'flangeWidth', 'flangeThickness'],
        formula: "length × ((2 × flangeWidth × flangeThickness) + (webHeight × webThickness)) × density",
        example: "Example: L=1000mm, Web=6mm × 200mm, Flange=100mm × 8mm",
        calculateWeight: (dimensions, density) => {
            const area = (2 * dimensions.flangeWidth * dimensions.flangeThickness) + 
                        (dimensions.webHeight * dimensions.webThickness);
            return (dimensions.length * area * density) / 1000000;
        }
    },
    'round-bar': {
        name: "Round Bar",
        fields: ['length', 'diameter'],
        formula: "π × (diameter/2)² × length × density",
        example: "Example: L=1000mm, D=50mm",
        calculateWeight: (dimensions, density) => {
            return (Math.PI * Math.pow(dimensions.diameter/2, 2) * dimensions.length * density) / 1000000;
        }
    },
    'pipe': {
        name: "Pipe",
        fields: ['length', 'outerDiameter', 'innerDiameter'],
        formula: "π × length × ((outerDiameter/2)² - (innerDiameter/2)²) × density",
        example: "Example: L=1000mm, OD=60mm, ID=50mm",
        calculateWeight: (dimensions, density) => {
            return (Math.PI * dimensions.length * 
                    (Math.pow(dimensions.outerDiameter/2, 2) - Math.pow(dimensions.innerDiameter/2, 2)) * 
                    density) / 1000000;
        }
    },
    'unp': {
        name: "UNP",
        fields: ['length', 'webThickness', 'webHeight', 'flangeWidth', 'flangeThickness'],
        formula: "length × ((2 × flangeWidth × flangeThickness) + (webHeight × webThickness)) × density",
        example: "Example: L=1000mm, Web=6mm × 200mm, Flange=75mm × 8mm",
        calculateWeight: (dimensions, density) => {
            const area = (2 * dimensions.flangeWidth * dimensions.flangeThickness) + 
                        (dimensions.webHeight * dimensions.webThickness);
            return (dimensions.length * area * density) / 1000000;
        }
    },
    'angle': {
        name: "Angle",
        fields: ['length', 'legA', 'legB', 'thickness'],
        formula: "length × (legA × thickness + legB × thickness) × density",
        example: "Example: L=1000mm, Leg A=50mm, Leg B=75mm, T=5mm",
        calculateWeight: (dimensions, density) => {
            return (dimensions.length * 
                   ((dimensions.legA * dimensions.thickness) + 
                    (dimensions.legB * dimensions.thickness)) * 
                   density) / 1000000;
        }
    }
};


// Reorder material configurations to put plate first



// Add this function to get the appropriate label for each field
function getFieldLabel(field) {
    const labels = {
        'length': 'Panjang',
        'width': 'Lebar',
        'thickness': 'Tebal',
        'diameter': 'Diameter',
        'outerDiameter': 'Diameter Luar',
        'innerDiameter': 'Diameter Dalam',
        'webThickness': 'Tebal Web',
        'webHeight': 'Tinggi Web',
        'flangeWidth': 'Lebar Flange',
        'flangeThickness': 'Tebal Flange',
        'legA': 'Panjang Kaki A',
        'legB': 'Panjang Kaki B'
    };
    return labels[field] || field;
}

// Update the updateDimensionFields function to handle new fields
function updateDimensionFields(materialShape) {
    // Hide all fields if no material type is selected
    if (!materialShape) {
        const allFields = [
            'length', 'width', 'thickness', 'diameter',
            'webThickness', 'webHeight', 'flangeWidth', 'flangeThickness',
            'legA', 'legB', 'outerDiameter', 'innerDiameter'
        ];
        
        // Hide all containers
        allFields.forEach(field => {
            const container = document.getElementById(`${field}-container`);
            if (container) container.style.display = 'none';
        });

        // Clear formula display
        const formulaDisplay = document.getElementById('formula-display');
        if (formulaDisplay) {
            formulaDisplay.innerHTML = '<strong>Selected a material shape</strong>';
        }

        return;
    }

    // Rest of the existing function code remains the same
    const config = materialShapeConfigurations[materialShape];
    if (!config) return;

    // Store current grade selection before clearing
    const currentGrade = document.getElementById('grade-material').value;
    const selectedCheckbox = document.querySelector('input[name="materialGrade"]:checked');
    const selectedIndex = selectedCheckbox ? parseInt(selectedCheckbox.value) : -1;

    // Get all possible field containers
    const allFields = [
        'length', 'width', 'thickness', 'diameter',
        'webThickness', 'webHeight', 'flangeWidth', 'flangeThickness',
        'legA', 'legB', 'outerDiameter', 'innerDiameter'
    ];

    // First hide all containers
    allFields.forEach(field => {
        const container = document.getElementById(`${field}-container`);
        if (container) container.style.display = 'none';
    });

    // Show only the containers for the required fields
    config.fields.forEach(field => {
        const container = document.getElementById(`${field}-container`);
        if (container) {
            container.style.display = 'block';
            const label = container.querySelector('label');
            if (label) {
                label.textContent = `${getFieldLabel(field)} (mm):`;
            }
            // Remove old listeners first to prevent duplicates
            const input = container.querySelector('input');
            if (input) {
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                // Add new input event listener
                newInput.addEventListener('input', () => {
                    calculateWeight();
                    calculatePricePerPcs();
                    calculateMaterialCost();
                });
            }
        }
    });

    // Update formula display
    const formulaDisplay = document.getElementById('formula-display');
    if (formulaDisplay) {
        formulaDisplay.innerHTML = `
            <strong>Rumus:</strong> ${config.formula}<br>
            <strong>${config.example}</strong>
        `;
    }

    clearDimensionInputs();
    
    // Restore material selection if exists
    if (selectedIndex >= 0) {
        const material = gradeMaterialData[selectedIndex];
        const isPriceTypeStockist = document.querySelector(`input[name="priceType_${selectedIndex}"][value="stockist"]`).checked;
        
        document.getElementById('grade-material').value = currentGrade;
        document.getElementById('density').value = material.density;
        document.getElementById('material-price').value = 
            isPriceTypeStockist ? material.stockistPrice : material.exMillPrice;
    }
    
    calculateWeight();
    updateMaterialImage(materialShape);
}

// Helper function to get units
function getUnit(field) {
    switch (field) {
        case 'length': return 'mm';
        case 'width': return 'mm';
        case 'thickness': return 'mm';
        case 'diameter': return 'mm';
        default: return '';
    }
}

// Update the calculateWeight function
function calculateWeight() {
    const manualWeightCheck = document.getElementById('manual-weight-check');
    const weightInput = document.getElementById('weight');
    
    if (!manualWeightCheck.checked) {
        // If manual weight is not checked, calculate from dimensions
        const materialShape = document.getElementById('material-shape').value;
        const config = materialShapeConfigurations[materialShape];
        if (!config) return;

        const dimensions = {};
        let allFieldsFilled = true;
        
        config.fields.forEach(field => {
            const value = parseFloatInput(document.getElementById(field).value);
            dimensions[field] = value;
            if (!value) allFieldsFilled = false;
        });

        if (allFieldsFilled) {
            const density = parseFloatInput(document.getElementById('density').value);
            if (!density) return;

            const weight = config.calculateWeight(dimensions, density);
            weightInput.value = weight;
            // Update gross weight whenever weight changes
            calculateGrossWeight();
            calculatePricePerPcs();
            calculateMaterialCost();
        }
    }
}

// Clear dimension inputs
function clearDimensionInputs() {
    const allFields = [
        'length', 'width', 'thickness', 'diameter',
        'webThickness', 'webHeight', 'flangeWidth', 'flangeThickness',
        'legA', 'legB', 'outerDiameter', 'innerDiameter'
    ];
    
    allFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) input.value = '';
    });
}

// Update the grade material data structure
const gradeMaterialData = [
    { grade: 'SS400 (GRADE 250)', materialType: 'mildSteel', density: 7.85, stockistPrice: 13000, exMillPrice: 13000 * 0.9 },
    { grade: 'SM49OYA (GRADE 350)', materialType: 'mildSteel', density: 7.85, stockistPrice: 15000, exMillPrice: 15000 * 0.9 },
    { grade: 'HBN 400', materialType: 'highGradeHardened', density: 8.05, stockistPrice: 42000, exMillPrice: 42000 * 0.9 },
    { grade: 'HBN 450', materialType: 'highGradeHardened', density: 8.05, stockistPrice: 42000, exMillPrice: 42000 * 0.9 },
    { grade: 'HBN 500', materialType: 'highGradeHardened', density: 8.05, stockistPrice: 50000, exMillPrice: 50000 * 0.9 },
    { grade: 'GRADE 700', materialType: 'highGradeHardened', density: 8.05, stockistPrice: 42000, exMillPrice: 42000 * 0.9 },
    { grade: 'Stainless Steel', materialType: 'stainlessSteel', density: 8.00, stockistPrice: 60000, exMillPrice: 60000 * 0.9 }
];

// Update the showGradeSuggestions function
function showGradeSuggestions() {
    const input = document.getElementById('grade-material');
    const suggestionsBox = document.getElementById('grade-suggestions');
    
    if (!input || !suggestionsBox) return;

    const filtered = input.value.trim() === '' ? 
        gradeMaterialData : 
        gradeMaterialData.filter(item =>
            item.grade.toLowerCase().includes(input.value.toLowerCase()) ||
            item.materialType.toLowerCase().includes(input.value.toLowerCase())
        );

    suggestionsBox.innerHTML = '';
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = `${item.grade} - ${item.materialType} (Stockist: ${item.stockistPrice.toLocaleString()}, Ex-Mill: ${item.exMillPrice.toLocaleString()} /kg)`;
        div.onclick = () => {
            input.value = item.grade;
            document.getElementById('density').value = item.density;
            // Add option to choose between stockist and ex-mill price
            const useStockistPrice = true; // You can make this a user choice
            document.getElementById('material-price').value = useStockistPrice ? item.stockistPrice : item.exMillPrice;
            calculateWeight();
            calculateMaterialCost();
            suggestionsBox.style.display = 'none';
        };
        suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = filtered.length ? 'block' : 'none';
}

// Add function to calculate material cost
function calculateMaterialCost() {
    const pricePerPcs = parseFloat(document.getElementById('price-per-pcs').value) || 0;
    const quantity = parseFloat(document.getElementById('quantity').value) || 1;

    // Calculate total cost
    const totalCost = pricePerPcs * quantity;
    document.getElementById('calculated-cost-material').value = totalCost.toFixed(2);
}

// Add event listener for grade material input
document.addEventListener('DOMContentLoaded', function() {
    const gradeInput = document.getElementById('grade-material');
    if (gradeInput) {
        gradeInput.addEventListener('focus', showGradeSuggestions);
        gradeInput.addEventListener('input', showGradeSuggestions);
    }
});

// Update event listeners
document.addEventListener('DOMContentLoaded', function() {
    // ...existing event listeners...

    // Add listeners for material cost calculation
    ['weight', 'material-price', 'nesting', 'quantity'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculateMaterialCost);
            element.addEventListener('change', calculateMaterialCost);
        }
    });
});

// Add after other existing event listeners in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Add manual weight checkbox handler
    const manualWeightCheck = document.getElementById('manual-weight-check');
    const weightInput = document.getElementById('weight');
    
    if (manualWeightCheck && weightInput) {
        // Set initial state
        weightInput.readOnly = true;
        
        manualWeightCheck.addEventListener('change', function() {
            weightInput.readOnly = !this.checked;
            if (this.checked) {
                weightInput.value = '';
                weightInput.placeholder = 'Enter weight manually';
                // Enable direct input and add event listener
                weightInput.addEventListener('input', () => {
                    calculateGrossWeight();
                    calculatePricePerPcs();
                    calculateMaterialCost();
                });
            } else {
                weightInput.placeholder = 'Weight will be calculated automatically';
                // Remove event listener for manual input
                weightInput.removeEventListener('input', calculateGrossWeight);
                calculateWeight(); // Recalculate from dimensions
            }
            // Always update gross weight when switching modes
            calculateGrossWeight();
        });
    }
});

// Function to add material row to table
function addMaterialRow() {
    const description = document.getElementById('description-material').value;
    const selectedCheckbox = document.querySelector('input[name="materialGrade"]:checked');
    
    if (!selectedCheckbox) {
        alert('Please select a material grade!');
        return;
    }
    
    const selectedIndex = parseInt(selectedCheckbox.value);
    const selectedMaterial = gradeMaterialData[selectedIndex];
    const materialShape = document.getElementById('material-shape').value;
    const netWeight = parseFloat(document.getElementById('weight').value) || 0;
    const grossWeight = parseFloat(document.getElementById('gross-weight').value) || 0;
    const nesting = parseFloat(document.getElementById('nesting').value) || 1;
    const pricePerPcs = parseFloat(document.getElementById('price-per-pcs').value) || 0;
    const quantity = parseFloat(document.getElementById('quantity').value) || 1;
    const totalCost = parseFloat(document.getElementById('calculated-cost-material').value) || 0;

    // Validation
    if (!description) {
        alert('Description is required!');
        return;
    }

    if (!selectedMaterial) {
        alert('Please select a valid material grade!');
        return;
    }

    if (!netWeight) {
        alert('Weight is required! Either calculate from dimensions or input manually.');
        return;
    }

    const tableBody = document.getElementById('materialTable').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();

    const shapeName = materialShapeConfigurations[materialShape]?.name || '';

    row.innerHTML = `
        <td>${description}</td>
        <td>${selectedMaterial.grade}</td>
        <td>${selectedMaterial.materialType}</td>
        <td>${shapeName}</td>
        <td>${netWeight.toFixed(3)}</td>
        <td>${nesting.toFixed(2)}</td>
        <td>${grossWeight.toFixed(3)}</td>
        <td>${pricePerPcs.toFixed(2)}</td>
        <td>${quantity}</td>
        <td>${totalCost.toFixed(2)}</td>
        <td>
            <button onclick="editMaterialRow(this)">Edit</button>
            <button onclick="deleteMaterialRow(this)">Delete</button>
        </td>
    `;

    clearMaterialInputs();
    updateManufacturingTable();
    updateSummary();  // Add this line
    updateAllTotals();
}

// Function to edit material row
function editMaterialRow(button) {
    const row = button.parentNode.parentNode;
    
    // Store the description for parsing dimensions
    const description = row.cells[0].innerText;
    document.getElementById('description-material').value = description;
    document.getElementById('grade-material').value = row.cells[1].innerText;
    const materialType = row.cells[2].innerText;
    const materialShape = row.cells[3].innerText;
    
    // Find the grade material data matching the selected grade
    const selectedGrade = gradeMaterialData.find(item => item.grade === row.cells[1].innerText);
    if (selectedGrade) {
        const index = gradeMaterialData.findIndex(item => item.grade === selectedGrade.grade);
        
        // Check the corresponding checkbox in the grade selection table
        const checkbox = document.querySelector(`input[name="materialGrade"][value="${index}"]`);
        if (checkbox) {
            checkbox.checked = true;
            
            // Get price from the row
            const pricePerPcs = parseFloat(row.cells[7].innerText);
            const quantity = parseFloat(row.cells[8].innerText);
            const totalCost = parseFloat(row.cells[9].innerText);
            
            // Calculate the material price by reversing the calculation
            const grossWeight = parseFloat(row.cells[6].innerText);
            const materialPrice = grossWeight > 0 ? pricePerPcs / grossWeight : 0;
            
            // Determine if it's ex-mill or stockist price
            const isExMill = Math.abs(materialPrice - selectedGrade.exMillPrice) < 
                            Math.abs(materialPrice - selectedGrade.stockistPrice);
            
            // Select the appropriate radio button
            const stockistRadio = document.querySelector(`input[name="priceType_${index}"][value="stockist"]`);
            const exMillRadio = document.querySelector(`input[name="priceType_${index}"][value="exmill"]`);
            
            if (stockistRadio && exMillRadio) {
                stockistRadio.disabled = false;
                exMillRadio.disabled = false;
                
                if (isExMill) {
                    exMillRadio.checked = true;
                } else {
                    stockistRadio.checked = true;
                }
            }
            
            // Set material price
            document.getElementById('material-price').value = materialPrice.toFixed(2);
        }
        
        document.getElementById('density').value = selectedGrade.density;
    }

    // Restore weights and other values using correct indices
    document.getElementById('weight').value = row.cells[4].innerText;        // Net Weight
    document.getElementById('nesting').value = row.cells[5].innerText;       // Nesting
    document.getElementById('gross-weight').value = row.cells[6].innerText;  // Gross Weight
    document.getElementById('price-per-pcs').value = row.cells[7].innerText; // Price per PCS
    document.getElementById('quantity').value = row.cells[8].innerText;      // Quantity
    document.getElementById('calculated-cost-material').value = row.cells[9].innerText; // Total Cost

    // Set material shape and update fields
    const materialShapeSelect = document.getElementById('material-shape');
    if (materialShape) {
        // Convert display name back to value
        const shapeKey = Object.entries(materialShapeConfigurations)
            .find(([_, config]) => config.name === materialShape)?.[0] || '';
        
        materialShapeSelect.value = shapeKey;
        updateDimensionFields(shapeKey);

        // Extract dimensions code remains the same...
        // ...existing dimension extraction code...
    }

    // Set manual weight checkbox based on whether dimensions are present
    const hasExplicitDimensions = row.cells[0].innerText.match(/\d+\s*[x×]\s*\d+/);
    const manualWeightCheck = document.getElementById('manual-weight-check');
    if (manualWeightCheck) {
        manualWeightCheck.checked = !hasExplicitDimensions;
        const weightInput = document.getElementById('weight');
        weightInput.readOnly = !manualWeightCheck.checked;
    }

    // Remove the row being edited
    row.parentNode.removeChild(row);

    // Scroll to the top of the form
    document.getElementById('description-material').scrollIntoView({ behavior: 'smooth' });

    updateManufacturingTable(); // Update the manufacturing table
}

// Update the updateMaterialRow function for correct pejal calculations
function updateMaterialRow(element) {
    const row = element.parentNode;
    
    const weight = parseFloatInput(row.cells[2].innerText);
    const nesting = parseFloatInput(row.cells[3].innerText) || 1;
    const pricePerPcs = parseFloatInput(row.cells[4].innerText);
    const quantity = parseFloatInput(row.cells[5].innerText);

    // Calculate total cost
    const totalCost = (weight * pricePerPcs * quantity) / nesting;
    row.cells[6].innerText = totalCost.toFixed(2);
}

// Function to delete material row
function deleteMaterialRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateAllTotals();
    updateManufacturingTable(); // Update manufacturing table after deletion
    updateSummary();  // Add this line
}

// Function to clear material inputs
function clearMaterialInputs() {
    document.getElementById('description-material').value = '';
    document.getElementById('material-shape').value = '';
    document.getElementById('density').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('nesting').value = '0.9';
    document.getElementById('material-price').value = '';
    document.getElementById('price-per-pcs').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('calculated-cost-material').value = '';
    document.getElementById('gross-weight').value = '';

    // Clear dimension inputs
    clearDimensionInputs();

    // Uncheck all material grade checkboxes and disable radio buttons
    const checkboxes = document.getElementsByName('materialGrade');
    checkboxes.forEach((cb, index) => {
        cb.checked = false;
        const stockistRadio = document.querySelector(`input[name="priceType_${index}"][value="stockist"]`);
        const exMillRadio = document.querySelector(`input[name="priceType_${index}"][value="exmill"]`);
        if (stockistRadio) stockistRadio.disabled = true;
        if (exMillRadio) exMillRadio.disabled = true;
    });
}

// Add this helper function to calculate price per piece
function calculatePricePerPcs() {
    const grossWeight = calculateGrossWeight();
    const materialPrice = parseFloatInput(document.getElementById('material-price').value);
    
    const pricePerPiece = grossWeight * materialPrice;
    document.getElementById('price-per-pcs').value = pricePerPiece.toFixed(2);
    calculateMaterialCost();
}

// Update the DOM ready event listener to initialize material type
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Initialize material type fields without default value
    const materialShapeSelect = document.getElementById('material-shape');
    if (materialShapeSelect) {
        updateDimensionFields(''); // Initialize with empty value to show placeholder
        
        materialShapeSelect.addEventListener('change', function() {
            updateDimensionFields(this.value);
        });
    }
});

// Add this at the bottom of the file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize material type fields
    const materialShapeSelect = document.getElementById('material-shape');
    if (materialShapeSelect) {
        // No default value set
        updateDimensionFields('');
        
        // Add change listener
        materialShapeSelect.addEventListener('change', function() {
            updateDimensionFields(this.value);
        });
    }

    // Initialize grade material input
    const gradeInput = document.getElementById('grade-material');
    if (gradeInput) {
        gradeInput.addEventListener('focus', showGradeSuggestions);
        gradeInput.addEventListener('input', showGradeSuggestions);
    }

    // Add listeners for material cost calculation
    ['weight', 'material-price', 'nesting', 'quantity'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculateMaterialCost);
            element.addEventListener('change', calculateMaterialCost);
        }
    });

    // Remove the Calculate Weight button click handler from HTML
    // The button can be hidden or removed since calculation is now automatic
    const calculateButton = document.querySelector('button[onclick="calculateWeight()"]');
    if (calculateButton) {
        calculateButton.style.display = 'none';
    }
});

// Function to populate the grade selection table
function populateGradeSelectionTable() {
    const tbody = document.getElementById('gradeSelectionTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    gradeMaterialData.forEach((material, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>
                <input type="checkbox" name="materialGrade" value="${index}" 
                    onchange="handleGradeSelection(this, ${index})">
            </td>
            <td>${material.grade}</td>
            <td>${material.materialType}</td>
            <td class="price-cell">
                <input type="radio" name="priceType_${index}" value="stockist" 
                    class="price-radio" ${index === 0 ? 'checked' : ''} 
                    onchange="updatePriceFromRadio(${index})"
                    disabled>
                <span class="price-label">${material.stockistPrice.toLocaleString()}</span>
            </td>
            <td class="price-cell">
                <input type="radio" name="priceType_${index}" value="exmill" 
                    class="price-radio"
                    onchange="updatePriceFromRadio(${index})"
                    disabled>
                <span class="price-label">${material.exMillPrice.toLocaleString()}</span>
            </td>
        `;
    });
}

function handleGradeSelection(checkbox, index) {
    const checkboxes = document.getElementsByName('materialGrade');
    const material = gradeMaterialData[index];
    
    // Handle radio buttons for all rows
    gradeMaterialData.forEach((_, i) => {
        const stockistRadio = document.querySelector(`input[name="priceType_${i}"][value="stockist"]`);
        const exMillRadio = document.querySelector(`input[name="priceType_${i}"][value="exmill"]`);
        
        if (i === index && checkbox.checked) {
            stockistRadio.disabled = false;
            exMillRadio.disabled = false;
        } else {
            stockistRadio.disabled = true;
            exMillRadio.disabled = true;
            stockistRadio.checked = false;
            exMillRadio.checked = false;
        }
    });

    checkboxes.forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
    });

    if (checkbox.checked) {
        const radioStockist = document.querySelector(`input[name="priceType_${index}"][value="stockist"]`);
        radioStockist.checked = true;
        
        // Set the hidden grade material input value
        const hiddenGradeInput = document.getElementById('grade-material');
        if (!hiddenGradeInput) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.id = 'grade-material';
            document.body.appendChild(input);
        }
        document.getElementById('grade-material').value = material.grade;
        
        document.getElementById('density').value = material.density;
        document.getElementById('material-price').value = material.stockistPrice;
        
        calculateWeight();
        calculateMaterialCost();
    } else {
        clearMaterialInputs();
    }
}

function updatePriceFromRadio(index) {
    const material = gradeMaterialData[index];
    const isStockist = document.querySelector(`input[name="priceType_${index}"][value="stockist"]`).checked;
    
    document.getElementById('material-price').value = 
        isStockist ? material.stockistPrice : material.exMillPrice;
    
    calculateMaterialCost();
}

// Update the initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...

    // Initialize the grade selection table
    populateGradeSelectionTable();

    // Add hidden input for grade material if it doesn't exist
    if (!document.getElementById('grade-material')) {
        const hiddenGradeInput = document.createElement('input');
        hiddenGradeInput.type = 'hidden';
        hiddenGradeInput.id = 'grade-material';
        document.body.appendChild(hiddenGradeInput);
    }
});

// Add this function to calculate gross weight
function calculateGrossWeight() {
    const netWeight = parseFloat(document.getElementById('weight').value) || 0;
    const nesting = parseFloat(document.getElementById('nesting').value) || 1;
    const grossWeight = netWeight / nesting;
    document.getElementById('gross-weight').value = grossWeight.toFixed(3);
    return grossWeight;
}

// Update the calculatePricePerPcs function
function calculatePricePerPcs() {
    const grossWeight = calculateGrossWeight();
    const materialPrice = parseFloatInput(document.getElementById('material-price').value);
    
    const pricePerPiece = grossWeight * materialPrice;
    document.getElementById('price-per-pcs').value = pricePerPiece.toFixed(2);
    calculateMaterialCost(); // Ensure the total cost is updated
}

// Update the calculateMaterialCost function
function calculateMaterialCost() {
    const pricePerPcs = parseFloat(document.getElementById('price-per-pcs').value) || 0;
    const quantity = parseFloat(document.getElementById('quantity').value) || 1;

    // Calculate total cost
    const totalCost = pricePerPcs * quantity;
    document.getElementById('calculated-cost-material').value = totalCost.toFixed(2);
}

// Update event listeners to include gross weight calculations
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Add listener for nesting to recalculate gross weight
    const nestingInput = document.getElementById('nesting');
    if (nestingInput) {
        nestingInput.addEventListener('input', () => {
            calculateGrossWeight();
            calculatePricePerPcs();
            calculateMaterialCost();
        });
    }

    // Add listener for weight changes
    const weightInput = document.getElementById('weight');
    if (weightInput) {
        weightInput.addEventListener('change', () => {
            calculateGrossWeight();
            calculatePricePerPcs();
            calculateMaterialCost();
        });
    }
});

// Calculate total material cost
function calculateTotalMaterialCost() {
    const rows = document.getElementById('materialTable').getElementsByTagName('tbody')[0].rows;
    let total = 0;

    // Iterate through each row
    Array.from(rows).forEach(row => {
        // Get the total cost from column index 9 (the 10th column)
        const cost = parseFloat(row.cells[9].textContent.replace(/[^0-9.-]+/g, '')) || 0;
        total += cost;
    });

    // Update both the footer cell and span element
    const totalElement = document.getElementById('total-cost-material');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }

    // Update summary if it exists
    if (typeof updateSummary === 'function') {
        updateSummary();
    }

    return total;
}

// Update the updatePriceFromRadio function to trigger all calculations
function updatePriceFromRadio(index) {
    const material = gradeMaterialData[index];
    const isStockist = document.querySelector(`input[name="priceType_${index}"][value="stockist"]`).checked;
    
    const materialPrice = isStockist ? material.stockistPrice : material.exMillPrice;
    document.getElementById('material-price').value = materialPrice;
    
    // Trigger the calculation chain
    calculateWeight();
    calculateGrossWeight();
    calculatePricePerPcs();
    calculateMaterialCost();
}

// Update the calculatePricePerPcs function
function calculatePricePerPcs() {
    const grossWeight = calculateGrossWeight();
    const materialPrice = parseFloatInput(document.getElementById('material-price').value);
    
    const pricePerPiece = grossWeight * materialPrice;
    document.getElementById('price-per-pcs').value = pricePerPiece.toFixed(2);
    calculateMaterialCost(); // Ensure the total cost is updated
}

// Add event listener for material price changes
document.addEventListener('DOMContentLoaded', function() {
    // ...existing event listeners...

    // Add listener for material price changes
    const materialPriceInput = document.getElementById('material-price');
    if (materialPriceInput) {
        materialPriceInput.addEventListener('input', () => {
            calculatePricePerPcs();
            calculateMaterialCost();
        });
    }

    // Enhance price type radio buttons with real-time updates
    const priceRadios = document.querySelectorAll('input[type="radio"][name^="priceType_"]');
    priceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const index = this.name.split('_')[1];
            updatePriceFromRadio(index);
        });
    });
});

// Function to update manufacturing table based on material table data
function updateManufacturingTable() {
    const manufacturingTableBody = document.getElementById('manufacturingTable').getElementsByTagName('tbody')[0];
    const materialTableBody = document.getElementById('materialTable').getElementsByTagName('tbody')[0];
    
    manufacturingTableBody.innerHTML = '';
    
    Array.from(materialTableBody.rows).forEach((materialRow, index) => {
        const newRow = manufacturingTableBody.insertRow();
        
        // Get data from material table
        const description = materialRow.cells[0].textContent;
        const materialType = materialRow.cells[2].textContent;
        const netWeight = parseFloat(materialRow.cells[4].textContent) || 0;
        const grossWeight = parseFloat(materialRow.cells[6].textContent) || 0;
        const quantity = parseFloat(materialRow.cells[8].textContent) || 0;
        
        // Add description and material type
        newRow.insertCell(0).textContent = description;
        newRow.insertCell(1).textContent = materialType;
        
        // Add process cells (Cutting, Forming, Rolling, Machining)
        ['cutting', 'forming', 'rolling', 'machining'].forEach(process => {
            const cell = newRow.insertCell();
            cell.innerHTML = `
                <div class="process-cell">
                    <input type="checkbox" class="process-check" data-process="${process}" 
                           data-row-index="${index}" onchange="updateProcessPrice(this)">
                    <input type="number" class="cost-value" data-process="${process}" 
                           data-row-index="${index}" readonly>
                </div>
            `;
        });

        // Add quantity cell
        const quantityCell = newRow.insertCell();
        quantityCell.textContent = quantity;
        quantityCell.style.textAlign = 'center';

        // Add gross weight cell
        const grossWeightCell = newRow.insertCell();
        grossWeightCell.textContent = grossWeight.toFixed(3);
        grossWeightCell.style.textAlign = 'center';

        // Add Manufacturing Cost cell
        const costCell = newRow.insertCell();
        costCell.textContent = '0.00';
        costCell.classList.add('manufacturing-cost');
    });

    calculateTotalManufacturingCost();
}

// Modified updateProcessPrice function to handle material-specific pricing
function updateProcessPrice(checkbox) {
    const row = checkbox.closest('tr');
    // Fix material type normalization
    let materialType = row.cells[1].textContent;
    
    // Normalize material type to match manufacturingServices keys
    if (materialType.toLowerCase().includes('mildsteel') || 
        materialType.toLowerCase().includes('ss400') || 
        materialType.toLowerCase().includes('sm49')) {
        materialType = 'mildSteel';
    } else if (materialType.toLowerCase().includes('hardened') || 
               materialType.toLowerCase().includes('hbn') || 
               materialType.toLowerCase().includes('grade 700')) {
        materialType = 'highGradeHardened';
    } else if (materialType.toLowerCase().includes('stainless')) {
        materialType = 'stainlessSteel';
    }
    
    const process = checkbox.dataset.process;
    const costInput = checkbox.parentElement.querySelector('.cost-value');
    
    if (checkbox.checked) {
        let processKey = process.charAt(0).toUpperCase() + process.slice(1);
        const servicePrice = manufacturingServices[processKey]?.[materialType]?.costPerKg;
        
        if (servicePrice) {
            costInput.value = servicePrice;
            // Remove readonly attribute to make it editable
            costInput.readOnly = false;
        } else {
            console.warn(`No price found for ${processKey} - ${materialType}`);
            costInput.value = '';
            costInput.readOnly = false;
        }
    } else {
        costInput.value = '';
        costInput.readOnly = true;
    }
    
    updateManufacturingCost(row);
}

// Add event listener to cost value inputs for manual changes
document.addEventListener('DOMContentLoaded', function() {
    // Add listeners to cost value inputs
    document.querySelectorAll('.cost-value').forEach(input => {
        input.addEventListener('input', function() {
            const row = this.closest('tr');
            updateManufacturingCost(row);
        });
    });
});

// Function to update manufacturing cost calculations
function updateManufacturingCost(row) {
    const grossWeight = parseFloat(row.cells[7].textContent) || 0;
    const quantity = parseFloat(row.cells[6].textContent) || 0;
    let totalProcessCost = 0;

    // Calculate cost for each process
    ['cutting', 'forming', 'rolling', 'machining'].forEach((process, index) => {
        const processCell = row.cells[index + 2];
        const checkbox = processCell.querySelector('.process-check');
        const costInput = processCell.querySelector('.cost-value');

        if (checkbox.checked && costInput.value) {
            totalProcessCost += parseFloat(costInput.value);
        }
    });

    // Update the manufacturing cost cell
    const costCell = row.cells[8];
    const totalCost = totalProcessCost * grossWeight * quantity;
    costCell.textContent = totalCost.toFixed(2);

    calculateTotalManufacturingCost();
}

// Calculate total manufacturing cost
function calculateTotalManufacturingCost() {
    const rows = document.getElementById('manufacturingTable').getElementsByTagName('tbody')[0].rows;
    let total = 0;

    Array.from(rows).forEach(row => {
        total += parseFloat(row.cells[row.cells.length - 1].textContent) || 0;
    });

    document.getElementById('total-cost-manufacturing').textContent = total.toFixed(2);
    updateSummary();  // Add this line
}

// Add event listener to initialize tables when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize material type fields
    const materialShapeSelect = document.getElementById('material-shape');
    if (materialShapeSelect) {
        updateDimensionFields('');
        materialShapeSelect.addEventListener('change', function() {
            updateDimensionFields(this.value);
        });
    }

    // Initialize grade material input
    const gradeInput = document.getElementById('grade-material');
    if (gradeInput) {
        gradeInput.addEventListener('focus', showGradeSuggestions);
        gradeInput.addEventListener('input', showGradeSuggestions);
    }

    // Initialize grade selection table
    populateGradeSelectionTable();
    
    // Initialize manufacturing table
    updateManufacturingTable();

    // Add a dummy row for testing purposes
    const tableBody = document.getElementById('materialTable').getElementsByTagName('tbody')[0];
    const dummyRow = tableBody.insertRow();
    dummyRow.innerHTML = `
        <td>Dummy Description</td>
        <td>SS400 (GRADE 250)</td>
        <td>mildSteel</td>
        <td>Plate</td>
        <td>100.000</td>
        <td>1.00</td>
        <td>100.000</td>
        <td>13000.00</td>
        <td>1</td>
        <td>13000.00</td>
        <td>
            <button onclick="editMaterialRow(this)">Edit</button>
            <button onclick="deleteMaterialRow(this)">Delete</button>
        </td>
    `;

    // Initialize manufacturing table
    updateManufacturingTable();
});

// Add this to ensure totals are updated whenever rows are modified
function updateAllTotals() {
    calculateTotalMaterialCost();
    calculateTotalManufacturingCost();
}

// Add this function to update the material image
function updateMaterialImage(materialShape) {
    const imageContainer = document.getElementById('material-image');
    if (!imageContainer) return;

    if (!materialShape) {
        imageContainer.innerHTML = '<div class="image-placeholder">Select a material shape to view diagram</div>';
        return;
    }

    const imagePath = `${materialShape}.png`;
    imageContainer.innerHTML = `<img class="material-shape-image" src="${imagePath}" alt="${materialShape} diagram" onerror="handleImageError(this)">`;
}

// Add error handler for images
function handleImageError(img) {
    img.parentElement.innerHTML = '<div class="image-placeholder">Image not available</div>';
}