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
// БУНКЕР — ДАННЫЕ
// ============================================================

const ages = [];
for (let i = 18; i <= 110; i++) ages.push(i);

const professions = [
  { name: 'Врач', desc: 'Лечит болезни, делает операции.' },
  { name: 'Хирург', desc: 'Проводит сложные операции.' },
  { name: 'Фармацевт', desc: 'Знает лекарства, создаёт микстуры.' },
  { name: 'Военный', desc: 'Умеет обращаться с оружием.' },
  { name: 'Пожарный', desc: 'Тушит пожары, работает в дыму.' },
  { name: 'Полицейский', desc: 'Навыки допроса, порядок.' },
  { name: 'Сапёр', desc: 'Обезвреживает взрывчатку.' },
  { name: 'Инженер', desc: 'Чинит технику, строит механизмы.' },
  { name: 'Робототехник', desc: 'Создаёт и ремонтирует роботов.' },
  { name: 'Программист', desc: 'Взламывает системы, настраивает софт.' },
  { name: 'Электрик', desc: 'Чинит проводку, даёт свет.' },
  { name: 'Строитель', desc: 'Укрепляет стены, строит укрытия.' },
  { name: 'Плотник', desc: 'Делает мебель и орудия из дерева.' },
  { name: 'Сантехник', desc: 'Чинит трубы, добывает воду.' },
  { name: 'Водитель', desc: 'Управляет любой техникой.' },
  { name: 'Лётчик', desc: 'Управляет самолётом.' },
  { name: 'Моряк', desc: 'Ориентируется на воде.' },
  { name: 'Космонавт', desc: 'Знает космос, работает в скафандре.' },
  { name: 'Шахтёр', desc: 'Добывает ресурсы, копает.' },
  { name: 'Геолог', desc: 'Находит руду и воду.' },
  { name: 'Биолог', desc: 'Знает флору и фауну.' },
  { name: 'Химик', desc: 'Создаёт взрывчатку, очищает воду.' },
  { name: 'Учитель', desc: 'Обучает другим навыкам.' },
  { name: 'Переводчик', desc: 'Понимает языки, договаривается.' },
  { name: 'Журналист', desc: 'Узнаёт информацию, ведёт записи.' },
  { name: 'Психиатр', desc: 'Помогает справляться со стрессом.' },
  { name: 'Ветеринар', desc: 'Лечит животных.' },
  { name: 'Фермер', desc: 'Выращивает еду.' },
  { name: 'Охотник', desc: 'Отслеживает добычу, стреляет.' },
  { name: 'Рыбак', desc: 'Ловит рыбу.' },
  { name: 'Повар', desc: 'Готовит из любой еды.' },
  { name: 'Мясник', desc: 'Разделывает туши.' },
  { name: 'Стюардесса', desc: 'Успокаивает людей.' },
  { name: 'Мать в декрете', desc: 'Ухаживает за детьми, есть молоко.' },
  { name: 'Мастер бокса', desc: 'Владеет ударной техникой.' },
  { name: 'Стрелок', desc: 'Точно стреляет из любого оружия.' }
];

const bunkerFacts = [
  { text: 'Умеет добывать воду из почвы', desc: 'Находит воду в пустыне.' },
  { text: 'Знает склад с оружием', desc: 'Может найти оружие.' },
  { text: 'Вскрывает любые замки', desc: 'Открывает любые двери.' },
  { text: 'Чинит генератор', desc: 'Даёт электричество.' },
  { text: 'Делает перевязки', desc: 'Лечит раны.' },
  { text: 'Знает грибы и травы', desc: 'Находит еду или яд.' },
  { text: 'Разжигает огонь без спичек', desc: 'Можно согреться.' },
  { text: 'Управляет дроном', desc: 'Разведка с воздуха.' },
  { text: 'Знает азбуку Морзе', desc: 'Можно подавать сигналы.' },
  { text: 'Делает взрывчатку', desc: 'Может взорвать стену.' },
  { text: 'Маскируется', desc: 'Прячется от врагов.' },
  { text: 'Строит укрытия', desc: 'Защищает от радиации.' },
  { text: 'Был в тюрьме', desc: 'Знает, как выжить в заключении.' },
  { text: 'Работал шпионом', desc: 'Умеет добывать информацию.' },
  { text: 'Подделывает документы', desc: 'Может изменить личность.' },
  { text: 'Состоит в банде', desc: 'Есть связи на чёрном рынке.' },
  { text: 'Убивал человека', desc: 'Способен на жестокость.' },
  { text: 'Торговал оружием', desc: 'Достанет любой ствол.' },
  { text: 'Вампир', desc: 'Пьёт кровь, боится солнца.' },
  { text: 'Имеет тату на интимном месте', desc: 'Может шокировать.' }
];

