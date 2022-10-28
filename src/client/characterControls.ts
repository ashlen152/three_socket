import { AnimationAction, AnimationMixer, Camera, Group } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class CharacterControls {
  private model: Group
  private mixer: AnimationMixer
  private animationsMap: Map<string, AnimationAction>
  private orbitControl: OrbitControls
  private toggleRun
  private currentAction: string
  private camera: Camera

  constructor(
    model: Group,
    mixer: AnimationMixer,
    animationsMap: Map<string, AnimationAction>,
    orbitControl: OrbitControls,
    camera: Camera,
    currentAction: string
  ) {
    this.model = model
    this.mixer = mixer
    this.animationsMap = animationsMap
    this.toggleRun = false
    this.orbitControl = orbitControl
    this.camera = camera
    this.currentAction = currentAction

    this.animationsMap.forEach((value, key) => {
      console.log(value, key)
      if (key === currentAction) {
        value.play()
      }
    })
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  public update(delta: number, keysPressed: Record<string, boolean>) {
    this.mixer.update(delta)
  }
}
