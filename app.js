const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// ХРАНИЛИЩЕ КОМНАТ
// ============================================================

const rooms = {};

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MAFIA-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ============================================================
// ГЕНЕРАЦИЯ РОЛЕЙ ДЛЯ МАФИИ (СЛУЧАЙНО)
// ============================================================

function generateMafiaRoles(playerCount) {
  let roles = [];
  if (playerCount <= 4) {
    roles = ['Мирный', 'Мирный', 'Мафия', 'Шериф'];
  } else if (playerCount <= 6) {
    roles = ['Мирный', 'Мирный', 'Мирный', 'Мафия', 'Шериф', 'Доктор'];
  } else if (playerCount <= 8) {
    roles = ['Мирный', 'Мирный', 'Мирный', 'Мирный', 'Мафия', 'Мафия', 'Шериф', 'Доктор'];
  } else {
    const extra = playerCount - 8;
    roles = ['Мирный', 'Мирный', 'Мирный', 'Мирный', 'Мафия', 'Мафия', 'Шериф', 'Доктор'];
    for (let i = 0; i < extra; i++) roles.push('Мирный');
  }
  // Перемешиваем — это и есть случайное распределение
  return roles.sort(() => Math.random() - 0.5);
}

// ============================================================
// ЛОКАЦИИ ДЛЯ ШПИОНА
// ============================================================

const spyLocations = [
  'Военный бункер', 'Заброшенная станция', 'Космический корабль',
  'Подводная лодка', 'Остров сокровищ', 'Город-призрак',
  'Полярная станция', 'Джунгли', 'Пустыня', 'Гора Эверест',
  'Центр управления полётами', 'Подземный город', 'Заброшенный парк аттракционов',
  'Необитаемый остров', 'Подземная лаборатория'
];

// ============================================================
// SOCKET.IO ЛОГИКА
// ============================================================

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);

  // --- СОЗДАНИЕ КОМНАТЫ ---
  socket.on('createRoom', (data) => {
    const { playerName, gameType } = data;
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      gameType: gameType || 'mafia',
      players: [{ id: socket.id, name: playerName, isHost: true }],
      state: 'waiting', // waiting, playing, ended
      roles: [],
      alive: [],
      phase: null,
      nightVotes: {},
      dayVotes: {},
      mafiaKill: null,
      sheriffCheck: null,
      doctorSave: null,
      spyLocation: null,
      spyIndex: -1,
      gameLog: []
    };
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, isHost: true });
    io.to(roomCode).emit('playersUpdate', rooms[roomCode].players);
    console.log(`[${roomCode}] Создана комната. Хост: ${playerName}`);
  });

  // --- ПОДКЛЮЧЕНИЕ К КОМНАТЕ ---
  socket.on('joinRoom', (data) => {
    const { roomCode, playerName } = data;
    if (!rooms[roomCode]) {
      socket.emit('error', 'Комната не найдена');
      return;
    }
    const room = rooms[roomCode];
    if (room.players.find(p => p.name === playerName)) {
      socket.emit('error', 'Имя уже занято');
      return;
    }
    room.players.push({ id: socket.id, name: playerName, isHost: false });
    socket.join(roomCode);
    socket.emit('joinedRoom', { roomCode, players: room.players, gameType: room.gameType });
    io.to(roomCode).emit('playersUpdate', room.players);
    console.log(`[${roomCode}] ${playerName} подключился`);
  });

  // --- НАЧАЛО ИГРЫ (только хост) ---
  socket.on('startGame', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.players.find(p => p.id === socket.id && p.isHost)) {
      socket.emit('error', 'Только хост может начать игру');
      return;
    }
    if (room.players.length < 3) {
      socket.emit('error', 'Нужно минимум 3 игрока');
      return;
    }

    if (room.gameType === 'mafia') {
      startMafia(room);
    } else if (room.gameType === 'spy') {
      startSpy(room);
    }
  });

  // --- НОЧЬ / ДЕНЬ (только хост) ---
  socket.on('setPhase', (data) => {
    const { roomCode, phase } = data;
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.players.find(p => p.id === socket.id && p.isHost)) return;

    room.phase = phase;
    io.to(roomCode).emit('phaseUpdate', { phase, log: room.gameLog });
  });

  // --- ГОЛОСОВАНИЕ (ночь: мафия) ---
  socket.on('nightVote', (data) => {
    const { roomCode, targetPlayerName } = data;
    const room = rooms[roomCode];
    if (!room || room.phase !== 'night') return;

    const voter = room.players.find(p => p.id === socket.id);
    if (!voter) return;

    const isMafia = room.roles[room.players.indexOf(voter)] === 'Мафия';
    if (!isMafia) return;

    room.nightVotes[socket.id] = targetPlayerName;
    io.to(roomCode).emit('nightVoteUpdate', { votes: room.nightVotes });

    const mafiaPlayers = room.players.filter((p, i) => room.roles[i] === 'Мафия');
    const allVoted = mafiaPlayers.every(p => room.nightVotes[p.id]);
    if (allVoted) {
      const votes = Object.values(room.nightVotes);
      const target = votes.reduce((a, b) => votes.filter(v => v === a).length >= votes.filter(v => v === b).length ? a : b);
      room.mafiaKill = target;
      room.gameLog.push(`🌙 Мафия выбрала ${target}`);
      io.to(roomCode).emit('nightResult', { kill: target });
    }
  });

  // --- ГОЛОСОВАНИЕ (день: все) ---
  socket.on('dayVote', (data) => {
    const { roomCode, targetPlayerName } = data;
    const room = rooms[roomCode];
    if (!room || room.phase !== 'day') return;

    room.dayVotes[socket.id] = targetPlayerName;
    io.to(roomCode).emit('dayVoteUpdate', { votes: room.dayVotes });

    const alivePlayers = room.players.filter((p, i) => room.alive[i]);
    const allVoted = alivePlayers.every(p => room.dayVotes[p.id]);
    if (allVoted) {
      const votes = Object.values(room.dayVotes);
      const target = votes.reduce((a, b) => votes.filter(v => v === a).length >= votes.filter(v => v === b).length ? a : b);
      const targetIndex = room.players.findIndex(p => p.name === target);
      if (targetIndex !== -1) {
        room.alive[targetIndex] = false;
        room.gameLog.push(`☀️ Игрок ${target} выгнан!`);
        io.to(roomCode).emit('dayResult', { eliminated: target, alive: room.players.filter((p, i) => room.alive[i]).map(p => p.name) });
        checkMafiaWin(room);
      }
    }
  });

  // --- РЕАКЦИЯ НА ОТКЛЮЧЕНИЕ ---
  socket.on('disconnect', () => {
    console.log('Игрок отключился:', socket.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);
        room.alive.splice(playerIndex, 1);
        room.roles.splice(playerIndex, 1);
        io.to(roomCode).emit('playersUpdate', room.players);
        io.to(roomCode).emit('playerDisconnected', { name: playerName });
        if (room.players.length === 0) {
          delete rooms[roomCode];
          console.log(`[${roomCode}] Комната удалена (пусто)`);
        }
      }
    }
  });
});

