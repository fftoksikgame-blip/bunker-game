const socket = io();
let currentRoom = null;
let currentGame = null;
let myId = null;
let isHost = false;
let timers = {};
let currentRollType = null;
let mafiaRole = null;
let mafiaAlive = [];
let myBunkerCards = [];
let roomPlayers = [];

// ===== УТИЛИТЫ =====
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function toast(message, type = 'info') {
  const container = $('toast-container');
  const div = document.createElement('div');
  div.className = `toast ${type}`;
  div.textContent = message;
  container.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

function formatTime(sec) {
  if (sec <= 0) return '00:00';
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer(id, seconds) {
  clearInterval(timers[id]);
  let left = seconds;
  const el = $(id);
  if (el) el.textContent = formatTime(left);
  timers[id] = setInterval(() => {
    left--;
    if (el) el.textContent = formatTime(left);
    if (left <= 0) clearInterval(timers[id]);
  }, 1000);
}

function stopTimer(id) {
  clearInterval(timers[id]);
  const el = $(id);
  if (el) el.textContent = '00:00';
}

function updateLog(elementId, entries) {
  const el = $(elementId);
  if (!el) return;
  el.innerHTML = '';
  entries.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = entry;
    el.appendChild(div);
  });
  el.scrollTop = el.scrollHeight;
}

// ===== ЧАТ =====
function initChat(inputId, btnId, messagesId) {
  const input = $(inputId);
  const btn = $(btnId);
  const messages = $(messagesId);
  if (!input || !btn || !messages) return;

  function send() {
    const text = input.value.trim();
    if (!text) return;
    socket.emit('chatMessage', { message: text });
    input.value = '';
  }

  btn.addEventListener('click', send);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });
}

