import { Box, Divider, Group, Stack, Text, Image } from '@mantine/core';
import PageHeader from 'components/layout/page/PageHeader';
import PageLayout from 'components/layout/page/PageLayout';
import React from 'react';
import { useAppState } from 'state';
import { useParams } from 'react-router-dom';
import { RecipeCard } from 'components/recipes/RecipeCard';

const Product: React.FC = () => {

    const { itemsList } = useAppState(state => state.products)
    const {product_id: id} = useParams();
    let product = itemsList.find(items => id === items.id);

    return (
        <PageLayout header={<PageHeader title={`Product`} />} >
            {!product ? (
                <Box>
                    <Text>{id} not found</Text>
                </Box>
            ) :(
                <Box>
                    <Box
                        
                        sx={(theme) => ({
                            '&:hover': {
                                backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
                            },
                        })}
                    >
                        <Group position='apart'>
                            <Text weight={500}>{product.name}</Text>
                            <Box
                                p="xs"
                                sx={theme=>({
                                    borderRadius: theme.radius.md,
                                    border: `1px solid ${theme.colors.gray[1]}`,
                                    background: theme.colors.gray[7]
                                })}
                            >
                                <Image
                                    height={30}
                                    radius="md"
                                    src={`/assets/products/${product.icon}`} alt={`${product.name}`}
                                />
                            </Box>
                        </Group>
                    </Box>
                    
                    <Divider my="xs" label="Users" />
                    <Stack>
                    {product.recipes.input.map((recipe, key) => <RecipeCard id={recipe} key={key} />)}
                    </Stack>
                    <Divider my="xs" label="Producers" />
                    <Stack>
                    {product.recipes.output.map((recipe, key) => <RecipeCard id={recipe} key={key} />)}
                    </Stack>
                    
                </Box>
            )}
        </PageLayout>
    )
}

export default Product;