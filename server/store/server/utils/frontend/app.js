document.getElementById("freemiumForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;
  const provider = document.getElementById("provider").value;

  const resp = await fetch("/api/publish-freemium", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, provider }),
  });
  const data = await resp.json();

  if (data.ok) {
    document.getElementById("result").innerHTML = `
      ✅ Publicado: <a href="${data.url}" target="_blank">${data.url}</a>
      <p>Expira en: ${data.expiresIn}</p>
    `;
  } else {
    document.getElementById("result").innerHTML = "Error: " + data.error;
  }
});
