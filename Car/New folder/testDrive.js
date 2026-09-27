function bookTestDrive(carId) {
    try {
        const cars = JSON.parse(localStorage.getItem("cars") || "[]");
        const car = cars.find(c => c.id === parseInt(carId));
        if (!car) {
            console.error("Car not found for ID:", carId);
            showAlert("Car not found.");
            return;
        }

        const modal = document.getElementById("modal");
        const modalContent = document.getElementById("modal-content");
        modalContent.innerHTML = `
            <h2>Book Test Drive - ${car.make} ${car.model}</h2>
            <form id="test-drive-form" class="test-drive-form">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" required>
                </div>
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" required min="${new Date().toISOString().split("T")[0]}">
                </div>
                <div class="form-group">
                    <label for="time">Time (10 AM - 5 PM)</label>
                    <select id="time" required>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mode">Mode</label>
                    <select id="mode" required>
                        <option value="In-Person">In-Person</option>
                        <option value="Home Visit">Home Visit</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Book</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        `;
        modal.style.display = "flex";
        document.getElementById("test-drive-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const testDrive = {
                id: Date.now(),
                carId: car.id,
                make: car.make,
                model: car.model,
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                date: document.getElementById("date").value,
                time: document.getElementById("time").value,
                mode: document.getElementById("mode").value,
                status: "Pending"
            };
            let testDrives = JSON.parse(localStorage.getItem("testDrives") || "[]");
            testDrives.push(testDrive);
            localStorage.setItem("testDrives", JSON.stringify(testDrives));
            showAlert("Test drive booked successfully!");
            closeModal();
        });
    } catch (e) {
        console.error("Book test drive failed:", e);
        showAlert("Failed to book test drive.");
    }
}

function updateTestDriveStatus(testDriveId, status) {
    try {
        let testDrives = JSON.parse(localStorage.getItem("testDrives") || "[]");
        const testDrive = testDrives.find(t => t.id === testDriveId);
        if (!testDrive) {
            console.error("Test drive not found for ID:", testDriveId);
            showAlert("Test drive not found.");
            return;
        }
        testDrive.status = status;
        localStorage.setItem("testDrives", JSON.stringify(testDrives));
        if (status === "Confirmed") {
            showAlert(`Confirmation message sent to customer for ${testDrive.mode} at ${testDrive.time} on ${testDrive.date}.`);
        } else if (status === "Declined") {
            showAlert("Test drive not scheduled. Message sent to customer to contact team.");
        }
        displayTestDriveBookings();
    } catch (e) {
        console.error("Update test drive status failed:", e);
        showAlert("Failed to update test drive status.");
    }
}