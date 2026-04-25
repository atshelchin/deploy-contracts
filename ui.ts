export const UI_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Foundry Contract Deployer</title>
<style>
  :root { --bg: #0a0a0a; --card: #141414; --border: #2a2a2a; --text: #e0e0e0; --dim: #777; --blue: #3b82f6; --green: #22c55e; --red: #ef4444; --orange: #f59e0b; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .container { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
  h1 { font-size: 1.4em; margin-bottom: 4px; }
  .subtitle { color: var(--dim); font-size: 0.85em; margin-bottom: 24px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 14px; }
  .card-title { font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.05em; color: var(--dim); margin-bottom: 10px; }
  label { display: block; font-size: 0.8em; color: var(--dim); margin-bottom: 4px; }
  select, input { width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); font-size: 0.9em; margin-bottom: 10px; outline: none; }
  select:focus, input:focus { border-color: var(--blue); }
  .row { display: flex; gap: 10px; align-items: center; }
  .row > * { flex: 1; }
  button { padding: 10px 16px; border: none; border-radius: 8px; font-size: 0.9em; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  button:hover:not(:disabled) { opacity: 0.85; }
  button:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-blue { background: var(--blue); color: #fff; width: 100%; }
  .btn-green { background: var(--green); color: #000; width: 100%; }
  .btn-orange { background: var(--orange); color: #000; width: 100%; }
  .btn-small { padding: 6px 12px; font-size: 0.8em; width: auto; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .wallet-bar { display: flex; align-items: center; gap: 10px; }
  .wallet-bar .addr { font-family: monospace; font-size: 0.85em; color: var(--green); }
  .wallet-bar .chain-badge { font-size: 0.75em; background: var(--border); padding: 2px 8px; border-radius: 4px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
  .dot-red { background: var(--red); }
  .dot-green { background: var(--green); }
  .dot-orange { background: var(--orange); animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  .log-area { max-height: 260px; overflow-y: auto; font-family: monospace; font-size: 0.8em; }
  .log-item { padding: 6px 0; border-bottom: 1px solid var(--border); word-break: break-all; }
  .log-item:last-child { border-bottom: none; }
  .log-info { color: var(--blue); }
  .log-ok { color: var(--green); }
  .log-err { color: var(--red); }
  .log-warn { color: var(--orange); }
  .radio-group { display: flex; gap: 0; margin-bottom: 10px; }
  .radio-group label { flex: 1; text-align: center; padding: 8px; border: 1px solid var(--border); cursor: pointer; font-size: 0.85em; color: var(--text); margin-bottom: 0; user-select: none; }
  .radio-group label:first-child { border-radius: 8px 0 0 8px; }
  .radio-group label:last-child { border-radius: 0 8px 8px 0; }
  .radio-group input { display: none; }
  .radio-group input:checked + span { color: var(--blue); font-weight: 600; }
  .radio-group label:has(input:checked) { background: #1e3a5f; border-color: var(--blue); }
  .salt-row { display: none; }
  .salt-row.visible { display: block; }
  .predicted { font-family: monospace; font-size: 0.82em; color: #93c5fd; padding: 8px; background: #111; border-radius: 6px; margin-bottom: 10px; word-break: break-all; display: none; }
  .predicted.visible { display: block; }
  .constructor-args { display: none; margin-bottom: 10px; }
  .constructor-args.visible { display: block; }
  .constructor-args input { margin-bottom: 6px; }
  .constructor-args .arg-label { font-size: 0.78em; color: var(--dim); margin-bottom: 2px; }
  .hidden { display: none !important; }
  .net-item { padding: 8px 12px; cursor: pointer; font-size: 0.85em; border-bottom: 1px solid var(--border); }
  .net-item:last-child { border-bottom: none; }
  .net-item:hover { background: #1e3a5f; }
  .net-item .net-chain-id { color: var(--dim); font-size: 0.8em; float: right; }
  .net-item .net-symbol { color: var(--orange); font-size: 0.8em; margin-left: 6px; }
</style>
</head>
<body>
<div class="container">
  <h1>Foundry Contract Deployer</h1>
  <div class="subtitle">Vela Wallet (Web Bluetooth) &middot; Foundry / Forge projects &middot; CREATE2 & CREATE &middot; Etherscan / Blockscout verify</div>
  <div class="subtitle" id="project-path" style="margin-bottom:16px;">Loading...</div>

  <!-- Wallet Connection -->
  <div class="card">
    <div class="card-title">Wallet</div>
    <div id="wallet-disconnected">
      <button class="btn-blue" id="btn-connect" disabled>
        Connect Vela Wallet (Bluetooth)
      </button>
    </div>
    <div id="wallet-connected" class="hidden">
      <div class="wallet-bar">
        <span class="dot dot-green"></span>
        <span class="addr" id="wallet-addr"></span>
        <span class="chain-badge" id="wallet-chain"></span>
        <button class="btn-outline btn-small" id="btn-disconnect">Disconnect</button>
      </div>
    </div>
    <div id="wallet-connecting" class="hidden">
      <div class="wallet-bar">
        <span class="dot dot-orange"></span>
        <span style="color:var(--orange)">Connecting...</span>
      </div>
    </div>
  </div>

  <!-- Network -->
  <div class="card">
    <div class="card-title">Network</div>
    <div style="position:relative;">
      <input id="network-search" type="text" placeholder="Search network (e.g. Ethereum, Base, 8453)..." autocomplete="off" />
      <input id="network-select" type="hidden" value="" />
      <div id="network-dropdown" style="display:none; position:absolute; top:100%; left:0; right:0; max-height:240px; overflow-y:auto; background:var(--card); border:1px solid var(--border); border-radius:8px; z-index:10; margin-top:-8px;"></div>
    </div>
    <div id="network-loading" class="hidden" style="font-size:0.8em; color:var(--orange); margin-bottom:8px;">Loading chain data...</div>
    <label>RPC</label>
    <select id="rpc-select">
      <option value="">Select network first...</option>
    </select>
    <input id="rpc-url" type="text" placeholder="Or paste custom RPC URL..." style="font-size:0.82em;" />
    <label>Explorer</label>
    <input id="explorer-url" type="text" placeholder="https://..." readonly style="color:var(--dim);" />
  </div>

  <!-- Contract & Deploy -->
  <div class="card">
    <div class="card-title">Deploy</div>
    <label>Contract</label>
    <select id="contract-select">
      <option value="">Select a contract...</option>
    </select>

    <div id="constructor-args-area" class="constructor-args"></div>

    <label>Deploy Method</label>
    <div class="radio-group">
      <label><input type="radio" name="deploy-method" value="create2" checked><span>CREATE2</span></label>
      <label><input type="radio" name="deploy-method" value="create"><span>Traditional (CREATE)</span></label>
    </div>

    <div class="salt-row visible" id="salt-row">
      <label>Salt (bytes32)</label>
      <input id="salt-input" type="text" value="0x0000000000000000000000000000000000000000000000000000000000000000" />
    </div>

    <div class="predicted" id="predicted-addr"></div>

    <button class="btn-green" id="btn-deploy" disabled>Deploy Contract</button>
  </div>

  <!-- Verify -->
  <div class="card">
    <div class="card-title">Verify Contract</div>
    <label>Verify on</label>
    <div class="radio-group">
      <label><input type="radio" name="verify-target" value="etherscan" checked><span>Etherscan</span></label>
      <label><input type="radio" name="verify-target" value="blockscout"><span>Blockscout</span></label>
    </div>
    <div id="etherscan-key-row">
      <label>Etherscan API Key</label>
      <input id="etherscan-key" type="text" value="1GA442Z79I7USRD8KWF8DBQ799MCX3JDX2" />
    </div>
    <label>Deployed Address</label>
    <input id="verify-address" type="text" placeholder="0x..." />
    <button class="btn-orange" id="btn-verify">Verify Contract</button>
  </div>

  <!-- Logs -->
  <div class="card">
    <div class="card-title">Log</div>
    <div class="log-area" id="log-area"></div>
  </div>
</div>

<script type="module">
import { keccak256, concat, AbiCoder, ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm';

// ── Vela BLE constants ──
const VELA_SERVICE_UUID   = '0000be1a-0000-1000-8000-00805f9b34fb';
const VELA_REQUEST_CHAR   = '0001be1a-0000-1000-8000-00805f9b34fb';
const VELA_RESPONSE_CHAR  = '0002be1a-0000-1000-8000-00805f9b34fb';
const VELA_WALLET_INFO_CHAR = '0003be1a-0000-1000-8000-00805f9b34fb';
const CREATE2_PROXY = '0x4e59b44847b379578588920cA78FbF26c0B4956C';

// ── State ──
let bleDevice = null;
let bleServer = null;
let bleService = null;
let reqChar = null;
let resChar = null;
let infoChar = null;

let walletAddress = '';
let walletChainId = 0;
let contracts = [];
let networks = {};  // chainId -> chain data
let pendingRequests = {};
let requestCounter = 0;
let incomingBuffer = '';

// ── DOM refs ──
const $ = (id) => document.getElementById(id);

// ── Logging ──
function log(msg, type = 'info') {
  const area = $('log-area');
  const div = document.createElement('div');
  div.className = 'log-item log-' + ({info:'info',ok:'ok',error:'err',warn:'warn'}[type]||'info');
  div.textContent = msg;
  area.prepend(div);
}

// ── Network search & loading ──
let chainIndex = []; // { chainId, name, shortName, nativeCurrencySymbol }

async function loadChainIndex() {
  try {
    const resp = await fetch('https://ethereum-data.awesometools.dev/index/fuse-chains.json');
    const data = await resp.json();
    // Fuse index may wrap items; extract the list
    chainIndex = Array.isArray(data) ? data : (data.list || data.items || []);
    log('Loaded ' + chainIndex.length + ' networks', 'info');
  } catch (e) {
    log('Failed to load chain index: ' + e.message, 'warn');
  }
}

function searchNetworks(query) {
  if (!query) return chainIndex.slice(0, 20); // show popular by default
  const q = query.toLowerCase();
  const results = chainIndex.filter(c => {
    const name = (c.name || '').toLowerCase();
    const shortName = (c.shortName || '').toLowerCase();
    const symbol = (c.nativeCurrencySymbol || '').toLowerCase();
    const idStr = String(c.chainId);
    return name.includes(q) || shortName.includes(q) || symbol.includes(q) || idStr === q;
  });
  return results.slice(0, 30);
}

function renderDropdown(items) {
  const dd = $('network-dropdown');
  dd.innerHTML = '';
  if (!items.length) {
    dd.style.display = 'none';
    return;
  }
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'net-item';
    div.innerHTML = item.name + '<span class="net-symbol">' + (item.nativeCurrencySymbol || '') + '</span><span class="net-chain-id">' + item.chainId + '</span>';
    div.addEventListener('mousedown', (e) => {
      e.preventDefault();
      selectNetwork(item);
    });
    dd.appendChild(div);
  }
  dd.style.display = 'block';
}

async function selectNetwork(item) {
  const dd = $('network-dropdown');
  dd.style.display = 'none';
  $('network-search').value = item.name + ' (' + item.chainId + ')';
  $('network-select').value = item.chainId;

  // Fetch full chain data
  $('network-loading').classList.remove('hidden');
  try {
    if (!networks[item.chainId]) {
      const resp = await fetch('https://ethereum-data.awesometools.dev/chains/eip155-' + item.chainId + '.json');
      if (resp.ok) {
        networks[item.chainId] = await resp.json();
      }
    }
    populateRpcAndExplorer(item.chainId);
  } catch (e) {
    log('Failed to load chain data: ' + e.message, 'warn');
  } finally {
    $('network-loading').classList.add('hidden');
  }
}

function populateRpcAndExplorer(chainId) {
  const chain = networks[chainId];
  const rpcSel = $('rpc-select');
  const rpcInput = $('rpc-url');

  if (!chain) {
    rpcSel.innerHTML = '<option value="">No data</option>';
    rpcInput.value = '';
    $('explorer-url').value = '';
    return;
  }

  // Filter public HTTPS RPCs
  const rpcs = (chain.rpc || []).filter(r =>
    typeof r === 'string' && r.startsWith('https://') && !r.includes('\${') && !r.includes('$\\{')
  );

  rpcSel.innerHTML = '';
  for (const url of rpcs) {
    const opt = document.createElement('option');
    opt.value = url;
    try { opt.textContent = new URL(url).hostname; } catch { opt.textContent = url; }
    rpcSel.appendChild(opt);
  }
  const customOpt = document.createElement('option');
  customOpt.value = '__custom__';
  customOpt.textContent = '-- Custom --';
  rpcSel.appendChild(customOpt);

  if (rpcs.length) {
    rpcSel.value = rpcs[0];
    rpcInput.value = rpcs[0];
  }

  const explorer = chain.explorers?.[0]?.url || '';
  $('explorer-url').value = explorer;
}

// Search input events
{
  const searchInput = $('network-search');
  const dd = $('network-dropdown');
  let debounceTimer;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = searchInput.value.trim();
      const results = searchNetworks(q);
      renderDropdown(results);
    }, 150);
  });

  searchInput.addEventListener('focus', () => {
    const q = searchInput.value.trim();
    const results = searchNetworks(q);
    renderDropdown(results);
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => { dd.style.display = 'none'; }, 200);
  });
}

function onRpcSelect() {
  const val = $('rpc-select').value;
  if (val && val !== '__custom__') {
    $('rpc-url').value = val;
  } else {
    $('rpc-url').value = '';
    $('rpc-url').focus();
  }
}

// ── Contract loading ──
async function loadContracts() {
  try {
    const resp = await fetch('/api/contracts');
    contracts = await resp.json();
    const sel = $('contract-select');
    sel.innerHTML = '<option value="">Select a contract...</option>';
    for (let i = 0; i < contracts.length; i++) {
      const c = contracts[i];
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = c.name + ' (' + c.file + ')';
      sel.appendChild(opt);
    }
  } catch (e) {
    log('Failed to load contracts: ' + e.message, 'error');
  }
}

function getSelectedContract() {
  const idx = $('contract-select').value;
  if (idx === '') return null;
  return contracts[parseInt(idx)];
}

function onContractChange() {
  const c = getSelectedContract();
  const area = $('constructor-args-area');
  area.innerHTML = '';
  area.classList.remove('visible');

  if (!c) { updatePredicted(); return; }

  // Find constructor in ABI
  const ctor = (c.abi || []).find(a => a.type === 'constructor');
  if (ctor && ctor.inputs && ctor.inputs.length > 0) {
    area.classList.add('visible');
    for (const inp of ctor.inputs) {
      const lbl = document.createElement('div');
      lbl.className = 'arg-label';
      lbl.textContent = inp.type + ' ' + inp.name;
      area.appendChild(lbl);
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = inp.type;
      input.dataset.name = inp.name;
      input.dataset.type = inp.type;
      input.oninput = updatePredicted;
      area.appendChild(input);
    }
  }

  updatePredicted();
}

function getDeployMethod() {
  return document.querySelector('input[name="deploy-method"]:checked')?.value || 'create2';
}

function onMethodChange() {
  const method = getDeployMethod();
  $('salt-row').classList.toggle('visible', method === 'create2');
  updatePredicted();
}

function getInitCode() {
  const c = getSelectedContract();
  if (!c) return null;

  let initCode = c.bytecode;
  const ctor = (c.abi || []).find(a => a.type === 'constructor');
  if (ctor && ctor.inputs && ctor.inputs.length > 0) {
    const argInputs = $('constructor-args-area').querySelectorAll('input');
    const types = [];
    const values = [];
    for (const inp of argInputs) {
      types.push(inp.dataset.type);
      values.push(inp.value);
    }
    try {
      const coder = AbiCoder.defaultAbiCoder();
      const encoded = coder.encode(types, values);
      initCode = initCode + encoded.slice(2);
    } catch {
      return null;
    }
  }
  return initCode;
}

function updatePredicted() {
  const el = $('predicted-addr');
  if (getDeployMethod() !== 'create2') {
    el.classList.remove('visible');
    return;
  }
  const initCode = getInitCode();
  const salt = $('salt-input').value.trim();
  if (!initCode || salt.length !== 66) {
    el.classList.remove('visible');
    return;
  }
  try {
    const initCodeHash = keccak256(initCode);
    const hash = keccak256(concat(['0xff', CREATE2_PROXY, salt, initCodeHash]));
    const addr = '0x' + hash.slice(26);
    el.textContent = 'Predicted address: ' + addr;
    el.classList.add('visible');
  } catch {
    el.classList.remove('visible');
  }
}

// ── Vela Web Bluetooth ──

async function connectVela() {
  if (!navigator.bluetooth) {
    log('Web Bluetooth not supported. Use Chrome/Edge.', 'error');
    return;
  }

  $('wallet-disconnected').classList.add('hidden');
  $('wallet-connecting').classList.remove('hidden');
  log('Requesting Bluetooth device...');

  try {
    bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [VELA_SERVICE_UUID] }],
    });

    bleDevice.addEventListener('gattserverdisconnected', () => {
      log('Vela disconnected', 'warn');
      setWalletDisconnected();
    });

    log('Connecting to ' + (bleDevice.name || 'Vela') + '...');
    bleServer = await bleDevice.gatt.connect();
    bleService = await bleServer.getPrimaryService(VELA_SERVICE_UUID);

    reqChar = await bleService.getCharacteristic(VELA_REQUEST_CHAR);
    resChar = await bleService.getCharacteristic(VELA_RESPONSE_CHAR);
    infoChar = await bleService.getCharacteristic(VELA_WALLET_INFO_CHAR);

    // Subscribe to response notifications
    await resChar.startNotifications();
    resChar.addEventListener('characteristicvaluechanged', onBLENotification);

    // Read wallet info
    const infoVal = await infoChar.readValue();
    const infoStr = new TextDecoder().decode(infoVal);
    try {
      const info = JSON.parse(infoStr);
      walletAddress = info.address || '';
      walletChainId = info.chainId || 0;
      if (info.accounts?.length) {
        walletAddress = walletAddress || info.accounts[0].address;
      }
    } catch {
      log('Could not parse wallet info, will wait for update...', 'warn');
    }

    if (walletAddress) {
      setWalletConnected();
    } else {
      // Wait for wallet info push
      $('wallet-connecting').classList.add('hidden');
      $('wallet-disconnected').classList.remove('hidden');
      log('Connected but no address yet. Switch account in Vela.', 'warn');
    }

  } catch (e) {
    log('Connect failed: ' + e.message, 'error');
    setWalletDisconnected();
  }
}

function disconnectVela() {
  if (bleDevice?.gatt?.connected) {
    bleDevice.gatt.disconnect();
  }
  setWalletDisconnected();
}

function setWalletConnected() {
  $('wallet-disconnected').classList.add('hidden');
  $('wallet-connecting').classList.add('hidden');
  $('wallet-connected').classList.remove('hidden');
  const short = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
  $('wallet-addr').textContent = short;
  $('wallet-chain').textContent = walletChainId ? 'Chain ' + walletChainId : '';
  $('btn-deploy').disabled = false;
  log('Wallet connected: ' + walletAddress, 'ok');
}

function setWalletDisconnected() {
  $('wallet-connected').classList.add('hidden');
  $('wallet-connecting').classList.add('hidden');
  $('wallet-disconnected').classList.remove('hidden');
  walletAddress = '';
  walletChainId = 0;
  bleDevice = null;
  bleServer = null;
  bleService = null;
  reqChar = null;
  resChar = null;
  infoChar = null;
  $('btn-deploy').disabled = true;
}

// ── BLE message handling ──

function onBLENotification(event) {
  const value = event.target.value;
  const bytes = new Uint8Array(value.buffer);
  const decoded = new TextDecoder().decode(bytes);

  incomingBuffer += decoded;

  // Try parse complete messages (terminated by \\n\\n or just valid JSON)
  const parts = incomingBuffer.split('\\n\\n');
  for (let i = 0; i < parts.length - 1; i++) {
    const msg = parts[i].trim();
    if (msg) tryParseResponse(msg);
  }
  incomingBuffer = parts[parts.length - 1];

  // Also try parsing the whole buffer as JSON
  const trimmed = incomingBuffer.trim();
  if (trimmed) {
    try {
      const json = JSON.parse(trimmed);
      if (json.id) {
        incomingBuffer = '';
        handleResponse(json);
      }
    } catch {}
  }
}

function tryParseResponse(str) {
  try {
    const json = JSON.parse(str);
    handleResponse(json);
  } catch {}
}

function handleResponse(json) {
  // Wallet info update
  if (json.id === 'wallet_info_update' && json.result) {
    const info = json.result;
    walletAddress = info.address || (info.accounts?.[0]?.address) || walletAddress;
    walletChainId = info.chainId || walletChainId;
    if (walletAddress) setWalletConnected();
    return;
  }

  // Pending request response
  const pending = pendingRequests[json.id];
  if (pending) {
    delete pendingRequests[json.id];
    if (json.error) {
      pending.reject(new Error(json.error.message || 'BLE request failed'));
    } else {
      pending.resolve(json.result);
    }
  }
}

async function sendBLERequest(method, params) {
  if (!reqChar) throw new Error('Not connected to Vela');

  requestCounter++;
  const id = 'dpc-' + requestCounter + '-' + Date.now();
  const request = JSON.stringify({ id, method, params, origin: 'dapp' });
  const data = new TextEncoder().encode(request);

  // Write in 512-byte chunks
  const chunkSize = 512;
  for (let offset = 0; offset < data.length; offset += chunkSize) {
    const chunk = data.slice(offset, Math.min(offset + chunkSize, data.length));
    await reqChar.writeValue(chunk);
  }

  // Wait for response
  return new Promise((resolve, reject) => {
    pendingRequests[id] = { resolve, reject };
    setTimeout(() => {
      if (pendingRequests[id]) {
        delete pendingRequests[id];
        reject(new Error('BLE request timed out (60s)'));
      }
    }, 60000);
  });
}

// ── Switch chain on Vela wallet ──
async function switchChain(chainId) {
  const hexChainId = '0x' + parseInt(chainId).toString(16);
  try {
    await sendBLERequest('wallet_switchEthereumChain', [{ chainId: hexChainId }]);
    walletChainId = parseInt(chainId);
    $('wallet-chain').textContent = 'Chain ' + walletChainId;
    log('Switched to chain ' + chainId, 'ok');
  } catch (e) {
    log('Switch chain failed: ' + e.message, 'warn');
  }
}

// ── Deploy ──

async function deploy() {
  const c = getSelectedContract();
  if (!c) { log('Select a contract first', 'error'); return; }
  if (!walletAddress) { log('Connect wallet first', 'error'); return; }

  const rpcUrl = $('rpc-url').value.trim();
  if (!rpcUrl) { log('Set an RPC URL', 'error'); return; }

  const method = getDeployMethod();
  const initCode = getInitCode();
  if (!initCode) { log('Invalid constructor arguments', 'error'); return; }

  const selectedChainId = $('network-select').value;
  if (selectedChainId && selectedChainId !== 'custom' && parseInt(selectedChainId) !== walletChainId) {
    log('Switching wallet to chain ' + selectedChainId + '...');
    await switchChain(selectedChainId);
  }

  $('btn-deploy').disabled = true;
  $('btn-deploy').textContent = 'Deploying...';

  try {
    if (method === 'create2') {
      await deployCreate2(initCode, rpcUrl);
    } else {
      await deployTraditional(initCode, rpcUrl);
    }
  } catch (e) {
    log('Deploy failed: ' + e.message, 'error');
  } finally {
    $('btn-deploy').disabled = false;
    $('btn-deploy').textContent = 'Deploy Contract';
  }
}

async function deployCreate2(initCode, rpcUrl) {
  const salt = $('salt-input').value.trim();
  const initCodeHash = keccak256(initCode);
  const hash = keccak256(concat(['0xff', CREATE2_PROXY, salt, initCodeHash]));
  const predictedAddr = '0x' + hash.slice(26);

  // Check if already deployed
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const code = await provider.getCode(predictedAddr);
  if (code && code !== '0x') {
    log('Contract already deployed at ' + predictedAddr, 'warn');
    return;
  }

  // calldata = salt + initcode (without 0x)
  const calldata = salt + initCode.slice(2);

  log('Sending CREATE2 deploy tx to Vela...');
  const txHash = await sendBLERequest('eth_sendTransaction', [{
    from: walletAddress,
    to: CREATE2_PROXY,
    data: calldata,
    value: '0x0',
  }]);

  log('Tx sent: ' + txHash, 'ok');
  log('Waiting for confirmation...');

  const receipt = await provider.waitForTransaction(txHash);
  const explorerUrl = $('explorer-url').value;
  const link = explorerUrl ? explorerUrl + '/address/' + predictedAddr : predictedAddr;
  log('Deployed at ' + predictedAddr + ' | Block ' + receipt.blockNumber + ' | Gas ' + receipt.gasUsed, 'ok');
  if (explorerUrl) log('Explorer: ' + explorerUrl + '/tx/' + txHash, 'info');
  $('verify-address').value = predictedAddr;
}

async function deployTraditional(initCode, rpcUrl) {
  log('Sending deploy tx to Vela...');
  const txHash = await sendBLERequest('eth_sendTransaction', [{
    from: walletAddress,
    to: null,
    data: initCode,
    value: '0x0',
  }]);

  log('Tx sent: ' + txHash, 'ok');
  log('Waiting for confirmation...');

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const receipt = await provider.waitForTransaction(txHash);
  const deployedAddr = receipt.contractAddress;
  const explorerUrl = $('explorer-url').value;
  log('Deployed at ' + deployedAddr + ' | Block ' + receipt.blockNumber + ' | Gas ' + receipt.gasUsed, 'ok');
  if (explorerUrl) log('Explorer: ' + explorerUrl + '/tx/' + txHash, 'info');
  $('verify-address').value = deployedAddr;
}

// ── Verify ──

async function verifyContract() {
  const c = getSelectedContract();
  if (!c) { log('Select a contract first', 'error'); return; }

  const address = $('verify-address').value.trim();
  if (!address) { log('Enter the deployed contract address', 'error'); return; }

  const chainId = $('network-select').value;
  if (!chainId || chainId === 'custom') { log('Select a network first', 'error'); return; }

  const verifier = document.querySelector('input[name="verify-target"]:checked')?.value || 'etherscan';
  const etherscanKey = $('etherscan-key').value.trim();

  if (verifier === 'etherscan' && !etherscanKey) {
    log('Etherscan API key is required', 'error');
    return;
  }

  // Get constructor args encoding if any
  let constructorArgs = '';
  const ctor = (c.abi || []).find(a => a.type === 'constructor');
  if (ctor && ctor.inputs && ctor.inputs.length > 0) {
    const argInputs = $('constructor-args-area').querySelectorAll('input');
    const types = [];
    const values = [];
    for (const inp of argInputs) {
      types.push(inp.dataset.type);
      values.push(inp.value);
    }
    try {
      const coder = AbiCoder.defaultAbiCoder();
      constructorArgs = coder.encode(types, values).slice(2); // remove 0x
    } catch (e) {
      log('Invalid constructor args: ' + e.message, 'error');
      return;
    }
  }

  // Blockscout URL from explorer
  let blockscoutUrl = '';
  if (verifier === 'blockscout') {
    blockscoutUrl = $('explorer-url').value.trim();
    if (!blockscoutUrl) {
      log('Explorer URL is required for Blockscout verification', 'error');
      return;
    }
  }

  $('btn-verify').disabled = true;
  $('btn-verify').textContent = 'Verifying...';
  log('Verifying ' + c.name + ' at ' + address + ' on ' + verifier + '...');

  try {
    const resp = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractName: c.name,
        contractFile: 'src/' + c.file,
        address,
        chainId: parseInt(chainId),
        verifier,
        etherscanKey,
        constructorArgs: constructorArgs || undefined,
        blockscoutUrl: blockscoutUrl || undefined,
      }),
    });
    const result = await resp.json();
    if (result.ok) {
      log('Verification successful!', 'ok');
      if (result.output) log(result.output, 'info');
    } else {
      const out = result.output || '';
      // Detect invalid API key
      if (verifier === 'etherscan' && (out.includes('Invalid API Key') || out.includes('invalid api key') || out.includes('NOTOK'))) {
        log('Etherscan API key is invalid. Please replace it with your own key.', 'error');
        $('etherscan-key').value = '';
        $('etherscan-key').focus();
      } else {
        log(out || 'Verification failed', 'error');
      }
    }
  } catch (e) {
    log('Verify request failed: ' + e.message, 'error');
  } finally {
    $('btn-verify').disabled = false;
    $('btn-verify').textContent = 'Verify Contract';
  }
}

