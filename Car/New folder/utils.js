function showAlert(message) {
    try {
        const toast = document.getElementById("toast");
        if (!toast) {
            console.error("Toast element not found.");
            return;
        }
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    } catch (e) {
        console.error("Show alert failed:", e);
    }
}

function calculateOnRoadPrice(price) {
    try {
        if (!price || isNaN(price) || price <= 0) {
            console.warn("Invalid price for calculateOnRoadPrice:", price);
            return { exShowroomPrice: 0, insurance: 0, rto: 0, registration: 0, otherCharges: 0, onRoadPrice: 0 };
        }
        const exShowroomPrice = Number(price);
        const insurance = exShowroomPrice * 0.05;
        const rto = exShowroomPrice * 0.1;
        const registration = 5000;
        const otherCharges = 10000;
        const onRoadPrice = exShowroomPrice + insurance + rto + registration + otherCharges;
        return {
            exShowroomPrice,
            insurance,
            rto,
            registration,
            otherCharges,
            onRoadPrice
        };
    } catch (e) {
        console.error("Calculate on-road price failed:", e);
        return { exShowroomPrice: 0, insurance: 0, rto: 0, registration: 0, otherCharges: 0, onRoadPrice: 0 };
    }
}