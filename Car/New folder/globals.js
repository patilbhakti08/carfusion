function initializeStorage() {
    try {
        if (!localStorage.getItem("cars")) {
            localStorage.setItem("cars", JSON.stringify([]));
        }
        if (!localStorage.getItem("comparisons")) {
            localStorage.setItem("comparisons", JSON.stringify([]));
        } else {
            try {
                const comparisons = JSON.parse(localStorage.getItem("comparisons"));
                if (!Array.isArray(comparisons)) {
                    console.warn("Invalid comparisons data. Resetting to empty array.");
                    localStorage.setItem("comparisons", JSON.stringify([]));
                }
            } catch (e) {
                console.error("Failed to parse comparisons. Resetting:", e);
                localStorage.setItem("comparisons", JSON.stringify([]));
            }
        }
        if (!localStorage.getItem("testDrives")) {
            localStorage.setItem("testDrives", JSON.stringify([]));
        }
        if (!localStorage.getItem("jobApplications")) {
            localStorage.setItem("jobApplications", JSON.stringify([]));
        }
        if (!localStorage.getItem("contactMessages")) {
            localStorage.setItem("contactMessages", JSON.stringify([]));
        }
    } catch (e) {
        console.error("Initialize storage failed:", e);
    }
}

function closeModal() {
    try {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = "none";
        }
    } catch (e) {
        console.error("Close modal failed:", e);
    }
}