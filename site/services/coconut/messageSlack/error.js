function getErrorMessage(shipmentId, tourName) {
  const block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":mega: Erreur lors de l'assignation de l'envoi #" +
          shipmentId +
          " à la tournée : " +
          tourName +
          " Motif : *inconnu*",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Assigner à une autre tournée",
            emoji: true,
          },
          value: shipmentId,
          action_id: "assignButton",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Marquer comme livré",
            emoji: true,
          },
          value: "click_me_123",
          action_id: "actionId-1",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Annuler la livraison",
            emoji: true,
          },
          value: "click_me_123",
          action_id: "actionId-2",
        },
      ],
    },
  ];

  return block;
}
exports.getErrorMessage = getErrorMessage;
