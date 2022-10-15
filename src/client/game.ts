import {
  AmbientLight,
  BoxGeometry,
  Camera,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'

import WebGL from './helper/webgl'

class Game {
  private scene: Scene = new Scene()
  private camera: Camera
  private renderer: WebGLRenderer = new WebGLRenderer()
  private cube: Mesh
  private container: HTMLDivElement

  constructor() {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)

    this.container = document.createElement('div')
    this.container.style.height = '100%'
    document.body.appendChild(this.container)

    const geometry = new BoxGeometry(1, 1, 1)

    const light = new DirectionalLight(0xffffff)
    light.position.set(0, 20, 10)

    const ambient = new AmbientLight(0x707070)

    const material = new MeshPhongMaterial({ color: 0x00aaff })

    this.cube = new Mesh(geometry, material)

    this.scene.add(this.cube)
    this.scene.add(light)
    this.scene.add(ambient)

    this.camera.position.z = 3

    if (WebGL.isWebGLAvailable()) {
      this.animate()
    } else {
      const warning = WebGL.getWebGLErrorMessage()
      this.container.appendChild(warning)
    }
    this.animate()
  }

  private animate() {
    requestAnimationFrame(() => {
      this.animate()
    })

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.renderer.render(this.scene, this.camera)
  }
}

export default Game
