import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Link, router } from "expo-router";
import {
  Mail,
  Lock,
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import FullLogo from "@/assets/logo/full-logo.svg";
import { Divider } from "@/components/ui/divider";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemas/authSchema";
import { useLoginMutation } from "@/hooks/user/useAuthMutations";

export default function LoginScreen() {
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        Email: data.email,
        Password: data.password,
      });

      router.replace("/");
    } catch {}
  };

  const handleState = () => {
    setShowPassword((showState) => !showState);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScreenWrapper scrollable>
        <VStack className="flex-1 justify-center px-6 gap-8">
          <VStack className="items-center gap-6">
            <FullLogo width={240} height={80} />

            <VStack className="items-center gap-2 mt-4">
              <Heading size="3xl" className="text-typography-700">
                Bem-vindo de volta
              </Heading>
              <Text size="lg" className="text-typography-500">
                Entre na sua conta para continuar
              </Text>
            </VStack>
          </VStack>

          <VStack className="gap-5">
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-semibold">
                  Email
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={Mail} className="text-typography-500" />
                    </InputSlot>
                    <InputField
                      placeholder="seu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="text-base"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
              {errors.email && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} />
                  <FormControlErrorText>
                    {errors.email.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-semibold">
                  Senha
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={Lock} className="text-typography-500" />
                    </InputSlot>
                    <InputField
                      placeholder="Digite sua senha"
                      type={showPassword ? "text" : "password"}
                      className="text-base"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    <InputSlot className="pr-4" onPress={handleState}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                )}
              />
              {errors.password && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} />
                  <FormControlErrorText>
                    {errors.password.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <Button
              size="xl"
              className="bg-emerald-700 mt-4"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isSubmitting || loginMutation.isPending}
            >
              <ButtonText className="font-bold text-base text-white">
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </ButtonText>
            </Button>

            <Box className="flex flex-row gap-5 items-center justify-center">
              <Divider />
              <Text>OU</Text>
              <Divider />
            </Box>

            <Button
              size="xl"
              variant="link"
              action="secondary"
              onPress={() => router.push("/register")}
            >
              <ButtonText className="font-bold text-base">
                Criar uma conta
              </ButtonText>
            </Button>
          </VStack>

          <VStack className="items-center gap-3 mt-6">
            <Text size="sm" className="text-typography-500 text-center">
              Ao entrar, você concorda com nossos
            </Text>
            <HStack className="gap-1 flex-wrap justify-center">
              <Link href="/" asChild>
                <Text size="sm" className="text-emerald-700 font-semibold">
                  Termos de Uso
                </Text>
              </Link>
              <Text size="sm" className="text-typography-500">
                e
              </Text>
              <Link href="/" asChild>
                <Text size="sm" className="text-emerald-700 font-semibold">
                  Política de Privacidade
                </Text>
              </Link>
            </HStack>
          </VStack>
        </VStack>
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
}
