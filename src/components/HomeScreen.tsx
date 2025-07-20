import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/dataTypes";
import { getInitials } from "../utils/methods";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getContent } from "../utils/apiClient";

interface Content {
  userName: string;
  mainImage: string;
  thumbNailImage: string;
  subTitle: string;
  text: string;
  logo: string;
  title: string;
}

const HomeScreen: React.FC = () => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchContent = async () => {
    try {
      const result = await getContent();
      setContent(result.content);
    } catch (error) {
      Alert.alert("Error", "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const Logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); // Clear token
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getCurrentDate = (): string => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };

  if (loading) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <ActivityIndicator testID="ActivityIndicator" size="large" />
      </View>
    );
  }

  if (!content) return null;

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <Text style={styles.todayText}>Today</Text>
        </View>
        <TouchableOpacity testID="logoutButton" onPress={() => Logout()}>
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>{getInitials(content.userName)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <TouchableOpacity
          testID="cardImageButton"
          onPress={() =>
            navigation.navigate("Details", {
              title: content.title,
              thumbNailImage: content.thumbNailImage,
              logo: content.logo,
              image: content.mainImage,
              subTitle: content.subTitle,
              text: content.text,
            })
          }
        >
          <Image
            source={{ uri: content.thumbNailImage }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={styles.footer}>
          <Image source={{ uri: content.logo }} style={styles.icon} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.subtitle}>{content.subTitle}</Text>
          </View>
          <TouchableOpacity
            testID="refreshButton"
            style={styles.refreshButton}
            onPress={fetchContent}
          >
            <Text style={styles.refreshText}>REFRESH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  todayText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  vsBadge: {
    backgroundColor: "#d2d2d4",
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mainImage: {
    width: "100%",
    height: 450,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  refreshButton: {
    backgroundColor: "#e6e6e6",
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: "700",
    color: "blue",
  },
});
