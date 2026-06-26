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
// БУНКЕР — РАСШИРЕННЫЕ БАЗЫ С ПОДСКАЗКАМИ
// ============================================================

const ages = [];
for (let i = 18; i <= 110; i++) ages.push(i);

// --- ПРОФЕССИИ (60+) ---
const professions = [
  { name: 'Врач', desc: 'Может лечить болезни и раны, делать операции.' },
  { name: 'Хирург', desc: 'Проводит сложные операции, удаляет аппендицит.' },
  { name: 'Фармацевт', desc: 'Знает лекарства, может создавать микстуры.' },
  { name: 'Военный', desc: 'Умеет обращаться с оружием, стратегия.' },
  { name: 'Пожарный', desc: 'Может тушить пожары, работать в дыму.' },
  { name: 'Полицейский', desc: 'Навыки допроса, поддержание порядка.' },
  { name: 'Сапёр', desc: 'Обезвреживает взрывчатку, знает инженерию.' },
  { name: 'Инженер', desc: 'Чинит технику, строит механизмы.' },
  { name: 'Робототехник', desc: 'Создаёт и ремонтирует роботов и дронов.' },
  { name: 'Программист', desc: 'Может взламывать системы, настраивать софт.' },
  { name: 'Электрик', desc: 'Чинит проводку, даёт свет в бункере.' },
  { name: 'Строитель', desc: 'Укрепляет стены, строит укрытия.' },
  { name: 'Плотник', desc: 'Делает мебель, орудия труда из дерева.' },
  { name: 'Сантехник', desc: 'Чинит трубы, добывает воду.' },
  { name: 'Водитель', desc: 'Управляет любой техникой, знает дороги.' },
  { name: 'Лётчик', desc: 'Управляет самолётом, знает аэронавигацию.' },
  { name: 'Моряк', desc: 'Ориентируется на воде, управляет судном.' },
  { name: 'Космонавт', desc: 'Знает космос, может работать в скафандре.' },
  { name: 'Шахтёр', desc: 'Добывает ресурсы, умеет копать.' },
  { name: 'Геолог', desc: 'Определяет породы, находит руду и воду.' },
  { name: 'Биолог', desc: 'Знает флору и фауну, лечит животных.' },
  { name: 'Химик', desc: 'Создаёт взрывчатку, очищает воду.' },
  { name: 'Учитель', desc: 'Может обучать другим навыкам, организовывать.' },
  { name: 'Переводчик', desc: 'Понимает языки, может договариваться.' },
  { name: 'Журналист', desc: 'Узнаёт информацию, ведёт записи.' },
  { name: 'Психиатр', desc: 'Помогает справляться со стрессом, паникой.' },
  { name: 'Ветеринар', desc: 'Лечит животных, знает анатомию.' },
  { name: 'Фермер', desc: 'Выращивает еду, знает урожай.' },
  { name: 'Охотник', desc: 'Отслеживает добычу, стреляет из лука.' },
  { name: 'Рыбак', desc: 'Ловит рыбу, знает водоёмы.' },
  { name: 'Повар', desc: 'Готовит из любой еды, знает специи.' },
  { name: 'Мясник', desc: 'Разделывает туши, добывает мясо.' },
  { name: 'Стюардесса', desc: 'Умеет успокаивать людей, знает сервис.' },
  { name: 'Мать в декрете', desc: 'Может ухаживать за детьми, обладает молоком.' },
  { name: 'Мастер бокса', desc: 'Владеет ударной техникой, сильный.' },
  { name: 'Стрелок', desc: 'Точно стреляет из любого оружия.' }
];

