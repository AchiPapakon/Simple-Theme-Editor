**How to install:**
1. Run `npm install`
2. Run `npm run dev` for development build or `npm run pro` for production build.
3. Launch a browser and go to `localhost:3000`

**Get Started:**
1. Click on an attribute row to show the inline editor
2. Change your value in the input. Other attribute reference works e.g' '{sizes.borderWidth}px solid black'
3. Press 'Enter' or click on the button 'OK'.
4. (Optional): Click on 'Save' to save the Theme Editor state to the browser's memory or click on 'Reset' to reset the values back to default.

**Functional notes:**
* /!\ In an 'em' or 'px' field, when the user types a new numeric value, then 'em' or 'px' is automatically appended in the UI. If it's a non-numeric value, then nothing is appended.
* When entering an attribute, it checks if there are any open or misplaced parentheses, brackets or curly brackets, or self-reference.
* When the user clicks on the button 'Save', then the current state of the simple theme editor is saved to local storage.
* When the user clicks on the button 'Reset', then the local storage is cleared and the values in the fields are reset.
* The application supports limitless referencing to attributes by brackets.
* The application supports keyboard navigation using Tab, Enter & Escape.
* Changing the attributes in the theme editor, doesn't change its own elements.
* The 'simple theme editor' and the playground components are responsive for small devices.
* On each inline textbox, there is automatic validation after 300 ms of inactivity

**Technical notes:**
* When you want to use an attribute style, you should always call the function `getStyle` and pass as argument the whole attribute object
* **File Structure:**
* - css/SimpleThemeEditor.sass Contains the css
* - css/Playground.sass Contains the css for the Playground
* - js/Helper.js Contains the auxiliary functions used by the application
* - jsx/App.jsx The entry point of the application
* - jsx/SimpleThemeEditor.jsx It's the main application and contains the main class 'Outline'
* - jsx/InlineEditor.jsx It's the inline editor which appears when the user clicks on an attribute to change it
* - jsx/Playground.jsx The section where all the CSS changes are applied
* - jsx/Styles.jsx Contains the styles for the components that are directly modified by the 'Simple Theme Editor'
* **Potential future extensions:**
* - Localization support
