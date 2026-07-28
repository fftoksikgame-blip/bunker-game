const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;

const BUNKER = {
  professions: [
    { name: 'Врач', desc: 'Лечит болезни, делает операции, спасает жизни.' },
    { name: 'Хирург', desc: 'Проводит сложные операции, удаляет аппендицит.' },
    { name: 'Фармацевт', desc: 'Знает лекарства, создает микстуры и яды.' },
    { name: 'Военный', desc: 'Умеет обращаться с оружием, стратег.' },
    { name: 'Пожарный', desc: 'Тушит пожары, работает в дыму, спасает людей.' },
    { name: 'Полицейский', desc: 'Владеет навыками допроса, поддерживает порядок.' },
    { name: 'Сапер', desc: 'Обезвреживает взрывчатку, знает инженерию.' },
    { name: 'Инженер', desc: 'Чинит технику, строит механизмы и мосты.' },
    { name: 'Робототехник', desc: 'Создает и ремонтирует роботов и дронов.' },
    { name: 'Программист', desc: 'Взламывает системы, настраивает софт.' },
    { name: 'Электрик', desc: 'Чинит проводку, дает свет в бункере.' },
    { name: 'Строитель', desc: 'Укрепляет стены, строит укрытия.' },
    { name: 'Плотник', desc: 'Делает мебель, орудия труда из дерева.' },
    { name: 'Сантехник', desc: 'Чинит трубы, добывает воду.' },
    { name: 'Водитель', desc: 'Управляет любой техникой, знает дороги.' },
    { name: 'Летчик', desc: 'Управляет самолетом, знает аэронавигацию.' },
    { name: 'Моряк', desc: 'Ориентируется на воде, управляет судном.' },
    { name: 'Космонавт', desc: 'Знает космос, работает в скафандре.' },
    { name: 'Шахтер', desc: 'Добывает ресурсы, умеет копать тоннели.' },
    { name: 'Геолог', desc: 'Находит руду, воду, определяет породы.' },
    { name: 'Биолог', desc: 'Знает флору и фауну, лечит животных.' },
    { name: 'Химик', desc: 'Создает взрывчатку, очищает воду.' },
    { name: 'Учитель', desc: 'Обучает других навыкам, организует.' },
    { name: 'Переводчик', desc: 'Понимает языки, может договариваться.' },
    { name: 'Журналист', desc: 'Узнает информацию, ведет записи.' },
    { name: 'Психиатр', desc: 'Помогает справляться со стрессом и паникой.' },
    { name: 'Ветеринар', desc: 'Лечит животных, знает анатомию.' },
    { name: 'Фермер', desc: 'Выращивает еду, знает урожай.' },
    { name: 'Охотник', desc: 'Отслеживает добычу, стреляет из лука.' },
    { name: 'Рыбак', desc: 'Ловит рыбу, знает водоемы.' },
    { name: 'Повар', desc: 'Готовит из любой еды, знает специи.' },
    { name: 'Мясник', desc: 'Разделывает туши, добывает мясо.' },
    { name: 'Стюардесса', desc: 'Успокаивает людей, знает сервис.' },
    { name: 'Мать в декрете', desc: 'Ухаживает за детьми, есть грудное молоко.' },
    { name: 'Мастер бокса', desc: 'Владеет ударной техникой, сильный.' },
    { name: 'Стрелок', desc: 'Точно стреляет из любого оружия.' }
  ],
  facts: [
    { text: 'Умеет добывать воду из почвы', desc: 'Находит воду даже в пустыне.' },
    { text: 'Знает склад с оружием', desc: 'Может найти оружие и патроны.' },
    { text: 'Вскрывает любые замки', desc: 'Открывает любые двери и сейфы.' },
    { text: 'Чинит генератор', desc: 'Дает электричество в бункере.' },
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
    { text: 'Состоит в банде', desc: 'Есть связи на черном рынке.' },
    { text: 'Убивал человека', desc: 'Способен на жестокость.' },
    { text: 'Торговал оружием', desc: 'Достанет любой ствол.' },
    { text: 'Вампир', desc: 'Пьет кровь, боится солнца.' },
    { text: 'Имеет тату на интимном месте', desc: 'Может шокировать или соблазнять.' }
  ],
  hobbies: [
    { name: 'Стрельба из лука', desc: 'Охота, защита, меткость.' },
    { name: 'Метание ножей', desc: 'Точное оружие, можно использовать в бою.' },
    { name: 'Игра на гитаре', desc: 'Поднимает дух, успокаивает.' },
    { name: 'Охота', desc: 'Добывает мясо, шкуры.' },
    { name: 'Рыбалка', desc: 'Ловит рыбу в любых водоемах.' },
    { name: 'Сбор грибов', desc: 'Находит еду или яд.' },
    { name: 'Ловушки на животных', desc: 'Пассивная охота.' },
    { name: 'Ремонт часов', desc: 'Может починить механизмы.' },
    { name: 'Радио', desc: 'Связь с другими группами.' },
    { name: 'Алхимия', desc: 'Создает зелья, яды, микстуры.' },
    { name: 'Фотография', desc: 'Фиксация фактов, поиск улик.' },
    { name: 'Вышивание', desc: 'Шитье, зашивает раны.' },
    { name: 'Скульптура', desc: 'Создает орудия из дерева/камня.' },
    { name: 'Паркур', desc: 'Убегает, преодолевает препятствия.' },
    { name: 'Медитация', desc: 'Контролирует панику, стресс.' },
    { name: 'Шахматы', desc: 'Стратегическое мышление.' },
    { name: 'Чтение книг', desc: 'Широкий кругозор, знания.' }
  ],
  baggage: [
    { name: 'Аптечка', desc: 'Лечит болезни и раны (1 раз).' },
    { name: 'Бомба', desc: 'Разрушает все вокруг (можно взорвать стену).' },
    { name: 'Ружье', desc: 'Мощное оружие, 3 патрона.' },
    { name: 'Патроны', desc: 'Для ружья или пистолета.' },
    { name: 'Нож', desc: 'Режет, строгает, метает.' },
    { name: 'Лук', desc: 'Охота, защита, бесшумный.' },
    { name: 'Генератор', desc: 'Дает свет и энергию.' },
    { name: 'Чемодан с вещами', desc: 'Одежда, инструменты, вещи.' },
    { name: 'Наркотики', desc: 'Обезболивание, но зависимость.' },
    { name: 'Дрон', desc: 'Разведка, съемка.' },
    { name: 'Вибратор', desc: 'Успокаивает, помогает уснуть.' },
    { name: 'Презервативы', desc: 'Защита от болезней.' },
    { name: 'Смазка', desc: 'Для механизмов или интима.' },
    { name: 'Порножурнал', desc: 'Поднимает настроение.' },
    { name: 'Сухпаек', desc: 'Еда на 5 дней.' },
    { name: 'Фляга с водой', desc: '5 литров воды.' },
    { name: 'Фильтр для воды', desc: 'Очищает любую воду.' },
    { name: 'Набор отмычек', desc: 'Открывает любые замки.' },
    { name: 'Компас и карта', desc: 'Ориентирование на местности.' },
    { name: 'Палатка', desc: 'Укрытие от дождя и холода.' }
  ],
  health: [
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
  ],
  character: [
    { name: 'Агрессивный', desc: 'Нападает первым, не прощает обид.' },
    { name: 'Миролюбивый', desc: 'Избегает конфликтов, ищет компромиссы.' },
    { name: 'Хитрый', desc: 'Обманывает, манипулирует, просчитывает.' },
    { name: 'Наивный', desc: 'Верит всем, легко обмануть.' },
    { name: 'Циничный', desc: 'Не верит никому, все обесценивает.' },
    { name: 'Оптимист', desc: 'Видит хорошее даже в плохом.' },
    { name: 'Пессимист', desc: 'Ждет худшего, все видит в мрачном свете.' },
    { name: 'Флегматик', desc: 'Спокойный, медленный, невозмутимый.' },
    { name: 'Холерик', desc: 'Вспыльчивый, эмоциональный, активный.' },
    { name: 'Щедрый', desc: 'Делится всем, не жалеет для других.' },
    { name: 'Жадный', desc: 'Ничего не отдает, копит для себя.' },
    { name: 'Скромный', desc: 'Не выпячивает себя, стесняется.' },
    { name: 'Нарцисс', desc: 'Считает себя лучше всех, любит себя.' },
    { name: 'Эгоист', desc: 'Думает только о своей выгоде.' },
    { name: 'Лживый', desc: 'Постоянно врет, не говорит правду.' },
    { name: 'Честный', desc: 'Всегда говорит правду, даже если это больно.' },
    { name: 'Верный', desc: 'Предан друзьям, не предает.' },
    { name: 'Трусливый', desc: 'Боится опасности, избегает риска.' },
    { name: 'Смелый', desc: 'Не боится опасности, идет вперед.' },
    { name: 'Добрый', desc: 'Помогает другим, заботится о слабых.' },
    { name: 'Жестокий', desc: 'Не жалеет других, может причинять боль.' }
  ],
  phobias: [
    { name: 'Пауки', desc: 'Боится пауков, впадает в панику.' },
    { name: 'Клаустрофобия', desc: 'Боится закрытых пространств.' },
    { name: 'Женщины', desc: 'Боится женщин, избегает контакта.' },
    { name: 'Огонь', desc: 'Боится огня, не может подойти к костру.' },
    { name: 'Вода', desc: 'Боится воды, не умеет плавать.' },
    { name: 'Люди', desc: 'Боится людей, избегает общества.' },
    { name: 'Животные', desc: 'Боится животных, даже домашних.' },
    { name: 'Маньяки', desc: 'Боится маньяков, постоянно оглядывается.' },
    { name: 'Косметика', desc: 'Боится косметики, считает ее ядом.' },
    { name: 'Высота', desc: 'Боится высоты, не может смотреть вниз.' },
    { name: 'Змеи', desc: 'Боится змей, впадает в ступор.' },
    { name: 'Темнота', desc: 'Боится темноты, включает свет.' }
  ],
  conditions: [
    { name: 'Можешь поменяться ЛЮБОЙ картой с любым игроком', desc: 'Обмен картами (кроме условия).' },
    { name: 'Если тебя выгонят - выбери игрока, ему +30 лет', desc: 'Может стать старше 110.' },
    { name: 'Если тебя выгонят - забери ЛЮБУЮ карту у любого', desc: 'Игрок остается без карты.' },
    { name: 'Все голосуют заново, тебя НЕЛЬЗЯ выгнать', desc: 'Защита от изгнания в этом раунде.' },
    { name: 'Твой голос считается за 2', desc: 'Двойная сила голоса.' },
    { name: 'Забери у любого 15 лет (случайно)', desc: 'Может сработать, а может нет.' },
    { name: 'Человек слева голосует против себя в следующем раунде', desc: 'Принудительное голосование.' },
    { name: 'Если тебя изгнали - все противники получают +1 голос', desc: 'Месть изгнанного.' },
    { name: 'Ты можешь украсть одну карту у любого игрока', desc: 'Воровство карты.' },
    { name: 'Если ты выгнан - забираешь с собой одного игрока', desc: 'Уводит с собой.' }
  ],
  catastrophes: [
    'Ядерная война - радиация, разрушенные города',
    'Зомби-апокалипсис - вирус превращает людей в зомби',
    'Инопланетное вторжение - пришельцы захватывают Землю',
    'Супервулкан - вулканический зимний период',
    'Падение астероида - ударная волна, пыль закрыла солнце',
    'Глобальная эпидемия - смертельный вирус убивает 90% населения',
    'Восстание ИИ - роботы захватили контроль',
    'Климатическая катастрофа - наводнения, ураганы, жара',
    'Вампирская чума - вампиры захватили мир',
    'Химическая война - отравленная атмосфера'
  ],
  bunkerItems: [
    { item: 'Еда', min: 10, max: 100, desc: 'Провиант на выживание.', effect: 'При >50 - все получают +1 защиту.' },
    { item: 'Вода', min: 5, max: 80, desc: 'Питьевая вода.', effect: 'При <10 - случайный игрок теряет карту.' },
    { item: 'Аптечки', min: 0, max: 5, desc: 'Лечение болезней.', effect: 'Спасает от изгнания 1 раз.' },
    { item: 'Инструменты', min: 0, max: 20, desc: 'Ремонт и строительство.', effect: 'При >10 - стены не разрушаются.' },
    { item: 'Книги', min: 0, max: 10, desc: 'Знания и развлечения.', effect: '1 книга = 1 скрытая карта чужого.' },
    { item: 'Топливо', min: 0, max: 20, desc: 'Для генератора и транспорта.', effect: 'При >10 - можно покинуть бункер.' },
    { item: 'Патроны', min: 0, max: 30, desc: 'Для оружия.', effect: 'Каждые 10 = +1 голос.' },
    { item: 'Золото', min: 0, max: 50, desc: 'Бесполезно, но ценно.', effect: '20 золота = защита от изгнания.' }
  ]
};

