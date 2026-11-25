/* ==========================================
   NUTRI-TRACK - LOGICA & CÁLCULOS NUTRICIONAIS
   ========================================== */

// Banco de dados de opções de refeição saudáveis e nutritivas
const mealDatabase = {
  traditional: {
    breakfast: [
      {
        emoji: '☕',
        title: 'Café da Manhã Energético',
        time: '07:30 - 08:30',
        items: [
          { name: 'Ovos mexidos com azeite de oliva', portion: '2 unidades médias' },
          { name: 'Pão integral de grãos', portion: '2 fatias (50g)' },
          { name: 'Mamão Papaia ou Banana', portion: '1 fatia / 1 unidade' },
          { name: 'Café preto ou Chá verde', portion: '200ml (sem açúcar)' }
        ]
      },
      {
        emoji: '🥞',
        title: 'Café da Manhã com Panqueca de Aveia',
        time: '07:30 - 08:30',
        items: [
          { name: 'Panqueca fit (1 ovo, 30g aveia, 1 banana amassada)', portion: '1 unidade grande' },
          { name: 'Pasta de amendoim integral', portion: '1 colher de sopa (15g)' },
          { name: 'Morangos frescos', portion: '5 unidades' },
          { name: 'Café com leite desnatado ou vegetal', portion: '200ml' }
        ]
      }
    ],
    lunch: [
      {
        emoji: '🥗',
        title: 'Almoço Balanceado Tradicional',
        time: '12:00 - 13:30',
        items: [
          { name: 'Peito de frango grelhado com ervas', portion: '140g a 160g' },
          { name: 'Arroz integral cozido', portion: '100g a 130g' },
          { name: 'Feijão carioca ou preto temperado', portion: '1 concha pequena (80g)' },
          { name: 'Salada colorida (Alface, Tomate, Cenoura ralada)', portion: 'À vontade' },
          { name: 'Azeite de oliva extra virgem', portion: '1 colher de sobremesa (8ml)' }
        ]
      },
      {
        emoji: '🥩',
        title: 'Almoço Proteico com Carne Magra',
        time: '12:00 - 13:30',
        items: [
          { name: 'Patinho grelhado ou Filezinho de carne', portion: '130g a 150g' },
          { name: 'Batata doce ou Mandioquinha assada', portion: '120g' },
          { name: 'Brócolis e Couve-flor no vapor', portion: '1 xícara' },
          { name: 'Mix de folhas verdes com limão e azeite', portion: 'À vontade' }
        ]
      }
    ],
    snack: [
      {
        emoji: '🍎',
        title: 'Lanche da Tarde Prático',
        time: '16:00 - 16:30',
        items: [
          { name: 'Iogurte natural desnatado ou grego zero', portion: '1 potinho (170g)' },
          { name: 'Castanhas do Pará ou Amêndoas', portion: '3 a 4 unidades (15g)' },
          { name: 'Maçã com casca ou Pera', portion: '1 unidade média' }
        ]
      },
      {
        emoji: '🥑',
        title: 'Lanche de Abacate & Proteína',
        time: '16:00 - 16:30',
        items: [
          { name: 'Creme de abacate leve (1/4 abacate com limão)', portion: '80g' },
          { name: 'Whey Protein ou Proteína vegetal', portion: '1 scoop (30g)' },
          { name: 'Sementes de Chia ou Linhaça', portion: '1 colher de chá' }
        ]
      }
    ],
    dinner: [
      {
        emoji: '🍲',
        title: 'Jantar Leve & Restaurador',
        time: '19:30 - 20:30',
        items: [
          { name: 'Filé de Tilápia ou Salmão grelhado', portion: '150g' },
          { name: 'Legumes grelhados (Abobrinha, Cenoura, Pimentão)', portion: '150g' },
          { name: 'Quinoa cozida ou Arroz integral', portion: '60g' },
          { name: 'Salada de folhas roxas e verdes', portion: 'À vontade' }
        ]
      },
      {
        emoji: '🍳',
        title: 'Omelete Nutritivo Noturno',
        time: '19:30 - 20:30',
        items: [
          { name: 'Omelete com 3 ovos e espinafre', portion: '1 porção' },
          { name: 'Tomate cereja e queijo cotagge ou minas', portion: '2 colheres de sopa' },
          { name: 'Salada verde refrescante com azeite', portion: 'À vontade' }
        ]
      }
    ]
  },
  highProtein: {
    breakfast: [
      {
        emoji: '🍳',
        title: 'Café da Manhã Hiperproteico',
        time: '07:30 - 08:30',
        items: [
          { name: 'Ovos mexidos (3 claras + 2 gemas)', portion: '1 porção' },
          { name: 'Queijo cottage ou Minas frescal', portion: '2 colheres de sopa (40g)' },
          { name: 'Torrada integral de fermentação natural', portion: '1 fatia' },
          { name: 'Café preto com canela', portion: '200ml' }
        ]
      }
    ],
    lunch: [
      {
        emoji: '🍗',
        title: 'Almoço Anabólico & Nutritivo',
        time: '12:00 - 13:30',
        items: [
          { name: 'Peito de frango em cubos com açafrão', portion: '180g a 200g' },
          { name: 'Batata doce assada', portion: '140g' },
          { name: 'Vagem e Brócolis no vapor', portion: '1.5 xícaras' },
          { name: 'Azeite extra virgem', portion: '1 colher de sopa' }
        ]
      }
    ],
    snack: [
      {
        emoji: '🥤',
        title: 'Shake Proteico com Aveia',
        time: '16:00 - 16:30',
        items: [
          { name: 'Whey Protein Concentrado/Isolado', portion: '1.5 scoop (45g)' },
          { name: 'Farinha de Aveia fina', portion: '30g' },
          { name: 'Banana prata congelada', portion: '1 unidade' },
          { name: 'Água ou Leite desnatado', portion: '250ml' }
        ]
      }
    ],
    dinner: [
      {
        emoji: '🥩',
        title: 'Jantar Proteico com Carne Grelhada',
        time: '19:30 - 20:30',
        items: [
          { name: 'Mignon / Patinho / Alcatra grelhada', portion: '180g' },
          { name: 'Purê de abóbora cabotiá', portion: '120g' },
          { name: 'Salada verde escura (Couve, Rúcula, Alface)', portion: 'À vontade' }
        ]
      }
    ]
  },
  vegetarian: {
    breakfast: [
      {
        emoji: '🥣',
        title: 'Bowl de Aveia & Frutas Vermelhas',
        time: '07:30 - 08:30',
        items: [
          { name: 'Mingau de aveia com leite vegetal (amêndoas/aveia)', portion: '200ml + 40g aveia' },
          { name: 'Sementes de abóbora e chia', portion: '1 colher de sopa' },
          { name: 'Morangos e mirtilos', portion: '1/2 xícara' },
          { name: 'Mel de abelha ou melado', portion: '1 colher de chá' }
        ]
      }
    ],
    lunch: [
      {
        emoji: '🍛',
        title: 'Almoço Vegetariano Completo',
        time: '12:00 - 13:30',
        items: [
          { name: 'Tofu grelhado temperado com shoyu e gengibre', portion: '150g' },
          { name: 'Lentilha ou Grão de bico ensopado', portion: '1 concha grande (120g)' },
          { name: 'Arroz integral ou Quinoa', portion: '100g' },
          { name: 'Salada de couve crisp e tomate', portion: 'À vontade' }
        ]
      }
    ],
    snack: [
      {
        emoji: '🥜',
        title: 'Snack de Grão de Bico & Oleaginosas',
        time: '16:00 - 16:30',
        items: [
          { name: 'Grão de bico crocante assado com páprica', portion: '50g' },
          { name: 'Mix de Nozes e Castanhas', portion: '20g' },
          { name: 'Suco de laranja natural ou Chá gelado', portion: '200ml' }
        ]
      }
    ],
    dinner: [
      {
        emoji: '🥗',
        title: 'Salada Morna Proteica',
        time: '19:30 - 20:30',
        items: [
          { name: 'Ovos cozidos', portion: '2 unidades' },
          { name: 'Mix de quinoa, edamame e legumes', portion: '150g' },
          { name: 'Azeite de oliva e sementes de girassol', portion: '1 colher de sopa' }
        ]
      }
    ]
  }
};

