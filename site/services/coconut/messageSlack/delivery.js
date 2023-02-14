async function getDeliveryMessage(tourId) {
  const graphQlRequest = require("../graphQlRequest.js");
  const { data } = await graphQlRequest.getTourData(tourId);
  const tourData = data.data.tours[0];

  function stopTextItem(tourData, t) {
    const estimatedTimeOfArrival = t.estimatedTimeOfArrival.slice(11, 16);
    const stopName = t.name ?? "Emplacement inconnu";

    function getTextContent() {
      if (t.geo?.coordinates != null) {
        const coordinates = `${t.geo.coordinates[1]},${t.geo.coordinates[0]}`;
        const link = `<www.google.com/maps/place/?q=${coordinates}|${stopName}>`;
        const deliveryOut = (t.delivery?.shipments && "\n\t\t*out*") || "";
        const pickupIn = (t.pickup?.shipments && "\n\t\t*in*") || "";

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

      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Etape validée",
          emoji: true,
        },
        value: `${t.order},${tourId}`,
        action_id: "stepDone",
      },
    };
    return view;
  }

  var blockStopList = "";

  if (tourData.stops != null) {
    const stopList = tourData.stops.map((e) => e);
    blockStopList = stopList.map((t) => stopTextItem(tourData, t));
  }

  const tourDistance = Math.floor(tourData.distance?.value ?? "");
  const tourDistanceUnit = tourData.distance?.unit?.symbol ?? "";
  const tourDurationHour = Math.floor(tourData.duration?.value ?? "");
  const tourDurationSecond = Math.floor(
    (tourData.duration?.value - Math.floor(tourData.duration?.value)) * 60
  );
  const vehicleName = tourData.vehicle?.name ?? "";
  const vehicleBrand = tourData.vehicle?.brand?.name ?? "";
  const vehicleModel = tourData.vehicle?.model?.name ?? "";

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
      text: `<www.google.com/maps/dir/?api=1&origin=${originLongitude},${originLatitude}&destination=${destinationLongitude},${destinationLatitude}&travelmode=driving&waypoints=${waypoints} | :arrow_right: Itinéraire complet>`,
    },
  };

  const tourRecap = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:truck: ${tourData.name} \n :checkered_flag: *${tourDistance}${tourDistanceUnit}* :hourglass: *${tourDurationHour}h${tourDurationSecond}* :oncoming_automobile: ${vehicleName} ${vehicleBrand} (${vehicleModel})`,
    },
  };

  var deliveryBlock = [];
  deliveryBlock.push(tourRecap);
  deliveryBlock.push({ type: "divider" });
  deliveryBlock.push(...blockStopList);
  deliveryBlock.push({ type: "divider" });
  deliveryBlock.push(mapsStopsLink);

  return deliveryBlock;
}
exports.getDeliveryMessage = getDeliveryMessage;
