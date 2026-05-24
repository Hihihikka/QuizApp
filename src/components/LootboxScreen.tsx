import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { Spine } from 'pixi-spine'

interface Props {
  chestType: 'bronze' | 'silver' | 'gold'
  onComplete: () => void
}

export default function LootboxScreen({ chestType, onComplete }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const app = new PIXI.Application({
      width: 600,
      height: 500,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    canvasRef.current.appendChild(app.view as HTMLCanvasElement)

    PIXI.Loader.shared
      .add('lootbox', '/LootBox.json')
      .load((_loader, resources) => {
        if (!resources.lootbox?.spineData) return

        const spine = new Spine(resources.lootbox.spineData)
        spine.x = app.screen.width / 2
        spine.y = app.screen.height / 1.3
        spine.scale.set(0.5)

        const animationMap = {
          bronze: '1-Bronze',
          silver: '2-Silver',
          gold: '3-Gold',
        }

        app.stage.addChild(spine)
        spine.state.setAnimation(0, animationMap[chestType], false)
        spine.state.addListener({
          complete: () => {
            setTimeout(onComplete, 800)
          },
        })
      })

    return () => {
      PIXI.Loader.shared.reset()
      app.destroy(true)
    }
  }, [chestType])

  return (
    <div className="lootbox-screen">
      <h2 className="lootbox-screen__title">
        {chestType === 'bronze' && '🥉 Bronze Chest'}
        {chestType === 'silver' && '🥈 Silver Chest'}
        {chestType === 'gold' && '🥇 Gold Chest'}
      </h2>
      <div ref={canvasRef} className="lootbox-screen__canvas" />
      <p className="lootbox-screen__hint">Watch the chest open...</p>
    </div>
  )
}