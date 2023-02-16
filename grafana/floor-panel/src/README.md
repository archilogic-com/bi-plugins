<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin -->

# Archilogic Floor Panel plugin

This document provides an overview of the Archilogic plugin for Grafana, including installation and configuration instructions, and an explanation of how to use the plugin in order to better visualize your data.

## Introduction

The Archilogic plugin for Grafana gives users the ability to load floor plans stored in Archilogic within Grafana dashboards, map information from data sources to elements in space, and visualize information on floor plans.

The plugin provides a range of features including the ability to customize visualization styles, interact with the model using touch or mouse controls, and use entities in the floor plan to filter information in other Grafana components. The plugin uses Archilogic’s Floor Plan Engine SDK, which you can find more details about below.

## Requirements

Grafana 8.2.0+

## Installation

Use the grafana-cli tool to install from the command line:

```jsx
grafana-cli plugins install archilogic-floor-panel
```

Navigate to Grafana in your browser and log in. Go to the plugin list, search for Archilogic Floor Plan Application, and enable the plugin.

Provide floor ID and publishable token, or use the default ones.

Configure a datasource.

## Documentation

You can find more information about the Archilogic Floor Plan SDK, including documentation and examples, in the following places:

- [Floor Plan Engine](https://developers.archilogic.com/floor-plan-engine/guide.html)
- [Built with Archilogic](https://www.archilogic.com/resources)
- [Knowledge base](https://help.archilogic.com/knowledge)

## Development

If you are interested in developing and contributing to this project, check out the git repository [here](https://github.com/archilogic-com/bi-plugins/tree/main/grafana/floor-panel).

## License

Apache License Version 2.0, see LICENSE.