const SPY_LOCATIONS = [
  'Военный бункер', 'Заброшенная станция', 'Космический корабль',
  'Подводная лодка', 'Остров сокровищ', 'Город-призрак',
  'Полярная станция', 'Джунгли', 'Пустыня', 'Гора Эверест',
  'Казино', 'Больница', 'Университет', 'Театр', 'Самолет',
  'Пиратский корабль', 'Средневековый замок', 'Субмарина',
  'Орбитальная станция', 'Секретная лаборатория'
];

const TRUTH_QUESTIONS = [
  'Ты когда-нибудь врал родителям?',
  'Ты боишься темноты?',
  'Ты когда-нибудь подглядывал за кем-то?',
  'Ты когда-нибудь воровал?',
  'Ты когда-нибудь обманывал в игре?',
  'Ты когда-нибудь ревновал?',
  'Ты когда-нибудь писал стихи?',
  'Ты боишься пауков?',
  'Ты любишь свою школу/работу?',
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
  'Ты когда-нибудь пробовал наркотики?',
  'Какой твой самый большой страх?',
  'Ты когда-нибудь фантазировал о ком-то из этой комнаты?',
  'Какой самый постыдный поступок в твоей жизни?',
  'Ты когда-нибудь подслушивал чужие разговоры?',
  'Какой у тебя самый странный фетиш?',
  'Ты когда-нибудь отправлял интимные фото?',
  'Какой твой самый большой секрет?',
  'Ты когда-нибудь влюблялся в лучшего друга?',
  'Какая твоя самая большая неудача в постели?',
  'Ты когда-нибудь делал что-то незаконное?'
];

