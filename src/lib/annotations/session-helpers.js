import TimelineSelector from './selectors/timeline'
import parseSelector from '../parse-selector'

class SessionHelpers {
  static annotationToSessionTime (seconds, annotation, session) {
    const offset = TimelineSelector.timeBetween(
      parseSelector(annotation.target.selector.value).start,
      session.start
    ).as('seconds')
    return offset + seconds
  }

  static sessionToAnnotationTime (seconds, annotation, session) {
    const offset = TimelineSelector.timeBetween(
      parseSelector(annotation.target.selector.value).start,
      session.start
    ).as('seconds')
    return seconds - offset
  }
}

export default SessionHelpers