// Toggle etherscan key row based on verifier selection
document.querySelectorAll('input[name="verify-target"]').forEach(r => {
  r.addEventListener('change', () => {
    const v = document.querySelector('input[name="verify-target"]:checked')?.value;
    $('etherscan-key-row').style.display = v === 'etherscan' ? 'block' : 'none';
  });
});

// ── Init & event binding ──
async function init() {
  // Bind all events (no inline onclick needed)
  $('btn-connect').addEventListener('click', connectVela);
  $('btn-disconnect').addEventListener('click', disconnectVela);
  $('btn-deploy').addEventListener('click', deploy);
  $('btn-verify').addEventListener('click', verifyContract);
  $('rpc-select').addEventListener('change', onRpcSelect);
  $('contract-select').addEventListener('change', onContractChange);
  $('salt-input').addEventListener('input', updatePredicted);
  document.querySelectorAll('input[name="deploy-method"]').forEach(r => {
    r.addEventListener('change', onMethodChange);
  });

  // Enable connect button now that JS is ready
  $('btn-connect').disabled = false;

  // Load project info
  try {
    const resp = await fetch('/api/info');
    const info = await resp.json();
    $('project-path').textContent = info.cwd;
  } catch {}

  // Load chain index & contracts in parallel
  await Promise.all([loadChainIndex(), loadContracts()]);
  log('Ready. Connect Vela wallet to deploy.', 'info');
}

init();
</script>
</body>
</html>`;
