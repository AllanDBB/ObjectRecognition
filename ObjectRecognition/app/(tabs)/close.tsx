// app/close.js
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CloseScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const closeApp = () => {
      BackHandler.exitApp();
      return true; 
    };

    closeApp();

    return () => {
    };
  }, []);

  return null; 
};

export default CloseScreen;
