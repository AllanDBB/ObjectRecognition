import os
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Cargar el modelo TFLite
interpreter = tf.lite.Interpreter(model_path='model8.tflite')
interpreter.allocate_tensors()

# Crear un directorio para guardar las imágenes si no existe
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_image(image_path):
    """Preparar la imagen para que sea compatible con el modelo."""
    img = Image.open(image_path).resize((224, 224))  # Ajustar tamaño
    img = np.array(img, dtype=np.float32) / 255.0  # Normalizar
    img = np.expand_dims(img, axis=0)  # Agregar batch dimension
    return img

@app.route('/predict', methods=['POST'])
def predict():
    print("Llegó solicitud")
    """Ruta que recibe una imagen y devuelve las predicciones."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    print("Procesado.")
    try:
        # Leer la imagen tal como fue subida
        img = file.read()
        
        # Guardar la imagen en el directorio uploads como photo.jpg
        file_path = os.path.join(UPLOAD_FOLDER, 'photo.jpg')
        with open(file_path, 'wb') as f:
            f.write(img)

        # Preparar la imagen para el modelo
        img_array = preprocess_image(file_path)

        # Ejecutar la predicción con el modelo TFLite
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        interpreter.set_tensor(input_details[0]['index'], img_array)
        interpreter.invoke()

        # Obtener la predicción
        predictions = interpreter.get_tensor(output_details[0]['index'])

        # Convertir las predicciones a porcentajes
        percentages = (predictions[0] / np.sum(predictions)) * 100
        
        print(percentages)
        # Convertir a tipo float para que sea serializable en JSON
        result = {f'class_{i}': float(round(percent, 2)) for i, percent in enumerate(percentages)}
        print("Procesado2.")
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)