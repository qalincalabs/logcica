function getAssignMessage(shipmentId, tourName) {
  const block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":gear: Envoi #" +
          shipmentId +
          " en cours d'assignation à " +
          tourName,
      },
    },
  ];

  return block;
}
exports.getAssignMessage = getAssignMessage;
