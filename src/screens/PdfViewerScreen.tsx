import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Pdf from 'react-native-pdf';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  MainTabs: undefined;

  PdfViewer: {
    uri: string;
    name: string;
  };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PdfViewer'
>;

const PdfViewerScreen = ({ route, navigation }: Props) => {
  const { uri, name } = route.params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  console.log('PDF VIEWER URI:', uri);

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {name}
        </Text>

      </View>

      <Pdf
        source={{
          uri: uri,
          cache: true,
        }}

        style={styles.pdf}

        onLoadComplete={(numberOfPages) => {
          setIsLoading(false);
          console.log(
            `PDF loaded: ${numberOfPages} pages`
          );
        }}

        onPageChanged={(page, numberOfPages) => {
          console.log(
            `Page ${page} of ${numberOfPages}`
          );
        }}

        onError={(error) => {
          setIsLoading(false);
          setError(true);
          console.log('PDF ERROR:', error);
        }}

        onPressLink={(url) => {
          console.log('PDF LINK:', url);
        }}
      />

      {isLoading && !error && (
        <View style={styles.loading}>
          <ActivityIndicator color="#EC4F70" size="large" />
          <Text style={styles.statusText}>Opening PDF...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Could not display this PDF</Text>
          <Text style={styles.statusText}>The file may no longer be available.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.closeText}>Back to library</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#17191B',
  },

  header: {
    height: 65,
    backgroundColor: '#EC4F70',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '300',
  },

  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 5,
  },

  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#17191B',
  },

  loading: {
    alignItems: 'center',
    backgroundColor: '#17191B',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 65,
  },

  statusText: {
    color: '#9295A3',
    fontSize: 15,
    marginTop: 12,
  },

  errorPanel: {
    alignItems: 'center',
    backgroundColor: '#17191B',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 24,
    position: 'absolute',
    right: 0,
    top: 65,
  },

  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  closeButton: {
    backgroundColor: '#EC4F70',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  closeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

});

export default PdfViewerScreen;