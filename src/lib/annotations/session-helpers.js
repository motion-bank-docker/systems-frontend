class SessionHelpers {
  static annotationToSessionTime (seconds, annotation, session) {
    const offset = (session.start - annotation.target.selector._valueMillis) * 0.001
    return offset + seconds
  }
  static sessionToAnnotationTime (seconds, annotation, session) {
    const offset = (session.start - annotation.target.selector._valueMillis) * 0.001
    return seconds - offset
  }
}

export default SessionHelpers
