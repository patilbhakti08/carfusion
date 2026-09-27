function submitContactForm(e) {
    e.preventDefault();
    try {
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const message = document.getElementById("contact-message").value;
        let contacts = JSON.parse(localStorage.getItem("contactMessages") || "[]");
        contacts.push({ name, email, message, date: new Date().toISOString().split("T")[0] });
        localStorage.setItem("contactMessages", JSON.stringify(contacts));
        showAlert("Message sent successfully!");
        document.getElementById("contact-form").reset();
    } catch (e) {
        console.error("Contact form submission failed:", e);
        showAlert("Failed to send message.");
    }
}