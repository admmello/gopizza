import React from 'react'
import { KeyboardAvoidingView, Platform, Image } from 'react-native'

import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

import { brandImg } from '../../assets/brand.png'

import {
    Container,
    Content,
    Title,
    Brand,
} from './styles'


export function SignIn() {
    return (
        <Container>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Content>
                    <Brand source={brandImg} />

                    <Title>Login</Title>

                    <Input
                        placeholder='E-mail'
                        type='secondary'
                        autoCorrect={false}
                        autoCapitalize='none'
                    />

                    <Input
                        placeholder='Senha'
                        type='secondary'
                        secureTextEntry
                    />

                    <Button
                        title='Entrar'
                        type='secondary'
                    />
                </Content>
            </KeyboardAvoidingView>
        </Container>
    )
}