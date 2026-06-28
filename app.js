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
  { name: 'Врач', desc: 'Лечит болезни, делает операции, спасает жизни.' },
  { name: 'Хирург', desc: 'Проводит сложные операции, удаляет аппендицит.' },
  { name: 'Фармацевт', desc: 'Знает лекарства, создаёт микстуры и яды.' },
  { name: 'Военный', desc: 'Умеет обращаться с оружием, стратег.' },
  { name: 'Пожарный', desc: 'Тушит пожары, работает в дыму, спасает людей.' },
  { name: 'Полицейский', desc: 'Владеет навыками допроса, поддерживает порядок.' },
  { name: 'Сапёр', desc: 'Обезвреживает взрывчатку, знает инженерию.' },
  { name: 'Инженер', desc: 'Чинит технику, строит механизмы и мосты.' },
  { name: 'Робототехник', desc: 'Создаёт и ремонтирует роботов и дронов.' },
  { name: 'Программист', desc: 'Взламывает системы, настраивает софт.' },
  { name: 'Электрик', desc: 'Чинит проводку, даёт свет в бункере.' },
  { name: 'Строитель', desc: 'Укрепляет стены, строит укрытия.' },
  { name: 'Плотник', desc: 'Делает мебель, орудия труда из дерева.' },
  { name: 'Сантехник', desc: 'Чинит трубы, добывает воду.' },
  { name: 'Водитель', desc: 'Управляет любой техникой, знает дороги.' },
  { name: 'Лётчик', desc: 'Управляет самолётом, знает аэронавигацию.' },
  { name: 'Моряк', desc: 'Ориентируется на воде, управляет судном.' },
  { name: 'Космонавт', desc: 'Знает космос, работает в скафандре.' },
  { name: 'Шахтёр', desc: 'Добывает ресурсы, умеет копать тоннели.' },
  { name: 'Геолог', desc: 'Находит руду, воду, определяет породы.' },
  { name: 'Биолог', desc: 'Знает флору и фауну, лечит животных.' },
  { name: 'Химик', desc: 'Создаёт взрывчатку, очищает воду.' },
  { name: 'Учитель', desc: 'Обучает других навыкам, организует.' },
  { name: 'Переводчик', desc: 'Понимает языки, может договариваться.' },
  { name: 'Журналист', desc: 'Узнаёт информацию, ведёт записи.' },
  { name: 'Психиатр', desc: 'Помогает справляться со стрессом и паникой.' },
  { name: 'Ветеринар', desc: 'Лечит животных, знает анатомию.' },
  { name: 'Фермер', desc: 'Выращивает еду, знает урожай.' },
  { name: 'Охотник', desc: 'Отслеживает добычу, стреляет из лука.' },
  { name: 'Рыбак', desc: 'Ловит рыбу, знает водоёмы.' },
  { name: 'Повар', desc: 'Готовит из любой еды, знает специи.' },
  { name: 'Мясник', desc: 'Разделывает туши, добывает мясо.' },
  { name: 'Стюардесса', desc: 'Успокаивает людей, знает сервис.' },
  { name: 'Мать в декрете', desc: 'Ухаживает за детьми, есть грудное молоко.' },
  { name: 'Мастер бокса', desc: 'Владеет ударной техникой, сильный.' },
  { name: 'Стрелок', desc: 'Точно стреляет из любого оружия.' }
];

const bunkerFacts = [
  { text: 'Умеет добывать воду из почвы', desc: 'Находит воду даже в пустыне.' },
  { text: 'Знает склад с оружием', desc: 'Может найти оружие и патроны.' },
  { text: 'Вскрывает любые замки', desc: 'Открывает любые двери и сейфы.' },
  { text: 'Чинит генератор', desc: 'Даёт электричество в бункере.' },
  { text: 'Делает перевязки', desc: 'Лечит раны и остановит кровь.' },
  { text: 'Знает грибы и травы', desc: 'Находит еду или яд.' },
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
  { text: 'Имеет тату на интимном месте', desc: 'Может шокировать или соблазнять.' }
];

