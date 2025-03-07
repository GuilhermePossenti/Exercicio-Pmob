import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Historico() {
  const { qrList } = useLocalSearchParams();
  const [qrListArray, setQrListArray] = useState([]);

  useEffect(() => {
    if (qrList) {
      setQrListArray(JSON.parse(qrList));
    } else {
      setQrListArray([]);
    }
  }, [qrList]); // Executa quando qrList mudar
}
const renderItem = async ({ item, index }) => {
  const validURL = await Linking.canOpenURL(item);

  if (validURL) {
    return (
      <View style={styles.listItem}>
        <Text
          style={[
            styles.listText,
            { color: "blue", textDecorationLine: "underline" },
          ]}
          onPress={() => Linking.openURL(item)}
        >
          {item}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{`${index + 1}. ${item}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 16,
  },
});