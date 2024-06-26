Code with `JSDoc` support + `Vitest` + `Typescript`-type checks.

Use `Clasp` to store.

Deploy into **compatible ES-5 code**

# Make your copy

## Use this template
Use the green **"Use this template"** button at the top.

## Clone the Repository
You can clone either the original repository or your fork.

1. **Open your terminal** (like Powershell).
2. Navigate to folder you want with `cd` command
   
    Sample code:

     ```
     cd C:\Users\Asus\Documents\CoolTables
     ```

3. **Clone the repository**:
   ```sh
   git clone https://github.com/YOU/YourRepo.git YourNewProjectName
   ```

4. **Navigate into the cloned directory**:
   ```sh
   cd YourNewProjectName
   ```

## Customize for Your New Project

1. **Open the project in your preferred code editor**.
    
    ```
    code .
    ```

## Initiate the project

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
    
    ".history/' is for those (like me), using "history" add-on, and willing to ignore it.

## Set Up `Clasp`

1. Install (`npm install -g @google/clasp`) → login (**`clasp login`**)
2. Create a clasp project: `clasp create --title "My Project" --type standalone`
3. Change root dir in `clasp.json` to `"rootDir":".\\dist"`
4. Delete `appsscript.json` from main folder, `\dist` already has it
5. `npm run build` should work fine and update `.dist/`
6. `clasp push` → `clasp open`

## Optional
    
1. **Update `README.md`**:
2. **Commit and push your changes**:
   ```sh
   git add .
   git commit -m "Initial customization for new project"
   git push
   ```


## Set Up a New Repository for Your New Project

```
git add .
git commit -m "Who cares"
git push origin master
```

get remote URL

```
git remote get-url origin
```