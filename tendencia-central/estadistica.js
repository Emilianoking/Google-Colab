// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// Smooth scroll function
function scrollToSection(elementId) {
    document.getElementById(elementId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Mean calculation demo
function calculateMean() {
    const values = [15, 16, 17, 18, 19];
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    document.getElementById('mean-result').innerHTML = `
        <span style="color: var(--primary-green); font-weight: bold;">
            (${values.join('+')})/${values.length} = ${mean}
        </span>
    `;
}

// Dice game variables
let diceValues = { dice1: 1, dice2: 1 };
let rollCount = 0;

// Roll dice function
function rollDice(diceId) {
    const dice = document.getElementById(diceId);
    dice.classList.add('rolling');
    
    setTimeout(() => {
        const value = Math.floor(Math.random() * 6) + 1;
        diceValues[diceId] = value;
        dice.textContent = value;
        dice.classList.remove('rolling');
        
        updateDiceResults();
    }, 1000);
}

// Update dice results
function updateDiceResults() {
    const sum = diceValues.dice1 + diceValues.dice2;
    rollCount++;
    
    document.getElementById('current-sum').textContent = sum;
    document.getElementById('roll-count').textContent = rollCount;
}

// Reset dice game
function resetDiceGame() {
    diceValues = { dice1: 1, dice2: 1 };
    rollCount = 0;
    document.getElementById('dice1').textContent = '🎲';
    document.getElementById('dice2').textContent = '🎲';
    document.getElementById('current-sum').textContent = '-';
    document.getElementById('roll-count').textContent = '0';
}

// Quiz data
const quizQuestions = [
    {
        question: "¿Cuál es la medida de tendencia central que representa el valor más frecuente?",
        options: ["Media", "Mediana", "Moda", "Varianza"],
        correct: 2,
        explanation: "La moda es el valor que aparece con mayor frecuencia en un conjunto de datos."
    },
    {
        question: "¿Qué caracteriza principalmente al Big Data?",
        options: ["Solo el volumen de datos", "Las 5 V's: Volumen, Velocidad, Variedad, Veracidad y Valor", "Únicamente datos estructurados", "Solo datos de redes sociales"],
        correct: 1,
        explanation: "Big Data se caracteriza por las 5 V's que definen su complejidad y potencial."
    },
    {
        question: "Si lanzas un dado normal, ¿cuál es la probabilidad de obtener un número par?",
        options: ["1/6", "1/3", "1/2", "2/3"],
        correct: 2,
        explanation: "Hay 3 números pares (2, 4, 6) de 6 posibles, por lo que P = 3/6 = 1/2."
    },
    {
        question: "¿Cuál de estas es una variable cuantitativa continua?",
        options: ["Número de hermanos", "Color de cabello", "Altura en centímetros", "Marca de teléfono"],
        correct: 2,
        explanation: "La altura puede tomar cualquier valor en un rango continuo, no solo números enteros."
    },
    {
        question: "¿Qué empresa utiliza Big Data para recomendaciones de contenido?",
        options: ["Netflix", "Todas las anteriores", "Amazon", "Facebook"],
        correct: 1,
        explanation: "Todas estas empresas utilizan Big Data para personalizar la experiencia del usuario."
    }
];

let currentQuestion = 0;
let score = 0;
let quizCompleted = false;

// Initialize quiz
function initializeQuiz() {
    currentQuestion = 0;
    score = 0;
    quizCompleted = false;
    showQuestion();
    updateProgress();
}

// Show current question
function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showResults();
        return;
    }

    const question = quizQuestions[currentQuestion];
    const quizContainer = document.getElementById('quiz-container');
    
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>Pregunta ${currentQuestion + 1} de ${quizQuestions.length}</h3>
            <p><strong>${question.question}</strong></p>
        </div>
        <div class="quiz-options">
            ${question.options.map((option, index) => `
                <div class="quiz-option" onclick="selectAnswer(${index})">
                    ${option}
                </div>
            `).join('')}
        </div>
        <div id="question-feedback" style="margin-top: 1rem; display: none;">
            <p id="feedback-text"></p>
            <button class="cta-button" onclick="nextQuestion()" style="margin-top: 1rem;">
                ${currentQuestion === quizQuestions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </button>
        </div>
    `;
}

// Select answer
function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('question-feedback');
    const feedbackText = document.getElementById('feedback-text');

    // Disable further clicks
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    // Show correct/incorrect
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    if (selectedIndex !== question.correct) {
        options[question.correct].classList.add('correct');
    }

    // Update score
    if (selectedIndex === question.correct) {
        score++;
        feedbackText.innerHTML = `<span style="color: var(--primary-green);">¡Correcto!</span> ${question.explanation}`;
    } else {
        feedbackText.innerHTML = `<span style="color: #c62828;">Incorrecto.</span> ${question.explanation}`;
    }

    feedback.style.display = 'block';
    updateProgress();
}

// Next question
function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + (quizCompleted ? 1 : 0)) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = progress + '%';
}

// Show results
function showResults() {
    quizCompleted = true;
    updateProgress();
    
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let message = '';
    
    if (percentage >= 80) {
        message = '🌟 ¡Excelente! Dominas muy bien estos conceptos.';
    } else if (percentage >= 60) {
        message = '👍 ¡Bien hecho! Tienes una buena comprensión básica.';
    } else {
        message = '📚 ¡Sigue practicando! Repasa los conceptos y vuelve a intentarlo.';
    }
    
    document.getElementById('final-score').innerHTML = `
        <strong>${score}/${quizQuestions.length} (${percentage}%)</strong><br>
        ${message}
    `;

    // Save progress (simulated - not using localStorage)
    const userData = {
        score: score,
        total: quizQuestions.length,
        percentage: percentage,
        timestamp: new Date().toISOString()
    };
    console.log('Quiz completed:', userData);
}

// Restart quiz
function restartQuiz() {
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    initializeQuiz();
}

// FAQ toggle
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-answer').forEach(faq => {
        faq.classList.remove('open');
    });
    
    // Toggle current item
    if (!isOpen) {
        answer.classList.add('open');
    }
}

// Data visualization demo (simple chart simulation)
function createDataVisualization() {
    const chartContainer = document.getElementById('data-chart');
    if (!chartContainer) return;

    // Simple bar chart simulation with CSS
    const data = [
        { label: 'Redes Sociales', value: 85 },
        { label: 'Streaming', value: 70 },
        { label: 'E-commerce', value: 65 },
        { label: 'Salud', value: 45 },
        { label: 'Finanzas', value: 60 }
    ];

    const chartHTML = data.map(item => `
        <div class="chart-bar-container" style="display: flex; align-items: center; margin: 0.5rem 0;">
            <div style="width: 120px; font-size: 0.9rem;">${item.label}</div>
            <div style="flex: 1; background: var(--light-gray); border-radius: 10px; overflow: hidden; margin: 0 1rem;">
                <div style="height: 25px; background: linear-gradient(90deg, var(--primary-green), var(--olive-light)); width: ${item.value}%; display: flex; align-items: center; justify-content: end; padding-right: 10px; color: white; font-size: 0.8rem; font-weight: bold; transition: width 1s ease;">
                    ${item.value}%
                </div>
            </div>
        </div>
    `).join('');

    chartContainer.innerHTML = chartHTML;
}

// Probability calculator
function calculateProbability(event, total) {
    return (event / total * 100).toFixed(2);
}

// Interactive probability examples
function showProbabilityExample(type) {
    const examples = {
        coin: {
            title: "Lanzamiento de Moneda",
            description: "Probabilidad de obtener cara: 50%",
            calculation: "P(Cara) = 1/2 = 0.5 = 50%"
        },
        card: {
            title: "Baraja de Cartas",
            description: "Probabilidad de sacar un As: 7.69%",
            calculation: "P(As) = 4/52 ≈ 0.077 = 7.69%"
        },
        dice: {
            title: "Dado de 6 Caras",
            description: "Probabilidad de obtener 6: 16.67%",
            calculation: "P(6) = 1/6 ≈ 0.167 = 16.67%"
        }
    };

    const example = examples[type];
    alert(`${example.title}\n\n${example.description}\n\n${example.calculation}`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize quiz
    initializeQuiz();
    
    // Create data visualization if container exists
    createDataVisualization();
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Simulate data loading for interactive elements
    setTimeout(() => {
        const interactiveElements = document.querySelectorAll('.interactive-demo');
        interactiveElements.forEach(element => {
            element.style.opacity = '1';
        });
    }, 500);
});

// Additional utility functions for enhanced interactivity

// Simulate real-time data updates
function simulateRealTimeData() {
    const dataPoints = document.querySelectorAll('[data-dynamic]');
    dataPoints.forEach(point => {
        const baseValue = parseInt(point.textContent);
        const variation = Math.random() * 10 - 5; // ±5% variation
        const newValue = Math.max(0, Math.round(baseValue + variation));
        point.textContent = newValue;
    });
}

// Set interval for data simulation (every 5 seconds)
setInterval(simulateRealTimeData, 5000);

// Keyboard navigation for quiz
document.addEventListener('keydown', function(event) {
    if (event.key >= '1' && event.key <= '4') {
        const optionIndex = parseInt(event.key) - 1;
        const options = document.querySelectorAll('.quiz-option');
        if (options[optionIndex] && !quizCompleted) {
            selectAnswer(optionIndex);
        }
    }
});

// Touch gestures for mobile (basic swipe detection)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next question
            if (document.getElementById('question-feedback').style.display === 'block') {
                nextQuestion();
            }
        } else {
            // Swipe right - could add previous question functionality
            console.log('Swipe right detected');
        }
    }
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Add performance indicator for educational purposes
    const perfIndicator = document.createElement('div');
    perfIndicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: var(--primary-green);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        z-index: 1000;
        opacity: 0.7;
    `;
    perfIndicator.textContent = `⚡ ${loadTime.toFixed(0)}ms`;
    document.body.appendChild(perfIndicator);
    
    // Hide after 3 seconds
    setTimeout(() => {
        perfIndicator.style.opacity = '0';
        setTimeout(() => perfIndicator.remove(), 500);
    }, 3000);
});