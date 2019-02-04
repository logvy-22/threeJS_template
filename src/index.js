import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import FBXLoader from 'three-fbxloader-offical';

class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.renderer.domElement.width / this.renderer.domElement.height,
      0.001,
      1000,
    );
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.maxPolarAngle = (89 * Math.PI) / 180;
  }

  initScene = () => {
    this.renderer.setClearColor(0xe2e2e2);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff);
    const lightPoint = new THREE.PointLight(0xffffff, 0.5);
    lightPoint.position.set(0, 200, 350);
    this.scene.add(light, lightPoint);

    this.camera.position.set(0, 150, 500);
    this.camera.lookAt(0, 0, 0);

    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
    this.createTerrain();
    this.animate();
  };
  
  createTerrain = () => {
    const geometry = new THREE.PlaneGeometry(600, 600, 50, 50);

    const texture = new THREE.TextureLoader().load('../env/ground.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = texture.repeat.y = 20;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    for (let i = 0, l = geometry.vertices.length; i < l; i++) {
      geometry.vertices[i].z = Math.random() * 20;
    }

    const plane = new THREE.Mesh(geometry, material);
    console.log(plane);
    plane.rotateX(-Math.PI / 2);
    this.scene.add(plane);
  };

  onWindowResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    this.camera.updateProjectionMatrix();
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  };
}

const app = new App();
app.initScene();
