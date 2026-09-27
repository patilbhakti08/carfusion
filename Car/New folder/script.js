let currentUser = null;
let currentDealerId = null;
let currentAdminUsername = null;
let carsCache = null;

// Sample cars
const cars = [
    { id: 1, make: "Maruti Suzuki", model: "Swift LXI", year: 2023, price: "6.00 Lakh", mileage: "23 kmpl", engine: "1197 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "Hatchback", image: "https://via.placeholder.com/300x200?text=Swift" },
    { id: 2, make: "Hyundai", model: "Creta SX", year: 2023, price: "12.00 Lakh", mileage: "17 kmpl", engine: "1497 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=Creta" },
    { id: 3, make: "Tata", model: "Nexon XZ", year: 2023, price: "9.00 Lakh", mileage: "17 kmpl", engine: "1199 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=Nexon" },
    { id: 4, make: "Honda", model: "City V", year: 2023, price: "12.50 Lakh", mileage: "18 kmpl", engine: "1498 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "Sedan", image: "https://via.placeholder.com/300x200?text=City" },
    { id: 5, make: "Toyota", model: "Innova Crysta GX", year: 2023, price: "20.00 Lakh", mileage: "11 kmpl", engine: "2694 cc", fuelType: "Petrol", transmission: "Manual", seating: 7, bodyType: "MPV", image: "https://via.placeholder.com/300x200?text=Innova" },
    { id: 6, make: "Maruti Suzuki", model: "Baleno Delta", year: 2023, price: "7.50 Lakh", mileage: "22 kmpl", engine: "1197 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "Hatchback", image: "https://via.placeholder.com/300x200?text=Baleno" },
    { id: 7, make: "Mahindra", model: "XUV300 W6", year: 2023, price: "10.00 Lakh", mileage: "17 kmpl", engine: "1197 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=XUV300" },
    { id: 8, make: "Tata", model: "Nexon EV Prime", year: 2023, price: "15.00 Lakh", mileage: "312 km", engine: "30.2 kWh", fuelType: "Electric", transmission: "Automatic", seating: 5, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=NexonEV" },
    { id: 9, make: "Hyundai", model: "Venue S", year: 2023, price: "9.50 Lakh", mileage: "18 kmpl", engine: "1197 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=Venue" },
    { id: 10, make: "Mahindra", model: "Thar LX", year: 2023, price: "14.00 Lakh", mileage: "15 kmpl", engine: "1997 cc", fuelType: "Petrol", transmission: "Manual", seating: 4, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=Thar" },
    { id: 11, make: "Kia", model: "Seltos HTK", year: 2023, price: "11.00 Lakh", mileage: "16 kmpl", engine: "1497 cc", fuelType: "Petrol", transmission: "Manual", seating: 5, bodyType: "SUV", image: "https://via.placeholder.com/300x200?text=Seltos" }
];

// Sample dealerships
const dealerships = [
    { id: "Maruti-D1", name: "Maruti Kothrud", make: "Maruti Suzuki", password: "maruti123", city: "Pune" },
    { id: "Hyundai-D1", name: "Hyundai Pimpri", make: "Hyundai", password: "hyundai123", city: "Pune" },
    { id: "Tata-D1", name: "Tata Wakad", make: "Tata", password: "tata123", city: "Pune" },
    { id: "Mahindra-D1", name: "Mahindra Baner", make: "Mahindra", password: "mahindra123", city: "Pune" },
    { id: "Honda-D1", name: "Honda Viman Nagar", make: "Honda", password: "honda123", city: "Pune" },
    { id: "Toyota-D1", name: "Toyota Malad", make: "Toyota", password: "toyota123", city: "Mumbai" },
    { id: "Kia-D1", name: "Kia Navi Mumbai", make: "Kia", password: "kia123", city: "Mumbai" }
];

// Admin credentials
const admins = [
    { username: "admin1", password: "adminpass1" }
];

// Initialize localStorage
function initializeStorage() {
    try {
        if (!localStorage.getItem("cars")) {
            localStorage.setItem("cars", JSON.stringify(cars));
        }
        if (!localStorage.getItem("dealerships")) {
            localStorage.setItem("dealerships", JSON.stringify(dealerships));
        }
        if (!localStorage.getItem("admins")) {
            localStorage.setItem("admins", JSON.stringify(admins));
        }
        if (!localStorage.getItem("users")) {
            localStorage.setItem("users", JSON.stringify([]));
        }
        if (!localStorage.getItem("bookings")) {
            localStorage.setItem("bookings", JSON.stringify([]));
        }
        if (!localStorage.getItem("comparisons")) {
            localStorage.setItem("comparisons", JSON.stringify([]));
        }
        if (!localStorage.getItem("contacts")) {
            localStorage.setItem("contacts", JSON.stringify([]));
        }
        if (!localStorage.getItem("applications")) {
            localStorage.setItem("applications", JSON.stringify([]));
        }
        carsCache = JSON.parse(localStorage.getItem("cars") || "[]");
    } catch (e) {
        console.error("Storage initialization failed:", e);
        showToast("Failed to initialize data.", "error");
    }
}

// Sanitize input
function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Show toast notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    }
}

// Show error
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
}

// Clear error
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

// Toggle login/signup forms
function showForm(formType) {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    if (formType === "login") {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        toggleButtons[0].classList.add("active");
        toggleButtons[1].classList.remove("active");
        clearError("login-error");
    } else {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
        toggleButtons[0].classList.remove("active");
        toggleButtons[1].classList.add("active");
        clearError("signup-error");
    }
}

// Check user login
function checkUserLogin() {
    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (!currentUser && !window.location.pathname.endsWith("login.html") && 
            !window.location.pathname.endsWith("dealership.html") && 
            !window.location.pathname.endsWith("admin.html")) {
            window.location.href = "login.html";
        } else if (currentUser && document.getElementById("username")) {
            document.getElementById("username").textContent = `Hi ${currentUser.name}`;
            document.getElementById("username").classList.remove("hidden");
            document.getElementById("logout-btn").classList.remove("hidden");
            document.getElementById("login-btn").classList.add("hidden");
        }
    } catch (e) {
        console.error("Login check failed:", e);
        window.location.href = "login.html";
    }
}

// Validate password
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    return {
        isValid: password.length >= minLength && hasUpperCase && hasSpecialChar && hasNumber,
        message: password.length < minLength ? "Password must be at least 6 characters" :
                 !hasUpperCase ? "Password must include at least one uppercase letter" :
                 !hasSpecialChar ? "Password must include at least one special character" :
                 !hasNumber ? "Password must include at least one number" : ""
    };
}

