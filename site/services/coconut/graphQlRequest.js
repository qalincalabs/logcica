//Launch request with the choosen query
function request(query) {
  const axios = require("axios");

  const endpoint = process.env.LogcicaApiUrl;

  const headers = {
    "content-type": "application/json",
    apiKey: process.env.LogcicaApiKey,
  };

  try {
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query),
    };

    return axios.post(endpoint, JSON.stringify(query), {
      headers: headers,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  //Create a new tour with user data
  addTour: function addTour(tourData) {
    var query = {};
    if (tourData.tourVehicle != null) {
      query = {
        query: `
        mutation insertOneTour($data: TourInsertInput!) {
          insertOneTour(data: $data) {  
            name
            date
            vehicle{
              _id
            }
            owner{
              workspace{
                _id
                }
              }
            }
          }`,
        variables: {
          data: {
            createdAt: new Date(),
            name: tourData.tourName,
            date: tourData.tourDate,
            vehicle: {
              link: tourData.tourVehicle.value,
            },
            owner: {
              workspace: {
                link: tourData.channelId,
              },
            },
          },
        },
      };
    } else {
      query = {
        query: `
        mutation insertOneTour($data: TourInsertInput!) {
          insertOneTour(data: $data) {  
            name
            date
            owner{
              workspace{
                _id
              }
            }
          }
        }`,
        variables: {
          data: {
            name: tourData.tourName,
            date: tourData.tourDate,
            owner: {
              workspace: {
                link: tourData.channelId,
              },
            },
          },
        },
      };
    }
    return request(query);
  },

  //Get every tours
  fetchTour: function fetchTour() {
    const query = {
      query: `
      query {
        tours{
          name
          date
          _id
        }
      }`,
      variables: {},
    };
    return request(query);
  },

  //Get every tours
  fetchLatestToursForChannel: function fetchLatestToursForChannel(channelId) {
    const query = {
      query: `{
        tours(
          query: {owner: { workspace: { coconut: { slackChannel: { id: "${channelId}"} } } }},
          sortBy: DATE_DESC
        ) {
          name
          date
          _id,
          owner {
            workspace {
              _id
              key
              name
              person
              type
            }
          }
        }
      }`,
      variables: {},
    };
    return request(query);
  },

  //Get every workspace's vehicles
  fetchVehicles: function fetchVehicles(workspaceId) {
    const query = {
      query: ` 
        query {
          vehicles(query:{owner:{workspace:{_id:"${workspaceId}"}}}){
            _id
              name
              brand{
                name
              }
              model{
                name
              }
              capacity{
                volume{
                  unit{
                    symbol
                  }
                  value
                }
                weight{
                  unit{
                    symbol
                  }
                  value
                }
              }
            }
          }`,
      variables: {},
    };
    return request(query);
  },

  //Get tour informations with its Id
  getTourData: function getTourData(id) {
    const query = {
      query: `
      query{tours(query: { _id_in: "${id}" })
        {
        distance{
          unit{
            symbol
          }
          value
        }
        duration{
          unit{
            symbol
          }
          value
        }
        name
        date
        vehicle{
          name
          brand{
            name
          }
          model{
            name
          }
        }
        stops{
          name
          geo{
            coordinates
          }
          order
          estimatedTimeOfArrival
          estimatedTimeOfDeparture
          duration{
            unit{
              symbol
            }
            value
          }
          place
          delivery{
            shipments
          }
          pickup{
            shipments
          }
        }
        shipments{
          _id
          key
          order{
            number
          }
          delivery{
            place{
              address{
                postalCode
                street
                locality
                country
              }
              gln
            }
          }
        }
      }
    }
    `,
      variables: {},
    };
    return request(query);
  },

  //Get tour draft status
  getTourDraftStatus: function getTourDraftStatus(tourDraftId) {
    const query = {
      query: `query{
        tourDraft(query :{_id :"${tourDraftId}"}){
          validation{
            status
          }
        }
      }`,
      variables: {},
    };
    return request(query);
  },

  //Get tour id by name
  findWorkspaceId: function findWorkspaceId(channelName) {
    console.log(channelName);
    const query = {
      query: `query{workspace(query : { key : "${channelName}"}){
        _id
        }
      }`,
      variables: {},
    };
    return request(query);
  },

  //Create a new tour draft
  insertOneTourDraft: async function insertOneTourDraft(tourId, shipmentId) {
    const getTourData = require("./graphQlRequest.js");
    const { data } = await getTourData.getTourData(`${tourId}`);
    const shipmentsList = data.data.tours[0].shipments.map((e) => e._id);
    shipmentsList.push(shipmentId);

    var query = {
      query: `mutation insertOneTourDraft($data: TourDraftInsertInput!) {
        insertOneTourDraft(data: $data){
          _id
        }
      }`,
      variables: {
        data: {
          tour: { link: tourId },
          shipments: { link: shipmentsList },
        },
      },
    };
    return request(query);
  },

  //Set stop's shipments status
  setStopStatus: async function setStopStatus(tourId, stopOrder) {
    const getTourData = require("./graphQlRequest.js");
    const { data } = await getTourData.getTourData(`${tourId}`);

    const stopData = data.data.tours[0].stops[stopOrder];

    const pickup = stopData?.pickup?.shipments ?? "";
    const delivery = stopData?.delivery?.shipments ?? "";

    /*var query = query qui met les shipments qui ont été pickup dans l'état "pickup"
    request(query);
    
    var query = query qui met les shipments qui ont été delivery dans l'état "delivery"
    request(query);*/
  },
};
