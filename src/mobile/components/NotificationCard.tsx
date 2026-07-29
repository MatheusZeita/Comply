import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

function parseLocal(date: string) {
  return new Date(date + "-03:00");
}

// Helper para diferença de minutos
function minutesDiff(date: string) {
  const now = new Date();
  const d = parseLocal(date);
  return Math.floor((now.getTime() - d.getTime()) / 60000);
}

// Retorna “há x minutos”
function fromNow(date: string) {
  const diff = minutesDiff(date);
  if (diff < 1) return "agora";
  if (diff === 1) return "há 1 minuto";
  if (diff < 60) return `há ${diff} minutos`;
  return "há mais de uma hora";
}

export function NotificationCard({
  lines,
  date,
  read,
  onRead,
  onClear,
}: {
  lines: string[];
  date: string;
  read: boolean;
  onRead: () => void;
  onClear: () => void;
}) {
  const recent = minutesDiff(date) < 10;

  return (
    <Box
      className={`bg-white px-4 py-3 mb-2
        ${recent && !read ? "bg-emerald-50" : ""}
      `}
      style={
        read
          ? undefined
          : {
              borderLeftWidth: 8,
              borderLeftColor: "#047857",
            }
      }
    >
      <HStack className="justify-between items-center mb-1">
        {!read ? (
          <Box
            className="mr-1 animate-pulse"
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#47B881",
            }}
          />
        ) : (
          <Box style={{ width: 8, height: 8 }} />
        )}
        <Text className="text-xs text-gray-400">{fromNow(date)}</Text>
      </HStack>
      <VStack className="mb-2 mt-1">
        {lines.map((line, idx) => (
          <Text key={idx} className="text-base text-gray-800">
            {line}
          </Text>
        ))}
      </VStack>
      <HStack className="justify-end">
        {!read ? (
          <Pressable onPress={onRead}>
            <Text className="text-sm text-emerald-600 font-medium mt-1">
              Marcar como lida
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={onClear}>
            <Text className="text-sm text-gray-400 font-medium mt-1">
              Limpar
            </Text>
          </Pressable>
        )}
      </HStack>
    </Box>
  );
}
