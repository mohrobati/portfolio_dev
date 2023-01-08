import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Music
let guitar = ['Am', 'C', 'D', 'F', 'Am', 'C', 'E', 'E', 'Am', 'C', 'D', 'F', 'Am', 'E']
let curr_guitar = 0

let piano = ['G', 'Bb', 'C', 'G', 'Bb', 'Db', 'C', 'G', 'Bb', 'C', 'Bb', 'G']
let curr_piano = 0

// Lights
const pointLight1 = new THREE.PointLight(0xdbffff, 1);
pointLight1.position.set(2,3,-3)
scene.add(pointLight1)

// const pointLightHelper1 = new THREE.PointLightHelper( pointLight1, 1.5 );
// scene.add(pointLightHelper1)

const pointLight2 = new THREE.PointLight(0xdbffff, 1);
pointLight2.position.set(1,1,-3)
scene.add(pointLight2)

// const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, 1.5 );
// scene.add(pointLightHelper2)

const pointLight3 = new THREE.PointLight(0xdbffff, 2);
pointLight3.position.set(-2,-1,0)
scene.add(pointLight3)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 2
camera.position.z = -5
scene.add(camera)

// // Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0.5,1,-3)
controls.enablePan = false
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let loader = new GLTFLoader();
loader.load(`./assets/room.gltf`, (gltf) => {
    const mesh = gltf.scene;
    mesh.scale.set(0.01,0.01,0.01);
    scene.add(mesh);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = -2;
    mesh.rotation.y = 3.14;
});   

loader.load(`./assets/desk.gltf`, (gltf) => {
    const mesh = gltf.scene;
    mesh.scale.set(0.01,0.01,0.01);
    scene.add(mesh);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = -2;
    mesh.rotation.y = 3.14;
});   

const fontLoader = new THREE.FontLoader()

fontLoader.load("./fonts/violet.json", (font) => {
    let geometry, textMesh;
    geometry = new THREE.TextGeometry("Welcome to my portfolio!", {
        font: font, 
        size: 0.2,
        height: 0.05
    })
    textMesh = new THREE.Mesh(geometry, [
        new THREE.MeshPhongMaterial({color: 0xffffff}),
        new THREE.MeshPhongMaterial({color: 0xffffff})
    ])
    textMesh.position.set(1,2.3,-1)
    textMesh.rotation.y = 2.2
    scene.add(textMesh)
    geometry = new THREE.TextGeometry("Moh (Zoso) Robati", {
        font: font, 
        size: 0.06,
        height: 0.05
    })
    textMesh = new THREE.Mesh(geometry, [
        new THREE.MeshPhongMaterial({color: 0xffd000}),
        new THREE.MeshPhongMaterial({color: 0x00})
    ])
    textMesh.position.set(1.25,1.1,-2.1)
    textMesh.rotation.y = 2.55
    textMesh.rotation.x = 0.5
    textMesh.rotation.z = -0.25
    scene.add(textMesh)

    geometry = new THREE.TextGeometry("Click on things you \n find interesting!", {
        font: font, 
        size: 0.08,
        height: 0.05
    })
    textMesh = new THREE.Mesh(geometry, [
        new THREE.MeshPhongMaterial({color: 0x000c63}),
        new THREE.MeshPhongMaterial({color: 0x000c63})
    ])
    textMesh.position.set(-0.62,1.4,-3)
    textMesh.rotation.y = 1.57

    scene.add(textMesh)
})

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let comp = false;

let pcSceneStart = () => {
    if (!comp) return
    controls.enableRotate = false
    controls.enableZoom = false
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.id = "iframe"
    iframe.style.position = 'absolute'
    iframe.style.left = 0
    iframe.style.right = 0
    iframe.style.marginLeft = 'auto'
    iframe.style.marginRight = 'auto'
    iframe.style.marginTop = window.innerHeight * 0.12 + "px"
    iframe.style.width = window.innerHeight + 70 + "px"
    iframe.style.border = "none"
    iframe.style.height = "66%"
    iframe.src = "webpage/index.html"
    window.addEventListener("resize", (event) => {
        iframe.style.marginTop = window.innerHeight * 0.12 + "px"
        iframe.style.width = window.innerHeight + 70 + "px"
    });
}

let pcSceneKill = () => {
    document.getElementById('iframe').remove();
    controls.enableRotate = true
    controls.enableZoom = true
}

let onClick = (event) => {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0 ) {
        console.log(intersects)
        if (!comp && intersects[0].object.name.startsWith("PC")) {
            gsap.to(camera.position, {
                x: -0.25,
                y: 0.75,
                z: -3.515,
                duration: 2,
                ease: "power4"
            })
            gsap.to(controls.target, {
                x: -0.5,
                y: 0.75,
                z: -3.515,
                duration: 2,
                ease: "power4",
                onComplete: pcSceneStart
            })
            comp = !comp
        }
        if (!comp && intersects[0].object.name.startsWith("keys")) {
            new Audio("piano/"+(piano[curr_piano%12])+".mp3").play()
            curr_piano++
        }
        if (!comp && ['Plane', 'Cylinder'].some(word => intersects[0].object.name.startsWith(word))) {
            new Audio("guitar/"+(guitar[curr_guitar%14])+".mp3").play()
            curr_guitar++
        }
        if (!comp && intersects[0].object.name.startsWith("botella")) {
            window.open('https://en.wikipedia.org/wiki/Teetotalism', '_blank')
        }
        if (!comp && intersects[0].object.name.startsWith("cama_Material")) {
            window.open('https://en.wikipedia.org/wiki/Pillow', '_blank')
        }
        if (!comp && intersects[0].object.name.startsWith("Libros_17")) {
            window.open('https://en.wikipedia.org/wiki/Green_Book_(film)', '_blank')
        }
        if (!comp && ['Object_2001', 'Object_3001', 'Icosphere'].some(word => intersects[0].object.name.startsWith(word))) {
            window.open('assets/photo.jpg', '_blank')
        }
        if (comp && intersects[0].object.name.startsWith("Pared")) {
            gsap.to(camera.position, {
                x: 3,
                y: 2,
                z: -5,
                duration: 2,
                onStart: pcSceneKill
            })
            gsap.to(controls.target, {
                x: 0.5,
                y: 1,
                z: -3,
                duration: 2,
            })
            comp = !comp
        }
    }
}

const tick = () =>
{
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

window.addEventListener('pointerup', onClick);
tick()