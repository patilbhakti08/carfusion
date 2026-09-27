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
            { label: "Monthly EMI (20% Down)", key: "price", format: car => {
                const priceDetails = calculateOnRoadPrice(car.price);
                if (!priceDetails.onRoadPrice) return "N/A";
                const principal = priceDetails.onRoadPrice * 0.8;
                const interestRate = 0.08 / 12;
                const tenure = 60;
                const emi = (principal * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1);
                return `₹${Math.round(emi).toLocaleString('en-IN')}`;
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