const bunkerHobbies = [
  { name: 'Стрельба из лука', desc: 'Охота, защита, меткость.' },
  { name: 'Метание ножей', desc: 'Точное оружие, можно использовать в бою.' },
  { name: 'Игра на гитаре', desc: 'Поднимает дух, успокаивает.' },
  { name: 'Охота', desc: 'Добывает мясо, шкуры.' },
  { name: 'Рыбалка', desc: 'Ловит рыбу в любых водоёмах.' },
  { name: 'Сбор грибов', desc: 'Находит еду или яд.' },
  { name: 'Ловушки на животных', desc: 'Пассивная охота.' },
  { name: 'Ремонт часов', desc: 'Может починить механизмы.' },
  { name: 'Радио', desc: 'Связь с другими группами.' },
  { name: 'Алхимия', desc: 'Создаёт зелья, яды, микстуры.' },
  { name: 'Фотография', desc: 'Фиксация фактов, поиск улик.' },
  { name: 'Вышивание', desc: 'Шитьё, зашивает раны.' },
  { name: 'Скульптура', desc: 'Создаёт орудия из дерева/камня.' },
  { name: 'Паркур', desc: 'Убегает, преодолевает препятствия.' },
  { name: 'Медитация', desc: 'Контролирует панику, стресс.' },
  { name: 'Шахматы', desc: 'Стратегическое мышление.' },
  { name: 'Чтение книг', desc: 'Широкий кругозор, знания.' }
];

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
  { name: 'Вибратор', desc: 'Успокаивает, помогает уснуть.' },
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

const bunkerCharacter = [
  { name: 'Агрессивный', desc: 'Нападает первым, не прощает обид.' },
  { name: 'Миролюбивый', desc: 'Избегает конфликтов, ищет компромиссы.' },
  { name: 'Хитрый', desc: 'Обманывает, манипулирует, просчитывает.' },
  { name: 'Наивный', desc: 'Верит всем, легко обмануть.' },
  { name: 'Циничный', desc: 'Не верит никому, всё обесценивает.' },
  { name: 'Оптимист', desc: 'Видит хорошее даже в плохом.' },
  { name: 'Пессимист', desc: 'Ждёт худшего, всё видит в мрачном свете.' },
  { name: 'Флегматик', desc: 'Спокойный, медленный, невозмутимый.' },
  { name: 'Холерик', desc: 'Вспыльчивый, эмоциональный, активный.' },
  { name: 'Щедрый', desc: 'Делится всем, не жалеет для других.' },
  { name: 'Жадный', desc: 'Ничего не отдаёт, копит для себя.' },
  { name: 'Скромный', desc: 'Не выпячивает себя, стесняется.' },
  { name: 'Нарцисс', desc: 'Считает себя лучше всех, любит себя.' },
  { name: 'Эгоист', desc: 'Думает только о своей выгоде.' },
  { name: 'Лживый', desc: 'Постоянно врёт, не говорит правду.' },
  { name: 'Честный', desc: 'Всегда говорит правду, даже если это больно.' },
  { name: 'Верный', desc: 'Предан друзьям, не предаёт.' },
  { name: 'Трусливый', desc: 'Боится опасности, избегает риска.' },
  { name: 'Смелый', desc: 'Не боится опасности, идёт вперёд.' },
  { name: 'Добрый', desc: 'Помогает другим, заботится о слабых.' },
  { name: 'Жестокий', desc: 'Не жалеет других, может причинять боль.' }
];

const bunkerPhobias = [
  { name: 'Пауки', desc: 'Боится пауков, впадает в панику.' },
  { name: 'Клаустрофобия', desc: 'Боится закрытых пространств.' },
  { name: 'Женщины', desc: 'Боится женщин, избегает контакта.' },
  { name: 'Огонь', desc: 'Боится огня, не может подойти к костру.' },
  { name: 'Вода', desc: 'Боится воды, не умеет плавать.' },
  { name: 'Люди', desc: 'Боится людей, избегает общества.' },
  { name: 'Животные', desc: 'Боится животных, даже домашних.' },
  { name: 'Маньяки', desc: 'Боится маньяков, постоянно оглядывается.' },
  { name: 'Косметика', desc: 'Боится косметики, считает её ядом.' },
  { name: 'Высота', desc: 'Боится высоты, не может смотреть вниз.' },
  { name: 'Змеи', desc: 'Боится змей, впадает в ступор.' },
  { name: 'Темнота', desc: 'Боится темноты, включает свет.' }
];

const bunkerConditions = [
  { name: 'Можешь поменяться ЛЮБОЙ картой с любым игроком', desc: 'Обмен картами (кроме условия).' },
  { name: 'Если тебя выгонят — выбери игрока, ему +30 лет', desc: 'Может стать старше 110.' },
  { name: 'Если тебя выгонят — забери ЛЮБУЮ карту у любого', desc: 'Игрок остаётся без карты.' },
  { name: 'Все голосуют заново, тебя НЕЛЬЗЯ выгнать', desc: 'Защита от изгнания в этом раунде.' },
  { name: 'Твой голос считается за 2', desc: 'Двойная сила голоса.' },
  { name: 'Забери у любого 15 лет (случайно)', desc: 'Может сработать, а может нет.' },
  { name: 'Человек слева голосует против себя в следующем раунде', desc: 'Принудительное голосование.' },
  { name: 'Если тебя изгнали — все противники получают +1 голос', desc: 'Месть изгнанного.' },
  { name: 'Ты можешь украсть одну карту у любого игрока', desc: 'Воровство карты.' },
  { name: 'Если ты выгнан — забираешь с собой одного игрока', desc: 'Уводит с собой.' }
];

