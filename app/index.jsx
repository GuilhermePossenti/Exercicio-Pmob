// app/index.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Camera } from "expo-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [qrList, setQrList] = useState([]);
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    loadQrList();
  }, []);

  const loadQrList = async () => {
    try {
      const savedList = await AsyncStorage.getItem('qrList');
      if (savedList) {
        setQrList(JSON.parse(savedList));
      }
    } catch (error) {
      console.error('Erro ao carregar lista de QR:', error);
    }
  };

  const saveQrList = async (newList) => {
    try {
      await AsyncStorage.setItem('qrList', JSON.stringify(newList));
    } catch (error) {
      console.error('Erro ao salvar lista de QR:', error);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setQrData(data);
    
    const newList = [...qrList, data];
    setQrList(newList);
    saveQrList(newList);

    Alert.alert(
      "QR Code Escaneado",
      `Conteúdo: ${data}`,
      [{ text: "OK", onPress: () => console.log("OK pressionado") }]
    );
  };

  const irParaHistorico = () => {
    router.push({
      pathname: "/historico",
      params: { qrList: JSON.stringify(qrList) },
    });
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.text}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={facing === 'back' ? Camera.Constants.Type.back : Camera.Constants.Type.front}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <TouchableOpacity
        style={styles.flipButton}
        onPress={() => setFacing(current => current === "back" ? "front" : "back")}
      >
        <Ionicons name="camera-reverse" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          Total de QR Codes: {qrList.length}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        {scanned && (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setScanned(false)}
            >
              <Ionicons name="scan" size={24} color="white" />
              <Text style={styles.text}>Novo Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={irParaHistorico}
            >
              <Ionicons name="list" size={24} color="white" />
              <Text style={styles.text}>Histórico</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {qrData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Último QR: {qrData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 8,
  },
  flipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },
  counterContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  counterText: {
    fontSize: 16,
    color: "#555",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  resultText: {
    fontSize: 16,
    color: "#000",
    textAlign: 'center',
  },
  message: {
    color: 'white',
    textAlign: "center",
    padding: 20,
  }
});
