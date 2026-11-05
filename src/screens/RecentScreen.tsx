import React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import DocumentRow from '../components/DocumentRow';
import {getDocuments, toggleFavorite, type PdfDocument} from '../utils/documentStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<{Recent: undefined}>,
  NativeStackScreenProps<{PdfViewer: {uri: string; name: string}}>
>;

const RecentScreen = ({navigation}: Props) => {
  const [documents, setDocuments] = useState<PdfDocument[]>([]);

  const loadDocuments = async () => setDocuments(await getDocuments());

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDocuments);
    loadDocuments();
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent</Text>
      <FlatList
        data={documents}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No PDFs opened yet.</Text>}
        renderItem={({item}) => (
          <DocumentRow
            document={item}
            onPress={() => navigation.navigate('PdfViewer', item)}
            onToggleFavorite={async () => setDocuments(await toggleFavorite(item.id))}
          />
        )}
      />
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
    fontSize: 24,
    fontWeight: '700',
    marginTop: 30,
  },
  list: {paddingTop: 24, paddingBottom: 20},
  empty: {color: '#9295A3', fontSize: 16, marginTop: 24},
});

export default RecentScreen;