const DARE_ACTIONS = [
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
  'Расскажи о своем самом смешном воспоминании.',
  'Нарисуй что-нибудь в воздухе, остальные должны угадать.',
  'Закрой глаза и досчитай до 20.',
  'Прочитай любое стихотворение (или придумай).',
  'Сделай массаж плеч соседу слева.',
  'Спой песню без слов (только гудением).',
  'Изобрази известного человека, пусть угадают.',
  'Скажи "Я люблю тебя" каждому в комнате.',
  'Съешь что-нибудь без рук.',
  'Станцуй под воображаемую музыку 15 секунд.',
  'Позвони кому-то и скажи "Я знаю твой секрет".',
  'Сделай 10 прыжков на месте.',
  'Покажи последнее фото в галерее.',
  'Сделай смешную гримасу и держи 10 секунд.'
];

const HELP_QUESTIONS = [
  'Ты когда-нибудь терял важную вещь?',
  'Какой твой любимый цвет?',
  'Ты любишь кошек или собак?',
  'Ты предпочитаешь чай или кофе?',
  'Какой фильм ты смотрел последним?',
  'Ты любишь зиму или лето?',
  'Ты когда-нибудь разбивал что-то случайно?',
  'Какая твоя любимая еда?',
  'Ты умеешь играть на музыкальном инструменте?',
  'Какой твой любимый супергерой?'
];

const HELP_ACTIONS = [
  'Сделай 3 приседания.',
  'Улыбнись и подмигни.',
  'Похлопай в ладоши 5 раз.',
  'Скажи "Привет" соседу.',
  'Встань и сядь обратно.',
  'Сделай комплимент самому себе.',
  'Закрой глаза на 3 секунды.',
  'Потяни руки вверх.',
  'Покажи язык.',
  'Похвали кого-то в комнате.'
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.playerRooms = new Map();
  }

  createRoom(gameType, hostName, hostId) {
    const code = generateId();
    const room = {
      code,
      gameType,
      players: new Map(),
      state: 'lobby',
      hostId,
      createdAt: Date.now(),
      gameData: null,
      chat: [],
      settings: {
        maxPlayers: gameType === 'bunker' ? 12 : (gameType === 'mafia' ? 10 : 8),
        roundTime: gameType === 'mafia' ? 60 : 120
      }
    };
    room.players.set(hostId, {
      id: hostId,
      name: hostName,
      isHost: true,
      connected: true,
      ready: false
    });
    this.rooms.set(code, room);
    this.playerRooms.set(hostId, code);
    return room;
  }

  joinRoom(code, playerName, playerId) {
    const room = this.rooms.get(code);
    if (!room) return { error: 'Комната не найдена' };
    if (room.state !== 'lobby') return { error: 'Игра уже началась' };
    if (room.players.size >= room.settings.maxPlayers) return { error: 'Комната заполнена' };
    for (const p of room.players.values()) {
      if (p.name.toLowerCase() === playerName.toLowerCase()) return { error: 'Имя занято' };
    }
    room.players.set(playerId, {
      id: playerId,
      name: playerName,
      isHost: false,
      connected: true,
      ready: false
    });
    this.playerRooms.set(playerId, code);
    return { room };
  }

  leaveRoom(playerId) {
    const code = this.playerRooms.get(playerId);
    if (!code) return null;
    const room = this.rooms.get(code);
    if (!room) return null;
    const wasHost = room.hostId === playerId;
    room.players.delete(playerId);
    this.playerRooms.delete(playerId);
    if (room.players.size === 0) {
      this.rooms.delete(code);
      return null;
    }
    if (wasHost) {
      const nextHost = Array.from(room.players.values())[0];
      nextHost.isHost = true;
      room.hostId = nextHost.id;
    }
    return room;
  }

  getRoomByPlayer(playerId) {
    const code = this.playerRooms.get(playerId);
    return code ? this.rooms.get(code) : null;
  }

  getPlayerRoomCode(playerId) {
    return this.playerRooms.get(playerId) || null;
  }

  broadcast(roomCode, event, data) {
    io.to(roomCode).emit(event, data);
  }
}