const bunkerHobbies = [
  { name: 'Стрельба из лука', desc: 'Охота, защита.' },
  { name: 'Метание ножей', desc: 'Точное оружие.' },
  { name: 'Игра на гитаре', desc: 'Поднимает дух.' },
  { name: 'Охота', desc: 'Добывает мясо.' },
  { name: 'Рыбалка', desc: 'Добывает рыбу.' },
  { name: 'Сбор грибов', desc: 'Находит еду или яд.' },
  { name: 'Ловушки', desc: 'Пассивная охота.' },
  { name: 'Ремонт часов', desc: 'Чинит механизмы.' },
  { name: 'Радио', desc: 'Связь с другими.' },
  { name: 'Алхимия', desc: 'Создаёт зелья.' },
  { name: 'Фотография', desc: 'Фиксация фактов.' },
  { name: 'Вышивание', desc: 'Шитьё, зашивает раны.' },
  { name: 'Скульптура', desc: 'Создаёт орудия.' },
  { name: 'Паркур', desc: 'Убегает, лазает.' },
  { name: 'Медитация', desc: 'Контроль паники.' },
  { name: 'Шахматы', desc: 'Стратегия.' },
  { name: 'Чтение', desc: 'Кругозор.' }
];

const bunkerBaggage = [
  { name: 'Аптечка', desc: 'Лечит болезни и раны (1 раз).' },
  { name: 'Бомба', desc: 'Разрушает всё вокруг.' },
  { name: 'Ружьё', desc: 'Мощное оружие, 3 патрона.' },
  { name: 'Патроны', desc: 'Для ружья или пистолета.' },
  { name: 'Нож', desc: 'Режет, строгает, метает.' },
  { name: 'Лук', desc: 'Охота, защита.' },
  { name: 'Генератор', desc: 'Даёт свет и энергию.' },
  { name: 'Чемодан с вещами', desc: 'Одежда, инструменты.' },
  { name: 'Наркотики', desc: 'Обезболивание, зависимость.' },
  { name: 'Дрон', desc: 'Разведка, съёмка.' },
  { name: 'Вибратор', desc: 'Успокаивает.' },
  { name: 'Презервативы', desc: 'Защита от болезней.' },
  { name: 'Смазка', desc: 'Для механизмов или интима.' },
  { name: 'Порножурнал', desc: 'Поднимает настроение.' },
  { name: 'Сухпаёк', desc: 'Еда на 5 дней.' },
  { name: 'Фляга с водой', desc: '5 литров воды.' },
  { name: 'Фильтр для воды', desc: 'Очищает любую воду.' },
  { name: 'Набор отмычек', desc: 'Открывает любые замки.' },
  { name: 'Компас и карта', desc: 'Ориентирование.' },
  { name: 'Палатка', desc: 'Укрытие.' }
];

const bunkerHealth = [
  { name: 'Слеп на 1 глаз', desc: 'Плохое зрение.' },
  { name: 'Рак 4 степени', desc: 'Нужна аптечка.' },
  { name: 'Нет руки', desc: 'Трудно стрелять.' },
  { name: 'Астматик', desc: 'Нужны лекарства.' },
  { name: 'Аллергик', desc: 'Реакция на пыль и еду.' },
  { name: 'Наркозависимый', desc: 'Ломается без наркотиков.' },
  { name: 'Диабет', desc: 'Нужен инсулин.' },
  { name: 'Глухой', desc: 'Не слышит угрозы.' },
  { name: 'Немой', desc: 'Не может говорить.' },
  { name: 'Геморрой', desc: 'Трудно сидеть и ходить.' },
  { name: 'Глисты', desc: 'Постоянный голод.' },
  { name: 'Беременна', desc: 'Нужен уход.' },
  { name: 'Амнезия', desc: 'Не помнит прошлого.' },
  { name: 'Вечно голодный', desc: 'Ест за двоих.' },
  { name: 'Суицидные мысли', desc: 'Может сдаться.' },
  { name: 'Идеально здоров', desc: 'Полный порядок.' },
  { name: 'Карлик', desc: 'Низкий рост, слабый.' },
  { name: 'Склероз', desc: 'Забывает важное.' },
  { name: 'Бесплодие', desc: 'Не может иметь детей.' },
  { name: '2 сердца', desc: 'Выносливее других.' },
  { name: '4 почки', desc: 'Пьёт больше воды.' }
];

const bunkerCharacter = [
  'Агрессивный', 'Миролюбивый', 'Хитрый', 'Наивный', 'Циничный',
  'Оптимист', 'Пессимист', 'Флегматик', 'Холерик',
  'Щедрый', 'Жадный', 'Скромный', 'Нарцисс', 'Эгоист',
  'Лживый', 'Честный', 'Верный', 'Трусливый', 'Смелый'
];

