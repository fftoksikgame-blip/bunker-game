const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getUniqueRandom(arr, used = []) {
  const available = arr.filter(item => !used.includes(item));
  if (available.length === 0) return random(arr);
  return random(available);
}

// ============================================================
// ИГРА 1: БУНКЕР
// ============================================================

const ages = [];
for (let i = 18; i <= 110; i++) ages.push(i);

const professions = [
  'Врач', 'Хирург', 'Фармацевт', 'Военный', 'Пожарный',
  'Полицейский', 'Сапёр', 'Инженер', 'Робототехник', 'Программист',
  'Электрик', 'Строитель', 'Плотник', 'Водитель', 'Лётчик',
  'Моряк', 'Космонавт', 'Шахтёр', 'Геолог', 'Биолог',
  'Химик', 'Учитель', 'Переводчик', 'Журналист', 'Психиатр',
  'Ветеринар', 'Фермер', 'Охотник', 'Рыбак', 'Повар',
  'Мясник', 'Стюардесса', 'Мать в декрете', 'Мастер бокса', 'Стрелок'
];

const bunkerFacts = [
  'Умеет добывать воду', 'Знает склад с оружием', 'Вскрывает замки',
  'Чинит генератор', 'Делает перевязки', 'Знает грибы и травы',
  'Разжигает огонь', 'Управляет дроном', 'Знает азбуку Морзе',
  'Делает взрывчатку', 'Маскируется', 'Строит укрытия',
  'Был в тюрьме', 'Работал шпионом', 'Подделывает документы',
  'Состоит в банде', 'Убивал человека', 'Торговал оружием',
  'Вампир', 'Очень хочет секса', 'Имеет тату на интимном месте'
];

const bunkerHobbies = [
  'Стрельба из лука', 'Метание ножей', 'Игра на гитаре',
  'Охота', 'Рыбалка', 'Сбор грибов', 'Ловушки', 'Ремонт часов',
  'Радио', 'Алхимия', 'Фотография', 'Вышивание', 'Скульптура',
  'Паркур', 'Медитация', 'Шахматы', 'Чтение книг'
];

const bunkerBaggage = [
  'Аптечка', 'Бомба', 'Ружьё', 'Патроны', 'Нож', 'Лук',
  'Генератор', 'Чемодан с вещами', 'Наркотики', 'Дрон',
  'Вибратор (на батарейках)', 'Презервативы (коробка)'
];

const bunkerHealth = [
  'Слеп на 1 глаз', 'Рак 4 степени', 'Нет руки', 'Астматик',
  'Аллергик', 'Наркозависимый', 'Диабет', 'Глухой',
  'Немой', 'Геморрой', 'Глисты', 'Беременна', 'Амнезия',
  'Вечно голодный', 'Суицидные мысли', 'Идеально здоров',
  'Карлик', 'Склероз', 'Бесплодие', '2 сердца', '4 почки'
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

function generateBunkerSet() {
  const used = [];
  const pick = (arr) => {
    const val = getUniqueRandom(arr, used);
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

// ============================================================
// ИГРА 2: МАФИЯ
// ============================================================

const mafiaRoles = [
  'Мирный житель', 'Мирный житель', 'Мирный житель',
  'Мафия', 'Мафия', 'Шериф', 'Доктор'
];

function generateMafiaSet() {
  const shuffled = [...mafiaRoles].sort(() => Math.random() - 0.5);
  return shuffled.map((role, i) => ({
    title: `Игрок ${i + 1}`,
    value: role
  }));
}

// ============================================================
// ИГРА 3: ЗОМБИ-АПОКАЛИПСИС
// ============================================================

const zombieResources = [
  'Еда', 'Вода', 'Аптечка', 'Оружие', 'Инструменты',
  'Патроны', 'Бензин', 'Лопата', 'Палатка', 'Фонарь'
];

function generateZombieSet() {
  const used = [];
  const pick = (arr) => {
    const val = getUniqueRandom(arr, used);
    used.push(val);
    return val;
  };
  const resources = [];
  for (let i = 0; i < 5; i++) {
    resources.push({
      title: 'Ресурс',
      value: `${pick(zombieResources)}: ${Math.floor(Math.random() * 20) + 1}`
    });
  }
  return resources;
}

// ============================================================
// API
// ============================================================

app.get('/api/game/:mode', (req, res) => {
  const mode = req.params.mode;
  let data = [];
  switch (mode) {
    case 'bunker':
      data = generateBunkerSet();
      break;
    case 'mafia':
      data = generateMafiaSet();
      break;
    case 'zombie':
      data = generateZombieSet();
      break;
    default:
      data = generateBunkerSet();
  }
  res.json(data);
});

app.get('/api/catastrophe', (req, res) => {
  const catastrophes = [
    'Землетрясение', 'Эпидемия', 'Астероид', 'Вампиры',
    'Зомби-апокалипсис', 'Инопланетяне', 'Злые животные',
    'Роботы', 'Пожары', 'Вулкан', 'Цунами'
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PORTAL] Запущен на порту ${PORT}`);
  console.log(`[PORTAL] Игры: Бункер, Мафия, Зомби`);
});