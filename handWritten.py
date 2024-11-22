import cv2
import numpy as np
import pytesseract
from keras import Model
from keras import layers 

# Configure Tesseract path if required
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

# Function to preprocess image
def preprocess_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    # Resize the image to a fixed size
    image = cv2.resize(image, (128, 32))
    # Normalize the pixel values
    image = image / 255.0
    image = np.expand_dims(image, axis=-1)  # Add channel dimension
    return np.expand_dims(image, axis=0)  # Add batch dimension

# Build CRNN model
def build_crnn_model(input_shape, num_classes):
    inputs = layers.Input(shape=input_shape)

    # Convolutional Layers
    x = layers.Conv2D(64, (3, 3), activation="relu", padding="same")(inputs)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Conv2D(128, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)

    # Reshape for LSTM
    x = layers.Reshape((-1, x.shape[-1] * x.shape[-2]))(x)

    # Bidirectional LSTM
    x = layers.Bidirectional(layers.LSTM(128, return_sequences=True))(x)
    x = layers.Bidirectional(layers.LSTM(128, return_sequences=True))(x)

    # Output Layer
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    return Model(inputs, outputs)

# OCR using Tesseract
def recognize_text_tesseract(image_path):
    image = cv2.imread(image_path)
    text = pytesseract.image_to_string(image)
    return text

# Example Usage
if __name__ == "__main__":
    # Path to handwritten text image
    image_path = "handwritten.jpeg"

    # Preprocess the image
    preprocessed_image = preprocess_image(image_path)

    # Create and summarize the CRNN model
    input_shape = (32, 128, 1)  # Image dimensions (height, width, channels)
    num_classes = 80  # Adjust based on your dataset's vocabulary
    crnn_model = build_crnn_model(input_shape, num_classes)
    crnn_model.summary()

    # Recognize text using Tesseract OCR
    recognized_text = recognize_text_tesseract(image_path)
    print("Recognized Text:")
    print(recognized_text)
