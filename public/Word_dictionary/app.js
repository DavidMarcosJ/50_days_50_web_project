document.addEventListener('DOMContentLoaded', () => {
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
//let apiKey = '771aa8f7-d363-4ff0-a824-10181a86ac47';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let wordBox = document.querySelector('.words_and_meaning');
 //const tableBody = document.querySelector('#tableData');
let i = 0;
let oldLength = 0;

    function myFunction() {
        const str = input.value;
        if (oldLength !== str.length) {
            oldLength = str.length;
            const strToSearch = str.split(' ').pop();
            getData(strToSearch);
        }
    }

    setInterval(myFunction, 5000);

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            input.value = transcript;
        });

        recognition.addEventListener('end', recognition.start);
        recognition.start();
    } else {
        console.log('Speech Recognition API not supported in this browser.');
    }

    searchBtn.addEventListener('click', e => {
        e.preventDefault();
        clearData();
        const word = input.value.trim();
        if (word === '') {
            alert('Word is required');
            return;
        }
        const wordToSearch = word.split(' ').pop();
        getData(wordToSearch);
    });

    function clearData() {
        audioBox.innerHTML = '';
        notFound.innerText = '';
        defBox.innerText = '';
    }

    async function getData(word) {
        loading.style.display = 'block';
        try {
            const response = await fetch(`${apiUrl}?word=${word}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            loading.style.display = 'none';
            if (!data.length) {
                notFound.innerText = 'No result found';
                return;
            }
            if (typeof data[0] === 'string') {
                displaySuggestions(data);
                return;
            }
            displayDefinition(data[0], word);
        } catch (error) {
            loading.style.display = 'none';
            notFound.innerText = 'Error fetching data';
            console.error('Error fetching data:', error);
        }
    }

    function displaySuggestions(suggestions) {
        const heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('span');
            suggestionElement.classList.add('suggested');
            suggestionElement.innerText = suggestion;
            notFound.appendChild(suggestionElement);
        });
    }

    function displayDefinition(data, word) {
        const definition = data.shortdef[0];
        defBox.innerText = definition;

        const wordElement = document.createElement('span');
        const meaningElement = document.createElement('span');
        const br = document.createElement('br');

        wordElement.classList.add('suggested');
        meaningElement.classList.add('suggested');
        wordElement.innerHTML = word;
        meaningElement.innerHTML = definition;

        wordBox.appendChild(wordElement);
        wordBox.appendChild(meaningElement);
        wordBox.appendChild(br);
    }
});