// --- ФАКТЫ (50+) ---
const bunkerFacts = [
  { text: 'Умеет добывать воду из почвы', desc: 'Можно найти воду в пустыне или под землёй.' },
  { text: 'Знает склад с оружием', desc: 'Можно найти оружие и патроны.' },
  { text: 'Вскрывает любые замки', desc: 'Может открыть любую дверь или сейф.' },
  { text: 'Чинит генератор', desc: 'Даёт электричество в бункере.' },
  { text: 'Делает перевязки', desc: 'Лечит раны и остановит кровь.' },
  { text: 'Знает грибы и травы', desc: 'Найдёт еду или яд.' },
  { text: 'Разжигает огонь без спичек', desc: 'Можно согреться и готовить.' },
  { text: 'Управляет дроном', desc: 'Разведка с воздуха, поиск ресурсов.' },
  { text: 'Знает азбуку Морзе', desc: 'Можно подавать сигналы.' },
  { text: 'Делает взрывчатку', desc: 'Может взорвать стену или создать ловушку.' },
  { text: 'Маскируется', desc: 'Прячется от врагов или зомби.' },
  { text: 'Строит укрытия', desc: 'Защищает от радиации или нападений.' },
  { text: 'Был в тюрьме', desc: 'Знает, как выжить в заключении.' },
  { text: 'Работал шпионом', desc: 'Умеет добывать секретную информацию.' },
  { text: 'Подделывает документы', desc: 'Может изменить личность.' },
  { text: 'Состоит в банде', desc: 'Есть связи на чёрном рынке.' },
  { text: 'Убивал человека', desc: 'Способен на жестокость.' },
  { text: 'Торговал оружием', desc: 'Достанет любой ствол.' },
  { text: 'Вампир', desc: 'Пьёт кровь, боится солнца.' },
  { text: 'Имеет тату на интимном месте', desc: 'Может шокировать или соблазнять.' },
  { text: 'Знает, как хранить еду без холода', desc: 'Сбережёт запасы.' },
  { text: 'Умеет шить одежду', desc: 'Починит любую вещь.' },
  { text: 'Может управлять лодкой', desc: 'Переплывёт реку или море.' },
  { text: 'Знает, как чинить рацию', desc: 'Восстановит связь.' },
  { text: 'Умеет дрессировать животных', desc: 'Защитник или помощник.' }
];

// --- ХОББИ (30+) ---
const bunkerHobbies = [
  { name: 'Стрельба из лука', desc: 'Охота, защита, метание.' },
  { name: 'Метание ножей', desc: 'Точное оружие, можно использовать в бою.' },
  { name: 'Игра на гитаре', desc: 'Поднимает дух, успокаивает.' },
  { name: 'Охота', desc: 'Добывает мясо, шкуры.' },
  { name: 'Рыбалка', desc: 'Добывает рыбу, удит в любых водоёмах.' },
  { name: 'Сбор грибов', desc: 'Найдёт еду или яд.' },
  { name: 'Ловушки на животных', desc: 'Пассивная охота.' },
  { name: 'Ремонт часов', desc: 'Может починить механизмы.' },
  { name: 'Радио', desc: 'Связь с другими группами.' },
  { name: 'Алхимия', desc: 'Создаёт зелья, яды, микстуры.' },
  { name: 'Фотография', desc: 'Фиксация фактов, поиск улик.' },
  { name: 'Вышивание', desc: 'Шитьё, лечит раны (зашивает).' },
  { name: 'Скульптура', desc: 'Создаёт орудия из дерева/камня.' },
  { name: 'Паркур', desc: 'Убегает, преодолевает препятствия.' },
  { name: 'Медитация', desc: 'Контролирует панику, стресс.' },
  { name: 'Шахматы', desc: 'Стратегическое мышление.' },
  { name: 'Чтение книг', desc: 'Широкий кругозор.' },
  { name: 'Оригами', desc: 'Из бумаги можно сделать карты.' },
  { name: 'Плетение сетей', desc: 'Ловит рыбу, птиц.' },
  { name: 'Разведение растений', desc: 'Еда своими руками.' }
];

// --- БАГАЖ (40+) ---
const bunkerBaggage = [
  { name: 'Аптечка', desc: 'Лечит болезни и раны (1 раз).' },
  { name: 'Бомба', desc: 'Разрушает всё вокруг (можно взорвать стену).' },
  { name: 'Ружьё', desc: 'Мощное оружие, 3 патрона.' },
  { name: 'Патроны', desc: 'Для ружья или пистолета.' },
  { name: 'Нож', desc: 'Режет, строгает, метает.' },
  { name: 'Лук', desc: 'Охота, защита, бесшумный.' },
  { name: 'Генератор', desc: 'Даёт свет и энергию.' },
  { name: 'Чемодан с вещами', desc: 'Одежда, инструменты, вещи.' },
  { name: 'Наркотики', desc: 'Обезболивание, но зависимость.' },
  { name: 'Дрон', desc: 'Разведка, съёмка.' },
  { name: 'Вибратор (на батарейках)', desc: 'Успокаивает, помогает уснуть.' },
  { name: 'Презервативы', desc: 'Защита от болезней.' },
  { name: 'Смазка', desc: 'Для механизмов или интима.' },
  { name: 'Порножурнал', desc: 'Поднимает настроение.' },
  { name: 'Сухпаёк', desc: 'Еда на 5 дней.' },
  { name: 'Фляга с водой', desc: '5 литров воды.' },
  { name: 'Фильтр для воды', desc: 'Очищает любую воду.' },
  { name: 'Набор отмычек', desc: 'Открывает любые замки.' },
  { name: 'Компас и карта', desc: 'Ориентирование на местности.' },
  { name: 'Палатка', desc: 'Укрытие от дождя и холода.' }
];

