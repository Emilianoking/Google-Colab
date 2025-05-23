// Animación de contadores en el hero
function animateCounters() {
    const counters = document.querySelectorAll('.stats span');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target + (counter.getAttribute('data-count').endsWith('+') ? '+' : '');
        }
    });
}

// Copiar código al portapapeles
function copyCode(id) {
    const code = document.getElementById(id).innerText;
    navigator.clipboard.writeText(code);
    
    // Mostrar notificación
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = '<i class="fas fa-check"></i> Código copiado!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Simulador de probabilidades
document.getElementById('run-simulation').addEventListener('click', () => {
    const simType = document.getElementById('sim-type').value;
    const iterations = parseInt(document.getElementById('sim-iterations').value);
    
    let results = {};
    let labels = [];
    
    switch (simType) {
        case 'dado':
            labels = ['1', '2', '3', '4', '5', '6'];
            for (let i = 1; i <= 6; i++) {
                const rolls = Array(iterations).fill().map(() => Math.floor(Math.random() * 6) + 1);
                results[i] = rolls.filter(x => x === i).length;
            }
            break;
            
        case 'moneda':
            labels = ['Cara', 'Sello'];
            const flips = Array(iterations).fill().map(() => Math.floor(Math.random() * 2));
            results['Cara'] = flips.filter(x => x === 0).length;
            results['Sello'] = flips.filter(x => x === 1).length;
            break;
            
        case 'loteria':
            labels = Array(10).fill().map((_, i) => `${i*10+1}-${(i+1)*10}`);
            for (let i = 1; i <= 100; i++) {
                const group = Math.ceil(i / 10) - 1;
                const draws = Array(iterations).fill().map(() => Math.floor(Math.random() * 100) + 1);
                results[labels[group]] = (results[labels[group]] || 0) + draws.filter(x => x === i).length;
            }
            break;
    }
    
    // Actualizar gráfico
    updateSimulationChart(labels, Object.values(results));
    
    // Mostrar estadísticas
    displaySimulationStats(results, iterations);
});

function updateSimulationChart(labels, values) {
    const trace = {
        x: labels,
        y: values,
        type: 'bar',
        marker: {
            color: '#5a4af5'
        }
    };
    
    const layout = {
        title: 'Resultados de la Simulación',
        xaxis: { title: 'Resultado' },
        yaxis: { title: 'Frecuencia' }
    };
    
    Plotly.newPlot('simulator-plot', [trace], layout);
}

function displaySimulationStats(results, iterations) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    for (const [key, value] of Object.entries(results)) {
        const percentage = ((value / iterations) * 100).toFixed(2);
        
        const statElement = document.createElement('div');
        statElement.className = 'sim-stat';
        statElement.innerHTML = `
            <strong>${key}:</strong>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${percentage}%"></div>
            </div>
            <span>${percentage}% (${value}/${iterations})</span>
        `;
        
        container.appendChild(statElement);
    }
}

// Quiz interactivo
let currentQuestion = 0;
let score = 0;
const questions = document.querySelectorAll('.quiz-question');
const quizOptions = document.querySelectorAll('.quiz-option');
const quizResults = document.querySelector('.quiz-results');
const quizScore = document.getElementById('quiz-score');

quizOptions.forEach(option => {
    option.addEventListener('click', () => {
        const isCorrect = option.getAttribute('data-correct') === 'true';
        
        if (isCorrect) {
            option.classList.add('correct');
            score++;
        } else {
            option.classList.add('incorrect');
        }
        
        // Deshabilitar todas las opciones
        quizOptions.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        // Siguiente pregunta o mostrar resultados
        setTimeout(() => {
            currentQuestion++;
            
            if (currentQuestion < questions.length) {
                document.querySelector('.quiz-question.active').classList.remove('active');
                questions[currentQuestion].classList.add('active');
                
                // Resetear opciones
                quizOptions.forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                    opt.style.pointerEvents = 'auto';
                });
            } else {
                // Mostrar resultados
                quizScore.textContent = score;
                document.querySelector('.quiz-question.active').classList.remove('active');
                quizResults.style.display = 'block';
            }
        }, 1000);
    });
});

// Reiniciar quiz
document.getElementById('retry-quiz').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    
    questions[0].classList.add('active');
    quizResults.style.display = 'none';
    
    quizOptions.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
        opt.style.pointerEvents = 'auto';
    });
});

// Inicializar gráficos
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    
    // Gráfico de histograma (edades)
    const ages = Array(1000).fill().map(() => {
        const base = [23, 45, 31, 35, 22];
        return base[Math.floor(Math.random() * base.length)];
    });
    
    const ageTrace = {
        x: ages,
        type: 'histogram',
        marker: { color: '#5a4af5' }
    };
    
    Plotly.newPlot('histogram', [ageTrace], {
        title: 'Distribución de Edades',
        xaxis: { title: 'Edad' },
        yaxis: { title: 'Frecuencia' }
    });
    
    // Gráfico de boxplot (con outlier)
    const boxTrace = {
        y: [5, 8, 6, 9, 8, 5, 10, 7, 6, 6, 100],
        type: 'box',
        name: 'Datos con Outlier',
        marker: { color: '#5a4af5' }
    };
    
    Plotly.newPlot('boxplot', [boxTrace], {
        title: 'Boxplot Mostrando Outlier'
    });
    
    // Simulador de probabilidades (inicial)
    document.getElementById('run-simulation').click();
});