const bunkerPhobias = [
  'Пауки', 'Клаустрофобия', 'Женщины', 'Огонь', 'Вода',
  'Люди', 'Животные', 'Маньяки', 'Косметика'
];

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

// --- ГЕНЕРАЦИЯ БУНКЕРА ---
function generateBunkerSet() {
  const used = [];
  const pick = (arr, type = 'text') => {
    const available = arr.filter(item => {
      const val = type === 'text' ? item : item.name;
      return !used.includes(val);
    });
    const chosen = available.length > 0 ? random(available) : random(arr);
    const val = type === 'text' ? chosen : chosen.name;
    used.push(val);
    return chosen;
  };

  const cards = [];
  cards.push({ title: 'Профессия', value: pick(professions, 'object').name, desc: pick(professions, 'object').desc });
  cards.push({ title: 'Возраст', value: `${random(ages)} лет`, desc: 'Влияет на здоровье и опыт.' });
  cards.push({ title: 'Факт', value: pick(bunkerFacts, 'object').text, desc: pick(bunkerFacts, 'object').desc });
  cards.push({ title: 'Хобби', value: pick(bunkerHobbies, 'object').name, desc: pick(bunkerHobbies, 'object').desc });
  cards.push({ title: 'Багаж', value: pick(bunkerBaggage, 'object').name, desc: pick(bunkerBaggage, 'object').desc });
  cards.push({ title: 'Здоровье', value: pick(bunkerHealth, 'object').name, desc: pick(bunkerHealth, 'object').desc });
  cards.push({ title: 'Характер', value: random(bunkerCharacter), desc: 'Влияет на голосование.' });
  cards.push({ title: 'Фобия', value: random(bunkerPhobias), desc: 'Страх, который мешает.' });
  if (Math.random() < 0.4) {
    const cond = random(bunkerConditions);
    cards.push({ title: '⚡ Условие', value: cond, desc: 'Бонус или штраф.' });
  }
  return cards;
}

// ============================================================
// API БУНКЕРА
// ============================================================

app.get('/api/game/bunker', (req, res) => {
  res.json(generateBunkerSet());
});

app.get('/api/catastrophe', (req, res) => {
  const list = [
    'Землетрясение (разрушает стены)',
    'Эпидемия (все болеют)',
    'Астероид (ударная волна)',
    'Вампиры (охотятся ночью)',
    'Зомби-апокалипсис (заражение)',
    'Инопланетяне (атака)',
    'Злые животные (нападения)',
    'Роботы (восстание)',
    'Пожары (горит всё)',
    'Вулкан (лава)',
    'Цунами (затопление)'
  ];
  res.json({ catastrophe: random(list) });
});

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

// ============================================================
// ОНЛАЙН: МАФИЯ И ШПИОН
// ============================================================

const rooms = {};

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MAFIA-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generateMafiaRoles(count) {
  let roles = [];
  if (count <= 4) roles = ['Мирный', 'Мирный', 'Мафия', 'Шериф'];
  else if (count <= 6) roles = ['Мирный', 'Мирный', 'Мирный', 'Мафия', 'Шериф', 'Доктор'];
  else if (count <= 8) roles = ['Мирный', 'Мирный', 'Мирный', 'Мирный', 'Мафия', 'Мафия', 'Шериф', 'Доктор'];
  else {
    roles = ['Мирный', 'Мирный', 'Мирный', 'Мирный', 'Мафия', 'Мафия', 'Шериф', 'Доктор'];
    for (let i = 0; i < count - 8; i++) roles.push('Мирный');
  }
  return roles.sort(() => Math.random() - 0.5);
}

