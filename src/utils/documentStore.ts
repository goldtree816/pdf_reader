import AsyncStorage from '@react-native-async-storage/async-storage';

export type PdfDocument = {
  id: string;
  name: string;
  uri: string;
  addedAt: number;
  size?: number;
  lastOpenedAt?: number;
  favorite: boolean;
};

const DOCUMENTS_KEY = '@pdf-reader/documents';

const readDocuments = async (): Promise<PdfDocument[]> => {
  const value = await AsyncStorage.getItem(DOCUMENTS_KEY);

  if (!value) {
    return [];
  }

  try {
    const documents = JSON.parse(value) as PdfDocument[];
    return Array.isArray(documents) ? documents : [];
  } catch {
    return [];
  }
};

const writeDocuments = async (documents: PdfDocument[]) => {
  await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const getDocuments = async (): Promise<PdfDocument[]> => {
  const documents = await readDocuments();
  return documents.sort((first, second) => second.addedAt - first.addedAt);
};

export const saveDocument = async (
  document: Omit<PdfDocument, 'favorite'> & {favorite?: boolean},
): Promise<PdfDocument> => {
  const documents = await readDocuments();
  const existing = documents.find(item => item.id === document.id);
  const savedDocument: PdfDocument = {
    ...document,
    favorite: document.favorite ?? existing?.favorite ?? false,
  };
  const withoutDocument = documents.filter(item => item.id !== document.id);

  await writeDocuments([savedDocument, ...withoutDocument]);
  return savedDocument;
};

export const toggleFavorite = async (id: string): Promise<PdfDocument[]> => {
  const documents = await readDocuments();
  const updated = documents.map(document =>
    document.id === id
      ? {...document, favorite: !document.favorite}
      : document,
  );

  await writeDocuments(updated);
  return getDocuments();
};

export const markDocumentOpened = async (id: string): Promise<PdfDocument[]> => {
  const documents = await readDocuments();
  const updated = documents.map(document =>
    document.id === id ? {...document, lastOpenedAt: Date.now()} : document,
  );

  await writeDocuments(updated);
  return getDocuments();
};

export const clearDocuments = async (favoritesOnly = false) => {
  const documents = await readDocuments();
  const remaining = favoritesOnly
    ? documents.filter(document => document.favorite)
    : [];

  await writeDocuments(remaining);
};

export const cachePdf = async (uri: string, name: string): Promise<string> => {
  if (!uri.startsWith('content://')) {
    return uri;
  }

  const ReactNativeBlobUtil = require('react-native-blob-util').default;
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const destination = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/pdf-${Date.now()}-${safeName}`;
  const contents = await ReactNativeBlobUtil.fs.readFile(uri, 'base64');
  await ReactNativeBlobUtil.fs.writeFile(destination, contents, 'base64');

  return `file://${destination}`;
};

export const getDocumentId = (uri: string, name: string) => `${uri}:${name}`;
