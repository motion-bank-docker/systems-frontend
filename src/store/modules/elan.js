import { js2xml } from 'xml-js'
import { ObjectUtil } from 'mbjs-utils'
import parseURI from 'mbjs-data-models/src/lib/parse-uri'
import { DateTime, Interval } from 'luxon'
import eafTemplate from '../../lib/eaf-template'

const elan = {
  namespaced: true,
  state: {},
  actions: {
    generateEAF (context, { annotations, map, media, metadata }) {
      const mediaDateTime = DateTime.fromMillis(media.target.selector._valueMillis)
      let TIME_SLOT = []
      const ANNOTATION = annotations.map((annotation, i) => {
        const
          annoStart = DateTime.fromMillis(annotation.target.selector._valueMillis),
          annoEnd = annoStart.plus(annotation.target.selector._valueDuration || 1),
          TIME_SLOT_REF1 = `ts${((i + 1) * 2) - 1}`,
          TIME_SLOT_REF2 = `ts${(i + 1) * 2}`

        TIME_SLOT = TIME_SLOT.concat([
          {
            _attributes: {
              TIME_SLOT_ID: TIME_SLOT_REF1,
              TIME_VALUE: Interval.fromDateTimes(mediaDateTime, annoStart)
                .toDuration()
                .as('milliseconds')
            }
          },
          {
            _attributes: {
              TIME_SLOT_ID: TIME_SLOT_REF2,
              TIME_VALUE: Interval.fromDateTimes(mediaDateTime, annoEnd)
                .toDuration()
                .as('milliseconds')
            }
          }
        ])

        return {
          ALIGNABLE_ANNOTATION: {
            _attributes: {
              ANNOTATION_ID: `a${i + 1}`,
              TIME_SLOT_REF1,
              TIME_SLOT_REF2
            },
            ANNOTATION_VALUE: {
              _text: annotation.body.value
            }
          }
        }
      })
      const doc = ObjectUtil.merge({}, eafTemplate, {
        ANNOTATION_DOCUMENT: {
          _attributes: { AUTHOR: map.creator.name },
          TIER: {
            _attributes: {
              TIER_ID: metadata.title || media.body.source.id
            },
            ANNOTATION
          },
          TIME_ORDER: {
            TIME_SLOT
          },
          HEADER: {
            MEDIA_DESCRIPTOR: {
              _attributes: {
                MEDIA_URL: media.body.source.id,
                MIME_TYPE: media.body.source.type
              }
            },
            PROPERTY: [
              {
                _attributes: { name: 'URN' },
                _text: `urn:nl-mpi-tools-elan-eaf:${parseURI(media.id).uuid}`
              },
              {
                _attributes: { name: 'lastUsedAnnotationId' },
                _text: `${ANNOTATION.length}`
              }
            ]
          }
        }
      })
      return js2xml(doc, {
        compact: true,
        spaces: '\t'
      })
    }
  }
}

export default elan
