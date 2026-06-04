import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { Spine } from 'pixi-spine'
import s from './LootboxScreen.module.css'

interface Props {
  chestType: 'bronze' | 'silver' | 'gold'
  onComplete: () => void
}

export default function LootboxScreen({ chestType, onComplete }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    let mounted = true
    let app: PIXI.Application | null = null
    const loader = new PIXI.Loader()

    const frameId = requestAnimationFrame(() => {
      if (!mounted || !container) return

      const width = container.offsetWidth || 600
      const height = container.offsetHeight || 400

      app = new PIXI.Application({
        width,
        height,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })

      container.appendChild(app.view as HTMLCanvasElement)

      const animationMap = {
        bronze: '1-Bronze',
        silver: '2-Silver',
        gold: '3-Gold',
      }

      loader.add('lootbox', '/LootBox.json').load((_loader, resources) => {
        if (!mounted || !app) return
        if (!resources.lootbox?.spineData) return

        const spine = new Spine(resources.lootbox.spineData)
        const scale = Math.min(width / 600, height / 500)
        spine.x = width / 10
        spine.y = height / 10
        spine.scale.set(scale)

        app.stage.addChild(spine)
        spine.state.setAnimation(0, animationMap[chestType], false)
        spine.state.addListener({
          complete: () => {
            if (mounted) setTimeout(onComplete, 800)
          },
        })
      })
    })

    return () => {
      mounted = false
      cancelAnimationFrame(frameId)
      loader.reset()
      app?.destroy(true, { children: true })
    }
  }, [chestType, onComplete])

  return (
    <div className={s.screen}>
      <h2 className={s.title}>
        {chestType === 'bronze' && '🥉 Bronze Chest'}
        {chestType === 'silver' && '🥈 Silver Chest'}
        {chestType === 'gold' && '🥇 Gold Chest'}
      </h2>
      <div ref={canvasRef} className={s.canvas} />
      <p className={s.hint}>Watch the chest open...</p>
    </div>
  )
}