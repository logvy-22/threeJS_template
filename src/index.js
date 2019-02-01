import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

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
    this.scene.add(this.camera);

    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();

    this.camera.position.set(50, 50, 50);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.AxesHelper(50));
    this.scene.add(new THREE.GridHelper(200, 10));

    this.onWindowResize();
    this.createRobot();

    this.animate();
  };

  createRobot = () => {
    const group = new THREE.Group();
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0x505050 });
    const jointMaterial = new THREE.MeshLambertMaterial({ color: 0x5d8c96 });

    const group1 = new THREE.Group();
    group1.name = 'group1';

    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 10), armMaterial);
    arm1.position.set(-20, 0, 0);
    arm1.name = 'arm1';

    group1.add(arm1);
    group.add(group1);

    const group2 = new THREE.Group();
    group2.name = 'group2';

    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 10), armMaterial);
    arm2.position.set(-20, 0, 0);
    arm2.name = 'arm2';

    group2.position.set(0, 0, 0);
    group2.rotation.z = (-50 * Math.PI) / 180;
    group2.add(arm2);
    group1.add(group2);

    const box = new THREE.Mesh(new THREE.BoxGeometry(0, 100, 100), armMaterial);

    const joint = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 11, 24), jointMaterial);
    joint.rotation.set(0, (90 * Math.PI) / 180, (90 * Math.PI) / 180);
    joint.name = 'joint';
    this.scene.add(joint);

    group.name = 'robot';
    this.scene.add(group);
  };

  moveArm = angle => {
    let currentAngle = this.scene.getObjectByName('group2').rotation.z;
    if (
      Math.abs((currentAngle * 180) / Math.PI) + angle >= 50 &&
      Math.abs((currentAngle * 180) / Math.PI) + angle <= 300
    )
      this.scene.getObjectByName('group2').rotation.z += (-angle * Math.PI) / 180;
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
  if (e.keyCode === 39 || e.keyCode === 37) app.orbitControls.enabled = true;
});

window.addEventListener('keydown', e => {
  if (e.keyCode === 39) {
    app.orbitControls.enabled = false;
    app.moveArm(1);
  } else if (e.keyCode === 37) {
    app.orbitControls.enabled = false;
    app.moveArm(-1);
  } else app.orbitControls.enabled = true;
});
