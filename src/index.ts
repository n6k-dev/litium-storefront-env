#! /usr/bin/env node

const { Command } = require('commander');
const figlet = require('figlet');
const dotenvx = require('@dotenvx/dotenvx');
const spawn = require('child_process').spawn;
const isInstalled = require('is-program-installed');

const fs = require('fs');

const initializeEnvOptions = (options: any) => {
    if (!options.env) {
        console.log("Env option missing!");
        process.exit(1);
    }

    dotenvx.config({ path: [options.env], quiet: true });
};

const runProcess = (processParameters: string[]) => {
    const proxyProcess = spawn('litium-storefront', processParameters, { shell: true });
    proxyProcess.stdout.on(
        'data', 
        function (data: any) {
            console.log(data.toString());
        });
};

const addRunProxyCommand = (program: any) => {
    program
        .command("proxy")
        .description("Start Litium proxy")
        .option("-e, --env [env]", "Path to env-file", ".env")
        .action((options: any) => {
            initializeEnvOptions(options);
                
            const processParameters: string[] = [
                'proxy',
                '--litium',
                process.env.LITIUM || process.env.RUNTIME_LITIUM_SERVER_URL || '',
                '--storefront',
                process.env.STOREFRONT || 'http://localhost:3000'
            ];
            if (process.env.PORT) {
                processParameters.push('--port', process.env.PORT);
            }
        
            runProcess(processParameters);
        });
};

const addImportDefinitionsCommand = (program: any) => {
    program
        .command("import")
        .description("Import field and fieldtemplate definitions")
        .option("-e, --env [env]", "Path to env-file", ".env")
        .action((options: any) => {
            initializeEnvOptions(options);

            const processParameters: string[] = [
                'definition',
                'import',
                '--file',
                'definitions/**/*.yaml',
                '--litium',
                process.env.LITIUM || '',
                '--litium-username',
                process.env.LITIUM_USERNAME || '',
                '--litium-password',
                process.env.LITIUM_PASSWORD || ''
            ];

            runProcess(processParameters);
        });
};

const addExportDefinitionsCommand = (program: any) => {
    program
        .command("export")
        .description("Export field and fieldtemplate definitions")
        .option("-e, --env [env]", "Path to env-file", ".env")
        .action((options: any) => {
            initializeEnvOptions(options);
                
            const processParameters: string[] = [
                'definition',
                'export',
                '--output',
                'definitions',
                '--litium',
                process.env.LITIUM || '',
                '--litium-username',
                process.env.LITIUM_USERNAME || '',
                '--litium-password',
                process.env.LITIUM_PASSWORD || '',
                '--clean'
            ];

            runProcess(processParameters);
        });
};


const addCreateTemplateCommand = (program: any) => {
    program
        .command("env-template")
        .description("Create an .env template file")
        .action(() => {
            const envTemplate = `# Env template file

# Url to Litium backend (for proxy and import/export)
LITIUM=
# Url to Litium storefront (for proxy)
STOREFRONT=
# Custom port for exposed frontend (for proxy, default value 3001)
PORT=

# Username for importing/exporting definitions (for import/export)
LITIUM_USERNAME=
# Password for importing/exporting definitions (for import/export)
LITIUM_PASSWORD=`;
    
            try {
                fs.writeFileSync(".env.template", envTemplate);
            } catch (err) {
                console.error("An error occured creating the template file", err);
            }

            console.log("ENV template exported!");
        });
};

const program = new Command();

console.log(figlet.textSync("Litium Storefront Env"));

if (!isInstalled('litium-storefront')) {
    console.error("\nlitium-storefront CLI tool is required but is missing/not installed!");
    process.exit(1);
}

program
    .name("litium-storefront-env")
    .version("1.0.0")
    .description("A wrapper for Litium Storefront CLI tool using an env-file for options.");

addRunProxyCommand(program);
addImportDefinitionsCommand(program);
addExportDefinitionsCommand(program);
addCreateTemplateCommand(program);

program.parse();
