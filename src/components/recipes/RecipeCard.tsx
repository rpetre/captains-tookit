import { Box, Group, Tooltip, Indicator, Image, Card, Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { useActions, useAppState } from 'state';
import { RecipeId } from 'state/app/effects';
import Icons from 'components/ui/Icons';

type RecipeCardProps = {
    id: RecipeId,
}

export const RecipeCard: React.FC<RecipeCardProps> = ({id}) => {
    const recipes = useAppState(state => state.recipes.items)
    const products = useAppState(state => state.products.items)
    const machines = useAppState(state => state.machines.items)
    const selectRecipesItem = useActions().recipes.selectRecipesItem


    let recipe = recipes[id];

    if (!recipe) { return null };

    const building = machines[recipe.machine]

    let recipeInputs = recipe.inputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })
    let recipeOutputs = recipe.outputs.map(p => {
        return {
            ...products[p.id],
            quantity: p.quantity
        }
    })

    return (
        <React.Fragment>
            <Card
                shadow="xs"
                sx={(theme) => ({
                    '&:hover': {
                        backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[9],
                    },
                })}
            >
                
                <Group position='apart'>
                    {/* left part, building plus recipe */}
                    <Group spacing="xl">
                        <Link to={`/buildings/${building.id}`}>
                            <Image height={43} radius="md"
                                    src={`/assets/buildings/${building.icon}`} alt={building.name}
                            />
                        </Link>
                        {/* actual recipe */}
                        <Group spacing="xs" noWrap>
                                <Group
                                    noWrap
                                    spacing="xs"
                                    sx={theme => ({
                                        '& .product-input .product-icon': {
                                            color: theme.colors.gray[6]
                                        },
                                        '& .product-input:last-child .product-icon': {
                                            display: 'none'
                                        }
                                    })}
                                >
                                    {recipeInputs.map(product => {
                                        return (
                                            <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                                                <Tooltip
                                                    label={product.name}
                                                    withArrow
                                                    color="green"
                                                    withinPortal
                                                >
                                                    <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                                        <Box
                                                            p={8}
                                                            sx={theme => ({
                                                                borderRadius: theme.radius.md,
                                                                border: `1px solid ${theme.colors.gray[1]}`,
                                                                background: theme.colors.gray[7]
                                                            })}
                                                        >
                                                            <Link to={`/products/${product.id}`}>
                                                                <Image src={`/assets/products/${product.icon}`} height={22} width={22} />
                                                            </Link>
                                                        </Box>
                                                    </Indicator>
                                                </Tooltip>
                                                <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                            </Group>
                                        )
                                    })}
                                </Group>
                                <Group
                                    spacing="xs">
                                    <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                                </Group>
                                <Group
                                    noWrap
                                    spacing="xs"
                                    sx={theme => ({
                                        '& .product-output .product-icon': {
                                            color: theme.colors.gray[6]
                                        },
                                        '& .product-output:last-child .product-icon': {
                                            display: 'none'
                                        }
                                    })}
                                >
                                    {recipeOutputs.map(product => {
                                        return (
                                            <Group className="product-output" spacing="xs" key={`output_${product.id}`} noWrap>
                                                <Tooltip
                                                    label={product.name}
                                                    withArrow
                                                    color="red"
                                                    withinPortal
                                                >
                                                    <Indicator label={product.quantity} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                                        <Box
                                                            p={8}
                                                            sx={theme => ({
                                                                borderRadius: theme.radius.md,
                                                                border: `1px solid ${theme.colors.gray[1]}`,
                                                                background: theme.colors.gray[7]
                                                            })}
                                                        >
                                                            <Link to={`/products/${product.id}`}>
                                                                <Image src={`/assets/products/${product.icon}`} height={26} width={26} />
                                                            </Link>
                                                        </Box>
                                                    </Indicator>
                                                </Tooltip>
                                                <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                            </Group>
                                        )
                                    })}
                                </Group>
                        </Group>
                    </Group>
                    <Button onClick={() => {selectRecipesItem( {recipeId: recipe.id, usage: 1} )}}>
                        <Icon icon={Icons.add} />
                    </Button>
                </Group>
            </Card>
        </React.Fragment>
    );
};
