import PlaceholderScreen from "@/components/PlaceholderScreen";
import { Link } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Pressable } from "@/components/ui/pressable/index";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox/index";
import { Input, InputField, InputSlot } from "@/components/ui/input/index";
import { Check, CalendarDays, Info, Clock } from "lucide-react-native";
import {
  useCreationStore,
  CreationStoreState,
} from "../../hooks/useCreationStore";

const AUCTION_PRICE_OPTIONS = [
  {
    id: "fast",
    label: "Quer vender rápido? Comece com 20% a 30% do valor de mercado.",
    value: 0.25,
    percentageText: "25%",
  },
  {
    id: "balanced",
    label: "Quer mais equilibrado? Comece com cerca de 50% do valor.",
    value: 0.5,
    percentageText: "50%",
  },
  {
    id: "safe",
    label: "Prefere ir com segurança? Comece com 70% do valor.",
    value: 0.7,
    percentageText: "70%",
  },
];

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const parseDateString = (dateString: string): Date | null => {
  const dateMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!dateMatch) return null;

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const year = parseInt(dateMatch[3], 10);

  const date = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

type DatePickerType = "start" | "end" | null;

export default function Pricing() {
  const router = useRouter();
  const { setPricing } = useCreationStore();
  const validateAndProceed = () => {
    const numericPrice = parseCurrencyToNumber(price);
    const missingFields: string[] = [];

    if (numericPrice <= 0) {
      missingFields.push("Valor da Venda (deve ser maior que zero)");
    }

    if (isAuction) {
      const numericInitialPrice = parseCurrencyToNumber(initialAuctionPrice);
      const isStartDateComplete = startDateString.length === 10;
      const isStartTimeComplete = startTimeString.length === 5;
      const isEndDateComplete = endDateString.length === 10;
      const isEndTimeComplete = endTimeString.length === 5;

      if (numericInitialPrice <= 0 || !selectedInitialPriceOptionId) {
        missingFields.push("Valor Inicial do Leilão");
      }

      if (!isStartDateComplete) {
        missingFields.push("Data de Início do Leilão");
      }
      if (!isStartTimeComplete) {
        missingFields.push("Hora de Início do Leilão");
      }
      if (!isEndDateComplete) {
        missingFields.push("Data de Término do Leilão");
      }
      if (!isEndTimeComplete) {
        missingFields.push("Hora de Término do Leilão");
      }

      if (
        isStartDateComplete &&
        isStartTimeComplete &&
        isEndDateComplete &&
        isEndTimeComplete
      ) {
        if (startDateError || startTimeError) {
          missingFields.push("Data/Hora de Início inválida.");
        }
        if (endDateError || endTimeError) {
          missingFields.push("Data/Hora de Término inválida.");
        }
        if (
          startDateObj &&
          endDateObj &&
          startDateObj.getTime() >= endDateObj.getTime()
        ) {
          missingFields.push(
            "A Data/Hora de Término deve ser posterior à Data/Hora de Início."
          );
        }
        if (!startDateObj && isStartDateComplete && isStartTimeComplete) {
          missingFields.push("Combinação de Data e Hora de Início inválida.");
        }
        if (!endDateObj && isEndDateComplete && isEndTimeComplete) {
          missingFields.push("Combinação de Data e Hora de Término inválida.");
        }
      }
    }

    if (missingFields.length > 0) {
      const uniqueMissingFields = [...new Set(missingFields)];
      const message =
        "Por favor, preencha os seguintes campos obrigatórios antes de avançar:\n\n" +
        uniqueMissingFields.join("\n");
      Alert.alert("Campos Obrigatórios Faltando", message);
      return;
    }
    setPricing({
      saleType: isAuction ? "Auction" : "Normal",
      normalPrice: parseCurrencyToNumber(price),
      auctionSettings: {
        startBidValue: parseCurrencyToNumber(initialAuctionPrice),
        winBidValue: parseCurrencyToNumber(price),
        startDate: startDateObj?.toISOString() ?? "",
        endDate: endDateObj?.toISOString() ?? "",
      },
    });
    router.push("/createProduct/resume");
  };

  const goToNextStep = validateAndProceed;

  const goToPreviousStep = () => {
    router.push("/createProduct/details");
  };
  const [isSellingNormally, setIsSellingNormally] = useState(true);
  const [isAuction, setIsAuction] = useState(false);
  const [price, setPrice] = useState("");
  const [initialAuctionPrice, setInitialAuctionPrice] = useState("");
  const [startDateObj, setStartDateObj] = useState<Date | null>(null);
  const [endDateObj, setEndDateObj] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<DatePickerType>(null);
  const [selectedInitialPrice, setSelectedInitialPrice] = useState<
    string | null
  >(null);
  const [selectedInitialPriceOptionId, setSelectedInitialPriceOptionId] =
    useState<string | null>(null);
  const [valueAfterFee, setValueAfterFee] = useState("0,00");
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startTimeString, setStartTimeString] = useState("");
  const [endTimeString, setEndTimeString] = useState("");
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const parseDateTime = (
    dateString: string,
    timeString: string
  ): Date | null => {
    const dateMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const timeMatch = timeString.match(/^(\d{2}):(\d{2})$/);

    if (!dateMatch || !timeMatch) return null;

    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const year = parseInt(dateMatch[3], 10);
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  };

  const handleTimeInput = (value: string, type: "start" | "end") => {
    let maskedValue = value.replace(/\D/g, "");
    if (maskedValue.length > 2) {
      maskedValue = maskedValue.slice(0, 2) + ":" + maskedValue.slice(2, 4);
    }
    if (type === "start") {
      setStartTimeString(maskedValue);
      setStartTimeError(null);
    } else {
      setEndTimeString(maskedValue);
      setEndTimeError(null);
    }

    if (maskedValue.length === 5) {
      const parts = maskedValue.split(":");
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (
        isNaN(hours) ||
        hours < 0 ||
        hours > 23 ||
        isNaN(minutes) ||
        minutes < 0 ||
        minutes > 59
      ) {
        if (type === "start") setStartTimeError("Hora inicial inválida.");
        else setEndTimeError("Hora de término inválida.");
        return;
      }

      const dateString = type === "start" ? startDateString : endDateString;
      const newDateTime = parseDateTime(dateString, maskedValue);

      if (newDateTime) {
        if (type === "start") {
          setStartDateObj(newDateTime);
          setStartTimeError(null);
          validateEndDateTime(endDateString, endTimeString, newDateTime);
        } else {
          setEndDateObj(newDateTime);
          setEndTimeError(null);
          if (startDateObj) {
            validateEndDateTime(dateString, maskedValue, startDateObj);
          }
        }
      } else {
        if (type === "start") setStartTimeError(null);
        else setEndTimeError(null);
      }
    }
  };

  const validateEndDateTime = (endD: string, endT: string, startDObj: Date) => {
    if (!startDObj) return;

    const endDateTime = parseDateTime(endD, endT);
    if (endDateTime && endDateTime.getTime() <= startDObj.getTime()) {
      setEndDateError("Término deve ser posterior ao início.");
      setEndTimeError("Término deve ser posterior ao início.");
    } else {
      setEndDateError(null);
      setEndTimeError(null);
    }
  };

  const handleDateInput = (value: string, type: "start" | "end") => {
    let maskedValue = value.replace(/\D/g, "");
    if (maskedValue.length > 2) {
      maskedValue = maskedValue.slice(0, 2) + "/" + maskedValue.slice(2);
    }
    if (maskedValue.length > 5) {
      maskedValue = maskedValue.slice(0, 5) + "/" + maskedValue.slice(5, 9);
    }

    if (type === "start") {
      setStartDateString(maskedValue);
      setStartDateError(null);
    } else {
      setEndDateString(maskedValue);
      setEndDateError(null);
    }

    if (maskedValue.length === 10) {
      const parsedDate = parseDateString(maskedValue);

      if (!parsedDate) {
        if (type === "start") setStartDateError("Data inicial inválida.");
        else setEndDateError("Data de término inválida.");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (parsedDate.getTime() < today.getTime()) {
        if (type === "start")
          setStartDateError("Data inicial não pode ser no passado.");
        else setEndDateError("Data de término não pode ser no passado.");
        return;
      }

      const timeString = type === "start" ? startTimeString : endTimeString;
      const parsedDateTime = parseDateTime(maskedValue, timeString);

      if (type === "end") {
        if (
          parsedDateTime &&
          startDateObj &&
          parsedDateTime.getTime() <= startDateObj.getTime()
        ) {
          setEndDateError("Término deve ser posterior à data/hora inicial.");
          return;
        }
      }

      if (type === "start") {
        if (parsedDateTime) {
          setStartDateObj(parsedDateTime);
          validateEndDateTime(endDateString, endTimeString, parsedDateTime);
        } else {
          setStartDateObj(parsedDate);
          validateEndDateTime(endDateString, endTimeString, parsedDate);
        }
      } else {
        if (parsedDateTime) {
          setEndDateObj(parsedDateTime);
          if (startDateObj) {
            validateEndDateTime(maskedValue, timeString, startDateObj);
          }
        } else {
          setEndDateObj(parsedDate);
          if (startDateObj) {
            validateEndDateTime(maskedValue, timeString, startDateObj);
          }
        }
      }
    }
  };

  const parseCurrencyToNumber = (currencyString: string): number => {
    const cleanString = currencyString
      .replace("R$", "")
      .trim()
      .replace(".", "")
      .replace(",", ".");
    return parseFloat(cleanString) || 0;
  };

  const formatNumberToCurrency = (num: number): string => {
    if (isNaN(num)) return "";
    return num.toFixed(2).replace(".", ",");
  };

  const calculateValueAfterFee = (currentPrice: string): string => {
    const numericPrice = parseCurrencyToNumber(currentPrice);
    if (numericPrice <= 0) {
      return "0,00";
    }
    const valueAfterDeduction = numericPrice * 0.92;
    return formatNumberToCurrency(valueAfterDeduction);
  };

  const handleInitialPriceSelect = (value: string) => {
    setSelectedInitialPriceOptionId(value);
    setSelectedInitialPrice(value);

    const selectedOption = AUCTION_PRICE_OPTIONS.find(
      (opt) => opt.id === value
    );
    if (!selectedOption) return;

    const totalValue = parseCurrencyToNumber(price);

    if (totalValue > 0) {
      const initialValue = totalValue * selectedOption.value;

      setInitialAuctionPrice(formatNumberToCurrency(initialValue));
    } else {
      setInitialAuctionPrice("");
    }
  };

  const handleNormalSaleToggle = (newValue: boolean) => {
    if (newValue) {
      setIsSellingNormally(true);
      setIsAuction(false);
      setStartDateObj(null);
      setEndDateObj(null);
      setStartDateString("");
      setEndDateString("");
      setStartTimeString("");
      setEndTimeString("");
    } else {
      if (!isAuction) {
        setIsSellingNormally(true);
      }
    }
  };
  const handleAuctionToggle = (newValue: boolean) => {
    if (newValue) {
      setIsAuction(true);
      setIsSellingNormally(false);
      setStartDateObj(null);
      setEndDateObj(null);
      setStartDateString("");
      setEndDateString("");
      setStartTimeString("");
      setEndTimeString("");
    } else {
      if (!isSellingNormally) {
        setIsAuction(true);
      }
    }
  };

  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
    setValueAfterFee(calculateValueAfterFee(newPrice));
    if (isAuction && selectedInitialPriceOptionId) {
      const selectedOption = AUCTION_PRICE_OPTIONS.find(
        (opt) => opt.id === selectedInitialPriceOptionId
      );
      if (selectedOption) {
        const totalValue = parseCurrencyToNumber(newPrice);
        const initialValue = totalValue * selectedOption.value;
        setInitialAuctionPrice(formatNumberToCurrency(initialValue));
      }
    } else if (isAuction && !selectedInitialPriceOptionId) {
      setInitialAuctionPrice("");
    }
  };

  return (
    <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="bg-emerald-700 w-full p-5 gap-5">
          <View className="justify-center gap-2 mt-20">
            <Text className="text-white font-bold text-3xl">Hora da Venda</Text>
            <Text className="text-white opacity-60 font-bold text-base">
              Configure seu modelo de venda e leilão
            </Text>
          </View>
          <View className="justify-start gap-2">
            <Checkbox
              size="lg"
              value="normalSale"
              isChecked={isSellingNormally}
              onChange={handleNormalSaleToggle}
              className="rounded-lg p-2"
            >
              <CheckboxIndicator
                className="
                    bg-emerald-700 
                    border-emerald-700 
                    data-[checked=false]:border-gray-300
                    data-[checked=true]:bg-gray-300
                    data-[checked=true]:border-gray-300
                "
              >
                <CheckboxIcon as={Check} className="text-emerald-700" />
              </CheckboxIndicator>
              <CheckboxLabel className="text-white font-bold data-[checked=true]:!text-white">
                Quero apenas vender, sem leilão
              </CheckboxLabel>
            </Checkbox>
            <Checkbox
              size="lg"
              value="auction"
              isChecked={isAuction}
              onChange={handleAuctionToggle}
              className="rounded-lg p-2"
            >
              <CheckboxIndicator
                className="
                    bg-emerald-700 
                    border-emerald-700 
                    data-[checked=false]:border-gray-300
                    data-[checked=true]:bg-gray-300
                    data-[checked=true]:border-gray-300
                "
              >
                <CheckboxIcon as={Check} className="text-emerald-700" />
              </CheckboxIndicator>
              <CheckboxLabel className="text-white font-bold data-[checked=true]:!text-white">
                Desejo a experiência Comply, leilão e venda rápida
              </CheckboxLabel>
            </Checkbox>
          </View>
          <View className="justify-center gap-2 bg-[#00A884] p-4 rounded-lg">
            <Text className="text-white font-semibold text-xl">
              Como funciona a experiência Comply?
            </Text>
            <Text className="text-white text-base">
              O leilão inicia na data que desejar, depois que começa ainda será
              possível que alguém compre imediatamente o produto e interrompa o
              leilão. Dessa forma, garantimos que seu produto seja vendido da
              forma mais rápida e justa possível.
            </Text>
          </View>
          <View className="flex-row justify-end items-center">
            <Image
              source={require("../../assets/logo/comply-icon-white.png")}
              className="w-30 h-30"
            />
            <Text className="text-white font-bold text-base">Passo 4 de 5</Text>
          </View>
        </View>
        <View className="mx-5 mt-6 gap-2 justify-center items-center">
          {isSellingNormally && (
            <View className="justify-center gap-2">
              <Text className="text-emerald-700 font-bold text-3xl">
                Por quanto deseja vender?
              </Text>
              <Input
                variant="outline"
                size="xl"
                className="rounded-lg bg-white"
              >
                <InputSlot className="px-3">
                  <Text className="text-base text-[#6B6B6B]">R$</Text>
                </InputSlot>
                <InputField
                  placeholder="0,00"
                  keyboardType="numeric"
                  className="text-base"
                  onChangeText={handlePriceChange}
                  value={price}
                />
              </Input>
              <View className="justify-center gap-2 bg-[#2196F3] p-4 rounded-lg">
                <View className="flex-row items-center gap-2">
                  <Info size={20} color={"white"} />
                  <Text className="text-white font-semibold text-xl">
                    Toda venda tem uma taxa de 8%
                  </Text>
                </View>
                <Text className="text-white text-base">
                  Caso venda pelo valor de venda, vai receber:
                </Text>
                <Text className="text-white text-base font-bold">
                  R${valueAfterFee}
                </Text>
              </View>
            </View>
          )}

          {isAuction && (
            <View className="justify-center gap-8">
              <View className="gap-2">
                <Text className="text-emerald-700 font-bold text-2xl">
                  Preço de venda:
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-lg bg-white"
                >
                  <InputSlot className="px-3">
                    <Text className="text-base text-[#6B6B6B]">R$</Text>
                  </InputSlot>
                  <InputField
                    placeholder="0,00"
                    keyboardType="numeric"
                    className="text-base"
                    onChangeText={handlePriceChange}
                    value={price}
                  />
                </Input>
                <View className="justify-center mt-3 gap-2 bg-[#2196F3] p-4 rounded-lg">
                  <View className="flex-row items-center gap-2">
                    <Info size={20} color={"white"} />
                    <Text className="text-white font-semibold text-xl">
                      Toda venda tem uma taxa de 8%
                    </Text>
                  </View>
                  <Text className="text-white text-base">
                    Caso venda pelo valor de venda, vai receber:
                  </Text>
                  <Text className="text-white text-base font-bold">
                    R${valueAfterFee}
                  </Text>
                </View>
              </View>
              <View className="gap-2">
                <Text className="text-emerald-700 font-bold text-2xl">
                  Escolha o valor inicial do leilão:
                </Text>
                {AUCTION_PRICE_OPTIONS.map((option) => {
                  const isSelected = selectedInitialPrice === option.id;
                  const buttonClasses = isSelected
                    ? "bg-emerald-700 border-emerald-700"
                    : "bg-white border-[#6B6B6B]/15";

                  const textClasses = isSelected
                    ? "text-white"
                    : "text-gray-900";

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => handleInitialPriceSelect(option.id)}
                      className={`
                      ${buttonClasses}
                      px-5 
                      py-4 
                      rounded-lg 
                      items-center 
                      shadow-2xs
                      border-2
                      data-[hover=true]:bg-emerald-600
                    `}
                    >
                      <Text className={`text-base font-medium ${textClasses}`}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View className="gap-2">
                <Text className="text-emerald-700 font-bold text-2xl">
                  Valor inicial do leilão:
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-lg bg-[#F0F0F0]"
                >
                  <InputSlot className="px-3">
                    <Text className="text-base text-[#6B6B6B]">R$</Text>
                  </InputSlot>
                  <InputField
                    placeholder="0,00"
                    keyboardType="numeric"
                    className="text-[#6B6B6B] text-base"
                    value={initialAuctionPrice}
                    editable={false}
                  />
                </Input>
                {selectedInitialPriceOptionId && (
                  <Text className="font-bold text-sm text-[#6B6B6B]">
                    {`O valor inicial será ${
                      AUCTION_PRICE_OPTIONS.find(
                        (opt) => opt.id === selectedInitialPriceOptionId
                      )?.percentageText || ""
                    } de R$${price}`}
                  </Text>
                )}
              </View>
              <View className="gap-2">
                <Text className="text-emerald-700 font-bold text-2xl">
                  Data de início:
                </Text>
                <View className="flex-row gap-2">
                  <View className="gap-2 flex-1">
                    <Input
                      variant="outline"
                      size="xl"
                      className={`rounded-lg bg-white ${
                        startDateError ? "border-red-500 border-2" : ""
                      }`}
                    >
                      <InputSlot className="px-3">
                        <CalendarDays size={20} color="#6B6B6B" />
                      </InputSlot>
                      <InputField
                        placeholder="dd/mm/aaaa"
                        keyboardType="numeric"
                        className="text-base"
                        value={startDateString}
                        onChangeText={(text) => handleDateInput(text, "start")}
                        maxLength={10}
                      />
                    </Input>
                    {startDateError && (
                      <Text className="text-red-500 text-sm">
                        {startDateError}
                      </Text>
                    )}
                  </View>
                  <View className="gap-2 w-32">
                    <Input
                      variant="outline"
                      size="xl"
                      className={`rounded-lg bg-white ${
                        startTimeError ? "border-red-500 border-2" : ""
                      }`}
                    >
                      <InputSlot className="px-3">
                        <Clock size={20} color="#6B6B6B" />
                      </InputSlot>
                      <InputField
                        placeholder="00:00"
                        keyboardType="numeric"
                        className="text-base"
                        value={startTimeString}
                        onChangeText={(text) => handleTimeInput(text, "start")}
                        maxLength={5}
                      />
                    </Input>
                    {startTimeError && !startDateError && (
                      <Text className="text-red-500 text-sm mt-1">
                        {startTimeError}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-emerald-700 font-bold text-2xl">
                  Data de término:
                </Text>
                <View className="flex-row gap-2">
                  <View className="gap-2 flex-1">
                    <Input
                      variant="outline"
                      size="xl"
                      className={`rounded-lg bg-white ${
                        endDateError ? "border-red-500 border-2" : ""
                      }`}
                    >
                      <InputSlot className="px-3">
                        <CalendarDays size={20} color="#6B6B6B" />
                      </InputSlot>
                      <InputField
                        placeholder="dd/mm/aaaa"
                        keyboardType="numeric"
                        className="text-base"
                        value={endDateString}
                        onChangeText={(text) => handleDateInput(text, "end")}
                        maxLength={10} // Máximo 10 caracteres
                      />
                    </Input>
                    {endDateError && (
                      <Text className="text-red-500 text-sm">
                        {endDateError}
                      </Text>
                    )}
                  </View>
                  <View className="gap-2 w-32">
                    <Input
                      variant="outline"
                      size="xl"
                      className={`rounded-lg bg-white ${
                        endTimeError ? "border-red-500 border-2" : ""
                      }`}
                    >
                      <InputSlot className="px-3">
                        <Clock size={20} color="#6B6B6B" />
                      </InputSlot>
                      <InputField
                        placeholder="00:00"
                        keyboardType="numeric"
                        className="text-base"
                        value={endTimeString}
                        onChangeText={(text) => handleTimeInput(text, "end")}
                        maxLength={5}
                      />
                    </Input>
                    {endTimeError && !endDateError && (
                      <Text className="text-red-500 text-sm mt-1">
                        {endTimeError}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
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
