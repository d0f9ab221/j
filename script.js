// DOM Elements
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const resultContainer = document.getElementById('resultContainer');
const resultImage = document.getElementById('resultImage');
const placeholder = document.getElementById('placeholder');
const downloadBtn = document.getElementById('downloadBtn');
const newPromptBtn = document.getElementById('newPromptBtn');
const loader = document.getElementById('loader');
const chips = document.querySelectorAll('.chip');

// API Endpoint
const API_BASE = 'https://image.pollinations.ai/prompt/';

// Event Listeners
generateBtn.addEventListener('click', handleGenerate);
newPromptBtn.addEventListener('click', resetForm);
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        promptInput.value = chip.dataset.prompt;
        handleGenerate();
    });
});

// Handle Generate
function handleGenerate() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt for the thumbnail.');
        return;
    }

    // UI State: Loading
    setLoading(true);
    
    // Construct URL
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${API_BASE}${encodedPrompt}`;

    // Create a new image object to handle loading
    const tempImg = new Image();
    
    tempImg.addEventListener('load', () => {
        // Success
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Update download link
        downloadBtn.href = imageUrl;
        downloadBtn.hidden = false;
        newPromptBtn.hidden = false;
        
        // Show result container
        resultContainer.classList.add('visible');
        
        setLoading(false);
    });

    tempImg.addEventListener('error', () => {
        // Handle error (API limit, invalid prompt, etc)
        alert('Failed to generate image. Please try a different prompt or check your connection.');
        setLoading(false);
    });

    tempImg.src = imageUrl;
}

function setLoading(isLoading) {
    if (isLoading) {
        generateBtn.disabled = true;
        loader.style.display = 'block';
        generateBtn.querySelector('.btn-text').textContent = 'Generating...';
    } else {
        generateBtn.disabled = false;
        loader.style.display = 'none';
        generateBtn.querySelector('.btn-text').textContent = 'Generate Thumbnail';
    }
}

function resetForm() {
    promptInput.value = '';
    resultImage.src = '';
    resultImage.style.display = 'none';
    placeholder.style.display = 'block';
    resultContainer.classList.remove('visible');
    downloadBtn.hidden = true;
    newPromptBtn.hidden = true;
    promptInput.focus();
}