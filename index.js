let renderer, scene, camera;

let sphere, sphereBound;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

function init() {

    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
    camera.position.z = 120;

    scene = new THREE.Scene();

    const amount = 3000;
    const amountBound = 1000;
    const radius = 15;

    const positions = new Float32Array(amount * 3);
    const colors = new Float32Array(amount * 3);
    const sizes = new Float32Array(amount);

    const positionBounds = new Float32Array(amountBound * 3);
    const colorBounds = new Float32Array(amountBound * 3);
    const sizeBounds = new Float32Array(amountBound);

    const vertex = new THREE.Vector3();
    const color = new THREE.Color(0xffffff);
    for (let index = 0; index < 3; index++) {
        let i = index * amount / 3;
        let max = amount / 3 + index * amount / 3;
        console.log("@@@@ Index: " + index);
        console.log("@@@@ I: " + i);
        console.log("@@@@ Max: " + max);
        while (i < max) {
            let x = (Math.random() * 2 - 1);
            let y = (Math.random() * 2 - 1) + 0.2;

            // if (x * x + y * y > 1) continue;
            if (!checkBound(x, y, index)) continue;
            if (checkBound(x, y, index)) {
                color.setHSL(0.95 + 0.05 * (i / amount), 0.9, 0.5);
            }
            i++;

            vertex.x = x * radius;
            vertex.y = y * radius;
            vertex.z = (Math.random() * 2 - 1) * 0.4 * radius;

            vertex.toArray(positions, i * 3);

            color.toArray(colors, i * 3);

            sizes[i] = 10;

        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    //
    const material = new THREE.ShaderMaterial({

        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: new THREE.TextureLoader().load('textures/sprites/spark1.png') }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true

    });

    //

    sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    //
    const geometryBound = new THREE.BufferGeometry();
    geometryBound.setAttribute('position', new THREE.BufferAttribute(positionBounds, 3));
    geometryBound.setAttribute('customColor', new THREE.BufferAttribute(colorBounds, 3));
    geometryBound.setAttribute('size', new THREE.BufferAttribute(sizeBounds, 1));
    let i = 0;
    while (i < amountBound) {
        let x = (Math.random() * 2 - 1);
        let y = (Math.random() * 2 - 1) + 0.2;

        // if (x * x + y * y > 1) continue;
        if (!checkBound(x, y, 1)) continue;
        if (checkBound(x, y, 1)) {
            // color.setHSL(0.1 + index * 0.4 + 0.05 * (i / amount), 0.9, 0.5);
            color.setHSL(0.9 + 0.05 * (i / amount), 0.9, 0.5);
        }
        i++;

        vertex.x = x * radius * 1.2;
        vertex.y = y * radius * 1.2;
        vertex.z = (Math.random() * 2 - 1) * 0.4 * radius;

        vertex.toArray(positionBounds, i * 3);

        color.toArray(colorBounds, i * 3);

        sizeBounds[i] = 10;

    }
    sphereBound = new THREE.Points(geometryBound, material);
    scene.add(sphereBound);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    const container = document.getElementById('container-heart');
    container.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();
}

function checkBound(x, y, index) {
    let step = 0.1
    let valueCheck = Math.pow((x * x + y * y - step - step * 3), 3) - x * x * y * y * y;
    let valueMinCheck = Math.pow((x * x + y * y - step - step * index), 3) - x * x * y * y * y;

    if (index == 0) {
        return valueCheck < 0;
    } else {
        return valueCheck < 0 && valueMinCheck > 0;
    }
}

function render() {

    //animation Camera
    const timeCamera = Date.now() * 0.07;
    // camera.position.z = 150 + Math.abs(50 - timeCamera % 100);

    const time = Date.now() * 0.005;
    // sphere.rotation.z = 0.01 * time;

    // sphere.scale.x = 1 + Math.abs(timeCamera % 100 - 50) / 300;
    // sphere.scale.y = 1 + Math.abs(timeCamera % 100 - 50) / 300;
    // sphere.scale.z = 1 + Math.abs(timeCamera % 100 - 50) / 600;

    sphere.scale.x = 1 + Math.abs(Math.sin(timeCamera / 50)) / 10
    sphere.scale.y = 1 + Math.abs(Math.sin(timeCamera / 50)) / 10
    sphere.scale.z = 1 + Math.abs(Math.sin(timeCamera / 50)) / 10

    sphereBound.scale.x = 1 + Math.abs(Math.cos(timeCamera / 50)) / 20
    sphereBound.scale.y = 1 + Math.abs(Math.cos(timeCamera / 50)) / 20
    sphereBound.scale.z = 1 + Math.abs(Math.cos(timeCamera / 50)) / 20

    const geometry = sphere.geometry;
    const attributes = geometry.attributes;

    for (let i = 0; i < attributes.size.array.length; i++) {
        attributes.size.array[i] = 7 + 3.5 * Math.sin(0.1 * i + time);
    }

    attributes.size.needsUpdate = true;

    const geometryBound = sphereBound.geometry;
    const attributesBound = geometryBound.attributes;

    for (let i = 0; i < attributesBound.size.array.length; i++) {
        attributesBound.size.array[i] = 6 + 3 * Math.sin(0.1 * i + time);
    }

    attributesBound.size.needsUpdate = true;

    renderer.render(scene, camera);

}

init();
animate();