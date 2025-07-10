const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const pdfList = document.getElementById('pdfList');

// Clique para abrir seletor
dropzone.addEventListener('click', () => fileInput.click());

// Drag & drop
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});
dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  handleUpload(files[0]);
});

// Input manual
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  handleUpload(file);
});

// Upload PDF
async function handleUpload(file) {
  if (!file || file.type !== 'application/pdf') {
    alert('Por favor, envie um arquivo PDF válido.');
    return;
  }

  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  alert(result.message);
  loadPDFs();
}

// Carregar PDFs do JSON
async function loadPDFs() {
  const res = await fetch('/data.json');
  const data = await res.json();

  pdfList.innerHTML = '';
  data.reverse().forEach(pdf => {
    const item = document.createElement('div');
    item.className = 'pdf-item';

    const name = document.createElement('span');
    name.textContent = pdf.name;

    const link = document.createElement('a');
    link.href = '/' + pdf.url;
    link.target = '_blank';
    link.textContent = 'Visualizar';

    item.appendChild(name);
    item.appendChild(link);
    pdfList.appendChild(item);
  });
}

loadPDFs();