// --- ЗДОРОВЬЕ (30+) ---
const bunkerHealth = [
  { name: 'Слеп на 1 глаз', desc: 'Плохое зрение, но привыкаешь.' },
  { name: 'Рак 4 степени', desc: 'Терминальная стадия, нужна аптечка.' },
  { name: 'Нет руки', desc: 'Трудно стрелять и работать.' },
  { name: 'Астматик', desc: 'Нужны лекарства, чтобы дышать.' },
  { name: 'Аллергик', desc: 'Реакция на пыль, еду, укусы.' },
  { name: 'Наркозависимый', desc: 'Ломается без наркотиков.' },
  { name: 'Диабет', desc: 'Нужен инсулин.' },
  { name: 'Глухой', desc: 'Не слышит угрозы.' },
  { name: 'Немой', desc: 'Не может говорить.' },
  { name: 'Геморрой', desc: 'Трудно сидеть и ходить.' },
  { name: 'Глисты', desc: 'Постоянный голод, слабость.' },
  { name: 'Беременна', desc: 'Нужен уход, скоро роды.' },
  { name: 'Амнезия', desc: 'Не помнит прошлого.' },
  { name: 'Вечно голодный', desc: 'Ест за двоих.' },
  { name: 'Суицидные мысли', desc: 'Может сдаться без боя.' },
  { name: 'Идеально здоров', desc: 'Полный порядок.' },
  { name: 'Карлик', desc: 'Низкий рост, слабый.' },
  { name: 'Склероз', desc: 'Забывает важное.' },
  { name: 'Бесплодие', desc: 'Не может иметь детей.' },
  { name: '2 сердца', desc: 'Выносливее других.' },
  { name: '4 почки', desc: 'Может пить больше воды.' }
];

// --- ХАРАКТЕР (40+) ---
const bunkerCharacter = [
  'Агрессивный', 'Миролюбивый', 'Хитрый', 'Наивный', 'Циничный',
  'Оптимист', 'Пессимист', 'Флегматик', 'Холерик',
  'Щедрый', 'Жадный', 'Скромный', 'Нарцисс', 'Эгоист',
  'Лживый', 'Честный', 'Верный', 'Трусливый', 'Смелый',
  'Добрый', 'Жестокий', 'Меланхолик', 'Сангвиник'
];

// --- ФОБИИ (15+) ---
const bunkerPhobias = [
  'Пауки', 'Клаустрофобия', 'Женщины', 'Огонь', 'Вода',
  'Люди', 'Животные', 'Маньяки', 'Косметика',
  'Смерть', 'Высота', 'Змеи', 'Темнота', 'Звуки', 'Кровь'
];

// --- УСЛОВИЯ (15+) ---
const bunkerConditions = [
  'Можешь поменяться ЛЮБОЙ картой с любым игроком',
  'Если тебя выгонят — выбери игрока, ему +30 лет',
  'Если тебя выгонят — забери ЛЮБУЮ карту у любого',
  'Все голосуют заново, тебя НЕЛЬЗЯ выгнать',
  'Твой голос считается за 2',
  'Забери у любого 15 лет (случайно)',
  'Человек слева голосует против себя в следующем раунде',
  'Если тебя изгнали — все противники получают +1 голос',
  'Ты можешь украсть одну карту у любого игрока',
  'Если ты выгнан — забираешь с собой одного игрока'
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
  cards.push({ title: 'Характер', value: random(bunkerCharacter), desc: 'Влияет на голосование и отношения.' });
  cards.push({ title: 'Фобия', value: random(bunkerPhobias), desc: 'Страх, который мешает.' });
  if (Math.random() < 0.4) {
    const cond = random(bunkerConditions);
    cards.push({ title: '⚡ Условие', value: cond, desc: 'Бонус или штраф на игру.' });
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
  const catastrophes = [
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
  res.json({ catastrophe: random(catastrophes) });
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
// МАФИЯ / ШПИОН (ОНЛАЙН) — БЕЗ ИЗМЕНЕНИЙ
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
// ЗАПУСК
// ============================================================

server.listen(PORT, () => {
  console.log(`[PORTAL] Запущен на порту ${PORT}`);
  console.log(`[PORTAL] Игры: Бункер (офлайн), Мафия (онлайн), Шпион (онлайн)`);
});