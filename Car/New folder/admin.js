function openFeedbackView() {
    try {
        const modal = document.getElementById("modal");
        const modalContent = document.getElementById("modal-content");
        const feedback = JSON.parse(localStorage.getItem("contactMessages") || "[]");
        let html = `
            <h2>Contact/Feedback</h2>
            <table class="feedback-table">
                <tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr>
        `;
        feedback.forEach(f => {
            html += `<tr><td>${f.name}</td><td>${f.email}</td><td>${f.message}</td><td>${f.date}</td></tr>`;
        });
        html += `
            </table>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "flex";
    } catch (e) {
        console.error("Feedback view failed:", e);
        showAlert("Failed to view feedback.");
    }
}

function openJobApplicationsView() {
    try {
        const modal = document.getElementById("modal");
        const modalContent = document.getElementById("modal-content");
        const applications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
        let html = `
            <h2>Job Applications</h2>
            <table class="job-application-table">
                <tr><th>Name</th><th>Phone</th><th>Job Title</th><th>Resume</th></tr>
        `;
        applications.forEach(app => {
            html += `<tr><td>${app.name}</td><td>${app.phone}</td><td>${app.jobTitle}</td><td><a href="${app.resume}" target="_blank">View Resume</a></td></tr>`;
        });
        html += `
            </table>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "flex";
    } catch (e) {
        console.error("Job applications view failed:", e);
        showAlert("Failed to view job applications.");
    }
}