function showAlert(message) {
    try {
        const toast = document.getElementById("toast");
        if (!toast) {
            console.warn("Toast element not found.");
            return;
        }
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    } catch (e) {
        console.error("Show alert failed:", e);
    }
}

function calculateOnRoadPrice(exShowroomPrice) {
    try {
        if (!exShowroomPrice || isNaN(exShowroomPrice) || exShowroomPrice <= 0) {
            console.warn("Invalid ex-showroom price:", exShowroomPrice);
            return { onRoadPrice: null, rto: null, insurance: null, others: null };
        }

        const rto = exShowroomPrice * 0.1;
        const insurance = exShowroomPrice * 0.05;
        const others = 10000;
        const onRoadPrice = exShowroomPrice + rto + insurance + others;

        return {
            onRoadPrice: Math.round(onRoadPrice),
            rto: Math.round(rto),
            insurance: Math.round(insurance),
            others: Math.round(others)
        };
    } catch (e) {
        console.error("Calculate on-road price failed:", e);
        return { onRoadPrice: null, rto: null, insurance: null, others: null };
    }
}