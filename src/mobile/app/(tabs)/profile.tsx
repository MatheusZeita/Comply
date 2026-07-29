// app/(tabs)/profile.tsx
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import { Href, Link, useRouter } from "expo-router";
import {
  Wallet,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Bell,
  Heart,
  Search,
  UserCircle,
} from "lucide-react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { Pressable } from "@/components/ui/pressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/features/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";

export default function Profile() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { logout } = useLogout();
  // const {
  //   data: userProfile,
  //   isLoading,
  //   isError,
  //   error,
  // } = useGetMyProfileQuery({
  //   enabled: isLoggedIn,
  // });

  const handleLogout = () => {
    setShowAlertDialog(false);

    logout();
  };
  const dispatch = useDispatch();

  const handleHardReset = async () => {
    try {
      await AsyncStorage.removeItem("persist:root"); // ou clear() em dev
      dispatch(logoutAction());
      router.replace("/login");
    } catch (e) {
      console.log("Erro limpando sessão:", e);
    }
  };
  const handleClose = () => setShowAlertDialog(false);

  const MenuItem = ({
    icon: Icon,
    label,
    href,
    isDestructive = false,
  }: {
    icon: any;
    label: string;
    href: Href;
    isDestructive?: boolean;
  }) => {
    return (
      <Link href={href} asChild>
        <HStack className="items-center justify-start py-4 px-6 active:bg-background-50 gap-3 flex-1">
          <Icon
            size={22}
            color={isDestructive ? "#ef4444" : "#059669"}
            strokeWidth={2}
          />
          <Text
            className={`text-base ${
              isDestructive ? "text-error-600" : "text-typography-900"
            }`}
          >
            {label}
          </Text>
        </HStack>
      </Link>
    );
  };

  if (!isLoggedIn) {
    return (
      <ScreenWrapper scrollable excludeEdges={["bottom"]}>
        <VStack className="gap-6 pt-8">
          <VStack className="items-center gap-4 px-6">
            <Box className="bg-emerald-50 rounded-full p-6">
              <UserCircle size={64} color="#059669" strokeWidth={1.5} />
            </Box>
            <VStack className="items-center gap-2">
              <Heading size="xl" className="text-typography-900 text-center">
                Bem-vindo ao Comply
              </Heading>
              <Text
                size="sm"
                className="text-typography-500 text-center max-w-sm"
              >
                Entre na sua conta para vender seus produtos, ver suas compras e
                muito mais.
              </Text>
            </VStack>
            <Link href="/login" asChild>
              <Button size="lg" className="w-full bg-emerald-700">
                <ButtonText className="text-white">Entrar</ButtonText>
              </Button>
            </Link>
          </VStack>

          <VStack className="gap-2">
            <Box>
              <MenuItem icon={Search} label="Pesquisar" href="/search" />
              <Divider />
              <MenuItem
                icon={Heart}
                label="Favoritos"
                href="/(tabs)/watchList"
              />
              <Divider />
              <MenuItem
                icon={Bell}
                label="Notificações"
                href="/notifications"
              />
              <Divider />
              <MenuItem
                icon={Settings}
                label="Configurações"
                href="/profile/settings"
              />
              <Divider />
              <MenuItem
                icon={HelpCircle}
                label="Ajuda e Suporte"
                href="/profile/support"
              />
            </Box>
          </VStack>
        </VStack>
      </ScreenWrapper>
    );
  }

  // if (isLoading) {
  //   return (
  //     <ScreenWrapper>
  //       <VStack className="flex-1 justify-center items-center gap-4">
  //         <Spinner />
  //         <Text className="text-typography-500">Carregando perfil...</Text>
  //       </VStack>
  //     </ScreenWrapper>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <ScreenWrapper>
  //       <VStack className="flex-1 justify-center items-center gap-4 px-6">
  //         <Button
  //           size="lg"
  //           className="bg-emerald-700 w-full"
  //           onPress={() => router.replace("/(tabs)/profile")}
  //         >
  //           <ButtonText className="text-white">Tentar novamente</ButtonText>
  //         </Button>

  //         <Button
  //           size="lg"
  //           variant="outline"
  //           className="w-full border-red-500 mt-2"
  //           onPress={handleHardReset}
  //         >
  //           <ButtonText className="text-red-600">
  //             Limpar sessão e entrar de novo
  //           </ButtonText>
  //         </Button>
  //       </VStack>
  //     </ScreenWrapper>
  //   );
  // }

  // const displayName = userProfile?.name;
  // const displayEmail = userProfile?.email;

  return (
    <>
      <ScreenWrapper scrollable excludeEdges={["bottom"]}>
        <VStack className="gap-6">
          <HStack className="items-center gap-4 pt-4 px-6">
            <Avatar size="lg" className="bg-emerald-100">
              <AvatarFallbackText className="text-emerald-700">
                {/* {displayName} */}
              </AvatarFallbackText>
            </Avatar>
            <VStack className="items-start gap-1 flex-1">
              <Heading size="xl" className="text-typography-900">
                {/* {displayName} */}
              </Heading>
              <Text size="sm" className="text-typography-500">
                {/* {displayEmail} */}
              </Text>
            </VStack>
          </HStack>

          <VStack className="gap-2">
            <Text
              size="sm"
              className="text-typography-500 font-semibold uppercase tracking-wider px-6"
            >
              Minha Conta
            </Text>
            <Box>
              <MenuItem
                icon={Wallet}
                label="Saldo de conta"
                href="/profile/accountBalance"
              />
              <Divider />
              <MenuItem
                icon={Package}
                label="Meus produtos"
                href="/profile/myProducts"
              />
              <Divider />
              <MenuItem
                icon={ShoppingBag}
                label="Minhas compras"
                href="/profile/myPurchases"
              />
            </Box>
          </VStack>

          <VStack className="gap-2">
            <Text
              size="sm"
              className="text-typography-500 font-semibold uppercase tracking-wider px-6"
            >
              Atividades
            </Text>
            <Box>
              <MenuItem
                icon={Heart}
                label="Favoritos"
                href="/(tabs)/watchList"
              />
              <Divider />
              <MenuItem
                icon={Bell}
                label="Notificações"
                href="/notifications"
              />
              <Divider />
              <MenuItem icon={Search} label="Pesquisar" href="/search" />
            </Box>
          </VStack>

          <VStack className="gap-2">
            <Text
              size="sm"
              className="text-typography-500 font-semibold uppercase tracking-wider px-6"
            >
              Geral
            </Text>
            <Box>
              <MenuItem
                icon={Settings}
                label="Configurações"
                href="/profile/settings"
              />
              <Divider />
              <MenuItem
                icon={HelpCircle}
                label="Ajuda e Suporte"
                href="/profile/support"
              />
            </Box>
          </VStack>

          <Box className="mb-8">
            <Pressable
              onPress={() => setShowAlertDialog(true)}
              className="items-center justify-start gap-3 py-4 px-6 active:bg-background-50 flex-row"
            >
              <LogOut size={22} color={"#ef4444"} strokeWidth={2} />
              <Text className="text-base text-typography-900">
                Fechar sessão
              </Text>
            </Pressable>
          </Box>
        </VStack>
      </ScreenWrapper>

      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent className="border-0">
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Fechar sessão?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-5">
            <Text size="sm">
              Tem certeza que deseja sair da sua conta? Você precisará fazer
              login novamente para acessar seus produtos e compras.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="link"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText className="px-5">Cancelar</ButtonText>
            </Button>
            <Button size="sm" onPress={handleLogout} action="negative">
              <ButtonText className="text-white px-5">Sair</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
