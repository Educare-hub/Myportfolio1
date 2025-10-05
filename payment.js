document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("payBtn");
  const phoneInput = document.getElementById("phone");
  const statusDiv = document.getElementById("status");

  const currentUserEmail = localStorage.getItem("currentUser");
  if (!currentUserEmail) {
    alert("Please sign in first!");
    window.location.href = "signup.html";
    return;
  }

  payBtn.addEventListener("click", async () => {
    const phone = phoneInput.value.trim();
    if (!/^254\d{9}$/.test(phone)) {
      statusDiv.textContent = "📌 Enter a valid phone number in format 2547XXXXXXXX";
      return;
    }

    statusDiv.textContent = "💳 Initiating payment...";

    try {
      const res = await fetch("http://localhost:3000/api/mpesa-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email: currentUserEmail })
      });
      const data = await res.json();

      if (data.success) {
        statusDiv.textContent = "✅ Payment request sent! Check your phone to complete the transaction.";
      } else {
        statusDiv.textContent = "❌ Payment failed: " + data.message;
      }
    } catch (err) {
      console.error(err);
      statusDiv.textContent = "❌ Error connecting to payment server.";
    }
  });
});