// Estado da Aplicação
let currentGender = 'male';
let currentUser = null;
let currentCalculation = null;

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkSavedUser();
  // Executar um cálculo inicial com os valores padrão para preencher a tela
  calculateNutrition();
});

// Configuração dos eventos da página
function setupEventListeners() {
  // Form da Calculadora
  const calcForm = document.getElementById('nutrition-form');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateNutrition();
      // Smooth scroll para a seção de resultados
      const resElem = document.getElementById('results-section');
      if (resElem) {
        resElem.classList.remove('hidden');
        resElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Modal Login
  const loginBtn = document.getElementById('open-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (currentUser) {
        // Se já estiver logado, faz logout
        logoutUser();
      } else {
        openLoginModal();
      }
    });
  }
}

// Seleção visual de Gênero
function selectGender(gender) {
  currentGender = gender;
  const maleLabel = document.getElementById('gender-male-label');
  const femaleLabel = document.getElementById('gender-female-label');

  if (gender === 'male') {
    maleLabel.classList.add('active');
    femaleLabel.classList.remove('active');
  } else {
    femaleLabel.classList.add('active');
    maleLabel.classList.remove('active');
  }
}

// LÓGICA DE CÁLCULO NUTRICIONAL (Mifflin-St Jeor & IMC)
function calculateNutrition() {
  const age = parseFloat(document.getElementById('age').value) || 25;
  const weight = parseFloat(document.getElementById('weight').value) || 70;
  const height = parseFloat(document.getElementById('height').value) || 175;
  const activityMultiplier = parseFloat(document.getElementById('activity').value) || 1.375;
  const goal = document.getElementById('goal').value || 'maintain';
  const dietPref = document.getElementById('diet-pref').value || 'traditional';

  // 1. Cálculo do IMC (Índice de Massa Corporal)
  const heightMeters = height / 100;
  const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

  // Faixa de peso ideal (IMC entre 18.5 e 24.9)
  const idealWeightMin = (18.5 * heightMeters * heightMeters).toFixed(1);
  const idealWeightMax = (24.9 * heightMeters * heightMeters).toFixed(1);

  // Classificação do IMC
  let bmiCategory = 'Peso Normal';
  let bmiTagClass = 'tag-normal';
  let statusText = 'Você está na faixa de peso saudável!';
  let pointerPercent = 45;

  if (bmi < 18.5) {
    bmiCategory = 'Abaixo do Peso';
    bmiTagClass = 'tag-under';
    statusText = 'Abaixo da faixa recomendada. Recomenda-se ganhar massa de forma saudável.';
    pointerPercent = 10;
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    bmiCategory = 'Peso Ideal';
    bmiTagClass = 'tag-normal';
    statusText = 'Parabéns! Seu peso está na faixa ideal para a sua altura.';
    pointerPercent = 42;
  } else if (bmi >= 25 && bmi <= 29.9) {
    bmiCategory = 'Sobrepeso';
    bmiTagClass = 'tag-over';
    statusText = 'Levemente acima do peso. Uma reeducação alimentar ajudará a atingir a meta.';
    pointerPercent = 70;
  } else {
    bmiCategory = 'Obesidade';
    bmiTagClass = 'tag-obese';
    statusText = 'Atenção ao peso. O plano calórico focado em déficit ajudará no processo.';
    pointerPercent = 90;
  }

  // 2. Cálculo da TMB (Taxa Metabólica Basal) por Mifflin-St Jeor
  let bmr = 0;
  if (currentGender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  bmr = Math.round(bmr);

  // 3. Cálculo do TDEE (Gasto Calórico Diário Total)
  const tdee = Math.round(bmr * activityMultiplier);

  // 4. Ajuste da Meta Calórica conforme o Objetivo
  let targetCalories = tdee;
  if (goal === 'lose') {
    targetCalories = Math.max(1200, tdee - 500); // Déficit moderado e seguro de 500 kcal
  } else if (goal === 'gain') {
    targetCalories = tdee + 400; // Superávit de 400 kcal
  }

  // 5. Cálculo dos Macronutrientes
  // Proteínas: 2.0g por kg para preservar massa magra (4 kcal por g)
  let proteinGrams = Math.round(weight * 2.0);
  let proteinCal = proteinGrams * 4;

  // Gorduras: 25% a 30% das calorias totais (9 kcal por g)
  let fatsCal = Math.round(targetCalories * 0.28);
  let fatsGrams = Math.round(fatsCal / 9);

  // Carboidratos: Restante das calorias (4 kcal por g)
  let carbsCal = Math.max(0, targetCalories - (proteinCal + fatsCal));
  let carbsGrams = Math.round(carbsCal / 4);

  // Salvar no estado
  currentCalculation = {
    bmi,
    bmiCategory,
    bmiTagClass,
    statusText,
    idealWeightMin,
    idealWeightMax,
    pointerPercent,
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    proteinCal,
    carbsGrams,
    carbsCal,
    fatsGrams,
    fatsCal,
    dietPref
  };

  // Atualizar a Interface
  updateResultsUI();
  generateDietPlan();
}

// Atualiza o painel de resultados no DOM
function updateResultsUI() {
  if (!currentCalculation) return;

  const calc = currentCalculation;

  // IMC
  document.getElementById('res-bmi').textContent = calc.bmi;
  const tagElem = document.getElementById('res-bmi-tag');
  tagElem.textContent = calc.bmiCategory;
  tagElem.className = `bmi-tag ${calc.bmiTagClass}`;

  document.getElementById('res-ideal-weight').textContent = `${calc.idealWeightMin} kg - ${calc.idealWeightMax} kg`;
  document.getElementById('res-weight-status').textContent = calc.statusText;

  const pointer = document.getElementById('bmi-pointer');
  if (pointer) pointer.style.left = `${calc.pointerPercent}%`;

  // Calorias
  document.getElementById('res-target-calories').textContent = calc.targetCalories.toLocaleString('pt-BR');
  document.getElementById('res-bmr').textContent = `${calc.bmr.toLocaleString('pt-BR')} kcal`;
  document.getElementById('res-tdee').textContent = `${calc.tdee.toLocaleString('pt-BR')} kcal`;

  // Macros
  document.getElementById('res-protein-g').textContent = `${calc.proteinGrams}g`;
  document.getElementById('res-protein-cal').textContent = `${calc.proteinCal} kcal (${Math.round((calc.proteinCal/calc.targetCalories)*100)}%)`;

  document.getElementById('res-carbs-g').textContent = `${calc.carbsGrams}g`;
  document.getElementById('res-carbs-cal').textContent = `${calc.carbsCal} kcal (${Math.round((calc.carbsCal/calc.targetCalories)*100)}%)`;

  document.getElementById('res-fats-g').textContent = `${calc.fatsGrams}g`;
  document.getElementById('res-fats-cal').textContent = `${calc.fatsCal} kcal (${Math.round((calc.fatsCal/calc.targetCalories)*100)}%)`;
}

// GERADOR DE DIETA PERSONALIZADA
function generateDietPlan() {
  if (!currentCalculation) return;

  const targetCal = currentCalculation.targetCalories;
  const prefKey = currentCalculation.dietPref;
  const container = document.getElementById('meals-container');
  if (!container) return;

  // Atualizar cabeçalho da dieta
  const prefNames = {
    'traditional': 'Estilo: Tradicional Equilibrado',
    'high-protein': 'Estilo: Alta em Proteínas',
    'low-carb': 'Estilo: Low Carb',
    'vegetarian': 'Estilo: Vegetariano Nutritivo'
  };

  document.getElementById('diet-pref-tag').textContent = prefNames[prefKey] || 'Estilo: Equilibrado';
  document.getElementById('diet-total-cal').textContent = `${targetCal.toLocaleString('pt-BR')} kcal`;

  // Selecionar conjunto de refeições
  const dietSet = mealDatabase[prefKey] || mealDatabase.traditional;
  const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
  const caloriesPerMeal = {
    breakfast: Math.round(targetCal * 0.25),
    lunch: Math.round(targetCal * 0.35),
    snack: Math.round(targetCal * 0.15),
    dinner: Math.round(targetCal * 0.25)
  };

  container.innerHTML = '';

  mealTypes.forEach((type) => {
    const options = dietSet[type] || mealDatabase.traditional[type];
    // Escolhe aleatoriamente uma das opções do banco para variar ao clicar em "Regerar"
    const selectedMeal = options[Math.floor(Math.random() * options.length)];
    const mealCal = caloriesPerMeal[type];

    const mealCard = document.createElement('div');
    mealCard.className = 'meal-card';
    mealCard.innerHTML = `
      <div class="meal-header">
        <div class="meal-title-box">
          <span class="meal-emoji">${selectedMeal.emoji}</span>
          <div>
            <h3>${selectedMeal.title}</h3>
            <span class="meal-time">${selectedMeal.time}</span>
          </div>
        </div>
        <span class="meal-calories-tag">~${mealCal} kcal</span>
      </div>

      <ul class="food-list">
        ${selectedMeal.items.map(item => `
          <li class="food-item">
            <span class="food-bullet"></span>
            <div class="food-details">
              <span class="food-name">${item.name}</span>
              <span class="food-portion">Porção sugerida: ${item.portion}</span>
            </div>
          </li>
        `).join('')}
      </ul>

      <div class="meal-footer">
        <button class="swap-meal-btn" onclick="generateDietPlan()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 4-8.4L2.5 9.5"></path>
          </svg>
          Alternar Opção
        </button>
      </div>
    `;

    container.appendChild(mealCard);
  });
}

/* MODAL DE AUTENTICAÇÃO E USER STATE */
function openLoginModal() {
  document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
  document.getElementById('login-modal').classList.add('hidden');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  } else {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

function handleAuthSubmit(event, type) {
  event.preventDefault();

  if (type === 'login') {
    const email = document.getElementById('login-email').value;
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    loginUser({ name: formattedName, email });
  } else {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    
    loginUser({ name, email });
  }

  closeLoginModal();
}

function loginUser(userData) {
  currentUser = userData;
  localStorage.setItem('nutritrack_user', JSON.stringify(userData));
  updateUserHeaderUI();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('nutritrack_user');
  updateUserHeaderUI();
}

function checkSavedUser() {
  const saved = localStorage.getItem('nutritrack_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      updateUserHeaderUI();
    } catch (e) {
      console.error(e);
    }
  }
}

function updateUserHeaderUI() {
  const btnText = document.getElementById('user-btn-text');
  if (!btnText) return;

  if (currentUser) {
    btnText.textContent = `Olá, ${currentUser.name}`;
  } else {
    btnText.textContent = 'Entrar';
  }
}

/* MODAL DA NUTRI-IA & GERENCIADOR DE MÚLTIPLOS CHATS COM HISTÓRICO */
let chatSessions = [];
let activeChatId = null;

// Inicialização das sessões de chat
document.addEventListener('DOMContentLoaded', () => {
  loadChatSessionsFromStorage();
});

function loadChatSessionsFromStorage() {
  const saved = localStorage.getItem('nutritrack_ai_chats');
  if (saved) {
    try {
      chatSessions = JSON.parse(saved);
    } catch (e) {
      chatSessions = [];
    }
  }

  // Se não houver chats salvos, criar o primeiro chat inicial
  if (!chatSessions || chatSessions.length === 0) {
    createInitialChatSession();
  } else {
    activeChatId = chatSessions[0].id;
  }
}

function saveChatSessionsToStorage() {
  localStorage.setItem('nutritrack_ai_chats', JSON.stringify(chatSessions));
}

function createInitialChatSession() {
  const newId = 'chat_' + Date.now();
  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const initialMsg = {
    sender: 'ai',
    html: `
      <p>Olá! 👋 Sou a <strong>NutriIA</strong>, sua assistente virtual de nutrição no NutriTrack!</p>
      <p>Estou pronta para testarmos nossa conversa. Como posso te ajudar hoje?</p>
    `,
    time: timeStr
  };

  const newChat = {
    id: newId,
    title: 'Nova Conversa',
    timestamp: timeStr,
    messages: [initialMsg]
  };

  chatSessions.unshift(newChat);
  activeChatId = newId;
  saveChatSessionsToStorage();
}

// Abrir Modal da IA
function openAiModal() {
  const aiModal = document.getElementById('ai-modal');
  if (aiModal) {
    aiModal.classList.remove('hidden');

    // Se o chat ativo atual tiver mensagens trocadas, garante que está renderizado
    renderChatHistorySidebar();
    renderActiveChatMessages();

    setTimeout(() => {
      const input = document.getElementById('ai-chat-input');
      if (input) input.focus();
    }, 150);
  }
}

// Fechar Modal da IA -> Salva a conversa atual no histórico e limpa para um novo chat
function closeAiModal() {
  const aiModal = document.getElementById('ai-modal');
  if (aiModal) {
    aiModal.classList.add('hidden');
  }

  // Verificar se o chat atual possui interação do usuário
  const currentChat = getActiveChat();
  if (currentChat && currentChat.messages.some(m => m.sender === 'user')) {
    // Salvar e criar uma nova conversa limpa para a próxima abertura
    saveChatSessionsToStorage();
    createNewChatSession(false); // cria sem forçar reabertura visual imediata
  }
}

// Criar Nova Conversa
function createNewChatSession(shouldFocus = true) {
  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const newId = 'chat_' + Date.now();

  const initialMsg = {
    sender: 'ai',
    html: `
      <p>Olá! 👋 Sou a <strong>NutriIA</strong>, sua assistente virtual de nutrição no NutriTrack!</p>
      <p>Estou pronta para testarmos nossa conversa. Como posso te ajudar hoje?</p>
    `,
    time: timeStr
  };

  const newChat = {
    id: newId,
    title: `Conversa #${chatSessions.length + 1}`,
    timestamp: timeStr,
    messages: [initialMsg]
  };

  chatSessions.unshift(newChat);
  activeChatId = newId;
  saveChatSessionsToStorage();

  renderChatHistorySidebar();
  renderActiveChatMessages();

  if (shouldFocus) {
    const input = document.getElementById('ai-chat-input');
    if (input) input.focus();
  }
}

function getActiveChat() {
  return chatSessions.find(c => c.id === activeChatId) || chatSessions[0];
}

// Trocar de chat ao clicar no histórico
function switchActiveChat(chatId) {
  activeChatId = chatId;
  renderChatHistorySidebar();
  renderActiveChatMessages();
}

// Excluir chat do histórico
function deleteChatSession(chatId, event) {
  if (event) event.stopPropagation();

  chatSessions = chatSessions.filter(c => c.id !== chatId);
  if (chatSessions.length === 0) {
    createInitialChatSession();
  } else if (activeChatId === chatId) {
    activeChatId = chatSessions[0].id;
  }

  saveChatSessionsToStorage();
  renderChatHistorySidebar();
  renderActiveChatMessages();
}

// Renderizar lista do histórico na barra lateral
function renderChatHistorySidebar() {
  const list = document.getElementById('chat-history-list');
  if (!list) return;

  list.innerHTML = '';

  chatSessions.forEach(chat => {
    const item = document.createElement('div');
    item.className = `history-item ${chat.id === activeChatId ? 'active' : ''}`;
    item.onclick = () => switchActiveChat(chat.id);

    item.innerHTML = `
      <div class="history-item-info">
        <span class="history-item-title">${escapeHtml(chat.title)}</span>
        <span class="history-item-time">${chat.timestamp}</span>
      </div>
      <button type="button" class="btn-del-chat" onclick="deleteChatSession('${chat.id}', event)" title="Excluir conversa">&times;</button>
    `;

    list.appendChild(item);
  });
}

// Renderizar mensagens da conversa ativa
function renderActiveChatMessages() {
  const list = document.getElementById('chat-messages-list');
  const titleElem = document.getElementById('current-chat-title');
  if (!list) return;

  const currentChat = getActiveChat();
  if (titleElem && currentChat) {
    titleElem.innerHTML = `${escapeHtml(currentChat.title)} <span class="badge badge-ai-sm">Teste Drive 🤖</span>`;
  }

  list.innerHTML = '';

  if (currentChat && currentChat.messages) {
    currentChat.messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${msg.sender === 'user' ? 'msg-user' : 'msg-ai'}`;

      if (msg.sender === 'user') {
        msgDiv.innerHTML = `
          <div class="msg-bubble">
            <p>${escapeHtml(msg.text)}</p>
            <span class="msg-time">${msg.time}</span>
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <img src="ai_avatar.png" class="msg-avatar" alt="NutriIA">
          <div class="msg-bubble">
            ${msg.html}
            <span class="msg-time">${msg.time}</span>
          </div>
        `;
      }

      list.appendChild(msgDiv);
    });
  }

  scrollChatToBottom();
}

// Enviar mensagem rápida via botões de sugestão
function sendQuickMessage(text) {
  const input = document.getElementById('ai-chat-input');
  if (input) {
    input.value = text;
    handleChatSubmit(new Event('submit'));
  }
}

// Handler de envio do chat
function handleChatSubmit(e) {
  if (e) e.preventDefault();

  const input = document.getElementById('ai-chat-input');
  if (!input) return;

  const userText = input.value.trim();
  if (!userText) return;

  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const currentChat = getActiveChat();

  // Se for a primeira mensagem do usuário nesta conversa, atualizar o título do chat!
  if (currentChat.messages.filter(m => m.sender === 'user').length === 0) {
    currentChat.title = userText.length > 22 ? userText.substring(0, 22) + '...' : userText;
  }

  // 1. Adicionar mensagem do usuário
  const userMsgObj = { sender: 'user', text: userText, time: timeStr };
  currentChat.messages.push(userMsgObj);
  saveChatSessionsToStorage();

  renderActiveChatMessages();
  renderChatHistorySidebar();
  input.value = '';

  // 2. Exibir indicador de digitação da IA
  showTypingIndicator(true);

  // 3. Resposta da IA após tempo de digitação (600ms)
  setTimeout(() => {
    showTypingIndicator(false);
    processAiResponse(userText);
  }, 650);
}

function showTypingIndicator(show) {
  const typing = document.getElementById('ai-typing');
  if (!typing) return;

  if (show) {
    typing.classList.remove('hidden');
  } else {
    typing.classList.add('hidden');
  }
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const body = document.getElementById('ai-chat-body');
  if (body) {
    body.scrollTop = body.scrollHeight;
  }
}

// Processador Inteligente de Respostas do Teste Drive
function processAiResponse(userText) {
  const lower = userText.toLowerCase().trim();
  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  let aiHtml = '';

  // Caso 1: Saudação "Oi NutriIA" ou similar
  if (lower.includes('oi') || lower.includes('ola') || lower.includes('olá') || lower.includes('nutria') || lower.includes('nutriia')) {
    aiHtml = `
      <p>Olá! 👋 Sou a <strong>NutriIA</strong>, sua assistente virtual de nutrição no NutriTrack!</p>
      <p>Como posso te ajudar a ter uma alimentação mais saudável e equilibrada hoje?</p>
    `;
  }
  // Caso 2: Pergunta sobre "lanche da tarde"
  else if (lower.includes('lanche da tarde') || lower.includes('lanche') || lower.includes('refeição irei fazer')) {
    aiHtml = `
      <p>Para o seu <strong>lanche da tarde</strong> hoje, recomendo uma opção deliciosa e altamente nutritiva:</p>
      <p style="margin: 0.5rem 0; padding-left: 0.5rem; border-left: 3px solid #10b981;">
        🥣 <strong>1 Iogurte Natural Desnatado (170g)</strong><br>
        🌰 <strong>3 Castanhas-do-Pará (15g)</strong><br>
        🍎 <strong>1 Maçã fresca com casca</strong>
      </p>
      <p><em>(~250 kcal • Rica em proteínas, gorduras boas e fibras)</em></p>
      <p>Essa combinação vai manter sua energia estável e garantir saciedade total até o jantar! 🍎🥛</p>
    `;
  }
  // Caso 3: Metas / Calorias
  else if (lower.includes('caloria') || lower.includes('meta') || lower.includes('macro') || lower.includes('peso')) {
    const targetCal = currentCalculation ? currentCalculation.targetCalories : 2100;
    aiHtml = `
      <p>Com base nas suas informações corporais, sua meta diária recomendada é de <strong>${targetCal.toLocaleString('pt-BR')} kcal</strong>.</p>
      <p>Você pode conferir a distribuição completa de proteínas, carboidratos e gorduras na seção da Calculadora! 📊</p>
    `;
  }
  // Caso Padrão
  else {
    aiHtml = `
      <p>Ótima pergunta! 🥦 No modo <strong>Teste Drive</strong>, eu posso responder saudações e sugerir refeições como o lanche da tarde.</p>
      <p>Na versão completa (em breve), eu poderei analisar fotos dos seus pratos e tirar qualquer dúvida nutricional em tempo real!</p>
    `;
  }

  const currentChat = getActiveChat();
  currentChat.messages.push({
    sender: 'ai',
    html: aiHtml,
    time: timeStr
  });

  saveChatSessionsToStorage();
  renderActiveChatMessages();
  renderChatHistorySidebar();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}