const spyLocations = [
  'Военный бункер', 'Заброшенная станция', 'Космический корабль',
  'Подводная лодка', 'Остров сокровищ', 'Город-призрак',
  'Полярная станция', 'Джунгли', 'Пустыня', 'Гора Эверест',
  'Центр управления', 'Подземный город', 'Заброшенный парк'
];

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);

  socket.on('createRoom', (data) => {
    const { playerName, gameType } = data;
    const code = generateRoomCode();
    rooms[code] = {
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
    socket.join(code);
    socket.emit('roomCreated', { roomCode: code, isHost: true });
    io.to(code).emit('playersUpdate', rooms[code].players);
  });

  socket.on('joinRoom', (data) => {
    const { roomCode, playerName } = data;
    const room = rooms[roomCode];
    if (!room) { socket.emit('error', 'Комната не найдена'); return; }
    if (room.players.find(p => p.name === playerName)) { socket.emit('error', 'Имя занято'); return; }
    room.players.push({ id: socket.id, name: playerName, isHost: false });
    socket.join(roomCode);
    socket.emit('joinedRoom', { roomCode, players: room.players, gameType: room.gameType });
    io.to(roomCode).emit('playersUpdate', room.players);
  });

  socket.on('startGame', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    const host = room.players.find(p => p.id === socket.id && p.isHost);
    if (!host) { socket.emit('error', 'Только хост может начать игру'); return; }
    if (room.players.length < 3) { socket.emit('error', 'Нужно минимум 3 игрока'); return; }

    if (room.gameType === 'mafia') {
      const roles = generateMafiaRoles(room.players.length);
      room.roles = roles;
      room.alive = room.players.map(() => true);
      room.phase = 'night';
      room.nightVotes = {};
      room.dayVotes = {};
      room.gameLog = ['🌙 Город засыпает... Мафия, просыпайтесь!'];
      const roleMap = {};
      room.players.forEach((p, i) => roleMap[p.id] = roles[i]);
      io.to(roomCode).emit('gameStarted', {
        gameType: 'mafia', roles: roleMap, alive: room.players.map(p => p.name),
        phase: 'night', log: room.gameLog
      });
    } else if (room.gameType === 'spy') {
      const location = random(spyLocations);
      const spyIndex = Math.floor(Math.random() * room.players.length);
      room.spyLocation = location;
      room.spyIndex = spyIndex;
      room.alive = room.players.map(() => true);
      room.phase = 'discussion';
      room.gameLog = [`🕵️ Шпион в игре! Локация: ${location}`];
      const roleMap = {};
      room.players.forEach((p, i) => roleMap[p.id] = i === spyIndex ? 'Шпион' : 'Мирный');
      io.to(roomCode).emit('gameStarted', {
        gameType: 'spy', roles: roleMap, location, spyIndex,
        alive: room.players.map(p => p.name), phase: 'discussion', log: room.gameLog
      });
    }
  });

  socket.on('nightVote', (data) => {
    const { roomCode, targetPlayerName } = data;
    const room = rooms[roomCode];
    if (!room || room.phase !== 'night') return;
    const voter = room.players.find(p => p.id === socket.id);
    if (!voter) return;
    const idx = room.players.indexOf(voter);
    if (room.roles[idx] !== 'Мафия') return;

    room.nightVotes[socket.id] = targetPlayerName;
    io.to(roomCode).emit('nightVoteUpdate', { votes: room.nightVotes });

    const mafiaPlayers = room.players.filter((p, i) => room.roles[i] === 'Мафия');
    if (mafiaPlayers.every(p => room.nightVotes[p.id])) {
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
    if (alivePlayers.every(p => room.dayVotes[p.id])) {
      const votes = Object.values(room.dayVotes);
      const target = votes.reduce((a, b) => votes.filter(v => v === a).length >= votes.filter(v => v === b).length ? a : b);
      const idx = room.players.findIndex(p => p.name === target);
      if (idx !== -1) {
        room.alive[idx] = false;
        room.gameLog.push(`☀️ Игрок ${target} выгнан!`);
        io.to(roomCode).emit('dayResult', { eliminated: target, alive: room.players.filter((p, i) => room.alive[i]).map(p => p.name) });
        // Проверка победы
        const aliveRoles = room.players.filter((p, i) => room.alive[i]).map((p) => room.roles[room.players.indexOf(p)]);
        const mafiaAlive = aliveRoles.filter(r => r === 'Мафия').length;
        const civiliansAlive = aliveRoles.filter(r => r !== 'Мафия').length;
        if (mafiaAlive === 0) {
          room.gameLog.push('🏆 Мирные победили!');
          io.to(roomCode).emit('gameEnded', { winner: 'Мирные' });
        } else if (mafiaAlive >= civiliansAlive) {
          room.gameLog.push('🏆 Мафия победила!');
          io.to(roomCode).emit('gameEnded', { winner: 'Мафия' });
        }
      }
    }
  });

  socket.on('disconnect', () => {
    for (const code in rooms) {
      const room = rooms[code];
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        const name = room.players[idx].name;
        room.players.splice(idx, 1);
        room.alive.splice(idx, 1);
        room.roles.splice(idx, 1);
        io.to(code).emit('playersUpdate', room.players);
        io.to(code).emit('playerDisconnected', { name });
        if (room.players.length === 0) delete rooms[code];
        break;
      }
    }
  });
});

// ============================================================
// ЗАПУСК
// ============================================================

server.listen(PORT, () => {
  console.log(`[PORTAL] Запущен на порту ${PORT}`);
  console.log(`[PORTAL] Игры: Бункер, Мафия, Шпион`);
});