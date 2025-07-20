import React, { JSX } from 'react';
import { Text, View, ScrollView, StyleSheet, Image } from 'react-native';

type TitleAlign = 'left' | 'center' | 'right';

interface ConvertOptions {
  titleAlign?: TitleAlign;
  imageUrl?: string; 
  insertAfterParagraph?: number;
}

/**
 * Converts HTML layout into React Native components with:
 * - Title alignment
 * - Styled first three words in each paragraph
 * - A dynamic image inserted between paragraphs
 */
export const convertHtmlLayoutToReactNative = (
  html: string,
  options: ConvertOptions = { titleAlign: 'center' }
): JSX.Element => {
  const { titleAlign = 'center', imageUrl, insertAfterParagraph = 1 } = options;

  // Extract <title>
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  // Remove <html>, <head>, <body>
  html = html.replace(/<\/?(html|head|body)[^>]*>/gi, '').replace(/\n/gi, '');

  // Extract paragraphs
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;
  const paragraphs: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = paragraphRegex.exec(html)) !== null) {
    const cleanText = match[1].replace(/<[^>]+>/g, '');
    paragraphs.push(cleanText.trim());
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={[styles.title, { textAlign: titleAlign }]}>{title}</Text>

      {/* Paragraphs with image */}
      <View>
        {paragraphs.map((para, index) => (
          <React.Fragment key={index}>
            <Text style={styles.paragraph}>{styleFirstThreeWords(para)}</Text>
            {imageUrl && index === insertAfterParagraph && (
              <View style={styles.imgCon}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.dynamicImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
};

/**
 * Styles first three words: bold, medium, normal.
 */
const styleFirstThreeWords = (text: string): JSX.Element[] => {
  const words = text.split(' ');
  const styledWords: JSX.Element[] = [];

  words.forEach((word, index) => {
    let style = {};
    if (index < 3) style = styles.bold;
    else style = styles.normal;

    styledWords.push(
      <Text key={index} style={style}>
        {word + ' '}
      </Text>
    );
  });

  return styledWords;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  content: {
    // marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  medium: {
    fontWeight: '500',
    fontSize: 16,
  },
  normal: {
    fontWeight: 'normal',
    fontSize: 16,
  },
  imgCon: { 
    height: 600, 
    marginBottom: 20
  },
  dynamicImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 15,
  },
});