const roomManager = new RoomManager();

// ========================== MAFIA GAME ==========================

class MafiaGame {
  constructor(room) {
    this.room = room;
    this.phase = 'night';
    this.round = 1;
    this.alive = new Map();
    this.roles = new Map();
    this.nightActions = new Map();
    this.dayVotes = new Map();
    this.votedInDay = new Set();
    this.log = [];
    this.timers = {};
    this.mafiaTarget = null;
  }

  start() {
    const players = Array.from(this.room.players.values());
    const count = players.length;
    let roles = [];
    const mafiaCount = Math.max(1, Math.floor(count / 3));
    const hasDon = count >= 6;
    const hasSheriff = count >= 4;
    const hasDoctor = count >= 5;
    const hasWhore = count >= 6;

    for (let i = 0; i < mafiaCount; i++) roles.push(i === 0 && hasDon ? 'don' : 'mafia');
    if (hasSheriff) roles.push('sheriff');
    if (hasDoctor) roles.push('doctor');
    if (hasWhore) roles.push('whore');
    while (roles.length < count) roles.push('civilian');
    roles = shuffle(roles);

    players.forEach((p, i) => {
      this.roles.set(p.id, roles[i]);
      this.alive.set(p.id, true);
    });

    this.log.push('🌙 Наступает ночь... Мафия просыпается.');
    this.startNight();
  }

  startNight() {
    this.phase = 'night';
    this.nightActions.clear();
    this.mafiaTarget = null;

    const aliveList = this.getAliveList();
    const roleMap = {};
    this.roles.forEach((role, id) => {
      roleMap[id] = { role: this.translateRole(role), team: (role === 'mafia' || role === 'don') ? 'mafia' : 'civilian' };
    });

    roomManager.broadcast(this.room.code, 'mafia:phase', {
      phase: 'night',
      round: this.round,
      log: this.log,
      alive: aliveList,
      roles: roleMap
    });

    this.room.players.forEach(p => {
      const myRole = this.roles.get(p.id);
      const isMafia = myRole === 'mafia' || myRole === 'don';
      const mafiaPartners = isMafia ? Array.from(this.roles.entries())
        .filter(([id, r]) => (r === 'mafia' || r === 'don') && id !== p.id)
        .map(([id]) => this.getPlayerName(id)) : [];

      io.to(p.id).emit('mafia:role', {
        role: this.translateRole(myRole),
        isMafia,
        partners: mafiaPartners,
        description: this.getRoleDescription(myRole)
      });
    });

    this.timers.night = setTimeout(() => this.processNight(), 45000);
  }

  processNight() {
    clearTimeout(this.timers.night);
    const actions = Array.from(this.nightActions.values());
    const mafiaVotes = actions.filter(a => a.role === 'mafia' || a.role === 'don');
    const doctorAction = actions.find(a => a.role === 'doctor');
    const whoreAction = actions.find(a => a.role === 'whore');
    const sheriffAction = actions.find(a => a.role === 'sheriff');

    let mafiaTarget = null;
    if (mafiaVotes.length > 0) {
      const targets = {};
      mafiaVotes.forEach(v => { targets[v.target] = (targets[v.target] || 0) + 1; });
      const sorted = Object.entries(targets).sort((a, b) => b[1] - a[1]);
      mafiaTarget = sorted[0][0];
    }
    this.mafiaTarget = mafiaTarget;

    let killed = null;
    let savedByDoctor = false;
    let blockedByWhore = false;

    if (whoreAction && whoreAction.target === mafiaTarget) {
      blockedByWhore = true;
      this.log.push(`💋 Шлюха спасла ${this.getPlayerName(mafiaTarget)} от мафии`);
    }

    if (doctorAction && doctorAction.target === mafiaTarget && !blockedByWhore) {
      savedByDoctor = true;
      this.log.push(`💉 Доктор спас ${this.getPlayerName(mafiaTarget)}`);
    }

    if (sheriffAction) {
      const targetRole = this.roles.get(sheriffAction.target);
      const isMafia = targetRole === 'mafia' || targetRole === 'don';
      const sheriffId = Array.from(this.roles.entries()).find(([_, r]) => r === 'sheriff')?.[0];
      if (sheriffId) {
        io.to(sheriffId).emit('mafia:sheriffResult', {
          target: this.getPlayerName(sheriffAction.target),
          isMafia,
          message: isMafia ? '🔴 Это мафия!' : '🟢 Это мирный житель.'
        });
      }
    }

    if (mafiaTarget && !savedByDoctor && !blockedByWhore) {
      killed = mafiaTarget;
      this.alive.set(killed, false);
      this.log.push(`💀 ${this.getPlayerName(killed)} был убит мафией этой ночью`);
    }

    if (this.checkWin()) return;
    this.startDay(killed);
  }

