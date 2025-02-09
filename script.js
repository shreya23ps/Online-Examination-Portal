// DOM Elements
const loginPage = document.getElementById('loginPage');
const testPage = document.getElementById('testPage');
const resultPage = document.getElementById('resultPage');
const webcamContainer = document.getElementById('webcamContainer');
const webcamVideo = document.getElementById('webcam');
const capturedCanvas = document.createElement('canvas');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const termsCheckbox = document.getElementById('terms');
const startTestButton = document.getElementById('startTest');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitTestButton = document.getElementById('submitTest');
const timerDisplay = document.getElementById('timeLeft');
const resultText = document.getElementById('resultText');
const downloadResultButton = document.getElementById('downloadResult');
const questionContainer = document.getElementById('questionContainer');
const questionNumberDisplay = document.getElementById('questionNumber');
const questionMatrix = document.getElementById('questionMatrix');

// Variables
let userName = "";
let capturedImage = null;
let currentQuestionIndex = 0;
let selectedAnswers = [];
let attemptedQuestions = new Set();
let timer;
let timeRemaining = 2 * 60; // 10 minutes
let timeElapsed = 0;
let startTime;
let imageCaptured = false;
let testStarted = false; // Prevents duplicate starts

// Questions Array
const questions = [
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Mars"],
        correctAnswer: "Jupiter"
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
        correctAnswer: "William Shakespeare"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O"
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "South Korea", "Thailand"],
        correctAnswer: "Japan"
    },
    {
        question: "What is the smallest prime number?",
        options: ["1", "2", "3", "5"],
        correctAnswer: "2"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
        correctAnswer: "Leonardo da Vinci"
    },
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        correctAnswer: "Hydrogen"
    },
    {
        question: "What is the longest river in the world?",
        options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
        correctAnswer: "Nile River"
    },
    {
        question: "Who developed the theory of relativity?",
        options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"],
        correctAnswer: "Albert Einstein"
    },
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correctAnswer: "Canberra"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: "Pacific Ocean"
    },
    {
        question: "Who is known as the father of computers?",
        options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"],
        correctAnswer: "Charles Babbage"
    },
    {
        question: "What is the currency of Japan?",
        options: ["Yuan", "Won", "Yen", "Ringgit"],
        correctAnswer: "Yen"
    },
    {
        question: "Which gas is most abundant in the Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
        correctAnswer: "Nitrogen"
    },
    {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        correctAnswer: "Ottawa"
    },
    {
        question: "Who wrote '1984'?",
        options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "J.K. Rowling"],
        correctAnswer: "George Orwell"
    },
    {
        question: "What is the square root of 64?",
        options: ["6", "8", "10", "12"],
        correctAnswer: "8"
    },
    {
        question: "Which country is famous for inventing pizza?",
        options: ["France", "Italy", "Spain", "Greece"],
        correctAnswer: "Italy"
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Graphite"],
        correctAnswer: "Diamond"
    },
    {
        question: "Who discovered penicillin?",
        options: ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Joseph Lister"],
        correctAnswer: "Alexander Fleming"
    },
    {
        question: "What is the capital of Brazil?",
        options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        correctAnswer: "Brasília"
    },
    {
        question: "Which animal is known as the 'King of the Jungle'?",
        options: ["Lion", "Tiger", "Elephant", "Gorilla"],
        correctAnswer: "Lion"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: "Blue Whale"
    }
];
// Enable Start Test button when all fields are filled
function toggleStartTestButton() {
    startTestButton.disabled = !(nameInput.value.trim() && passwordInput.value.trim() && termsCheckbox.checked);
}

// Event Listeners
nameInput.addEventListener('input', toggleStartTestButton);
passwordInput.addEventListener('input', toggleStartTestButton);
termsCheckbox.addEventListener('change', toggleStartTestButton);

// Start Test
function startTest() {
    if (testStarted) return; // Prevent multiple test starts
    testStarted = true;

    userName = nameInput.value.trim();
    if (!userName) {
        alert("Please enter your name.");
        return;
    }

    loginPage.classList.add('hidden');
    testPage.classList.remove('hidden');
    webcamContainer.classList.remove('hidden');

    startTimer();
    startWebcam();
    createQuestionMatrix();
    loadQuestion();  // Ensure the first question loads
}

// Start Timer
function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        timeRemaining--;
        timeElapsed++;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Notify user about image capture in the first 10 seconds
        if (timeElapsed === 5) {
            alert("Your image will be captured after 5 seconds. Please stay still!");
        }

        // Capture image only once within the first 10 seconds
        if (!imageCaptured && timeElapsed <= 10) {
            setTimeout(() => {
                captureImage();
                imageCaptured = true; // Ensure the image is captured only once
            }, 5000); // Delay of 5 seconds to ensure the webcam is ready
        }

        // Stop the timer when time runs out
        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert("Time's up! Your test will be submitted.");
            submitTest();
        }
    }, 1000);
}
// Start Webcam
function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            webcamVideo.srcObject = stream;
            webcamVideo.play(); // Ensure the video is playing
        })
        .catch(err => {
            alert("Webcam access denied. Test cannot start.");
            startTestButton.disabled = true;
        });
}

