import { phase as phaseEnum } from '../enums/phase'
import useGame from '../stores/useGame'

const Interface = () => {
    const phase = useGame((state) => state.phase)
    const start = useGame((state) => state.start)
    const restart = useGame((state) => state.restart)

    return (
        <div className="interface">
            {phase === phaseEnum.ready && (
                <>
                    <div className="info" onClick={ start }>
                        <p className="title">Start!</p>
                    </div>
                </>
            )}

            {phase === phaseEnum.ended && (
                <>
                    <div className="info" onClick={ restart }>
                        <p className="title">Oops!</p>
                        <p className="subtitle">Click to restart</p>
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
