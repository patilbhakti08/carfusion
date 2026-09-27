function addToCompare(carId) {
    try {
        const cars = JSON.parse(localStorage.getItem("cars") || "[]");
        const car = cars.find(c => c.id === parseInt(carId));
        if (!car) {
            console.error("Car not found for ID:", carId);
            showAlert("Car not found.");
            return;
        }

        let comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        if (comparisons.length >= 3) {
            showAlert("Cannot compare more than 3 cars.");
            return;
        }
        if (comparisons.some(c => c.id === car.id)) {
            showAlert("Car already added to comparison.");
            return;
        }

        comparisons.push(car);
        localStorage.setItem("comparisons", JSON.stringify(comparisons));
        updateCompareCount();
        showAlert("Car added to comparison!");
    } catch (e) {
        console.error("Add to compare failed:", e);
        showAlert("Failed to add car to comparison.");
    }
}

function removeFromCompare(carId) {
    try {
        let comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        comparisons = comparisons.filter(c => c.id !== parseInt(carId));
        localStorage.setItem("comparisons", JSON.stringify(comparisons));
        updateCompareCount();
        showAlert("Car removed from comparison!");
        displayComparison();
    } catch (e) {
        console.error("Remove from compare failed:", e);
        showAlert("Failed to remove car from comparison.");
    }
}

function clearAllComparisons() {
    try {
        localStorage.setItem("comparisons", JSON.stringify([]));
        updateCompareCount();
        showAlert("All comparisons cleared!");
        displayComparison();
    } catch (e) {
        console.error("Clear all comparisons failed:", e);
        showAlert("Failed to clear comparisons.");
    }
}

function displayComparison() {
    try {
        const table = document.getElementById("comparison-table");
        if (!table) {
            console.warn("Comparison table element not found. Skipping display.");
            return;
        }

        let comparisons;
        try {
            comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        } catch (e) {
            console.error("Failed to parse comparisons from localStorage:", e);
            localStorage.setItem("comparisons", JSON.stringify([]));
            comparisons = [];
        }

        if (!Array.isArray(comparisons) || comparisons.length === 0) {
            table.innerHTML = "<p>No cars selected for comparison. Please add cars from the homepage.</p>";
            return;
        }

        // Validate cars
        const validCars = comparisons.filter(car => {
            const isValid = car && car.id && car.make && car.model && car.image && typeof car.price === "number" && !isNaN(car.price);
            if (!isValid) console.warn("Skipping invalid car:", car);
            return isValid;
        });

        if (validCars.length === 0) {
            table.innerHTML = "<p>No valid cars selected for comparison. Please add cars from the homepage.</p>";
            return;
        }

        // Get EMI inputs
        const downpaymentInput = document.getElementById("downpayment");
        const interestRateInput = document.getElementById("interest-rate");
        const tenureInput = document.getElementById("tenure");

        const downpayment = parseFloat(downpaymentInput ? downpaymentInput.value : 0);
        const interestRate = parseFloat(interestRateInput ? interestRateInput.value : 8) / 100 / 12;
        const tenure = parseInt(tenureInput ? tenureInput.value : 60);

        // Validate inputs
        let inputError = false;
        if (isNaN(downpayment) || downpayment < 0) {
            showAlert("Please enter a valid downpayment.");
            inputError = true;
        }
        if (isNaN(interestRate) || interestRate * 12 * 100 < 5 || interestRate * 12 * 100 > 20) {
            showAlert("Interest rate must be between 5% and 20%.");
            inputError = true;
        }
        if (isNaN(tenure) || tenure < 12 || tenure > 84) {
            showAlert("Loan tenure must be between 12 and 84 months.");
            inputError = true;
        }

        let html = "<table class='comparison-table'><tr><th>Parameter</th>";
        validCars.forEach(car => {
            html += `<th>
                <img src="${car.image}" class="car-image" alt="${car.make} ${car.model}">
                <br>${car.make} ${car.model}
                <br><button class="btn btn-danger btn-sm" onclick="removeFromCompare(${car.id})">Remove</button>
            </th>`;
        });
        html += "</tr>";

        const fields = [
            { label: "Year", key: "year", default: "N/A" },
            { label: "Mileage", key: "mileage", default: "N/A" },
            { label: "Engine", key: "engine", default: "N/A" },
            { label: "Fuel Type", key: "fuelType", default: "N/A" },
            { label: "Transmission", key: "transmission", default: "N/A" },
            { label: "Seating", key: "seating", default: "N/A" },
            { label: "Body Type", key: "bodyType", default: "N/A" },
            { label: "Power", key: "power", default: "N/A" },
            { label: "Torque", key: "torque", default: "N/A" },
            { label: "Safety Features", key: "safetyFeatures", default: "N/A" },
            { label: "Infotainment", key: "infotainment", default: "N/A" },
            { label: "Ground Clearance", key: "groundClearance", default: "N/A" },
            { label: "Ex-Showroom Price", key: "price", format: price => `₹${Number(price).toLocaleString('en-IN')}`, default: "N/A" },
            { label: "On-Road Price", key: "price", format: car => {
                const priceDetails = calculateOnRoadPrice(car.price);
                return priceDetails.onRoadPrice ? `₹${Number(priceDetails.onRoadPrice).toLocaleString('en-IN')}` : "N/A";
            }, default: "N/A" },
            { label: "Monthly EMI", key: "price", format: car => {
                if (inputError) return "Invalid Inputs";
                const priceDetails = calculateOnRoadPrice(car.price);
                if (!priceDetails.onRoadPrice) return "N/A";
                if (downpayment >= priceDetails.onRoadPrice) return "Downpayment too high";
                const principal = priceDetails.onRoadPrice - downpayment;
                const emi = calculateEMI(principal, interestRate, tenure);
                return emi ? `₹${Math.round(emi).toLocaleString('en-IN')}` : "N/A";
            }, default: "N/A" }
        ];

        fields.forEach(field => {
            html += `<tr><td>${field.label}</td>`;
            validCars.forEach(car => {
                const value = field.format ? field.format(car) : (car[field.key] || field.default);
                html += `<td>${value}</td>`;
            });
            html += "</tr>";
        });

        html += "</table>";
        table.innerHTML = html;
    } catch (e) {
        console.error("Display comparison failed:", e);
        const table = document.getElementById("comparison-table");
        if (table) {
            table.innerHTML = "<p>Failed to load comparison. Please try adding cars again.</p>";
        }
        showAlert("Failed to display comparison.");
    }
}

function calculateEMI(principal, monthlyInterestRate, tenure) {
    try {
        if (principal <= 0 || monthlyInterestRate <= 0 || tenure <= 0) {
            return null;
        }
        const factor = Math.pow(1 + monthlyInterestRate, tenure);
        const emi = (principal * monthlyInterestRate * factor) / (factor - 1);
        return isFinite(emi) ? emi : null;
    } catch (e) {
        console.error("EMI calculation failed:", e);
        return null;
    }
}

function updateCompareCount() {
    try {
        const compareCount = document.getElementById("compare-count");
        if (!compareCount) {
            console.warn("Compare count element not found.");
            return;
        }
        const comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        compareCount.textContent = comparisons.length;
    } catch (e) {
        console.error("Update compare count failed:", e);
    }
}