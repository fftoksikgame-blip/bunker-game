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
// БУНКЕР (ОФЛАЙН) — ВСЕ ДАННЫЕ И ГЕНЕРАЦИЯ
// ============================================================

// --- Возраст ---
const ages = [];
for (let i = 18; i <= 110; i++) ages.push(i);

// --- Профессии ---
const professions = [
  'Врач', 'Хирург', 'Фармацевт', 'Военный', 'Пожарный',
  'Полицейский', 'Сапёр', 'Инженер', 'Робототехник', 'Программист',
  'Электрик', 'Строитель', 'Плотник', 'Водитель', 'Лётчик',
  'Моряк', 'Космонавт', 'Шахтёр', 'Геолог', 'Биолог',
  'Химик', 'Учитель', 'Переводчик', 'Журналист', 'Психиатр',
  'Ветеринар', 'Фермер', 'Охотник', 'Рыбак', 'Повар',
  'Мясник', 'Стюардесса', 'Мать в декрете', 'Мастер бокса', 'Стрелок'
];

// --- Факты ---
const bunkerFacts = [
  'Умеет добывать воду', 'Знает склад с оружием', 'Вскрывает замки',
  'Чинит генератор', 'Делает перевязки', 'Знает грибы и травы',
  'Разжигает огонь', 'Управляет дроном', 'Знает азбуку Морзе',
  'Делает взрывчатку', 'Маскируется', 'Строит укрытия',
  'Был в тюрьме', 'Работал шпионом', 'Подделывает документы',
  'Состоит в банде', 'Убивал человека', 'Торговал оружием',
  'Вампир', 'Очень хочет секса', 'Имеет тату на интимном месте'
];

// --- Хобби ---
const bunkerHobbies = [
  'Стрельба из лука', 'Метание ножей', 'Игра на гитаре',
  'Охота', 'Рыбалка', 'Сбор грибов', 'Ловушки', 'Ремонт часов',
  'Радио', 'Алхимия', 'Фотография', 'Вышивание', 'Скульптура',
  'Паркур', 'Медитация', 'Шахматы', 'Чтение книг'
];

// --- Багаж ---
const bunkerBaggage = [
  'Аптечка', 'Бомба', 'Ружьё', 'Патроны', 'Нож', 'Лук',
  'Генератор', 'Чемодан с вещами', 'Наркотики', 'Дрон',
  'Вибратор (на батарейках)', 'Презервативы (коробка)'
];

// --- Здоровье ---
const bunkerHealth = [
  'Слеп на 1 глаз', 'Рак 4 степени', 'Нет руки', 'Астматик',
  'Аллергик', 'Наркозависимый', 'Диабет', 'Глухой',
  'Немой', 'Геморрой', 'Глисты', 'Беременна', 'Амнезия',
  'Вечно голодный', 'Суицидные мысли', 'Идеально здоров',
  'Карлик', 'Склероз', 'Бесплодие', '2 сердца', '4 почки'
];

// --- Характер ---
const bunkerCharacter = [
  'Агрессивный', 'Миролюбивый', 'Хитрый', 'Наивный', 'Циничный',
  'Оптимист', 'Пессимист', 'Флегматик', 'Холерик',
  'Щедрый', 'Жадный', 'Скромный', 'Нарцисс', 'Эгоист',
  'Лживый', 'Честный', 'Верный', 'Трусливый', 'Смелый'
];

// --- Фобии ---
const bunkerPhobias = [
  'Пауки', 'Клаустрофобия', 'Женщины', 'Огонь', 'Вода',
  'Люди', 'Животные', 'Маньяки', 'Косметика'
];

// --- Условия ---
const bunkerConditions = [
  'Можешь поменяться ЛЮБОЙ картой с любым игроком',
  'Если тебя выгонят — выбери игрока, ему +30 лет',
  'Если тебя выгонят — забери ЛЮБУЮ карту у любого',
  'Все голосуют заново, тебя НЕЛЬЗЯ выгнать',
  'Твой голос считается за 2',
  'Забери у любого 15 лет (случайно)',
  'Человек слева голосует против себя в следующем раунде',
  'Если тебя изгнали — все противники получают +1 голос'
];

