import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Add signup logic here
  };

  return (
    <View className="flex-1 justify-center p-5">
      <Text className="text-2xl font-bold text-center mb-5">Sign Up</Text>
      <TextInput
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-2 text-gray-900 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-2 text-gray-900 text-base"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-8 text-gray-900 text-base"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
