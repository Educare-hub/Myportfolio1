(function() {
  emailjs.init("KVCCyzjAsCjWmZoRH");

  document.getElementById("jobForm").addEventListener("submit", function(e) {
    e.preventDefault();
    emailjs.sendForm("service_suthvkl", "template_8683a9k", this)
      .then(() => {
        alert("✅ Your job application has been submitted successfully!");
      }, (error) => {
        alert("❌ Submission failed. Please try again.");
        console.error("Error:", error);
      });
  });
})();
function sendResumeAsEmail(name, email, message) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Simple generated CV structure
  doc.setFontSize(18);
  doc.text(`${name}'s Resume`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Email: ${email}`, 20, 30);
  doc.text(`Message: ${message}`, 20, 40);
  doc.text("Experience, Skills, and Qualifications...", 20, 60);
  
  // Convert PDF to base64 for email attachment
  const pdfBase64 = doc.output('datauristring').split(',')[1];

  // EmailJS parameters
  const templateParams = {
    to_email: email,
    from_name: name,
    message: message,
    attachment: pdfBase64, // attachment as base64
  };

  emailjs.send('service_suthvkl', 'template_8683a9k', templateParams)
    .then(() => {
      alert("✅ Resume successfully emailed!");
    })
    .catch((err) => {
      console.error("❌ Email failed:", err);
      alert("❌ Could not send email.");
    });
}