  startDay(killed) {
    this.phase = 'day';
    this.dayVotes.clear();
    this.votedInDay.clear();

    this.log.push('☀️ Наступает день. Город просыпается.');
    if (killed) {
      this.log.push(`⚰️ Этой ночью погиб ${this.getPlayerName(killed)}`);
    } else {
      this.log.push('🌙 Эта ночь прошла спокойно — никто не погиб.');
    }

    roomManager.broadcast(this.room.code, 'mafia:phase', {
      phase: 'day',
      round: this.round,
      log: this.log,
      alive: this.getAliveList()
    });

    this.timers.day = setTimeout(() => this.processDay(), 90000);
  }

  processDay() {
    clearTimeout(this.timers.day);
    if (this.dayVotes.size === 0) {
      this.log.push('🗳️ Никто не был выгнан — голосов не поступило.');
      this.nextRound();
      return;
    }

    const voteCounts = {};
    this.dayVotes.forEach((target) => { voteCounts[target] = (voteCounts[target] || 0) + 1; });
    const maxVotes = Math.max(...Object.values(voteCounts));
    const candidates = Object.entries(voteCounts).filter(([_, c]) => c === maxVotes).map(([id]) => id);

    if (candidates.length === 1) {
      const eliminated = candidates[0];
      this.alive.set(eliminated, false);
      this.log.push(`☀️ ${this.getPlayerName(eliminated)} выгнан голосованием (${maxVotes} голосов)`);
      if (this.checkWin()) return;
    } else {
      this.log.push('🗳️ Голосование не выявило жертвы — ничья.');
    }
    this.nextRound();
  }

  nextRound() {
    this.round++;
    if (this.checkWin()) return;
    this.startNight();
  }

  checkWin() {
    const aliveRoles = Array.from(this.alive.entries()).filter(([_, a]) => a).map(([id]) => this.roles.get(id));
    const mafiaAlive = aliveRoles.filter(r => r === 'mafia' || r === 'don').length;
    const civilianAlive = aliveRoles.filter(r => r !== 'mafia' && r !== 'don').length;

    if (mafiaAlive === 0) {
      this.endGame('civilians', 'Мирные жители победили! Мафия уничтожена.');
      return true;
    }
    if (mafiaAlive >= civilianAlive) {
      this.endGame('mafia', 'Мафия победила! Город захвачен.');
      return true;
    }
    return false;
  }

  endGame(winner, message) {
    this.phase = 'ended';
    clearTimeout(this.timers.night);
    clearTimeout(this.timers.day);
    const roleMap = {};
    this.roles.forEach((role, id) => {
      roleMap[id] = { role: this.translateRole(role), name: this.getPlayerName(id), alive: this.alive.get(id) };
    });
    roomManager.broadcast(this.room.code, 'mafia:end', {
      winner: winner === 'mafia' ? 'Мафия' : 'Мирные жители',
      message,
      roles: roleMap,
      log: this.log
    });
  }

  translateRole(role) {
    const map = { mafia: 'Мафия', don: 'Дон мафии', sheriff: 'Шериф', doctor: 'Доктор', whore: 'Шлюха', civilian: 'Мирный житель' };
    return map[role] || role;
  }

  getRoleDescription(role) {
    const map = {
      mafia: 'Убивай мирных жителей ночью. Действуй скрытно.',
      don: 'Веди мафию. Ты видишь своих сообщников.',
      sheriff: 'Проверяй игроков ночью, чтобы найти мафию.',
      doctor: 'Лечи игроков ночью, спасая их от мафии.',
      whore: 'Блокируй действия игроков ночью.',
      civilian: 'Найди мафию днем и выгони ее голосованием.'
    };
    return map[role] || '';
  }

  getAliveList() {
    return Array.from(this.alive.entries()).filter(([_, a]) => a).map(([id]) => ({ id, name: this.getPlayerName(id) }));
  }

  getPlayerName(id) {
    return this.room.players.get(id)?.name || '???';
  }

  handleNightAction(playerId, targetId) {
    if (!this.alive.get(playerId)) return;
    const role = this.roles.get(playerId);
    if (!role) return;
    if (this.phase !== 'night') return;

    this.nightActions.set(playerId, { role, target: targetId, playerId });

    if (role === 'mafia' || role === 'don') {
      const mafiaIds = Array.from(this.roles.entries()).filter(([_, r]) => r === 'mafia' || r === 'don').map(([id]) => id);
      const mafiaVotes = Array.from(this.nightActions.values())
        .filter(a => a.role === 'mafia' || a.role === 'don')
        .map(a => ({ target: this.getPlayerName(a.target), by: this.getPlayerName(a.playerId) }));
      mafiaIds.forEach(mid => io.to(mid).emit('mafia:mafiaVotes', { votes: mafiaVotes }));
    }

    io.to(playerId).emit('mafia:actionConfirmed', { message: '✅ Действие выполнено' });
  }

  handleDayVote(playerId, targetId) {
    if (!this.alive.get(playerId)) return;
    if (this.phase !== 'day') return;
    if (this.votedInDay.has(playerId)) return;
    if (playerId === targetId) return;

    this.dayVotes.set(playerId, targetId);
    this.votedInDay.add(playerId);

    roomManager.broadcast(this.room.code, 'mafia:voteUpdate', {
      voted: this.votedInDay.size,
      total: this.getAliveList().length,
      votes: Array.from(this.dayVotes.entries()).map(([voter, target]) => ({
        voter: this.getPlayerName(voter),
        target: this.getPlayerName(target)
      }))
    });

    if (this.votedInDay.size >= this.getAliveList().length) {
      clearTimeout(this.timers.day);
      this.processDay();
    }
  }
}

// ========================== SPY GAME ==========================

class SpyGame {
  constructor(room) {
    this.room = room;
    this.location = random(SPY_LOCATIONS);
    this.spyId = null;
    this.round = 1;
    this.phase = 'discussion';
    this.votes = new Map();
    this.voted = new Set();
    this.log = [];
    this.timers = {};
  }

