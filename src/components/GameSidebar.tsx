import React from 'react'
import { useGameStore } from '../features/gameplay/useGameStore'
import s from './GameSidebar.module.css'

const CHEST_SPRITES = {
  bronze: {
    closed: { x: 537, y: 6, w: 199, h: 280 },
    open:   { x: 627, y: 289, w: 313, h: 341 },
  },
  silver: {
    closed: { x: 336, y: 6, w: 199, h: 280 },
    open:   { x: 313, y: 289, w: 313, h: 341 },
  },
  gold: {
    closed: { x: 738, y: 7, w: 174, h: 280 },
    open:   { x: 0, y: 289, w: 313, h: 341 },
  },
}

function ChestIcon({ type, isOpen }: { type: 'bronze' | 'silver' | 'gold'; isOpen: boolean }) {
  const sprite = CHEST_SPRITES[type][isOpen ? 'open' : 'closed']
  const scale = 0.2
  const atlasW = 1938
  const atlasH = 632

  const style: React.CSSProperties = {
    width: sprite.w * scale,
    height: sprite.h * scale,
    backgroundImage: 'url(/LootBox.png)',
    backgroundSize: `${atlasW * scale}px ${atlasH * scale}px`,
    backgroundPosition: `-${sprite.x * scale}px -${sprite.y * scale}px`,
    display: 'inline-block',
    flexShrink: 0,
  }

  return <div style={style} />
}

export default function GameSidebar() {
  const score = useGameStore(s => s.score)
  const chestPoints = useGameStore(s => s.chestPoints)
  const chestsOpenedToday = useGameStore(s => s.chestsOpenedToday)

  const pointsInCurrentChest = chestPoints % 1000

  return (
    <aside className={s.sidebar}>
      <div className={s.card}>
        <span className={s.label}>SCORE</span>
        <span className={s.value}>✦ {score}</span>
      </div>

      <div className={s.card}>
        <span className={s.label}>UNTIL THE NEXT LOOTBOX</span>
        <span className={s.value}>{pointsInCurrentChest} / 1000</span>
        <div className={s.progressBar}>
          <div
            className={s.progressFill}
            style={{ width: `${pointsInCurrentChest / 10}%` }}
          />
        </div>
      </div>

      <div className={s.card}>
        <span className={s.label}>OPENED LOOTBOXES</span>
        <span className={s.value}>{chestsOpenedToday} / 3</span>
        <div className={s.chests}>
          <ChestIcon type="bronze" isOpen={chestsOpenedToday >= 1} />
          <ChestIcon type="silver" isOpen={chestsOpenedToday >= 2} />
          <ChestIcon type="gold"   isOpen={chestsOpenedToday >= 3} />
        </div>
      </div>

      <div className={s.card}>
        <span className={s.label}>ACTIVE LUCK MULTIPLIER</span>
        <span className={s.valueGreen}>🍀 1.25x</span>
        <p className={s.desc}>
          Impact on probability of getting stronger cards in poker
        </p>
      </div>
    </aside>
  )
}