import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import type {PdfDocument} from '../utils/documentStore';

type Props = {
  document: PdfDocument;
  onPress: () => void;
  onToggleFavorite: () => void;
};

const DocumentRow = ({document, onPress, onToggleFavorite}: Props) => (
  <View style={styles.row}>
    <TouchableOpacity style={styles.openArea} onPress={onPress}>
      <Text style={styles.icon}>PDF</Text>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{document.name}</Text>
        <Text style={styles.date}>
          {new Date(document.addedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onToggleFavorite}
      style={styles.favoriteButton}
      accessibilityLabel={document.favorite ? 'Remove favorite' : 'Add favorite'}
    >
      <Text style={styles.favorite}>{document.favorite ? '★' : '☆'}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: '#202228',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  openArea: {alignItems: 'center', flex: 1, flexDirection: 'row'},
  icon: {color: '#EC4F70', fontSize: 12, fontWeight: '800', width: 38},
  details: {flex: 1},
  name: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  date: {color: '#9295A3', fontSize: 12, marginTop: 5},
  favoriteButton: {padding: 8},
  favorite: {color: '#EC4F70', fontSize: 26},
});

export default DocumentRow;
