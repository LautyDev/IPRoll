import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, IconButton } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const ThreeTextAnimation = () => {
	const mountRef = useRef<HTMLDivElement>(null);
	const [ip, setIp] = useState<string | null>(null);
	const [showClick, setShowClick] = useState(true);
	const [startAnimation, setStartAnimation] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	useEffect(() => {
		const fetchIP = async () => {
			const response = await fetch('/api/get-ip');
			const data = await response.json();
			setIp(data.ip);
		};

		fetchIP();
	}, []);

	useEffect(() => {
		if (!ip || !mountRef.current || !startAnimation) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		mountRef.current.appendChild(renderer.domElement);

		const fontLoader = new FontLoader();
		let textMesh: THREE.Mesh;
		let audioReady = false;
		let audioPlaying = false;
		let textDescendedDate: Date | null = null;

		fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
			const textGeometry = new TextGeometry(ip, {
				font: font,
				size: window.innerWidth < 768 ? window.innerWidth / 110 : 7,
				height: 1,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: window.innerWidth < 768 ? 0.01 : 0.1,
				bevelOffset: 0,
				bevelSegments: 5
			});

			const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
			textMesh = new THREE.Mesh(textGeometry, textMaterial);
			textGeometry.center();
			textMesh.position.y = 50;
			scene.add(textMesh);
		});

		const audio = new Audio('./freebird.mp3');
		audio.addEventListener('canplaythrough', () => {
			audioReady = true;
		});

		camera.position.z = 50;
		let lastTime = 0;

		const animate = (time: number) => {
			requestAnimationFrame(animate);
			const deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
			lastTime = time;

			if (textMesh) {
				if (textMesh.position.y > 0) {
					textMesh.position.y -= 15 * deltaTime;
				} else {
					if (!textDescendedDate) textDescendedDate = new Date();
					if (new Date(textDescendedDate.getTime() + 1000) < new Date()) {
						if (audioReady && !audioPlaying) {
							audio.play();
							audioPlaying = true;
						}
					}
					if (audioPlaying) {
						textMesh.rotation.x += 1.5 * deltaTime;
						textMesh.rotation.y += 1.5 * deltaTime;
						textMesh.rotation.z += 0.2 * deltaTime;
					}
				}
			}
			renderer.render(scene, camera);
		};

		animate(0);

		audio.addEventListener('ended', () => {
			audio.currentTime = 0;
			audio.play();
		});

		return () => {
			mountRef.current?.removeChild(renderer.domElement);
		};
	}, [ip, startAnimation]);

	const handleIpClick = () => {
		if (ip) {
			navigator.clipboard.writeText(ip).then(() => {
				setShowAlert(true);

				setTimeout(() => setShowAlert(false), 3000);
			});
		}
	};

	return (
		<Box id='app' position='relative' width='100vw' height='100vh'>
			{showClick && (
				<Box
					id='click'
					position='absolute'
					top={0}
					left={0}
					width='100%'
					height='100%'
					display='flex'
					justifyContent='center'
					alignItems='center'
					zIndex={1}
				>
					<IconButton
						aria-label='Start Animation'
						icon={<FaPlay size={75} />}
						variant='ghost'
						_hover={{ bg: '#000000' }}
						onClick={() => {
							setShowClick(false);
							setStartAnimation(true);
						}}
					/>
				</Box>
			)}
			{showAlert && (
				<Alert
					status='info'
					position='absolute'
					bottom='10px'
					right='10px'
					zIndex={2}
					width='auto'
					boxShadow='lg'
					borderRadius='12px'
					bg='#1b1b1b'
				>
					<AlertIcon color='#ffffff' />
					<Box flex='1'>
						<AlertTitle>IP Copied</AlertTitle>
						<AlertDescription display='block' fontSize='sm'>
							Your IP address has been copied to the clipboard.
						</AlertDescription>
					</Box>
					<CloseButton position='absolute' right='8px' top='8px' />
				</Alert>
			)}
			<Box ref={mountRef} width='100%' height='100%' onClick={handleIpClick}></Box>
		</Box>
	);
};

export default ThreeTextAnimation;
