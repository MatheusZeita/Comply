import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "./ui/heading";
import { Href, Link, usePathname } from "expo-router";
import { Button } from "./ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Children } from "react";

interface PlaceholderParams {
  title: string;
  route?: Href;
  buttonRoute?: string;
  children?: React.ReactNode;
}

export default function PlaceholderScreen({
  title,
  route,
  buttonRoute,
  children,
}: PlaceholderParams) {
  const pathName = usePathname();
  return (
    <SafeAreaView>
      <Box className="flex h-full justify-center items-center gap-6">
        <Heading size="2xl" className="">
          {title}
        </Heading>
        <Text className="">Local da Rota: {pathName}</Text>
        {route && buttonRoute && (
          <Link href={route} asChild>
            <Button variant="solid" size="lg">
              <Text className="text-white">{buttonRoute}</Text>
            </Button>
          </Link>
        )}
        {children}
      </Box>
    </SafeAreaView>
  );
}
