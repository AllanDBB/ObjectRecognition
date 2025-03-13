import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa la librería de íconos

export default function TiendasScreen() {
  const [coordinates, setCoordinates] = useState(null);

  const handleNavigationChange = (navState) => {
    const url = navState.url;
    const regex = /@([-\d.]+),([-\d.]+)/;
    const match = url.match(regex);

    if (match) {
      const lat = match[1];
      const lng = match[2];
      setCoordinates({ lat, lng });
      console.log('Coordenadas:', { lat, lng });
    }
  };

  const openWaze = () => {
    if (coordinates) {
      const { lat, lng } = coordinates;
      const wazeURL = `waze://?ll=${lat},${lng}&navigate=yes`;
      const googleMapsURL = `https://www.google.com/maps?q=${lat},${lng}`;

      Linking.canOpenURL(wazeURL).then((supported) => {
        if (supported) {
          Linking.openURL(wazeURL);
        } else {
          Linking.openURL(googleMapsURL);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://www.google.com/maps/search/tienda+de+bolsos+cerca' }}
        style={styles.webView}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onNavigationStateChange={handleNavigationChange} 
      />
      
      {coordinates && (
        <View style={styles.coordinatesContainer}>
          <TouchableOpacity style={styles.button} onPress={openWaze}>
            {/* Ícono de Waze con el texto */}
            <Icon name="map-signs" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Abrir en Waze</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webView: {
    flex: 1,
  },
  coordinatesContainer: {
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#3A61C2',
    padding: 10,
    borderRadius: 5,
    bottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,  
  },
  icon: {
    marginRight: 10, 
  },
});
