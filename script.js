const typingTest = document.querySelector('.typing-test p');
const input = document.querySelector('.input-field');
const timeDisplay = document.querySelector('.time span b');
const mistakesDisplay = document.querySelector('.mistake span');
const wpmDisplay = document.querySelector('.wpm span');
const cpmDisplay = document.querySelector('.cpm span');
const button = document.querySelector('.button');

const paragraphs = [
    "A well-organized paragraph supports or develops a single controlling idea.",
    "A topic sentence has several important functions and unifies the content.",
    "In some cases, it is effective to place another sentence before the topic sentence.",
    "Readers generally look to the first few sentences in a paragraph to determine the subject.",
    "That’s why it’s often best to put the topic sentence at the very beginning."
];

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let startTime = 0; // to track the start time of the test

// Function to load a random paragraph
function loadParagraph() {
    typingTest.innerHTML = '';
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    const paragraph = paragraphs[randomIndex];
    
    paragraph.split('').forEach(char => {
        const span = `<span>${char}</span>`;
        typingTest.innerHTML += span;
    });
    typingTest.querySelectorAll('span')[0].classList.add('active');
    document.addEventListener('keydown', () => input.focus());
    typingTest.addEventListener('click', () => input.focus());
}

// Handle user input typing
function initTyping(event) {
    const chars = typingTest.querySelectorAll('span');
    const typedChar = input.value.charAt(charIndex);

    if (!isTyping && timeLeft > 0) {
        // Start timer when the user starts typing
        startTime = Date.now();
        timer = setInterval(initTime, 1000);
        isTyping = true;
    }

    // Handle backspace
    if (event.inputType === 'deleteContentBackward' && charIndex > 0) {
        charIndex--;
        const prevChar = chars[charIndex];
        
        if (prevChar.classList.contains('incorrect')) {
            mistakes--; // Correct mistake count if needed
        }
        
        prevChar.classList.remove('correct', 'incorrect');
        prevChar.classList.add('active');
        
        if (charIndex < chars.length) {
            chars[charIndex].classList.remove('active');
        }
        
        mistakesDisplay.innerText = mistakes;
        cpmDisplay.innerText = charIndex - mistakes;
        return;
    }

    if (charIndex < chars.length && timeLeft > 0) {
        if (typedChar === chars[charIndex].innerText) {
            chars[charIndex].classList.add('correct');
        } else {
            if (!chars[charIndex].classList.contains('incorrect')) {
                mistakes++;
            }
            chars[charIndex].classList.add('incorrect');
        }

        charIndex++;

        if (charIndex < chars.length) {
            chars[charIndex].classList.add('active');
        }

        mistakesDisplay.innerText = mistakes;
        cpmDisplay.innerText = charIndex;

        if (charIndex === chars.length) {
            // When typing is complete, stop the timer
            clearInterval(timer);
            const totalTime = (Date.now() - startTime) / 1000; // Time in seconds
            const wordsPerMinute = Math.round(((charIndex - mistakes) / 5) / (totalTime / 60));
            wpmDisplay.innerText = wordsPerMinute;
            input.disabled = true; // Disable input after test completion
        }
    }
}

// Timer Function
function initTime() {
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplay.innerText = timeLeft;
    } else {
        clearInterval(timer);
        input.disabled = true; // Disable input if time is over
    }
}

// Reset Function
function resetTest() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    input.disabled = false;
    input.value = '';
    timeDisplay.innerText = timeLeft;
    mistakesDisplay.innerText = 0;
    wpmDisplay.innerText = 0;
    cpmDisplay.innerText = 0;
}

// Restart button functionality
button.addEventListener('click', resetTest);

// Load the first paragraph
loadParagraph();

// Input event listener
input.addEventListener('input', initTyping);
