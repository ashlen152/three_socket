import {
  AmbientLight,
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  Fog,
  GridHelper,
  HemisphereLight,
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  TextureLoader,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import WebGL from './helper/webgl'

class Game {
  private scene = new Scene()
  private renderer = new WebGLRenderer({ antialias: true })
  private clock = new Clock()
  private camera: PerspectiveCamera
  private container: HTMLDivElement
  private controls: OrbitControls
  private assetsFBXPath = '../assets/fbx'
  private assetsImagePath = '../assets/images'
  private player: AnimationMixer | null = null
  private manager = new LoadingManager()

  constructor() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.container = document.createElement('div')
    this.container.style.height = '100%'
    this.container.appendChild(this.renderer.domElement)
    document.body.appendChild(this.container)

    this.init()
    this.initOrbitController()
    this.initLight()
    this.initRound()
    this.initModel()

    window.addEventListener('resize', () => this.onWindowResize(), false)

    if (WebGL.isWebGLAvailable()) {
      this.animate()
    } else {
      const warning = WebGL.getWebGLErrorMessage()
      this.container.appendChild(warning)
    }
  }

  private init() {
    this.camera.position.set(112, 100, 400)
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 100, 1500)
  }

  private initOrbitController() {
    this.controls.target.set(0, 150, 0)
    this.controls.update()
  }

  private initLight() {
    const hemisLight = new HemisphereLight(0xffffff, 0x444444)
    hemisLight.position.set(0, 200, 0)
    this.scene.add(hemisLight)

    const dLight = new DirectionalLight(0xffffff)
    dLight.position.set(0, 200, 100)
    dLight.castShadow = true
    dLight.shadow.camera.top = 180
    dLight.shadow.camera.bottom = -100
    dLight.shadow.camera.left = -120
    dLight.shadow.camera.right = 120

    this.scene.add(dLight)

    const ambient = new AmbientLight(0x707070)

    this.scene.add(ambient)
  }

  private initRound() {
    const mesh = new Mesh(
      new PlaneGeometry(2000, 2000),
      new MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    )

    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    this.scene.add(mesh)

    const grid = new GridHelper(2000, 40, 0x0000000, 0x0000000)
    this.scene.add(grid)
  }

  private initModel() {
    const loader = new FBXLoader(this.manager)
    loader.load(`${this.assetsFBXPath}/people/FireFighter.fbx`, (object) => {
      const mixer = new AnimationMixer(object)
      mixer.clipAction(object.animations[0]).play()
      this.player = mixer

      object.name = 'FireFighter'
      object.traverse((child) => {
        if (child.isObject3D) {
          child.castShadow = true
          child.receiveShadow = false
        }
      })

      this.scene.add(object)
    })
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate() {
    const dt = this.clock.getDelta()

    if (this.player) this.player.update(dt)

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(() => {
      this.animate()
    })
  }
}

export default Game