// ============================================================
// ЗАПУСК МАФИИ (СЛУЧАЙНЫЕ РОЛИ)
// ============================================================

function startMafia(room) {
  const playerCount = room.players.length;
  const roles = generateMafiaRoles(playerCount);
  room.roles = roles;
  room.alive = room.players.map(() => true);
  room.phase = 'night';
  room.nightVotes = {};
  room.dayVotes = {};
  room.gameLog = ['🌙 Город засыпает... Мафия, просыпайтесь!'];

  const roleMap = {};
  room.players.forEach((p, i) => {
    roleMap[p.id] = roles[i];
  });

  io.to(roomCode(room)).emit('gameStarted', { 
    gameType: 'mafia', 
    roles: roleMap,
    alive: room.players.map(p => p.name),
    phase: 'night',
    log: room.gameLog
  });
  io.to(roomCode(room)).emit('phaseUpdate', { phase: 'night', log: room.gameLog });
}

// ============================================================
// ЗАПУСК ШПИОНА (СЛУЧАЙНЫЙ ШПИОН)
// ============================================================

function startSpy(room) {
  const playerCount = room.players.length;
  const location = random(spyLocations);
  const spyIndex = Math.floor(Math.random() * playerCount);
  room.spyLocation = location;
  room.spyIndex = spyIndex;
  room.alive = room.players.map(() => true);
  room.phase = 'discussion';
  room.gameLog = [`🕵️ Шпион в игре! Локация: ${location}`];

  const roleMap = {};
  room.players.forEach((p, i) => {
    roleMap[p.id] = i === spyIndex ? 'Шпион' : 'Мирный';
  });

  io.to(roomCode(room)).emit('gameStarted', {
    gameType: 'spy',
    roles: roleMap,
    location: location,
    spyIndex: spyIndex,
    alive: room.players.map(p => p.name),
    phase: 'discussion',
    log: room.gameLog
  });
}

// ============================================================
// ПРОВЕРКА ПОБЕДЫ В МАФИИ
// ============================================================

function checkMafiaWin(room) {
  const alivePlayers = room.players.filter((p, i) => room.alive[i]);
  const aliveRoles = alivePlayers.map((p) => room.roles[room.players.indexOf(p)]);
  const mafiaAlive = aliveRoles.filter(r => r === 'Мафия').length;
  const civiliansAlive = aliveRoles.filter(r => r !== 'Мафия').length;

  if (mafiaAlive === 0) {
    room.gameLog.push('🏆 Мирные победили!');
    io.to(roomCode(room)).emit('gameEnded', { winner: 'Мирные' });
  } else if (mafiaAlive >= civiliansAlive) {
    room.gameLog.push('🏆 Мафия победила!');
    io.to(roomCode(room)).emit('gameEnded', { winner: 'Мафия' });
  }
}

function roomCode(room) {
  for (const code in rooms) {
    if (rooms[code] === room) return code;
  }
  return null;
}

// ============================================================
// ЗАПУСК СЕРВЕРА
// ============================================================

server.listen(PORT, () => {
  console.log(`[PORTAL-ONLINE] Запущен на порту ${PORT}`);
  console.log(`[PORTAL-ONLINE] Доступен по адресу: http://localhost:${PORT}`);
});