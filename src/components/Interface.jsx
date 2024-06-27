import { phase as phaseEnum } from '../enums/phase'
import useStore from '../stores/useStore'

const Interface = () => {
    const phase = useStore((state) => state.phase)
    const start = useStore((state) => state.start)
    const restart = useStore((state) => state.restart)

    return (
        <div className="interface">
            {phase === phaseEnum.READY && (
                <>
                    <div className="info" onClick={ start }>
                        <p className="title">Click to Start!</p>
                    </div>
                </>
            )}

            {phase === phaseEnum.ENDED && (
                <>
                    <div className="info" onClick={ restart }>
                        <p className="title">Oops!!</p>
                        <p className="subtitle">Click to restart!</p>
                    </div>
                </>
            )}

            {phase === phaseEnum.PAUSE && (
                <>
                    <div className="info">
                        <p className="title">PAUSE</p>
                    </div>
                </>
            )}

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
                        <div className={'action'}>Pause / Resume</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interface