// User login
function loginUser(event) {
    event.preventDefault();
    try {
        clearError("login-error");
        const mobile = "+91" + document.getElementById("login-mobile").value.trim();
        const password = document.getElementById("login-password").value;

        if (!/^\+91\d{10}$/.test(mobile)) {
            showError("login-error", "Mobile number must be 10 digits");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(u => u.mobile === mobile && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(user));
            showToast("Login successful!", "success");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showError("login-error", "Invalid mobile or password");
        }
    } catch (e) {
        console.error("User login failed:", e);
        showError("login-error", "An error occurred.");
    }
}

// User signup
function signupUser(event) {
    event.preventDefault();
    try {
        clearError("signup-error");
        const name = sanitizeInput(document.getElementById("signup-name").value.trim());
        const mobile = "+91" + document.getElementById("signup-mobile").value.trim();
        const password = document.getElementById("signup-password").value;

        if (!name.match(/^[A-Za-z\s]{2,50}$/)) {
            showError("signup-error", "Name must be 2-50 letters and spaces");
            return;
        }
        if (!/^\+91\d{10}$/.test(mobile)) {
            showError("signup-error", "Mobile number must be 10 digits");
            return;
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            showError("signup-error", passwordValidation.message);
            return;
        }

        let users = JSON.parse(localStorage.getItem("users") || "[]");
        if (users.some(u => u.mobile === mobile)) {
            showError("signup-error", "Mobile number already registered");
            return;
        }

        const newUser = { name, mobile, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        showToast("Signup successful!", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (e) {
        console.error("User signup failed:", e);
        showError("signup-error", "An error occurred.");
    }
}

// User logout
function logoutUser() {
    try {
        currentUser = null;
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    } catch (e) {
        console.error("User logout failed:", e);
        showToast("Logout failed.", "error");
    }
}

// Dealer login
function loginDealer(event) {
    event.preventDefault();
    try {
        const dealerId = document.getElementById("dealer-id").value.trim();
        const password = document.getElementById("dealer-password").value;
        const dealerships = JSON.parse(localStorage.getItem("dealerships") || "[]");
        const dealer = dealerships.find(d => d.id === dealerId && d.password === password);

        if (dealer) {
            currentDealerId = dealerId;
            localStorage.setItem("currentDealerId", dealerId);
            document.getElementById("dealer-dashboard").classList.remove("hidden");
            document.querySelector("form").classList.add("hidden");
            document.getElementById("logout-btn").classList.remove("hidden");
            displayBookings();
        } else {
            showError("dealer-error", "Invalid dealership ID or password");
        }
    } catch (e) {
        console.error("Dealer login failed:", e);
        showError("dealer-error", "An error occurred.");
    }
}

// Dealer logout
function logoutDealer() {
    try {
        currentDealerId = null;
        localStorage.removeItem("currentDealerId");
        window.location.reload();
    } catch (e) {
        console.error("Dealer logout failed:", e);
        showToast("Logout failed.", "error");
    }
}

// Admin login
function loginAdmin(event) {
    event.preventDefault();
    try {
        const username = document.getElementById("admin-username").value.trim();
        const password = document.getElementById("admin-password").value;
        const admins = JSON.parse(localStorage.getItem("admins") || "[]");
        const admin = admins.find(a => a.username === username && a.password === password);

        if (admin) {
            currentAdminUsername = username;
            localStorage.setItem("currentAdminUsername", username);
            document.getElementById("admin-dashboard").classList.remove("hidden");
            document.querySelector("form").classList.add("hidden");
            document.getElementById("logout-btn").classList.remove("hidden");
        } else {
            showError("admin-error", "Invalid username or password");
        }
    } catch (e) {
        console.error("Admin login failed:", e);
        showError("admin-error", "An error occurred.");
    }
}

// Admin logout
function logoutAdmin() {
    try {
        currentAdminUsername = null;
        localStorage.removeItem("currentAdminUsername");
        window.location.reload();
    } catch (e) {
        console.error("Admin logout failed:", e);
        showToast("Logout failed.", "error");
    }
}

// Display cars
function displayCars(carList) {
    try {
        const listings = document.getElementById("car-listings");
        listings.innerHTML = "";
        if (carList.length === 0) {
            listings.innerHTML = "<p>No cars found.</p>";
            return;
        }

        carList.forEach(car => {
            const carCard = document.createElement("div");
            carCard.className = "car-card";
            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.make} ${car.model}">
                <div class="car-card-content">
                    <h3>${car.make} ${car.model}</h3>
                    <p>Price: ₹${car.price}</p>
                    <p>Year: ${car.year}</p>
                    <p>Mileage: ${car.mileage}</p>
                    <button class="btn" onclick="viewCarDetails(${car.id})">View Details</button>
                    <button class="btn" onclick="bookTestDrive(${car.id})">Book Test Drive</button>
                    <button class="btn" onclick="addToCompare(${car.id})">Add to Compare</button>
                </div>
            `;
            listings.appendChild(carCard);
        });
    } catch (e) {
        console.error("Display cars failed:", e);
        showToast("Failed to display cars.", "error");
    }
}

// Search cars
function searchCars() {
    try {
        const query = document.getElementById("search").value.trim().toLowerCase();
        let filteredCars = carsCache || JSON.parse(localStorage.getItem("cars") || "[]");

        if (query) {
            filteredCars = filteredCars.filter(car => 
                car.make.toLowerCase().includes(query) || 
                car.model.toLowerCase().includes(query)
            );
        }

        displayCars(filteredCars);
        document.getElementById("suggestions").style.display = "none";
    } catch (e) {
        console.error("Search failed:", e);
        showToast("Search failed.", "error");
    }
}

// Autocomplete suggestions
function showSuggestions() {
    try {
        const query = document.getElementById("search").value.trim().toLowerCase();
        const suggestionsDiv = document.getElementById("suggestions");
        suggestionsDiv.innerHTML = "";

        if (!query) {
            suggestionsDiv.style.display = "none";
            return;
        }

        const cars = carsCache || JSON.parse(localStorage.getItem("cars") || "[]");
        const matches = cars
            .filter(car => 
                car.make.toLowerCase().includes(query) || 
                car.model.toLowerCase().includes(query)
            )
            .slice(0, 5)
            .map(car => `${car.make} ${car.model}`);

        if (matches.length === 0) {
            suggestionsDiv.style.display = "none";
            return;
        }

        suggestionsDiv.innerHTML = matches
            .map((match, index) => `<div class="suggestion" data-index="${index}">${match}</div>`)
            .join("");
        suggestionsDiv.style.display = "block";
    } catch (e) {
        console.error("Suggestions failed:", e);
    }
}

// Handle suggestion selection
function selectSuggestion(event) {
    if (event.target.classList.contains("suggestion")) {
        document.getElementById("search").value = event.target.textContent;
        document.getElementById("suggestions").style.display = "none";
        searchCars();
    }
}

// Handle keyboard navigation for suggestions
function handleSuggestionNavigation(event) {
    const suggestions = document.querySelectorAll(".suggestion");
    if (!suggestions.length) return;

    let activeIndex = Array.from(suggestions).findIndex(s => s.classList.contains("active"));

    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (activeIndex < suggestions.length - 1) {
            if (activeIndex >= 0) suggestions[activeIndex].classList.remove("active");
            activeIndex++;
            suggestions[activeIndex].classList.add("active");
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (activeIndex > 0) {
            suggestions[activeIndex].classList.remove("active");
            activeIndex--;
            suggestions[activeIndex].classList.add("active");
        }
    } else if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        document.getElementById("search").value = suggestions[activeIndex].textContent;
        document.getElementById("suggestions").style.display = "none";
        searchCars();
    }
}

// Filter by company
function filterByCompany(make) {
    try {
        const filteredCars = (carsCache || JSON.parse(localStorage.getItem("cars") || "[]")).filter(car => car.make === make);
        displayCars(filteredCars);
    } catch (e) {
        console.error("Company filter failed:", e);
        showToast("Filter failed.", "error");
    }
}

// View car details
function viewCarDetails(carId) {
    window.location.href = `car-details.html?carId=${carId}`;
}

// Display car details
function displayCarDetails(carId) {
    try {
        const cars = carsCache || JSON.parse(localStorage.getItem("cars") || "[]");
        const car = cars.find(c => c.id === parseInt(carId));
        if (!car) {
            document.getElementById("car-details").innerHTML = "<p>Car not found.</p>";
            return;
        }

        document.getElementById("car-details").innerHTML = `
            <div class="car-card">
                <img src="${car.image}" alt="${car.make} ${car.model}">
                <div class="car-card-content">
                    <h3>${car.make} ${car.model}</h3>
                    <p>Price: ₹${car.price}</p>
                    <p>Year: ${car.year}</p>
                    <p>Mileage: ${car.mileage}</p>
                    <p>Engine: ${car.engine}</p>
                    <p>Fuel Type: ${car.fuelType}</p>
                    <p>Transmission: ${car.transmission}</p>
                    <p>Seating: ${car.seating}</p>
                    <p>Body Type: ${car.bodyType}</p>
                    <button class="btn" onclick="bookTestDrive(${car.id})">Book Test Drive</button>
                    <button class="btn" onclick="addToCompare(${car.id})">Add to Compare</button>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Display car details failed:", e);
        showToast("Failed to display car details.", "error");
    }
}

// Book test drive
function bookTestDrive(carId) {
    if (!currentUser) {
        showToast("Please login to book a test drive.", "error");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
        return;
    }

    try {
        const modal = document.getElementById("modal");
        const modalContent = document.getElementById("modal-content");
        modalContent.innerHTML = `
            <h2>Book Test Drive</h2>
            <form onsubmit="submitTestDrive(event, ${carId})">
                <label for="test-drive-date">Date:</label>
                <input type="date" id="test-drive-date" required>
                <label for="test-drive-time">Time:</label>
                <input type="time" id="test-drive-time" required>
                <label for="test-drive-dealer">Select Dealership:</label>
                <select id="test-drive-dealer" required>
                    ${dealerships.filter(d => d.make === cars.find(c => c.id === carId).make)
                        .map(d => `<option value="${d.id}">${d.name} (${d.city})</option>`).join("")}
                </select>
                <div id="test-drive-error" class="error"></div>
                <button type="submit" class="btn">Submit</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </form>
        `;
        modal.style.display = "flex";
    } catch (e) {
        console.error("Book test drive failed:", e);
        showToast("Failed to book test drive.", "error");
    }
}

// Submit test drive
function submitTestDrive(event, carId) {
    event.preventDefault();
    try {
        const date = document.getElementById("test-drive-date").value;
        const time = document.getElementById("test-drive-time").value;
        const dealerId = document.getElementById("test-drive-dealer").value;

        let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        bookings.push({
            userMobile: currentUser.mobile,
            carId,
            dealerId,
            date,
            time,
            status: "Pending"
        });
        localStorage.setItem("bookings", JSON.stringify(bookings));
        closeModal();
        showToast("Test drive booked successfully!", "success");
    } catch (e) {
        console.error("Submit test drive failed:", e);
        showError("test-drive-error", "Booking failed.");
    }
}

// Display bookings for dealer
function displayBookings() {
    try {
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]").filter(b => b.dealerId === currentDealerId);
        const bookingsDiv = document.getElementById("bookings");
        bookingsDiv.innerHTML = bookings.length ? bookings.map(b => {
            const car = cars.find(c => c.id === b.carId);
            return `
                <div class="booking">
                    <p>User: ${b.userMobile}</p>
                    <p>Car: ${car.make} ${car.model}</p>
                    <p>Date: ${b.date}</p>
                    <p>Time: ${b.time}</p>
                    <p>Status: ${b.status}</p>
                </div>
            `;
        }).join("") : "<p>No bookings found.</p>";
    } catch (e) {
        console.error("Display bookings failed:", e);
        showToast("Failed to display bookings.", "error");
    }
}

// Add car
function addCar(event) {
    event.preventDefault();
    try {
        const car = {
            id: Date.now(),
            make: sanitizeInput(document.getElementById("car-make").value.trim()),
            model: sanitizeInput(document.getElementById("car-model").value.trim()),
            year: parseInt(document.getElementById("car-year").value),
            price: sanitizeInput(document.getElementById("car-price").value.trim()),
            mileage: sanitizeInput(document.getElementById("car-mileage").value.trim()),
            fuelType: sanitizeInput(document.getElementById("car-fuel").value.trim()),
            transmission: sanitizeInput(document.getElementById("car-transmission").value.trim()),
            seating: parseInt(document.getElementById("car-seating").value),
            bodyType: sanitizeInput(document.getElementById("car-body").value.trim()),
            image: "https://via.placeholder.com/300x200?text=NewCar"
        };

        let cars = JSON.parse(localStorage.getItem("cars") || "[]");
        cars.push(car);
        localStorage.setItem("cars", JSON.stringify(cars));
        carsCache = cars;
        showToast("Car added successfully!", "success");
        event.target.reset();
    } catch (e) {
        console.error("Add car failed:", e);
        showError("car-error", "Failed to add car.");
    }
}

// Add dealership
function addDealership(event) {
    event.preventDefault();
    try {
        const dealer = {
            id: document.getElementById("dealer-id").value.trim(),
            name: sanitizeInput(document.getElementById("dealer-name").value.trim()),
            make: sanitizeInput(document.getElementById("dealer-make").value.trim()),
            city: sanitizeInput(document.getElementById("dealer-city").value.trim()),
            password: document.getElementById("dealer-password").value
        };

        let dealerships = JSON.parse(localStorage.getItem("dealerships") || "[]");
        if (dealerships.some(d => d.id === dealer.id)) {
            showError("dealer-add-error", "Dealership ID already exists");
            return;
        }

        dealerships.push(dealer);
        localStorage.setItem("dealerships", JSON.stringify(dealerships));
        showToast("Dealership added successfully!", "success");
        event.target.reset();
    } catch (e) {
        console.error("Add dealership failed:", e);
        showError("dealer-add-error", "Failed to add dealership.");
    }
}

// Add to compare
function addToCompare(carId) {
    try {
        let comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        if (comparisons.length >= 3) {
            showToast("You can compare up to 3 cars.", "error");
            return;
        }
        if (!comparisons.includes(carId)) {
            comparisons.push(carId);
            localStorage.setItem("comparisons", JSON.stringify(comparisons));
            showToast("Car added to comparison!", "success");
        }
    } catch (e) {
        console.error("Add to compare failed:", e);
        showToast("Failed to add to comparison.", "error");
    }
}

// Display comparison
function displayComparison() {
    try {
        const comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        const comparisonDiv = document.getElementById("comparison");
        if (comparisons.length === 0) {
            comparisonDiv.innerHTML = "<p>No cars selected for comparison.</p>";
            return;
        }

        const cars = JSON.parse(localStorage.getItem("cars") || "[]");
        const selectedCars = comparisons.map(id => cars.find(c => c.id === id));
        comparisonDiv.innerHTML = `
            <div class="comparison-grid">
                ${selectedCars.map(car => `
                    <div class="car-card">
                        <img src="${car.image}" alt="${car.make} ${car.model}">
                        <div class="car-card-content">
                            <h3>${car.make} ${car.model}</h3>
                            <p>Price: ₹${car.price}</p>
                            <p>Year: ${car.year}</p>
                            <p>Mileage: ${car.mileage}</p>
                            <p>Engine: ${car.engine}</p>
                            <p>Fuel Type: ${car.fuelType}</p>
                            <p>Transmission: ${car.transmission}</p>
                            <p>Seating: ${car.seating}</p>
                            <p>Body Type: ${car.bodyType}</p>
                            <button class="btn btn-danger" onclick="removeFromCompare(${car.id})">Remove</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (e) {
        console.error("Display comparison failed:", e);
        showToast("Failed to display comparison.", "error");
    }
}

// Remove from compare
function removeFromCompare(carId) {
    try {
        let comparisons = JSON.parse(localStorage.getItem("comparisons") || "[]");
        comparisons = comparisons.filter(id => id !== carId);
        localStorage.setItem("comparisons", JSON.stringify(comparisons));
        displayComparison();
    } catch (e) {
        console.error("Remove from compare failed:", e);
        showToast("Failed to remove from comparison.", "error");
    }
}

// Submit contact
function submitContact(event) {
    event.preventDefault();
    try {
        const contact = {
            name: sanitizeInput(document.getElementById("contact-name").value.trim()),
            email: document.getElementById("contact-email").value.trim(),
            message: sanitizeInput(document.getElementById("contact-message").value.trim())
        };

        let contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
        contacts.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        showToast("Message submitted successfully!", "success");
        event.target.reset();
    } catch (e) {
        console.error("Submit contact failed:", e);
        showError("contact-error", "Failed to submit message.");
    }
}

// Submit application
function submitApplication(event) {
    event.preventDefault();
    try {
        const application = {
            name: sanitizeInput(document.getElementById("app-name").value.trim()),
            email: document.getElementById("app-email").value.trim(),
            position: document.getElementById("app-position").value,
            resume: sanitizeInput(document.getElementById("app-resume").value.trim())
        };

        let applications = JSON.parse(localStorage.getItem("applications") || "[]");
        applications.push(application);
        localStorage.setItem("applications", JSON.stringify(applications));
        showToast("Application submitted successfully!", "success");
        event.target.reset();
    } catch (e) {
        console.error("Submit application failed:", e);
        showError("app-error", "Failed to submit application.");
    }
}

// View applications
function viewApplications() {
    try {
        const applications = JSON.parse(localStorage.getItem("applications") || "[]");
        const applicationsDiv = document.getElementById("applications");
        applicationsDiv.innerHTML = applications.length ? applications.map(app => `
            <div class="application">
                <p>Name: ${app.name}</p>
                <p>Email: ${app.email}</p>
                <p>Position: ${app.position}</p>
                <p>Resume: ${app.resume}</p>
            </div>
        `).join("") : "<p>No applications found.</p>";
    } catch (e) {
        console.error("View applications failed:", e);
        showToast("Failed to view applications.", "error");
    }
}

// Close modal
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    initializeStorage();
    checkUserLogin();

    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("search-button");
    const suggestionsDiv = document.getElementById("suggestions");

    if (searchInput) {
        searchInput.addEventListener("input", showSuggestions);
        searchInput.addEventListener("keydown", handleSuggestionNavigation);
    }
    if (searchButton) {
        searchButton.addEventListener("click", searchCars);
    }
    if (suggestionsDiv) {
        suggestionsDiv.addEventListener("click", selectSuggestion);
    }

    const companyButtons = document.querySelectorAll(".company-btn");
    companyButtons.forEach(btn => {
        btn.addEventListener("click", () => filterByCompany(btn.dataset.make));
    });
});