// ============================================================
// ГЕНЕРАЦИЯ БУНКЕРА
// ============================================================

function generateBunkerSet() {
  const prof = random(professions);
  const fact = random(bunkerFacts);
  const hobby = random(bunkerHobbies);
  const baggage = random(bunkerBaggage);
  const health = random(bunkerHealth);
  const character = random(bunkerCharacter);
  const phobia = random(bunkerPhobias);

  const cards = [
    { title: 'Профессия', value: prof.name, desc: prof.desc },
    { title: 'Возраст', value: `${random(ages)} лет`, desc: 'Влияет на здоровье и опыт.' },
    { title: 'Факт', value: fact.text, desc: fact.desc },
    { title: 'Хобби', value: hobby.name, desc: hobby.desc },
    { title: 'Багаж', value: baggage.name, desc: baggage.desc },
    { title: 'Здоровье', value: health.name, desc: health.desc },
    { title: 'Характер', value: character.name, desc: character.desc },
    { title: 'Фобия', value: phobia.name, desc: phobia.desc }
  ];

  if (Math.random() < 0.4) {
    const condition = random(bunkerConditions);
    cards.push({ title: '⚡ Условие', value: condition.name, desc: condition.desc });
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
    { 
      item: 'Еда', 
      min: 0, max: 100, 
      desc: 'Можно обменять на голос или использовать для выживания.',
      effect: 'Если еды > 50, все игроки получают +1 защиту от голосования.'
    },
    { 
      item: 'Вода', 
      min: 0, max: 100, 
      desc: 'Нужна для питья. Если воды нет — все теряют по 1 карте здоровья.',
      effect: 'Если воды < 10, каждый раунд случайный игрок теряет 1 карту.'
    },
    { 
      item: 'Аптечка', 
      min: 0, max: 5, 
      desc: 'Лечит одну болезнь у любого игрока.',
      effect: 'Можно использовать, чтобы спасти игрока от изгнания.'
    },
    { 
      item: 'Инструменты', 
      min: 0, max: 20, 
      desc: 'Чинят генератор, укрепляют стены.',
      effect: 'Если инструментов > 10, стены бункера не разрушаются при эпидемии.'
    },
    { 
      item: 'Книги', 
      min: 0, max: 10, 
      desc: 'Дают знания: можно узнать слабость любого игрока.',
      effect: 'Одна книга = одна скрытая карта другого игрока.'
    },
    { 
      item: 'Дети в инкубаторах', 
      min: 0, max: 3, 
      desc: 'Будущее человечества. Если они погибают — все проигрывают.',
      effect: 'Если детей > 0, все игроки обязаны голосовать за их защиту.'
    },
    { 
      item: 'Топливо', 
      min: 0, max: 20, 
      desc: 'Можно сбежать из бункера.',
      effect: 'Если топлива > 10, можно покинуть бункер и выиграть.'
    },
    { 
      item: 'Патроны', 
      min: 0, max: 30, 
      desc: 'Усиливают карту «Ружьё».',
      effect: 'Каждые 10 патронов дают +1 голос против любого игрока.'
    },
    { 
      item: 'Золото', 
      min: 0, max: 50, 
      desc: 'Бесполезно, но можно обменять на голос.',
      effect: 'Можно купить защиту от изгнания за 20 золота.'
    }
  ];

  const content = contents.map(c => ({
    item: c.item,
    amount: Math.floor(Math.random() * (c.max - c.min + 1)) + c.min,
    desc: c.desc,
    effect: c.effect
  }));

  res.json(content);
});

// ============================================================
// МАФИЯ — РАСШИРЕННЫЕ РОЛИ
// ============================================================

function generateMafiaRoles(playerCount) {
  let roles = [];

  const mafiaCount = Math.min(Math.floor(playerCount / 3), 4);
  const hasDon = playerCount >= 6;
  const hasDoctor = playerCount >= 4;
  const hasSheriff = playerCount >= 3;
  const hasWhore = playerCount >= 5;

  for (let i = 0; i < mafiaCount; i++) {
    if (hasDon && i === 0) {
      roles.push('Дон мафии');
    } else {
      roles.push('Мафия');
    }
  }

  if (hasSheriff) roles.push('Шериф');
  if (hasDoctor) roles.push('Доктор');
  if (hasWhore) roles.push('Шлюха');

  while (roles.length < playerCount) {
    roles.push('Мирный');
  }

  return roles.sort(() => Math.random() - 0.5);
}

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

