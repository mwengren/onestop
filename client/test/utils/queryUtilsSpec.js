import '../specHelper'
import * as queryUtils from '../../src/utils/queryUtils'

describe('The queryUtils', function () {

  describe('assembles collection requests', function () {
    collectionTestCases().forEach(function (testCase) {
      it(`with ${testCase.name}`, function () {
        const objectResult = queryUtils.assembleSearchRequest(testCase.inputState)
        const stringResult = queryUtils.assembleSearchRequestString(testCase.inputState)
        objectResult.should.deep.equal(testCase.expectedResult)
        stringResult.should.equal(JSON.stringify(testCase.expectedResult))
      })
    })
  })

  describe('assembles granule requests', function () {
    granuleTestCases().forEach(function (testCase) {
      it(`with ${testCase.name}`, function () {
        const objectResult = queryUtils.assembleSearchRequest(testCase.inputState, true)
        const stringResult = queryUtils.assembleSearchRequestString(testCase.inputState, true)
        objectResult.should.deep.equal(testCase.expectedResult)
        stringResult.should.equal(JSON.stringify(testCase.expectedResult))
      })
    })
  })

})

function collectionTestCases() {
  return [
    {
      name: "defaults",
      inputState: {},
      expectedResult: {
        queries: [],
        filters: [],
        facets: true
      }
    },
    {
      name: "a text search",
      inputState: {
        searchAndFacets: {
          search: {
            queryText: {
              text: "test text"
            }
          }
        }
      },
      expectedResult: {
        queries: [
          {
            type: "queryText", value: "test text"
          }
        ],
        filters: [],
        facets: true
      }
    },
    {
      name: "a temporal search",
      inputState: {
        searchAndFacets: {
          search: {
            temporal: {
              startDateTime: "2017-01-01",
              endDateTime: "2017-01-20"
            }
          }
        }
      },
      expectedResult: {
        queries: [],
        filters: [
          {
            type: "datetime",
            after: "2017-01-01",
            before: "2017-01-20"
          }
        ],
        facets: true
      }
    },
    {
      name: "a spatial search",
      inputState: {
        searchAndFacets: {
          search: {
            geometry: {
              geoJSON: {
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]
                },
                properties: {
                  description: 'Valid test GeoJSON'
                }
              }
            }
          }
        }
      },
      expectedResult: {
        queries: [],
        filters: [
          {
            type: "geometry",
            geometry: {
              type: 'Polygon',
              coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]
            }
          }
        ],
        facets: true
      }
    },
    {
      name: "a facet search",
      inputState: {
        searchAndFacets: {
          facets: {
            selectedFacets: {
              science: ["Atmosphere"]
            }
          }
        }
      },
      expectedResult: {
        queries: [],
        filters: [
          {
            type: "facet",
            name: "science",
            values: ["Atmosphere"]
          }
        ],
        facets: true
      }
    },
    {
      name: "all filters applied",
      inputState: {
        searchAndFacets: {
          search: {
            geometry: {
              geoJSON: {
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]
                },
                properties: {
                  description: 'Valid test GeoJSON'
                }
              }
            },
            temporal: {
              startDateTime: "2017-01-01",
              endDateTime: "2017-01-20"
            },
            queryText: {
              text: "test text"
            }
          },
          facets: {
            selectedFacets: {
              science: ["Atmosphere"]
            }
          }
        }
      },
      expectedResult: {
        queries: [
          {
            type: "queryText", value: "test text"
          }
        ],
        filters: [
          {
            type: "facet",
            name: "science",
            values: ["Atmosphere"]
          },
          {
            type: "geometry",
            geometry: {
              type: 'Polygon',
              coordinates: [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]
            }
          },
          {
            type: "datetime",
            after: "2017-01-01",
            before: "2017-01-20"
          }
        ],
        facets: true
      }
    }
  ]
}

function granuleTestCases() {
  return [
    {
      name: "one collection",
      inputState: {
        appState: {
          collectionSelect: {
            selectedIds: ['ABC123']
          }
        }
      },
      expectedResult: {
        queries: [],
        filters: [
          {
            "type": "collection",
            "values": ["ABC123"]
          }
        ],
        facets: false
      }
    },
    {
      name: "two collections",
      inputState: {
        appState: {
          collectionSelect: {
            selectedIds: ['ABC123', 'XYZ789']
          }
        }
      },
      expectedResult: {
        queries: [],
        filters: [
          {
            "type": "collection",
            "values": ["ABC123", 'XYZ789']
          }
        ],
        facets: false
      }
    },
    {
      name: "two collections and a text query",
      inputState: {
        appState: {
          collectionSelect: {
            selectedIds: ['ABC123', 'XYZ789']
          }
        },
        searchAndFacets: {
          search: {
            queryText: {
              text: 'test'
            },
          }
        }
      },
      expectedResult: {
        queries: [
          {
            type: 'queryText',
            value: 'test'
          }
        ],
        filters: [
          {
            "type": "collection",
            "values": ["ABC123", 'XYZ789']
          }
        ],
        facets: false
      }
    }
  ]
}
