import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
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
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { Link, router } from "expo-router";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  Check,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import FullLogo from "@/assets/logo/full-logo.svg";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/schemas/authSchema";
import { useRegisterMutation } from "@/hooks/user/useAuthMutations";

export default function RegisterScreen() {
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        Name: data.name,
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
              <Heading size="3xl" className="text-typography-700 text-center">
                Crie sua conta
              </Heading>
              <Text size="lg" className="text-typography-500 text-center">
                Compre, leiloe e venda com a garantia Comply
              </Text>
            </VStack>
          </VStack>

          <VStack className="gap-5">
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-semibold">
                  Nome de usuário
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={User} className="text-typography-500" />
                    </InputSlot>
                    <InputField
                      placeholder="Como você quer ser chamado"
                      className="text-base"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
              {errors.name && (
                <FormControlError className="mt-2">
                  <FormControlErrorIcon as={AlertCircle} color="red" />
                  <FormControlErrorText className="text-error-500">
                    {errors.name.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

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
                <FormControlError className="mt-2">
                  <FormControlErrorIcon as={AlertCircle} color="red" />
                  <FormControlErrorText className="text-error-500">
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
                <FormControlError className="mt-2">
                  <FormControlErrorIcon as={AlertCircle} color="red" />
                  <FormControlErrorText className="text-error-500">
                    {errors.password.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-semibold">
                  Confirmar senha
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={Lock} className="text-typography-500" />
                    </InputSlot>
                    <InputField
                      placeholder="Repita a sua senha"
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
              {errors.confirmPassword && (
                <FormControlError className="mt-2">
                  <FormControlErrorIcon as={AlertCircle} color="red" />
                  <FormControlErrorText className="text-error-500">
                    {errors.confirmPassword.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.terms}>
              <Controller
                control={control}
                name="terms"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    size="md"
                    value="terms"
                    className="my-2"
                    isChecked={value}
                    onChange={onChange}
                  >
                    <CheckboxIndicator className="mr-1">
                      <CheckboxIcon as={Check} />
                    </CheckboxIndicator>
                    <CheckboxLabel>
                      <HStack className="flex-row flex-wrap items-center">
                        <Text size="sm" className="text-typography-700">
                          Aceito os{" "}
                        </Text>
                        <Text
                          size="sm"
                          className="text-emerald-700 font-semibold underline"
                        >
                          termos de uso e privacidade
                        </Text>
                      </HStack>
                    </CheckboxLabel>
                  </Checkbox>
                )}
              />
              {errors.terms && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} color="red" />
                  <FormControlErrorText className="text-error-500">
                    {errors.terms.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <Button
              size="xl"
              className="bg-emerald-700 mt-4"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isSubmitting}
            >
              <ButtonText className="font-bold text-base text-white">
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </ButtonText>
            </Button>

            <Button
              size="xl"
              variant="link"
              action="secondary"
              onPress={() => router.replace("/login")}
            >
              <ButtonText className="font-bold text-base">
                Já possui uma conta? Entrar
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
}
