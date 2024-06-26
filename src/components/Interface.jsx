import { useEffect } from 'react'
import { addEffect } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import useGame from '../stores/useGame'

const Interface = () => {
    const phase = useGame((state) => state.phase)

    return (
        <div className="interface">
            <div className="controls">
                <div className="row">
                    <div className={'button'}>
                        <div className={'key'}>W</div>
                        <div className={'action'}>Up</div>
                    </div>
                </div>
                <div className="row">
                <div className={'button'}>
                        <div className={'key'}>A</div>
                        <div className={'action'}>Left</div>
                    </div>
                    <div className={'button'}>
                        <div className={'key'}>S</div>
                        <div className={'action'}>Down</div>
                    </div>
                    <div className={'button'}>
                        <div className={'key'}>D</div>
                        <div className={'action'}>Right</div>
                    </div>
                </div>
                <div className="row">
                    <div className={'button large'}>
                        <div className={'key'}>Spacebar</div>
                        <div className={'action'}>{phase === 'playing' ? 'Pause' : 'Resume'}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interface
