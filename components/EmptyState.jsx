import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { images } from "../constants";
import CustomButton from "./customButton";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="px-4 justify-center items-center">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />

      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>

      <CustomButton
        title="Create video"
        handlePress={() => router.push("/create")}
        containerStyles={"w-full my-5"}
      />
    </View>
  );
};

export default EmptyState;