  start() {
    const players = Array.from(this.room.players.values());
    this.spyId = players[Math.floor(Math.random() * players.length)].id;
    this.log.push(`🕵️ Игра началась! Локация засекречена...`);

    const roles = {};
    players.forEach(p => { roles[p.id] = p.id === this.spyId ? 'Шпион' : 'Мирный'; });

    roomManager.broadcast(this.room.code, 'spy:start', {
      location: this.location,
      roles,
      log: this.log,
      round: this.round,
      spyId: this.spyId
    });

    this.room.players.forEach(p => {
      if (p.id !== this.spyId) {
        io.to(p.id).emit('spy:location', { location: this.location });
      } else {
        io.to(p.id).emit('spy:location', { location: null, message: 'Ты шпион! Узнай локацию, задавая вопросы.' });
      }
    });

    this.startRound();
  }

  startRound() {
    this.phase = 'discussion';
    this.votes.clear();
    this.voted.clear();
    this.log.push(`💬 Раунд ${this.round}: Обсуждение началось!`);

    roomManager.broadcast(this.room.code, 'spy:phase', {
      phase: 'discussion',
      log: this.log,
      round: this.round,
      timeLeft: 120
    });

    this.timers.round = setTimeout(() => this.startVoting(), 120000);
  }

  startVoting() {
    this.phase = 'voting';
    this.log.push('🗳️ Началось голосование! Кто шпион?');

    roomManager.broadcast(this.room.code, 'spy:phase', {
      phase: 'voting',
      log: this.log,
      round: this.round,
      timeLeft: 30
    });

    this.timers.voting = setTimeout(() => this.processVotes(), 30000);
  }

  processVotes() {
    clearTimeout(this.timers.voting);
    if (this.votes.size === 0) {
      this.log.push('🗳️ Никто не проголосовал.');
      this.nextRound();
      return;
    }

    const voteCounts = {};
    this.votes.forEach((target) => { voteCounts[target] = (voteCounts[target] || 0) + 1; });
    const maxVotes = Math.max(...Object.values(voteCounts));
    const candidates = Object.entries(voteCounts).filter(([_, c]) => c === maxVotes).map(([id]) => id);

    if (candidates.length === 1) {
      const suspected = candidates[0];
      if (suspected === this.spyId) {
        this.log.push(`🎉 Шпион (${this.getPlayerName(suspected)}) раскрыт! Мирные победили!`);
        this.endGame('civilians');
        return;
      } else {
        this.log.push(`❌ ${this.getPlayerName(suspected)} не шпион. Продолжаем...`);
      }
    } else {
      this.log.push('🗳️ Ничья — шпион остается в тени.');
    }

    this.nextRound();
  }

  nextRound() {
    this.round++;
    if (this.round > 3) {
      this.log.push('🕵️ Шпион остался нераскрытым 3 раунда! Шпион победил!');
      this.endGame('spy');
      return;
    }
    this.startRound();
  }

  endGame(winner) {
    this.phase = 'ended';
    clearTimeout(this.timers.round);
    clearTimeout(this.timers.voting);
    roomManager.broadcast(this.room.code, 'spy:end', {
      winner: winner === 'spy' ? 'Шпион' : 'Мирные',
      spy: this.getPlayerName(this.spyId),
      location: this.location,
      log: this.log
    });
  }

  handleVote(playerId, targetId) {
    if (this.voted.has(playerId)) return;
    this.votes.set(playerId, targetId);
    this.voted.add(playerId);

    roomManager.broadcast(this.room.code, 'spy:voteUpdate', {
      voted: this.voted.size,
      total: this.room.players.size,
      votes: Array.from(this.votes.entries()).map(([voter, target]) => ({
        voter: this.getPlayerName(voter),
        target: this.getPlayerName(target)
      }))
    });

    if (this.voted.size >= this.room.players.size) {
      clearTimeout(this.timers.voting);
      this.processVotes();
    }
  }

  getPlayerName(id) {
    return this.room.players.get(id)?.name || '???';
  }
}

// ========================== BUNKER GAME ==========================

class BunkerGame {
  constructor(room) {
    this.room = room;
    this.playerCards = new Map();
    this.catastrophe = null;
    this.bunkerContents = [];
    this.round = 1;
    this.phase = 'reveal';
    this.votes = new Map();
    this.eliminated = [];
    this.log = [];
    this.timers = {};
  }

  start() {
    this.catastrophe = random(BUNKER.catastrophes);
    this.generateBunkerContents();
    this.room.players.forEach((player, id) => {
      this.playerCards.set(id, this.generatePlayerCards());
    });

    this.log.push(`🌪️ Катастрофа: ${this.catastrophe}`);
    this.log.push('📦 Бункер загружен. Открывайте карты!');

    roomManager.broadcast(this.room.code, 'bunker:start', {
      catastrophe: this.catastrophe,
      bunkerContents: this.bunkerContents,
      log: this.log,
      round: this.round
    });

    this.playerCards.forEach((cards, playerId) => {
      io.to(playerId).emit('bunker:cards', { cards });
    });

    this.startRevealPhase();
  }

  generatePlayerCards() {
    const prof = random(BUNKER.professions);
    const fact = random(BUNKER.facts);
    const hobby = random(BUNKER.hobbies);
    const baggage = random(BUNKER.baggage);
    const health = random(BUNKER.health);
    const character = random(BUNKER.character);
    const phobia = random(BUNKER.phobias);
    const age = Math.floor(Math.random() * (110 - 18 + 1)) + 18;

    const cards = [
      { id: 'prof', title: 'Профессия', value: prof.name, desc: prof.desc, revealed: false },
      { id: 'age', title: 'Возраст', value: `${age} лет`, desc: 'Влияет на здоровье и опыт.', revealed: false },
      { id: 'fact', title: 'Факт', value: fact.text, desc: fact.desc, revealed: false },
      { id: 'hobby', title: 'Хобби', value: hobby.name, desc: hobby.desc, revealed: false },
      { id: 'baggage', title: 'Багаж', value: baggage.name, desc: baggage.desc, revealed: false },
      { id: 'health', title: 'Здоровье', value: health.name, desc: health.desc, revealed: false },
      { id: 'character', title: 'Характер', value: character.name, desc: character.desc, revealed: false },
      { id: 'phobia', title: 'Фобия', value: phobia.name, desc: phobia.desc, revealed: false }
    ];

    if (Math.random() < 0.4) {
      const condition = random(BUNKER.conditions);
      cards.push({ id: 'condition', title: '⚡ Условие', value: condition.name, desc: condition.desc, revealed: false });
    }
    return cards;
  }

