import React, { useCallback, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Alert, FlatList, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useTheme } from 'styled-components'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

import { Search } from '../../components/Search'

import happyEmoji from '../../assets/happy.png'

import {
    Container,
    Header,
    Greeting,
    GreetingEmoji,
    GreetingText,
    MenuHeader,
    MenuItemsNumber,
    Title,
    NewProductButton,
} from './styles'
import { ProductCard, ProductProps } from '../../components/ProductCard'


export function Home() {
    const [pizzas, setPizzas] = useState<ProductProps[]>([])
    const [search, setSearch] = useState('')

    const { COLORS } = useTheme()
    const navigation = useNavigation()


    const { user, signOut } = useAuth()

    function fetchPizzas(value: string) {
        const formattedValue = value.toLocaleLowerCase().trim()

        firestore()
            .collection('pizzas')
            .orderBy('name_insensitive')
            .startAt(formattedValue)
            .endAt(`${formattedValue}\uf8ff`)
            .get()
            .then(response => {
                const data = response.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    }
                }) as ProductProps[]

                setPizzas(data)
            })
            .catch(() => Alert.alert('Consulta', 'Nào foi possível realizar a consulta.'))
    }

    function handleSearch() {
        fetchPizzas(search)
    }

    function handleSearchClear() {
        setSearch('')
        fetchPizzas('')
    }

    function handleOpen(id: string) {
        const route = user?.isAdmin ? 'product' : 'order'
        navigation.navigate(route, { id })
    }

    function handleAdd() {
        navigation.navigate('product', {})
    }

    useFocusEffect(
        useCallback(() => {
            fetchPizzas('')
        }, [])
    )

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Container>
                <Header>
                    <Greeting>
                        <GreetingEmoji source={happyEmoji} />
                        <GreetingText>Olá, {user?.name}</GreetingText>
                    </Greeting>

                    <TouchableOpacity onPress={signOut}>
                        <MaterialIcons
                            name='logout'
                            size={24}
                            color={COLORS.TITLE}
                        />
                    </TouchableOpacity>
                </Header>

                <Search
                    onSearch={handleSearch}
                    onClear={handleSearchClear}
                    onChangeText={setSearch}
                    value={search}
                />

                <MenuHeader>
                    <Title>Cardápio</Title>
                    <MenuItemsNumber>{pizzas.length} {pizzas.length === 1 ? 'pizza' : 'pizzas'}</MenuItemsNumber>
                </MenuHeader>

                <FlatList
                    data={pizzas}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ProductCard
                            data={item}
                            onPress={() => handleOpen(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: 125,
                        marginHorizontal: 24,
                    }}
                />


                {
                    user?.isAdmin &&
                    <NewProductButton
                        title='Cadastrar Pizza'
                        type='secondary'
                        onPress={handleAdd}
                    />
                }
            </Container>
        </GestureHandlerRootView>
    )
}