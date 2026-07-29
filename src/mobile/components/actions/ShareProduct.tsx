import { useState } from "react";
import { Copy, Check } from "lucide-react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@/components/ui/modal";
import Clipboard from "@react-native-clipboard/clipboard";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Toast from "react-native-toast-message";

type ShareProductProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  productId: string;
};

function ShareProduct({ open, onOpenChange, productId }: ShareProductProps) {
  const [copied, setCopied] = useState(false);

  const productUrl = `${process.env.PUBLIC_PRODUCT_DETAILS_URL}/${productId}`;

  const handleCopy = async () => {
    try {
      Clipboard.setString(productUrl);
      setCopied(true);

      Toast.show({
        type: "success",
        text1: "Link copiado!",
        text2: "O link foi copiado para a área de transferência",
        position: "bottom",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao copiar",
        text2: "Não foi possível copiar o link",
      });
    }
  };

  const handleClose = () => {
    onOpenChange?.(false);
    setCopied(false);
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="md">
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-2xl max-w-md mx-1">
        <ModalHeader className="border-b border-gray-200 pb-4">
          <Heading size="md" className="text-gray-900">
            Compartilhar Produto
          </Heading>
          <ModalCloseButton onPress={handleClose} />
        </ModalHeader>

        <ModalBody className="py-0">
          <VStack className="gap-4">
            <HStack className="gap-2">
              <Input
                variant="outline"
                size="md"
                className="flex-1 border-gray-300"
                isReadOnly
              >
                <InputField
                  value={productUrl}
                  editable={false}
                  selectTextOnFocus
                  className="text-sm text-gray-700"
                />
              </Input>

              <Button
                variant="outline"
                size="sm"
                onPress={handleCopy}
                className="border-gray-300 px-3"
              >
                <HStack className="items-center gap-1">
                  <ButtonIcon
                    as={copied ? Check : Copy}
                    color={copied ? "#059669" : "#6B7280"}
                  />
                  <ButtonText
                    className={`text-sm ${
                      copied ? "text-emerald-600" : "text-gray-700"
                    }`}
                  >
                    {copied ? "Copiado" : "Copiar"}
                  </ButtonText>
                </HStack>
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ShareProduct;
