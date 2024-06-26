Code with `JSDoc` support + `Vitest` + `Typescript`-type checks.

Use `Clasp` to store.

Deploy into **compatible ES-5 code**

# Make your copy

#### 1. Clone the Repository
You can clone either the original repository or your fork.

1. **Open your terminal** (like Powershell).
2. Navigate to folder you want with `cd` command
   
    Sample code:

     ```
     cd C:\Users\Asus\Documents\CoolTables
     ```

3. **Clone the repository**:
   ```sh
   git clone https://github.com/Max-Makhrov/AppsScriptBase.git YourNewProjectName
   ```

4. **Navigate into the cloned directory**:
   ```sh
   cd YourNewProjectName
   ```

#### 3. Customize for Your New Project

1. **Open the project in your preferred code editor**.
    
    ```
    code .
    ```

#### 4. Initiate the project

1. **npm init**

    Create shortcut commands for terminal:
    
    [Ctrl]+[Shift]+[P] => search
    
    Search for 
    `
    Open Keyboard Shortcuts (JSON)
    `
    
    Add this command:
    
    ```
    {
      "key": "ctrl+alt+n",
      "command": "workbench.action.terminal.sendSequence",
      "args": {
        "text": "& {npm init -y; npm install; Add-Content -Path '.gitignore' -Value '.history/'}"
      }
    }
    ```

    Now you can use [ctrl+alt+n] shortcut in terminal and run the installation command!
    
    ".history/' is for those (like me), using "gistory" add-on, and willing to ignore it.

2. Test `build` works

    ```
    npm run build
    ```
    should work fine and update `.dist/`

3. **Update `README.md`**:
4. **Commit and push your changes**:
   ```sh
   git add .
   git commit -m "Initial customization for new project"
   git push
   ```

#### 5. Set Up `Clasp`

1. Install (`npm install -g @google/clasp`) → login (clasp login)
2. `clasp create --title "My Project" --type standalone`
3. Create a clasp project: `clasp create --title "AppScriptES5" --type standalone`
4. Change root dir in `clasp.json` to `"rootDir":".\\dist"`
5. Delete `appsscript.json` from main folder, `\dist` already has it
6. `clasp push` → `clasp open`

#### 6. Set Up a New Repository for Your New Project

1. (optional) `git remote remove origin`

2. **Create a new repository** on GitHub:
   Go to GitHub, click the '+' icon in the upper right corner, and select 'New repository'..

3. Follow commands in github panel

