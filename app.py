from flask import Flask, render_template, request, redirect, jsonify
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join('static', 'uploads')
DATA_FILE = 'data.json'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pdf' not in request.files:
        return 'Nenhum arquivo enviado', 400

    file = request.files['pdf']
    if file.filename == '':
        return 'Nome de arquivo inválido', 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # Atualiza JSON
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    file_url = f'static/uploads/{filename}'
    data.append({'name': filename, 'url': file_url})

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    return jsonify(message='Upload feito com sucesso!', url=file_url)

@app.route('/data.json')
def get_data():
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
