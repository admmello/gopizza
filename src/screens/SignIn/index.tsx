import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useAuth } from '../../hooks/auth'

import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

import brandImg from '../../assets/brand.png'

import {
    Container,
    Content,
    Title,
    Brand,
    ForgotPasswordButton,
    ForgotPasswordLabel,
} from './styles'


export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, forgotPassword, isLogging } = useAuth()

    function handleSignIn() {
        signIn(email, password)
    }

    function handleForgotPassword() {
        forgotPassword(email)
    }

    return (
        <Container>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <GestureHandlerRootView>
                    <Content>
                        <Brand source={brandImg} />

                        <Title>Login</Title>

                        <Input
                            placeholder='E-mail'
                            type='secondary'
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={setEmail}
                        />

                        <Input
                            placeholder='Senha'
                            type='secondary'
                            secureTextEntry
                            onChangeText={setPassword}
                        />

                        <ForgotPasswordButton onPress={handleForgotPassword}>
                            <ForgotPasswordLabel>
                                Esqueci minha senha.
                            </ForgotPasswordLabel>
                        </ForgotPasswordButton>

                        <Button
                            title='Entrar'
                            type='secondary'
                            onPress={handleSignIn}
                            isLoading={isLogging}
                        />
                    </Content>
                </GestureHandlerRootView>
            </KeyboardAvoidingView>
        </Container>
    )
}