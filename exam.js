const Exam = {
    questions: [
        {
            id: 1,
            text: "Which HTML5 element is used to specify a footer for a document or section?",
            options: ["<footer>", "<bottom>", "<section>", "<end>"]
        },
        {
            id: 2,
            text: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"]
        },
        {
            id: 3,
            text: "Inside which HTML element do we put the JavaScript?",
            options: ["<script>", "<js>", "<javascript>", "<scripting>"]
        }
    ],
    currentQuestionIndex: 0,

    start() {
        console.log("Exam Started");
        this.loadQuestion(0);
        this.startTimer(60 * 60); // 60 minutes
    },

    loadQuestion(index) {
        if (index >= this.questions.length) {
            this.finishExam();
            return;
        }

        const q = this.questions[index];
        document.getElementById('question-text').textContent = `Question ${index + 1}: ${q.text}`;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; // Clear previous

        q.options.forEach((opt, i) => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="radio" name="q${q.id}" value="${i}">
                ${opt}
            `;
            optionsContainer.appendChild(label);
        });

        // Toggle buttons
        if (index === this.questions.length - 1) {
            document.getElementById('next-btn').classList.add('hidden');
            document.getElementById('submit-btn').classList.remove('hidden');
        } else {
            document.getElementById('next-btn').classList.remove('hidden');
            document.getElementById('submit-btn').classList.add('hidden');
        }
    },

    next() {
        this.currentQuestionIndex++;
        this.loadQuestion(this.currentQuestionIndex);
    },

    finishExam() {
        alert("Exam Submitted! (Mock)");
        // In real app, redirect or show score
    },

    startTimer(duration) {
        let timer = duration, minutes, seconds;
        const display = document.getElementById('time-display');

        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = 0;
                alert("Time's up!");
            }
        }, 1000);
    }
};

document.getElementById('next-btn').addEventListener('click', () => Exam.next());
document.getElementById('submit-btn').addEventListener('click', () => Exam.finishExam());
window.Exam = Exam;
