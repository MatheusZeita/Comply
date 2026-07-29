import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  MapPin,
  SearchIcon,
  Settings,
} from "lucide-react-native";
import { Box } from "./ui/box";
import { Link, router } from "expo-router";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { Avatar, AvatarFallbackText } from "./ui/avatar";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
} from "./ui/actionsheet";
import { Divider } from "./ui/divider";
import { Input, InputField, InputIcon, InputSlot } from "./ui/input";
import { useSelector } from "react-redux";
import { useMyProfileQuery } from "@/hooks/user/useUsersQueries";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { isLoggedIn } = useAuth();
  const { data: userData } = useMyProfileQuery(isLoggedIn);

  const selectedCity = useSelector((state: any) => state.city.selectedCity);
  const [showActionsheet, setShowActionsheet] = useState(false);

  const handleClose = () => setShowActionsheet(false);
  const handleSettingsLink = () => {
    router.push("/profile/settings");
    setShowActionsheet(false);
  };

  return (
    <Box className="w-full bg-emerald-600 p-4">
      <HStack className="w-full justify-between items-center mb-2">
        <Link href="/citySelector" asChild>
          <Pressable className="flex-row items-center gap-2">
            <MapPin size={18} color="#F0F0F0" />
            <Text className="font-semibold text-white">{selectedCity}</Text>
            <ChevronDown size={16} color="#F0F0F0" />
          </Pressable>
        </Link>
        <HStack className="items-center gap-4">
          <Link href="/notifications" asChild>
            <Pressable>
              <Bell size={22} color="#F0F0F0" />
            </Pressable>
          </Link>
          {isLoggedIn && (
            <Pressable onPress={() => setShowActionsheet(true)}>
              <Avatar size="sm" className="bg-neutral-200">
                <AvatarFallbackText>{userData?.name}</AvatarFallbackText>
              </Avatar>
            </Pressable>
          )}
        </HStack>
      </HStack>

      <Pressable className="w-full" onPress={() => router.push("/search")}>
        <Input
          isReadOnly={true}
          className="w-full bg-neutral-100 border-0"
          size="sm"
          variant="rounded"
          pointerEvents="none"
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Busque por um produto..." />
        </Input>
      </Pressable>

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="p-6 flex gap-4">
          <HStack className="w-full justify-start items-center gap-3">
            <Avatar size="md" className="bg-neutral-200">
              <AvatarFallbackText>{userData?.name}</AvatarFallbackText>
            </Avatar>
            <Box>
              <Text className="text-base font-semibold">{userData?.name}</Text>
              <Text className="text-gray-500 text-xs">{userData?.email}</Text>
            </Box>
          </HStack>

          <Divider />

          <ActionsheetItem onPress={handleSettingsLink}>
            <Settings size={16} color="#4B5563" />
            <ActionsheetItemText size="lg">
              Configurações da conta
            </ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={handleClose}>
            <LogOut size={16} color="#4B5563" />
            <ActionsheetItemText size="lg">Sair</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Box>
  );
}
