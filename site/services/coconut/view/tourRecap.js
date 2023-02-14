//Vue apparaissant quand on ajoute avec succèes un shipment dans un tour (après validation par optim)
const graphQlRequest = require("../graphQlRequest.js");

function stopViewItem(tourData, t) {
  const estimatedTimeOfArrival = t.estimatedTimeOfArrival.slice(11, 16);
  const stopName = t.name ?? "Emplacement inconnu";

  function getTextContent() {
    if (t.geo?.coordinates != null) {
      const coordinates = `${t.geo.coordinates[1]},${t.geo.coordinates[0]}`;
      const link = `<http://www.google.com/maps/place/?q=${coordinates}|${stopName}>`;
      const deliveryOut = (t.delivery?.shipments && "\n\t\t*out*") || "";
      const pickupIn = (t.pickup?.shipments && "\n\t\t*in*") || "";

      console.log(tourData.shipments)
      
      const deliveryId =
        t.delivery?.shipments
          .map((s) => tourData.shipments.find((sh) => sh._id == s).key)
          .join(",") ?? "";
      const pickupId =
        t.pickup?.shipments
          .map((s) => tourData.shipments.find((sh) => sh._id == s).key)
          .join(",") ?? "";

      return `:round_pushpin: ${estimatedTimeOfArrival} : ${link} ${deliveryOut} ${deliveryId} ${pickupIn} ${pickupId}`;
    } else {
      return `${estimatedTimeOfArrival} : ${stopName}`;
    }
  }

  const view = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: getTextContent(),
    },
  };
  return view;
}

async function getView(tourId) {
  const { data } = await graphQlRequest.getTourData(`${tourId}`);
  const tourData = data.data.tours[0];
  
  console.log(tourData)

  // Création d'un bloc d'affichage des stops de la tournée
  var blockStopList = "";
  if (tourData.stops != null) {
    const stopList = tourData.stops.map((e) => e);
    blockStopList = stopList.map((t) => stopViewItem(tourData, t));
  }

  const tempArray = [...tourData.stops];
  const origin = tempArray.shift();
  const destination = tempArray.pop();
  const waypoints = tempArray
    ?.map((e) => e.geo.coordinates.reverse())
    .join("%7C");

  const destinationLongitude = destination.geo.coordinates[1];
  const destinationLatitude = destination.geo.coordinates[0];
  const originLongitude = origin.geo.coordinates[1];
  const originLatitude = origin.geo.coordinates[0];

  const mapsStopsLink = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<https://www.google.com/maps/dir/?api=1&origin=${originLongitude},${originLatitude}&destination=${destinationLongitude},${destinationLatitude}&travelmode=driving&waypoints=${waypoints} | :arrow_right: Itinéraire complet>`,
    },
  };

  const tourDistance = Math.floor(tourData.distance?.value ?? "");
  const tourDistanceUnit = tourData.distance?.unit?.symbol ?? "";
  const tourDurationHour = Math.floor(tourData.duration?.value ?? "");
  const tourDurationSecond = Math.floor(
    (tourData.duration?.value - Math.floor(tourData.duration?.value)) * 60
  );
  const vehicleName = tourData.vehicle?.name ?? "";
  const vehicleBrand = tourData.vehicle?.brand?.name ?? "";
  const vehicleModel = tourData.vehicle?.model?.name ?? "";

  const view = {
    type: "modal",
    title: {
      type: "plain_text",
      text: `:truck: ${tourData.name}`,
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    type: "modal",
    close: {
      type: "plain_text",
      text: "Ok",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:checkered_flag: *${tourDistance}${tourDistanceUnit}* :hourglass: *${tourDurationHour}h${tourDurationSecond}* :oncoming_automobile: ${vehicleName} ${vehicleBrand} (${vehicleModel})`,
        },
      },
      {
        type: "divider",
      },
    ],
  };

  view.blocks.push(mapsStopsLink);
  view.blocks.push({ type: "divider" });
  view.blocks.push(...blockStopList);

  return view;
}

exports.getView = getView;
