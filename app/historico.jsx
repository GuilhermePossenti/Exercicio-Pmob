// app/historico.jsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Linking, Share, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Historico() {
  const { qrList } = useLocalSearchParams();
  const [qrListArray, setQrListArray] = useState([]);

  useEffect(() => {
    if (qrList) {
      setQrListArray(JSON.parse(qrList));
    } else {
      setQrListArray([]);
    }
  }, [qrList]);

  const handleShare = async (content) => {
    try {
      await Share.share({
        message: content,
      });
    } catch (error) {
      console.error("Erro ao compartilhar", error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.listItem}>
        <Text 
          style={[styles.listText, item.isUrl && styles.urlText]}
          onPress={() => item.isUrl && Linking.openURL(item)}
          onLongPress={() => handleShare(item)}
        >
          {`${index + 1}. ${item}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.historyContainer}>
      <FlatList
        data={qrListArray}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum QR Code escaneado ainda
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    color: "#000",
  },
  urlText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  shareButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  }
});
