import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.bally.aora",
  projectId: "6653f96500271e5326a5",
  databaseId: "6653fa7b000a84c57d25",
  userCollectionId: "6653faf6001989488047",
  videoCollectionId: "6653fb57001810bfe0ab",
  storageId: "6653fcd70035178158a7",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        avatar: avatarUrl,
        username,
        email,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    // Check for existing session in AsyncStorage
    const session = await AsyncStorage.getItem("session");
    if (session) {
      // Log out existing session
      const parsedSession = JSON.parse(session);
      await account.deleteSession(parsedSession.$id);
      await AsyncStorage.removeItem("session");
    }

    // Create a new session
    const newSession = await account.createEmailPasswordSession(
      email,
      password
    );

    // Save session to AsyncStorage
    await AsyncStorage.setItem("session", JSON.stringify(newSession));

    return newSession;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))],
      3
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
