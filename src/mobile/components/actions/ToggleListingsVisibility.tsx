import { useState } from "react";
import { Pause, Play } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { useToggleListingAvailabilityMutation } from "@/hooks/listings/useListingsMutations";
import { ActivityIndicator } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";

type ToggleListingVisibilityProps = {
  listingId: string;
  action: "pause" | "resume";
};

export default function ToggleListingVisibility({
  listingId,
  action,
}: ToggleListingVisibilityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const isPause = action === "pause";
  const requiredPhrase = isPause ? "Eu quero pausar" : "Eu quero retomar";
  const isConfirmed = confirmationText.trim() === requiredPhrase;

  const { mutate: toggleListing, isPending } =
    useToggleListingAvailabilityMutation();

  const handleConfirm = () => {
    toggleListing(listingId, {
      onSuccess: () => {
        setIsOpen(false);
        setConfirmationText("");
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setConfirmationText("");
  };

  const Icon = isPause ? Pause : Play;
  const iconColor = isPause ? "#D97706" : "#059669";
  const btnBorderColor = isPause ? "border-yellow-600" : "border-emerald-700";
  const btnTextColor = isPause ? "text-yellow-600" : "text-emerald-700";
  const btnBgHover = isPause ? "bg-yellow-50" : "bg-emerald-50";
  const confirmBtnBg = isPause ? "bg-yellow-500" : "bg-emerald-600";
  const highlightColor = isPause ? "text-yellow-600" : "text-emerald-600";
  const label = isPause ? "Pausar anúncio" : "Retomar anúncio";

  return (
    <>
      {/* Trigger Button */}
      <Pressable onPress={() => setIsOpen(true)}>
        <HStack
          className={`${btnBorderColor} ${btnTextColor} border rounded-lg px-4 py-2 items-center justify-center gap-2 active:${btnBgHover}`}
        >
          <Icon size={20} color={iconColor} />
          <Text className={`${btnTextColor} font-medium text-sm`}>{label}</Text>
        </HStack>
      </Pressable>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalBackdrop />
        <ModalContent className="bg-white rounded-2xl max-w-md mx-4">
          <ModalHeader className="border-b border-gray-200 pb-4">
            <Heading size="lg" className="text-gray-900">
              Você tem certeza?
            </Heading>
            <ModalCloseButton onPress={handleClose} />
          </ModalHeader>

          <ModalBody className="py-6">
            <VStack className="gap-4">
              <Text className="text-gray-700 leading-6">
                {isPause
                  ? "Você está prestes a pausar este anúncio. Enquanto estiver pausado, ele não ficará visível para os compradores."
                  : "Você está prestes a retomar este anúncio. Ele voltará a ficar visível para os compradores."}
              </Text>

              <VStack className="gap-2">
                <Text className="text-gray-700">
                  Para confirmar, digite exatamente:{" "}
                  <Text className={`font-semibold ${highlightColor}`}>
                    {requiredPhrase}
                  </Text>
                </Text>

                <Input variant="outline" size="md" className="border-gray-300">
                  <InputField
                    placeholder="Digite aqui..."
                    value={confirmationText}
                    onChangeText={setConfirmationText}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Input>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter className="border-t border-gray-200 pt-4">
            <HStack className="gap-3 w-full">
              <Button
                variant="outline"
                onPress={handleClose}
                className="flex-1 border-gray-300"
                disabled={isPending}
              >
                <ButtonText className="text-gray-700">Cancelar</ButtonText>
              </Button>

              <Button
                onPress={handleConfirm}
                disabled={!isConfirmed || isPending}
                className={`flex-1 ${
                  isConfirmed && !isPending ? confirmBtnBg : "bg-gray-300"
                }`}
              >
                {isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ButtonText className="text-white font-semibold">
                    {label}
                  </ButtonText>
                )}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
