import { Box, Image, Tooltip, Text, MantineColor, Stack } from "@mantine/core";
import React from "react";
import { useAppState } from "state";
import { BuildCost } from "state/app/effects";

type CostsIconProps = {
    recipeId: string;
    product: BuildCost;
    color?: MantineColor;
    usage?: number;
}

const CostsIcon: React.FC<CostsIconProps> = ({ product, recipeId, color = "dark", usage = 1 }) => {

    const products = useAppState(state => state.products.items)
    const productData = products[product.id]
    let unitValue = Math.round(product.quantity * 10) / 10
    let actualValue = Math.round(product.quantity * usage * 10) / 10
    let text = (usage === 1) ? unitValue : actualValue + " (" + unitValue + " each)"
    return (

        <Stack align="center" spacing={5}>
            <Tooltip
                label={product.name}
                withArrow
                withinPortal
            >
                <Box
                    p={6}
                    sx={theme => ({
                        borderRadius: theme.radius.sm,
                        background: theme.colors.dark[3]
                    })}
                >
                    <Image src={`/assets/products/${productData.icon}`} height={28} width={28} />
                </Box>
            </Tooltip>
            <Text weight="bold" size="sm" sx={theme => ({ lineHeight: `${theme.fontSizes.sm}px` })}>{text}</Text>
                    
        </Stack>

    )

}

export default CostsIcon; 