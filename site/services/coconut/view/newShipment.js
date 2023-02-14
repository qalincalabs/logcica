//Simulation de reception d'une commande
function getView (){
  
return `
[
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": ":coconut: Nouvel envoi !",
				"emoji": true
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": "*Numéro :* 62de5d718ca6f90d33673210",
				},
				{
					"type": "mrkdwn",
					"text": "*Masse :* 4Kg"
				},
				{
					"type": "mrkdwn",
					"text": "*Lieu :* Qalinca-Lab"
				},
				{
					"type": "mrkdwn",
					"text": "*Date :* 27/06/22  "
				}
			]
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Assigner à une tournée",
						"emoji": true
					},
					"value": "62de5d718ca6f90d33673210",
					"action_id": "assignButton"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Marquer comme livré",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "actionId-1"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Annuler la livraison",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "actionId-2"
				}
			]
		}
	]`
}

exports.getView = getView;