  generateBunkerContents() {
    this.bunkerContents = BUNKER.bunkerItems.map(item => ({
      ...item,
      amount: Math.floor(Math.random() * (item.max - item.min + 1)) + item.min
    }));
  }

  startRevealPhase() {
    this.phase = 'reveal';
    this.log.push('👁️ Фаза раскрытия карт (3 минуты)');
    roomManager.broadcast(this.room.code, 'bunker:phase', {
      phase: 'reveal',
      log: this.log,
      round: this.round,
      timeLeft: 180
    });
    this.timers.reveal = setTimeout(() => this.startDiscussionPhase(), 180000);
  }

  startDiscussionPhase() {
    this.phase = 'discussion';
    this.log.push('💬 Началось обсуждение. Кто достоин остаться в бункере?');
    roomManager.broadcast(this.room.code, 'bunker:phase', {
      phase: 'discussion',
      log: this.log,
      round: this.round,
      timeLeft: 300
    });
    this.timers.discussion = setTimeout(() => this.startVotingPhase(), 300000);
  }

  startVotingPhase() {
    this.phase = 'voting';
    this.votes.clear();
    this.log.push('🗳️ Голосование! Выберите, кого выгнать из бункера.');
    roomManager.broadcast(this.room.code, 'bunker:phase', {
      phase: 'voting',
      log: this.log,
      round: this.round,
      timeLeft: 60
    });
    this.timers.voting = setTimeout(() => this.processVotes(), 60000);
  }

  processVotes() {
    clearTimeout(this.timers.voting);
    const voteCounts = {};
    this.votes.forEach((target) => { voteCounts[target] = (voteCounts[target] || 0) + 1; });
    const maxVotes = Math.max(...Object.values(voteCounts), 0);
    const candidates = Object.entries(voteCounts).filter(([_, c]) => c === maxVotes).map(([id]) => id);

    if (candidates.length === 1 && maxVotes > 0) {
      const eliminated = candidates[0];
      this.eliminated.push(eliminated);
      this.log.push(`❌ ${this.getPlayerName(eliminated)} выгнан из бункера (${maxVotes} голосов)`);
    } else {
      this.log.push('🗳️ Голосование не выявило жертвы.');
    }

    const aliveCount = this.room.players.size - this.eliminated.length;
    const needed = Math.ceil(this.room.players.size / 2);
    if (aliveCount <= needed) {
      const survivors = Array.from(this.room.players.keys()).filter(id => !this.eliminated.includes(id)).map(id => this.getPlayerName(id));
      this.log.push(`🏆 Игра окончена! В бункере остались: ${survivors.join(', ')}`);
      this.endGame();
      return;
    }

    this.round++;
    this.startDiscussionPhase();
  }

  endGame() {
    this.phase = 'ended';
    clearTimeout(this.timers.reveal);
    clearTimeout(this.timers.discussion);
    clearTimeout(this.timers.voting);
    const survivors = Array.from(this.room.players.keys()).filter(id => !this.eliminated.includes(id)).map(id => this.getPlayerName(id));
    roomManager.broadcast(this.room.code, 'bunker:end', {
      survivors,
      eliminated: this.eliminated.map(id => this.getPlayerName(id)),
      log: this.log
    });
  }

  handleRevealCard(playerId, cardId) {
    const cards = this.playerCards.get(playerId);
    if (!cards) return;
    const card = cards.find(c => c.id === cardId);
    if (card && !card.revealed) {
      card.revealed = true;
      io.to(playerId).emit('bunker:cards', { cards });
      roomManager.broadcast(this.room.code, 'bunker:cardRevealed', {
        player: this.getPlayerName(playerId),
        cardTitle: card.title
      });
    }
  }

  handleVote(playerId, targetId) {
    if (this.eliminated.includes(playerId)) return;
    if (this.phase !== 'voting') return;
    this.votes.set(playerId, targetId);

    roomManager.broadcast(this.room.code, 'bunker:voteUpdate', {
      voted: this.votes.size,
      total: this.room.players.size - this.eliminated.length,
      votes: Array.from(this.votes.entries()).map(([voter, target]) => ({
        voter: this.getPlayerName(voter),
        target: this.getPlayerName(target)
      }))
    });
  }

  getPlayerName(id) {
    return this.room.players.get(id)?.name || '???';
  }
}

// ========================== TRUTH OR DARE ==========================

class TruthOrDareGame {
  constructor(room) {
    this.room = room;
    this.currentPlayerIndex = 0;
    this.players = [];
    this.history = [];
    this.usedTruth = new Set();
    this.usedDare = new Set();
    this.currentRoll = null;
  }

  start() {
    this.players = Array.from(this.room.players.values());
    this.nextTurn();
  }

  nextTurn() {
    if (this.players.length === 0) return;
    const player = this.players[this.currentPlayerIndex % this.players.length];
    roomManager.broadcast(this.room.code, 'truth:turn', {
      player: player.name,
      playerId: player.id,
      history: this.history
    });
  }

  handleRoll(playerId) {
    const player = this.room.players.get(playerId);
    if (!player) return;

    const roll = Math.floor(Math.random() * 3);
    let result;

    if (roll === 0) {
      const q = this.getRandomTruth();
      result = { type: 'truth', text: q, label: '❓ ПРАВДА', color: '#4fc3f7' };
      this.usedTruth.add(q);
    } else if (roll === 1) {
      const a = this.getRandomDare();
      result = { type: 'dare', text: a, label: '🎯 ДЕЙСТВИЕ', color: '#ff8a65' };
      this.usedDare.add(a);
    } else {
      result = { type: 'skip', text: 'Скип! Ход переходит следующему игроку.', label: '⏭️ СКИП', color: '#bdbdbd' };
    }

    this.currentRoll = result;
    this.history.push({ player: player.name, ...result });

    if (roll === 2) {
      this.currentPlayerIndex++;
    }

    roomManager.broadcast(this.room.code, 'truth:result', {
      result,
      nextPlayer: this.players[this.currentPlayerIndex % this.players.length]?.name,
      history: this.history,
      canHelp: roll !== 2
    });
  }

