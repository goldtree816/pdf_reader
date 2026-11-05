import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {pick} from '@react-native-documents/picker';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  cachePdf,
  getDocumentId,
  getDocuments,
  saveDocument,
  type PdfDocument,
} from '../utils/documentStore';

type RootStackParamList = {
  MainTabs: undefined;
  PdfViewer: {
    uri: string;
    name: string;
  };
};

type RootTabParamList = {
  Home: undefined;
  Recent: undefined;
  Favorite: undefined;
  Tools: undefined;
};

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  const [recentDocument, setRecentDocument] = useState<PdfDocument | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const loadRecentDocument = async () => {
    const documents = await getDocuments();
    setRecentDocument(documents[0] ?? null);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecentDocument);
    loadRecentDocument();

    return unsubscribe;
  }, [navigation]);

  const openPDF = async () => {
    setIsOpening(true);

    try {
      const result = await pick({
        type: ['application/pdf'],
        allowMultiSelection: false,
      });

      if (!result || result.length === 0) {
        return;
      }

      const file = result[0];

      console.log('SELECTED FILE:', file);

      if (!file.uri) {
        Alert.alert('Error', 'Could not get PDF file URI.');
        return;
      }

      const name = file.name || 'PDF Document';
      const uri = await cachePdf(file.uri, name);
      await saveDocument({
        id: getDocumentId(file.uri, name),
        uri,
        name,
        addedAt: Date.now(),
        size: file.size ?? undefined,
        lastOpenedAt: Date.now(),
      });

      navigation.navigate('PdfViewer', {uri, name});
    } catch (error: any) {
      console.log('PDF PICKER ERROR:', error);

      if (error?.code === 'OPERATION_CANCELED') {
        return;
      }

      Alert.alert(
        'Error',
        'Could not open the PDF file.'
      );
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi Read 👋</Text>

      <Text style={styles.subtitle}>
        Your personal PDF reader
      </Text>

      <TouchableOpacity
        style={styles.openButton}
        onPress={openPDF}
        activeOpacity={0.8}
        disabled={isOpening}
      >
        {isOpening ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Open PDF</Text>
        )}
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {recentDocument?.name || 'No recent PDFs'}
        </Text>

        <Text style={styles.cardText}>
          {recentDocument ? 'Most recently opened' : 'Open a PDF to start reading'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191B',
    paddingHorizontal: 28,
    paddingTop: 55,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    color: '#9295A3',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 40,
  },

  openButton: {
    height: 64,
    backgroundColor: '#EC4F70',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#202228',
    borderRadius: 20,
    padding: 24,
    marginTop: 28,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  cardText: {
    color: '#9295A3',
    fontSize: 16,
    marginTop: 8,
  },
});

export default HomeScreen;