socket.on('chatMessage', (msg) => {
  document.querySelectorAll('.chat-messages').forEach(messages => {
    const div = document.createElement('div');
    div.className = 'chat-message';
    div.innerHTML = `<div class="msg-header"><span class="msg-name">${msg.name}</span><span class="msg-time">${msg.time}</span></div><div class="msg-text">${msg.message}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  });
});

// ===== ГЛАВНЫЙ ЭКРАН =====
const gameTitles = {
  bunker: { title: '🏚️ Бункер', icon: '🏚️' },
  mafia: { title: '🔪 Мафия', icon: '🔪' },
  spy: { title: '🕵️ Шпион', icon: '🕵️' },
  truth: { title: '🎲 Правда или Действие', icon: '🎲' }
};

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    currentGame = card.dataset.game;
    $('lobby-title').textContent = gameTitles[currentGame].title;
    showScreen('screen-lobby');
  });
});

$('btn-back').addEventListener('click', () => showScreen('screen-home'));

// ===== ЛОББИ =====
$('btn-create').addEventListener('click', () => {
  const name = $('lobby-name').value.trim();
  if (!name) { toast('Введите имя', 'error'); return; }
  socket.emit('createRoom', { playerName: name, gameType: currentGame });
});

$('btn-join').addEventListener('click', () => {
  const name = $('lobby-name').value.trim();
  const code = $('lobby-code').value.trim();
  if (!name) { toast('Введите имя', 'error'); return; }
  if (!code) { toast('Введите код комнаты', 'error'); return; }
  socket.emit('joinRoom', { roomCode: code, playerName: name });
});

// ===== КОМНАТА =====
socket.on('roomCreated', (data) => {
  currentRoom = data.roomCode;
  isHost = true;
  myId = socket.id;
  enterRoom(data);
});

socket.on('joinedRoom', (data) => {
  currentRoom = data.roomCode;
  isHost = false;
  myId = socket.id;
  enterRoom(data);
});

function enterRoom(data) {
  showScreen('screen-room');
  $('room-game-title').textContent = gameTitles[data.gameType].title;
  $('room-code-display').textContent = data.roomCode;
  $('btn-start-game').style.display = isHost ? 'block' : 'none';
  roomPlayers = data.players;
  updatePlayers(data.players);
  initChat('chat-input', 'btn-send', 'chat-messages');
}

function updatePlayers(players) {
  roomPlayers = players;
  $('room-player-count').textContent = `Игроков: ${players.length}`;
  const container = $('room-players');
  container.innerHTML = '';
  players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'player-tag' + (p.isHost ? ' host' : '') + (p.id === myId ? ' me' : '');
    div.innerHTML = `${p.name}${p.isHost ? '<span class="host-badge">ХОСТ</span>' : ''}${p.id === myId ? ' <span style="opacity:0.6">(ты)</span>' : ''}`;
    container.appendChild(div);
  });
}

socket.on('playersUpdate', (players) => updatePlayers(players));

$('room-code-display').addEventListener('click', function() {
  navigator.clipboard.writeText(this.textContent);
  this.classList.add('copied');
  this.textContent = 'Скопировано!';
  setTimeout(() => {
    this.classList.remove('copied');
    this.textContent = currentRoom;
  }, 1500);
});

$('btn-start-game').addEventListener('click', () => {
  socket.emit('startGame');
});

$('btn-leave-room').addEventListener('click', leaveGame);

// ===== ИГРА НАЧАЛАСЬ =====
socket.on('gameStarted', (data) => {
  const screens = { bunker: 'screen-bunker', mafia: 'screen-mafia', spy: 'screen-spy', truth: 'screen-truth' };
  showScreen(screens[data.gameType]);

  if (data.gameType === 'bunker') initBunker();
  if (data.gameType === 'mafia') initMafia();
  if (data.gameType === 'spy') initSpy();
  if (data.gameType === 'truth') initTruth();
});

// ===== БУНКЕР =====
function initBunker() {
  initChat('bunker-chat-input', 'btn-bunker-send', 'bunker-chat');
  $('btn-bunker-leave').addEventListener('click', leaveGame);
  $('btn-bunker-vote').addEventListener('click', () => {
    const target = $('bunker-vote-target').value;
    if (target) socket.emit('bunker:vote', { targetId: target });
  });
}

socket.on('bunker:start', (data) => {
  $('bunker-catastrophe').textContent = data.catastrophe;
  const contents = $('bunker-contents');
  contents.innerHTML = '';
  data.bunkerContents.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'player-tag';
    chip.innerHTML = `<strong>${item.item}:</strong> ${item.amount}`;
    chip.title = `${item.desc} | Эффект: ${item.effect}`;
    contents.appendChild(chip);
  });
  updateLog('bunker-log', data.log);
});

socket.on('bunker:cards', (data) => {
  myBunkerCards = data.cards;
  renderBunkerCards();
});

function renderBunkerCards() {
  const container = $('bunker-my-cards');
  container.innerHTML = '';
  myBunkerCards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'bunker-card' + (card.revealed ? ' revealed' : '');
    div.innerHTML = `
      <div class="card-label">${card.title}</div>
      <div class="card-value">${card.revealed ? card.value : '❓'}</div>
      ${card.revealed ? `<div class="card-desc">${card.desc}</div>` : ''}
      <div class="card-status">${card.revealed ? '✓ Раскрыто' : '👆 Нажми'}</div>
    `;
    div.addEventListener('click', () => {
      if (!card.revealed) socket.emit('bunker:reveal', { cardId: card.id });
    });
    container.appendChild(div);
  });
}

socket.on('bunker:phase', (data) => {
  const phaseNames = { reveal: 'Раскрытие', discussion: 'Обсуждение', voting: 'Голосование', ended: 'Конец' };
  $('bunker-round').textContent = `Раунд ${data.round} • ${phaseNames[data.phase] || data.phase}`;
  startTimer('bunker-timer', data.timeLeft || 0);
  updateLog('bunker-log', data.log);

  const voteArea = $('bunker-vote-area');
  if (data.phase === 'voting') {
    voteArea.style.display = 'block';
    const select = $('bunker-vote-target');
    select.innerHTML = '';
    roomPlayers.forEach(p => {
      if (p.id !== myId) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        select.appendChild(opt);
      }
    });
  } else {
    voteArea.style.display = 'none';
  }
});

socket.on('bunker:end', (data) => {
  stopTimer('bunker-timer');
  showEndScreen('🏆 Бункер', `Выжившие: ${data.survivors.join(', ')}`);
});

// ===== МАФИЯ =====
function initMafia() {
  initChat('mafia-chat-input', 'btn-mafia-send', 'mafia-chat');
  $('btn-mafia-leave').addEventListener('click', leaveGame);
}

socket.on('mafia:phase', (data) => {
  const isNight = data.phase === 'night';
  $('mafia-phase-title').textContent = isNight ? '🌙 Ночь' : '☀️ День';
  $('mafia-round').textContent = `Раунд ${data.round}`;
  startTimer('mafia-timer', isNight ? 45 : 90);
  updateLog('mafia-log', data.log);

  mafiaAlive = data.alive || [];
  const aliveList = $('mafia-alive-list');
  aliveList.innerHTML = '';
  mafiaAlive.forEach(p => {
    const div = document.createElement('div');
    div.className = 'player-tag';
    div.textContent = p.name;
    aliveList.appendChild(div);
  });

  renderMafiaAction(data.phase);
});

socket.on('mafia:role', (data) => {
  mafiaRole = data;
  $('mafia-my-role').textContent = data.role;
  $('mafia-role-desc').textContent = data.description;
  const team = $('mafia-role-team');
  team.textContent = data.isMafia ? 'Команда: Мафия' : 'Команда: Мирные';
  team.className = 'role-team ' + (data.isMafia ? 'mafia' : 'civilian');
  if (data.partners && data.partners.length) {
    $('mafia-role-desc').textContent += ` | Сообщники: ${data.partners.join(', ')}`;
  }
});

function renderMafiaAction(phase) {
  const area = $('mafia-action-area');
  area.innerHTML = '<h4>Действия</h4>';

  if (phase === 'night') {
    if (!mafiaRole) { area.innerHTML += '<p class="text-muted">Ожидание...</p>'; return; }
    const role = mafiaRole.role;
    let actionText = '';
    let canAct = false;

    if (role === 'Мафия' || role === 'Дон мафии') { actionText = 'Выберите жертву:'; canAct = true; }
    else if (role === 'Доктор') { actionText = 'Кого лечить?'; canAct = true; }
    else if (role === 'Шериф') { actionText = 'Кого проверить?'; canAct = true; }
    else if (role === 'Шлюха') { actionText = 'Кого блокировать?'; canAct = true; }
    else { actionText = '🌙 Город засыпает... Ждите утра.'; }

    if (canAct && mafiaAlive.length > 0) {
      const select = document.createElement('select');
      select.id = 'mafia-target';
      select.className = 'input';
      select.style.marginBottom = '12px';
      mafiaAlive.forEach(p => {
        if (p.id !== myId) {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = p.name;
          select.appendChild(opt);
        }
      });
      const btn = document.createElement('button');
      btn.className = 'btn btn-danger btn-block';
      btn.textContent = '✅ Выполнить действие';
      btn.addEventListener('click', () => {
        const target = $('mafia-target').value;
        if (target) socket.emit('mafia:nightAction', { targetId: target });
      });
      area.innerHTML += `<p class="text-muted mb-2">${actionText}</p>`;
      area.appendChild(select);
      area.appendChild(btn);
    } else {
      area.innerHTML += `<p class="text-muted">${actionText}</p>`;
    }
  } else if (phase === 'day') {
    if (mafiaAlive.length > 0) {
      const select = document.createElement('select');
      select.id = 'mafia-day-target';
      select.className = 'input';
      select.style.marginBottom = '12px';
      mafiaAlive.forEach(p => {
        if (p.id !== myId) {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = p.name;
          select.appendChild(opt);
        }
      });
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary btn-block';
      btn.textContent = '🗳️ Голосовать';
      btn.addEventListener('click', () => {
        const target = $('mafia-day-target').value;
        if (target) socket.emit('mafia:dayVote', { targetId: target });
      });
      area.innerHTML += `<p class="text-muted mb-2">Кого выгоняем?</p>`;
      area.appendChild(select);
      area.appendChild(btn);
    }
  } else {
    area.innerHTML += '<p class="text-muted">Игра окончена</p>';
  }
}

socket.on('mafia:mafiaVotes', (data) => {
  const div = $('mafia-mafia-votes');
  div.style.display = 'block';
  const list = $('mafia-mafia-votes-list');
  list.innerHTML = '';
  data.votes.forEach(v => {
    const item = document.createElement('div');
    item.className = 'vote-item';
    item.innerHTML = `<span class="voter">${v.by}</span> → <span class="target">${v.target}</span>`;
    list.appendChild(item);
  });
});

socket.on('mafia:sheriffResult', (data) => {
  toast(data.message, data.isMafia ? 'error' : 'success');
});

socket.on('mafia:actionConfirmed', () => {
  toast('✅ Действие выполнено', 'success');
});

socket.on('mafia:voteUpdate', (data) => {
  // Прогресс голосования
});

socket.on('mafia:end', (data) => {
  stopTimer('mafia-timer');
  showEndScreen(data.winner, data.message, data.roles);
});

// ===== ШПИОН =====
let spyPlayers = [];

function initSpy() {
  initChat('spy-chat-input', 'btn-spy-send', 'spy-chat');
  $('btn-spy-leave').addEventListener('click', leaveGame);
  $('btn-spy-vote').addEventListener('click', () => {
    const target = $('spy-vote-target').value;
    if (target) socket.emit('spy:vote', { targetId: target });
  });
}

socket.on('spy:start', (data) => {
  updateLog('spy-log', data.log);
  spyPlayers = roomPlayers;
  const select = $('spy-vote-target');
  select.innerHTML = '';
  roomPlayers.forEach(p => {
    if (p.id !== myId) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    }
  });
});

socket.on('spy:location', (data) => {
  if (data.location) {
    $('spy-location').textContent = `📍 Локация: ${data.location}`;
    $('spy-my-role').textContent = 'Мирный';
  } else {
    $('spy-location').textContent = data.message;
    $('spy-my-role').textContent = 'Шпион';
  }
});

socket.on('spy:phase', (data) => {
  const phaseNames = { discussion: 'Обсуждение', voting: 'Голосование' };
  $('spy-round').textContent = `Раунд ${data.round} • ${phaseNames[data.phase] || data.phase}`;
  startTimer('spy-timer', data.timeLeft || 0);
  updateLog('spy-log', data.log);
});

socket.on('spy:end', (data) => {
  stopTimer('spy-timer');
  showEndScreen(data.winner, `Шпион был: ${data.spy} | Локация: ${data.location}`);
});

// ===== ПРАВДА ИЛИ ДЕЙСТВИЕ =====
function initTruth() {
  initChat('truth-chat-input', 'btn-truth-send', 'truth-chat');
  $('btn-truth-leave').addEventListener('click', leaveGame);
  $('btn-truth-roll').addEventListener('click', () => socket.emit('truth:roll'));
  $('btn-truth-help').addEventListener('click', () => {
    socket.emit('truth:help', { type: currentRollType || 'truth' });
  });
  $('btn-truth-next').addEventListener('click', () => socket.emit('truth:next'));
}

socket.on('truth:turn', (data) => {
  $('truth-current-player').textContent = `Ход: ${data.player}`;
  const isMyTurn = data.playerId === myId;
  $('btn-truth-roll').style.display = isMyTurn ? 'inline-flex' : 'none';
  $('btn-truth-help').style.display = 'none';
  $('btn-truth-next').style.display = 'none';
  if (!isMyTurn) $('truth-result-area').innerHTML = `<p class="text-center text-muted" style="padding:40px;">Ожидание хода ${data.player}...</p>`;
});

socket.on('truth:result', (data) => {
  const r = data.result;
  currentRollType = r.type;
  const area = $('truth-result-area');
  area.innerHTML = `
    <div class="truth-result" style="border-left: 4px solid ${r.color}">
      <div class="result-label" style="color: ${r.color}">${r.label}</div>
      <div class="result-text">${r.text}</div>
      ${data.nextPlayer ? `<div class="result-player">Следующий: ${data.nextPlayer}</div>` : ''}
    </div>
  `;

  $('btn-truth-help').style.display = data.canHelp ? 'inline-flex' : 'none';
  $('btn-truth-next').style.display = r.type !== 'skip' ? 'inline-flex' : 'none';
  $('btn-truth-roll').style.display = 'none';

  updateTruthHistory(data.history);
});

socket.on('truth:helpResult', (data) => {
  const area = $('truth-result-area');
  area.innerHTML += `
    <div class="truth-result" style="border-left: 4px solid ${data.color}; margin-top: 12px;">
      <div class="result-label" style="color: ${data.color}">${data.label}</div>
      <div class="result-text">${data.text}</div>
    </div>
  `;
  $('btn-truth-help').style.display = 'none';
});

function updateTruthHistory(history) {
  const list = $('truth-history');
  list.innerHTML = '';
  history.slice(-10).forEach(h => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const typeColor = h.type === 'truth' ? '#4fc3f7' : h.type === 'dare' ? '#ff8a65' : '#bdbdbd';
    const typeLabel = h.type === 'truth' ? 'Правда' : h.type === 'dare' ? 'Действие' : 'Скип';
    div.innerHTML = `
      <span class="history-type" style="background: ${typeColor}22; color: ${typeColor}">${typeLabel}</span>
      <span><strong>${h.player}:</strong> ${h.text}</span>
    `;
    list.appendChild(div);
  });
}

// ===== ЭКРАН КОНЦА ИГРЫ =====
function showEndScreen(winner, message, roles) {
  showScreen('screen-end');
  $('end-winner').textContent = message || '';
  const winEmoji = winner.includes('Мафия') ? '🔪' : winner.includes('Шпион') ? '🕵️' : '🏆';
  $('end-title').textContent = `${winEmoji} ${winner}`;

  const content = $('end-content');
  content.innerHTML = '';
  if (roles) {
    const grid = document.createElement('div');
    grid.className = 'roles-reveal';
    Object.values(roles).forEach(r => {
      const div = document.createElement('div');
      div.className = 'role-reveal-item';
      div.innerHTML = `<div class="name">${r.name} ${r.alive ? '✅' : '💀'}</div><div class="role">${r.role}</div>`;
      grid.appendChild(div);
    });
    content.appendChild(grid);
  }
}

$('btn-end-leave').addEventListener('click', leaveGame);

// ===== ОБЩИЕ =====
function leaveGame() {
  location.reload();
}

socket.on('error', (msg) => {
  toast(msg, 'error');
});

socket.on('connect', () => {
  myId = socket.id;
});
