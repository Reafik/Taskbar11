# Quick Start Guide

This guide will help you get Design Context Pro up and running in minutes.

## Step 1: Install Dependencies

```bash
cd design-context-pro

# Install Figma plugin dependencies
cd figma-plugin
npm install
npm run build

# Install web app dependencies
cd ../web-app/client
npm install

cd ../server
npm install
```

## Step 2: Start the Backend Server

```bash
cd web-app/server
npm run dev
```

Server will start on `http://localhost:5000`

## Step 3: Start the Frontend

Open a new terminal:

```bash
cd web-app/client
npm run dev
```

Web app will start on `http://localhost:3000`

## Step 4: Load the Figma Plugin

1. Open Figma Desktop App
2. Navigate to: **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file from the `figma-plugin` directory
4. The plugin is now loaded!

## Step 5: Generate an API Key

1. Open `http://localhost:3000` in your browser
2. Click the **"Generate API Key"** button
3. Copy the generated API key
4. Keep it safe - you'll need it to sync from Figma

## Step 6: Use the Plugin

1. In Figma, open any file with components
2. Go to **Plugins** → **Development** → **Design Context Pro**
3. Select a component in your Figma file
4. In the plugin:
   - Switch to the **"Edit"** tab
   - Add title, description, and usage information
   - Click **"Create Context"**
5. Switch to **"All Contexts"** tab
6. Paste your API key and click **"Sync to Server"**

## Step 7: View on the Web

1. Go back to `http://localhost:3000`
2. Refresh the page
3. You should see your synced design system!
4. Click on any component to view its documentation

## Troubleshooting

### Plugin won't load in Figma
- Make sure you ran `npm run build` in the figma-plugin directory
- Check that the `dist` folder contains `code.js` and `ui.html`

### Web app won't connect to server
- Verify the server is running on port 5000
- Check the browser console for errors
- Make sure no firewall is blocking the connection

### Sync fails
- Verify your API key is correct
- Check that the server is running
- Look at the browser network tab for error details

## Next Steps

- Read the full [README.md](README.md) for more details
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Explore the codebase and customize it for your needs

## Need Help?

Open an issue on GitHub if you encounter any problems!
