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
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  initScene = () => {
    this.renderer.setClearColor(0xcccccc);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener('click', this.onClick, true);

    const light = new THREE.AmbientLight(0xffffff);
    const lightPoint = new THREE.PointLight(0xffffff, 0.5);
    lightPoint.position.set(0, 200, 350);
    this.scene.add(light, lightPoint);

    this.camera.position.set(0, 150, 500);
    this.camera.lookAt(0, 0, 0);

    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
    this.orbitControls.addEventListener('change', this.normalizeGun);

    this.createSkybox();
    this.createGround();
    this.loadDeer();

    this.animations = [];

    this.loadGun();

    this.animate();
  };

  createSkybox = () => {
    const urls = [
      '../env/px.jpg',
      '../env/nx.jpg',
      '../env/py.jpg',
      '../env/ny.jpg',
      '../env/pz.jpg',
      '../env/nz.jpg',
    ];
    const textureCube = THREE.ImageUtils.loadTextureCube(urls);

    const shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = textureCube;
    const material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
    });

    const skybox = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), material);
    this.scene.add(skybox);
  };

  createGround = () => {
    const plane = new THREE.PlaneGeometry(1000, 1000);
    const texture = new THREE.TextureLoader().load('../env/ground.jpg');
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      depthTest: false,
      map: texture,
    });
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = texture.repeat.y = 20;
    const ground = new THREE.Mesh(plane, material);
    ground.rotation.x = -Math.PI / 2;
    ground.name = 'ground';
    this.scene.add(ground);
  };

  loadDeer = () => {
    const loader = new FBXLoader();
    loader.load('./deer/deer.fbx', deer => {
      deer.mixer = new THREE.AnimationMixer(deer);
      deer.traverse(child => {
        if (child.isMesh) {
          const oldMaterial = child.material;
          if (oldMaterial) {
            const newMaterials = oldMaterial.map(
              texture => new THREE.MeshBasicMaterial({ map: texture.map, skinning: true }),
            );
            child.material = newMaterials;
          }

          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      deer.name = 'deer';
      deer.scale.set(0.3, 0.3, 0.3);

      const action0 = deer.mixer.clipAction(deer.animations[0]);
      this.animations.push(action0);
      action0.play();
      this.scene.add(deer);
    });
  };

  loadGun = () => {
    const loader = new FBXLoader();
    loader.load('./M16_FBX/M16.fbx', gun => {
      gun.name = 'gun';
      this.scene.add(gun);
      this.normalizeGun();
    });
  };

  normalizeGun = () => {
    const gun = this.scene.getObjectByName('gun');
    if (gun) {
      const cameraPosition = this.camera.position.clone();
      const cameraRotation = this.camera.rotation.clone();
      gun.position.set(cameraPosition.x, cameraPosition.y - 40, cameraPosition.z);
      gun.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);
    }
  };

  onWindowResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    this.camera.updateProjectionMatrix();
  };

  onClick = event => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.checkIntersects(this.scene.children);
  };

  checkIntersects = children => {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    children.forEach(child => {
      if (child instanceof THREE.Group) {
        this.checkIntersects(child.children);
      }
    });
    const intersects = this.raycaster.intersectObjects(children);
    if (intersects.length) {
      intersects.forEach(({ object }) => {
        if (object.parent.name === 'deer') this.killDeer();
      });
    }
  };

  killDeer = () => {
    const deer = this.scene.getObjectByName('deer');
    this.animations[0].stop();
    const action1 = deer.mixer.clipAction(deer.animations[1]);
    action1.setLoop(THREE.LoopOnce);
    action1.clampWhenFinished = true;
    this.animations.push(action1);
    action1.play();
  };

  animate = () => {
    let clock = this.clock.getDelta();
    const deer = this.scene.getObjectByName('deer');
    if (deer) {
      deer.mixer.update(clock);
    }
    requestAnimationFrame(this.animate);
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  };
}

const app = new App();
app.initScene();
