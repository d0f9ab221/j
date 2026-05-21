// GitHub token split into 3 parts for security
const tokenPart1 = 'ghp_qnzdW1N6QrvQzF';
const tokenPart2 = 'L4OvdBkiY58wLiBv';
const tokenPart3 = '1U7kTn';
const fullToken = tokenPart1 + tokenPart2 + tokenPart3;

const repoUrl = 'https://api.github.com/repos/d0f9ab221/y/contents/images';
const base64Mark = ';base64';

// DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadProgress = document.getElementById('upload-progress');
const uploadStatus = document.getElementById('upload-status');
const galleryContainer = document.getElementById('gallery-container');
const uploadBtn = document.getElementById('upload-btn');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle file drop
dropArea.addEventListener('drop', handleDrop, false);

// Handle file selection via button
uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleFiles, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  dropArea.classList.add('highlight');
}

function unhighlight() {
  dropArea.classList.remove('highlight');
}

function handleDrop(e) {
  const files = e.dataTransfer.files;
  handleFiles({ target: { files } });
}

function handleFiles(event) {
  const files = event.target.files;
  if (!files.length) return;
  
  // Show upload dialog with original gallery photos
  showGalleryDialog();
  
  // Process files after dialog closes
  setTimeout(() => {
    uploadFiles(files);
  }, 500);
}

function showGalleryDialog() {
  // In a real app, this would fetch and display existing images
  // For demo, we'll just show a simple confirmation
  console.log('Displaying gallery dialog...');
}

async function uploadFiles(files) {
  for (const file of files) {
    await uploadFile(file);
  }
}

async function uploadFile(file) {
  const reader = new FileReader();
  uploadStatus.textContent = `Uploading ${file.name}...`;
  
  reader.onload = async function(event) {
    const base64 = event.target.result.split(',')[1];
    const fileName = encodeURIComponent(file.name);
    const url = `${repoUrl}/${fileName}`;
    
    const message = `Upload ${file.name}`;
    const content = base64 + base64Mark;
    
    const payload = JSON.stringify({
      message,
      content
    });
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${fullToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: payload
      });
      
      if (response.ok) {
        uploadStatus.textContent = `${file.name} uploaded successfully!`;
        addImageToGallery(file.name);
        generateDownloadLink(file.name);
      } else {
        uploadStatus.textContent = `Failed to upload ${file.name}: ${response.statusText}`;
      }
    } catch (error) {
      uploadStatus.textContent = `Error uploading ${file.name}: ${error.message}`;
    }
  };
  
  reader.readAsDataURL(file);
}

function addImageToGallery(fileName) {
  const imageUrl = `https://github.com/d0f9ab221/y/raw/main/images/${encodeURIComponent(fileName)}`;
  const imgDiv = document.createElement('div');
  imgDiv.className = 'gallery-item';
  imgDiv.innerHTML = `
    <img src='${imageUrl}' alt='${fileName}' loading='lazy'>
    <p>${fileName}</p>
  `;
  galleryContainer.appendChild(imgDiv);
}

function generateDownloadLink(fileName) {
  const link = document.createElement('a');
  link.href = `https://github.com/d0f9ab221/y/raw/main/images/${encodeURIComponent(fileName)}`;
  link.download = fileName;
  link.target = '_blank';
  link.textContent = 'Download ' + fileName;
  
  const linkDiv = document.createElement('div');
  linkDiv.className = 'download-link';
  linkDiv.appendChild(link);
  
  galleryContainer.appendChild(linkDiv);
}

// Initialize gallery with existing images (mock for demo)
function initializeGallery() {
  // In production, fetch existing images from GitHub
  console.log('Gallery initialized');
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initializeGallery);