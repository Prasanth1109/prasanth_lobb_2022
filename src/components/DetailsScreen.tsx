import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { RootStackParamList } from '../utils/dataTypes';
import { convertHtmlLayoutToReactNative } from './convertHTMLToRNLayout';

type DetailsRouteProp = RouteProp<RootStackParamList, "Details">;

const DetailsScreen = () => {
  {/* Api not available to refresh the detail screen */}
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const route = useRoute<DetailsRouteProp>();
  const { title, image, subTitle, logo, thumbNailImage, text } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerImageContainer}>
        <Image
          source={{ uri: thumbNailImage }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <Text style={styles.majorUpdate}>MAJOR UPDATE</Text>
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.returnTo}>{"✖"}</Text>
        </TouchableOpacity>
        <Text style={styles.titleH}>{title}</Text>
      </View>

      {/* App Info Section */}
      <View style={styles.appInfo}>
        <Image source={{ uri: logo }} style={styles.logo} />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.appName}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          // onPress={fetchContent}
        >
          <Text style={styles.refreshText}>REFRESH</Text>
          <Text style={styles.inAppPurchase}>In-App Purchase</Text>
        </TouchableOpacity>
      </View>

      {/* Description (HTML rendered as UI) */}
      <View style={{ flex: 1 }}>
        {convertHtmlLayoutToReactNative(text, {
          titleAlign: 'center',
          imageUrl: image,
          insertAfterParagraph: 1, // Place image after 2nd paragraph (index 1)
        })}
      </View>

      {/* Bottom App Info */}
      <View style={styles.bottomAppInfo}>
        <Image source={{ uri: logo }} style={styles.logo} />
        <View style={styles.appBott}>
          <Text style={styles.appName}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton} 
          // onPress={fetchContent}
        >
          <Text style={styles.refreshText}>REFRESH</Text>
          <Text style={styles.inAppPurchase}>In-App Purchase</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
          style={styles.refreshButton} 
          // onPress={fetchContent}
        >
          <Text style={styles.share}>{"📤 Share"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImageContainer: { position: 'relative' },
  headerImage: { 
    width: '100%', 
    height: 450, 
  },
  majorUpdate: {
    position: 'absolute',
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    top: 20,
    left: 20,
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  goBack: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  returnTo: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#000000',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingTop: 2,
    paddingBottom:4,
    borderRadius: 40,
    fontSize: 18,
  },
  titleH: {
    position: 'absolute',
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    color: '#fff',
    top: 40,
    left: 20,
    fontSize: 28,
    fontWeight: '900',
    width: '88%',
  },
  title: {
    position: 'absolute',
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    color: '#000000',
    top: 40,
    left: 20,
    fontSize: 28,
    fontWeight: '900',
    width: '88%',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bottomAppInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ddd',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  logo: { 
    width: 50, height: 50, 
    borderRadius: 10 
  },
  appName: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#000000'
  },
  subTitle: { fontSize: 14, color: '#666' },
  refreshButton: { alignItems: 'center' },
  refreshText: {
    backgroundColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 14,
    borderRadius: 40,
    fontWeight: '600',
    color: 'blue',
    textAlign: 'center',
  },
  share: {
    backgroundColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: '600',
    color: 'blue',
    textAlign: 'center',
    margin: 25
  },
  inAppPurchase: { fontSize: 10, color: '#666', marginTop: 2 },
  textContainer: { padding: 15 },
  description: { fontSize: 14, lineHeight: 20, color: '#444', marginTop: 5 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  appBott: { flex: 1,
    marginVertical: 10, 
    alignItems: 'center' 
  }
});
