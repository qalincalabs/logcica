// Vue permettant de selectionner un tour pour y mettre un shipment
const graphQlRequest = require("../graphQlRequest.js");

async function getView(id, messageData,channelId) {
  const { data } = await graphQlRequest.fetchLatestToursForChannel(channelId);
  
  const tourList = data.data.tours.map((e, i) => ({ id : e._id, text: e.name, value: i }));

  const optionSelect = tourList
    .map((t) => `
    {
      "text": {
          "type": "plain_text",
          "text": "${t.text}",
          "emoji": true
      },
      "value": "${t.id}",
    }
    `
    )
    .join(",");
 


  return `{
    type: "modal",
    callback_id: "selectedTourPayback",
    title: {
      type: "plain_text",
      text: "Coconut app",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Sélectionner",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Annuler",
      emoji: true,
    },
    
    private_metadata: "${messageData.token},${messageData.ts},${messageData.channel}",
  
    blocks: [
        {
            "type": "input",
            "block_id": "${id}",
            "element": {
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Choisissez une tournée",
                    "emoji": true
                },
                "options": [${optionSelect}
                ],
                "action_id": "static_select-action"
            },
            "label": {
                "type": "plain_text",
                "text": ":rocket: Ajouter la livraison ${id} à une tournée",
                "emoji": true
            }
        }
    ],
}`;
}
exports.getView = getView;
