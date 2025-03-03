import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    // No es necesario cargar un modelo aquí en el frontend
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Se necesita permiso para acceder a la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    // Si no hay imagen, tomar una nueva foto
    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      uploadPhoto(photo.uri); // Enviar la URI de la imagen al servidor
    } catch (error) {
      console.error("Error al tomar la foto:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch("http://5.78.72.71:5000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      // Extraer las predicciones y calcular los porcentajes
      const total = result.class_0 + result.class_1 + result.class_2;
      setPredictions({
        Bolso: ((result.class_0 / total) * 100).toFixed(2),
        Lonchera: ((result.class_1 / total) * 100).toFixed(2),
        Maletin: ((result.class_2 / total) * 100).toFixed(2),
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const resetCamera = () => {
    setImage(null);
    setPredictions({});
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.predictionContainer}>
          <TouchableOpacity onPress={resetCamera} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.prediction}>Predicciones:</Text>
          <Text style={styles.prediction}>Bolso: {predictions.Bolso}%</Text>
          <Text style={styles.prediction}>Lonchera: {predictions.Lonchera}%</Text>
          <Text style={styles.prediction}>Maletín: {predictions.Maletin}%</Text>
        </View>
      ) : (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
          <TouchableOpacity onPress={takePhoto} style={styles.takePhotoButton} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tomar Foto</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" },
  camera: { flex: 1, width: "100%", borderRadius: 10, overflow: "hidden" },
  image: { width: 200, height: 200, marginTop: 10, borderRadius: 10 },
  predictionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  prediction: { fontSize: 16, fontWeight: "bold", color: "#333" },
  message: { textAlign: "center", paddingBottom: 10, color: "#FF0000" },
  takePhotoButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    bottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6347",
    borderRadius: 15,
    padding: 5,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
