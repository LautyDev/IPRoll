'use client';

import '../styles/global.scss';
import { Box, ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false
	}
});

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<head>
				<title>IPRoll</title>
				<link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
				<meta name='viewport' content='initial-scale=1, width=device-width' />
			</head>
			<body>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<ChakraProvider theme={theme}>
					<Box h='100%' w='100%' bg='#000000'>
						<Box h='100%' w='100%'>
							{children}
						</Box>
					</Box>
				</ChakraProvider>
			</body>
		</html>
	);
}
