function displayCars(make = "all") {
    try {
        const carListings = document.getElementById("car-listings");
        if (!carListings) {
            console.error("Car listings element not found.");
            showAlert("Failed to load cars.");
            return;
        }

        const cars = JSON.parse(localStorage.getItem("cars") || "[]");
        console.log("Cars loaded:", cars);
        if (!cars || cars.length === 0) {
            carListings.innerHTML = "<p>No cars available.</p>";
            return;
        }

        const filteredCars = make === "all" ? cars : cars.filter(car => car.make === make);
        console.log("Filtered cars:", filteredCars);

        let html = "";
        filteredCars.forEach(car => {
            const priceDetails = calculateOnRoadPrice(car.price);
            html += `
                <div class="car-card">
                    <img src="${car.image}" alt="${car.make} ${car.model}">
                    <h3>${car.make} ${car.model}</h3>
                    <div class="button-container">
                        <button class="btn btn-primary btn-sm" onclick="window.location.href='car-details.html?id=${car.id}'">Show Detail</button>
                        <button class="btn btn-success btn-sm" onclick="addToCompare(${car.id})">Add to Compare</button>
                        <button class="btn btn-warning btn-sm" onclick="openTestDriveForm(${car.id})">Test Drive</button>
                    </div>
                </div>
            `;
        });

        carListings.innerHTML = html || "<p>No cars found for this filter.</p>";
    } catch (e) {
        console.error("Display cars failed:", e);
        const carListings = document.getElementById("car-listings");
        if (carListings) {
            carListings.innerHTML = "<p>Failed to load cars. Please try again.</p>";
        }
        showAlert("Failed to load cars.");
    }
}

function setupFilterButtons() {
    try {
        const buttons = document.querySelectorAll(".company-btn");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                const make = button.getAttribute("data-make");
                console.log("Filter selected:", make);
                displayCars(make);
            });
        });
    } catch (e) {
        console.error("Setup filter buttons failed:", e);
        showAlert("Failed to setup filters.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        setupFilterButtons();
        displayCars();
    } catch (e) {
        console.error("Cars page initialization failed:", e);
    }
});