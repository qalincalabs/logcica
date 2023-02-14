//Vue faisant apparaître le formulaire de création de tour

const graphQlRequest = require("../graphQlRequest.js");
const moment = require("moment-timezone");

async function getView(channel) {
  const now = new Date();

  const initial_day = moment().tz("Europe/Brussels").format("YYYY-MM-DD");
  const initial_time = moment().tz("Europe/Brussels").format("HH:mm");

  //On récupère l'id du workspace correspondant au channel slack
  const workspaceId = (await graphQlRequest.findWorkspaceId(channel)).data.data
    .workspace._id;

  //On récupère la liste des véhicules appartenant à un workspace donné (celui du channel slack)
  const { data } = await graphQlRequest.fetchVehicles(workspaceId);
  
  const vehiclesList = data.data.vehicles.map((e) => ({ vehicle: e }));

  const vehicleSelect = vehiclesList.map((t) => ({
    text: {
      type: "plain_text",
      text: `${t.vehicle.name ?? ""}  (${t.vehicle.brand?.name ?? ""} ${
        t.vehicle.model?.name ?? ""
      })`
        .replace("  ", " ")
        .replace("  (", "("),
      emoji: true,
    },
    value: t.vehicle._id,
  }));

  const view = {
    type: "modal",
    callback_id: "createdTourPayback",
    title: {
      type: "plain_text",
      text: "Créer une tournée",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [
      {
        type: "input",
        block_id: "choix_nom",
        element: {
          type: "plain_text_input",
          action_id: "plain_text_input-action",
          placeholder: {
            type: "plain_text",
            text: "Veuillez choisir un nom",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Donner un nom à la tournée :",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        block_id: "choix_date",
        text: {
          type: "mrkdwn",
          text: "Veuillez choisir une date : ",
        },
        accessory: {
          type: "datepicker",
          initial_date: initial_day,
          placeholder: {
            type: "plain_text",
            text: "Select a date",
            emoji: true,
          },
          action_id: "datepicker-action",
        },
      },
      {
        type: "section",
        block_id: "choix_time",
        text: {
          type: "mrkdwn",
          text: "Veuillez choisir une heure :",
        },
        accessory: {
          type: "timepicker",
          initial_time: initial_time,
          placeholder: {
            type: "plain_text",
            text: "Select time",
            emoji: true,
          },
          action_id: "timepicker-action",
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        optional: true,
        block_id: "choix_vehicle",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Choisissez un véhicule",
            emoji: true,
          },
          options: vehicleSelect,
          action_id: "vehicleSelection-action",
        },
        label: {
          type: "plain_text",
          text: "Choix du véhicule",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        block_id: workspaceId,
        text: {
          type: "mrkdwn",
          text: `Le propriétaire de la tournée est *${channel}*.`,
        },
      },
    ],
  };

  console.log(JSON.stringify(view));

  return view;
}
exports.getView = getView;
