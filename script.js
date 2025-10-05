const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});
document.getElementById('generateCVBtn').addEventListener('click', () => {
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const education = document.getElementById('education').value.trim();
  const experience = document.getElementById('experience').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const summary = document.getElementById('summary').value.trim();

  if (!name || !email) {
    alert("Please fill in your name and email before generating the CV.");
    return;
  }

  const output = `
    <h4>${name}</h4>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Summary:</strong> ${summary}</p>
    <p><strong>Education:</strong><br>${education}</p>
    <p><strong>Experience:</strong><br>${experience}</p>
    <p><strong>Skills:</strong> ${skills}</p>
  `;

  const cvPreview = document.getElementById('cvPreview');
  const cvOutput = document.getElementById('cvOutput');
  cvOutput.innerHTML = output;
  cvPreview.classList.remove('hidden');
});

document.getElementById('downloadCVBtn').addEventListener('click', () => {
  window.print();
});