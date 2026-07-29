import PlaceholderScreen from "@/components/PlaceholderScreen";
import { Link } from "expo-router";
import {
  View,
  Text,
  Image,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable/index";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { List, PlusCircle, Dot, Trash2 } from "lucide-react-native";
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@/components/ui/input/index";
import DropDownPicker from "react-native-dropdown-picker";
import {
  useCreationStore,
  setProductDetails,
} from "../../hooks/useCreationStore";

export default function Details() {
  const [openCondicao, setOpenCondicao] = useState(false);
  const [itemsCondicao, setItemsCondicao] = useState([
    { label: "Novo", value: "New" },
    { label: "Usado", value: "Used" },
    { label: "Com Defeito", value: "NotWorking" },
    { label: "Restaurado", value: "Refurbished" },
  ]);

  const [openCategoria, setOpenCategoria] = useState(false);
  const [itemsCategoria, setItemsCategoria] = useState([
    { label: "Eletrônicos", value: "Electronics" },
    { label: "Eletrodomésticos", value: "HomeAppliances" },
    { label: "Decoração de móveis", value: "FurnitureDecor" },
    { label: "Beleza e moda", value: "FashionBeauty" },
    { label: "Esportes", value: "Sports" },
    { label: "Colecionáveis", value: "Collectibles" },
    { label: "Ferramentas", value: "Tools" },
    { label: "Jogos", value: "Games" },
    { label: "Serviços", value: "Services" },
    { label: "Outro", value: "Others" },
  ]);

  const router = useRouter();
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [errorCondicao, setErrorCondicao] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState(false);
  const [errorFeatures, setErrorFeatures] = useState(false);
  const { state, dispatch } = useCreationStore();
  const productDetails = state.productDetails;
  const [valueCondicao, setValueCondicao] = useState<string | null>(null);
  const [valueCategoria, setValueCategoria] = useState<string | null>(null);

  useEffect(() => {
    setValueCondicao(productDetails.condition || null);
    setValueCategoria(productDetails.category || null);
    setFeatures(productDetails.features || []);
  }, []);

  const handleAddFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures((prevFeatures) => [...prevFeatures, newFeature.trim()]);
      setNewFeature("");
      Keyboard.dismiss();
    }
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setFeatures((prevFeatures) =>
      prevFeatures.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateDetails = (): boolean => {
    let isValid = true;
    let errors: string[] = [];

    if (!valueCondicao) {
      errors.push("Você deve selecionar a Condição do produto.");
      setErrorCondicao(true);
      isValid = false;
    } else {
      setErrorCondicao(false);
    }

    if (!valueCategoria) {
      errors.push("Você deve selecionar a Categoria do produto.");
      setErrorCategoria(true);
      isValid = false;
    } else {
      setErrorCategoria(false);
    }

    if (features.length < 1) {
      errors.push("Você deve adicionar pelo menos 1 Característica.");
      setErrorFeatures(true);
      isValid = false;
    } else {
      setErrorFeatures(false);
    }

    if (!isValid) {
      Alert.alert("Campos Obrigatórios", errors.join("\n"));
    }

    return isValid;
  };

  const goToNextStep = () => {
    if (validateDetails()) {
      setProductDetails({
        condition: valueCondicao || "",
        category: valueCategoria || "",
        features: features,
      });

      router.push("/createProduct/pricing");
    }
  };
  const goToPreviousStep = () => {
    router.push("/createProduct/images");
  };

  const onCondicaoOpen = () => {
    setOpenCategoria(false);
  };

  const onCategoriaOpen = () => {
    setOpenCondicao(false);
  };
  return (
    <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}>
      <ScrollView className="flex-1">
        <View className="items-center justify-center">
          <View className="bg-emerald-700 w-full p-5 gap-5">
            <View className="justify-center gap-2 mt-20">
              <Text className="text-white font-bold text-3xl">
                Conte-nos mais sobre o produto
              </Text>
              <Text className="text-white opacity-60 font-bold text-base">
                Ajude compradores a encontrar seu produto mais rápido.
              </Text>
            </View>
            <View className="justify-center items-center gap-3 z-20">
              <DropDownPicker
                open={openCondicao}
                value={valueCondicao}
                items={itemsCondicao}
                setOpen={setOpenCondicao}
                onOpen={onCondicaoOpen}
                setValue={setValueCondicao}
                setItems={setItemsCondicao}
                listMode="MODAL"
                placeholder="Condição"
                style={{ borderWidth: 0 }}
                textStyle={{
                  fontSize: 16,
                  color: "#008564",
                }}
                dropDownContainerStyle={{
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderTopColor: "#F5F7F8",
                }}
                zIndex={3000}
                zIndexInverse={1000}
              />
              <DropDownPicker
                open={openCategoria}
                value={valueCategoria}
                items={itemsCategoria}
                setOpen={setOpenCategoria}
                onOpen={onCategoriaOpen}
                setValue={setValueCategoria}
                setItems={setItemsCategoria}
                listMode="MODAL"
                placeholder="Categoria"
                style={{ borderWidth: 0 }}
                textStyle={{
                  fontSize: 16,
                  color: "#008564",
                }}
                dropDownContainerStyle={{
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderTopColor: "#F5F7F8",
                }}
                zIndex={2000}
                zIndexInverse={3000}
              />
            </View>
            <View className="flex-row justify-end items-center">
              <Image
                source={require("../../assets/logo/comply-icon-white.png")}
                className="w-30 h-30"
              />
              <Text className="text-white font-bold text-base">
                Passo 3 de 5
              </Text>
            </View>
          </View>
          <View className="mx-5 mt-6 gap-2 justify-center items-center">
            <View className="gap-2 w-full justify-start items-center">
              <View className="flex-row gap-2 items-center">
                <List size={30} color="#6B6B6B" />
                <Text className="text-[#6B6B6B] font-bold text-3xl">
                  Características
                </Text>
              </View>
              <View className="w-full gap-2 justify-center items-center">
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-lg bg-white"
                >
                  <InputField
                    placeholder="Adicione nova característica"
                    keyboardType="default"
                    className="text-base"
                    value={newFeature}
                    onChangeText={setNewFeature}
                    onSubmitEditing={handleAddFeature}
                  />
                  <InputSlot className="px-3">
                    <Pressable onPress={handleAddFeature} className="p-2">
                      <PlusCircle size={20} color="#6B6B6B" />
                    </Pressable>
                  </InputSlot>
                </Input>
              </View>
              <View className="w-full gap-2 justify-center items-center">
                {features.map((feature, index) => (
                  <View key={index} className="flex-row items-center w-full">
                    <Dot size={50} color="#6B6B6B" />
                    <View className="flex-1 h-12 border border-gray-300 rounded-lg justify-between items-center flex-row pr-3 bg-[#F0F0F0]">
                      <Text className="text-base text-[#6B6B6B] ml-4">
                        {feature}
                      </Text>
                      <Pressable onPress={() => handleRemoveFeature(index)}>
                        <Trash2 size={20} color="#DC2626" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
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
                <Text className="text-white text-base font-medium">
                  Avançar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
