import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@/components/ui/input/index";
import { Pressable } from "@/components/ui/pressable/index";
import PlaceholderScreen from "@/components/PlaceholderScreen";
import { Link } from "expo-router";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pen } from "lucide-react-native";
import {
  useCreationStore,
  setProductDetails,
} from "../../hooks/useCreationStore";

export default function Index() {
  const { state } = useCreationStore();
  const router = useRouter();
  const MAX_DESCRIPTION_LENGTH = 1000;
  const [title, setTitle] = useState(state.productDetails.title || "");
  const [description, setDescription] = useState(
    state.productDetails.description || ""
  );

  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const validateFields = () => {
    let isValid = true;
    setTitleError(null);
    setDescriptionError(null);

    if (title.trim().length < 3) {
      setTitleError(
        "O título é obrigatório e deve ter no mínimo 3 caracteres."
      );
      isValid = false;
    }

    if (description.trim().length < 10) {
      setDescriptionError(
        "A descrição é obrigatória e deve ter no mínimo 10 caracteres."
      );
      isValid = false;
    }
    return isValid;
  };

  const goToNextStep = () => {
    if (validateFields()) {
      setProductDetails({
        title: title.trim(),
        description: description.trim(),
      });
      router.push("/createProduct/images");
    } else {
      Alert.alert(
        "Campos Incompletos",
        "Por favor, preencha o título e a descrição corretamente para avançar."
      );
    }
  };
  const goToPreviousStep = () => {
    router.push("/(tabs)");
  };

  return (
    <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="bg-emerald-700 w-full p-5 gap-2">
          <Text className="text-white font-bold text-3xl mt-20">
            Descreva mais sobre o produto.
          </Text>
          <Text className="text-white opacity-60 font-bold text-base">
            Quanto tempo de uso? Acompanha algo a mais? Tem defeitos?
          </Text>
          <View className="flex-row justify-end items-center">
            <Image
              source={require("../../assets/logo/comply-icon-white.png")}
              className="w-30 h-30"
            />
            <Text className="text-white font-bold text-base">Passo 1 de 5</Text>
          </View>
        </View>
        <View className="mx-5 gap-2 justify-center items-center">
          <View className="w-full mt-10 gap-2 justify-center items-center">
            <Text className="text-emerald-700 font-bold text-3xl">
              Qual o título do anúncio?
            </Text>
            <Input variant="outline" size="xl" className="rounded-lg">
              <InputSlot className="px-3">
                <Pen size={20} color="#6B6B6B" />
              </InputSlot>
              <InputField
                placeholder="Nome do anúncio..."
                keyboardType="default"
                className="text-base"
                onChangeText={(text) => {
                  setTitle(text);
                  if (titleError && text.trim().length >= 3)
                    setTitleError(null);
                }}
              />
            </Input>
            <View className="w-full items-end">
              <Input
                variant="outline"
                size="xl"
                className="rounded-lg h-48 items-start pt-3"
              >
                <InputSlot className="px-3">
                  <Pen size={20} color="#6B6B6B" />
                </InputSlot>
                <InputField
                  placeholder="Descrição..."
                  multiline={true}
                  blurOnSubmit={true}
                  textAlignVertical="top"
                  keyboardType="default"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChangeText={(text) => {
                    setDescription(text);
                    if (descriptionError && text.trim().length >= 10)
                      setDescriptionError(null);
                  }}
                  value={description}
                  className="text-base h-full"
                />
              </Input>
              <Text className="text-sm mr-7 text-[#6B6B6B]">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>
            <Text className="font-bold text-sm">
              Dica: descrições acima de 200 caracteres vendem 3x mais.
            </Text>
          </View>
          <View className="flex-row w-full pb-10 mt-10 justify-between">
            <Pressable
              onPress={goToPreviousStep}
              className="
          px-10 
          py-4 
          rounded-lg 
          items-center 
          border-2
          border-emerald-700
          shadow-md
          data-[hover=true]:bg-[#17855b]
        "
            >
              <Text className="text-emerald-700 text-base font-medium">
                Voltar
              </Text>
            </Pressable>
            <Pressable
              onPress={goToNextStep}
              className="
          bg-emerald-700
          px-10 
          py-4 
          rounded-lg 
          items-center 
          shadow-md
          data-[hover=true]:bg-[#17855b]
        "
            >
              <Text className="text-white text-base font-medium">Avançar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
