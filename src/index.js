import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, this.renderer.domElement.width / this.renderer.domElement.height, 0.001, 1000 );
        this.orbitControls = new OrbitControls( this.camera );
    }
    
    initScene = () => {
        this.renderer.setClearColor( 0xcccccc );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const light = new THREE.AmbientLight( 0xffffff );
        const lightPoint = new THREE.PointLight( 0xffffff, 0.5 );
        lightPoint.position.set(0, 200, 350);
        this.scene.add( light, lightPoint );
        
        this.camera.position.set(0, 150, 300);
        this.camera.lookAt(0, 0, 0);

        this.onWindowResize();
        this.createCube();

        this.animate();
    }

    createCube = () => {
        console.log('cube')
        const geometry = new THREE.BoxGeometry(100, 100, 100);
        const material = new THREE.MeshStandardMaterial( 0x000000 )
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    onWindowResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    }

    animate = () => {
        requestAnimationFrame( this.animate );
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

const app = new App();
app.initScene();