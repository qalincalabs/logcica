function getSuccessMessage(shipmentId, tourName, tourId) {
  const block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":white_check_mark: Envoi #" +
          shipmentId +
          " assigné avec succès à la tournée : " +
          tourName,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Voir le tour",
            emoji: true,
          },
          value: `${tourId}`,
          action_id: "tourRecapButton",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Fermer",
            emoji: true,
          },
          value: `${tourId}`,
          action_id: "close",
        },
      ],
    },
  ];

  return block;
}
exports.getSuccessMessage = getSuccessMessage;