// Capture Image from Webcam (Only Once)
function captureImage() {
    const context = capturedCanvas.getContext('2d');
    capturedCanvas.width = webcamVideo.videoWidth;
    capturedCanvas.height = webcamVideo.videoHeight;
    context.drawImage(webcamVideo, 0, 0, webcamVideo.videoWidth, webcamVideo.videoHeight);

    // Convert the captured image to a data URL
    capturedImage = capturedCanvas.toDataURL('image/png');
    console.log("Image captured:", capturedImage); // Debugging: Check if the image is captured
}

// Load Question
function loadQuestion() {
    const question = questions[currentQuestionIndex];

    questionContainer.innerHTML = `
        <div class="question-card">
            <h4>${question.question}</h4>
            ${question.options.map((option) => `
                <label class="option-card">
                    <input type="radio" name="option" value="${option}" onclick="selectOption('${option}')">
                    ${option}
                </label>
            `).join('')}
        </div>
    `;

    prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    nextBtn.classList.toggle('hidden', currentQuestionIndex === questions.length - 1);
    submitTestButton.classList.toggle('hidden', currentQuestionIndex !== questions.length - 1); // Show submit button on last question
    questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}
// Select Answer
function selectOption(option) {
    selectedAnswers[currentQuestionIndex] = option;
    attemptedQuestions.add(currentQuestionIndex);
    updateQuestionMatrix();
}

// Next & Previous Question
function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function showPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

// Create Question Matrix
function createQuestionMatrix() {
    questionMatrix.innerHTML = "";
    for (let i = 0; i < questions.length; i++) {
        const questionItem = document.createElement('div');
        questionItem.classList.add('question-item');
        questionItem.textContent = i + 1;
        questionItem.addEventListener('click', () => {
            currentQuestionIndex = i;
            loadQuestion();
        });
        questionMatrix.appendChild(questionItem);
    }
}

// Update Question Matrix Colors
function updateQuestionMatrix() {
    const questionItems = document.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
        item.classList.toggle('attempted', attemptedQuestions.has(index));
    });
}


// Submit Test
function submitTest() {
    testPage.classList.add('hidden');
    webcamContainer.classList.add('hidden');
    resultPage.classList.remove('hidden');

    const correctAnswersCount = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const percentage = (correctAnswersCount / questions.length) * 100;

    resultText.innerHTML = `
        <h2>🎉 Test Results 🎉</h2>
        <table border="1">
            <tr><th>Name</th><td>${userName}</td></tr>
            <tr><th>Score</th><td>${correctAnswersCount} / ${questions.length}</td></tr>
            <tr><th>Time Taken</th><td>${Math.floor(timeElapsed / 60)} min ${timeElapsed % 60} sec</td></tr>
            <tr><th>Questions Attempted</th><td>${attemptedQuestions.size} / ${questions.length}</td></tr>
        </table>
        <div class="circular-progress">
            <svg>
                <circle cx="75" cy="75" r="70"></circle>
                <circle cx="75" cy="75" r="70" style="stroke-dasharray: 440; stroke-dashoffset: ${440 - (440 * percentage) / 100};"></circle>
            </svg>
            <div class="progress-text">${Math.round(percentage)}%</div>
        </div>
        <h3>Captured Image:</h3>
        <div id="capturedImageContainer">
            ${capturedImage ? `<img src="${capturedImage}" alt="Captured Image" style="max-width: 20%; border-radius: 8px; margin-top: 10px;" />` : "No image captured."}
        </div>
    `;

    // Enable the download button
    downloadResultButton.classList.remove('hidden');
    downloadResultButton.addEventListener('click', downloadResult);
}
// Download Result File with Captured Images
function downloadResult() {
    let resultHTML = `
        <html>
        <head>
            <title>Test Results</title>
            <style>
                body { font-family: 'Poppins', sans-serif; background: #f0f4f8; padding: 20px; }
                h1 { color: #2c3e50; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background: #3498db; color: white; }
                img { max-width: 100%; border-radius: 8px; margin-top: 10px; }
            </style>
        </head>
        <body>
        <h1>Test Results</h1>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Score:</strong> ${selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length} / ${questions.length}</p>
        <p><strong>Time Taken:</strong> ${Math.floor(timeElapsed / 60)} min ${timeElapsed % 60} sec</p>
        <h2>Captured Image:</h2>
    `;

    // Include the captured image in the downloaded file
    if (capturedImage) {
        resultHTML += `<p>Captured Image: <br> <img src="${capturedImage}" width="200" /></p>`;
        console.log("Image included in downloaded file:", capturedImage); // Debugging: Check if the image is included
    } else {
        resultHTML += `<p>No image captured.</p>`;
    }

    resultHTML += `</body></html>`;

    const blob = new Blob([resultHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${userName}_test_results.html`;
    link.click();
}
// Prevent Tab Switching (Auto Submit)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        alert("You switched tabs! The test is now submitted.");
        submitTest();
    }
});

// Disable Right Click, Copy, Paste, Cut
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('copy', event => event.preventDefault());
document.addEventListener('paste', event => event.preventDefault());
document.addEventListener('cut', event => event.preventDefault());

// Initialize App
startTestButton.addEventListener('click', startTest);
nextBtn.addEventListener('click', showNextQuestion);
prevBtn.addEventListener('click', showPrevQuestion);
submitTestButton.addEventListener('click', submitTest);
