import React from "react";
import { View, Text, Image } from "react-native";
import { GripVertical, Star, Trash2 } from "lucide-react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { Pressable } from "@/components/ui/pressable/index";
import type { RenderItemParams } from "react-native-draggable-flatlist";
export interface ImageItem {
  id: string;
  fileName: string;
  imageUrl: string;
  isPrincipal: boolean;
}

export interface ImageListItemProps extends RenderItemParams<ImageItem> {
  onDelete: () => void;
  onTogglePrincipal?: () => void;
}

export function ImageListItem({
  item,
  drag,
  isActive,
  onDelete,
}: ImageListItemProps) {
  return (
    <ScaleDecorator>
      <View
        className={`
          flex-row 
          items-center 
          justify-between 
          p-2
          ${
            item.isPrincipal
              ? "border-b-2 border-gray-200"
              : "border-b-2 border-gray-200"
          }
          ${isActive ? "bg-gray-200 border-gray-200" : ""} 
        `}
      >
        <View className="flex-row items-center gap-2">
          <Pressable onPressIn={drag} disabled={isActive}>
            <GripVertical size={28} color="#6B6B6B" />
          </Pressable>

          {item.isPrincipal && (
            <View className="flex-row items-center gap-2">
              <Star size={16} color="#146C49" fill="#146C49" />
              <Text className="text-emerald-700 font-bold flex-row items-center gap-1">
                Principal
              </Text>
            </View>
          )}

          <Text className="text-gray-700 ml-2 max-w-[100px] truncate">
            {item.fileName}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-12 h-12 rounded-lg"
            resizeMode="cover"
          />

          <Pressable onPress={onDelete} className="p-2 ml-2">
            <Trash2 size={20} color="#DC2626" />
          </Pressable>
        </View>
      </View>
    </ScaleDecorator>
  );
}
