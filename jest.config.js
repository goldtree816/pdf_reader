module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-async-storage|@react-navigation|@react-native-documents|lucide-react-native|react-native-pdf|react-native-blob-util|react-native-svg)/)',
  ],
};
