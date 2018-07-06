import TimelineSelector from './selectors/timeline'

class SessionHelpers {
  static annotationToSessionTime (seconds, annotation, session) {
    const offset = TimelineSelector.timeBetween(
      TimelineSelector.fromDateTime(annotation.target.selector.value),
      session.start
    ).as('seconds')
    return offset + seconds
  }

  static sessionToAnnotationTime (seconds, annotation, session) {
    const offset = TimelineSelector.timeBetween(
      TimelineSelector.fromDateTime(annotation.target.selector.value),
      session.start
    ).as('seconds')
    return seconds - offset
  }
}

export default SessionHelpers
