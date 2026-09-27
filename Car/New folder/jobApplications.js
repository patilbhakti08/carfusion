function submitJobApplication(e) {
    e.preventDefault();
    try {
        const name = document.getElementById("applicant-name").value;
        const phone = document.getElementById("applicant-number").value;
        const jobTitle = document.getElementById("job-title").value;
        const resume = document.getElementById("resume").files[0];
        if (!resume) {
            showAlert("Please upload a resume.");
            return;
        }
        const resumeUrl = URL.createObjectURL(resume);
        let applications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
        applications.push({ name, phone, jobTitle, resume: resumeUrl });
        localStorage.setItem("jobApplications", JSON.stringify(applications));
        showAlert("Application submitted successfully!");
        document.getElementById("careers-form").reset();
    } catch (e) {
        console.error("Job application submission failed:", e);
        showAlert("Failed to submit application.");
    }
}