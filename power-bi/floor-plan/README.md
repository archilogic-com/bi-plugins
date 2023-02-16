# PowerBI plugin

Archilogic PowerBI plugin

## Getting started

### Frontend

1. Install pbiviz globally

   ```bash
   npm install -g powerbi-visuals-tools
   ```
   For more details on [environment setup](https://learn.microsoft.com/en-us/power-bi/developer/visuals/environment-setup).

2. Install dependencies

  ```bash
   npm install
   ```

3. Build plugin in development mode

   ```bash
   pbiviz start
   ```

4. Navigate to https://localhost:8080/assets, and authorize your browser to use this address.

5. Create a report on PowerBI web app or Desktop, and from the Visualizations pane, select the Developer Visual.

6. Provide Archilogic Publishable Token and Floor ID to the Format Pane under Archilogic Plugin.
