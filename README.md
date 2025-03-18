# litium-storefront-env

A wrapper for litium-storefront CLI tool that uses an .env file for options input.  
The wrapper handles running the proxy and importing/exporting field and fieldtemplate definitions

## Prerequisites

Before using `litium-storefront-env`, ensure that you have the following installed:

**Requirements**
* **Node.js** version **20.x+**
* **litium-storefront** CLI tool from [Litium](https://litium.com)

## Installation

```bash
npm install litium-storefront-env
```

## Usage

Export `.env.template` file
```bash
litium-storefront-env export-template
```

Run Litium proxy
```bash
litium-storefront-env proxy -e .env.test
```

Import definitions to Litium instance
```bash
litium-storefront-env import -e .env.test
```

Export definitions from Litium instance
```bash
litium-storefront-env export -e .env.test
```

## Env parameters

The generated template contains the following parameters

```env
# Url to Litium backend (for proxy and import/export)
LITIUM=
# Url to Litium storefront (for proxy)
STOREFRONT=
# Custom port for exposed frontend (for proxy, default value 3001)
PORT=

# Username for importing/exporting definitions (for import/export)
LITIUM_USERNAME=
# Password for importing/exporting definitions (for import/export)
LITIUM_PASSWORD=
```

## License

This project is released under the MIT License.

## Contributing

Feel free to contribute by sending a Pull Request.
