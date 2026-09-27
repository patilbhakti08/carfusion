function initializeStorage() {
    try {
        if (!localStorage.getItem("users")) {
            const users = [
                { username: "admin1", password: "adminpass1", role: "admin" },
                { username: "pune", password: "password1", role: "dealership", dealershipId: "pune" },
                { username: "mumbai", password: "password2", role: "dealership", dealershipId: "mumbai" }
            ];
            localStorage.setItem("users", JSON.stringify(users));
        }
        if (!localStorage.getItem("dealerships")) {
            const dealerships = [
                { id: "pune", name: "Pune Central", make: "Maruti Suzuki", city: "Pune" },
                { id: "mumbai", name: "Mumbai Motors", make: "Hyundai", city: "Mumbai" }
            ];
            localStorage.setItem("dealerships", JSON.stringify(dealerships));
        }
    } catch (e) {
        console.error("Initialize storage failed:", e);
    }
}

function checkUserLogin() {
    try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const usernameSpan = document.getElementById("username");
        const loginBtn = document.getElementById("login-btn");
        const logoutBtn = document.getElementById("logout-btn");
        if (user && user.username) {
            usernameSpan.textContent = user.username;
            usernameSpan.classList.remove("hidden");
            loginBtn.classList.add("hidden");
            logoutBtn.classList.remove("hidden");
        } else {
            usernameSpan.classList.add("hidden");
            loginBtn.classList.remove("hidden");
            logoutBtn.classList.add("hidden");
        }
    } catch (e) {
        console.error("Check user login failed:", e);
    }
}

function loginUser() {
    try {
        const modal = document.getElementById("modal");
        const modalContent = document.getElementById("modal-content");
        modalContent.innerHTML = `
            <h2>Login</h2>
            <form id="login-form" class="test-drive-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Login</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        `;
        modal.style.display = "flex";
        document.getElementById("login-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value.toLowerCase();
            const password = document.getElementById("password").value;
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                showAlert("Login successful!");
                closeModal();
                checkUserLogin();
                if (user.role === "admin") {
                    window.location.href = "admin.html";
                } else if (user.role === "dealership") {
                    window.location.href = "dealership.html";
                }
            } else {
                showAlert("Invalid username or password.");
            }
        });
    } catch (e) {
        console.error("Login user failed:", e);
        showAlert("Failed to open login form.");
    }
}

function logoutUser() {
    try {
        localStorage.removeItem("currentUser");
        showAlert("Logged out successfully!");
        checkUserLogin();
        window.location.href = "index.html";
    } catch (e) {
        console.error("Logout user failed:", e);
        showAlert("Failed to logout.");
    }
}