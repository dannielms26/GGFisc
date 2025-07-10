const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

function handleDrop(event) {
  event.preventDefault();
  handleFiles(event.dataTransfer.files);
}

function handleFiles(files) {
  selectedFiles = [];
  for (let file of files) {
    if (file.type === "application/pdf") {
      selectedFiles.push(file);
    }
  }
  renderFiles();
}

function renderFiles() {
  fileList.innerHTML = "";
  selectedFiles.forEach(file => {
    const li = document.createElement("li");
    li.textContent = "📄 " + file.name;
    fileList.appendChild(li);
  });
}

function goToNext() {
  if (selectedFiles.length === 0) {
    alert("Selecione ao menos um arquivo PDF.");
    return;
  }

  const readerPromises = selectedFiles.map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ name: file.name, dataUrl: reader.result });
      };
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readerPromises).then(results => {
    sessionStorage.setItem("pdfFiles", JSON.stringify(results));
    window.location.href = "converter.html";
  });
}
