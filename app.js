const MY_CRYPTO_WALLET = "0xYourBscUsdtWalletAddressHere";

let current = "home";
let user = { name: "Alex Stone", handle: "@alexstone", balance: 10.00, bio: "Stand-up comic. Professional overthinker." };
let posts = [
  { id: 101, name: "Maya Reed", handle: "@mayareed", text: "My therapist told me to stop blaming myself for everything. I said, 'Great. Whose fault is that?'", likes: 284, shares: 31, buyers: ["@alexstone"] }
];

function render() {
  document.getElementById("pageTitle").textContent = { home: "Home", explore: "Explore", profile: "Profile" }[current];
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === current));
  
  const view = document.getElementById("view");
  if (current === "profile") return renderProfile(view);
  if (current === "explore") return renderExplore(view);
  renderFeed(view);
}

function postHTML(p) {
  return `<article class="post">
    <div class="postHead">
      <div><span class="user">${p.name}</span> <span class="handle">${p.handle}</span></div>
      <span class="muted">#${p.id}</span>
    </div>
    <div class="content">${esc(p.text)}</div>
    <div class="stats">
      <span>${p.likes} likes</span>
      <span>${p.shares || 0} shares</span>
      <span>${p.buyers ? p.buyers.length : 0} buyers</span>
    </div>
    <div class="actions">
      <button onclick="toast('Liked!')">♡ Like</button>
      <button onclick="toast('Share recorded')">↗ Share</button>
      <button onclick="showBuyers(${p.id})">${p.buyers ? p.buyers.length : 0} Buyers</button>
      <button class="buy" onclick="buyJoke(${p.id})">$1 Use it</button>
    </div>
  </article>`;
}

function renderFeed(v) {
  v.innerHTML = `
    <div class="composer">
      <textarea id="quick" placeholder="Write a joke or funny memory..."></textarea>
      <div class="row">
        <span class="muted">Publishing costs $1</span>
        <button class="primary" onclick="publishQuick()">Publish</button>
      </div>
    </div>
    ${posts.map(postHTML).join("")}`;
}

function renderExplore(v) {
  v.innerHTML = `<div class="card"><h3>Trending Jokes</h3><p class="muted">Ranked by community engagement.</p></div>` +
    [...posts].sort((a,b) => b.likes - a.likes).map(postHTML).join("");
}

function renderProfile(v) {
  v.innerHTML = `
    <div class="profileBox">
      <div class="avatar">${user.name[0]}</div>
      <h2>${user.name}</h2>
      <div class="handle">${user.handle}</div>
      <div class="bio">${user.bio}</div>
      
      <!-- Wallet integrated inside Profile -->
      <div class="walletBox">
        <h3>Wallet & Balance</h3>
        <p class="muted">Available Balance: <b style="color:var(--text);font-size:18px">$${user.balance.toFixed(2)}</b></p>
        <button class="primary" onclick="openTopup()">Deposit $10 (USDT)</button>
        
        <div class="card" style="margin-top:15px">
          <b>Creator Earnings</b>
          <p class="muted">You earn 50% every time someone purchases rights to your joke.</p>
          <strong style="color:var(--accent);font-size:20px">$0.00</strong>
        </div>
      </div>
    </div>`;
}

function publishQuick() {
  const t = document.getElementById("quick").value.trim();
  if(!t) return toast("Write something first.");
  if(user.balance < 1) return toast("Insufficient balance! Top up $10 first.");
  
  user.balance -= 1;
  posts.unshift({ id: Date.now()%10000, name: user.name, handle: user.handle, text: t, likes: 0, buyers: [] });
  toast("Joke published for $1!");
  render();
}

function buyJoke(id) {
  const p = posts.find(x => x.id === id);
  if (user.balance < 1) return toast("Insufficient balance. Add funds in Profile.");
  user.balance -= 1;
  if(!p.buyers) p.buyers = [];
  p.buyers.push(user.handle);
  toast("You purchased usage rights for $1!");
  render();
}

function openTopup() {
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>Add Funds ($10 USDT)</h2>
    <p class="muted">Send <b>10 USDT (BSC / BEP20)</b> to the address below:</p>
    <div class="addr-box">${MY_CRYPTO_WALLET}</div>
    <p class="muted" style="font-size:12px">After sending, enter your Transaction Hash (TxHash) below for verification:</p>
    <input id="txhash" placeholder="Paste TxHash / Transaction ID here">
    <button class="primary" style="width:100%" onclick="submitTx()">Submit Deposit</button>
  `);
}

function submitTx() {
  const hash = document.getElementById("txhash").value.trim();
  if(!hash) return toast("Please enter TxHash");
  closeModal();
  toast("Transaction submitted! Funds will reflect after verification.");
}

function showBuyers(id) {
  const p = posts.find(x => x.id === id);
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>Joke Buyers</h2>
    ${(p.buyers && p.buyers.length) ? p.buyers.join("<br>") : "<p class='muted'>No buyers yet.</p>"}
  `);
}

function openPublish() {
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>Publish a Joke</h2>
    <p class="muted">Cost: $1 from your wallet.</p>
    <textarea id="publishText" rows="5" placeholder="Type your joke..."></textarea>
    <button class="primary" onclick="publishQuickModal()">Publish for $1</button>
  `);
}

function publishQuickModal() {
  const txt = document.getElementById("publishText").value.trim();
  if(txt) {
    document.getElementById("quick").value = txt;
    closeModal();
    publishQuick();
  }
}

function openModal(html) { document.getElementById("modalContent").innerHTML = html; document.getElementById("modal").classList.add("show"); }
function closeModal() { document.getElementById("modal").classList.remove("show"); }
function toast(t) { const e = document.getElementById("toast"); e.textContent = t; e.style.display = "block"; setTimeout(() => e.style.display = "none", 2200); }
function esc(s) { return s.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])); }

document.querySelectorAll("#nav button").forEach(b => b.onclick = (e) => {
  current = e.target.dataset.page;
  render();
});

render();