import { useDispatch, useSelector } from 'react-redux'
import { setPlaying as _setPlaying, stopPlaying as _stopPlaying } from 'providers/redux/reducers/audio'
function useAudio() {
  const dispatch = useDispatch()
  return {
    lastPlayed: useSelector((state) => state.audio.lastPlayed),
    setLastPlayed: (src) => {
      dispatch(_setPlaying(src))
    },
    clearLastPlayed: () => {
      dispatch(_stopPlaying())
    },
  }
}
export default useAudio
