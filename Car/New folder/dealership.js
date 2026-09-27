function displayDealershipInfo() {
    try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (user.role !== "dealership") {
            showAlert("Please log in as a dealership.");
            window.location.href = "index.html";
            return;
        }
        const dealerships = JSON.parse(localStorage.getItem("dealerships") || "[]");
        const dealership = dealerships.find(d => d.id === user.dealershipId);
        if (dealership) {
            document.getElementById("dealership-name").textContent = dealership.name;
            document.getElementById("dealership-location").textContent = dealership.city;
        } else {
            console.error("Dealership not found for ID:", user.dealershipId);
            showAlert("Dealership information not found.");
        }
    } catch (e) {
        console.error("Display dealership info failed:", e);
        showAlert("Failed to display dealership info.");
    }
}

function displayTestDriveBookings() {
    try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const testDrives = JSON.parse(localStorage.getItem("testDrives") || "[]");
        const bookingsDiv = document.getElementById("test-drive-bookings");
        const scheduledDiv = document.getElementById("scheduled-test-drives");
        let bookingsHtml = `
            <table class="test-drive-table">
                <tr>
                    <th>Name</th><th>Email</th><th>Phone</th><th>Car</th><th>Date</th><th>Time</th><th>Mode</th><th>Status</th><th>Action</th>
                </tr>
        `;
        let scheduledHtml = `
            <table class="test-drive-table">
                <tr>
                    <th>Name</th><th>Email</th><th>Phone</th><th>Car</th><th>Date</th><th>Time</th><th>Mode</th>
                </tr>
        `;
        testDrives.forEach(t => {
            const carName = `${t.make} ${t.model}`;
            if (t.status === "Confirmed") {
                scheduledHtml += `
                    <tr>
                        <td>${t.name}</td><td>${t.email}</td><td>${t.phone}</td><td>${carName}</td>
                        <td>${t.date}</td><td>${t.time}</td><td>${t.mode}</td>
                    </tr>
                `;
            } else {
                bookingsHtml += `
                    <tr>
                        <td>${t.name}</td><td>${t.email}</td><td>${t.phone}</td><td>${carName}</td>
                        <td>${t.date}</td><td>${t.time}</td><td>${t.mode}</td><td>${t.status}</td>
                        <td>
                            <button class="btn btn-success btn-sm" onclick="updateTestDriveStatus(${t.id}, 'Confirmed')">Confirm</button>
                            <button class="btn btn-danger btn-sm" onclick="updateTestDriveStatus(${t.id}, 'Declined')">Decline</button>
                        </td>
                    </tr>
                `;
            }
        });
        bookingsHtml += "</table>";
        scheduledHtml += "</table>";
        bookingsDiv.innerHTML = bookingsHtml;
        scheduledDiv.innerHTML = scheduledHtml;
    } catch (e) {
        console.error("Display test drive bookings failed:", e);
        showAlert("Failed to display test drive bookings.");
    }
}