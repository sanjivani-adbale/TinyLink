const apiBase = "http://localhost:5000/api/links";

const linkForm = document.getElementById("linkForm");
const longUrlInput = document.getElementById("longUrl");
const customCodeInput = document.getElementById("customCode");
const formMessage = document.getElementById("formMessage");
const linksTableBody = document.querySelector("#linksTable tbody");

async function fetchLinks() {
  const res = await fetch(apiBase);
  const links = await res.json();

  linksTableBody.innerHTML = "";
  links.forEach(link => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${link.code}</td>
    <td>
      <a href="/r/${link.code}" target="_blank" rel="noopener noreferrer">
        ${link.target_url}
      </a>
    </td>
    <td>${link.clicks}</td>
    <td>${link.last_clicked_at ? new Date(link.last_clicked_at).toLocaleString() : "-"}</td>
    <td>
      <button class="copy-btn" onclick="copyLink('${link.code}')">Copy</button>
      <button class="delete-btn" onclick="deleteLink('${link.code}')">Delete</button>
    </td>
  `;
  linksTableBody.appendChild(row);
});


}

linkForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const target_url = longUrlInput.value;
  const customCode = customCodeInput.value;

  const res = await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_url, customCode })
  });

  if (res.status === 201) {
    formMessage.textContent = "Link created successfully!";
    longUrlInput.value = "";
    customCodeInput.value = "";
    fetchLinks();
  } else {
    const data = await res.json();
    formMessage.textContent = data.error || "Error";
  }
});

async function deleteLink(code) {
  await fetch(`${apiBase}/${code}`, { method: "DELETE" });
  fetchLinks();
}

fetchLinks();

function copyLink(code) {
  const shortLink = `${window.location.origin}/r/${code}`;
  navigator.clipboard.writeText(shortLink).then(() => {
    alert(`Copied to clipboard: ${shortLink}`);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert('Failed to copy link');
  });
}
