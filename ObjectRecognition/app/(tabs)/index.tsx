import { View, Text, StyleSheet, Image } from 'react-native';

export default function InitScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/ObjectRecognition.png')} 
      style={{width: 300, height: 300}}/>

      <Text style={styles.title}>¡BIENVENIDO!</Text>
      <Text style={styles.title}>BackPack APP</Text>
      <Text style={styles.subtitle}>¡Identifica y busca distintos tipos de bolsos!</Text>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00008b',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20,
  },

  subtitle: {
    fontSize: 20,
    color: '#6495ed',
    textAlign: 'center',
    marginTop:20,
    marginLeft: 30,
    marginRight:30,
  },
});
