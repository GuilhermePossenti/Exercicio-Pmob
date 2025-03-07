import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CameraView } from "expo-camera";

export default function Index() {
  const router = useRouter();
  const [qrList, setQrList] = useState([
    "https://videira.ifc.edu.br",
    "https://reactnative.dev",
  ]);
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleCamera = ({ data }) => {
    setScanned(true);
    setQrData(data);
    setQrList((prevList) => [...prevList, data]);
    Alert.alert(
      "QR CODE Escaneado",
      `Conteúdo: ${data}`,
      [
        { text: "OK", onPress: () => console.log('OK') }
      ]
    );
  };

  if (!permission) {
    return <View />;
  }

  // Se a permissão não foi concedida, mostra uma tela solicitando permissão
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
   // Função executada quando um QR Code é detectado pela câmera
   const handleBarCodeScanned = ({ type, data }) => {
    // Marca como escaneado para parar de processar a câmera
    setScanned(true);
    
    // Armazena o conteúdo do QR Code
    setQrData(data);
    
    // Adiciona o QR Code à lista de códigos escaneados
    setQrList((prevList) => [...prevList, data]);
    
    // Exibe um alerta com o conteúdo do QR Code
    Alert.alert("QR Code Escaneado", `Conteúdo: ${data}`, [
      { text: "OK", onPress: () => console.log("OK pressed") },
    ]);
  };

  const irParaHistorico = () => {
    console.log(qrList);
    router.push({
      pathname: "/historico",
      params: { qrList: JSON.stringify(qrList) },
    });
  };

  return (
    <View style={styles.container}>
      {/* Componente de visualização da câmera */}
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      
      {/* Container para os botões de controle */}
      <View style={styles.controlsContainer}>
        {/* Botão para inverter a câmera */}
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Inverter Câmera</Text>
        </TouchableOpacity>
        
        {/* Botões que aparecem após escanear um QR Code */}
        {scanned && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.text}>Escanear Novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={irParaHistorico}>
              <Text style={styles.text}>Ver Histórico</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {/* Exibe o último QR Code escaneado, se houver */}
      {qrData !== "" && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Último QR lido: {qrData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilo do container principal
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  // Estilo para mensagens de texto
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  // Estilo da visualização da câmera
  camera: {
    flex: 8, // 80% da tela para a câmera
  },
  // Estilo do container inferior
  bottomContainer: {
    flex: 2, // 20% da tela para controles e resultado
    backgroundColor: "#fff",
  },
  // Estilo do container de botões de controle
  controlsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  // Estilo dos botões
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    minWidth: 100, // Garante que os botões tenham largura mínima
  },
  // Estilo do texto dos botões
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  // Estilo do container que exibe o resultado do escaneamento
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  // Estilo do texto de resultado
  resultText: {
    fontSize: 16,
    color: "#000",
  },
});