  handleHelp(type) {
    if (type === 'truth') {
      const available = HELP_QUESTIONS.filter(q => !this.usedTruth.has(q));
      const q = available.length > 0 ? random(available) : random(HELP_QUESTIONS);
      return { type: 'truth', text: q, label: '❓ Помощь зала: Правда', color: '#4fc3f7' };
    } else {
      const available = HELP_ACTIONS.filter(a => !this.usedDare.has(a));
      const a = available.length > 0 ? random(available) : random(HELP_ACTIONS);
      return { type: 'dare', text: a, label: '🎯 Помощь зала: Действие', color: '#ff8a65' };
    }
  }

  handleNext() {
    this.currentPlayerIndex++;
    this.nextTurn();
  }

  getRandomTruth() {
    const available = TRUTH_QUESTIONS.filter(q => !this.usedTruth.has(q));
    return available.length > 0 ? random(available) : random(TRUTH_QUESTIONS);
  }

  getRandomDare() {
    const available = DARE_ACTIONS.filter(a => !this.usedDare.has(a));
    return available.length > 0 ? random(available) : random(DARE_ACTIONS);
  }
}

// ========================== SOCKET.IO ==========================

io.on('connection', (socket) => {
  console.log('🔌 Подключился:', socket.id);

  socket.on('createRoom', ({ playerName, gameType }) => {
    const name = (playerName || 'Игрок').trim().substring(0, 20);
    if (!name) { socket.emit('error', 'Введите имя'); return; }
    const room = roomManager.createRoom(gameType, name, socket.id);
    socket.join(room.code);
    socket.emit('roomCreated', {
      roomCode: room.code,
      isHost: true,
      players: Array.from(room.players.values()),
      gameType: room.gameType
    });
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const name = (playerName || 'Игрок').trim().substring(0, 20);
    if (!name) { socket.emit('error', 'Введите имя'); return; }
    const code = (roomCode || '').trim().toUpperCase();
    if (!code) { socket.emit('error', 'Введите код комнаты'); return; }

    const result = roomManager.joinRoom(code, name, socket.id);
    if (result.error) { socket.emit('error', result.error); return; }

    socket.join(code);
    socket.emit('joinedRoom', {
      roomCode: code,
      players: Array.from(result.room.players.values()),
      gameType: result.room.gameType
    });
    roomManager.broadcast(code, 'playersUpdate', Array.from(result.room.players.values()));
  });

  socket.on('startGame', () => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', 'Только хост может начать игру');
      return;
    }
    const minPlayers = room.gameType === 'mafia' ? 3 : 2;
    if (room.players.size < minPlayers) {
      socket.emit('error', `Нужно минимум ${minPlayers} игрока`);
      return;
    }

    room.state = 'playing';
    roomManager.broadcast(room.code, 'gameStarted', { gameType: room.gameType });

    switch (room.gameType) {
      case 'mafia':
        room.game = new MafiaGame(room);
        room.game.start();
        break;
      case 'spy':
        room.game = new SpyGame(room);
        room.game.start();
        break;
      case 'bunker':
        room.game = new BunkerGame(room);
        room.game.start();
        break;
      case 'truth':
        room.game = new TruthOrDareGame(room);
        room.game.start();
        break;
    }
  });

  socket.on('chatMessage', ({ message }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room) return;
    const player = room.players.get(socket.id);
    if (!player) return;

    const chatMsg = {
      id: Date.now(),
      name: player.name,
      message: message.substring(0, 200),
      time: formatTime(Date.now())
    };

    room.chat.push(chatMsg);
    if (room.chat.length > 100) room.chat.shift();
    roomManager.broadcast(room.code, 'chatMessage', chatMsg);
  });

  // Mafia actions
  socket.on('mafia:nightAction', ({ targetId }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'mafia') return;
    room.game.handleNightAction(socket.id, targetId);
  });

  socket.on('mafia:dayVote', ({ targetId }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'mafia') return;
    room.game.handleDayVote(socket.id, targetId);
  });

  // Spy actions
  socket.on('spy:vote', ({ targetId }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'spy') return;
    room.game.handleVote(socket.id, targetId);
  });

  // Bunker actions
  socket.on('bunker:reveal', ({ cardId }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'bunker') return;
    room.game.handleRevealCard(socket.id, cardId);
  });

  socket.on('bunker:vote', ({ targetId }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'bunker') return;
    room.game.handleVote(socket.id, targetId);
  });

  // Truth or Dare actions
  socket.on('truth:roll', () => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'truth') return;
    room.game.handleRoll(socket.id);
  });

  socket.on('truth:help', ({ type }) => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'truth') return;
    const help = room.game.handleHelp(type);
    socket.emit('truth:helpResult', help);
  });

  socket.on('truth:next', () => {
    const room = roomManager.getRoomByPlayer(socket.id);
    if (!room || !room.game || room.gameType !== 'truth') return;
    room.game.handleNext();
  });

  socket.on('disconnect', () => {
    console.log('🔌 Отключился:', socket.id);
    const room = roomManager.leaveRoom(socket.id);
    if (room) {
      roomManager.broadcast(room.code, 'playersUpdate', Array.from(room.players.values()));
      roomManager.broadcast(room.code, 'playerLeft', { 
        name: Array.from(room.players.values()).find(p => p.id === socket.id)?.name || 'Игрок' 
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`🎮 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 Откройте http://localhost:${PORT} в браузере`);
});
