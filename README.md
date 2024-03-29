# logCiCa

Headless short food system logistic platform used by [Coconut](https://github.com/qalincalabs/coconut), [Koala](https://github.com/qalincalabs/koala) and [Cockpit](https://github.com/qalincalabs/cockpit)

Powered by mongoDB Atlas. You can [explore the model](/data_sources/mongodb-atlas/logcica) (json schema) or have a look at the [generated graphQL](/logcica-schema.graphql).

[Status](https://docs.google.com/spreadsheets/d/1Hinnt_VSZFGCe-0SFNRxKkSsytXf2aDYnp6gYdiVJ0I/edit#gid=2147257119)

[Latest slides](/docs/logcica-comac-2022-06.pdf)

![platform schema](/docs/images/logcica-platform-schema-2022-05.png)

## Concepts the platform understands

* shipment and shipping method
* tour and tour draft
* place and area
* vehicle
* workspace
* order
* product, product category, product classification (linked to category)
* catalog and catalog item
* code and code lists (such country iso codes, allergen gs1 codes)
* sales session
* inventory item
* offer
* transactionnel channel
* customer
* supplier

[json schema](https://github.com/qalincalabs/logcica/tree/main/data_sources/mongodb-atlas/logcica)

## Concepts the platform will soon understand :)

* carrier
* carrier profile, shipper profile, producer profile
* transport demand, transport offer


