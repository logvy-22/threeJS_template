import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import FBXLoader from 'three-fbx-loader';
import * as listeners from './listeners';

class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.cameras = {
      TOP_VIEW: this.createBaseCamera('TOP_VIEW'),
      FRONT_VIEW: this.createBaseCamera('FRONT_VIEW'),
      PERSPECTIVE_VIEW: this.createBaseCamera('PERSPECTIVE_VIEW'),
    };
    this.camera = this.cameras.TOP_VIEW;
    this.orbitControls = new OrbitControls(this.camera);
  }

  initScene = () => {
    this.renderer.setClearColor(0xcccccc);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff);
    const lightPoint = new THREE.PointLight(0xffffff, 0.5);
    lightPoint.position.set(0, 200, -350);
    this.scene.add(light, lightPoint);

    this.camera.add(new THREE.PointLight(0xffffff, 0.5));

    // window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();

    this.loadRobot();

    this.animate();
  };

  createBaseCamera = view => {
    const orthographicCamera = new THREE.OrthographicCamera(
      this.renderer.domElement.width / -2,
      this.renderer.domElement.width / 2,
      this.renderer.domElement.height / 2,
      this.renderer.domElement.height / -2,
      1,
      1000,
    );

    const perspectiveCamera = new THREE.PerspectiveCamera(
      75,
      this.renderer.width / this.renderer.height,
      0.001,
      1000,
    );

    switch (view) {
      case 'TOP_VIEW':
        orthographicCamera.position.set(0, 500, 0);
        return orthographicCamera;
      case 'FRONT_VIEW':
        orthographicCamera.position.set(0, 0, -300);
        return orthographicCamera;
      case 'PERSPECTIVE_VIEW':
        perspectiveCamera.position.set(0, 0, 300);
        return perspectiveCamera;
    }
  };

  switchCamera = cameraType => {
    switch (cameraType) {
      case 'TOP_VIEW':
        this.camera = this.cameras.TOP_VIEW;
        this.camera.name = 'Top view';
        this.orbitControls.camera = this.camera;
        console.log(this.orbitControls);
        break;
      case 'FRONT_VIEW':
        this.camera = this.cameras.FRONT_VIEW;
        this.camera.name = 'Front view';
        this.orbitControls.camera = this.camera;
        console.log(this.orbitControls);
        break;
      case 'PERSPECTIVE_VIEW':
        this.camera = this.cameras.PERSPECTIVE_VIEW;
        this.camera.name = 'Perspective view';
        this.orbitControls.camera = this.camera;
        console.log(this.orbitControls);
        break;
    }
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
  };

  loadRobot = () => {
    console.log('robot');
    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const diffuseMap = textureLoader.load('./Robot/Textures/Robot_Diffuse.png');
    const aoMap = textureLoader.load('./Robot/Textures/Robot_AO.png');
    const normalMap = textureLoader.load('./Robot/Textures/Robot_Normal.png');
    const alphaMap = textureLoader.load('./Robot/Textures/Robot_Opacity.png');
    const metallnessMap = textureLoader.load('./Robot/Textures/Robot_Metallic.png');
    const roughnessMap = textureLoader.load('./Robot/Textures/Robot_Roughness.png');
    const emissiveMap = textureLoader.load('./Robot/Textures/Robot_Emission.png');
    fbxLoader.load('./Robot/Robot_fbx.fbx', robot => {
      robot.traverse(child => {
        if (child.isMesh) {
          const material = new THREE.MeshStandardMaterial({
            map: diffuseMap,
            aoMap: aoMap,
            normalMap: normalMap,
            alphaMap: alphaMap,
            metalnessMap: metallnessMap,
            roughnessMap: roughnessMap,
            emissiveMap: emissiveMap,
          });
          child.material = material;
          child.material.needsUpdate = true;
        }
      });
      robot.position.y = -100;
      this.scene.add(robot);
    });
  };

  onWindowResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    this.camera.updateProjectionMatrix();
  };

  addAxesHelper = size => {
    const axes = new THREE.AxesHelper(size);
    this.scene.add(axes);
  };

  addGridHelper = (size, divisions) => {
    // this.scene.add(new THREE.GridHelper(size, divisions));
    var gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    gridHelper.position.y = -150;
    gridHelper.position.x = -150;
    this.scene.add(gridHelper);
    var polarGridHelper = new THREE.PolarGridHelper(200, 16, 8, 64, 0x0000ff, 0x808080);
    polarGridHelper.position.y = -150;
    polarGridHelper.position.x = 200;
    this.scene.add(polarGridHelper);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.orbitControls.update();
    this.onWindowResize();
    this.renderer.render(this.scene, this.camera);
  };
}

const app = new App();
app.initScene();
listeners.frontButton.addEventListener('click', () => app.switchCamera('FRONT_VIEW'));
listeners.topButton.addEventListener('click', () => app.switchCamera('TOP_VIEW'));
listeners.perspectiveButton.addEventListener('click', () => app.switchCamera('PERSPECTIVE_VIEW'));
