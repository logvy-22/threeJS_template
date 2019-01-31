import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.renderer.domElement.width / this.renderer.domElement.height,
      0.001,
      1000,
    );
    this.orbitControls = new OrbitControls(this.camera);
  }

  initScene = () => {
    this.renderer.setClearColor(0xcccccc);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff);
    const lightPoint = new THREE.PointLight(0xffffff, 0.5);
    lightPoint.position.set(0, 200, 350);
    this.scene.add(light, lightPoint);
    this.camera.add(new THREE.PointLight(0xffffff, 0.5));

    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();

    this.camera.position.set(50, 50, 50);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.AxesHelper(50));
    this.scene.add(new THREE.GridHelper(200, 10));

    this.onWindowResize();

    this.robotLoaded = false;

    this.loadRobot();
    this.animate();
  };

  loadRobot = () => {
    const objLoader = new THREE.OBJLoader();
    const material = new THREE.MeshLambertMaterial({ color: 0x8ea6b7 });
    objLoader.load(
      '../OBJ_Robot.obj',
      robot => {
        robot.name = 'robot';
        robot.traverse(child => {
          if (child.isMesh) child.material = material;
        });
        this.scene.add(robot);
        this.robotLoaded = true;
      },
      req => console.log((req.loaded / req.total) * 100 + '% loaded'),
    );
  };

  moveArm = direction => {
    if (this.robotLoaded) {
      const arm = this.scene.getObjectByName('robot', true).children[2];
      switch (direction) {
        case 'up':
          arm.position.y += 1;
          break;
        case 'down':
          arm.position.y -= 1;
          break;
      }
    }
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

window.addEventListener('keyup', e => {
  if (e.keyCode === 38 || e.keyCode === 40) app.orbitControls.enabled = true;
});

window.addEventListener('keydown', e => {
  if (e.keyCode === 38) {
    app.orbitControls.enabled = false;
    app.moveArm('up');
  } else if (e.keyCode === 40) {
    app.orbitControls.enabled = false;
    app.moveArm('down');
  } else app.orbitControls.enabled = true;
});
