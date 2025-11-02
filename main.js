import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// DOM Elements
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');

// Socket.IO
const socket = io();

// Scene, Camera, Renderer and Lighting setup...
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 0, 75);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
const hemisphereLight = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 0.9);
scene.add(hemisphereLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x228B22 }));
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Simple Tree Generator
function createTree(x, z) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3, 8), new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
    trunk.position.set(x, 1.5, z);
    trunk.castShadow = true;
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 8), new THREE.MeshStandardMaterial({ color: 0x006400 }));
    leaves.position.set(x, 3 + 1, z);
    leaves.castShadow = true;
    const tree = new THREE.Group();
    tree.add(trunk);
    tree.add(leaves);
    return tree;
}
for (let i = 0; i < 50; i++) {
    const x = Math.random() * 80 - 40;
    const z = Math.random() * 80 - 40;
    scene.add(createTree(x, z));
}

// NPC
const npcGeo = new THREE.CapsuleGeometry(0.4, 1.0, 4, 8);
const npcMat = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue
const npc = new THREE.Mesh(npcGeo, npcMat);
npc.position.set(0, 0.9, -5);
npc.castShadow = true;
scene.add(npc);


// Controls, Multiplayer, Chat, Movement and Animation Loop...
const controls = new PointerLockControls(camera, document.body);
instructions.addEventListener('click', () => controls.lock());
scene.add(controls.getObject());

const otherPlayers = {};
socket.on('currentPlayers', (players) => Object.values(players).forEach(p => { if (p.id !== socket.id) addPlayer(p); }));
socket.on('newPlayer', addPlayer);
socket.on('playerDisconnected', (id) => {
    if (otherPlayers[id]) {
        scene.remove(otherPlayers[id].mesh);
        delete otherPlayers[id];
    }
});
socket.on('playerMoved', (player) => {
    if (otherPlayers[player.id]) {
        otherPlayers[player.id].mesh.position.copy(player.position);
        otherPlayers[player.id].mesh.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
    }
});

function addPlayer(player) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 0.5), new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff }));
    mesh.position.copy(player.position);
    mesh.castShadow = true;
    otherPlayers[player.id] = { mesh };
    scene.add(mesh);
}

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && chatInput.value) {
        socket.emit('chatMessage', chatInput.value);
        chatInput.value = '';
    }
});

socket.on('chatMessage', ({ id, message }) => {
    const msgEl = document.createElement('div');
    if (id === 'NPC') {
        msgEl.textContent = `Wizard: ${message}`;
        msgEl.style.color = 'cyan';
        msgEl.style.fontStyle = 'italic';
    } else {
        const playerName = id === socket.id ? 'You' : `Player ${id.substring(0, 4)}`;
        msgEl.textContent = `${playerName}: ${message}`;
    }
    chatLog.appendChild(msgEl);
    chatLog.scrollTop = chatLog.scrollHeight;
});

const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

const moveSpeed = 5.0;
const clock = new THREE.Clock();
let lastUpdateTime = 0;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (controls.isLocked) {
        const direction = new THREE.Vector3();
        direction.z = Number(keys['KeyW']) - Number(keys['KeyS']);
        direction.x = Number(keys['KeyD']) - Number(keys['KeyA']);
        direction.normalize();

        if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']) {
            controls.moveRight(direction.x * moveSpeed * delta);
            controls.moveForward(direction.z * moveSpeed * delta);
        }

        if (time - lastUpdateTime > 0.1) {
            socket.emit('playerMovement', {
                position: controls.getObject().position,
                rotation: { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }
            });
            lastUpdateTime = time;
        }
    }

    renderer.render(scene, camera);
}
animate();
