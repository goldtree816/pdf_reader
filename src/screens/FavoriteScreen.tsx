import React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Share,
} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  getDocuments,
  markDocumentOpened,
  toggleFavorite,
  type PdfDocument,
} from '../utils/documentStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<{Home: undefined; Favorite: undefined}, 'Favorite'>,
  NativeStackScreenProps<{PdfViewer: {uri: string; name: string}}>
>;

const FavoriteScreen = ({navigation}: Props) => {
  const [documents, setDocuments] = useState<PdfDocument[]>([]);
  const [query, setQuery] = useState('');

  const loadFavorites = async () => {
    const allDocuments = await getDocuments();
    setDocuments(allDocuments.filter(document => document.favorite));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    loadFavorites();
    return unsubscribe;
  }, [navigation]);

  const filteredDocuments = documents.filter(document =>
    document.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const formatSize = (size?: number) => {
    if (!size) {
      return 'Size unavailable';
    }

    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date?: number) =>
    date ? new Date(date).toLocaleDateString() : 'Not opened yet';

  const openDocument = async (document: PdfDocument) => {
    await markDocumentOpened(document.id);
    navigation.navigate('PdfViewer', document);
  };

  const shareDocument = async (document: PdfDocument) => {
    await Share.share({
      title: document.name,
      message: document.uri,
      url: document.uri,
    });
  };

  const renderFavorite = ({item}: {item: PdfDocument}) => (
    <View style={styles.row}>
      <TouchableOpacity style={styles.openArea} onPress={() => openDocument(item)}>
        <Text style={styles.icon}>PDF</Text>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.metadata}>
            {formatSize(item.size)}  •  Opened {formatDate(item.lastOpenedAt ?? item.addedAt)}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openDocument(item)} accessibilityLabel={`Open ${item.name}`}>
          <Text style={styles.actionText}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shareDocument(item)} accessibilityLabel={`Share ${item.name}`}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await toggleFavorite(item.id);
            loadFavorites();
          }}
          accessibilityLabel={`Remove ${item.name} from favorites`}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite</Text>
      {documents.length > 0 && (
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search favorites"
          placeholderTextColor="#9295A3"
          style={styles.searchInput}
          accessibilityLabel="Search favorite PDFs"
        />
      )}
      <FlatList
        data={filteredDocuments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          documents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.subtitle}>No favorite PDFs yet.</Text>
              <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.browseText}>Browse PDFs</Text>
              </TouchableOpacity>
            </View>
          ) : <Text style={styles.subtitle}>No favorites match your search.</Text>
        }
        renderItem={renderFavorite}
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
    fontSize: 32,
    fontWeight: '700',
    marginTop: 30,
  },

  subtitle: {
    color: '#9295A3',
    fontSize: 16,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#202228',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  list: {paddingTop: 24, paddingBottom: 20},
  emptyState: {alignItems: 'center', paddingTop: 24},
  browseButton: {
    backgroundColor: '#EC4F70',
    borderRadius: 10,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  browseText: {color: '#FFFFFF', fontWeight: '700'},
  row: {
    backgroundColor: '#202228',
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
  },
  openArea: {alignItems: 'center', flexDirection: 'row'},
  icon: {color: '#EC4F70', fontSize: 12, fontWeight: '800', width: 38},
  details: {flex: 1},
  name: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  metadata: {color: '#9295A3', fontSize: 12, marginTop: 5},
  actions: {flexDirection: 'row', gap: 14, justifyContent: 'flex-end', marginTop: 14},
  actionText: {color: '#FFFFFF', fontSize: 13, fontWeight: '700'},
  removeText: {color: '#EC4F70', fontSize: 13, fontWeight: '700'},
});

export default FavoriteScreen;