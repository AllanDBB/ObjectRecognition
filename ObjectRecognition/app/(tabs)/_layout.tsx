import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BackHandler } from 'react-native';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: 'white', 
        drawerInactiveTintColor: 'gray', 
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' }, 
        drawerStyle: { backgroundColor: '#1e1e1e', width: 250 }, 
        headerStyle: { backgroundColor: '#3A61C2' }, 
        headerTintColor: 'white', 
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          title: 'Camera',
          drawerIcon: ({ color }) => <IconSymbol size={28} name="camera.fill" color={color} />,
        }}
      />
        <Drawer.Screen
        name="stores"
        options={{
          title: 'Tiendas',
          drawerIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      
      <Drawer.Screen
        name="close"
        options={{
          title: 'Cerrar',
          drawerIcon: ({ color }) => <IconSymbol size={28} name="xmark.circle.fill" color={color} />,
  
          drawerItemStyle: { marginTop: 'auto' }, 
          drawerLabelStyle: { color: 'red' }, 
          headerShown: false, 
        }}
      />
      
    </Drawer>
  );
}