const spyLocations = [
  'Военный бункер', 'Заброшенная станция', 'Космический корабль',
  'Подводная лодка', 'Остров сокровищ', 'Город-призрак',
  'Полярная станция', 'Джунгли', 'Пустыня', 'Гора Эверест'
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
    const role = room.roles[idx];
    if (role !== 'Мафия' && role !== 'Дон мафии') return;

    room.nightVotes[socket.id] = targetPlayerName;
    io.to(roomCode).emit('nightVoteUpdate', { votes: room.nightVotes });

    const mafiaPlayers = room.players.filter((p, i) => room.roles[i] === 'Мафия' || room.roles[i] === 'Дон мафии');
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
        const aliveRoles = room.players.filter((p, i) => room.alive[i]).map((p) => room.roles[room.players.indexOf(p)]);
        const mafiaAlive = aliveRoles.filter(r => r === 'Мафия' || r === 'Дон мафии').length;
        const civiliansAlive = aliveRoles.filter(r => r !== 'Мафия' && r !== 'Дон мафии').length;
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
// ПРАВДА ИЛИ ДЕЙСТВИЕ (ТОЛЬКО ТИП, ЗАДАНИЕ ПО КНОПКЕ)
// ============================================================

const truthQuestions = [
  'Ты когда-нибудь врал родителям?',
  'Ты боишься темноты?',
  'Ты когда-нибудь подглядывал за кем-то?',
  'Ты когда-нибудь воровал?',
  'Ты когда-нибудь обманывал в игре?',
  'Ты когда-нибудь ревновал?',
  'Ты когда-нибудь писал стихи?',
  'Ты боишься пауков?',
  'Ты любишь свою школу?',
  'Ты когда-нибудь плакал из-за фильма?',
  'Ты когда-нибудь целовался?',
  'Ты смотрел порно?',
  'Ты когда-нибудь мастурбировал?',
  'Ты когда-нибудь думал о сексе?',
  'Ты когда-нибудь был в отношениях?',
  'Ты когда-нибудь изменял?',
  'Ты когда-нибудь занимался сексом?',
  'Ты когда-нибудь пробовал алкоголь?',
  'Ты когда-нибудь курил?',
  'Ты когда-нибудь пробовал наркотики?'
];

const dareActions = [
  'Сделай глубокий вдох и выдохни.',
  'Расскажи анекдот.',
  'Сделай 5 приседаний.',
  'Покрутись вокруг себя 3 раза.',
  'Изобрази животное (выбери сам).',
  'Скажи комплимент соседу справа.',
  'Закрой глаза и попытайся угадать, кто говорит.',
  'Скажи скороговорку.',
  'Улыбнись 5 раз подряд.',
  'Сделай 3 отжимания (или столько, сколько сможешь).',
  'Встань и повтори за мной: "Я самый крутой".',
  'Расскажи о своём самом смешном воспоминании.',
  'Нарисуй что-нибудь в воздухе, остальные должны угадать.',
  'Закрой глаза и досчитай до 20.',
  'Прочитай любое стихотворение (или придумай).'
];

const helpQuestions = [
  'Ты когда-нибудь терял важную вещь?',
  'Какой твой любимый цвет?',
  'Ты любишь кошек или собак?',
  'Ты предпочитаешь чай или кофе?',
  'Какой фильм ты смотрел последним?',
  'Ты любишь зиму или лето?',
  'Ты когда-нибудь разбивал что-то случайно?'
];

const helpActions = [
  'Сделай 3 приседания.',
  'Улыбнись и подмигни.',
  'Похлопай в ладоши 5 раз.',
  'Скажи "Привет" соседу.',
  'Встань и сядь обратно.',
  'Сделай комплимент самому себе.',
  'Закрой глаза на 3 секунды.'
];

app.get('/api/truthordare', (req, res) => {
  const roll = Math.floor(Math.random() * 3);
  
  let result;
  if (roll === 0) {
    result = { type: 'truth', message: '❓ Выпала ПРАВДА' };
  } else if (roll === 1) {
    result = { type: 'dare', message: '🎯 Выпало ДЕЙСТВИЕ' };
  } else {
    result = { type: 'skip', message: '⏭️ Скип! Ничего не произошло.' };
  }

  res.json(result);
});

app.get('/api/help', (req, res) => {
  const isTruth = Math.random() < 0.5;
  let help;
  if (isTruth) {
    help = random(helpQuestions);
    res.json({ message: `❓ Правда: ${help}` });
  } else {
    help = random(helpActions);
    res.json({ message: `🎯 Действие: ${help}` });
  }
});

// ============================================================
// ЗАПУСК
// ============================================================

server.listen(PORT, () => {
  console.log(`[PORTAL] Запущен на порту ${PORT}`);
  console.log(`[PORTAL] Игры: Бункер, Мафия (Дон, Шлюха), Шпион, Правда/Действие`);
});