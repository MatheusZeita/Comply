import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { FlatList } from "react-native";
import { NotificationCard } from "@/components/NotificationCard";
import { MOCK_NOTIFICATIONS } from "@/mocks/noficationsMock";
import { Divider } from "@/components/ui/divider";

export default function NotificationsScreen() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  function markAsRead(id: string) {
    setNotifications((nots) =>
      nots.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function deleteNotification(id: string) {
    setNotifications((nots) => nots.filter((n) => n.id !== id));
  }

  const filtered =
    tab === "all"
      ? notifications
      : notifications.filter((n) => n.type === "product");

  return (
    <Box className="flex-1 bg-gray-50">
      <HStack className="mb-2 w-full">
        <Pressable
          onPress={() => setTab("all")}
          className={`bg-white flex-1 p-5 ${
            tab === "all" ? "border-b-4 border-emerald-700" : null
          }`}
        >
          <Text
            className={`text-center ${
              tab === "all"
                ? "text-emerald-700 font-bold"
                : "text-gray-700 font-semibold"
            }`}
          >
            Todas
          </Text>
        </Pressable>
        <Divider orientation="vertical" />
        <Pressable
          onPress={() => setTab("product")}
          className={`bg-white w-[50%] p-5 ${
            tab === "product" ? "border-b-4 border-emerald-700" : null
          }`}
        >
          <Text
            className={`text-center ${
              tab === "product"
                ? "text-emerald-700 font-bold"
                : "text-gray-700 font-semibold"
            }`}
          >
            Produtos de olho
          </Text>
        </Pressable>
      </HStack>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            lines={item.lines}
            date={item.date}
            read={item.read}
            onRead={() => markAsRead(item.id)}
            onClear={() => deleteNotification(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-8">
            Nenhuma notificação nesta aba.
          </Text>
        }
      />
    </Box>
  );
}
