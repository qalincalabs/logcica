//Vue faisant apparaître la liste des tours
const graphQlRequest = require("../graphQlRequest.js");

async function getView(id) {
  const { data } = await graphQlRequest.fetchTour();

  const tourList = data.data.tours.map((e, i) => ({ text: e.name, value: i }));
  const optionSelect = tourList.map((t) => ({
    text: {
      type: "plain_text",
      text: "t.text",
      emoji: true,
    },
    value: "value-" + t.value,
  }));

  const view = {
    type: "modal",
    callback_id: "view_1",
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
    blocks: [
      {
        type: "input",
        block_id: id,
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Choisissez une tournée",
            emoji: true,
          },
          options: optionSelect,
          action_id: "static_select-action",
        },
        label: {
          type: "plain_text",
          text: `:rocket: Ajouter la livraison ${id} à une tournée`,
          emoji: true,
        },
      },
    ],
  };

  return view;
}
exports.getView = getView;
