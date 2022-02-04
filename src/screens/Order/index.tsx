import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore'

import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

import { ButtonBack } from '../../components/ButtonBack'
import { RadioButton } from '../../components/RadioButton'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { OrderNavigationProps } from '../../@types/navigation'

import {
    Container,
    ContentScroll,
    Header,
    Photo,
    Sizes,
    Form,
    Title,
    Label,
    FormRow,
    InputGroup,
    Price,
} from './styles'

import { PIZZA_TYPES } from '../../utils/pizzaTypes'
import { ProductProps } from '../../components/ProductCard'

type PizzaResponse = ProductProps & {
    prices_sizes: {
        [key: string]: number
    }
}

export function Order() {
    const [size, setSize] = useState('')
    const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse)
    const [quantity, setQuantity] = useState(0)
    const [tableNumber, setTableNumber] = useState('')
    const [sendingOrder, setSendingOrder] = useState(false)

    const { user } = useAuth()

    const navigation = useNavigation()
    const route = useRoute()
    const { id } = route.params as OrderNavigationProps

    const amount = size ? pizza.prices_sizes[size] * quantity : '0,00'

    function handleBack() {
        navigation.goBack()
    }

    function handleOrder() {
        if (!size) {
            return Alert.alert('Pedido', 'Selecione o tamanho da pizza.')
        }
        if (!tableNumber) {
            return Alert.alert('Pedido', 'Informe o número da mesa.')
        }
        if (!quantity) {
            return Alert.alert('Pedido', 'Informe a quantidade.')
        }

        setSendingOrder(true)

        firestore()
            .collection('orders')
            .add({
                quantity,
                amount,
                pizza: pizza.name,
                size,
                table_number: tableNumber,
                status: 'Preparando',
                waiter_id: user?.id,
                image: pizza.photo_url
            })
            .then(() => navigation.navigate('home'))
            .catch(() => {
                Alert.alert('Pedido', 'Não foi possível realizar o pedido.')
                setSendingOrder(false)
            })
    }

    useEffect(() => {
        if (id) {
            firestore()
                .collection('pizzas')
                .doc(id)
                .get()
                .then(response => setPizza(response.data() as PizzaResponse))
                .catch(() => Alert.alert('Pedido', 'Não foi possível carregar o pedido.'))
        }
    }, [id])


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ContentScroll>
                    <Header>
                        <ButtonBack
                            onPress={handleBack}
                            style={{ marginBottom: 108 }}
                        />
                    </Header>

                    <Photo source={{ uri: pizza.photo_url }} />

                    <Form>
                        <Title>{pizza.name}</Title>
                        <Label>Selecione um tamanho</Label>
                        <Sizes>
                            {
                                PIZZA_TYPES.map(item => (
                                    <RadioButton
                                        key={item.id}
                                        title={item.name}
                                        onPress={() => setSize(item.id)}
                                        selected={size === item.id}
                                    />))
                            }
                        </Sizes>

                        <FormRow>
                            <InputGroup>
                                <Label>Número da mesa</Label>
                                <Input
                                    onChangeText={setTableNumber}
                                    keyboardType='numeric'
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Quantidade</Label>
                                <Input
                                    onChangeText={(value) => setQuantity(Number(value))}
                                    keyboardType='numeric'
                                />
                            </InputGroup>
                        </FormRow>

                        <Price>Valor de R$ {amount}</Price>

                        <Button
                            title='Confirmar pedido'
                            onPress={handleOrder}
                            isLoading={sendingOrder}
                        />
                    </Form>
                </ContentScroll>
            </Container>
        </GestureHandlerRootView>
    )
}