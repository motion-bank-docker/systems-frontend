const eafTemplate = {
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: 'UTF-8'
    }
  },
  ANNOTATION_DOCUMENT: {
    _attributes: {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:noNamespaceSchemaLocation': 'http://www.mpi.nl/tools/elan/EAFv3.0.xsd',
      FORMAT: '3.0',
      VERSION: '3.0'
    },
    LINGUISTIC_TYPE: {
      _attributes: {
        GRAPHIC_REFERENCES: 'false',
        LINGUISTIC_TYPE_ID: 'piecemaker-lt',
        TIME_ALIGNABLE: 'true'
      }
    },
    CONSTRAINT: [
      {
        _attributes: {
          DESCRIPTION: 'Time subdivision of parent annotation\'s time interval, no time gaps allowed within this interval',
          STEREOTYPE: 'Time_Subdivision'
        }
      },
      {
        _attributes: {
          DESCRIPTION: 'Symbolic subdivision of a parent annotation. Annotations refering to the same parent are ordered',
          STEREOTYPE: 'Symbolic_Subdivision'
        }
      },
      {
        _attributes: {
          DESCRIPTION: '1-1 association with a parent annotation',
          STEREOTYPE: 'Symbolic_Association'
        }
      },
      {
        _attributes: {
          DESCRIPTION: 'Time alignable annotations within the parent annotation\'s time interval, gaps are allowed',
          STEREOTYPE: 'Included_In'
        }
      }
    ],
    HEADER: {
      _attributes: {
        TIME_UNITS: 'milliseconds'
      }
    },
    TIER: {
      _attributes: {
        LINGUISTIC_TYPE_REF: 'piecemaker-lt'
      }
    },
    TIME_ORDER: {
      TIME_SLOT: []
    }
  }
}

export default eafTemplate
