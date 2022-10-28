import {
  AmbientLight,
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  Fog,
  GridHelper,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { CharacterControls } from './characterControls'

import WebGL from './helper/webgl'

class Game {
  private scene = new Scene()
  private renderer = new WebGLRenderer({ antialias: true })
  private clock = new Clock()
  private camera: PerspectiveCamera
  private container: HTMLDivElement
  private controls: OrbitControls
  private assetsModelPath = '../assets/model'
  private keyPressed: Record<string, boolean> = {}
  private characterControls?: CharacterControls

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
    this.initModel()
    this.initLight()
    this.initRound()
    this.initOrbitController()

    if (WebGL.isWebGLAvailable()) {
      this.animate()
    } else {
      const warning = WebGL.getWebGLErrorMessage()
      this.container.appendChild(warning)
    }
  }

  private init() {
    this.camera.position.set(0, 5, 5)
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 100, 1500)

    window.addEventListener('resize', () => this.onWindowResize(), false)

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.shiftKey && this.characterControls) {
          this.characterControls.switchRunToggle()
          //Toggle
        } else {
          this.keyPressed[event.key.toLowerCase()] = true
        }
      },
      false
    )

    document.addEventListener(
      'keyup',
      (event) => {
        this.keyPressed[event.key.toLowerCase()] = false
      },
      false
    )
  }

  private initOrbitController() {
    this.controls.enableDamping = true
    this.controls.minDistance = 5
    this.controls.maxDistance = 15
    this.controls.enablePan = false
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05
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
    new GLTFLoader().load(
      `${this.assetsModelPath}/soldier/Soldier.glb`,
      (gltf) => {
        const model = gltf.scene
        model.traverse((object: any) => {
          if (object.isMesh) object.castShadow = true
        })
        this.scene.add(model)

        const gltfAnimations: AnimationClip[] = gltf.animations
        const mixer = new AnimationMixer(model)
        const animationsMap: Map<string, AnimationAction> = new Map()
        gltfAnimations
          .filter((a) => a.name != 'TPose')
          .forEach((a: AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
          })

        console.log(animationsMap)
        this.characterControls = new CharacterControls(
          model,
          mixer,
          animationsMap,
          this.controls,
          this.camera,
          'Idle'
        )
      }
    )
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate() {
    const dt = this.clock.getDelta()

    if (this.characterControls) {
      this.characterControls.update(dt, this.keyPressed)
    }

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(() => {
      this.animate()
    })
  }
}

export default Game
