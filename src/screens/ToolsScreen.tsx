import React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {clearDocuments, getDocuments, type PdfDocument} from '../utils/documentStore';

const ToolsScreen = () => {
  const [documents, setDocuments] = useState<PdfDocument[]>([]);

  const loadDocuments = async () => setDocuments(await getDocuments());

  useEffect(() => {
    loadDocuments();
  }, []);

  const clearLibrary = () => {
    Alert.alert('Clear library', 'Remove all recent PDFs and favorites?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Clear', style: 'destructive', onPress: async () => {
        await clearDocuments();
        setDocuments([]);
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      <Text style={styles.subtitle}>Your library</Text>
      <View style={styles.stat}>
        <Text style={styles.statLabel}>Saved documents</Text>
        <Text style={styles.statValue}>{documents.length}</Text>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearLibrary}>
        <Text style={styles.clearText}>Clear library</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1018',
    padding: 24,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 30,
  },

  subtitle: {
    color: '#9295A3',
    fontSize: 16,
    marginTop: 10,
  },
  stat: {
    backgroundColor: '#202228',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    padding: 18,
  },
  statLabel: {color: '#FFFFFF', fontSize: 16},
  statValue: {color: '#EC4F70', fontSize: 18, fontWeight: '700'},
  clearButton: {
    borderColor: '#EC4F70',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  clearText: {color: '#EC4F70', fontSize: 16, fontWeight: '700', textAlign: 'center'},
});

export default ToolsScreen;