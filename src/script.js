import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0x000000, 0, 100 );


/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
 scene.add(ambientLight)
 gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)
 
//  const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
//  directionalLight.position.set(1, 0.25, 0)
//  scene.add(directionalLight)
 
 const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5)
 scene.add(hemisphereLight)
 
 const pointLight = new THREE.PointLight(0xff9000,3.5, 10)
 scene.add(pointLight)
 pointLight.position.set(1, 0.5, 2)
 
/**
 * Ghosts
 * 
 */
 const ghost1 = new THREE.PointLight("#ff00ff", 2, 3)
 ghost1.position.set(6,1,1)
 scene.add(ghost1)
 
 const ghost2 = new THREE.PointLight("#0000ff", 2, 3)
 scene.add(ghost2)

//  const ghost1tHelper = new THREE.PointLightHelper(ghost1, 2)
//  const ghost2tHelper = new THREE.PointLightHelper(ghost2, 2)
 
// scene.add(ghost1tHelper, ghost2tHelper)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Object
 */


/**
 * 3D text
 */
let textGeometry = null
let textMaterial = null
let text = null
let font = null

const fontLoader = new THREE.FontLoader()

fontLoader.load('fonts/helvetiker_regular.typeface.json', function(fontVal) 
{
    font = fontVal
    textGeometry = new THREE.TextGeometry( 'Getting WAU..', {
		font: font,
		size: 8,
		height: 2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.5,
		bevelSize: 0.1,
		bevelOffset: 0,
		bevelSegments: 5
	})
    textGeometry.center()

    textMaterial = new THREE.MeshStandardMaterial()

    text = new THREE.Mesh(textGeometry, textMaterial)

    text.scale.set(0.3, 0.3, 0.3)
    text.position.y = 4
    scene.add(text)

})


function refresh3DText(currentValue) {
    textGeometry.dispose()
    textMaterial.dispose()
    scene.remove(text)

    const currentValueString = currentValue.toString()

    textGeometry = new THREE.TextGeometry( currentValueString, {
		font: font,
		size: 10,
		height: 2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.5,
		bevelSize: 0.1,
		bevelOffset: 0,
		bevelSegments: 5
	})
    textGeometry.center()

    textMaterial = new THREE.MeshStandardMaterial()

    text = new THREE.Mesh(textGeometry, textMaterial)
    // text.scale.set(0.3, 0.3, 0.3)
    text.position.y = 5
    scene.add(text)


}

// Floor

const floorMaterial = new THREE.MeshBasicMaterial({color: 'blue'});
floorMaterial.wireframe = true
let floorGeometry = new THREE.PlaneGeometry( 1000, 1000, 200, 200)
floorGeometry.rotateX( - Math.PI / 2 );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
scene.add( floor );




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 2
camera.position.z = 50

scene.add(camera)



// Controls

//const controls = new OrbitControls(camera, canvas)
const controls = new PointerLockControls( camera, canvas );

//controls.enableDamping = true

const blocker = document.getElementById( 'blocker' );
const instructions = document.getElementById( 'instructions' );

instructions.addEventListener( 'click', function () {

    controls.lock();
    getNewData();


} );



controls.addEventListener( 'lock', function () {

    instructions.style.display = 'none';
    blocker.style.display = 'none';

} );

controls.addEventListener( 'unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';

} );
scene.add( controls.getObject() );


let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};
document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
 * Animate
 */
const clock = new THREE.Clock()

let prevTime = 0
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const tick = () =>
{
    const time = clock.getElapsedTime()
    const delta = ( time - prevTime );

    // Update controls
    //controls.update()

    if ( controls.isLocked === true ) {
        velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 180.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 180.0 * delta;

        controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );
    }

   


    // update ghosts
    const ghostAngle1 = time * 3
    ghost1.position.x = Math.sin(ghostAngle1) * 4
    ghost1.position.z = Math.cos(ghostAngle1) * 4
    ghost1.position.y = Math.sin(time * 3) + 3

    const ghostAngle2 = -1 * time * 4
    ghost2.position.x = Math.sin(ghostAngle2) * 4
    ghost2.position.z = Math.cos(ghostAngle2) * 4
    ghost2.position.y = Math.sin(time * 4) + Math.sin(time * 2.5) + 7


    prevTime = time;
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/**
 * Mixpanel
 */
 function getNewData() {

    const url = 'https://mixpanel.com/api/2.0/insights?project_id=2262287&bookmark_id=13534965';
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic RGFiYmxlRGFzaC40MGNkZGQubXAtc2VydmljZS1hY2NvdW50Ok04QlZxbFQ1Q0VUSVFmV1NucUYwU2JQUUxxSUVjV21n'
      }
    };
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
          console.log(json)
          processMixpanelData(json)
        })
      .catch(err => console.error('error:' + err));
}

 function processMixpanelData(json) {
    const series = json.series;
    const values = series["Active User - Unique"];
    console.log(values);

    // fill date in WAU header
    let count = Object.keys(values).length;
    let lastDate = new Date(Object.keys(values)[count-1]);
    const lastDateStr = lastDate.toLocaleString('default', { month: 'long', day: 'numeric' });

    let endDate = new Date();
    endDate.setDate(lastDate.getDate() + 7);
    console.log(endDate);
    const endDateStr = endDate.toLocaleString('default', { month: 'long', day: 'numeric' });

    let todayDate = new Date();
    let daysLeft = Math.round((endDate.getTime() - todayDate.getTime()) / (1000*60*60*24));


    // document.getElementById("start-day").innerHTML = lastDateStr;
    // document.getElementById("end-day").innerHTML = endDateStr;

    // fill WAU progress values

    let currentValue = Object.values(values)[count-1];


    // add to text
    refresh3DText(currentValue)



    let previousValue = Object.values(values)[count-2];
    console.log("previous val = " + previousValue);

    let goalValue = previousValue * 1.10;

    // document.getElementById("goal-wau").innerHTML = Math.round(goalValue);
    // document.getElementById('current-wau').innerHTML = currentValue;
    if (currentValue < goalValue) {
        // document.getElementById('current-wau').style.color = "red";
    }
    else {
        // document.getElementById('current-wau').style.color = "green";
    }
    // document.getElementById('days-left').innerHTML = daysLeft;
    // document.getElementById('today-date').innerHTML = todayDate.toLocaleString('default', { month: 'long', day: 'numeric' });

}