// --- Генерация Бункера ---
function generateBunkerSet() {
  const used = [];
  const pick = (arr) => {
    const available = arr.filter(item => !used.includes(item));
    const val = available.length > 0 ? random(available) : random(arr);
    used.push(val);
    return val;
  };
  const cards = [
    { title: 'Профессия', value: pick(professions) },
    { title: 'Возраст', value: `${random(ages)} лет` },
    { title: 'Факт', value: pick(bunkerFacts) },
    { title: 'Хобби', value: pick(bunkerHobbies) },
    { title: 'Багаж', value: pick(bunkerBaggage) },
    { title: 'Здоровье', value: pick(bunkerHealth) },
    { title: 'Характер', value: pick(bunkerCharacter) },
    { title: 'Фобия', value: pick(bunkerPhobias) }
  ];
  if (Math.random() < 0.4) {
    cards.push({ title: '⚡ Условие', value: pick(bunkerConditions) });
  }
  return cards;
}

// --- API для Бункера (офлайн) ---
app.get('/api/bunker', (req, res) => {
  const contents = [
    { item: 'Еда', min: 0, max: 100 },
    { item: 'Вода', min: 0, max: 100 },
    { item: 'Аптечка', min: 0, max: 5 },
    { item: 'Инструменты', min: 0, max: 20 },
    { item: 'Книги', min: 0, max: 10 },
    { item: 'Дети в инкубаторах', min: 0, max: 3 }
  ];
  const content = contents.map(c => ({
    item: c.item,
    amount: Math.floor(Math.random() * (c.max - c.min + 1)) + c.min
  }));
  res.json(content);
});

app.get('/api/catastrophe', (req, res) => {
  const catastrophes = [
    'Землетрясение', 'Эпидемия', 'Астероид', 'Вампиры',
    'Зомби-апокалипсис', 'Инопланетяне', 'Злые животные',
    'Роботы', 'Пожары', 'Вулкан', 'Цунами'
  ];
  res.json({ catastrophe: random(catastrophes) });
});

// ============================================================
// ОНЛАЙН: МАФИЯ И ШПИОН (КОМНАТЫ, РОЛИ, ГОЛОСОВАНИЕ)
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
  return roles.sort(() => Math.random() - 0.5);
}

const spyLocations = [
  'Военный бункер', 'Заброшенная станция', 'Космический корабль',
  'Подводная лодка', 'Остров сокровищ', 'Город-призрак',
  'Полярная станция', 'Джунгли', 'Пустыня', 'Гора Эверест',
  'Центр управления полётами', 'Подземный город', 'Заброшенный парк',
  'Необитаемый остров', 'Подземная лаборатория'
];

// ============================================================
// SOCKET.IO ЛОГИКА
// ============================================================

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);

  socket.on('createRoom', (data) => {
    const { playerName, gameType } = data;
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      gameType: gameType || 'mafia',
      players: [{ id: socket.id, name: playerName, isHost: true }],
      state: 'waiting',
      roles: [],
      alive: [],
      phase: null,
      nightVotes: {},
      dayVotes: {},
      mafiaKill: null,
      spyLocation: null,
      spyIndex: -1,
      gameLog: []
    };
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, isHost: true });
    io.to(roomCode).emit('playersUpdate', rooms[roomCode].players);
    console.log(`[${roomCode}] Создана комната. Хост: ${playerName}`);
  });

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
}

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
// ОБЩИЙ API
// ============================================================

app.get('/api/game/bunker', (req, res) => {
  res.json(generateBunkerSet());
});

// ============================================================
// ЗАПУСК СЕРВЕРА
// ============================================================

server.listen(PORT, () => {
  console.log(`[PORTAL] Запущен на порту ${PORT}`);
  console.log(`[PORTAL] Игры: Бункер (офлайн), Мафия (онлайн), Шпион (онлайн)`);
});