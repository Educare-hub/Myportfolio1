document.addEventListener("DOMContentLoaded", () => {
  const currentUserEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const user = currentUserEmail ? users[currentUserEmail] : null;

  if (!currentUserEmail || !user) {
    alert("Please sign in first!");
    window.location.href = "signup.html";
    return;
  }

  const generateBtn = document.getElementById("generateAIResumeBtn");
  const downloadBtn = document.getElementById("downloadPDFBtn");
  const emailBtn = document.getElementById("emailResumeBtn");
  const outputDiv = document.getElementById("aiOutput");
  const aiResultDiv = document.getElementById("aiResumeResult");

  function checkUsageLimit() {
    if (!user.upgraded && user.usage >= 3) {
      alert("You have used your 3 free attempts. Please upgrade to continue.");
      return false;
    }
    if (!user.upgraded) user.usage++;
    users[currentUserEmail] = user;
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  generateBtn.addEventListener("click", () => {
    if (!checkUsageLimit()) return;

    const jobDesc = document.getElementById("jobDescription").value.trim();
    const userDetails = document.getElementById("userDetails").value.trim();
    if (!jobDesc || !userDetails) { alert("Please paste the job description and your details."); return; }

    const lines = userDetails.split("\n").map(l => l.trim()).filter(l => l);
    const fullName = lines[0] || "John Doe";
    const contactInfo = lines.find(l => l.includes("@") || l.includes("+")) || "";
    const otherDetails = lines.filter(l => l !== fullName && l !== contactInfo).join("\n\n");

    const cvHTML = `
      <div style="font-family:'Poppins',sans-serif;color:#222;background:#fff;padding:30px;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
        <div style="text-align:center;margin-bottom:20px;">
          <h1 style="margin:0;color:#0a84ff;">${fullName}</h1>
          <p style="margin:5px 0;font-size:14px;">${contactInfo}</p>
        </div>
        <hr style="border:0;border-top:2px solid #0a84ff;margin:10px 0;">
        <section style="margin-bottom:15px;">
          <h2 style="color:#0a84ff;font-size:18px;margin-bottom:6px;"><i class="fas fa-user"></i> Profile</h2>
          <p>${otherDetails.replace(/\n/g,"<br>")}</p>
        </section>
        <section>
          <h2 style="color:#0a84ff;font-size:18px;margin-bottom:6px;"><i class="fas fa-briefcase"></i> Target Job</h2>
          <p>${jobDesc}</p>
        </section>
      </div>
    `;

    const coverLetterHTML = `
      <div style="font-family:'Poppins',sans-serif;color:#222;background:#f9fafc;padding:30px;border-radius:12px;margin-top:20px;">
        <h2 style="color:#0a84ff;"><i class="fas fa-envelope"></i> Cover Letter</h2>
        <p>Dear Hiring Manager,</p>
        <p>I am excited to apply for this opportunity. My experience and skills align perfectly with the job requirements:</p>
        <p>${jobDesc}</p>
        <p>Thank you for considering my application. I look forward to contributing to your team.</p>
        <p>Best regards,<br><strong>${fullName}</strong></p>
      </div>
    `;

    outputDiv.innerHTML = cvHTML + "<br>" + coverLetterHTML;
    aiResultDiv.style.display = "block";
  });

  downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(outputDiv, { callback: function(doc){ doc.save("88-Resume.pdf"); }, x:20, y:20, html2canvas:{scale:0.6} });
  });

  emailBtn.addEventListener("click", () => {
    const fullNameLine = document.getElementById("userDetails").value.split("\n")[0] || "John Doe";
    const emailContent = outputDiv.innerText;

    emailjs.send(
      "service_suthvkl",
      "template_8683a9k",
      { name: fullNameLine, email: document.getElementById("userDetails").value.match(/\S+@\S+\.\S+/)?.[0]||"", title:"Job Application", message:emailContent },
      "KVCCyzjAsCjWmZoRH"
    ).then(() => alert("✅ Your resume and cover letter have been emailed successfully!"),
      (err)=>{ console.error(err); alert("❌ Failed to send. Check console."); });
  });
});
