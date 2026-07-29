import PlaceholderScreen from "@/components/PlaceholderScreen";
import { Link } from "expo-router";
import { View, Text, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable/index";
import { Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import DraggableFlatList from "react-native-draggable-flatlist";
import { ImageListItem } from "@/components/ui/imagelistitem/index";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useCreationStore, ImageItem } from "../../hooks/useCreationStore";

const initialData: ImageItem[] = [];

const MIN_IMAGES = 3;
const LIMIT = 5;

export default function Images() {
  const [data, setData] = useState<ImageItem[]>(initialData);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const router = useRouter();
  const { state, setProductImages } = useCreationStore();

  useEffect(() => {
    const updatedData = data.slice().map((item, index) => ({
      ...item,
      isPrincipal: index === 0,
    }));
    setProductImages(updatedData);
  }, [data, setProductImages]);

  const handleDeleteImage = (id: string) => {
    setData((prevData) => {
      const newData = prevData.filter((item) => item.id !== id);

      if (newData.length > 0 && newData[0].isPrincipal === false) {
        newData[0].isPrincipal = true;
      }
      if (newData.length < LIMIT) {
        setShowLimitWarning(false);
      }
      return newData;
    });
  };

  const handleDragEnd = ({ data: newData }: { data: ImageItem[] }) => {
    const updatedData = newData.map((item, index) => ({
      ...item,
      isPrincipal: index === 0,
    }));
    setData(updatedData);
  };

  const handlePickImage = async () => {
    if (data.length >= LIMIT) {
      setShowLimitWarning(true);
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      const newImage: ImageItem = {
        id: selectedAsset.uri,
        fileName: selectedAsset.fileName || `image-${Date.now()}`,
        imageUrl: selectedAsset.uri,
        isPrincipal: data.length === 0,
      };

      if (data.length + 1 >= LIMIT) {
        setShowLimitWarning(true);
      }

      setData((prevData) => [...prevData, newImage]);
      console.log("Imagem adicionada:", newImage.imageUrl);
    }
    console.log("Abrir galeria ou arrastar arquivo...");
  };

  const validateImageCount = (): boolean => {
    if (data.length < MIN_IMAGES) {
      Alert.alert(
        "Atenção",
        `Por favor, adicione pelo menos ${MIN_IMAGES} imagens para avançar. Você adicionou apenas ${data.length}.`
      );
      return false;
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateImageCount()) {
      router.push("/createProduct/details");
    }
  };
  const goToPreviousStep = () => {
    router.push("/createProduct");
  };
  return (
    <View className="flex-1 items-stretch">
      <View className="bg-emerald-700 w-full p-5 gap-5">
        <View className="justify-center gap-2 mt-20">
          <Text className="text-white font-bold text-3xl">
            Adicione imagens ao seu anúncio
          </Text>
          <Text className="text-white opacity-60 font-bold text-base">
            Coloque na ordem que desejar
          </Text>
        </View>
        <View className="justify-center items-center">
          <Pressable
            onPress={handlePickImage}
            className="
          bg-[#6B6B6B]
          p-4
          rounded-lg 
          flex-row 
          justify-between 
          items-center 
          gap-2 
          shadow-lg
          ${data.length >= LIMIT ? 'opacity-70' : ''}
        "
            disabled={data.length >= LIMIT}
          >
            <Text className="text-white text-base font-medium">
              Aperte para adicionar
            </Text>
            <View
              className="
            bg-white 
            w-8 
            h-8 
            rounded-md 
            justify-center 
            items-center
          "
            >
              <Plus size={20} color="#6B6B6B" />
            </View>
          </Pressable>
          {showLimitWarning && (
            <Text className="text-[#E53935] font-medium text-base">
              Limite de {LIMIT} imagens atingido.
            </Text>
          )}
        </View>
        <View className="flex-row justify-end items-center">
          <Image
            source={require("../../assets/logo/comply-icon-white.png")}
            className="w-30 h-30"
          />
          <Text className="text-white font-bold text-base">Passo 2 de 5</Text>
        </View>
      </View>
      <View className="flex-1 mx-5 gap-2 justify-between">
        {data.length > 0 ? (
          <DraggableFlatList
            scrollEnabled={false}
            data={data.map((item, index) => ({
              ...item,
              isPrincipal: index === 0,
            }))}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={(renderProps) => (
              <ImageListItem
                {...renderProps}
                onDelete={() => handleDeleteImage(renderProps.item.id)}
              />
            )}
            className="w-full mt-5"
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center mt-[-100px]">
            <Text className="text-gray-500 text-base">
              Nenhuma imagem adicionada. Clique no botão acima!
            </Text>
          </View>
        )}
        <View className="flex-row w-full pb-10 justify-between">
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
    </View>
  );
}
